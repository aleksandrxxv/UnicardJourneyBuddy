import { planSampleJourney, type Journey } from '@journeybuddy/shared';
import { useEffect, useState } from 'react';
import { DEMO_START_LOCATION, inCoverageArea } from '@/constants/demo';
import { useProfile } from '@/profile/ProfileContext';
import type { Place } from '@/profile/types';
import { api } from '@/services/api';
import { useStartLocation } from './useStartLocation';

export type JourneySource = 'live' | 'sample';

interface Result {
  journey: Journey;
  source: JourneySource;
  loading: boolean;
  /** True when the phone is outside Birmingham, so the trip starts from Home instead (for testing). */
  startsFromHome: boolean;
}

// Plan trip and Route ask for the same journey; keep the answer so both screens agree.
const cache = new Map<string, { journey: Journey; source: JourneySource }>();

/**
 * Real journey from the API (OpenTripPlanner, ADR-0002). Shows the sample journey while
 * loading and if the API can't be reached, so the app always has something to show.
 */
export function useJourney(place: Place, time: Date, mode: 'leaveAt' | 'arriveBy'): Result {
  const here = useStartLocation();
  const { profile } = useProfile();
  const home = profile?.places.find((p) => p.icon === 'home');
  const startsFromHome = !inCoverageArea(here);
  const from = startsFromHome ? (home && home.id !== place.id ? home.location : DEMO_START_LOCATION) : here;
  // Re-ask at most once a minute, so "Leave now" doesn't refetch on every clock tick.
  const minute = Math.floor(time.getTime() / 60_000);
  const key = `${place.id}|${minute}|${mode}|${from.lat.toFixed(3)},${from.lng.toFixed(3)}`;
  const [result, setResult] = useState(cache.get(key));
  const [loading, setLoading] = useState(!cache.has(key));

  useEffect(() => {
    const cached = cache.get(key);
    if (cached) {
      setResult(cached);
      setLoading(false);
      return;
    }
    let active = true;
    setLoading(true);
    api
      .searchJourney({
        from,
        to: place.location,
        destinationLabel: place.label,
        time: new Date(minute * 60_000).toISOString(),
        arriveBy: mode === 'arriveBy',
      })
      .then(({ journey, source }) => ({ journey: { ...journey, destinationId: place.id }, source }))
      .catch(() => ({ journey: planSampleJourney(from, place.location, place, time, mode), source: 'sample' as const }))
      .then((r) => {
        cache.set(key, r);
        if (active) {
          setResult(r);
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
    // `key` covers place, minute, mode and start location.
  }, [key]);

  return {
    journey: result?.journey ?? planSampleJourney(from, place.location, place, time, mode),
    source: result?.source ?? 'sample',
    loading,
    startsFromHome,
  };
}

import type { Coordinates } from '@journeybuddy/shared';
import { useEffect, useState } from 'react';
import { DEMO_START_LOCATION } from '@/constants/demo';
import { getStartLocation } from '@/services/location';

/** Where the trip starts: the phone's location once known, the demo point until then. */
export function useStartLocation(): Coordinates {
  const [location, setLocation] = useState(DEMO_START_LOCATION);
  useEffect(() => {
    let active = true;
    getStartLocation().then((l) => active && setLocation(l));
    return () => {
      active = false;
    };
  }, []);
  return location;
}

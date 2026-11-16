import type { Coordinates, Journey, JourneyLeg } from '@journeybuddy/shared';

// Mock only: a fixed walk → bus 45 → walk → bus 33 → walk pattern, matching the
// Figma route screen. Replace with the real transport provider (ADR-0002).

const MINUTE = 60_000;

function between(a: Coordinates, b: Coordinates, t: number): Coordinates {
  return { lat: a.lat + (b.lat - a.lat) * t, lng: a.lng + (b.lng - a.lng) * t };
}

type Mode = 'leaveAt' | 'arriveBy';

export function planMockJourney(
  from: Coordinates,
  to: Coordinates,
  destination: { id: string; label: string },
  time: Date,
  mode: Mode = 'leaveAt',
): Journey {
  // Durations in minutes for each leg, and the waits before buses.
  const plan = [
    { mode: 'walk', minutes: 1 },
    { mode: 'bus', minutes: 35, waitBefore: 0 },
    { mode: 'walk', minutes: 3 },
    { mode: 'bus', minutes: 11, waitBefore: 3 },
    { mode: 'walk', minutes: 3 },
  ] as const;
  const total = plan.reduce((sum, l) => sum + l.minutes + ('waitBefore' in l ? l.waitBefore : 0), 0);

  const start = new Date(
    Math.ceil((mode === 'arriveBy' ? time.getTime() - total * MINUTE : time.getTime() + 2 * MINUTE) / MINUTE) * MINUTE,
  );

  const points = [from, between(from, to, 0.05), between(from, to, 0.7), between(from, to, 0.72), between(from, to, 0.97), to];
  const details: Omit<JourneyLeg, 'mode' | 'from' | 'to' | 'departureTime' | 'arrivalTime'>[] = [
    { instruction: 'Walk to the stop', stopName: 'Meadowsweet Avenue' },
    { instruction: 'Bus 45', lineName: '45', towards: 'Moor Street Queensway', stopName: 'Moor Street Queensway (MS8)', stopsCount: 32 },
    { instruction: 'Walk to the next stop', stopName: 'High Street (BS16)' },
    { instruction: 'Bus 33', lineName: '33', towards: 'Six Ways Aston', stopName: 'Six Ways Aston', stopsCount: 9 },
    { instruction: `Walk to ${destination.label}` },
  ];

  let t = start.getTime();
  const legs: JourneyLeg[] = plan.map((p, i) => {
    if ('waitBefore' in p) t += p.waitBefore * MINUTE;
    const departure = new Date(t);
    t += p.minutes * MINUTE;
    return {
      mode: p.mode,
      from: points[i],
      to: points[i + 1],
      departureTime: departure.toISOString(),
      arrivalTime: new Date(t).toISOString(),
      ...details[i],
    };
  });

  return {
    id: `mock-${start.getTime()}`,
    destinationId: destination.id,
    legs,
    startTime: legs[0].departureTime,
    arrivalTime: legs[legs.length - 1].arrivalTime,
  };
}

import type { Coordinates } from '@journeybuddy/shared';

/** Used when location permission is denied or unavailable (e.g. in a simulator): Birmingham New Street. */
export const DEMO_START_LOCATION: Coordinates = { lat: 52.4778, lng: -1.8989 };

/** Area covered by the West Midlands bus timetables (ADR-0002). */
const COVERAGE = { minLat: 52.3, maxLat: 52.7, minLng: -2.2, maxLng: -1.55 };

export function inCoverageArea({ lat, lng }: Coordinates): boolean {
  return lat >= COVERAGE.minLat && lat <= COVERAGE.maxLat && lng >= COVERAGE.minLng && lng <= COVERAGE.maxLng;
}

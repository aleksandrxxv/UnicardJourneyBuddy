import type { Coordinates } from '@journeybuddy/shared';

// Until pairing with a parent account exists (US-16), the app runs as a fictional demo child.
export const DEMO_CHILD_ID = 'demo-child';
export const DEMO_CHILD_NAME = 'Sam';

/** Used when location permission is denied or unavailable (e.g. in a simulator). */
export const DEMO_START_LOCATION: Coordinates = { lat: 51.5308, lng: -0.1238 };

import type { Coordinates } from '@journeybuddy/shared';
import type { SwatchName } from '@/theme';

export type PlaceIcon = 'home' | 'school' | 'pool' | 'pin';

export interface Place {
  id: string;
  label: string;
  icon: PlaceIcon;
  postcode: string;
  city?: string;
  /** Street-level line shown under the title on "Plan trip", e.g. "Wheeler St, Lozells". */
  area?: string;
  location: Coordinates;
  photoUri?: string;
}

export interface Helper {
  id: string;
  name: string;
  phone: string;
  photoUri?: string;
}

export interface ChildProfile {
  name: string;
  phone: string;
  avatarUri?: string;
  colour: SwatchName;
  helpers: Helper[];
  places: Place[];
  /** Place ids of recent trips, newest first ("Go again"). */
  recentTrips: string[];
}

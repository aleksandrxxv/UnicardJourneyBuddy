// Core domain model for Journey Buddy. Kept deliberately small for the PoC;
// extend as the requirements specification (D3) and architecture document (D5) evolve.

export type TransportMode = 'walk' | 'bus' | 'tube' | 'train' | 'tram' | 'ferry';

export interface Coordinates {
  lat: number;
  lng: number;
}

/** A place a parent has approved for the child to travel to (e.g. School, Grandma's). */
export interface SavedDestination {
  id: string;
  label: string;
  icon?: string;
  location: Coordinates;
  address?: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  isPrimary: boolean;
}

/** One step of a journey, phrased so a child can follow it. */
export interface JourneyLeg {
  mode: TransportMode;
  instruction: string;
  from: Coordinates;
  to: Coordinates;
  departureTime: string; // ISO 8601
  arrivalTime: string; // ISO 8601
  lineName?: string;
  stopName?: string;
  stopsCount?: number;
}

export interface Journey {
  id: string;
  destinationId: string;
  legs: JourneyLeg[];
  startTime: string; // ISO 8601
  arrivalTime: string; // ISO 8601
}

export type JourneyStatus = 'planned' | 'in_progress' | 'completed' | 'help_requested' | 'cancelled';

export type JourneyEventType = 'started' | 'leg_completed' | 'arrived' | 'off_route' | 'sos';

export interface JourneyEvent {
  journeyId: string;
  type: JourneyEventType;
  timestamp: string; // ISO 8601
  location?: Coordinates;
}

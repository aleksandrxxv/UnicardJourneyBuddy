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
  /** Where the bus is heading, as shown on its front ("To Moor Street Queensway"). */
  towards?: string;
  stopName?: string;
  stopsCount?: number;
  /** Stops passed on a bus leg, in order (used to say "Get off in 3 stops"). */
  intermediateStops?: string[];
  /** Turn-by-turn steps on a walking leg ("Head west on Cowslip Cl"). */
  steps?: string[];
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

// --- API contracts ---

export interface PlanJourneyRequest {
  childId: string;
  destinationId: string;
  from: Coordinates;
}

/** Free search used by the app's own places (Figma design: children save their own places). */
export interface JourneySearchRequest {
  from: Coordinates;
  to: Coordinates;
  destinationLabel: string;
  /** ISO 8601. Defaults to now. */
  time?: string;
  arriveBy?: boolean;
}

export interface JourneySearchResponse {
  journey: Journey;
  /** 'live' = real timetables from OpenTripPlanner, 'sample' = mock fallback. */
  source: 'live' | 'sample';
}

export interface ApiError {
  error: string;
}

// --- Accounts & pairing (US-15, US-16) ---

export interface ChildProfile {
  id: string;
  name: string;
  pairedDevices: number;
}

export interface PairingCode {
  code: string;
  expiresAt: string; // ISO 8601
}

export type MeResponse =
  | { role: 'parent'; email?: string }
  | { role: 'child'; child: Pick<ChildProfile, 'id' | 'name'> }
  | { role: 'unpaired' };

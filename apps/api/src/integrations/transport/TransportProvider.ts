import type { Coordinates, Journey } from '@journeybuddy/shared';

export interface PlanOptions {
  /** Leave at (default) or arrive by this time. Defaults to now. */
  time?: Date;
  arriveBy?: boolean;
  /** Used in the last walking leg: "Walk to School". */
  destinationLabel?: string;
}

/**
 * Abstraction over the public transport data source (OpenTripPlanner, sample data).
 * Lets the provider be swapped without touching the rest of the API (ADR-0002).
 */
export interface TransportProvider {
  planJourney(from: Coordinates, to: Coordinates, options?: PlanOptions): Promise<Journey[]>;
}

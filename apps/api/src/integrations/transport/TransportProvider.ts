import type { Coordinates, Journey } from '@journeybuddy/shared';

/**
 * Abstraction over the public transport data source (TfL, OpenTripPlanner, mock data).
 * Lets the provider be swapped without touching the rest of the API.
 */
export interface TransportProvider {
  planJourney(from: Coordinates, to: Coordinates, departAt?: Date): Promise<Journey[]>;
}

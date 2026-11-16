import { planSampleJourney, type Coordinates, type Journey } from '@journeybuddy/shared';
import type { PlanOptions, TransportProvider } from './TransportProvider.js';

/** Sample Birmingham journey used when OpenTripPlanner is not running (ADR-0002). */
export class MockTransportProvider implements TransportProvider {
  async planJourney(from: Coordinates, to: Coordinates, options: PlanOptions = {}): Promise<Journey[]> {
    const label = options.destinationLabel ?? 'your destination';
    return [planSampleJourney(from, to, { id: '', label }, options.time ?? new Date(), options.arriveBy ? 'arriveBy' : 'leaveAt')];
  }
}

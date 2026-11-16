import type { Coordinates, Journey } from '@journeybuddy/shared';
import type { TransportProvider } from '../integrations/transport/TransportProvider.js';
import type { DestinationService } from './DestinationService.js';

export class DestinationNotApprovedError extends Error {}

export class JourneyService {
  constructor(
    private readonly transport: TransportProvider,
    private readonly destinations: DestinationService,
  ) {}

  /** Plans a journey, but only to a destination the parent approved (US-02). */
  async plan(childId: string, destinationId: string, from: Coordinates): Promise<Journey> {
    const destination = this.destinations.findApproved(childId, destinationId);
    if (!destination) throw new DestinationNotApprovedError(destinationId);

    const [best] = await this.transport.planJourney(from, destination.location);
    return { ...best, destinationId };
  }
}

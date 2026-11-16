import type { Coordinates, Journey } from '@journeybuddy/shared';
import { HttpError } from '../errors.js';
import type { TransportProvider } from '../integrations/transport/TransportProvider.js';
import type { AuthUser } from '../middleware/auth.js';
import type { ChildService } from './ChildService.js';

export class JourneyService {
  constructor(
    private readonly transport: TransportProvider,
    private readonly children: ChildService,
  ) {}

  /** Plans a journey, but only to a destination the parent approved (US-02). */
  async plan(user: AuthUser, childId: string, destinationId: string, from: Coordinates): Promise<Journey> {
    const destinations = await this.children.listDestinations(user, childId);
    const destination = destinations.find((d) => d.id === destinationId);
    if (!destination) throw new HttpError(403, 'Destination is not approved for this child');

    const [best] = await this.transport.planJourney(from, destination.location);
    return { ...best, destinationId };
  }
}

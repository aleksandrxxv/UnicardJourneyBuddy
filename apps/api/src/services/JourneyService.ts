import type { Coordinates, Journey, JourneySearchResponse } from '@journeybuddy/shared';
import { HttpError } from '../errors.js';
import type { PlanOptions, TransportProvider } from '../integrations/transport/TransportProvider.js';
import type { AuthUser } from '../middleware/auth.js';
import type { ChildService } from './ChildService.js';

export class JourneyService {
  constructor(
    private readonly live: TransportProvider,
    private readonly sample: TransportProvider,
    private readonly children: ChildService,
  ) {}

  /** Real timetables when OpenTripPlanner answers; otherwise a clearly labelled sample (ADR-0002). */
  async search(from: Coordinates, to: Coordinates, options: PlanOptions): Promise<JourneySearchResponse> {
    try {
      const [best] = await this.live.planJourney(from, to, options);
      if (best) return { journey: best, source: 'live' };
      console.warn('No live journey found (start or end may be outside the timetable area), using sample');
    } catch (err) {
      console.warn(`Live journey planning unavailable, using sample: ${(err as Error).message}`);
    }
    const [sample] = await this.sample.planJourney(from, to, options);
    return { journey: sample, source: 'sample' };
  }

  /** Plans a journey, but only to a destination the parent approved (US-02). */
  async plan(user: AuthUser, childId: string, destinationId: string, from: Coordinates): Promise<Journey> {
    const destinations = await this.children.listDestinations(user, childId);
    const destination = destinations.find((d) => d.id === destinationId);
    if (!destination) throw new HttpError(403, 'Destination is not approved for this child');

    const { journey } = await this.search(from, destination.location, { destinationLabel: destination.label });
    return { ...journey, destinationId };
  }
}

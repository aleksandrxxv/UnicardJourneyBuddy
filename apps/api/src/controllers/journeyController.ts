import type { JourneySearchRequest, PlanJourneyRequest } from '@journeybuddy/shared';
import type { Request, Response } from 'express';
import { HttpError } from '../errors.js';
import { currentUser } from '../middleware/auth.js';
import type { JourneyService } from '../services/JourneyService.js';

function isCoordinates(value: unknown): value is { lat: number; lng: number } {
  const c = value as { lat?: unknown; lng?: unknown } | null;
  return typeof c?.lat === 'number' && typeof c?.lng === 'number';
}

export function createJourneyController(journeys: JourneyService) {
  return {
    async plan(req: Request, res: Response) {
      const { childId, destinationId, from } = (req.body ?? {}) as Partial<PlanJourneyRequest>;
      if (typeof childId !== 'string' || typeof destinationId !== 'string' || !isCoordinates(from)) {
        throw new HttpError(400, 'childId, destinationId and from {lat, lng} are required');
      }
      res.json(await journeys.plan(currentUser(req), childId, destinationId, from));
    },

    /** Locations are used for this one search only and are not stored or logged. */
    async search(req: Request, res: Response) {
      const { from, to, destinationLabel, time, arriveBy } = (req.body ?? {}) as Partial<JourneySearchRequest>;
      if (!isCoordinates(from) || !isCoordinates(to)) throw new HttpError(400, 'from and to {lat, lng} are required');
      const when = time ? new Date(time) : new Date();
      if (Number.isNaN(when.getTime())) throw new HttpError(400, 'time must be an ISO 8601 date');
      res.json(
        await journeys.search(from, to, {
          time: when,
          arriveBy: arriveBy === true,
          destinationLabel: typeof destinationLabel === 'string' ? destinationLabel.slice(0, 40) : undefined,
        }),
      );
    },
  };
}

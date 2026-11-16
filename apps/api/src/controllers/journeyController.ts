import type { PlanJourneyRequest } from '@journeybuddy/shared';
import type { Request, Response } from 'express';
import { DestinationNotApprovedError, type JourneyService } from '../services/JourneyService.js';

function isCoordinates(value: unknown): value is { lat: number; lng: number } {
  const c = value as { lat?: unknown; lng?: unknown } | null;
  return typeof c?.lat === 'number' && typeof c?.lng === 'number';
}

export function createJourneyController(journeys: JourneyService) {
  return {
    async plan(req: Request<unknown, unknown, Partial<PlanJourneyRequest>>, res: Response) {
      const { childId, destinationId, from } = req.body ?? {};
      if (typeof childId !== 'string' || typeof destinationId !== 'string' || !isCoordinates(from)) {
        res.status(400).json({ error: 'childId, destinationId and from {lat, lng} are required' });
        return;
      }
      try {
        res.json(await journeys.plan(childId, destinationId, from));
      } catch (err) {
        if (err instanceof DestinationNotApprovedError) {
          res.status(403).json({ error: 'Destination is not approved for this child' });
          return;
        }
        throw err;
      }
    },
  };
}

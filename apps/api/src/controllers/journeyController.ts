import type { PlanJourneyRequest } from '@journeybuddy/shared';
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
  };
}

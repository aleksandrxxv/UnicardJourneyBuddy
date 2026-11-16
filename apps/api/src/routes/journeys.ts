import { Router } from 'express';
import type { createJourneyController } from '../controllers/journeyController.js';

export function journeysRouter(controller: ReturnType<typeof createJourneyController>) {
  const router = Router();
  router.post('/plan', controller.plan);
  return router;
}

/** Route search needs no account: it stores nothing and returns only public timetable data. */
export function journeySearchRouter(controller: ReturnType<typeof createJourneyController>) {
  const router = Router();
  router.post('/search', controller.search);
  return router;
}

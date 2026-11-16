import { Router } from 'express';
import type { createJourneyController } from '../controllers/journeyController.js';

export function journeysRouter(controller: ReturnType<typeof createJourneyController>) {
  const router = Router();
  router.post('/plan', controller.plan);
  return router;
}

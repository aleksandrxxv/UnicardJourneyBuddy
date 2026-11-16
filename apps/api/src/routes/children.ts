import { Router } from 'express';
import type { createChildController } from '../controllers/childController.js';

export function childrenRouter(controller: ReturnType<typeof createChildController>) {
  const router = Router();
  router.get('/:childId/destinations', controller.listDestinations);
  return router;
}

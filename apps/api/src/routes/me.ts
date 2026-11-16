import { Router } from 'express';
import type { createChildController } from '../controllers/childController.js';

export function meRouter(controller: ReturnType<typeof createChildController>) {
  const router = Router();
  router.get('/', controller.me);
  return router;
}

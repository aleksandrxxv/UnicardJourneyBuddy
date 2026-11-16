import { Router } from 'express';
import type { createChildController } from '../controllers/childController.js';

export function pairingRouter(controller: ReturnType<typeof createChildController>) {
  const router = Router();
  router.post('/claim', controller.claimPairingCode);
  return router;
}

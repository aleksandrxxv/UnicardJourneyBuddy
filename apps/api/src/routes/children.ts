import { Router } from 'express';
import type { createChildController } from '../controllers/childController.js';
import { requireParent } from '../middleware/auth.js';

export function childrenRouter(controller: ReturnType<typeof createChildController>) {
  const router = Router();
  router.get('/', requireParent, controller.list);
  router.post('/', requireParent, controller.create);
  router.get('/:childId/destinations', controller.listDestinations);
  router.post('/:childId/pairing-code', requireParent, controller.createPairingCode);
  router.delete('/:childId/devices', requireParent, controller.unpair);
  return router;
}

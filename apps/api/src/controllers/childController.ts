import type { Request, Response } from 'express';
import type { DestinationService } from '../services/DestinationService.js';

export function createChildController(destinations: DestinationService) {
  return {
    listDestinations(req: Request<{ childId: string }>, res: Response) {
      const list = destinations.listApproved(req.params.childId);
      if (!list) {
        res.status(404).json({ error: 'Child not found' });
        return;
      }
      res.json(list);
    },
  };
}

import type { Request, Response } from 'express';
import { HttpError } from '../errors.js';
import { currentUser } from '../middleware/auth.js';
import type { ChildService } from '../services/ChildService.js';

type ChildParams = { childId: string };

export function createChildController(children: ChildService) {
  return {
    async me(req: Request, res: Response) {
      res.json(await children.me(currentUser(req)));
    },

    async list(req: Request, res: Response) {
      res.json(await children.listChildren(currentUser(req)));
    },

    async create(req: Request, res: Response) {
      const name = typeof req.body?.name === 'string' ? req.body.name.trim() : '';
      if (!name || name.length > 40) throw new HttpError(400, 'Give the child a first name or nickname (max 40 characters)');
      res.status(201).json(await children.createChild(currentUser(req), name));
    },

    async listDestinations(req: Request<ChildParams>, res: Response) {
      res.json(await children.listDestinations(currentUser(req), req.params.childId));
    },

    async createPairingCode(req: Request<ChildParams>, res: Response) {
      res.status(201).json(await children.createPairingCode(currentUser(req), req.params.childId));
    },

    async unpair(req: Request<ChildParams>, res: Response) {
      await children.unpair(currentUser(req), req.params.childId);
      res.status(204).end();
    },

    async claimPairingCode(req: Request, res: Response) {
      const code = typeof req.body?.code === 'string' ? req.body.code.replace(/\s/g, '') : '';
      if (!/^\d{6}$/.test(code)) throw new HttpError(400, 'The code has 6 numbers');
      res.json(await children.claimPairingCode(currentUser(req), code));
    },
  };
}

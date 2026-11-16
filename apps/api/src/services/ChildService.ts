import { randomInt } from 'node:crypto';
import type { ChildProfile, MeResponse, PairingCode, SavedDestination } from '@journeybuddy/shared';
import { demoDestinations } from '../data/demoDestinations.js';
import { HttpError } from '../errors.js';
import type { AuthUser } from '../middleware/auth.js';
import type { ChildRecord, FirestoreChildRepository } from '../repositories/FirestoreChildRepository.js';

const PAIRING_CODE_TTL_MS = 10 * 60_000;

export class ChildService {
  constructor(private readonly repo: FirestoreChildRepository) {}

  async me(user: AuthUser): Promise<MeResponse> {
    if (!user.isAnonymous) return { role: 'parent', email: user.email };
    const childId = await this.repo.findDeviceChildId(user.uid);
    const child = childId && (await this.repo.findChild(childId));
    return child ? { role: 'child', child: { id: child.id, name: child.name } } : { role: 'unpaired' };
  }

  async createChild(parent: AuthUser, name: string): Promise<ChildProfile> {
    const child = await this.repo.createChild(parent.uid, name, demoDestinations);
    return { id: child.id, name: child.name, pairedDevices: 0 };
  }

  async listChildren(parent: AuthUser): Promise<ChildProfile[]> {
    const children = await this.repo.listChildren(parent.uid);
    return Promise.all(
      children.map(async (c) => ({ id: c.id, name: c.name, pairedDevices: await this.repo.countDevices(c.id) })),
    );
  }

  /** A parent may access their own children; a paired phone may access only its own child. */
  async assertAccess(user: AuthUser, childId: string): Promise<ChildRecord> {
    const child = await this.repo.findChild(childId);
    const allowed =
      child &&
      (user.isAnonymous ? (await this.repo.findDeviceChildId(user.uid)) === childId : child.parentUid === user.uid);
    if (!child || !allowed) throw new HttpError(404, 'Child not found');
    return child;
  }

  async listDestinations(user: AuthUser, childId: string): Promise<SavedDestination[]> {
    await this.assertAccess(user, childId);
    return this.repo.listDestinations(childId);
  }

  async createPairingCode(parent: AuthUser, childId: string, now = new Date()): Promise<PairingCode> {
    await this.assertAccess(parent, childId);
    const expiresAt = new Date(now.getTime() + PAIRING_CODE_TTL_MS);
    for (let attempt = 0; attempt < 5; attempt++) {
      const code = String(randomInt(0, 1_000_000)).padStart(6, '0');
      if (await this.repo.savePairingCode(code, { childId, parentUid: parent.uid, expiresAt })) {
        return { code, expiresAt: expiresAt.toISOString() };
      }
    }
    throw new HttpError(503, 'Could not create a pairing code, please try again');
  }

  async claimPairingCode(device: AuthUser, code: string): Promise<MeResponse> {
    if (!device.isAnonymous) throw new HttpError(403, 'Only a child’s phone can use a pairing code');
    const childId = await this.repo.claimPairingCode(code, device.uid, new Date());
    if (!childId) throw new HttpError(400, 'That code is wrong or has expired');
    return this.me(device);
  }

  async unpair(parent: AuthUser, childId: string): Promise<void> {
    await this.assertAccess(parent, childId);
    await this.repo.removeDevices(childId);
  }
}

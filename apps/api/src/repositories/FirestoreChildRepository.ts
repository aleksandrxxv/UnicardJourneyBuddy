import type { SavedDestination } from '@journeybuddy/shared';
import { FieldValue, type Firestore, Timestamp } from 'firebase-admin/firestore';

export interface ChildRecord {
  id: string;
  parentUid: string;
  name: string;
}

export interface PairingRecord {
  childId: string;
  parentUid: string;
  expiresAt: Date;
}

/**
 * Firestore data layout:
 *   children/{childId}                 { parentUid, name, createdAt }
 *   children/{childId}/destinations/{id}
 *   pairingCodes/{code}                { childId, parentUid, expiresAt }
 *   devices/{anonymousUid}             { childId, pairedAt }
 */
export class FirestoreChildRepository {
  constructor(private readonly db: Firestore) {}

  async createChild(parentUid: string, name: string, destinations: SavedDestination[]): Promise<ChildRecord> {
    const ref = this.db.collection('children').doc();
    const batch = this.db.batch();
    batch.set(ref, { parentUid, name, createdAt: FieldValue.serverTimestamp() });
    for (const d of destinations) batch.set(ref.collection('destinations').doc(d.id), d);
    await batch.commit();
    return { id: ref.id, parentUid, name };
  }

  async findChild(childId: string): Promise<ChildRecord | undefined> {
    const snap = await this.db.collection('children').doc(childId).get();
    if (!snap.exists) return undefined;
    const { parentUid, name } = snap.data() as { parentUid: string; name: string };
    return { id: snap.id, parentUid, name };
  }

  async listChildren(parentUid: string): Promise<ChildRecord[]> {
    const snap = await this.db.collection('children').where('parentUid', '==', parentUid).get();
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as { parentUid: string; name: string }) }));
  }

  async listDestinations(childId: string): Promise<SavedDestination[]> {
    const snap = await this.db.collection('children').doc(childId).collection('destinations').get();
    return snap.docs.map((d) => d.data() as SavedDestination);
  }

  async savePairingCode(code: string, record: PairingRecord): Promise<boolean> {
    try {
      await this.db.collection('pairingCodes').doc(code).create({ ...record, expiresAt: Timestamp.fromDate(record.expiresAt) });
      return true;
    } catch {
      return false; // code already in use
    }
  }

  /** Atomically uses up a pairing code and links the device. Returns the child id, or undefined if invalid/expired. */
  async claimPairingCode(code: string, deviceUid: string, now: Date): Promise<string | undefined> {
    const codeRef = this.db.collection('pairingCodes').doc(code);
    return this.db.runTransaction(async (tx) => {
      const snap = await tx.get(codeRef);
      if (!snap.exists) return undefined;
      const { childId, expiresAt } = snap.data() as { childId: string; expiresAt: Timestamp };
      tx.delete(codeRef);
      if (expiresAt.toDate() < now) return undefined;
      tx.set(this.db.collection('devices').doc(deviceUid), { childId, pairedAt: FieldValue.serverTimestamp() });
      return childId;
    });
  }

  async findDeviceChildId(deviceUid: string): Promise<string | undefined> {
    const snap = await this.db.collection('devices').doc(deviceUid).get();
    return snap.exists ? (snap.data() as { childId: string }).childId : undefined;
  }

  async countDevices(childId: string): Promise<number> {
    const snap = await this.db.collection('devices').where('childId', '==', childId).count().get();
    return snap.data().count;
  }

  async removeDevices(childId: string): Promise<void> {
    const snap = await this.db.collection('devices').where('childId', '==', childId).get();
    const batch = this.db.batch();
    snap.docs.forEach((d) => batch.delete(d.ref));
    await batch.commit();
  }
}

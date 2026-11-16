import { readFileSync } from 'node:fs';
import { cert, initializeApp, type ServiceAccount } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { env } from './env.js';

// The emulators need no credentials; the real project needs a service-account key.
const app = initializeApp({
  projectId: env.firebaseProjectId,
  ...(env.firebaseServiceAccountPath && {
    credential: cert(JSON.parse(readFileSync(env.firebaseServiceAccountPath, 'utf8')) as ServiceAccount),
  }),
});

export const auth = getAuth(app);
export const db = getFirestore(app);

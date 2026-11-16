import 'dotenv/config';

const useEmulators = process.env.USE_FIREBASE_EMULATORS !== 'false';

// firebase-admin picks these up automatically. Default to the local emulators so
// development never touches a real Firebase project (ADR-0003).
if (useEmulators) {
  process.env.FIREBASE_AUTH_EMULATOR_HOST ??= '127.0.0.1:9099';
  process.env.FIRESTORE_EMULATOR_HOST ??= '127.0.0.1:8080';
}

export const env = {
  port: Number(process.env.PORT ?? 4000),
  tflAppKey: process.env.TFL_APP_KEY ?? '',
  useEmulators,
  firebaseProjectId: process.env.FIREBASE_PROJECT_ID ?? 'demo-journeybuddy',
  firebaseServiceAccountPath: process.env.FIREBASE_SERVICE_ACCOUNT_PATH ?? '',
};

import { initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth } from 'firebase/auth';

const env = import.meta.env;
const useEmulators = env.VITE_USE_FIREBASE_EMULATORS !== 'false';

const app = initializeApp({
  // The emulator accepts any API key; the real project needs the web app config.
  apiKey: env.VITE_FIREBASE_API_KEY || 'demo-api-key',
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID || 'demo-journeybuddy',
  appId: env.VITE_FIREBASE_APP_ID,
});

export const auth = getAuth(app);

if (useEmulators) {
  connectAuthEmulator(auth, `http://${location.hostname}:9099`, { disableWarnings: true });
}

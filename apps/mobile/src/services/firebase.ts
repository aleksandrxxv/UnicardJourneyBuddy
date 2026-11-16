import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { initializeApp } from 'firebase/app';
import { connectAuthEmulator, getReactNativePersistence, initializeAuth } from 'firebase/auth';

const useEmulators = process.env.EXPO_PUBLIC_USE_FIREBASE_EMULATORS !== 'false';

const app = initializeApp({
  // The emulator accepts any API key; the real project needs the web app config.
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || 'demo-api-key',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || 'demo-journeybuddy',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
});

// Keeps the child's anonymous session (and so the pairing) across app restarts.
export const auth = initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });

if (useEmulators) {
  // Same machine that serves the Expo bundle, so it also works from a phone on the same Wi-Fi.
  const host = Constants.expoConfig?.hostUri?.split(':')[0] ?? 'localhost';
  connectAuthEmulator(auth, `http://${host}:9099`, { disableWarnings: true });
}

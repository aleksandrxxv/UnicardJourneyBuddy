import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { DEFAULT_SWATCH } from '@/theme';
import { ThemeProvider } from '@/theme/ThemeContext';
import type { ChildProfile, Helper, Place } from './types';

// MOCK LOGIN: profiles live only on this phone (AsyncStorage), keyed by phone number.
// No code is really sent; any 6 digits are accepted. Replace with real accounts later.

const PROFILES_KEY = 'jb.profiles';
const SESSION_KEY = 'jb.session';

export function normalisePhone(phone: string): string {
  return phone.replace(/[^\d+]/g, '');
}

export function newId(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}

const emptyDraft = (): ChildProfile => ({
  name: '',
  phone: '',
  colour: DEFAULT_SWATCH,
  helpers: [],
  places: [],
  recentTrips: [],
});

interface ProfileContextValue {
  ready: boolean;
  profile: ChildProfile | null;
  /** The profile being built during onboarding. */
  draft: ChildProfile;
  updateDraft: (patch: Partial<ChildProfile>) => void;
  completeOnboarding: () => Promise<void>;
  hasProfile: (phone: string) => boolean;
  signIn: (phone: string) => Promise<void>;
  signOut: () => Promise<void>;
  addPlace: (place: Place) => Promise<void>;
  addHelper: (helper: Helper) => Promise<void>;
  recordTrip: (placeId: string) => Promise<void>;
}

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [profiles, setProfiles] = useState<Record<string, ChildProfile>>({});
  const [session, setSession] = useState<string | null>(null);
  const [draft, setDraft] = useState<ChildProfile>(emptyDraft);

  useEffect(() => {
    (async () => {
      try {
        const [p, s] = await AsyncStorage.multiGet([PROFILES_KEY, SESSION_KEY]);
        if (p[1]) setProfiles(JSON.parse(p[1]));
        if (s[1]) setSession(s[1]);
      } finally {
        setReady(true);
      }
    })();
  }, []);

  const profile = session ? (profiles[session] ?? null) : null;

  const persist = useCallback(async (next: Record<string, ChildProfile>, nextSession: string | null) => {
    setProfiles(next);
    setSession(nextSession);
    await AsyncStorage.setItem(PROFILES_KEY, JSON.stringify(next));
    if (nextSession) await AsyncStorage.setItem(SESSION_KEY, nextSession);
    else await AsyncStorage.removeItem(SESSION_KEY);
  }, []);

  const updateProfile = useCallback(
    async (change: (p: ChildProfile) => ChildProfile) => {
      if (!profile) return;
      const updated = change(profile);
      await persist({ ...profiles, [normalisePhone(updated.phone)]: updated }, session);
    },
    [profile, profiles, session, persist],
  );

  const value = useMemo<ProfileContextValue>(
    () => ({
      ready,
      profile,
      draft,
      updateDraft: (patch) => setDraft((d) => ({ ...d, ...patch })),
      completeOnboarding: async () => {
        const key = normalisePhone(draft.phone);
        await persist({ ...profiles, [key]: draft }, key);
        setDraft(emptyDraft());
      },
      hasProfile: (phone) => normalisePhone(phone) in profiles,
      signIn: async (phone) => {
        const key = normalisePhone(phone);
        if (!(key in profiles)) throw new Error('No profile found for this phone number');
        await persist(profiles, key);
      },
      signOut: () => persist(profiles, null),
      addPlace: (place) => updateProfile((p) => ({ ...p, places: [...p.places, place] })),
      addHelper: (helper) => updateProfile((p) => ({ ...p, helpers: [...p.helpers, helper] })),
      recordTrip: (placeId) =>
        updateProfile((p) => ({ ...p, recentTrips: [placeId, ...p.recentTrips.filter((id) => id !== placeId)].slice(0, 3) })),
    }),
    [ready, profile, draft, profiles, persist, updateProfile],
  );

  // During onboarding the draft colour wins, so "Choose your colour" changes the app straight away.
  const swatch = profile ? profile.colour : draft.colour;

  return (
    <ProfileContext.Provider value={value}>
      <ThemeProvider swatch={swatch}>{children}</ThemeProvider>
    </ProfileContext.Provider>
  );
}

export function useProfile(): ProfileContextValue {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used inside <ProfileProvider>');
  return ctx;
}

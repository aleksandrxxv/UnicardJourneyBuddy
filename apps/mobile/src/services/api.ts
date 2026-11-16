import type {
  Journey,
  JourneySearchRequest,
  JourneySearchResponse,
  MeResponse,
  PlanJourneyRequest,
  SavedDestination,
} from '@journeybuddy/shared';
import Constants from 'expo-constants';
import { signInAnonymously } from 'firebase/auth';
import { auth } from './firebase';

const API_PORT = 4000;

/**
 * EXPO_PUBLIC_API_URL wins if set. Otherwise use the dev machine's address that Expo
 * already knows (hostUri), so a physical phone on the same Wi-Fi reaches the local API.
 */
function resolveBaseUrl(): string {
  if (process.env.EXPO_PUBLIC_API_URL) return process.env.EXPO_PUBLIC_API_URL;
  const host = Constants.expoConfig?.hostUri?.split(':')[0];
  return `http://${host ?? 'localhost'}:${API_PORT}`;
}

const baseUrl = resolveBaseUrl();

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

/** The child's phone signs in anonymously; no email or password (ADR-0003). */
async function idToken(): Promise<string> {
  const user = auth.currentUser ?? (await signInAnonymously(auth)).user;
  return user.getIdToken();
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${await idToken()}`,
      ...init?.headers,
    },
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new ApiError(res.status, body?.error ?? `Request failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

/** Route search needs no sign-in (the API stores nothing about it). */
async function publicRequest<T>(path: string, body: unknown): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12_000);
  const res = await fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: controller.signal,
  }).finally(() => clearTimeout(timer));
  if (!res.ok) throw new ApiError(res.status, `Request failed (${res.status})`);
  return res.json() as Promise<T>;
}

export const api = {
  searchJourney: (body: JourneySearchRequest) => publicRequest<JourneySearchResponse>('/journeys/search', body),

  me: () => request<MeResponse>('/me'),

  claimPairingCode: (code: string) =>
    request<MeResponse>('/pairing/claim', { method: 'POST', body: JSON.stringify({ code }) }),

  approvedDestinations: (childId: string) =>
    request<SavedDestination[]>(`/children/${encodeURIComponent(childId)}/destinations`),

  planJourney: (body: PlanJourneyRequest) =>
    request<Journey>('/journeys/plan', { method: 'POST', body: JSON.stringify(body) }),
};

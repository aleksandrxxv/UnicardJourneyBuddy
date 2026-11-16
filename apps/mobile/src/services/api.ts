import type { Journey, PlanJourneyRequest, SavedDestination } from '@journeybuddy/shared';
import Constants from 'expo-constants';

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

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return res.json() as Promise<T>;
}

export const api = {
  approvedDestinations: (childId: string) =>
    request<SavedDestination[]>(`/children/${encodeURIComponent(childId)}/destinations`),

  planJourney: (body: PlanJourneyRequest) =>
    request<Journey>('/journeys/plan', { method: 'POST', body: JSON.stringify(body) }),
};

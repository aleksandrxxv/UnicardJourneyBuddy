import type { ChildProfile, PairingCode, SavedDestination } from '@journeybuddy/shared';
import { auth } from './firebase';

const baseUrl = import.meta.env.VITE_API_URL ?? `http://${location.hostname}:4000`;

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = await auth.currentUser?.getIdToken();
  const res = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...init?.headers,
    },
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new ApiError(res.status, body?.error ?? `Request failed (${res.status})`);
  }
  return (res.status === 204 ? undefined : await res.json()) as T;
}

export const api = {
  listChildren: () => request<ChildProfile[]>('/children'),
  createChild: (name: string) => request<ChildProfile>('/children', { method: 'POST', body: JSON.stringify({ name }) }),
  destinations: (childId: string) => request<SavedDestination[]>(`/children/${childId}/destinations`),
  createPairingCode: (childId: string) => request<PairingCode>(`/children/${childId}/pairing-code`, { method: 'POST' }),
  unpair: (childId: string) => request<void>(`/children/${childId}/devices`, { method: 'DELETE' }),
};

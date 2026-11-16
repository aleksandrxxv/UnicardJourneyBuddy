export function minutesUntil(iso: string, now: Date): number {
  return Math.round((new Date(iso).getTime() - now.getTime()) / 60_000);
}

export function formatClock(iso: string): string {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/** "Leave now", "Leave in 1 minute", "Leave in 7 minutes". */
export function leaveText(startIso: string, now: Date): string {
  const mins = minutesUntil(startIso, now);
  if (mins <= 0) return 'Leave now';
  return `Leave in ${mins} ${mins === 1 ? 'minute' : 'minutes'}`;
}

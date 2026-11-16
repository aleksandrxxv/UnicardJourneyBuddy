/** "9:08", "10:04" — 24-hour clock without a leading zero, as in the Figma design. */
export function shortTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export function minutesBetween(fromIso: string, toIso: string): number {
  return Math.round((new Date(toIso).getTime() - new Date(fromIso).getTime()) / 60_000);
}

export function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60_000);
}

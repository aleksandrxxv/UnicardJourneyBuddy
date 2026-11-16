import type { Journey } from '@journeybuddy/shared';
import { shortTime } from '@/utils/time';

export function busLines(journey: Journey): string[] {
  return journey.legs.filter((l) => l.mode !== 'walk' && l.lineName).map((l) => l.lineName!);
}

/** "Bus 45, then bus 33" */
export function busSummary(journey: Journey): string {
  const lines = busLines(journey);
  if (lines.length === 0) return 'Walk';
  return lines.map((l, i) => `${i === 0 ? 'Bus' : 'bus'} ${l}`).join(', then ');
}

/** "9:08 to 10:04, 2 buses" */
export function routeSummary(journey: Journey): string {
  const n = busLines(journey).length;
  return `${shortTime(journey.startTime)} to ${shortTime(journey.arrivalTime)}, ${n} ${n === 1 ? 'bus' : 'buses'}`;
}

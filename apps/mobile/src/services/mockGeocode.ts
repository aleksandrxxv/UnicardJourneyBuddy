import type { Coordinates } from '@journeybuddy/shared';

// Mock only: turns a postcode into a stable point in Birmingham, so the demo works
// without a geocoding API. Replace when a real provider is chosen (ADR-0002).

const BIRMINGHAM_CENTRE: Coordinates = { lat: 52.4862, lng: -1.8904 };

const knownAreas: Record<string, string> = {
  B1: 'City Centre',
  B5: 'Digbeth',
  B6: 'Aston',
  B14: 'Kings Heath',
  B19: 'Lozells',
  B38: 'Kings Norton',
};

function hash(text: string): number {
  let h = 0;
  for (const ch of text) h = (h * 31 + ch.charCodeAt(0)) | 0;
  return h;
}

export function normalisePostcode(postcode: string): string {
  return postcode.trim().toUpperCase().replace(/\s+/g, ' ');
}

export function geocodePostcode(postcode: string): { location: Coordinates; area: string } {
  const pc = normalisePostcode(postcode);
  const h = hash(pc);
  const location = {
    lat: BIRMINGHAM_CENTRE.lat + ((h % 1000) / 1000) * 0.08 - 0.04,
    lng: BIRMINGHAM_CENTRE.lng + (((h >> 10) % 1000) / 1000) * 0.12 - 0.06,
  };
  const district = pc.split(' ')[0];
  return { location, area: `${knownAreas[district] ?? 'Birmingham'}, Birmingham ${pc}` };
}

import { geocodePostcode, normalisePostcode } from '@/services/mockGeocode';
import { newId } from './ProfileContext';
import type { Place, PlaceIcon } from './types';

const UK_POSTCODE = /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i;

export function validatePlace(label: string, postcode: string): string | undefined {
  if (!label.trim()) return 'Give the place a name.';
  if (!UK_POSTCODE.test(postcode.trim())) return 'Type a postcode like B19 2EP.';
  return undefined;
}

export function buildPlace(input: { id?: string; label: string; icon: PlaceIcon; postcode: string; city?: string; photoUri?: string }): Place {
  const postcode = normalisePostcode(input.postcode);
  const { location, area } = geocodePostcode(postcode);
  return { ...input, id: input.id ?? newId(), label: input.label.trim(), postcode, area, location };
}

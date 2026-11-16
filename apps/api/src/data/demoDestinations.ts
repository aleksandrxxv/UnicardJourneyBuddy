import type { SavedDestination } from '@journeybuddy/shared';

// Fictional places given to every new child profile until parents can manage
// destinations themselves (US-17). The PoC must never hold real children's data (plan §5.2).
export const demoDestinations: SavedDestination[] = [
  {
    id: 'school',
    label: 'School',
    icon: 'school',
    address: 'Fictional Primary School, Camden, London',
    location: { lat: 51.539, lng: -0.1426 },
  },
  {
    id: 'grandma',
    label: "Grandma's",
    icon: 'grandma',
    address: '12 Example Road, Islington, London',
    location: { lat: 51.5465, lng: -0.1058 },
  },
  {
    id: 'football',
    label: 'Football club',
    icon: 'football',
    address: 'Demo Sports Ground, Hackney, London',
    location: { lat: 51.545, lng: -0.0553 },
  },
  {
    id: 'library',
    label: 'Library',
    icon: 'library',
    address: "Sample Library, King's Cross, London",
    location: { lat: 51.53, lng: -0.124 },
  },
];

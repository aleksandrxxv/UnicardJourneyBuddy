import type { SavedDestination } from '@journeybuddy/shared';

// Fictional demo data only. The PoC must never hold real children's data (project plan §5.2).

export const DEMO_CHILD_ID = 'demo-child';

export const approvedDestinationsByChild: Record<string, SavedDestination[]> = {
  [DEMO_CHILD_ID]: [
    {
      id: 'school',
      label: 'School',
      icon: 'school',
      address: 'Fictional Primary School, Camden, London',
      location: { lat: 51.5390, lng: -0.1426 },
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
      location: { lat: 51.5450, lng: -0.0553 },
    },
    {
      id: 'library',
      label: 'Library',
      icon: 'library',
      address: 'Sample Library, King\'s Cross, London',
      location: { lat: 51.5300, lng: -0.1240 },
    },
  ],
};

import type { Coordinates } from '@journeybuddy/shared';
import * as Location from 'expo-location';
import { DEMO_START_LOCATION } from '@/constants/demo';

/**
 * Current position, used only on the device to plan the trip.
 * Falls back to a demo location so the app still works without permission.
 */
export async function getStartLocation(): Promise<Coordinates> {
  try {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) return DEMO_START_LOCATION;
    const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
    return { lat: pos.coords.latitude, lng: pos.coords.longitude };
  } catch {
    return DEMO_START_LOCATION;
  }
}

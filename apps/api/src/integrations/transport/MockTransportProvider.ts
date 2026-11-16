import type { Coordinates, Journey, JourneyLeg } from '@journeybuddy/shared';
import type { TransportProvider } from './TransportProvider.js';

const MINUTE = 60_000;

function midpoint(a: Coordinates, b: Coordinates, t: number): Coordinates {
  return { lat: a.lat + (b.lat - a.lat) * t, lng: a.lng + (b.lng - a.lng) * t };
}

/**
 * Generates a plausible walk → bus → walk journey without calling a real API.
 * Used until the transport data spike (TfL vs OpenTripPlanner) picks a real provider,
 * and as the fallback when that provider is unavailable.
 */
export class MockTransportProvider implements TransportProvider {
  async planJourney(from: Coordinates, to: Coordinates, departAt = new Date()): Promise<Journey[]> {
    const stopA = midpoint(from, to, 0.1);
    const stopB = midpoint(from, to, 0.9);

    // First bus a few minutes after "now", so the child has time to walk to the stop.
    const leave = new Date(Math.ceil((departAt.getTime() + 2 * MINUTE) / MINUTE) * MINUTE);
    const atStop = new Date(leave.getTime() + 5 * MINUTE);
    const busDeparts = new Date(atStop.getTime() + 2 * MINUTE);
    const busArrives = new Date(busDeparts.getTime() + 14 * MINUTE);
    const arrive = new Date(busArrives.getTime() + 4 * MINUTE);

    const legs: JourneyLeg[] = [
      {
        mode: 'walk',
        instruction: 'Walk to the bus stop',
        from,
        to: stopA,
        departureTime: leave.toISOString(),
        arrivalTime: atStop.toISOString(),
        stopName: 'Park Street',
      },
      {
        mode: 'bus',
        instruction: 'Take bus 25',
        from: stopA,
        to: stopB,
        departureTime: busDeparts.toISOString(),
        arrivalTime: busArrives.toISOString(),
        lineName: '25',
        stopName: 'High Road',
        stopsCount: 6,
      },
      {
        mode: 'walk',
        instruction: 'Walk to your destination',
        from: stopB,
        to,
        departureTime: busArrives.toISOString(),
        arrivalTime: arrive.toISOString(),
      },
    ];

    return [
      {
        id: `mock-${leave.getTime()}`,
        destinationId: '',
        legs,
        startTime: leave.toISOString(),
        arrivalTime: arrive.toISOString(),
      },
    ];
  }
}

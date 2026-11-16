import type { Coordinates, Journey, JourneyLeg, TransportMode } from '@journeybuddy/shared';
import type { PlanOptions, TransportProvider } from './TransportProvider.js';

// Real Birmingham journeys from a self-hosted OpenTripPlanner 2.8 (ADR-0002), via its GTFS GraphQL API.

const PLAN_QUERY = `
query Plan($from: PlanLabeledLocationInput!, $to: PlanLabeledLocationInput!, $dateTime: PlanDateTimeInput!) {
  planConnection(origin: $from, destination: $to, dateTime: $dateTime, first: 3,
    modes: { transit: { transit: [{ mode: BUS }, { mode: TRAM }, { mode: RAIL }] } }) {
    edges {
      node {
        legs {
          mode
          start { scheduledTime estimated { time } }
          end { scheduledTime estimated { time } }
          from { name lat lon }
          to { name lat lon }
          route { shortName }
          headsign
          intermediatePlaces { name }
          steps { relativeDirection absoluteDirection streetName bogusName }
        }
      }
    }
  }
}`;

interface OtpStep {
  relativeDirection: string | null;
  absoluteDirection: string | null;
  streetName: string | null;
  bogusName: boolean | null;
}

interface OtpLeg {
  mode: string;
  start: { scheduledTime: string; estimated: { time: string } | null };
  end: { scheduledTime: string; estimated: { time: string } | null };
  from: { name: string; lat: number; lon: number };
  to: { name: string; lat: number; lon: number };
  route: { shortName: string | null } | null;
  headsign: string | null;
  intermediatePlaces: { name: string }[] | null;
  steps: OtpStep[] | null;
}

interface PlanResponse {
  data?: { planConnection: { edges: { node: { legs: OtpLeg[] } }[] } };
  errors?: { message: string }[];
}

const modeMap: Record<string, TransportMode> = { WALK: 'walk', BUS: 'bus', TRAM: 'tram', RAIL: 'train', SUBWAY: 'tube', FERRY: 'ferry' };

/** "Head west on Cowslip Cl", "Turn left onto Shannon Rd". */
export function stepText(step: OtpStep): string {
  const street = step.bogusName || !step.streetName ? 'the path' : step.streetName;
  switch (step.relativeDirection) {
    case 'DEPART':
      return `Head ${step.absoluteDirection?.toLowerCase().replace('_', '') ?? 'off'} on ${street}`;
    case 'LEFT':
    case 'HARD_LEFT':
      return `Turn left onto ${street}`;
    case 'RIGHT':
    case 'HARD_RIGHT':
      return `Turn right onto ${street}`;
    case 'SLIGHTLY_LEFT':
      return `Keep left onto ${street}`;
    case 'SLIGHTLY_RIGHT':
      return `Keep right onto ${street}`;
    case 'UTURN_LEFT':
    case 'UTURN_RIGHT':
      return `Turn around onto ${street}`;
    case 'CIRCLE_CLOCKWISE':
    case 'CIRCLE_COUNTERCLOCKWISE':
      return `Go round the roundabout onto ${street}`;
    default:
      return `Continue onto ${street}`;
  }
}

function walkInstruction(index: number, legs: OtpLeg[], destinationLabel: string): string {
  if (index === legs.length - 1) return `Walk to ${destinationLabel}`;
  return legs.slice(0, index).some((l) => l.mode !== 'WALK') ? 'Walk to the next stop' : 'Walk to the stop';
}

export function toJourney(legs: OtpLeg[], destinationLabel: string): Journey {
  const mapped: JourneyLeg[] = legs.map((leg, i) => {
    const mode = modeMap[leg.mode] ?? 'bus';
    const base = {
      mode,
      from: { lat: leg.from.lat, lng: leg.from.lon },
      to: { lat: leg.to.lat, lng: leg.to.lon },
      departureTime: leg.start.estimated?.time ?? leg.start.scheduledTime,
      arrivalTime: leg.end.estimated?.time ?? leg.end.scheduledTime,
    };
    if (mode === 'walk') {
      return {
        ...base,
        instruction: walkInstruction(i, legs, destinationLabel),
        stopName: i === legs.length - 1 ? undefined : leg.to.name,
        steps: (leg.steps ?? []).map(stepText),
      };
    }
    const line = leg.route?.shortName ?? '';
    const stops = leg.intermediatePlaces?.map((p) => p.name) ?? [];
    return {
      ...base,
      instruction: `${mode === 'bus' ? 'Bus' : mode === 'tram' ? 'Tram' : 'Train'} ${line}`.trim(),
      lineName: line,
      towards: leg.headsign ?? undefined,
      stopName: leg.to.name,
      stopsCount: stops.length + 1,
      intermediateStops: stops,
    };
  });

  return {
    id: `otp-${mapped[0]?.departureTime ?? Date.now()}`,
    destinationId: '',
    legs: mapped,
    startTime: mapped[0].departureTime,
    arrivalTime: mapped[mapped.length - 1].arrivalTime,
  };
}

export class OtpTransportProvider implements TransportProvider {
  constructor(
    private readonly baseUrl: string,
    private readonly timeoutMs = 8000,
  ) {}

  async planJourney(from: Coordinates, to: Coordinates, options: PlanOptions = {}): Promise<Journey[]> {
    const time = (options.time ?? new Date()).toISOString();
    const location = (c: Coordinates) => ({ location: { coordinate: { latitude: c.lat, longitude: c.lng } } });
    const res = await fetch(`${this.baseUrl}/otp/gtfs/v1`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(this.timeoutMs),
      body: JSON.stringify({
        query: PLAN_QUERY,
        variables: {
          from: location(from),
          to: location(to),
          dateTime: options.arriveBy ? { latestArrival: time } : { earliestDeparture: time },
        },
      }),
    });
    if (!res.ok) throw new Error(`OpenTripPlanner responded ${res.status}`);
    const body = (await res.json()) as PlanResponse;
    if (body.errors?.length) throw new Error(`OpenTripPlanner: ${body.errors[0].message}`);

    const label = options.destinationLabel ?? 'your destination';
    return (body.data?.planConnection.edges ?? [])
      .map((e) => e.node.legs)
      .filter((legs) => legs.some((l) => l.mode !== 'WALK'))
      .map((legs) => toJourney(legs, label));
  }
}

# ADR-0002: Transport data for Birmingham

- **Status:** accepted
- **Date:** 2026-11-16

## Context

The PoC currently plans journeys with mock data. The Figma design (Birmingham Bus Navigation) needs real bus journeys in Birmingham. That means walking legs with turn-by-turn steps ("Head west on Cowslip Cl"), bus legs with line, direction, stops and the stop to get off at, and ideally live departure times ("Bus 45 comes in 3 min"). The budget is zero, and nothing may depend on a paid plan.

The project plan names "TfL API / OpenTripPlanner", but TfL only covers London, so it does not fit a Birmingham design.

## Options considered

| Option | What it gives | Cost / access | Fit |
|---|---|---|---|
| **1. OpenTripPlanner 2 (self-hosted) + BODS GTFS + OpenStreetMap** | Full journey planning: walk steps, bus legs, stops, times. Live delays possible later through BODS GTFS-RT. | Free and open source. West Midlands GTFS from the DfT Bus Open Data Service downloads without an account; OSM extract from Geofabrik. Runs locally in Java (about 3 GB of memory for the West Midlands). | Best fit for the Figma route and step screens. Setup and memory are the cost. |
| **2. TfWM API** | Stops, routes, timetables and live predicted departures for West Midlands buses and trams. No public journey planner. | Free registration for an app id and key. | Good for "Bus 45 comes in 3 min", but cannot plan a route on its own. |
| **3. BODS API directly** | Timetables, fares and live vehicle locations (SIRI-VM / GTFS-RT) for all of England. | Free account and API key. | Raw data only; we would have to build routing ourselves. |
| **4. Google Routes API (transit)** | Journey planning with transit. | Needs a billing account with a card; usage beyond free credit is charged; terms restrict storing results. | Against the zero-budget rule. |
| **5. TransportAPI** | UK journey planning and departures. | Small free tier, then paid. | Risky for demos and usability tests. |

## Decision

Use **option 1**: run **OpenTripPlanner 2.8.1** locally (the last release that runs on Java 21; 2.9 and later need Java 25) with the **BODS West Midlands GTFS** timetable and the **OpenStreetMap West Midlands** extract. The API gets an `OtpTransportProvider` that implements the existing `TransportProvider` interface, so the sample journey stays as a fallback when OTP is not running (risk table: "use mock data as fallback"). The app labels sample times so testers are never misled.

The route search endpoint (`POST /journeys/search`) needs no sign-in: it returns only public timetable data, and the coordinates sent are used for that one search and not stored or logged.

Live departures (BODS GTFS-RT or TfWM) can be added later on top of the same provider.

## Consequences

- Real Birmingham journeys and walking directions, at no cost and with no accounts.
- The mobile app must get journeys from the API instead of planning them on the phone.
- A developer needs Java 21+ and about 3 GB of free memory to run OTP; the graph is built once and reused. The timetable's route outlines (`shapes.txt`, ~600 MB) are dropped to fit in 8 GB laptops.
- Timetable data goes stale; the GTFS file should be refreshed every few weeks.
- Data licences: BODS data is published under the Open Government Licence, OSM under the ODbL. Both need attribution in the app's About screen.

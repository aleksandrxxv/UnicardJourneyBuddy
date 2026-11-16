# OpenTripPlanner (real Birmingham bus journeys)

Free, self-hosted journey planner used by the API. See [ADR-0002](../docs/05-architecture/adr/0002-transport-data-provider.md).

```bash
npm run otp:download   # OTP + West Midlands timetables + map (~1 GB with the jar)
npm run otp:build      # once, and after every new download (a few minutes, ~3 GB memory)
npm run otp           # serve on http://localhost:8090
```

Requires Java 21+ (OTP 2.8.1; 2.9 and later need Java 25). The API uses OTP when it is reachable and the app falls back to sample journeys when it is not.

Timetables change: run `otp:download` and `otp:build` again every few weeks.

Data: bus timetables from the DfT [Bus Open Data Service](https://data.bus-data.dft.gov.uk/) (Open Government Licence v3.0); map data © OpenStreetMap contributors (ODbL).

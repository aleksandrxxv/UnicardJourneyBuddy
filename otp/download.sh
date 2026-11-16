#!/usr/bin/env bash
# Downloads OpenTripPlanner and the Birmingham (West Midlands) data it needs. See ADR-0002.
set -euo pipefail
cd "$(dirname "$0")"
OTP_VERSION=2.8.1   # last release that runs on Java 21; 2.9+ needs Java 25
mkdir -p data

if [ ! -f "otp-$OTP_VERSION.jar" ]; then
  echo "Downloading OpenTripPlanner $OTP_VERSION…"
  curl -fL -o "otp-$OTP_VERSION.jar" "https://repo1.maven.org/maven2/org/opentripplanner/otp-shaded/$OTP_VERSION/otp-shaded-$OTP_VERSION.jar"
fi

echo "Downloading West Midlands bus timetables (DfT Bus Open Data Service, Open Government Licence)…"
curl -fL -o data/west-midlands-gtfs.zip "https://data.bus-data.dft.gov.uk/timetable/download/gtfs-file/west_midlands/"

# Route outlines (shapes.txt) are ~600 MB and not needed for planning; dropping them keeps
# the graph build within ~3 GB of memory. OTP draws legs from stop positions instead.
zip -qd data/west-midlands-gtfs.zip shapes.txt || true

echo "Downloading West Midlands map (OpenStreetMap via Geofabrik, ODbL)…"
curl -fL -o data/west-midlands.osm.pbf "https://download.geofabrik.de/europe/united-kingdom/england/west-midlands-latest.osm.pbf"

echo "Done. Next: npm run otp:build"

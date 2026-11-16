#!/usr/bin/env bash
# Starts OpenTripPlanner on http://localhost:8090 using the saved graph.
# Port 8090 because the Firestore emulator already uses 8080.
set -euo pipefail
cd "$(dirname "$0")"
java -Xmx3g -jar otp-2.8.1.jar --load --port 8090 data

#!/usr/bin/env bash
# Builds the routing graph once (a few minutes, ~3 GB memory) and saves it to otp/data/graph.obj.
set -euo pipefail
cd "$(dirname "$0")"
java -Xmx3g -jar otp-2.8.1.jar --build --save data

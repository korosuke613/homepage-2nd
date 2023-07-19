#!/usr/bin/env bash

set -euxo pipefail

type cwebp

SOURCE_PATH=$1  # x.png or x.jpg
DESTINATION_PATH=${SOURCE_PATH%.*}.webp  # x.webp

# Convert to webp
cwebp $SOURCE_PATH -o  $DESTINATION_PATH

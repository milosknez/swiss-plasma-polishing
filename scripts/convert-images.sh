#!/usr/bin/env bash
# Convert images to WebP for the SPP site.
# Usage: ./scripts/convert-images.sh photo.png [more files...]
# Requires cwebp (brew install webp). Photos get -q 82; files whose
# name starts with "partner-" (logos, text) get -q 90.
set -euo pipefail

if ! command -v cwebp >/dev/null; then
  echo "cwebp not found. Install it with: brew install webp" >&2
  exit 1
fi

for f in "$@"; do
  base=$(basename "$f")
  q=82
  [[ "$base" == partner-* ]] && q=90
  out="${f%.*}.webp"
  cwebp -quiet -q "$q" "$f" -o "$out"
  printf "%s -> %s (%d KB)\n" "$f" "$out" "$(($(stat -f%z "$out") / 1024))"
done

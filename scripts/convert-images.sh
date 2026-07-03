#!/usr/bin/env bash
# Convert images to WebP for the SPP site.
# Usage: ./scripts/convert-images.sh photo.png [more files...]
# Requires cwebp (brew install webp). Photos get -q 82; files whose
# name starts with "partner-" (logos, text) get -q 90.
#
# Writes foo.webp next to each input and keeps the original, so any image
# can be re-encoded later at a different quality. It never edits markup:
# after converting, point the <img src> in the HTML at the new .webp by
# hand. The partner-* rule exists because logo files are text and flat
# shapes that smear at photo quality; keep that filename prefix when the
# client sends real partner logos. These settings produced the sitewide
# WebP swap on main (2.5 MB of PNGs down to 188 KB). Site images live in
# assets/img/; the current photos are Figma placeholder exports awaiting
# real client photography.
set -euo pipefail

if ! command -v cwebp >/dev/null; then
  echo "cwebp not found. Install it with: brew install webp" >&2
  exit 1
fi

# Quality is picked from the basename only, so partner logos are detected
# no matter which directory they are passed from.
for f in "$@"; do
  base=$(basename "$f")
  q=82
  [[ "$base" == partner-* ]] && q=90
  # Same path, extension swapped: assets/img/case.png -> assets/img/case.webp.
  out="${f%.*}.webp"
  cwebp -quiet -q "$q" "$f" -o "$out"
  # stat -f%z is the BSD/macOS size flag; on Linux use stat -c%s instead.
  printf "%s -> %s (%d KB)\n" "$f" "$out" "$(($(stat -f%z "$out") / 1024))"
done

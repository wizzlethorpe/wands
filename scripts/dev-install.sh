#!/usr/bin/env bash
# Build the module and sync it into a local Foundry install for testing.
#
# Reads FOUNDRY_PATH from .env (root of the Foundry install — the directory
# containing Data/, App/, Config/...). Windows paths are auto-converted under
# WSL. Pass --no-build to skip the build step and just copy what's already in
# foundry/.
set -euo pipefail

cd "$(dirname "$0")/.."

if [[ ! -f .env ]]; then
  echo "error: .env not found. Copy .env.example to .env and set FOUNDRY_PATH." >&2
  exit 1
fi

# Read FOUNDRY_PATH literally — `source`-ing .env eats backslashes in Windows paths.
FOUNDRY_PATH="$(grep -E '^FOUNDRY_PATH=' .env | head -1 | sed -E 's/^FOUNDRY_PATH=//; s/^"(.*)"$/\1/; s/^'"'"'(.*)'"'"'$/\1/')"

if [[ -z "$FOUNDRY_PATH" ]]; then
  echo "error: FOUNDRY_PATH not set in .env" >&2
  exit 1
fi

# Convert Windows-style paths under WSL.
if [[ "$FOUNDRY_PATH" =~ ^[A-Za-z]:[\\/] ]]; then
  if ! command -v wslpath >/dev/null 2>&1; then
    echo "error: FOUNDRY_PATH looks like a Windows path but wslpath is unavailable." >&2
    exit 1
  fi
  FOUNDRY_PATH="$(wslpath -u "$FOUNDRY_PATH")"
fi

DATA_DIR="$FOUNDRY_PATH/Data"
if [[ ! -d "$DATA_DIR" ]]; then
  echo "error: $DATA_DIR not found. Is FOUNDRY_PATH the install root?" >&2
  exit 1
fi

DEST="$DATA_DIR/modules/wands"

if [[ "${1:-}" != "--no-build" ]]; then
  echo "==> Building module..."
  npm run build
fi

echo "==> Syncing foundry/ -> $DEST"
mkdir -p "$DEST"
if ! rsync -a --delete \
  --exclude=package.json --exclude=package-lock.json --exclude=node_modules \
  foundry/ "$DEST/"; then
  echo "" >&2
  echo "rsync failed. If you saw 'Permission denied' on packs/*/LOCK or .ldb files," >&2
  echo "Foundry is probably running and holding those LevelDB packs open. Close" >&2
  echo "Foundry, then re-run this script." >&2
  exit 1
fi

echo "Done. Restart Foundry (or reload the world) to pick up changes."

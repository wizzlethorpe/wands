#!/usr/bin/env bash
# Compile the WANDS vault into this module and sync it into a local Foundry
# install for testing.
#
# Reads FOUNDRY_PATH from foundry/.env (root of the Foundry install — the
# directory containing Data/, App/, Config/...). Windows paths are auto-converted
# under WSL. Pass --no-build to skip `vfmc` and just copy what's already here.
set -euo pipefail

FOUNDRY_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"   # WANDS/foundry
VAULT="$(dirname "$FOUNDRY_DIR")"                                # WANDS

command -v jq   >/dev/null 2>&1 || { echo "error: jq is required." >&2; exit 1; }
command -v vfmc >/dev/null 2>&1 || { echo "error: vfmc not on PATH (pnpm --filter @wizzlethorpe/foundry-compiler link --global)." >&2; exit 1; }

MODULE_ID="$(jq -r '.id' "$FOUNDRY_DIR/module.json")"

ENV_FILE="$FOUNDRY_DIR/.env"
if [[ ! -f "$ENV_FILE" ]]; then
  echo "error: $ENV_FILE not found. Copy scripts/.env.example to foundry/.env and set FOUNDRY_PATH." >&2
  exit 1
fi

# Read FOUNDRY_PATH literally — `source`-ing .env eats backslashes in Windows paths.
FOUNDRY_PATH="$(grep -E '^FOUNDRY_PATH=' "$ENV_FILE" | head -1 | sed -E 's/^FOUNDRY_PATH=//; s/^"(.*)"$/\1/; s/^'"'"'(.*)'"'"'$/\1/')"
if [[ -z "$FOUNDRY_PATH" ]]; then
  echo "error: FOUNDRY_PATH not set in $ENV_FILE" >&2
  exit 1
fi

# Convert Windows-style paths under WSL.
if [[ "$FOUNDRY_PATH" =~ ^[A-Za-z]:[\\/] ]]; then
  command -v wslpath >/dev/null 2>&1 || { echo "error: FOUNDRY_PATH looks like a Windows path but wslpath is unavailable." >&2; exit 1; }
  FOUNDRY_PATH="$(wslpath -u "$FOUNDRY_PATH")"
fi

DATA_DIR="$FOUNDRY_PATH/Data"
if [[ ! -d "$DATA_DIR" ]]; then
  echo "error: $DATA_DIR not found. Is FOUNDRY_PATH the install root?" >&2
  exit 1
fi
DEST="$DATA_DIR/modules/$MODULE_ID"

if [[ "${1:-}" != "--no-build" ]]; then
  echo "==> Compiling vault → module (vfmc $VAULT)..."
  vfmc "$VAULT"
fi

echo "==> Syncing $FOUNDRY_DIR -> $DEST"
mkdir -p "$DEST"
if ! rsync -a --delete \
  --exclude=scripts --exclude=.env --exclude=.env.example --exclude=.gitignore --exclude=_json \
  "$FOUNDRY_DIR/" "$DEST/"; then
  echo "" >&2
  echo "rsync failed. If you saw 'Permission denied' on packs/*/LOCK or .ldb files," >&2
  echo "Foundry is probably running and holding those LevelDB packs open. Close" >&2
  echo "Foundry, then re-run this script." >&2
  exit 1
fi

echo "Done. Restart Foundry (or reload the world) to pick up changes."

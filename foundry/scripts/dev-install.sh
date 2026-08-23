#!/usr/bin/env bash
# Compile the WANDS vault into this module and install it for testing — either
# into a local Foundry, or onto the hosted server over WebDAV.
#
#   ./scripts/dev-install.sh              # local install (FOUNDRY_PATH)
#   ./scripts/dev-install.sh --remote     # hosted server, via `molten`
#   ./scripts/dev-install.sh --no-build   # skip `vfmc`, copy what is already here
#
# Local reads FOUNDRY_PATH from foundry/.env (root of the Foundry install — the
# directory containing Data/, App/, Config/...). Windows paths are auto-converted
# under WSL.
#
# Remote uploads to /Data/modules/<id> on the Molten host using `molten`, which
# takes its credentials from moltenhosting/.env. Foundry keeps compendium
# LevelDBs open while a world is loaded, so pushing packs under a running world
# risks a corrupt pack and will certainly not be seen until a reload — return to
# setup first. Unlike the local path this never deletes: files removed from the
# module stay on the server until cleared by hand.
set -euo pipefail

FOUNDRY_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"   # WANDS/foundry
VAULT="$(dirname "$FOUNDRY_DIR")"                                # WANDS

BUILD=1
REMOTE=0
for arg in "$@"; do
  case "$arg" in
    --no-build)       BUILD=0 ;;
    --remote|--server) REMOTE=1 ;;
    *) echo "error: unknown option '$arg' (try --remote or --no-build)." >&2; exit 1 ;;
  esac
done

command -v jq   >/dev/null 2>&1 || { echo "error: jq is required." >&2; exit 1; }
command -v vfmc >/dev/null 2>&1 || { echo "error: vfmc not on PATH (pnpm --filter @wizzlethorpe/foundry-compiler link --global)." >&2; exit 1; }

MODULE_ID="$(jq -r '.id' "$FOUNDRY_DIR/module.json")"

ENV_FILE="$FOUNDRY_DIR/.env"
if [[ $REMOTE -eq 0 && ! -f "$ENV_FILE" ]]; then
  echo "error: $ENV_FILE not found. Copy scripts/.env.example to foundry/.env and set FOUNDRY_PATH." >&2
  exit 1
fi

if [[ $REMOTE -eq 1 ]]; then
  command -v molten >/dev/null 2>&1 || {
    echo "error: molten not on PATH (cd moltenhosting && uv tool install .)." >&2; exit 1; }
  DEST="modules/$MODULE_ID"      # molten resolves a bare path under /Data
else
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
fi

if [[ $BUILD -eq 1 ]]; then
  echo "==> Compiling vault → module (vfmc $VAULT)..."
  vfmc "$VAULT"
fi

# What actually ships, in both modes: the module minus its own tooling.
EXCLUDES=(--exclude=scripts --exclude=.env --exclude=.env.example
          --exclude=.gitignore --exclude=_json)

if [[ $REMOTE -eq 1 ]]; then
  # Staged locally first so the upload is exactly the same tree the local path
  # would have written, excludes and all, rather than re-deriving them per file.
  # A LOCK left by a local Foundry must not travel — it is the running process's,
  # not the pack's, and uploading one wedges the server's copy.
  STAGE="$(mktemp -d)"
  trap 'rm -rf "$STAGE"' EXIT
  rsync -a "${EXCLUDES[@]}" --exclude='packs/*/LOCK' "$FOUNDRY_DIR/" "$STAGE/"

  COUNT="$(find "$STAGE" -type f | wc -l)"
  echo "==> Uploading $COUNT files -> /Data/$DEST"
  echo "    Foundry holds compendium LevelDBs open while a world is loaded."
  echo "    Return to setup first, or the packs may be written under it."
  molten put -r -f "$STAGE" "$DEST"

  echo "Done. Reload the server's world to pick up changes."
else
  echo "==> Syncing $FOUNDRY_DIR -> $DEST"
  mkdir -p "$DEST"
  if ! rsync -a --delete "${EXCLUDES[@]}" "$FOUNDRY_DIR/" "$DEST/"; then
    echo "" >&2
    echo "rsync failed. If you saw 'Permission denied' on packs/*/LOCK or .ldb files," >&2
    echo "Foundry is probably running and holding those LevelDB packs open. Close" >&2
    echo "Foundry, then re-run this script." >&2
    exit 1
  fi

  echo "Done. Restart Foundry (or reload the world) to pick up changes."
fi

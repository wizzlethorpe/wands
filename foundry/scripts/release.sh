#!/bin/bash
# Release this Foundry module: compile the vault with `vfmc`, package the module
# dir into a module.zip, publish a GitHub release, and (optionally) the FoundryVTT
# package registry.
#
# Usage:
#   ./scripts/release.sh          # keep current version
#   ./scripts/release.sh 0.13.0   # bump module.json to 0.13.0

set -e

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; NC='\033[0m'

FOUNDRY_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"   # WANDS/foundry
VAULT="$(dirname "$FOUNDRY_DIR")"                                # WANDS
MODULE_JSON="$FOUNDRY_DIR/module.json"

command -v jq   >/dev/null 2>&1 || { echo -e "${RED}Error: jq is required.${NC}" >&2; exit 1; }
command -v gh   >/dev/null 2>&1 || { echo -e "${RED}Error: GitHub CLI (gh) is required.${NC}" >&2; exit 1; }
command -v zip  >/dev/null 2>&1 || { echo -e "${RED}Error: zip is required.${NC}" >&2; exit 1; }
command -v curl >/dev/null 2>&1 || { echo -e "${RED}Error: curl is required.${NC}" >&2; exit 1; }
command -v vfmc >/dev/null 2>&1 || { echo -e "${RED}Error: vfmc not on PATH.${NC}" >&2; exit 1; }
gh auth status >/dev/null 2>&1  || { echo -e "${RED}Error: gh not authenticated. Run 'gh auth login'.${NC}" >&2; exit 1; }

# Read FOUNDRY_RELEASE_TOKEN literally (avoid source-ing .env).
FOUNDRY_TOKEN=""
if [ -f "$FOUNDRY_DIR/.env" ]; then
  FOUNDRY_TOKEN="$(grep -E '^FOUNDRY_RELEASE_TOKEN=' "$FOUNDRY_DIR/.env" | head -1 \
    | sed -E 's/^FOUNDRY_RELEASE_TOKEN=//; s/^"(.*)"$/\1/; s/^'"'"'(.*)'"'"'$/\1/')"
fi

CURRENT_VERSION=$(jq -r '.version' "$MODULE_JSON")
MODULE_ID=$(jq -r '.id' "$MODULE_JSON")
REPO_URL=$(jq -r '.url' "$MODULE_JSON")

echo -e "${GREEN}Foundry module release: $MODULE_ID${NC}"
echo "========================================"
echo "Current version: $CURRENT_VERSION"
echo ""

if [ -n "${1:-}" ]; then
  NEW_VERSION="$1"
else
  echo -e "${YELLOW}Enter new version (or Enter to keep $CURRENT_VERSION):${NC}"
  read -r NEW_VERSION
  [ -z "$NEW_VERSION" ] && NEW_VERSION="$CURRENT_VERSION"
fi
if ! [[ "$NEW_VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  echo -e "${RED}Error: version must be semver (e.g. 0.13.0)${NC}"; exit 1
fi
TAG="v$NEW_VERSION"
echo "Release version: $NEW_VERSION ($TAG)"
echo ""

# Bump version (vfmc preserves this key).
if [ "$NEW_VERSION" != "$CURRENT_VERSION" ]; then
  echo -e "${YELLOW}Updating module.json version to $NEW_VERSION...${NC}"
  jq --arg v "$NEW_VERSION" '.version = $v' "$MODULE_JSON" > "$MODULE_JSON.tmp" && mv "$MODULE_JSON.tmp" "$MODULE_JSON"
  git -C "$VAULT" add "$MODULE_JSON"
  git -C "$VAULT" commit -m "Foundry module v$NEW_VERSION"
fi

# Rewrite manifest/download to VERSIONED URLs for the released artifact only.
# Foundry's package registry caches manifest responses, so a /releases/latest/
# URL in the shipped module.json can serve a stale version. The repo working
# copy is reset back to /releases/latest/ at the end of this script (dev installs
# and Foundry's "Update Module" re-fetch float on /latest/).
jq --arg base "$REPO_URL/releases/download/$TAG" \
  '.manifest = $base + "/module.json" | .download = $base + "/module.zip"' \
  "$MODULE_JSON" > "$MODULE_JSON.tmp" && mv "$MODULE_JSON.tmp" "$MODULE_JSON"

# Compile packs from the vault (preserves the module.json edits above).
echo -e "${YELLOW}Compiling vault → packs (vfmc)...${NC}"
vfmc "$VAULT"

# Stage the module at the zip root under its id (Foundry expects modules/<id>/).
BUILD_DIR=$(mktemp -d)
MODULE_DIR="$BUILD_DIR/$MODULE_ID"
mkdir -p "$MODULE_DIR"

echo -e "${YELLOW}Packaging module...${NC}"
cp "$MODULE_JSON" "$MODULE_DIR/"
for sub in src styles lang assets packs babele; do
  [ -d "$FOUNDRY_DIR/$sub" ] && cp -r "$FOUNDRY_DIR/$sub" "$MODULE_DIR/"
done
[ -f "$FOUNDRY_DIR/README.md" ] && cp "$FOUNDRY_DIR/README.md" "$MODULE_DIR/"

( cd "$BUILD_DIR" && zip -rq module.zip "$MODULE_ID" )
echo -e "${GREEN}Created module.zip${NC}"

COMPAT_MIN=$(jq -r '.compatibility.minimum' "$MODULE_JSON")
COMPAT_VERIFIED=$(jq -r '.compatibility.verified' "$MODULE_JSON")
DND5E_MIN=$(jq -r '.relationships.requires[]? | select(.id=="dnd5e") | .compatibility.minimum' "$MODULE_JSON")

RELEASE_NOTES="## $MODULE_ID v$NEW_VERSION

### Installation
- **Manifest URL:** \`$REPO_URL/releases/latest/download/module.json\`
- **Direct Download:** \`$REPO_URL/releases/download/$TAG/module.zip\`

### Compatibility
- Foundry VTT v$COMPAT_MIN+ (verified v$COMPAT_VERIFIED)
- D&D 5e system v$DND5E_MIN+"

echo -e "${YELLOW}Creating GitHub release $TAG...${NC}"
if gh release view "$TAG" >/dev/null 2>&1; then
  echo -e "${YELLOW}Release $TAG exists — deleting and recreating...${NC}"
  gh release delete "$TAG" --yes
  git push origin --delete "$TAG" 2>/dev/null || true
fi
gh release create "$TAG" \
  --title "$MODULE_ID $NEW_VERSION" \
  --notes "$RELEASE_NOTES" \
  "$BUILD_DIR/module.zip" \
  "$MODULE_JSON"
echo -e "${GREEN}GitHub release created.${NC}"

# Publish to the FoundryVTT registry (versioned tag URL). Skipped without a token.
if [ -z "$FOUNDRY_TOKEN" ]; then
  echo -e "${YELLOW}Skipping FoundryVTT publish (no FOUNDRY_RELEASE_TOKEN in foundry/.env)${NC}"
else
  echo -e "${YELLOW}Publishing to FoundryVTT Package Registry...${NC}"
  MANIFEST_URL="$REPO_URL/releases/download/$TAG/module.json"
  RESPONSE=$(curl -s -X POST "https://foundryvtt.com/_api/packages/release_version/" \
    -H "Content-Type: application/json" -H "Authorization: $FOUNDRY_TOKEN" \
    -d "{\"id\":\"$MODULE_ID\",\"dry-run\":false,\"release\":{\"version\":\"$NEW_VERSION\",\"manifest\":\"$MANIFEST_URL\",\"notes\":\"$REPO_URL/releases/tag/$TAG\",\"compatibility\":{\"minimum\":\"$COMPAT_MIN\",\"verified\":\"$COMPAT_VERIFIED\"}}}")
  if [ "$(echo "$RESPONSE" | jq -r '.status' 2>/dev/null)" = "success" ]; then
    echo -e "${GREEN}Published to FoundryVTT Package Registry.${NC}"
  else
    echo -e "${RED}FoundryVTT publish failed:${NC}"; echo "$RESPONSE" | jq . 2>/dev/null || echo "$RESPONSE"
  fi
fi

rm -rf "$BUILD_DIR"

# Reset the working-copy module.json to /releases/latest/ URLs. The released zip
# already shipped versioned URLs; the repo floats on /latest/ so dev installs and
# Foundry's "Update Module" re-fetch the moving manifest.
jq --arg repo "$REPO_URL" \
  '.manifest = $repo + "/releases/latest/download/module.json" |
   .download = $repo + "/releases/latest/download/module.zip"' \
  "$MODULE_JSON" > "$MODULE_JSON.tmp" && mv "$MODULE_JSON.tmp" "$MODULE_JSON"

echo ""
echo -e "${GREEN}Release complete.${NC}"
echo "Release URL:  $REPO_URL/releases/tag/$TAG"
echo "Manifest URL: $REPO_URL/releases/latest/download/module.json"

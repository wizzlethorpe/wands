#!/bin/bash
# W.A.N.D.S. Foundry Module Release Script
# Creates a module.zip and publishes a GitHub release.
#
# Usage:
#   ./scripts/release-foundry.sh          # keep current version
#   ./scripts/release-foundry.sh 0.13.0   # bump to 0.13.0

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FOUNDRY_DIR="$REPO_ROOT/foundry"
MODULE_JSON="$FOUNDRY_DIR/module.json"

# Pre-flight checks
command -v jq >/dev/null 2>&1   || { echo -e "${RED}Error: jq is required.${NC}" >&2; exit 1; }
command -v gh >/dev/null 2>&1   || { echo -e "${RED}Error: GitHub CLI (gh) is required.${NC}" >&2; exit 1; }
command -v zip >/dev/null 2>&1  || { echo -e "${RED}Error: zip is required.${NC}" >&2; exit 1; }
command -v curl >/dev/null 2>&1 || { echo -e "${RED}Error: curl is required.${NC}" >&2; exit 1; }
gh auth status >/dev/null 2>&1  || { echo -e "${RED}Error: GitHub CLI not authenticated. Run 'gh auth login'.${NC}" >&2; exit 1; }

# Read FOUNDRY_RELEASE_TOKEN literally — `source`-ing .env eats backslashes in
# Windows paths like FOUNDRY_PATH, so we parse the one key we care about.
FOUNDRY_TOKEN=""
if [ -f "$REPO_ROOT/.env" ]; then
    FOUNDRY_TOKEN="$(grep -E '^FOUNDRY_RELEASE_TOKEN=' "$REPO_ROOT/.env" | head -1 \
        | sed -E 's/^FOUNDRY_RELEASE_TOKEN=//; s/^"(.*)"$/\1/; s/^'"'"'(.*)'"'"'$/\1/')"
fi

CURRENT_VERSION=$(jq -r '.version' "$MODULE_JSON")
MODULE_ID=$(jq -r '.id' "$MODULE_JSON")
REPO_URL=$(jq -r '.url' "$MODULE_JSON")

echo -e "${GREEN}W.A.N.D.S. Foundry Module Release${NC}"
echo "========================================"
echo "Current version: $CURRENT_VERSION"
echo ""

# Get version
if [ -n "$1" ]; then
    NEW_VERSION="$1"
else
    echo -e "${YELLOW}Enter new version (or press Enter to keep $CURRENT_VERSION):${NC}"
    read -r NEW_VERSION
    if [ -z "$NEW_VERSION" ]; then
        NEW_VERSION="$CURRENT_VERSION"
    fi
fi

if ! [[ "$NEW_VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    echo -e "${RED}Error: Version must be in semver format (e.g., 0.13.0)${NC}"
    exit 1
fi

TAG="v$NEW_VERSION"
echo "Release version: $NEW_VERSION ($TAG)"
echo ""

# Update version in module.json
if [ "$NEW_VERSION" != "$CURRENT_VERSION" ]; then
    echo -e "${YELLOW}Updating module.json version to $NEW_VERSION...${NC}"
    jq --arg v "$NEW_VERSION" '.version = $v' "$MODULE_JSON" > "$MODULE_JSON.tmp" && mv "$MODULE_JSON.tmp" "$MODULE_JSON"
    git -C "$REPO_ROOT" add "$MODULE_JSON"
    git -C "$REPO_ROOT" commit -m "Updated foundry module to version $NEW_VERSION"
fi

# Pin manifest + download to GitHub's `releases/latest/download/` aliases.
#
# These URLs MUST stay unversioned in the shipped module.json. Foundry stores
# whatever manifest URL the module is installed from and re-fetches that exact
# URL on "Update Module". If we shipped versioned URLs (e.g. v0.16.0/module.json),
# Foundry would pin the user to that specific release and never see future
# versions — the update button would silently no-op.
#
# Version progression is communicated via the `.version` field plus the GitHub
# tag, not the URL.
jq --arg repo "$REPO_URL" \
    '.manifest = $repo + "/releases/latest/download/module.json" |
     .download = $repo + "/releases/latest/download/module.zip"' \
    "$MODULE_JSON" > "$MODULE_JSON.tmp" && mv "$MODULE_JSON.tmp" "$MODULE_JSON"

# Build data + packs first
echo -e "${YELLOW}Building data and compiling packs...${NC}"
cd "$REPO_ROOT/data" && npm run build:packs
cd "$REPO_ROOT"

# Create zip of foundry/ contents (module expects files at root of zip)
BUILD_DIR=$(mktemp -d)
MODULE_DIR="$BUILD_DIR/$MODULE_ID"
mkdir -p "$MODULE_DIR"

echo -e "${YELLOW}Packaging module...${NC}"
cp "$MODULE_JSON" "$MODULE_DIR/"
cp -r "$FOUNDRY_DIR/src" "$MODULE_DIR/"
cp -r "$FOUNDRY_DIR/styles" "$MODULE_DIR/"
cp -r "$FOUNDRY_DIR/assets" "$MODULE_DIR/"
cp -r "$FOUNDRY_DIR/lang" "$MODULE_DIR/"
cp -r "$FOUNDRY_DIR/packs" "$MODULE_DIR/"
[ -d "$FOUNDRY_DIR/babele" ] && cp -r "$FOUNDRY_DIR/babele" "$MODULE_DIR/"
[ -f "$FOUNDRY_DIR/README.md" ] && cp "$FOUNDRY_DIR/README.md" "$MODULE_DIR/"

cd "$BUILD_DIR"
zip -r module.zip "$MODULE_ID"
cd "$REPO_ROOT"
cp "$BUILD_DIR/module.zip" "$REPO_ROOT/module.zip"
echo -e "${GREEN}Created module.zip${NC}"

# Read compatibility metadata for the release notes from module.json so the
# notes never drift from what the manifest actually declares.
COMPAT_MIN=$(jq -r '.compatibility.minimum' "$MODULE_JSON")
COMPAT_VERIFIED=$(jq -r '.compatibility.verified' "$MODULE_JSON")
DND5E_MIN=$(jq -r '.relationships.requires[] | select(.id=="dnd5e") | .compatibility.minimum' "$MODULE_JSON")

# Create GitHub release
RELEASE_NOTES="## W.A.N.D.S. v$NEW_VERSION

### Installation
- **Manifest URL:** \`$REPO_URL/releases/latest/download/module.json\`
- **Direct Download:** \`$REPO_URL/releases/download/$TAG/module.zip\`

### Compatibility
- Foundry VTT v$COMPAT_MIN+ (verified v$COMPAT_VERIFIED)
- D&D 5e system v$DND5E_MIN+"

echo -e "${YELLOW}Creating GitHub release $TAG...${NC}"

if gh release view "$TAG" >/dev/null 2>&1; then
    echo -e "${YELLOW}Release $TAG already exists. Deleting and recreating...${NC}"
    gh release delete "$TAG" --yes
    git push origin --delete "$TAG" 2>/dev/null || true
fi

gh release create "$TAG" \
    --title "W.A.N.D.S. $NEW_VERSION" \
    --notes "$RELEASE_NOTES" \
    module.zip \
    "$MODULE_JSON"

echo -e "${GREEN}GitHub release created!${NC}"

# Publish to the FoundryVTT package registry. Uses the versioned tag URL so
# the registry records this specific release rather than a moving /latest/
# pointer. Skipped silently if no FOUNDRY_RELEASE_TOKEN is set.
if [ -z "$FOUNDRY_TOKEN" ]; then
    echo -e "${YELLOW}Skipping FoundryVTT publish (no FOUNDRY_RELEASE_TOKEN in .env)${NC}"
else
    echo -e "${YELLOW}Publishing to FoundryVTT Package Registry...${NC}"
    MANIFEST_URL="$REPO_URL/releases/download/$TAG/module.json"
    RESPONSE=$(curl -s -X POST \
        "https://foundryvtt.com/_api/packages/release_version/" \
        -H "Content-Type: application/json" \
        -H "Authorization: $FOUNDRY_TOKEN" \
        -d "{
            \"id\": \"$MODULE_ID\",
            \"dry-run\": false,
            \"release\": {
                \"version\": \"$NEW_VERSION\",
                \"manifest\": \"$MANIFEST_URL\",
                \"notes\": \"$REPO_URL/releases/tag/$TAG\",
                \"compatibility\": {
                    \"minimum\": \"$COMPAT_MIN\",
                    \"verified\": \"$COMPAT_VERIFIED\"
                }
            }
        }")
    STATUS=$(echo "$RESPONSE" | jq -r '.status' 2>/dev/null)
    if [ "$STATUS" = "success" ]; then
        echo -e "${GREEN}Published to FoundryVTT Package Registry!${NC}"
    else
        echo -e "${RED}FoundryVTT publish failed:${NC}"
        echo "$RESPONSE" | jq . 2>/dev/null || echo "$RESPONSE"
    fi
fi

# Cleanup
rm -rf "$BUILD_DIR" "$REPO_ROOT/module.zip"

echo ""
echo -e "${GREEN}Release complete!${NC}"
echo "Release URL:  $REPO_URL/releases/tag/$TAG"
echo "Manifest URL: $REPO_URL/releases/latest/download/module.json"

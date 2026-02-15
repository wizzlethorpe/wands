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
command -v jq >/dev/null 2>&1 || { echo -e "${RED}Error: jq is required.${NC}" >&2; exit 1; }
command -v gh >/dev/null 2>&1 || { echo -e "${RED}Error: GitHub CLI (gh) is required.${NC}" >&2; exit 1; }
command -v zip >/dev/null 2>&1 || { echo -e "${RED}Error: zip is required.${NC}" >&2; exit 1; }
gh auth status >/dev/null 2>&1 || { echo -e "${RED}Error: GitHub CLI not authenticated. Run 'gh auth login'.${NC}" >&2; exit 1; }

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
fi

# Update manifest + download URLs for this release
jq --arg v "$NEW_VERSION" --arg repo "$REPO_URL" \
    '.manifest = $repo + "/releases/download/v" + $v + "/module.json" |
     .download = $repo + "/releases/download/v" + $v + "/module.zip"' \
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

# Create GitHub release
RELEASE_NOTES="## W.A.N.D.S. v$NEW_VERSION

### Installation
- **Manifest URL:** \`$REPO_URL/releases/latest/download/module.json\`
- **Direct Download:** \`$REPO_URL/releases/download/$TAG/module.zip\`

### Compatibility
- Foundry VTT v13+
- D&D 5e system v3+"

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

# Reset URLs back to latest for development
jq --arg repo "$REPO_URL" \
    '.manifest = $repo + "/releases/latest/download/module.json" |
     .download = $repo + "/releases/latest/download/module.zip"' \
    "$MODULE_JSON" > "$MODULE_JSON.tmp" && mv "$MODULE_JSON.tmp" "$MODULE_JSON"

# Cleanup
rm -rf "$BUILD_DIR" "$REPO_ROOT/module.zip"

echo ""
echo -e "${GREEN}Release complete!${NC}"
echo "Release URL: $REPO_URL/releases/tag/$TAG"
echo "Manifest URL: $REPO_URL/releases/download/$TAG/module.json"

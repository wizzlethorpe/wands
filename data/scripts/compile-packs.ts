#!/usr/bin/env tsx
/**
 * Compile dist/foundry/ JSON directories into LevelDB packs at foundry/packs/.
 * Uses @foundryvtt/foundryvtt-cli under the hood.
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const FOUNDRY_DIR = path.resolve(import.meta.dirname, "../dist/foundry");
const PACKS_DIR = path.resolve(import.meta.dirname, "../../foundry/packs");

if (!fs.existsSync(FOUNDRY_DIR)) {
  console.error("No dist/foundry/ directory found. Run `npm run build` first.");
  process.exit(1);
}

fs.mkdirSync(PACKS_DIR, { recursive: true });

const packDirs = fs
  .readdirSync(FOUNDRY_DIR, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

console.log(`Compiling ${packDirs.length} packs to LevelDB...\n`);

for (const pack of packDirs) {
  const inDir = path.join(FOUNDRY_DIR, pack);
  const outDir = path.join(PACKS_DIR, pack);

  // Clean existing pack
  if (fs.existsSync(outDir)) {
    fs.rmSync(outDir, { recursive: true });
  }

  try {
    execSync(`npx fvtt package pack -n "${pack}" --in "${inDir}" --out "${PACKS_DIR}"`, {
      stdio: "pipe",
    });
    const fileCount = fs.readdirSync(inDir).filter((f) => f.endsWith(".json")).length;
    console.log(`  ${pack}: ${fileCount} entries compiled`);
  } catch (err) {
    const e = err as { stderr?: Buffer };
    console.error(`  ${pack}: FAILED — ${e.stderr?.toString().trim()}`);
  }
}

// Copy Babele translation files to foundry/babele/
const BABELE_SRC = path.resolve(import.meta.dirname, "../dist/babele");
const BABELE_DEST = path.resolve(import.meta.dirname, "../../foundry/babele");

if (fs.existsSync(BABELE_SRC)) {
  const locales = fs.readdirSync(BABELE_SRC, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  if (locales.length > 0) {
    // Clean and recreate
    if (fs.existsSync(BABELE_DEST)) {
      fs.rmSync(BABELE_DEST, { recursive: true });
    }
    fs.cpSync(BABELE_SRC, BABELE_DEST, { recursive: true });
    console.log(`\nCopied Babele translations for ${locales.length} locale(s): ${locales.join(", ")}`);
  }
}

console.log("\nDone. LevelDB packs at foundry/packs/");

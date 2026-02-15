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

console.log("\nDone. LevelDB packs at foundry/packs/");

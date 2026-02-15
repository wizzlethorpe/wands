/**
 * One-time migration script: Extract Foundry-specific metadata from packs-json
 * into per-pack overlay files at src/foundry-meta/.
 *
 * For each entity, extracts fields NOT in the TS content schemas:
 *   - img, folder, sort, flags, effects, ownership, _stats
 *   - For actors: prototypeToken, items (embedded docs), plus system fields
 *     not in TS schemas (skills, spells, bonuses, resources, currency, etc.)
 *   - For roll tables: results (with their img, _stats, documentUuid, etc.)
 *
 * Also extracts folder documents into separate .folders.json files.
 *
 * Usage: npx tsx scripts/extract-foundry-meta.ts
 */
import fs from "node:fs";
import path from "node:path";

const PACKS_JSON = path.resolve(import.meta.dirname, "../../foundry/packs-json");
const OUT_DIR = path.resolve(import.meta.dirname, "../src/foundry-meta");

const PACK_DIR_MAP: Record<string, string> = {
  "spells-wands": "spells-wands",
  "items-wands": "items-wands",
  "features-wands": "features-wands",
  "backgrounds-wands": "backgrounds-wands",
  "houses-wands": "houses-wands",
  "casting-styles-and-schools-of-magic-wands": "casting-styles-and-schools-of-magic-wands",
  "monsters-wands": "monsters-wands",
  "magical-pets-wands": "magical-pets-wands",
  "animagus-form-wands": "animagus-form-wands",
  "wands-roll-tables": "wands-roll-tables",
  "background-wands": "backgrounds-wands", // duplicate maps to same output
};

// Actor packs need extra fields extracted
const ACTOR_PACKS = new Set(["monsters-wands", "magical-pets-wands", "animagus-form-wands"]);
const TABLE_PACK = "wands-roll-tables";

interface EntityMeta {
  img?: string;
  folder?: string | null;
  sort?: number;
  ownership?: Record<string, unknown>;
  flags?: Record<string, unknown>;
  effects?: unknown[];
  _stats?: Record<string, unknown>;
  // Actor-specific
  prototypeToken?: Record<string, unknown>;
  items?: unknown[];
  // Extra system fields for actors not in TS schemas
  system?: Record<string, unknown>;
  // Roll table-specific
  results?: unknown[];
}

function extractItemMeta(doc: Record<string, unknown>): EntityMeta {
  const meta: EntityMeta = {};
  if (doc.img) meta.img = doc.img as string;
  if (doc.folder !== undefined) meta.folder = doc.folder as string | null;
  if (doc.sort !== undefined) meta.sort = doc.sort as number;
  if (doc.ownership) meta.ownership = doc.ownership as Record<string, unknown>;
  if (doc.flags && Object.keys(doc.flags as object).length > 0) {
    meta.flags = doc.flags as Record<string, unknown>;
  }
  if (doc.effects && (doc.effects as unknown[]).length > 0) {
    meta.effects = doc.effects as unknown[];
  }
  if (doc._stats) meta._stats = doc._stats as Record<string, unknown>;
  return meta;
}

function extractActorMeta(doc: Record<string, unknown>): EntityMeta {
  const meta = extractItemMeta(doc);

  // Actors have prototypeToken, items (embedded docs), and extra system fields
  if (doc.prototypeToken) {
    meta.prototypeToken = doc.prototypeToken as Record<string, unknown>;
  }
  if (doc.items && (doc.items as unknown[]).length > 0) {
    meta.items = doc.items as unknown[];
  }

  // Extract system fields that are NOT in the TS creature/pet/animagus schemas
  // TS schemas have: description, source, details, traits, attributes, abilities
  // Foundry JSON also has: skills, spells, bonuses, resources, currency, newskills
  const sys = doc.system as Record<string, unknown> | undefined;
  if (sys) {
    const extraSystemFields: Record<string, unknown> = {};
    const extraKeys = ["skills", "spells", "bonuses", "resources", "currency", "newskills"];
    for (const key of extraKeys) {
      if (sys[key] !== undefined) {
        extraSystemFields[key] = sys[key];
      }
    }
    if (Object.keys(extraSystemFields).length > 0) {
      meta.system = extraSystemFields;
    }
  }

  return meta;
}

function extractTableMeta(doc: Record<string, unknown>): EntityMeta {
  const meta: EntityMeta = {};
  if (doc.img) meta.img = doc.img as string;
  if (doc.folder !== undefined) meta.folder = doc.folder as string | null;
  if (doc.sort !== undefined) meta.sort = doc.sort as number;
  if (doc.ownership) meta.ownership = doc.ownership as Record<string, unknown>;
  if (doc.flags && Object.keys(doc.flags as object).length > 0) {
    meta.flags = doc.flags as Record<string, unknown>;
  }
  if (doc._stats) meta._stats = doc._stats as Record<string, unknown>;

  // Roll table results contain Foundry-specific fields (img, _stats, documentUuid, _key)
  // that aren't in the TS RollTableEntry schema
  if (doc.results && (doc.results as unknown[]).length > 0) {
    meta.results = doc.results as unknown[];
  }

  return meta;
}

function main() {
  if (!fs.existsSync(PACKS_JSON)) {
    console.error("packs-json directory not found:", PACKS_JSON);
    process.exit(1);
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });

  // Track which output packs we've already processed (avoid duplicate from background-wands)
  const processedOutputs = new Set<string>();

  for (const entry of fs.readdirSync(PACKS_JSON, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const outputPack = PACK_DIR_MAP[entry.name];
    if (!outputPack || processedOutputs.has(outputPack)) continue;
    processedOutputs.add(outputPack);

    const dirPath = path.join(PACKS_JSON, entry.name);
    const overlay: Record<string, EntityMeta> = {};
    const folders: Record<string, unknown>[] = [];

    const isActorPack = ACTOR_PACKS.has(outputPack);
    const isTablePack = outputPack === TABLE_PACK;

    for (const file of fs.readdirSync(dirPath)) {
      if (!file.endsWith(".json")) continue;
      try {
        const data = JSON.parse(fs.readFileSync(path.join(dirPath, file), "utf-8"));
        const id = data._id as string;
        if (!id) continue;

        // Folder document?
        if (data._key?.startsWith("!folders!")) {
          folders.push(data);
          continue;
        }

        // Extract metadata based on pack type
        if (isActorPack) {
          overlay[id] = extractActorMeta(data);
        } else if (isTablePack) {
          overlay[id] = extractTableMeta(data);
        } else {
          overlay[id] = extractItemMeta(data);
        }
      } catch {
        // skip invalid JSON
      }
    }

    // Write overlay file
    const overlayPath = path.join(OUT_DIR, `${outputPack}.json`);
    fs.writeFileSync(overlayPath, JSON.stringify(overlay, null, 2), "utf-8");
    console.log(`  ${outputPack}.json: ${Object.keys(overlay).length} entities`);

    // Write folders file (only if there are folders)
    if (folders.length > 0) {
      const foldersPath = path.join(OUT_DIR, `${outputPack}.folders.json`);
      fs.writeFileSync(foldersPath, JSON.stringify(folders, null, 2), "utf-8");
      console.log(`  ${outputPack}.folders.json: ${folders.length} folders`);
    }
  }

  console.log(`\nDone. Overlay files written to ${OUT_DIR}`);
}

main();

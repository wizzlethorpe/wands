/**
 * One-time migration script: Generate TS entity files + locale entries
 * for loot items (potion ingredients + books) from old packs-json.
 *
 * Usage: npx tsx scripts/migrate-loot-items.ts
 */
import fs from "node:fs";
import path from "node:path";

const PACKS_JSON = path.resolve(import.meta.dirname, "../../foundry/packs-json/items-wands");
const ITEMS_DIR = path.resolve(import.meta.dirname, "../src/data/items");
const LOCALE_FILE = path.resolve(import.meta.dirname, "../src/locales/en/items.json");
const INDEX_FILE = path.resolve(import.meta.dirname, "../src/data/items/index.ts");

/** Convert a name to a kebab-case id */
function toKebab(name: string): string {
  return name
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Convert a kebab-case id to a camelCase variable name */
function toCamel(kebab: string): string {
  return kebab.replace(/-([a-z])/g, (_m, c) => c.toUpperCase());
}

/**
 * Convert a Foundry HTML description to markdown for locale storage.
 * Strips HTML tags and converts @UUID/@Compendium refs to wikilinks.
 */
function descHtmlToMarkdown(html: string): string {
  if (!html) return "";
  return html
    .replace(/@UUID\[([^\]]+)\]\{([^}]+)\}/g, "[[$2]]")
    .replace(/@Compendium\[([^\]]+)\]\{([^}]+)\}/g, "[[$2]]")
    .replace(/<hr\s*\/?>/gi, "\n\n---\n\n")
    .replace(/<\/p>\s*<p>/gi, "\n\n")
    .replace(/<p>/gi, "")
    .replace(/<\/p>/gi, "")
    .replace(/<strong>/gi, "**")
    .replace(/<\/strong>/gi, "**")
    .replace(/<em>/gi, "*")
    .replace(/<\/em>/gi, "*")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<ul>/gi, "")
    .replace(/<\/ul>/gi, "")
    .replace(/<li>/gi, "- ")
    .replace(/<\/li>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function main() {
  // Read existing TS foundryIds to skip already-migrated items
  const existingIds = new Set<string>();
  for (const f of fs.readdirSync(ITEMS_DIR)) {
    if (!f.endsWith(".ts") || f === "index.ts") continue;
    const content = fs.readFileSync(path.join(ITEMS_DIR, f), "utf-8");
    const match = content.match(/foundryId:\s*"([^"]+)"/);
    if (match) existingIds.add(match[1]);
  }

  // Find loot items not yet in TS source
  const toMigrate: Array<{
    id: string;
    name: string;
    foundryId: string;
    rarity: string;
    priceValue: number;
    priceDenom: string;
    weight: number;
    description: string;
  }> = [];

  for (const f of fs.readdirSync(PACKS_JSON).sort()) {
    if (!f.endsWith(".json")) continue;
    const data = JSON.parse(fs.readFileSync(path.join(PACKS_JSON, f), "utf-8"));
    if (data.type !== "loot") continue;
    if (existingIds.has(data._id)) continue;

    toMigrate.push({
      id: toKebab(data.name),
      name: data.name,
      foundryId: data._id,
      rarity: data.system?.rarity ?? "common",
      priceValue: data.system?.price?.value ?? 0,
      priceDenom: data.system?.price?.denomination ?? "gp",
      weight: data.system?.weight ?? 0,
      description: data.system?.description?.value ?? "",
    });
  }

  console.log(`Found ${toMigrate.length} loot items to migrate`);

  // Load existing locale JSON
  const locale: Record<string, { name: string; description: string }> = JSON.parse(
    fs.readFileSync(LOCALE_FILE, "utf-8"),
  );

  // Read existing index.ts to find insertion points
  let indexContent = fs.readFileSync(INDEX_FILE, "utf-8");

  // Collect new exports and variable names
  const newExports: string[] = [];
  const newVarNames: string[] = [];

  for (const item of toMigrate) {
    const varName = toCamel(item.id);
    const fileName = item.id;

    // Generate TS entity file
    const tsContent = `import { ItemSchema } from "../../schemas/index.js";

export const ${varName} = ItemSchema.parse({
  id: "${item.id}",
  foundryId: "${item.foundryId}",
  type: "loot",
  source: "W&W",
  rarity: "${item.rarity}",
  price: { value: ${item.priceValue}, denomination: "${item.priceDenom}" },
  weight: ${item.weight},
  quantity: 1,
});
`;
    fs.writeFileSync(path.join(ITEMS_DIR, `${fileName}.ts`), tsContent, "utf-8");

    // Add locale entries (flat dot-notation keys matching t() expectations)
    const mdDesc = descHtmlToMarkdown(item.description);
    locale[`${item.id}.name`] = item.name as any;
    locale[`${item.id}.description`] = mdDesc as any;

    newExports.push(`export { ${varName} } from "./${fileName}.js";`);
    newVarNames.push(varName);
  }

  // Write updated locale JSON (sorted keys)
  const sortedLocale: Record<string, { name: string; description: string }> = {};
  for (const key of Object.keys(locale).sort()) {
    sortedLocale[key] = locale[key];
  }
  fs.writeFileSync(LOCALE_FILE, JSON.stringify(sortedLocale, null, 2) + "\n", "utf-8");

  // Reconstruct index.ts from scratch — parse existing exports, add new ones
  const exportLines = indexContent
    .split("\n")
    .filter((l) => l.startsWith("export {") && l.includes("from"));
  const existingExportNames = exportLines.map((l) => {
    const m = l.match(/export \{ (\w+) \}/);
    return m ? m[1] : "";
  }).filter(Boolean);

  // Combine existing + new variable names
  const allVarNames = [...existingExportNames, ...newVarNames];

  // Reconstruct all export lines (existing + new)
  const allExportLines = [...exportLines, ...newExports];

  // Build the new index.ts
  const newIndex = [
    ...allExportLines,
    "",
    "// All entries as an array",
    `import { ${allVarNames.join(", ")} } from "./index.js";`,
    `import type { Item } from "../../schemas/index.js";`,
    `export const all: Item[] = [${allVarNames.join(", ")}];`,
    "",
  ].join("\n");

  fs.writeFileSync(INDEX_FILE, newIndex, "utf-8");

  console.log(`Generated ${toMigrate.length} TS files`);
  console.log(`Updated locale with ${toMigrate.length} entries`);
  console.log(`Updated index.ts with new exports`);
}

main();

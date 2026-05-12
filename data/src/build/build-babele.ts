/**
 * Generate Babele-compatible translation JSON files for non-English locales.
 *
 * Babele is the community standard for runtime compendium translation in
 * Foundry VTT. Each pack gets a JSON file with entries keyed by original
 * (English) name, containing the translated name and HTML description.
 *
 * Output goes to dist/foundry/babele/<locale>/<pack-name>.json.
 */
import fs from "node:fs";
import path from "node:path";
import { t, availableLocales } from "./utils/i18n.js";
import { markdownToHtml } from "./utils/html.js";
import { buildLinkResolver, collectEntityRefs } from "./utils/link-resolver.js";
import type { LinkResolver } from "./utils/link-resolver.js";
import type { RollTable } from "../schemas/roll-table.js";

const DIST = path.resolve(import.meta.dirname, "../../dist/babele");

/** Module ID used as prefix in Babele file names (e.g. wands.spells-wands.json) */
const MODULE_ID = "wands";

/** Pack name → locale namespace mapping */
const PACK_NAMESPACE: Record<string, string> = {
  "spells-wands": "spells",
  "items-wands": "items",
  "monsters-wands": "creatures",
  "features-wands": "features",
  "backgrounds-wands": "backgrounds",
  "houses-wands": "houses",
  "casting-styles-and-schools-of-magic-wands": "casting-styles",
  "animagus-form-wands": "animagus-forms",
  "magical-pets-wands": "magical-pets",
  "wands-roll-tables": "roll-tables",
};

/** Pack name → Foundry compendium label */
const PACK_LABELS: Record<string, string> = {
  "spells-wands": "Spells (WANDS)",
  "items-wands": "Items (WANDS)",
  "monsters-wands": "Monsters (WANDS)",
  "features-wands": "Features (WANDS)",
  "backgrounds-wands": "Backgrounds (WANDS)",
  "houses-wands": "Houses (WANDS)",
  "casting-styles-and-schools-of-magic-wands": "Casting Styles and Schools of Magic (WANDS)",
  "animagus-form-wands": "Animagus Form (WANDS)",
  "magical-pets-wands": "Magical Pets (WANDS)",
  "wands-roll-tables": "WANDS Roll Tables (WANDS)",
};

interface BaseEntry {
  id: string;
}

interface BabeleEntry {
  name: string;
  description?: string;
  results?: Record<string, string>;
}

export interface BuildBabeleOptions {
  locale?: string;
  linkResolver: LinkResolver;
  spells?: BaseEntry[];
  items?: BaseEntry[];
  creatures?: BaseEntry[];
  features?: BaseEntry[];
  backgrounds?: BaseEntry[];
  houses?: BaseEntry[];
  castingStyles?: BaseEntry[];
  animagusForms?: BaseEntry[];
  magicalPets?: BaseEntry[];
  rollTables?: RollTable[];
}

export function buildBabele(opts: BuildBabeleOptions) {
  const locales = availableLocales().filter((l) => l !== "en");

  if (locales.length === 0) {
    console.log("[build-babele] No non-English locales found, skipping");
    return;
  }

  /** Map pack name → array of entity data */
  const packData: Record<string, { entries: BaseEntry[]; isRollTable?: boolean }> = {
    "spells-wands": { entries: opts.spells ?? [] },
    "items-wands": { entries: opts.items ?? [] },
    "monsters-wands": { entries: opts.creatures ?? [] },
    "features-wands": { entries: opts.features ?? [] },
    "backgrounds-wands": { entries: opts.backgrounds ?? [] },
    "houses-wands": { entries: opts.houses ?? [] },
    "casting-styles-and-schools-of-magic-wands": { entries: opts.castingStyles ?? [] },
    "animagus-form-wands": { entries: opts.animagusForms ?? [] },
    "magical-pets-wands": { entries: opts.magicalPets ?? [] },
    "wands-roll-tables": { entries: opts.rollTables ?? [], isRollTable: true },
  };

  for (const locale of locales) {
    const localeDir = path.join(DIST, locale);
    fs.mkdirSync(localeDir, { recursive: true });

    // Build a link resolver keyed by *this locale's* translated names so
    // wikilinks inside translated descriptions ([[Піклувальник]] etc.)
    // resolve to @UUID instead of falling back to bare text. Fall back to
    // the English resolver for wikilinks that translators left in English
    // (e.g. [[Magical Adrenaline]]).
    const refs = {
      spells: opts.spells,
      items: opts.items,
      creatures: opts.creatures,
      features: opts.features,
      backgrounds: opts.backgrounds,
      houses: opts.houses,
      castingStyles: opts.castingStyles,
      animagusForms: opts.animagusForms,
      magicalPets: opts.magicalPets,
      rollTables: opts.rollTables,
    };
    const localeResolver = buildLinkResolver(collectEntityRefs(refs, locale, t));
    const enResolver = buildLinkResolver(collectEntityRefs(refs, "en", t));
    const lr: LinkResolver = (name) => localeResolver(name) ?? enResolver(name);

    let totalEntries = 0;

    for (const [packName, { entries, isRollTable }] of Object.entries(packData)) {
      const ns = PACK_NAMESPACE[packName];
      const babeleEntries: Record<string, BabeleEntry> = {};

      for (const entry of entries) {
        const enName = t(`${ns}.${entry.id}.name`, "en");
        const localeName = t(`${ns}.${entry.id}.name`, locale);
        const localeDesc = t(`${ns}.${entry.id}.description`, locale);

        // Skip if no translation exists (name resolves to the raw key or to English)
        const enNameKey = `${ns}.${entry.id}.name`;
        const hasTranslatedName = localeName !== enNameKey && localeName !== enName;
        const enDescKey = `${ns}.${entry.id}.description`;
        const enDesc = t(enDescKey, "en");
        const hasTranslatedDesc = localeDesc !== enDescKey && localeDesc !== enDesc;

        if (!hasTranslatedName && !hasTranslatedDesc && !isRollTable) continue;

        const babeleEntry: BabeleEntry = { name: localeName };

        // Convert description markdown to HTML for Foundry
        if (hasTranslatedDesc) {
          babeleEntry.description = markdownToHtml(localeDesc, lr);
        }

        // Roll table results mapping
        if (isRollTable) {
          const rtEntry = entry as unknown as RollTable;
          const results: Record<string, string> = {};
          let hasTranslatedResults = false;

          for (const e of rtEntry.entries) {
            const enText = t(e.text, "en");
            const localeText = t(e.text, locale);
            if (localeText !== e.text && localeText !== enText) {
              results[enText] = localeText;
              hasTranslatedResults = true;
            }
          }

          if (hasTranslatedResults) {
            babeleEntry.results = results;
          }

          // Skip roll table if nothing is translated
          if (!hasTranslatedName && !hasTranslatedDesc && !hasTranslatedResults) continue;
        }

        babeleEntries[enName] = babeleEntry;
        totalEntries++;
      }

      const babeleFile = {
        label: PACK_LABELS[packName] ?? packName,
        entries: babeleEntries,
      };

      fs.writeFileSync(
        path.join(localeDir, `${MODULE_ID}.${packName}.json`),
        JSON.stringify(babeleFile, null, 2) + "\n",
        "utf-8",
      );
    }

    console.log(`[build-babele] ${locale}: ${totalEntries} translated entries across ${Object.keys(packData).length} packs`);
  }
}

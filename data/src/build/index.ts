/**
 * Main build entry point — runs both Foundry and Quartz builds.
 *
 * Usage:
 *   npm run build                  # build English
 *   npm run build -- --locale=es   # build Spanish
 */
import { buildFoundry } from "./build-foundry.js";
import { buildQuartz } from "./build-quartz.js";
import { buildBabele } from "./build-babele.js";
import { all as spells } from "../data/spells/index.js";
import { all as items } from "../data/items/index.js";
import { all as creatures } from "../data/creatures/index.js";
import { all as features } from "../data/features/index.js";
import { all as backgrounds } from "../data/backgrounds/index.js";
import { all as houses } from "../data/houses/index.js";
import { all as castingStyles } from "../data/casting-styles/index.js";
import { all as animagusForms } from "../data/animagus-forms/index.js";
import { all as magicalPets } from "../data/magical-pets/index.js";
import { all as rollTables } from "../data/roll-tables/index.js";
import { t } from "./utils/i18n.js";
import { buildLinkResolver, collectEntityRefs } from "./utils/link-resolver.js";

const locale = process.argv.find((a) => a.startsWith("--locale="))?.split("=")[1] ?? "en";

console.log(`Building wands-data (locale: ${locale})...\n`);

const data = {
  locale,
  spells,
  items,
  creatures,
  features,
  backgrounds,
  houses,
  // These packs use Feature/Creature schemas in Foundry — cast to expected build types
  castingStyles: castingStyles as any[],
  animagusForms: animagusForms as any[],
  magicalPets: magicalPets as any[],
  rollTables,
};

// Build link resolver from all entities for @UUID cross-referencing
const entityRefs = collectEntityRefs(data, locale, t);
const linkResolver = buildLinkResolver(entityRefs);
console.log(`[link-resolver] ${entityRefs.length} entities indexed for @UUID resolution\n`);

buildFoundry({ ...data, linkResolver });
console.log();
buildQuartz(data);
console.log();
buildBabele({ ...data, linkResolver });

console.log("\nDone.");

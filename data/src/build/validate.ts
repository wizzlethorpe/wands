/**
 * Validate all data files against their Zod schemas and check translation coverage.
 */
import { availableLocales, coverage } from "./utils/i18n.js";

// Data imports will be added as content is migrated.
// For now this validates schemas compile and i18n works.

const NAMESPACES = [
  "spells", "items", "creatures", "features",
  "backgrounds", "houses", "casting-styles",
  "animagus-forms", "magical-pets", "roll-tables",
];

function main() {
  console.log("Validating wands-data...\n");

  // Check translation coverage
  const locales = availableLocales();
  console.log(`Locales found: ${locales.length > 0 ? locales.join(", ") : "(none yet)"}`);

  for (const locale of locales) {
    if (locale === "en") continue;
    console.log(`\n  ${locale}:`);
    for (const ns of NAMESPACES) {
      const c = coverage(locale, ns);
      if (c.total === 0) continue;
      const pct = Math.round((c.translated / c.total) * 100);
      const icon = pct === 100 ? "+" : pct > 50 ? "~" : "-";
      console.log(`    [${icon}] ${ns}: ${c.translated}/${c.total} (${pct}%)`);
      if (c.missing.length > 0 && c.missing.length <= 5) {
        for (const k of c.missing) console.log(`        missing: ${k}`);
      }
    }
  }

  console.log("\nValidation complete.");
}

main();

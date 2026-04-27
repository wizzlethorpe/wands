import { CastingStyleSchema } from "../../schemas/index.js";

/**
 * Charms — school of magic subclass.
 *
 * Source: site/content/Rules/Chapter 3 - Schools of Magic.md (Charms section).
 *
 * Pick one of two features at L1, L6, L10, L14, L18 — modeled as `choices`
 * pools so dnd5e prompts the player at each subclass-feature level.
 *
 * `classIdentifier` is left empty here in the source data; build-foundry's
 * `expandSubclassesPerCaster` fans this entry out into one variant per
 * casting-style class with the matching identifier set.
 */
export const charmsSchoolOfMagic = CastingStyleSchema.parse({
  id: "charms-school-of-magic",
  foundryId: "n31KaJnrCwRtUyuR",
  type: "subclass",
  identifier: "charms",
  classIdentifier: "",
  source: "W&W",
  spellcastingProgression: "none",

  choices: [
    { title: "Bewitching Studies",   pool: ["called-shot",       "protective-enchantments"], picksByLevel: { "1":  1 } },
    { title: "Advanced Charmswork",  pool: ["target-practice",   "professional-charmer"],    picksByLevel: { "6":  1 } },
    { title: "Unique Talents",       pool: ["muggle-dueling",    "obliviator"],              picksByLevel: { "10": 1 } },
    { title: "Refined Techniques",   pool: ["wand-and-shield",   "a-duty-to-protect"],       picksByLevel: { "14": 1 } },
    { title: "Pinnacle of Casting",  pool: ["lightning-fast-wand", "secret-keeper"],         picksByLevel: { "18": 1 } },
  ],
});

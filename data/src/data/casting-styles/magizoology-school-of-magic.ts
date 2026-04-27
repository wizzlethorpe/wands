import { CastingStyleSchema } from "../../schemas/index.js";

/**
 * Magizoology — school of magic subclass.
 *
 * Source: site/content/Rules/Chapter 3 - Schools of Magic.md (Magizoology section).
 */
export const magizoologySchoolOfMagic = CastingStyleSchema.parse({
  id: "magizoology-school-of-magic",
  foundryId: "6Z6ChZqL42lSkjnH",
  type: "subclass",
  identifier: "magizoology",
  classIdentifier: "",
  source: "W&W p.25",
  spellcastingProgression: "none",

  choices: [
    { title: "Field Studies",        pool: ["beast-bond",     "monster-hunter-training"], picksByLevel: { "1":  1 } },
    { title: "Creature Companion",   pool: ["loyal-beast",    "hunters-instincts"],       picksByLevel: { "6":  1 } },
    { title: "Advanced Studies",     pool: ["improved-bond",  "expert-hunter"],           picksByLevel: { "10": 1 } },
    { title: "Master Magizoologist", pool: ["alpha-beast",    "creature-slayer"],         picksByLevel: { "14": 1 } },
    { title: "Legendary Status",     pool: ["phoenix-bond",   "master-hunter"],           picksByLevel: { "18": 1 } },
  ],
});

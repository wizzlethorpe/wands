import { CastingStyleSchema } from "../../schemas/index.js";

/**
 * Magizoology — school of magic subclass.
 *
 * Source: W&W v1.4 rulebook (wands/source/), pp. 25–26.
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
    { title: "Biological Studies", pool: ["caretaker",         "folio-bruti"],              picksByLevel: { "1":  1 } },
    { title: "Way of the Wild",    pool: ["wizards-best-friend", "prepared-ambush"],        picksByLevel: { "6":  1 } },
    { title: "Outdoorswizard",     pool: ["survivalist",       "monster-hunting"],          picksByLevel: { "10": 1 } },
    { title: "Genus Genius",       pool: ["beast-whisperer",   "exploited-vulnerabilities"], picksByLevel: { "14": 1 } },
    { title: "Sixth Sense",        pool: ["draconic-empathy",  "hunters-reflexes"],         picksByLevel: { "18": 1 } },
  ],
});

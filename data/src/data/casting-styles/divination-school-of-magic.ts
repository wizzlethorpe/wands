import { CastingStyleSchema } from "../../schemas/index.js";

/**
 * Divination — school of magic subclass.
 *
 * Source: site/content/Rules/Chapter 3 - Schools of Magic.md (Divination section).
 *
 * Both L10 and L14 are titled "Omens and Portents" in Chapter 3 (likely an
 * unintentional duplicate name); the picks themselves differ between levels.
 */
export const divinationSchoolOfMagic = CastingStyleSchema.parse({
  id: "divination-school-of-magic",
  foundryId: "vywxjPPtRgn5UDBd",
  type: "subclass",
  identifier: "divination",
  classIdentifier: "",
  source: "W&W p.23",
  spellcastingProgression: "none",

  choices: [
    { title: "Unexplained Senses",   pool: ["glimpsing-the-future",  "mind-reading"],            picksByLevel: { "1":  1 } },
    { title: "Divination Skills",    pool: ["crystal-ball",          "improved-legilimency"],    picksByLevel: { "6":  1 } },
    { title: "Omens and Portents",   pool: ["improved-premonitions", "improved-mind-reading"],   picksByLevel: { "10": 1 } },
    { title: "Omens and Portents II", pool: ["the-third-eye",        "total-legilimency"],       picksByLevel: { "14": 1 } },
    { title: "Undeniable Power",     pool: ["prophecy",              "total-recall"],            picksByLevel: { "18": 1 } },
  ],
});

import { CastingStyleSchema } from "../../schemas/index.js";

/**
 * Divination — school of magic subclass.
 *
 * Source: W&W v1.4 rulebook (wands/source/), pp. 23–24.
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
    { title: "Clairvoyant Studies", pool: ["fortune-teller",  "sensing-danger"],    picksByLevel: { "1":  1 } },
    { title: "Farseeing",           pool: ["foresight",       "legilimency"],       picksByLevel: { "6":  1 } },
    { title: "The Unseeable",       pool: ["palmistry",       "skilled-occlumens"], picksByLevel: { "10": 1 } },
    { title: "Revealed Intentions", pool: ["aura-reading",    "darting-eyes"],      picksByLevel: { "14": 1 } },
    { title: "Mystical Knowledge",  pool: ["vivid-visions",   "master-of-minds"],   picksByLevel: { "18": 1 } },
  ],
});

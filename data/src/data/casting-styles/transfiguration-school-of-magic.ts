import { CastingStyleSchema } from "../../schemas/index.js";

/**
 * Transfiguration — school of magic subclass.
 *
 * Source: site/content/Rules/Chapter 3 - Schools of Magic.md (Transfiguration section).
 *
 * The Animagus Transformation feature picked at L6 unlocks the rest of the
 * "Your Animagus Form" rules in Chapter 3 (Combat / Evasion form choice etc.) —
 * those are handled in narrative play, not modeled as advancement entries.
 */
export const transfigurationSchoolOfMagic = CastingStyleSchema.parse({
  id: "transfiguration-school-of-magic",
  foundryId: "zR5SEFVXzxkr4A5T",
  type: "subclass",
  identifier: "transfiguration",
  classIdentifier: "",
  source: "W&W p.19",
  spellcastingProgression: "none",

  choices: [
    { title: "Scientific Studies",      pool: ["anatomy-textbook",        "intuitive-conversion"],   picksByLevel: { "1":  1 } },
    { title: "Transfiguration Prodigy", pool: ["animagus-transformation", "elementalist"],           picksByLevel: { "6":  1 } },
    { title: "Precise Control",         pool: ["partial-transfiguration", "molding-the-elements"],   picksByLevel: { "10": 1 } },
    { title: "Magically Reinforced",    pool: ["durable-constructs",      "fortified-structures"],   picksByLevel: { "14": 1 } },
    { title: "Molecular Manipulator",   pool: ["apex-predator",           "true-alchemist"],         picksByLevel: { "18": 1 } },
  ],
});

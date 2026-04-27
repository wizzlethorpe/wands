import { CastingStyleSchema } from "../../schemas/index.js";

/**
 * Jinxes, Hexes & Curses — school of magic subclass.
 *
 * Source: site/content/Rules/Chapter 3 - Schools of Magic.md (Jinxes, Hexes, and Curses section).
 *
 * The L18 "Legendary" feature is a 3-option pick (Auror Alert / Unravelling
 * Magic / Fractured Soul) — the only school in Chapter 3 with three options
 * at a level. The data slug `unraveling-magic` uses US spelling; the chapter
 * uses UK spelling ("Unravelling") in display text.
 */
export const jinxesHexesAndCursesSchoolOfMagic = CastingStyleSchema.parse({
  id: "jinxes-hexes-and-curses-school-of-magic",
  foundryId: "VdxlU1YFkJGwlJSY",
  type: "subclass",
  identifier: "jinxes-hexes-and-curses",
  classIdentifier: "",
  source: "W&W p.18",
  spellcastingProgression: "none",

  choices: [
    { title: "Practical Studies",  pool: ["auror-training", "curse-breaking"],                              picksByLevel: { "1":  1 } },
    { title: "Combat-Ready",       pool: ["forceful-magic", "magical-adrenaline"],                          picksByLevel: { "6":  1 } },
    { title: "Specialized Skills", pool: ["dark-traces",    "ward-breaker"],                                picksByLevel: { "10": 1 } },
    { title: "Cursemaster",        pool: ["dark-duelist",   "defensive-arts"],                              picksByLevel: { "14": 1 } },
    { title: "Legendary",          pool: ["auror-alert",    "unraveling-magic", "fractured-soul"],          picksByLevel: { "18": 1 } },
  ],
});

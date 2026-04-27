import { CastingStyleSchema } from "../../schemas/index.js";

/**
 * Technique Caster — d6, full caster, WIS-based.
 *
 * Source: site/content/Rules/Chapter 2 - Casting Styles.md (Technique Class Table).
 *
 * Implicit advancement entries added by the build (do NOT list them here):
 *   - HitPoints (every level)
 *   - Subclass pick at level 1 (the School of Magic dialog)
 *   - AbilityScoreImprovement at levels 4, 8, 12, 16, 19
 *
 * Technique scales metamagic faster than Willpower / Intellect: 8 known by L18
 * vs 4 known by L17.
 */
export const techniqueCaster = CastingStyleSchema.parse({
  id: "technique-caster",
  foundryId: "yIqpcDpoUmFoJI3U",
  type: "class",
  identifier: "technique-caster",
  source: "W&W p.13",
  hitDice: "d6",
  primaryAbility: ["wis"],
  saves: ["int", "wis"],
  spellcastingAbility: "wis",
  spellcastingProgression: "full",

  progression: {
    "1":  { grants: ["spellcasting-technique", "school-of-magic"] },
    "2":  { grants: ["font-of-magic-technique"] },
    "3":  { grants: ["metamagic", "spell-deflection"] },
    "9":  { grants: ["apparition-lessons"] },
    "20": { grants: ["sorcerous-restoration"] },
  },

  choices: [{
    title: "Metamagic",
    pool: [
      "metamagic-careful-spell",
      "metamagic-distant-spell",
      "metamagic-empowered-spell",
      "metamagic-extended-spell",
      "metamagic-heightened-spell",
      "metamagic-quickened-spell",
      "metamagic-subtle-spell",
      "metamagic-twinned-spell",
    ],
    // 2 picks at L3, then +1 at L5/7/9/12/15/18 → 8 known total.
    picksByLevel: { "3": 2, "5": 1, "7": 1, "9": 1, "12": 1, "15": 1, "18": 1 },
  }],

  scaleValues: [
    {
      identifier: "sorcery-points",
      title: "Sorcery Points",
      values: {
        "1": null, "2":  3, "3":  4, "4":  5, "5":  7,
        "6":  8,   "7":  9, "8": 10, "9": 12, "10": 13,
        "11": 14, "12": 15, "13": 17, "14": 18, "15": 19,
        "16": 20, "17": 22, "18": 23, "19": 24, "20": 25,
      },
    },
    {
      identifier: "metamagic-known",
      title: "Metamagic Known",
      values: { "3": 2, "5": 3, "7": 4, "9": 5, "12": 6, "15": 7, "18": 8 },
    },
    {
      identifier: "cantrips-known",
      title: "Cantrips Known",
      values: {
        "1":  4, "2":  4, "3":  4, "4":  5, "5":  5,
        "6":  5, "7":  6, "8":  6, "9":  6, "10": 7,
        "11": 7, "12": 7, "13": 8, "14": 8, "15": 8,
        "16": 8, "17": 9, "18": 9, "19": 9, "20": 9,
      },
    },
    {
      identifier: "spells-known",
      title: "Spells Known",
      values: {
        "1":  4,  "2":  5,  "3":  6,  "4":  7,  "5": 10,
        "6": 11,  "7": 12,  "8": 13,  "9": 16,  "10": 17,
        "11": 18, "12": 18, "13": 21, "14": 21, "15": 22,
        "16": 22, "17": 25, "18": 25, "19": 25, "20": 25,
      },
    },
  ],
});

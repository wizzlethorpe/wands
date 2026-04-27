import { CastingStyleSchema } from "../../schemas/index.js";

/**
 * Intellect Caster — d8, full caster, INT-based.
 *
 * Source: site/content/Rules/Chapter 2 - Casting Styles.md (Intellect Class Table).
 *
 * Implicit advancement entries added by the build (do NOT list them here):
 *   - HitPoints (every level)
 *   - Subclass pick at level 1 (the School of Magic dialog)
 *   - AbilityScoreImprovement at levels 4, 8, 12, 16, 19
 *
 * Intellect knows the most cantrips/spells of the three casters and gains
 * Ritual Casting at L1 plus Diverse Studies at L3.
 */
export const intellectCaster = CastingStyleSchema.parse({
  id: "intellect-caster",
  foundryId: "aY9MKttqjWxgO8aq",
  type: "class",
  identifier: "intellect-caster",
  source: "W&W p.15",
  hitDice: "d8",
  primaryAbility: ["int"],
  saves: ["dex", "int"],
  spellcastingAbility: "int",
  spellcastingProgression: "full",

  progression: {
    "1":  { grants: ["spellcasting-intellect", "ritual-casting", "school-of-magic"] },
    "2":  { grants: ["font-of-magic-intellect"] },
    "3":  { grants: ["metamagic", "diverse-studies"] },
    "9":  { grants: ["apparition-lessons"] },
    "20": { grants: ["arcane-recovery"] },
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
    // 2 picks at L3, +1 at L10, +1 at L17 → 4 known total.
    picksByLevel: { "3": 2, "10": 1, "17": 1 },
  }],

  scaleValues: [
    {
      identifier: "sorcery-points",
      title: "Sorcery Points",
      values: {
        "1": null, "2":  2, "3":  3, "4":  4, "5":  5,
        "6":  6,   "7":  7, "8":  8, "9":  9, "10": 10,
        "11": 11, "12": 12, "13": 13, "14": 14, "15": 15,
        "16": 16, "17": 17, "18": 18, "19": 19, "20": 20,
      },
    },
    {
      identifier: "metamagic-known",
      title: "Metamagic Known",
      values: { "3": 2, "10": 3, "17": 4 },
    },
    {
      identifier: "cantrips-known",
      title: "Cantrips Known",
      values: {
        "1":  6, "2":  6, "3":  6, "4":  7, "5":  7,
        "6":  7, "7":  8, "8":  8, "9":  8, "10": 9,
        "11": 9, "12": 9, "13": 10, "14": 10, "15": 10,
        "16": 10, "17": 11, "18": 11, "19": 11, "20": 11,
      },
    },
    {
      identifier: "spells-known",
      title: "Spells Known",
      values: {
        "1":  6,  "2":  8,  "3": 10,  "4": 12,  "5": 15,
        "6": 17,  "7": 18,  "8": 19,  "9": 22,  "10": 23,
        "11": 24, "12": 24, "13": 27, "14": 27, "15": 28,
        "16": 28, "17": 31, "18": 31, "19": 31, "20": 31,
      },
    },
  ],
});

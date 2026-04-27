import { CastingStyleSchema } from "../../schemas/index.js";

/**
 * Willpower Caster — d10, full caster, CHA-based.
 *
 * Source: site/content/Rules/Chapter 2 - Casting Styles.md (Willpower Class Table).
 *
 * Implicit advancement entries added by the build (do NOT list them here):
 *   - HitPoints (every level)
 *   - Subclass pick at level 1 (the School of Magic dialog)
 *   - AbilityScoreImprovement at levels 4, 8, 12, 16, 19
 *
 * The chapter table also lists "Spellcasting" at level 1 — this isn't an
 * ItemGrant, it's the class's intrinsic `system.spellcasting` field, populated
 * from `spellcastingAbility` + `spellcastingProgression` above.
 */
export const willpowerCaster = CastingStyleSchema.parse({
  id: "willpower-caster",
  foundryId: "HRkzC0UTl2ZXhzzh",
  type: "class",
  identifier: "willpower-caster",
  source: "M&M p.11",
  hitDice: "d10",
  primaryAbility: ["cha"],
  saves: ["con", "cha"],
  spellcastingAbility: "cha",
  spellcastingProgression: "full",

  progression: {
    "1":  { grants: ["spellcasting-willpower", "sorcerous-resilience", "school-of-magic"] },
    "2":  { grants: ["font-of-magic-willpower"] },
    "3":  { grants: ["metamagic", "metamagic-fierce-spell", "metamagic-resistant-spell"] },
    "9":  { grants: ["apparition-lessons"] },
    "20": { grants: ["signature-spells"] },
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
      // Willpower table column "Sorcery Points" — feature inactive at L1.
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
        "1":  3,  "2":  4,  "3":  5,  "4":  6,  "5":  8,
        "6":  8,  "7": 10,  "8": 11,  "9": 13,  "10": 14,
        "11": 15, "12": 15, "13": 17, "14": 17, "15": 18,
        "16": 18, "17": 20, "18": 20, "19": 20, "20": 20,
      },
    },
  ],
});

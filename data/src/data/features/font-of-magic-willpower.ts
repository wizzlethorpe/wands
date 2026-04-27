import { FeatureSchema } from "../../schemas/index.js";

/**
 * Willpower-specific variant of Font of Magic. Granted by the Willpower Caster class
 * at level 2 in place of the generic {@code font-of-magic} feature so that
 * {@code uses.max} can resolve against the class's own sorcery-points scale
 * value. dnd5e v5 has no per-actor "use the granting class" formula, so each
 * caster has its own variant.
 */
export const fontOfMagicWillpower = FeatureSchema.parse({
  id: "font-of-magic-willpower",
  foundryId: "d1e1c3f951d08678",
  type: "feat",
  featureType: "class",
  source: "W&W p.10",
  requirements: "Willpower 2",
  activation: { type: "special", cost: null, condition: "" },
  duration: { value: null, units: "" },
  range: { value: null, long: null, units: "" },
  target: { type: "", value: null, width: null, units: "" },
  // Sorcery points are a long-rest resource sized by the class's "sorcery-points"
  // scale value (configured per caster in data/src/data/casting-styles/).
  uses: { value: null, max: "@scale.willpower-caster.sorcery-points", per: "lr", recovery: "" },
  recharge: { value: null, charged: false },
  actionType: "",
  attackBonus: 0,
  damage: { parts: [], versatile: "" },
  save: { ability: "", dc: null, scaling: "spell" },
  formula: "",
});

import { FeatureSchema } from "../../schemas/index.js";

/**
 * Intellect-specific variant of Font of Magic. Granted by the Intellect Caster class
 * at level 2 in place of the generic {@code font-of-magic} feature so that
 * {@code uses.max} can resolve against the class's own sorcery-points scale
 * value. dnd5e v5 has no per-actor "use the granting class" formula, so each
 * caster has its own variant.
 */
export const fontOfMagicIntellect = FeatureSchema.parse({
  id: "font-of-magic-intellect",
  foundryId: "e38945005bc4f458",
  type: "feat",
  featureType: "class",
  source: "W&W p.10",
  requirements: "Intellect 2",
  activation: { type: "special", cost: null, condition: "" },
  duration: { value: null, units: "" },
  range: { value: null, long: null, units: "" },
  target: { type: "", value: null, width: null, units: "" },
  // Sorcery points are a long-rest resource sized by the class's "sorcery-points"
  // scale value (configured per caster in data/src/data/casting-styles/).
  uses: { value: null, max: "@scale.intellect-caster.sorcery-points", per: "lr", recovery: "" },
  recharge: { value: null, charged: false },
  actionType: "",
  attackBonus: 0,
  damage: { parts: [], versatile: "" },
  save: { ability: "", dc: null, scaling: "spell" },
  formula: "",
});

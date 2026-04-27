import { FeatureSchema } from "../../schemas/index.js";

export const fontOfMagic = FeatureSchema.parse({
  id: "font-of-magic",
  foundryId: "8hxch8J2qPjoMCez",
  type: "feat",
  featureType: "class",
  source: "W&W p.10",
  requirements: "Casting Style 2",
  activation: { type: "special", cost: null, condition: "" },
  duration: { value: null, units: "" },
  range: { value: null, long: null, units: "" },
  target: { type: "", value: null, width: null, units: "" },
  // No uses tracking on the feature card itself — sorcery points are tracked via
  // the class's `sorcery-points` ScaleValue advancement, which displays current/max
  // on the class sheet. Tracking uses here was previously formula-based against
  // a non-existent `casting-style` class identifier (our identifiers are
  // willpower-caster / technique-caster / intellect-caster) and resolved to 0/0.
  uses: { value: null, max: null, per: null, recovery: "" },
  recharge: { value: null, charged: false },
  actionType: "",
  attackBonus: 0,
  damage: { parts: [], versatile: "" },
  save: { ability: "", dc: null, scaling: "spell" },
  formula: "",
});

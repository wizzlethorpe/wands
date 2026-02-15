import { FeatureSchema } from "../../schemas/index.js";

export const metamagicFierceSpell = FeatureSchema.parse({
  id: "metamagic-fierce-spell",
  foundryId: "bX8ekUbs0Cvh4AYI",
  type: "feat",
  featureType: "class",
  source: "W&W p.11",
  requirements: "Willpower Caster 3",
  activation: { type: "special", cost: 2, condition: "" },
  duration: { value: null, units: "" },
  range: { value: null, long: null, units: "" },
  target: { type: "", value: null, width: null, units: "" },
  uses: { value: 0, max: "", per: null, recovery: "" },
  recharge: { value: null, charged: false },
  actionType: "",
  attackBonus: 0,
  damage: { parts: [], versatile: "" },
  save: { ability: "", dc: null, scaling: "spell" },
  formula: "",
});

import { FeatureSchema } from "../../schemas/index.js";

export const spellDeflection = FeatureSchema.parse({
  id: "spell-deflection",
  foundryId: "RAY9AaKWGx1vkYhd",
  type: "feat",
  featureType: "class",
  source: "W&W p.13",
  requirements: "Technique",
  activation: { type: "reaction", cost: 1, condition: "" },
  duration: { value: null, units: "" },
  range: { value: null, long: null, units: "" },
  target: { type: "", value: null, width: null, units: "" },
  uses: { value: null, max: "", per: null, recovery: "" },
  recharge: { value: null, charged: false },
  actionType: "",
  attackBonus: 0,
  damage: { parts: [], versatile: "" },
  save: { ability: "", dc: null, scaling: "spell" },
  formula: "",
});

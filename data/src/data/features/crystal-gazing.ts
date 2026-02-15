import { FeatureSchema } from "../../schemas/index.js";

export const crystalGazing = FeatureSchema.parse({
  id: "crystal-gazing",
  foundryId: "pGjSQVEEO4vxnCnx",
  type: "feat",
  featureType: "class",
  source: "W&W p.24",
  requirements: "Divination",
  activation: { type: "special", cost: 7, condition: "" },
  duration: { value: null, units: "" },
  range: { value: null, long: null, units: "" },
  target: { type: "", value: null, width: null, units: "" },
  uses: { value: null, max: "", per: null, recovery: "" },
  recharge: { value: null, charged: false },
  actionType: "save",
  attackBonus: 0,
  damage: { parts: [], versatile: "" },
  save: { ability: "wis", dc: null, scaling: "spell" },
  formula: "",
});

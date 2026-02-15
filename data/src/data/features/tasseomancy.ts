import { FeatureSchema } from "../../schemas/index.js";

export const tasseomancy = FeatureSchema.parse({
  id: "tasseomancy",
  foundryId: "u5QusbRmcQjYl0Rw",
  type: "feat",
  featureType: "class",
  source: "W&W p.24",
  requirements: "Divination",
  activation: { type: "minute", cost: 10, condition: "3 Sorcery Points" },
  duration: { value: 30, units: "minute" },
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

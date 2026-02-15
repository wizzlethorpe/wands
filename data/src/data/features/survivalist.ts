import { FeatureSchema } from "../../schemas/index.js";

export const survivalist = FeatureSchema.parse({
  id: "survivalist",
  foundryId: "hn3Ni3YL48Wml4vz",
  type: "feat",
  featureType: "class",
  source: "W&W p.24",
  requirements: "Magizoology",
  activation: { type: "", cost: 0, condition: "" },
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

import { FeatureSchema } from "../../schemas/index.js";

export const dartingEyes = FeatureSchema.parse({
  id: "darting-eyes",
  foundryId: "oEK9maUDS84dE0do",
  type: "feat",
  featureType: "class",
  source: "W&W p.23",
  requirements: "Divination",
  activation: { type: "bonus", cost: 1, condition: "Must be able to see target's eyes" },
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

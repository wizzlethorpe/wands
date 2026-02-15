import { FeatureSchema } from "../../schemas/index.js";

export const warriorsEndurance = FeatureSchema.parse({
  id: "warriors-endurance",
  foundryId: "eKRIFNekxx8Az6HR",
  type: "feat",
  featureType: "race",
  source: "W&W p.p.7",
  requirements: "Wampus",
  activation: { type: "special", cost: null, condition: "" },
  duration: { value: null, units: "" },
  range: { value: null, long: null, units: "" },
  target: { type: "", value: null, width: null, units: "" },
  uses: { value: 1, max: "1", per: "lr", recovery: "" },
  recharge: { value: null, charged: false },
  actionType: "",
  attackBonus: 0,
  damage: { parts: [], versatile: "" },
  save: { ability: "", dc: null, scaling: "spell" },
  formula: "",
});

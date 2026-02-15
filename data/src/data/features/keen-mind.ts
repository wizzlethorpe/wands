import { FeatureSchema } from "../../schemas/index.js";

export const keenMind = FeatureSchema.parse({
  id: "keen-mind",
  foundryId: "mh2fRxrwi7bmQGSi",
  type: "feat",
  featureType: "feat",
  source: "PHB p.167",
  requirements: "",
  activation: { type: "", cost: 0, condition: "" },
  duration: { value: null, units: "" },
  range: { value: null, long: null, units: "" },
  target: { type: "", value: 0, width: null, units: "" },
  uses: { value: 0, max: "", per: null, recovery: "" },
  recharge: { value: null, charged: true },
  actionType: "",
  attackBonus: 0,
  damage: { parts: [], versatile: "" },
  save: { ability: "", dc: null, scaling: "spell" },
  formula: "",
});

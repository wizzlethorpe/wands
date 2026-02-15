import { FeatureSchema } from "../../schemas/index.js";

export const hoarder = FeatureSchema.parse({
  id: "hoarder",
  foundryId: "nVJ14ea5kcdHbsBT",
  type: "feat",
  featureType: "feat",
  source: "W&W p.54",
  requirements: "Devious Corruption",
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

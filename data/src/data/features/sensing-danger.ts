import { FeatureSchema } from "../../schemas/index.js";

export const sensingDanger = FeatureSchema.parse({
  id: "sensing-danger",
  foundryId: "K98JhLEPW6V5GRHi",
  type: "feat",
  featureType: "class",
  source: "W&W p.22",
  requirements: "Divination",
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

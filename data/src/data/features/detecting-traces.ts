import { FeatureSchema } from "../../schemas/index.js";

export const detectingTraces = FeatureSchema.parse({
  id: "detecting-traces",
  foundryId: "4F7hy30J5yzhTWdb",
  type: "feat",
  featureType: "feat",
  source: "W&W p.50",
  requirements: "",
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

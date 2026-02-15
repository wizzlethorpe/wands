import { FeatureSchema } from "../../schemas/index.js";

export const willpowerCaster = FeatureSchema.parse({
  id: "willpower-caster",
  foundryId: "HRkzC0UTl2ZXhzzh",
  type: "feat",
  featureType: "feat",
  source: "M&M p.11",
  requirements: "",
  activation: { type: "", cost: null, condition: "" },
  duration: { value: null, units: "" },
  range: { value: null, long: null, units: "" },
  target: { type: "", value: null, width: null, units: "" },
  uses: { value: null, max: null, per: null, recovery: "" },
  recharge: { value: null, charged: true },
  actionType: "",
  attackBonus: 0,
  damage: { parts: [], versatile: "" },
  save: { ability: "", dc: null, scaling: "" },
  formula: "",
});

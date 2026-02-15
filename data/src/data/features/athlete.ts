import { FeatureSchema } from "../../schemas/index.js";

export const athlete = FeatureSchema.parse({
  id: "athlete",
  foundryId: "Hz9ldrmSkBrFwpLE",
  type: "feat",
  featureType: "feat",
  source: "PHB p.165",
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

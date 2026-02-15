import { FeatureSchema } from "../../schemas/index.js";

export const phoenixTears = FeatureSchema.parse({
  id: "phoenix-tears",
  foundryId: "dxOlNgvzEfL7xTlh",
  type: "feat",
  featureType: "class",
  source: "W&W p.21",
  requirements: "Healing",
  activation: { type: "hour", cost: 8, condition: "" },
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

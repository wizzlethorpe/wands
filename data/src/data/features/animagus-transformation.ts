import { FeatureSchema } from "../../schemas/index.js";

export const animagusTransformation = FeatureSchema.parse({
  id: "animagus-transformation",
  foundryId: "dCaSJnUhQVjdRsIo",
  type: "feat",
  featureType: "class",
  source: "W&W p.19",
  requirements: "Transfiguration",
  activation: { type: "action", cost: 1, condition: "" },
  duration: { value: null, units: "" },
  range: { value: null, long: null, units: "" },
  target: { type: "", value: null, width: null, units: "" },
  uses: { value: 2, max: "2", per: "sr", recovery: "" },
  recharge: { value: null, charged: false },
  actionType: "",
  attackBonus: 0,
  damage: { parts: [], versatile: "" },
  save: { ability: "", dc: null, scaling: "spell" },
  formula: "",
});

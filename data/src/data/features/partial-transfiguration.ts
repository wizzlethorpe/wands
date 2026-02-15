import { FeatureSchema } from "../../schemas/index.js";

export const partialTransfiguration = FeatureSchema.parse({
  id: "partial-transfiguration",
  foundryId: "qjY0M07KyCS5A8yx",
  type: "feat",
  featureType: "class",
  source: "W&W p.19",
  requirements: "Transfiguration",
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

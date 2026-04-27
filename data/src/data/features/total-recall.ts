import { FeatureSchema } from "../../schemas/index.js";

export const totalRecall = FeatureSchema.parse({
  id: "total-recall",
  foundryId: "d6c5dbd4c1b54a27",
  type: "feat",
  featureType: "class",
  source: "W&W",
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

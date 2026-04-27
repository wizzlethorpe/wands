import { FeatureSchema } from "../../schemas/index.js";

export const totalLegilimency = FeatureSchema.parse({
  id: "total-legilimency",
  foundryId: "f93b4a11b0e83174",
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

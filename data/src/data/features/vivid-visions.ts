import { FeatureSchema } from "../../schemas/index.js";

export const vividVisions = FeatureSchema.parse({
  id: "vivid-visions",
  foundryId: "gJCLVF6JkHwqkfEZ",
  type: "feat",
  featureType: "class",
  source: "W&W p.23",
  requirements: "Divination",
  activation: { type: "bonus", cost: 1, condition: "" },
  duration: { value: null, units: "" },
  range: { value: null, long: null, units: "" },
  target: { type: "", value: null, width: null, units: "" },
  uses: { value: 1, max: "1", per: "lr", recovery: "" },
  recharge: { value: null, charged: false },
  actionType: "",
  attackBonus: 0,
  damage: { parts: [], versatile: "" },
  save: { ability: "", dc: null, scaling: "spell" },
  formula: "",
});

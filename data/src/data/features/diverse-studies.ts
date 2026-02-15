import { FeatureSchema } from "../../schemas/index.js";

export const diverseStudies = FeatureSchema.parse({
  id: "diverse-studies",
  foundryId: "gz3EDRAUnimqJriU",
  type: "feat",
  featureType: "class",
  source: "W&W p.15",
  requirements: "Intellect",
  activation: { type: "", cost: 0, condition: "" },
  duration: { value: null, units: "" },
  range: { value: null, long: null, units: "" },
  target: { type: "", value: null, width: null, units: "" },
  uses: { value: null, max: "", per: null, recovery: "" },
  recharge: { value: null, charged: false },
  actionType: "",
  attackBonus: 0,
  damage: { parts: [], versatile: "" },
  save: { ability: "", dc: null, scaling: "spell" },
  formula: "",
});

import { FeatureSchema } from "../../schemas/index.js";

export const inDepthKnowledge = FeatureSchema.parse({
  id: "in-depth-knowledge",
  foundryId: "5EBv9gSd9K8FjmHN",
  type: "feat",
  featureType: "race",
  source: "W&W p.p.5",
  requirements: "Eagle",
  activation: { type: "", cost: null, condition: "" },
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

import { FeatureSchema } from "../../schemas/index.js";

export const elementalist = FeatureSchema.parse({
  id: "elementalist",
  foundryId: "DH8llNE5QemeV7tH",
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

import { FeatureSchema } from "../../schemas/index.js";

export const valueAllLife = FeatureSchema.parse({
  id: "value-all-life",
  foundryId: "flxM2mS2hZ93PWet",
  type: "feat",
  featureType: "background",
  source: "W&W p.31",
  requirements: "Groundskeeper",
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

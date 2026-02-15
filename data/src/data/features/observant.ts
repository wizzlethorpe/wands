import { FeatureSchema } from "../../schemas/index.js";

export const observant = FeatureSchema.parse({
  id: "observant",
  foundryId: "ZAPFklljKMXAdJrm",
  type: "feat",
  featureType: "feat",
  source: "PHB p.168",
  requirements: "",
  activation: { type: "", cost: 0, condition: "" },
  duration: { value: null, units: "" },
  range: { value: null, long: null, units: "" },
  target: { type: "", value: 0, width: null, units: "" },
  uses: { value: 0, max: "", per: null, recovery: "" },
  recharge: { value: null, charged: true },
  actionType: "",
  attackBonus: 0,
  damage: { parts: [], versatile: "" },
  save: { ability: "", dc: null, scaling: "spell" },
  formula: "",
});

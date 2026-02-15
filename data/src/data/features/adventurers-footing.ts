import { FeatureSchema } from "../../schemas/index.js";

export const adventurersFooting = FeatureSchema.parse({
  id: "adventurers-footing",
  foundryId: "D45jKuNucX2YtWgs",
  type: "feat",
  featureType: "race",
  source: "W&W p.p.8",
  requirements: "Thunderbird",
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

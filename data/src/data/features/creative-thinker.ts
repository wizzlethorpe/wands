import { FeatureSchema } from "../../schemas/index.js";

export const creativeThinker = FeatureSchema.parse({
  id: "creative-thinker",
  foundryId: "x1hgjn8FxPcbmQpe",
  type: "feat",
  featureType: "background",
  source: "W&W p.37",
  requirements: "Troublemaker",
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

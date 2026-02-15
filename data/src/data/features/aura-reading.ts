import { FeatureSchema } from "../../schemas/index.js";

export const auraReading = FeatureSchema.parse({
  id: "aura-reading",
  foundryId: "KIX1NJuJ1l4yi1nz",
  type: "feat",
  featureType: "class",
  source: "W&W p.23",
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

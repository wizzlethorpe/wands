import { FeatureSchema } from "../../schemas/index.js";

export const cartomancy = FeatureSchema.parse({
  id: "cartomancy",
  foundryId: "LaLGB1LcuduKwnIQ",
  type: "feat",
  featureType: "class",
  source: "W&W p.24",
  requirements: "Divination",
  activation: { type: "minute", cost: 10, condition: "6 Sorcery Points" },
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

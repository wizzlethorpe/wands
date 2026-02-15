import { FeatureSchema } from "../../schemas/index.js";

export const cleromancy = FeatureSchema.parse({
  id: "cleromancy",
  foundryId: "srRtgG4zoLaEil5N",
  type: "feat",
  featureType: "class",
  source: "W&W p.24",
  requirements: "Divination",
  activation: { type: "action", cost: 1, condition: "2 Sorcery Points" },
  duration: { value: 10, units: "minute" },
  range: { value: 30, long: null, units: "ft" },
  target: { type: "", value: null, width: null, units: "" },
  uses: { value: null, max: "", per: null, recovery: "" },
  recharge: { value: null, charged: false },
  actionType: "",
  attackBonus: 0,
  damage: { parts: [], versatile: "" },
  save: { ability: "", dc: null, scaling: "spell" },
  formula: "",
});

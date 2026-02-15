import { FeatureSchema } from "../../schemas/index.js";

export const inferiRitual = FeatureSchema.parse({
  id: "inferi-ritual",
  foundryId: "5i7PJLudvWVskGbt",
  type: "feat",
  featureType: "feat",
  source: "W&W p.54",
  requirements: "Vile Corruption",
  activation: { type: "special", cost: null, condition: "" },
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

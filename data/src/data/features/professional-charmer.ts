import { FeatureSchema } from "../../schemas/index.js";

export const professionalCharmer = FeatureSchema.parse({
  id: "professional-charmer",
  foundryId: "iI7mXPakj7JcdPEB",
  type: "feat",
  featureType: "class",
  source: "W&W p.17",
  requirements: "Charms",
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

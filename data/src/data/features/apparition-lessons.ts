import { FeatureSchema } from "../../schemas/index.js";

export const apparitionLessons = FeatureSchema.parse({
  id: "apparition-lessons",
  foundryId: "K0sNedD2aum7pe1T",
  type: "feat",
  featureType: "class",
  source: "W&W p60",
  requirements: "9th level",
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

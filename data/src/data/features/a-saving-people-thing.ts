import { FeatureSchema } from "../../schemas/index.js";

export const aSavingPeopleThing = FeatureSchema.parse({
  id: "a-saving-people-thing",
  foundryId: "F1yTpv7DyxJM5Vjv",
  type: "feat",
  featureType: "class",
  source: "W&W p.21",
  requirements: "Healing",
  activation: { type: "reaction", cost: 1, condition: "" },
  duration: { value: null, units: "" },
  range: { value: 10, long: null, units: "ft" },
  target: { type: "creature", value: 1, width: null, units: "" },
  uses: { value: 0, max: "", per: null, recovery: "" },
  recharge: { value: null, charged: false },
  actionType: "",
  attackBonus: 0,
  damage: { parts: [], versatile: "" },
  save: { ability: "", dc: null, scaling: "spell" },
  formula: "",
});

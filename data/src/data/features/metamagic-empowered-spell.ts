import { FeatureSchema } from "../../schemas/index.js";

export const metamagicEmpoweredSpell = FeatureSchema.parse({
  id: "metamagic-empowered-spell",
  foundryId: "9Uwuy8LvCZ888TZ3",
  type: "feat",
  featureType: "class",
  source: "W&W p.10",
  requirements: "Casting Style 3",
  activation: { type: "special", cost: 1, condition: "" },
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

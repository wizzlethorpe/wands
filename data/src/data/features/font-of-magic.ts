import { FeatureSchema } from "../../schemas/index.js";

export const fontOfMagic = FeatureSchema.parse({
  id: "font-of-magic",
  foundryId: "8hxch8J2qPjoMCez",
  type: "feat",
  featureType: "class",
  source: "W&W p.10",
  requirements: "Casting Style 2",
  activation: { type: "special", cost: null, condition: "" },
  duration: { value: null, units: "" },
  range: { value: null, long: null, units: "" },
  target: { type: "", value: null, width: null, units: "" },
  uses: { value: null, max: "@scale.casting-style.sorcery-points", per: "lr", recovery: "" },
  recharge: { value: null, charged: false },
  actionType: "",
  attackBonus: 0,
  damage: { parts: [], versatile: "" },
  save: { ability: "", dc: null, scaling: "spell" },
  formula: "",
});

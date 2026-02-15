import { FeatureSchema } from "../../schemas/index.js";

export const spellcastingIntellect = FeatureSchema.parse({
  id: "spellcasting-intellect",
  foundryId: "g1R67HlsjBfjdpHD",
  type: "feat",
  featureType: "class",
  source: "W&W p.13",
  requirements: "Technique",
  activation: { type: "", cost: 0, condition: "" },
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

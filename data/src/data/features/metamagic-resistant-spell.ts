import { FeatureSchema } from "../../schemas/index.js";

export const metamagicResistantSpell = FeatureSchema.parse({
  id: "metamagic-resistant-spell",
  foundryId: "u1MxoKo8Gzmq5urI",
  type: "feat",
  featureType: "class",
  source: "W&W p.11",
  requirements: "Willpower Caster 3",
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

import { FeatureSchema } from "../../schemas/index.js";

export const scholarsMind = FeatureSchema.parse({
  id: "scholars-mind",
  foundryId: "JuOF7gAFL5zs0Kaw",
  type: "feat",
  featureType: "race",
  source: "W&W p.p.7",
  requirements: "Horned Serpent",
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

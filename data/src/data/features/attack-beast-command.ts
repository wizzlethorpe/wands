import { FeatureSchema } from "../../schemas/index.js";

export const attackBeastCommand = FeatureSchema.parse({
  id: "attack-beast-command",
  foundryId: "k5pYIiS2kWD6tS2F",
  type: "feat",
  featureType: "class",
  source: "W&W p26",
  requirements: "Wizard's Beast Friend",
  activation: { type: "bonus", cost: 1, condition: "" },
  duration: { value: null, units: "" },
  range: { value: null, long: null, units: "" },
  target: { type: "", value: null, width: null, units: "" },
  uses: { value: null, max: "", per: null, recovery: "" },
  recharge: { value: null, charged: false },
  actionType: "util",
  attackBonus: 0,
  damage: { parts: [["d6",""]], versatile: "" },
  save: { ability: "", dc: null, scaling: "spell" },
  formula: "",
});

import { FeatureSchema } from "../../schemas/index.js";

export const beastWhisperer = FeatureSchema.parse({
  id: "beast-whisperer",
  foundryId: "gDEKDuMd0Rrj9I0O",
  type: "feat",
  featureType: "class",
  source: "W&W p.24",
  requirements: "Magizoology",
  activation: { type: "action", cost: 1, condition: "can't be used again until taking 1 long/short rest" },
  duration: { value: null, units: "" },
  range: { value: null, long: null, units: "" },
  target: { type: "", value: null, width: null, units: "" },
  uses: { value: 1, max: "1", per: "sr", recovery: "" },
  recharge: { value: null, charged: false },
  actionType: "",
  attackBonus: 0,
  damage: { parts: [], versatile: "" },
  save: { ability: "", dc: null, scaling: "spell" },
  formula: "",
});

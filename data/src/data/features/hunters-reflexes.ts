import { FeatureSchema } from "../../schemas/index.js";

export const huntersReflexes = FeatureSchema.parse({
  id: "hunters-reflexes",
  foundryId: "RGAkLqQUuY6SdWEq",
  type: "feat",
  featureType: "class",
  source: "W&W p.24",
  requirements: "Magizoology",
  activation: { type: "reaction", cost: 1, condition: "can't be used again until taking 1 long/short rest" },
  duration: { value: null, units: "" },
  range: { value: null, long: null, units: "" },
  target: { type: "creature", value: 1, width: null, units: "" },
  uses: { value: 1, max: "1", per: "sr", recovery: "" },
  recharge: { value: null, charged: false },
  actionType: "",
  attackBonus: 0,
  damage: { parts: [], versatile: "" },
  save: { ability: "", dc: null, scaling: "spell" },
  formula: "",
});

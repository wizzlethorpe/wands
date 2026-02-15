import { FeatureSchema } from "../../schemas/index.js";

export const compromisingInformation = FeatureSchema.parse({
  id: "compromising-information",
  foundryId: "bZ3VyayJTuRaUaHh",
  type: "feat",
  featureType: "race",
  source: "W&W p.p.5",
  requirements: "Snake",
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

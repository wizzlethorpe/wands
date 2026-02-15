import { FeatureSchema } from "../../schemas/index.js";

export const veelaCharm = FeatureSchema.parse({
  id: "veela-charm",
  foundryId: "PcBnLLTP94VYb2sK",
  type: "feat",
  featureType: "feat",
  source: "W&W p.50",
  requirements: "Innate Feat",
  activation: { type: "", cost: 0, condition: "" },
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

import { FeatureSchema } from "../../schemas/index.js";

export const forcefulMagic = FeatureSchema.parse({
  id: "forceful-magic",
  foundryId: "iT3xh6wHCOkjg9o2",
  type: "feat",
  featureType: "class",
  source: "W&W p.18",
  requirements: "Jinxes, Hexes, and Curses",
  activation: { type: "", cost: null, condition: "" },
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

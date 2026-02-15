import { FeatureSchema } from "../../schemas/index.js";

export const aurorAlert = FeatureSchema.parse({
  id: "auror-alert",
  foundryId: "4Vm2EKoawas4zBZk",
  type: "feat",
  featureType: "class",
  source: "W&W p.18",
  requirements: "Jinxes, Hexes, and Curses",
  activation: { type: "action", cost: 1, condition: "" },
  duration: { value: null, units: "" },
  range: { value: null, long: null, units: "" },
  target: { type: "", value: null, width: null, units: "" },
  uses: { value: 1, max: "1", per: "lr", recovery: "" },
  recharge: { value: null, charged: false },
  actionType: "",
  attackBonus: 0,
  damage: { parts: [], versatile: "" },
  save: { ability: "", dc: null, scaling: "spell" },
  formula: "",
});

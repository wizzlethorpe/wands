import { FeatureSchema } from "../../schemas/index.js";

export const magicalAdrenaline = FeatureSchema.parse({
  id: "magical-adrenaline",
  foundryId: "AxOv8zagJ4gmqzlg",
  type: "feat",
  featureType: "class",
  source: "W&W p.18",
  requirements: "Jines, Hexes, and Curses",
  activation: { type: "bonus", cost: 1, condition: "" },
  duration: { value: null, units: "" },
  range: { value: null, long: null, units: "" },
  target: { type: "", value: null, width: null, units: "" },
  uses: { value: null, max: "@prof", per: "lr", recovery: "" },
  recharge: { value: null, charged: false },
  actionType: "",
  attackBonus: 0,
  damage: { parts: [], versatile: "" },
  save: { ability: "", dc: null, scaling: "spell" },
  formula: "",
});

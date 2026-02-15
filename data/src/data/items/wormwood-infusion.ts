import { ItemSchema } from "../../schemas/index.js";

export const wormwoodInfusion = ItemSchema.parse({
  id: "wormwood-infusion",
  foundryId: "95ce17340100f4e9",
  type: "loot",
  source: "W&W",
  rarity: "common",
  price: { value: 0.5, denomination: "gp" },
  weight: 0.1,
  quantity: 1,
});

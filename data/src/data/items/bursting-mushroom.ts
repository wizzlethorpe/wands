import { ItemSchema } from "../../schemas/index.js";

export const burstingMushroom = ItemSchema.parse({
  id: "bursting-mushroom",
  foundryId: "d263b2f59746b271",
  type: "loot",
  source: "W&W",
  rarity: "uncommon",
  price: { value: 2.5, denomination: "gp" },
  weight: 0.1,
  quantity: 1,
});

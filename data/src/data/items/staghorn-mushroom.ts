import { ItemSchema } from "../../schemas/index.js";

export const staghornMushroom = ItemSchema.parse({
  id: "staghorn-mushroom",
  foundryId: "d96125de6075d0b9",
  type: "loot",
  source: "W&W",
  rarity: "common",
  price: { value: 0.5, denomination: "gp" },
  weight: 0.1,
  quantity: 1,
});

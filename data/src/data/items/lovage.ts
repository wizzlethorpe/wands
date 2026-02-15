import { ItemSchema } from "../../schemas/index.js";

export const lovage = ItemSchema.parse({
  id: "lovage",
  foundryId: "a642c9e47440e609",
  type: "loot",
  source: "W&W",
  rarity: "common",
  price: { value: 0.5, denomination: "gp" },
  weight: 0.1,
  quantity: 1,
});

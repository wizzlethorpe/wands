import { ItemSchema } from "../../schemas/index.js";

export const mandrakeRoot = ItemSchema.parse({
  id: "mandrake-root",
  foundryId: "446ce3a4cfd780e4",
  type: "loot",
  source: "W&W",
  rarity: "rare",
  price: { value: 25, denomination: "gp" },
  weight: 0.1,
  quantity: 1,
});

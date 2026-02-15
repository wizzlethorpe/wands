import { ItemSchema } from "../../schemas/index.js";

export const mistletoeBerry = ItemSchema.parse({
  id: "mistletoe-berry",
  foundryId: "f3014cce75e93ea2",
  type: "loot",
  source: "W&W",
  rarity: "common",
  price: { value: 0.5, denomination: "gp" },
  weight: 0.1,
  quantity: 1,
});

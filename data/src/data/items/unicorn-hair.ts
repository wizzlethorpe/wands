import { ItemSchema } from "../../schemas/index.js";

export const unicornHair = ItemSchema.parse({
  id: "unicorn-hair",
  foundryId: "d2426a750f809da3",
  type: "loot",
  source: "W&W",
  rarity: "rare",
  price: { value: 25, denomination: "gp" },
  weight: 0.1,
  quantity: 1,
});

import { ItemSchema } from "../../schemas/index.js";

export const moonstone = ItemSchema.parse({
  id: "moonstone",
  foundryId: "4ec36c1c329aad1c",
  type: "loot",
  source: "W&W",
  rarity: "uncommon",
  price: { value: 2.5, denomination: "gp" },
  weight: 0.1,
  quantity: 1,
});

import { ItemSchema } from "../../schemas/index.js";

export const potionBookFirstYearPotions = ItemSchema.parse({
  id: "potion-book-first-year-potions",
  foundryId: "9b4b917f428ce548",
  type: "loot",
  source: "W&W",
  rarity: "common",
  price: { value: 0, denomination: "gp" },
  weight: 1,
  quantity: 1,
});

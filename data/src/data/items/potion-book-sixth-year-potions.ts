import { ItemSchema } from "../../schemas/index.js";

export const potionBookSixthYearPotions = ItemSchema.parse({
  id: "potion-book-sixth-year-potions",
  foundryId: "34d0f344d76dcb06",
  type: "loot",
  source: "W&W",
  rarity: "common",
  price: { value: 0, denomination: "gp" },
  weight: 1,
  quantity: 1,
});

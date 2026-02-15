import { ItemSchema } from "../../schemas/index.js";

export const potionBookSecondYearPotions = ItemSchema.parse({
  id: "potion-book-second-year-potions",
  foundryId: "b764477c08664f2f",
  type: "loot",
  source: "W&W",
  rarity: "common",
  price: { value: 0, denomination: "gp" },
  weight: 1,
  quantity: 1,
});

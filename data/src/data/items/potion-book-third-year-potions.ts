import { ItemSchema } from "../../schemas/index.js";

export const potionBookThirdYearPotions = ItemSchema.parse({
  id: "potion-book-third-year-potions",
  foundryId: "157def488c713193",
  type: "loot",
  source: "W&W",
  rarity: "common",
  price: { value: 0, denomination: "gp" },
  weight: 1,
  quantity: 1,
});

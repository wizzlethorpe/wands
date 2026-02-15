import { ItemSchema } from "../../schemas/index.js";

export const potionBookSeventhYearPotions = ItemSchema.parse({
  id: "potion-book-seventh-year-potions",
  foundryId: "98c70938ded78eff",
  type: "loot",
  source: "W&W",
  rarity: "common",
  price: { value: 0, denomination: "gp" },
  weight: 1,
  quantity: 1,
});

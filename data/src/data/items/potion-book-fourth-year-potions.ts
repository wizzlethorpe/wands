import { ItemSchema } from "../../schemas/index.js";

export const potionBookFourthYearPotions = ItemSchema.parse({
  id: "potion-book-fourth-year-potions",
  foundryId: "839281b9b0b2117d",
  type: "loot",
  source: "W&W",
  rarity: "common",
  price: { value: 0, denomination: "gp" },
  weight: 1,
  quantity: 1,
});

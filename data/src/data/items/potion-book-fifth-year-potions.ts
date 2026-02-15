import { ItemSchema } from "../../schemas/index.js";

export const potionBookFifthYearPotions = ItemSchema.parse({
  id: "potion-book-fifth-year-potions",
  foundryId: "380ee89af3e9c547",
  type: "loot",
  source: "W&W",
  rarity: "common",
  price: { value: 0, denomination: "gp" },
  weight: 1,
  quantity: 1,
});

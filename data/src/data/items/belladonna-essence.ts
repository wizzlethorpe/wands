import { ItemSchema } from "../../schemas/index.js";

export const belladonnaEssence = ItemSchema.parse({
  id: "belladonna-essence",
  foundryId: "0528a250cd5eacfe",
  type: "loot",
  source: "W&W",
  rarity: "common",
  price: { value: 0.5, denomination: "gp" },
  weight: 0.1,
  quantity: 1,
});

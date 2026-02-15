import { ItemSchema } from "../../schemas/index.js";

export const scurvyGrass = ItemSchema.parse({
  id: "scurvy-grass",
  foundryId: "7bd20b23a107dfcb",
  type: "loot",
  source: "W&W",
  rarity: "uncommon",
  price: { value: 2.5, denomination: "gp" },
  weight: 0.1,
  quantity: 1,
});

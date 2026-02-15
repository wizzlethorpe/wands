import { ItemSchema } from "../../schemas/index.js";

export const chineseChompingCabbage = ItemSchema.parse({
  id: "chinese-chomping-cabbage",
  foundryId: "85d4231098751df4",
  type: "loot",
  source: "W&W",
  rarity: "rare",
  price: { value: 25, denomination: "gp" },
  weight: 0.1,
  quantity: 1,
});

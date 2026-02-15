import { ItemSchema } from "../../schemas/index.js";

export const galanthusNivalis = ItemSchema.parse({
  id: "galanthus-nivalis",
  foundryId: "884fb4f43debadd7",
  type: "loot",
  source: "W&W",
  rarity: "common",
  price: { value: 0.5, denomination: "gp" },
  weight: 0.1,
  quantity: 1,
});

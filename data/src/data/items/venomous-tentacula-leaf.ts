import { ItemSchema } from "../../schemas/index.js";

export const venomousTentaculaLeaf = ItemSchema.parse({
  id: "venomous-tentacula-leaf",
  foundryId: "0059796088df1302",
  type: "loot",
  source: "W&W",
  rarity: "rare",
  price: { value: 25, denomination: "gp" },
  weight: 0.1,
  quantity: 1,
});

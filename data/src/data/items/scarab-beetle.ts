import { ItemSchema } from "../../schemas/index.js";

export const scarabBeetle = ItemSchema.parse({
  id: "scarab-beetle",
  foundryId: "278d967d52622d4c",
  type: "loot",
  source: "W&W",
  rarity: "rare",
  price: { value: 25, denomination: "gp" },
  weight: 0.1,
  quantity: 1,
});

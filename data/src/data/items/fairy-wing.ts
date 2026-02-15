import { ItemSchema } from "../../schemas/index.js";

export const fairyWing = ItemSchema.parse({
  id: "fairy-wing",
  foundryId: "faabe0d5a369da32",
  type: "loot",
  source: "W&W",
  rarity: "uncommon",
  price: { value: 2.5, denomination: "gp" },
  weight: 0.1,
  quantity: 1,
});

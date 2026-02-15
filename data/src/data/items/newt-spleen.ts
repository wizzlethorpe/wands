import { ItemSchema } from "../../schemas/index.js";

export const newtSpleen = ItemSchema.parse({
  id: "newt-spleen",
  foundryId: "159022b804ab4277",
  type: "loot",
  source: "W&W",
  rarity: "uncommon",
  price: { value: 2.5, denomination: "gp" },
  weight: 0.1,
  quantity: 1,
});

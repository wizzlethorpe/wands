import { ItemSchema } from "../../schemas/index.js";

export const fireSeed = ItemSchema.parse({
  id: "fire-seed",
  foundryId: "7094132bbbcf2fce",
  type: "loot",
  source: "W&W",
  rarity: "uncommon",
  price: { value: 2.5, denomination: "gp" },
  weight: 0.1,
  quantity: 1,
});

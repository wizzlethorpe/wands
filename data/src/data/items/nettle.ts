import { ItemSchema } from "../../schemas/index.js";

export const nettle = ItemSchema.parse({
  id: "nettle",
  foundryId: "4a332bdd692bdca9",
  type: "loot",
  source: "W&W",
  rarity: "common",
  price: { value: 0.5, denomination: "gp" },
  weight: 0.1,
  quantity: 1,
});

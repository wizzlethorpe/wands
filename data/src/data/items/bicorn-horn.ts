import { ItemSchema } from "../../schemas/index.js";

export const bicornHorn = ItemSchema.parse({
  id: "bicorn-horn",
  foundryId: "778e2515af19afb4",
  type: "loot",
  source: "W&W",
  rarity: "common",
  price: { value: 0.5, denomination: "gp" },
  weight: 0.1,
  quantity: 1,
});

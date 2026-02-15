import { ItemSchema } from "../../schemas/index.js";

export const honeywater = ItemSchema.parse({
  id: "honeywater",
  foundryId: "e7938c6198a3822a",
  type: "loot",
  source: "W&W",
  rarity: "common",
  price: { value: 0.5, denomination: "gp" },
  weight: 0.1,
  quantity: 1,
});

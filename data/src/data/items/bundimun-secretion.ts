import { ItemSchema } from "../../schemas/index.js";

export const bundimunSecretion = ItemSchema.parse({
  id: "bundimun-secretion",
  foundryId: "773e31d882d57ce1",
  type: "loot",
  source: "W&W",
  rarity: "common",
  price: { value: 0.5, denomination: "gp" },
  weight: 0.1,
  quantity: 1,
});

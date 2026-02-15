import { ItemSchema } from "../../schemas/index.js";

export const hemlock = ItemSchema.parse({
  id: "hemlock",
  foundryId: "bede4f80fe71a32b",
  type: "loot",
  source: "W&W",
  rarity: "common",
  price: { value: 0.5, denomination: "gp" },
  weight: 0.1,
  quantity: 1,
});

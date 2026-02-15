import { ItemSchema } from "../../schemas/index.js";

export const baneberry = ItemSchema.parse({
  id: "baneberry",
  foundryId: "dba77822358e9588",
  type: "loot",
  source: "W&W",
  rarity: "common",
  price: { value: 0.5, denomination: "gp" },
  weight: 0.1,
  quantity: 1,
});

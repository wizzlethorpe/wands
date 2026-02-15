import { ItemSchema } from "../../schemas/index.js";

export const pufferfishEye = ItemSchema.parse({
  id: "pufferfish-eye",
  foundryId: "f613e18c4e06765a",
  type: "loot",
  source: "W&W",
  rarity: "common",
  price: { value: 0.5, denomination: "gp" },
  weight: 0.1,
  quantity: 1,
});

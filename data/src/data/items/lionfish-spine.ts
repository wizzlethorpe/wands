import { ItemSchema } from "../../schemas/index.js";

export const lionfishSpine = ItemSchema.parse({
  id: "lionfish-spine",
  foundryId: "e329d212f7c86306",
  type: "loot",
  source: "W&W",
  rarity: "common",
  price: { value: 0.5, denomination: "gp" },
  weight: 0.1,
  quantity: 1,
});

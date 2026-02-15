import { ItemSchema } from "../../schemas/index.js";

export const starGrass = ItemSchema.parse({
  id: "star-grass",
  foundryId: "1282594f7ec7802f",
  type: "loot",
  source: "W&W",
  rarity: "common",
  price: { value: 0.5, denomination: "gp" },
  weight: 0.1,
  quantity: 1,
});

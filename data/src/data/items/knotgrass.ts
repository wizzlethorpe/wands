import { ItemSchema } from "../../schemas/index.js";

export const knotgrass = ItemSchema.parse({
  id: "knotgrass",
  foundryId: "24251132afb5c6f0",
  type: "loot",
  source: "W&W",
  rarity: "common",
  price: { value: 0.5, denomination: "gp" },
  weight: 0.1,
  quantity: 1,
});

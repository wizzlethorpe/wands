import { ItemSchema } from "../../schemas/index.js";

export const octopus = ItemSchema.parse({
  id: "octopus",
  foundryId: "bae3023ebfeb46d9",
  type: "loot",
  source: "W&W",
  rarity: "common",
  price: { value: 0.5, denomination: "gp" },
  weight: 0.1,
  quantity: 1,
});

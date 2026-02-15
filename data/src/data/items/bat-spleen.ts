import { ItemSchema } from "../../schemas/index.js";

export const batSpleen = ItemSchema.parse({
  id: "bat-spleen",
  foundryId: "40d0a6d736fd638c",
  type: "loot",
  source: "W&W",
  rarity: "common",
  price: { value: 0.5, denomination: "gp" },
  weight: 0.1,
  quantity: 1,
});

import { ItemSchema } from "../../schemas/index.js";

export const slothBrain = ItemSchema.parse({
  id: "sloth-brain",
  foundryId: "4f4e97ca5f0d40da",
  type: "loot",
  source: "W&W",
  rarity: "common",
  price: { value: 0.5, denomination: "gp" },
  weight: 0.1,
  quantity: 1,
});

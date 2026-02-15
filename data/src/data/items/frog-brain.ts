import { ItemSchema } from "../../schemas/index.js";

export const frogBrain = ItemSchema.parse({
  id: "frog-brain",
  foundryId: "ef3f5e336f9d0881",
  type: "loot",
  source: "W&W",
  rarity: "common",
  price: { value: 0.5, denomination: "gp" },
  weight: 0.1,
  quantity: 1,
});

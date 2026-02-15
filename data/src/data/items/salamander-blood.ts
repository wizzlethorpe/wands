import { ItemSchema } from "../../schemas/index.js";

export const salamanderBlood = ItemSchema.parse({
  id: "salamander-blood",
  foundryId: "b25d6990bba5acc9",
  type: "loot",
  source: "W&W",
  rarity: "uncommon",
  price: { value: 2.5, denomination: "gp" },
  weight: 0.1,
  quantity: 1,
});

import { ItemSchema } from "../../schemas/index.js";

export const angelsTrumpet = ItemSchema.parse({
  id: "angels-trumpet",
  foundryId: "917174e2018bf45c",
  type: "loot",
  source: "W&W",
  rarity: "uncommon",
  price: { value: 2.5, denomination: "gp" },
  weight: 0.1,
  quantity: 1,
});

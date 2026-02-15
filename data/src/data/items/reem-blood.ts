import { ItemSchema } from "../../schemas/index.js";

export const reemBlood = ItemSchema.parse({
  id: "reem-blood",
  foundryId: "4867e29cefe149a1",
  type: "loot",
  source: "W&W",
  rarity: "uncommon",
  price: { value: 2.5, denomination: "gp" },
  weight: 0.1,
  quantity: 1,
});

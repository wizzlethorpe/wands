import { ItemSchema } from "../../schemas/index.js";

export const giantPurpleToadWart = ItemSchema.parse({
  id: "giant-purple-toad-wart",
  foundryId: "60d01761dbb8e572",
  type: "loot",
  source: "W&W",
  rarity: "common",
  price: { value: 0.5, denomination: "gp" },
  weight: 0.1,
  quantity: 1,
});

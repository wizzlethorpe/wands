import { ItemSchema } from "../../schemas/index.js";

export const billywigSting = ItemSchema.parse({
  id: "billywig-sting",
  foundryId: "4f71afcb39b778d6",
  type: "loot",
  source: "W&W",
  rarity: "common",
  price: { value: 0.5, denomination: "gp" },
  weight: 0.1,
  quantity: 1,
});

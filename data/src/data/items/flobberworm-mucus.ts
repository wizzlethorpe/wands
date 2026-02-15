import { ItemSchema } from "../../schemas/index.js";

export const flobberwormMucus = ItemSchema.parse({
  id: "flobberworm-mucus",
  foundryId: "f4c3802951ad1568",
  type: "loot",
  source: "W&W",
  rarity: "common",
  price: { value: 0.5, denomination: "gp" },
  weight: 0.1,
  quantity: 1,
});

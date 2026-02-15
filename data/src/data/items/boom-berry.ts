import { ItemSchema } from "../../schemas/index.js";

export const boomBerry = ItemSchema.parse({
  id: "boom-berry",
  foundryId: "a79b357b5dff2b33",
  type: "loot",
  source: "W&W",
  rarity: "common",
  price: { value: 0.5, denomination: "gp" },
  weight: 0.1,
  quantity: 1,
});

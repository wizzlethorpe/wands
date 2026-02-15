import { ItemSchema } from "../../schemas/index.js";

export const bubotuberPus = ItemSchema.parse({
  id: "bubotuber-pus",
  foundryId: "d433dc532ea900ee",
  type: "loot",
  source: "W&W",
  rarity: "common",
  price: { value: 0.5, denomination: "gp" },
  weight: 0.1,
  quantity: 1,
});

import { ItemSchema } from "../../schemas/index.js";

export const wartcap = ItemSchema.parse({
  id: "wartcap",
  foundryId: "631a2036af312845",
  type: "loot",
  source: "W&W",
  rarity: "common",
  price: { value: 0.5, denomination: "gp" },
  weight: 0.1,
  quantity: 1,
});

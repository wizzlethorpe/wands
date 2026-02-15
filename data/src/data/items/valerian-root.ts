import { ItemSchema } from "../../schemas/index.js";

export const valerianRoot = ItemSchema.parse({
  id: "valerian-root",
  foundryId: "3fb8abd17262c482",
  type: "loot",
  source: "W&W",
  rarity: "common",
  price: { value: 0.5, denomination: "gp" },
  weight: 0.1,
  quantity: 1,
});

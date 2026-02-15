import { ItemSchema } from "../../schemas/index.js";

export const ethanol = ItemSchema.parse({
  id: "ethanol",
  foundryId: "9378a351012f1ccc",
  type: "loot",
  source: "W&W",
  rarity: "common",
  price: { value: 0.5, denomination: "gp" },
  weight: 0.1,
  quantity: 1,
});

import { ItemSchema } from "../../schemas/index.js";

export const poppyHead = ItemSchema.parse({
  id: "poppy-head",
  foundryId: "88483df978705940",
  type: "loot",
  source: "W&W",
  rarity: "common",
  price: { value: 0.5, denomination: "gp" },
  weight: 0.1,
  quantity: 1,
});

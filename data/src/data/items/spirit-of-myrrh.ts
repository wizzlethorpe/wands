import { ItemSchema } from "../../schemas/index.js";

export const spiritOfMyrrh = ItemSchema.parse({
  id: "spirit-of-myrrh",
  foundryId: "fa3e5146c27f6f69",
  type: "loot",
  source: "W&W",
  rarity: "common",
  price: { value: 0.5, denomination: "gp" },
  weight: 0.1,
  quantity: 1,
});

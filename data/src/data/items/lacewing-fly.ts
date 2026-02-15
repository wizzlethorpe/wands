import { ItemSchema } from "../../schemas/index.js";

export const lacewingFly = ItemSchema.parse({
  id: "lacewing-fly",
  foundryId: "4ab49ec62b7ff261",
  type: "loot",
  source: "W&W",
  rarity: "common",
  price: { value: 0.5, denomination: "gp" },
  weight: 0.1,
  quantity: 1,
});

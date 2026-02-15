import { ItemSchema } from "../../schemas/index.js";

export const shrivelfig = ItemSchema.parse({
  id: "shrivelfig",
  foundryId: "9885401a14f63db1",
  type: "loot",
  source: "W&W",
  rarity: "common",
  price: { value: 0.5, denomination: "gp" },
  weight: 0.1,
  quantity: 1,
});

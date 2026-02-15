import { ItemSchema } from "../../schemas/index.js";

export const cowbane = ItemSchema.parse({
  id: "cowbane",
  foundryId: "3110065f02257280",
  type: "loot",
  source: "W&W",
  rarity: "common",
  price: { value: 0.5, denomination: "gp" },
  weight: 0.1,
  quantity: 1,
});

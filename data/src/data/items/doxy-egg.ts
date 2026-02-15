import { ItemSchema } from "../../schemas/index.js";

export const doxyEgg = ItemSchema.parse({
  id: "doxy-egg",
  foundryId: "76f5fa01c8f70a0b",
  type: "loot",
  source: "W&W",
  rarity: "common",
  price: { value: 0.5, denomination: "gp" },
  weight: 0.1,
  quantity: 1,
});

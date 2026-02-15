import { ItemSchema } from "../../schemas/index.js";

export const boomslangSkin = ItemSchema.parse({
  id: "boomslang-skin",
  foundryId: "30f1d55d6ecdd788",
  type: "loot",
  source: "W&W",
  rarity: "common",
  price: { value: 0.5, denomination: "gp" },
  weight: 0.1,
  quantity: 1,
});

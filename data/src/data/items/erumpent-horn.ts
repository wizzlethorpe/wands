import { ItemSchema } from "../../schemas/index.js";

export const erumpentHorn = ItemSchema.parse({
  id: "erumpent-horn",
  foundryId: "073c099ffadc80f6",
  type: "loot",
  source: "W&W",
  rarity: "rare",
  price: { value: 25, denomination: "gp" },
  weight: 0.1,
  quantity: 1,
});

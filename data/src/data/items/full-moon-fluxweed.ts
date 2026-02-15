import { ItemSchema } from "../../schemas/index.js";

export const fullMoonFluxweed = ItemSchema.parse({
  id: "full-moon-fluxweed",
  foundryId: "c68b9e017a32f8d2",
  type: "loot",
  source: "W&W",
  rarity: "common",
  price: { value: 0.5, denomination: "gp" },
  weight: 0.1,
  quantity: 1,
});

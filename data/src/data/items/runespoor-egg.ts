import { ItemSchema } from "../../schemas/index.js";

export const runespoorEgg = ItemSchema.parse({
  id: "runespoor-egg",
  foundryId: "393e5b93a26575aa",
  type: "loot",
  source: "W&W",
  rarity: "common",
  price: { value: 0.5, denomination: "gp" },
  weight: 0.1,
  quantity: 1,
});

import { ItemSchema } from "../../schemas/index.js";

export const letheRiverWater = ItemSchema.parse({
  id: "lethe-river-water",
  foundryId: "89dda1fb475fd95f",
  type: "loot",
  source: "W&W",
  rarity: "common",
  price: { value: 0.5, denomination: "gp" },
  weight: 0.1,
  quantity: 1,
});

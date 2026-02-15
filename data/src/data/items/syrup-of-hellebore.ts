import { ItemSchema } from "../../schemas/index.js";

export const syrupOfHellebore = ItemSchema.parse({
  id: "syrup-of-hellebore",
  foundryId: "fb3d03f90bb9cbc4",
  type: "loot",
  source: "W&W",
  rarity: "uncommon",
  price: { value: 2.5, denomination: "gp" },
  weight: 0.1,
  quantity: 1,
});

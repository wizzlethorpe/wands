import { ItemSchema } from "../../schemas/index.js";

export const weedOfSorrows = ItemSchema.parse({
  id: "weed-of-sorrows",
  foundryId: "6bec23944cb32fda",
  type: "loot",
  source: "W&W",
  rarity: "common",
  price: { value: 0.5, denomination: "gp" },
  weight: 0.1,
  quantity: 1,
});

import { ItemSchema } from "../../schemas/index.js";

export const africanSeaSalt = ItemSchema.parse({
  id: "african-sea-salt",
  foundryId: "51dfc6fad3c8b932",
  type: "loot",
  source: "W&W",
  rarity: "common",
  price: { value: 0.5, denomination: "gp" },
  weight: 0.1,
  quantity: 1,
});

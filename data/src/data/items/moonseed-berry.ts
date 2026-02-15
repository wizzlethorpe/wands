import { ItemSchema } from "../../schemas/index.js";

export const moonseedBerry = ItemSchema.parse({
  id: "moonseed-berry",
  foundryId: "b35b7a6eedbcccd2",
  type: "loot",
  source: "W&W",
  rarity: "uncommon",
  price: { value: 2.5, denomination: "gp" },
  weight: 0.1,
  quantity: 1,
});

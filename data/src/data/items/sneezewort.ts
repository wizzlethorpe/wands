import { ItemSchema } from "../../schemas/index.js";

export const sneezewort = ItemSchema.parse({
  id: "sneezewort",
  foundryId: "20e15847f08cb545",
  type: "loot",
  source: "W&W",
  rarity: "uncommon",
  price: { value: 2.5, denomination: "gp" },
  weight: 0.1,
  quantity: 1,
});

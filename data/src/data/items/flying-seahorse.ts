import { ItemSchema } from "../../schemas/index.js";

export const flyingSeahorse = ItemSchema.parse({
  id: "flying-seahorse",
  foundryId: "2323f3906e46367d",
  type: "loot",
  source: "W&W",
  rarity: "uncommon",
  price: { value: 2.5, denomination: "gp" },
  weight: 0.1,
  quantity: 1,
});

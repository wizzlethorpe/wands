import { ItemSchema } from "../../schemas/index.js";

export const murtlapTentacle = ItemSchema.parse({
  id: "murtlap-tentacle",
  foundryId: "221439cd6f55e23e",
  type: "loot",
  source: "W&W",
  rarity: "uncommon",
  price: { value: 2.5, denomination: "gp" },
  weight: 0.1,
  quantity: 1,
});

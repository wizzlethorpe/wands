import { ItemSchema } from "../../schemas/index.js";

export const chizpurfleCarapace = ItemSchema.parse({
  id: "chizpurfle-carapace",
  foundryId: "ce867b65043ef3ae",
  type: "loot",
  source: "W&W",
  rarity: "uncommon",
  price: { value: 2.5, denomination: "gp" },
  weight: 0.1,
  quantity: 1,
});

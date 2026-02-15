import { ItemSchema } from "../../schemas/index.js";

export const gurdyroot = ItemSchema.parse({
  id: "gurdyroot",
  foundryId: "c52cc24443b63ad1",
  type: "loot",
  source: "W&W",
  rarity: "common",
  price: { value: 0.5, denomination: "gp" },
  weight: 0.1,
  quantity: 1,
});

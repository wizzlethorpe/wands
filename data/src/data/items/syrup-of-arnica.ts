import { ItemSchema } from "../../schemas/index.js";

export const syrupOfArnica = ItemSchema.parse({
  id: "syrup-of-arnica",
  foundryId: "3be342b5f02c520e",
  type: "loot",
  source: "W&W",
  rarity: "common",
  price: { value: 0.5, denomination: "gp" },
  weight: 0.1,
  quantity: 1,
});

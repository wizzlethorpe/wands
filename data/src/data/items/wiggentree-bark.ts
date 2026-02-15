import { ItemSchema } from "../../schemas/index.js";

export const wiggentreeBark = ItemSchema.parse({
  id: "wiggentree-bark",
  foundryId: "fd6805ddd369a21c",
  type: "loot",
  source: "W&W",
  rarity: "uncommon",
  price: { value: 2.5, denomination: "gp" },
  weight: 0.1,
  quantity: 1,
});

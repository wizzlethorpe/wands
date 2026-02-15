import { ItemSchema } from "../../schemas/index.js";

export const woodliceExtract = ItemSchema.parse({
  id: "woodlice-extract",
  foundryId: "4039425397ddd79e",
  type: "loot",
  source: "W&W",
  rarity: "common",
  price: { value: 0.5, denomination: "gp" },
  weight: 0.1,
  quantity: 1,
});

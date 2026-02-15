import { ItemSchema } from "../../schemas/index.js";

export const rootOfAsphodel = ItemSchema.parse({
  id: "root-of-asphodel",
  foundryId: "7ef7071ab444ff8b",
  type: "loot",
  source: "W&W",
  rarity: "common",
  price: { value: 0.5, denomination: "gp" },
  weight: 0.1,
  quantity: 1,
});

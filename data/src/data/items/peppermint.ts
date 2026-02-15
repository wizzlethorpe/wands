import { ItemSchema } from "../../schemas/index.js";

export const peppermint = ItemSchema.parse({
  id: "peppermint",
  foundryId: "2fb60adc3769e85f",
  type: "loot",
  source: "W&W",
  rarity: "common",
  price: { value: 0.5, denomination: "gp" },
  weight: 0.1,
  quantity: 1,
});

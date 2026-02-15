import { ItemSchema } from "../../schemas/index.js";

export const jobberknollFeather = ItemSchema.parse({
  id: "jobberknoll-feather",
  foundryId: "a39966365ad9c0c0",
  type: "loot",
  source: "W&W",
  rarity: "uncommon",
  price: { value: 2.5, denomination: "gp" },
  weight: 0.1,
  quantity: 1,
});

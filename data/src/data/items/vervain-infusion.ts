import { ItemSchema } from "../../schemas/index.js";

export const vervainInfusion = ItemSchema.parse({
  id: "vervain-infusion",
  foundryId: "fb8fdb62228dd498",
  type: "loot",
  source: "W&W",
  rarity: "common",
  price: { value: 0.5, denomination: "gp" },
  weight: 0.1,
  quantity: 1,
});

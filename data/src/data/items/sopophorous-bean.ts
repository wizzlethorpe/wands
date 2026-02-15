import { ItemSchema } from "../../schemas/index.js";

export const sopophorousBean = ItemSchema.parse({
  id: "sopophorous-bean",
  foundryId: "4b090350c5ca5a7c",
  type: "loot",
  source: "W&W",
  rarity: "common",
  price: { value: 0.5, denomination: "gp" },
  weight: 0.1,
  quantity: 1,
});

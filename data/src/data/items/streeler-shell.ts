import { ItemSchema } from "../../schemas/index.js";

export const streelerShell = ItemSchema.parse({
  id: "streeler-shell",
  foundryId: "4e4f583ac0284f89",
  type: "loot",
  source: "W&W",
  rarity: "common",
  price: { value: 0.5, denomination: "gp" },
  weight: 0.1,
  quantity: 1,
});

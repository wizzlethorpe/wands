import { ItemSchema } from "../../schemas/index.js";

export const griffinClaw = ItemSchema.parse({
  id: "griffin-claw",
  foundryId: "d5ab5b407c5e929c",
  type: "loot",
  source: "W&W",
  rarity: "rare",
  price: { value: 25, denomination: "gp" },
  weight: 0.1,
  quantity: 1,
});

import { ItemSchema } from "../../schemas/index.js";

export const dragonClaw = ItemSchema.parse({
  id: "dragon-claw",
  foundryId: "c15c1f84f9708218",
  type: "loot",
  source: "W&W",
  rarity: "rare",
  price: { value: 25, denomination: "gp" },
  weight: 0.1,
  quantity: 1,
});

import { ItemSchema } from "../../schemas/index.js";

export const porcupineQuill = ItemSchema.parse({
  id: "porcupine-quill",
  foundryId: "68fa500f8013ef84",
  type: "loot",
  source: "W&W",
  rarity: "common",
  price: { value: 0.5, denomination: "gp" },
  weight: 0.1,
  quantity: 1,
});

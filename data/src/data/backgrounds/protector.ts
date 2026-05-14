import { BackgroundSchema } from "../../schemas/index.js";

export const protector = BackgroundSchema.parse({
  id: "protector",
  foundryId: "fgIjhbkUwUstlhmQ",
  type: "background",
  featureType: "background",
  source: "W&W p.35",
  requirements: "",
  activation: { type: "", cost: null, condition: "" },
  duration: { value: null, units: "" },
  uses: { value: null, max: null, per: null, recovery: "" },
  advancement: [{"_id":"93ayq5f90cjulw9x","type":"ItemGrant","configuration":{"items":["Compendium.wands.features-wands.Item.i79ohukQiIll4kei"],"optional":false,"spell":null},"value":{},"level":0,"title":"Feature","icon":null}],
});

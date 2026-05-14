import { BackgroundSchema } from "../../schemas/index.js";

export const troublemaker = BackgroundSchema.parse({
  id: "troublemaker",
  foundryId: "5riGlrKCRzKb6YxO",
  type: "background",
  featureType: "background",
  source: "W&W p.38",
  requirements: "",
  activation: { type: "", cost: null, condition: "" },
  duration: { value: null, units: "" },
  uses: { value: null, max: null, per: null, recovery: "" },
  advancement: [{"_id":"93ayq5f90cjulw9x","type":"ItemGrant","configuration":{"items":["Compendium.wands.features-wands.Item.x1hgjn8FxPcbmQpe"],"optional":false,"spell":null},"value":{},"level":0,"title":"Feature","icon":null}],
});

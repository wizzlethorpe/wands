import { BackgroundSchema } from "../../schemas/index.js";

export const potioneer = BackgroundSchema.parse({
  id: "potioneer",
  foundryId: "J92Yu2tSaENFIZYr",
  type: "background",
  featureType: "background",
  source: "W&W p.34",
  requirements: "",
  activation: { type: "", cost: null, condition: "" },
  duration: { value: null, units: "" },
  uses: { value: null, max: null, per: null, recovery: "" },
  advancement: [{"_id":"93ayq5f90cjulw9x","type":"ItemGrant","configuration":{"items":["Compendium.wands.features-wands.Item.QyIL838DMhWlpxuM"],"optional":false,"spell":null},"value":{},"level":0,"title":"Feature","icon":null}],
});

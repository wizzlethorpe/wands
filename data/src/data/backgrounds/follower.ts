import { BackgroundSchema } from "../../schemas/index.js";

export const follower = BackgroundSchema.parse({
  id: "follower",
  foundryId: "DftCIK6YcbR9TmfO",
  type: "background",
  featureType: "background",
  source: "W&W p.38",
  requirements: "",
  activation: { type: "", cost: null, condition: "" },
  duration: { value: null, units: "" },
  uses: { value: null, max: null, per: null, recovery: "" },
  advancement: [{"_id":"93ayq5f90cjulw9x","type":"ItemGrant","configuration":{"items":["Compendium.wands.features-wands.Item.GWEfVz6PDbUCtEo3"],"optional":false,"spell":null},"value":{},"level":0,"title":"Feature","icon":null}],
});

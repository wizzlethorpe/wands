import { BackgroundSchema } from "../../schemas/index.js";

export const bookworm = BackgroundSchema.parse({
  id: "bookworm",
  foundryId: "CQw3Zjj0eaDCLi0U",
  type: "background",
  featureType: "background",
  source: "W&W p.30",
  requirements: "",
  activation: { type: "", cost: null, condition: "" },
  duration: { value: null, units: "" },
  uses: { value: null, max: null, per: null, recovery: "" },
  advancement: [{"_id":"d8xaMzaP2rSIaMNq","type":"ItemGrant","configuration":{"items":["Compendium.wands.features-wands.Item.EouqUp6xId2pfrJi"],"optional":false,"spell":null},"value":{},"level":0,"title":"Feature","icon":null}],
});

import { BackgroundSchema } from "../../schemas/index.js";

export const groundskeeper = BackgroundSchema.parse({
  id: "groundskeeper",
  foundryId: "n0JksTNtROKFN90p",
  type: "background",
  featureType: "background",
  source: "W&W p.32",
  requirements: "",
  activation: { type: "", cost: null, condition: "" },
  duration: { value: null, units: "" },
  uses: { value: null, max: null, per: null, recovery: "" },
  advancement: [{"_id":"7bhe45ey5f8oecoz","type":"ItemGrant","configuration":{"items":["Compendium.wands.items-wands.MXRChbKcytwoMQib","Compendium.wands.features-wands.Item.flxM2mS2hZ93PWet"],"optional":false,"spell":null},"value":{},"level":0,"title":"Feature","icon":null}],
});

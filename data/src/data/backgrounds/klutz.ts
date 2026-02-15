import { BackgroundSchema } from "../../schemas/index.js";

export const klutz = BackgroundSchema.parse({
  id: "klutz",
  foundryId: "opg634MXVDZRCgcm",
  type: "background",
  featureType: "background",
  source: "W&W p.33",
  requirements: "",
  activation: { type: "", cost: null, condition: "" },
  duration: { value: null, units: "" },
  uses: { value: null, max: null, per: null, recovery: "" },
  advancement: [{"_id":"PFj23T7PPj7iTqrz","type":"ItemChoice","configuration":{"choices":{"0":1},"allowDrops":true,"type":"feat","pool":["Compendium.wands.backgrounds-wands.Item.6h3i8bqSCMaYTWYw","Compendium.wands.backgrounds-wands.Item.PANwBvpB0NmpLUE4"],"spell":null,"hint":"","restriction":{"type":"background"}},"value":{},"title":"Feature","icon":null}],
});

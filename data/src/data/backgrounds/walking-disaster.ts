import { BackgroundSchema } from "../../schemas/index.js";

export const walkingDisaster = BackgroundSchema.parse({
  id: "walking-disaster",
  foundryId: "6h3i8bqSCMaYTWYw",
  type: "background",
  featureType: "background",
  source: "W&W p.32",
  requirements: "Klutz",
  activation: { type: "", cost: 0, condition: "" },
  duration: { value: null, units: "" },
  uses: { value: 0, max: 0, per: null, recovery: "" },
  advancement: [],
});

import { BackgroundSchema } from "../../schemas/index.js";

export const apprentice = BackgroundSchema.parse({
  id: "apprentice",
  foundryId: "QwxIaXS4EWie4g32",
  type: "background",
  featureType: "background",
  source: "W&W p.29",
  requirements: "Artist",
  activation: { type: "", cost: 0, condition: "" },
  duration: { value: null, units: "" },
  uses: { value: 0, max: 0, per: null, recovery: "" },
  advancement: [],
});

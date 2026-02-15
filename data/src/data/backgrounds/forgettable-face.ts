import { BackgroundSchema } from "../../schemas/index.js";

export const forgettableFace = BackgroundSchema.parse({
  id: "forgettable-face",
  foundryId: "GWEfVz6PDbUCtEo3",
  type: "background",
  featureType: "background",
  source: "W&W p.37",
  requirements: "Follower",
  activation: { type: "", cost: 0, condition: "" },
  duration: { value: null, units: "" },
  uses: { value: 0, max: 0, per: null, recovery: "" },
  advancement: [],
});

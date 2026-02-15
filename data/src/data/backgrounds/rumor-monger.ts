import { BackgroundSchema } from "../../schemas/index.js";

export const rumorMonger = BackgroundSchema.parse({
  id: "rumor-monger",
  foundryId: "DkYENFbwBxF1Cvc3",
  type: "background",
  featureType: "background",
  source: "W&W p.36",
  requirements: "Socialite",
  activation: { type: "", cost: 0, condition: "" },
  duration: { value: null, units: "" },
  uses: { value: 0, max: 0, per: null, recovery: "" },
  advancement: [],
});

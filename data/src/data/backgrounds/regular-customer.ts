import { BackgroundSchema } from "../../schemas/index.js";

export const regularCustomer = BackgroundSchema.parse({
  id: "regular-customer",
  foundryId: "QyIL838DMhWlpxuM",
  type: "background",
  featureType: "background",
  source: "W&W p.33",
  requirements: "Potioneer",
  activation: { type: "", cost: 0, condition: "" },
  duration: { value: null, units: "" },
  uses: { value: 0, max: 0, per: null, recovery: "" },
  advancement: [],
});

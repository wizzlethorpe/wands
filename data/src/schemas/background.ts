import { z } from "zod";
import {
  BaseSchema,
  ActivationSchema,
  DurationSchema,
  UsesSchema,
} from "./shared.js";

export const BackgroundSchema = BaseSchema.extend({
  type: z.literal("background"),
  featureType: z.string().default("background"),

  requirements: z.string().default(""),

  activation: ActivationSchema.optional(),
  duration: DurationSchema.optional(),
  uses: UsesSchema.optional(),

  advancement: z.array(z.record(z.unknown())).default([]),
});

export type Background = z.infer<typeof BackgroundSchema>;

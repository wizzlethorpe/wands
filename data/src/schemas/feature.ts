import { z } from "zod";
import {
  BaseSchema,
  ActivationSchema,
  RangeSchema,
  DurationSchema,
  TargetSchema,
  UsesSchema,
  DamageSchema,
  SaveSchema,
} from "./shared.js";

export const FeatureSchema = BaseSchema.extend({
  type: z.literal("feat"),
  featureType: z.enum(["race", "class", "background", "feat", "subclass", "monster"]),

  requirements: z.string().default(""),

  activation: ActivationSchema.optional(),
  duration: DurationSchema.optional(),
  range: RangeSchema.optional(),
  target: TargetSchema.optional(),
  uses: UsesSchema.optional(),

  recharge: z.object({
    value: z.number().nullable().default(null),
    charged: z.boolean().default(true),
  }).optional(),

  actionType: z.string().default(""),
  attackBonus: z.number().default(0),
  damage: DamageSchema.optional(),
  save: SaveSchema.optional(),
  formula: z.string().default(""),
});

export type Feature = z.infer<typeof FeatureSchema>;

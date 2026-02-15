import { z } from "zod";
import { BaseSchema, SensesSchema } from "./shared.js";

export const HouseSchema = BaseSchema.extend({
  type: z.literal("race"),

  creatureType: z.string().default(""),
  size: z.literal("medium").default("medium"),
  abilityScoreIncrease: z.string().default(""),

  movement: z.object({
    walk: z.number().default(30),
    fly: z.number().default(0),
    swim: z.number().default(0),
    climb: z.number().default(0),
    burrow: z.number().default(0),
  }).optional(),

  senses: SensesSchema.optional(),

  traits: z.array(z.string()).default([]),
  advancement: z.array(z.record(z.unknown())).default([]),
});

export type House = z.infer<typeof HouseSchema>;

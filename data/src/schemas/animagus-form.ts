import { z } from "zod";
import {
  BaseSchema,
  AbilityScoresSchema,
  SpeedSchema,
  SensesSchema,
} from "./shared.js";

export const AnimagusFormSchema = BaseSchema.extend({
  type: z.literal("animagus"),

  formType: z.enum(["land", "air", "water"]),
  formStyle: z.enum(["combat", "evasion"]),

  size: z.enum(["tiny", "sm", "med", "lg", "huge", "grg"]),
  creatureType: z.string().default(""),
  alignment: z.string().default(""),

  ac: z.number(),
  hp: z.number(),
  hpFormula: z.string().default(""),

  speed: SpeedSchema,
  abilities: AbilityScoresSchema,
  senses: SensesSchema.optional(),
  passivePerception: z.number().default(10),
});

export type AnimagusForm = z.infer<typeof AnimagusFormSchema>;

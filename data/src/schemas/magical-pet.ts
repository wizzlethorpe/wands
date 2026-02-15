import { z } from "zod";
import {
  BaseSchema,
  AbilityScoresSchema,
  SpeedSchema,
  SensesSchema,
} from "./shared.js";

export const MagicalPetSchema = BaseSchema.extend({
  type: z.literal("pet"),

  cr: z.number().default(0),
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
  proficiencyBonus: z.number().default(2),
});

export type MagicalPet = z.infer<typeof MagicalPetSchema>;

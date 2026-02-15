import { z } from "zod";
import {
  BaseSchema,
  AbilityScoresSchema,
  SpeedSchema,
  SensesSchema,
  SavingThrowsSchema,
} from "./shared.js";

export const CreatureSchema = BaseSchema.extend({
  type: z.literal("creature"),

  cr: z.number(),
  xp: z.number().default(0),
  size: z.enum(["tiny", "sm", "med", "lg", "huge", "grg"]),
  creatureType: z.string().default(""),
  alignment: z.string().default(""),

  ac: z.number(),
  acType: z.string().default(""),
  hp: z.number(),
  hpFormula: z.string().default(""),

  speed: SpeedSchema,
  abilities: AbilityScoresSchema,
  saves: SavingThrowsSchema.optional(),
  senses: SensesSchema.optional(),
  passivePerception: z.number().default(10),

  skillBonuses: z.record(z.union([z.number(), z.object({ value: z.number().default(0) }).passthrough()])).default({}),

  damageImmunities: z.array(z.string()).default([]),
  damageResistances: z.array(z.string()).default([]),
  damageVulnerabilities: z.array(z.string()).default([]),
  conditionImmunities: z.array(z.string()).default([]),

  languages: z.array(z.string()).default([]),
  languagesCustom: z.string().default(""),
  proficiencyBonus: z.number().default(2),
});

export type Creature = z.infer<typeof CreatureSchema>;

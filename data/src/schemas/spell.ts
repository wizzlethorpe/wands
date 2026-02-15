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

export const SpellComponentsSchema = z.object({
  vocal: z.boolean().default(false),
  somatic: z.boolean().default(false),
  material: z.boolean().default(false),
  concentration: z.boolean().default(false),
  ritual: z.boolean().default(false),
});

export const SpellMaterialsSchema = z.object({
  description: z.string().default(""),
  consumed: z.boolean().default(false),
  cost: z.number().default(0),
  supply: z.number().default(0),
});

export const SpellScalingSchema = z.object({
  mode: z.enum(["none", "cantrip", "level"]).default("none"),
  formula: z.string().default(""),
});

export const SpellConsumeSchema = z.object({
  type: z.string().default(""),
  target: z.string().nullable().default(null),
  amount: z.number().nullable().default(null),
});

export const SpellSchema = BaseSchema.extend({
  type: z.literal("spell"),

  level: z.number().min(0).max(9),
  school: z.string(), // cha, hex, tra, hea, mag, abj, con, div, enc, evo, ill, nec, trs

  activation: ActivationSchema,
  range: RangeSchema,
  duration: DurationSchema,
  target: TargetSchema.optional(),
  components: SpellComponentsSchema,
  materials: SpellMaterialsSchema.optional(),
  uses: UsesSchema.optional(),
  consume: SpellConsumeSchema.optional(),

  actionType: z.string().default(""),
  attackBonus: z.number().default(0),
  chatFlavor: z.string().default(""),
  damage: DamageSchema.optional(),
  save: SaveSchema.optional(),
  scaling: SpellScalingSchema.optional(),
  formula: z.string().default(""),
  ability: z.string().default(""),

  critical: z.object({
    threshold: z.number().nullable().default(null),
    damage: z.string().nullable().default(null),
  }).optional(),

  preparation: z.object({
    mode: z.enum(["prepared", "always", "innate"]).default("prepared"),
    prepared: z.boolean().default(false),
  }).optional(),
});

export type Spell = z.infer<typeof SpellSchema>;

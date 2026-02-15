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

export const ItemSchema = BaseSchema.extend({
  type: z.enum(["consumable", "loot", "tool", "equipment", "weapon", "armor", "container", "backpack"]),

  subtype: z.string().default(""),
  category: z.string().default(""),

  rarity: z.enum(["common", "uncommon", "rare", "veryRare", "legendary", "artifact", ""]).default(""),
  price: z.object({
    value: z.number().nullable().default(null),
    denomination: z.string().default("gp"),
  }).optional(),
  weight: z.number().nullable().default(null),
  quantity: z.number().default(1),

  activation: ActivationSchema.optional(),
  duration: DurationSchema.optional(),
  range: RangeSchema.optional(),
  target: TargetSchema.optional(),
  uses: UsesSchema.optional(),

  attunement: z.number().default(0),
  equipped: z.boolean().default(false),
  identified: z.boolean().default(true),

  actionType: z.string().default(""),
  attackBonus: z.number().default(0),
  chatFlavor: z.string().default(""),
  damage: DamageSchema.optional(),
  save: SaveSchema.optional(),
  formula: z.string().default(""),
  ability: z.string().default(""),

  critical: z.object({
    threshold: z.number().nullable().default(null),
    damage: z.string().nullable().default(null),
  }).optional(),

  properties: z.array(z.string()).default([]),
  armor: z.object({
    value: z.number().nullable().default(null),
    dex: z.number().nullable().default(null),
  }).optional(),
  proficient: z.number().nullable().default(null),

  capacity: z.object({
    type: z.string().default(""),
    value: z.number().nullable().default(null),
  }).optional(),

  /** Wizzlethorpe-specific flags (cocktails, ingredients, etc.) */
  flags: z.record(z.unknown()).optional(),
});

export type Item = z.infer<typeof ItemSchema>;

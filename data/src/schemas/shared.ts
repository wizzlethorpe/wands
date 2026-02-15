import { z } from "zod";

/** Fields shared by every content entry */
export const BaseSchema = z.object({
  /** Stable slug used as the canonical identifier across builds */
  id: z.string(),
  /** Original Foundry VTT document ID (16-char hex) */
  foundryId: z.string().optional(),
  /** Source reference, e.g. "W&W p.21" */
  source: z.string().default("W&W"),
});

// ---------------------------------------------------------------------------
// Reusable sub-schemas
// ---------------------------------------------------------------------------

export const ActivationSchema = z.object({
  type: z.enum(["action", "bonus", "reaction", "minute", "hour", "special", "none", ""]).default(""),
  cost: z.number().nullable().default(null),
  condition: z.string().default(""),
});

export const RangeSchema = z.object({
  value: z.number().nullable().default(null),
  long: z.number().nullable().default(null),
  units: z.enum(["self", "touch", "ft", "mi", "spec", "any", ""]).default(""),
});

export const DurationSchema = z.object({
  value: z.number().nullable().default(null),
  units: z.enum(["inst", "round", "minute", "hour", "day", "perm", "spec", "turn", ""]).default(""),
});

export const TargetSchema = z.object({
  type: z.enum([
    "self", "creature", "object", "space", "sphere", "cube",
    "cone", "cylinder", "line", "radius", "ally", "enemy", "willing", "",
  ]).default(""),
  value: z.number().nullable().default(null),
  width: z.number().nullable().default(null),
  units: z.string().default(""),
});

export const UsesSchema = z.object({
  value: z.number().nullable().default(null),
  max: z.union([z.number(), z.string()]).nullable().default(null),
  per: z.string().nullable().default(null),
  recovery: z.string().default(""),
  autoDestroy: z.boolean().default(false),
});

export const DamageSchema = z.object({
  /** Array of [formula, damageType] tuples */
  parts: z.array(z.tuple([z.string(), z.string()])).default([]),
  versatile: z.string().default(""),
});

export const SaveSchema = z.object({
  ability: z.enum(["str", "dex", "con", "int", "wis", "cha", ""]).default(""),
  dc: z.number().nullable().default(null),
  scaling: z.string().default("spell"),
});

export const AbilityScoresSchema = z.object({
  str: z.number(),
  dex: z.number(),
  con: z.number(),
  int: z.number(),
  wis: z.number(),
  cha: z.number(),
});

export const SpeedSchema = z.object({
  walk: z.number().default(0),
  fly: z.number().default(0),
  swim: z.number().default(0),
  climb: z.number().default(0),
  burrow: z.number().default(0),
  hover: z.boolean().default(false),
});

export const SensesSchema = z.object({
  darkvision: z.number().default(0),
  blindsight: z.number().default(0),
  tremorsense: z.number().default(0),
  truesight: z.number().default(0),
  special: z.string().default(""),
});

export const SavingThrowsSchema = z.object({
  str: z.number().nullable().default(null),
  dex: z.number().nullable().default(null),
  con: z.number().nullable().default(null),
  int: z.number().nullable().default(null),
  wis: z.number().nullable().default(null),
  cha: z.number().nullable().default(null),
});

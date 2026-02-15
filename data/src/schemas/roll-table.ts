import { z } from "zod";
import { BaseSchema } from "./shared.js";

export const RollTableEntrySchema = z.object({
  range: z.tuple([z.number(), z.number()]).optional(),
  weight: z.number().default(1),
  /** Translation key or literal text */
  text: z.string(),
  type: z.number().default(0),
});

export const RollTableSchema = BaseSchema.extend({
  type: z.literal("rolltable"),

  formula: z.string(), // e.g. "1d4"
  replacement: z.boolean().default(true),
  displayRoll: z.boolean().default(true),

  entries: z.array(RollTableEntrySchema),

  /** Wizzlethorpe-specific flags */
  flags: z.record(z.unknown()).optional(),
});

export type RollTable = z.infer<typeof RollTableSchema>;
export type RollTableEntry = z.infer<typeof RollTableEntrySchema>;

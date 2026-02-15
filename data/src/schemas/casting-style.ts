import { z } from "zod";
import { BaseSchema } from "./shared.js";

export const CastingStyleSchema = BaseSchema.extend({
  type: z.enum(["subclass", "class"]),

  identifier: z.string().default(""),
  classIdentifier: z.string().default(""),
  spellcastingAbility: z.string().default(""),
  spellcastingProgression: z.string().default(""),

  advancement: z.array(z.record(z.unknown())).default([]),
});

export type CastingStyle = z.infer<typeof CastingStyleSchema>;

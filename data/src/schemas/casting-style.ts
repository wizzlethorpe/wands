import { z } from "zod";
import { BaseSchema } from "./shared.js";

/**
 * In WANDS, a "Casting Style" is a class (Willpower, Technique, Intellect)
 * and a "School of Magic" is a subclass (Charms, JHC, Transfiguration, etc.).
 * Both share the same data file dir but emit different dnd5e item types.
 */

const LevelKey = z.string().regex(/^([1-9]|1[0-9]|20)$/, "level key must be 1-20 as a string");

/**
 * Per-level feature grants. Each slug is resolved to a `Compendium.wands.features-wands…`
 * UUID at build time and emitted as a dnd5e `ItemGrant` advancement entry.
 *
 * Levels not listed don't grant any items beyond the implicit HP roll, ASI prompt
 * (at L4/8/12/16/19), or Subclass pick (at L1) added automatically by the build.
 */
export const ProgressionLevelSchema = z.object({
  grants: z.array(z.string()).default([]),
});

/**
 * A multi-level player choice — "pick N of these features at this level". Used
 * for Metamagic (8 standard options + class-specific extras, picked across
 * levels per the class table). Becomes a single dnd5e `ItemChoice` advancement
 * entry whose `choices` map encodes the per-level pick count.
 */
export const ChoicePoolSchema = z.object({
  /** Display title shown in the advancement dialog (e.g. "Metamagic"). */
  title: z.string(),
  /** Pool of feature slugs the player can pick from. */
  pool: z.array(z.string()),
  /**
   * Per-level pick count. Keys are levels ("3", "10", "17"). Values are the
   * number of NEW picks granted at that level (cumulative is computed by dnd5e).
   */
  picksByLevel: z.record(LevelKey, z.number().int().min(1)),
  /** Whether the player can swap a previously-chosen pick for a new one. */
  allowReplacement: z.boolean().default(false),
});

/**
 * A scale value (sorcery points, metamagic known, cantrips known, spells known).
 *
 * Authored as a complete level→value table from the chapter. Only entries where
 * the value changes need to be present; dnd5e holds the prior value through
 * unset levels. Authoring every level keeps the data self-explanatory.
 *
 * `null` represents "feature not yet active" (e.g. sorcery points at level 1
 * before Font of Magic is granted at level 2).
 */
export const ScaleValueSchema = z.object({
  /** dnd5e identifier (becomes `@scale.<class-id>.<identifier>` in formulas). */
  identifier: z.string(),
  /** Display title shown on class sheets. */
  title: z.string(),
  /** Value type. Currently only `"number"` is needed for the WANDS classes. */
  type: z.enum(["number"]).default("number"),
  /** Per-level numeric value. Keys are levels 1-20. */
  values: z.record(LevelKey, z.number().int().nullable()),
});

export const CastingStyleSchema = BaseSchema.extend({
  /** "class" for casting styles, "subclass" for schools of magic */
  type: z.enum(["class", "subclass"]),

  /** Slug used by dnd5e to identify the class/subclass (lowercase, hyphenated) */
  identifier: z.string().default(""),

  /** For subclasses: identifier of the parent class. Empty = applies to any class. */
  classIdentifier: z.string().default(""),

  /** Hit die denomination for classes, e.g. "d10". Ignored for subclasses. */
  hitDice: z.enum(["d4", "d6", "d8", "d10", "d12", ""]).default(""),

  /** Saving throw proficiencies (classes only). Two ability keys, e.g. ["con", "cha"]. */
  saves: z.array(z.enum(["str", "dex", "con", "int", "wis", "cha"])).default([]),

  /** dnd5e ability keys this class uses primarily, e.g. ["cha"]. */
  primaryAbility: z.array(z.enum(["str", "dex", "con", "int", "wis", "cha"])).default([]),

  /** Spellcasting ability key, e.g. "cha". Empty for non-spellcasting subclasses. */
  spellcastingAbility: z.string().default(""),

  /** dnd5e progression key: "none" | "third" | "half" | "full" | "artificer" | "pact" */
  spellcastingProgression: z.string().default("none"),

  /**
   * Per-level feature grants (1-20). Only levels with grants need to be present.
   *
   * Implicit additions made automatically by the build (do NOT list them here):
   *   - HitPoints advancement at every level (driven by `hitDice`)
   *   - Subclass advancement at level 1 (offers school-of-magic pick)
   *   - AbilityScoreImprovement advancement at levels 4, 8, 12, 16, 19
   *
   * The `school-of-magic` feature item is granted at level 1 in `progression`
   * (separately from the Subclass advancement) so the player has a description
   * card for the feature itself; the Subclass advancement is what actually
   * embeds the chosen subclass item on the actor.
   */
  progression: z.record(LevelKey, ProgressionLevelSchema).default({}),

  /** Multi-level player choices (e.g. Metamagic). One `ItemChoice` advancement per pool. */
  choices: z.array(ChoicePoolSchema).default([]),

  /** Numeric scale values that vary by class level. */
  scaleValues: z.array(ScaleValueSchema).default([]),

  /** Pre-built advancement entries to append last (escape hatch — usually empty). */
  advancement: z.array(z.record(z.unknown())).default([]),
});

export type CastingStyle = z.infer<typeof CastingStyleSchema>;
export type ProgressionLevel = z.infer<typeof ProgressionLevelSchema>;
export type ChoicePool = z.infer<typeof ChoicePoolSchema>;
export type ScaleValue = z.infer<typeof ScaleValueSchema>;

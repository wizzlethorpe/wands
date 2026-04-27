/**
 * Build Foundry VTT JSON files from wands-data source.
 *
 * Content comes from TypeScript schemas + locale files (single source of truth).
 * Foundry-specific presentation metadata (images, folders, sort order, embedded
 * items, prototype tokens) comes from per-pack overlay files in src/foundry-meta/.
 * Markdown descriptions are converted to HTML with @UUID link resolution.
 *
 * Output goes to dist/foundry/<pack-name>/<id>.json, then compiled to LevelDB.
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import type { Spell } from "../schemas/spell.js";
import type { Item } from "../schemas/item.js";
import type { Creature } from "../schemas/creature.js";
import type { Feature } from "../schemas/feature.js";
import type { Background } from "../schemas/background.js";
import type { House } from "../schemas/house.js";
import type { CastingStyle } from "../schemas/casting-style.js";
import type { AnimagusForm } from "../schemas/animagus-form.js";
import type { MagicalPet } from "../schemas/magical-pet.js";
import type { RollTable } from "../schemas/roll-table.js";
import { t } from "./utils/i18n.js";
import { markdownToHtml } from "./utils/html.js";
import type { LinkResolver } from "./utils/link-resolver.js";

const DIST = path.resolve(import.meta.dirname, "../../dist/foundry");
const META_DIR = path.resolve(import.meta.dirname, "../foundry-meta");

function ensureDir(dir: string) {
  fs.mkdirSync(dir, { recursive: true });
}

/**
 * Clear all .json files from a pack output directory before writing new ones.
 *
 * Without this, deleting a source data entry would leave its old dist JSON in
 * place and `compile-packs.ts` would still pick it up — so stale entries would
 * silently keep showing up in the LevelDB until someone manually cleaned dist.
 * Called once per pack at the start of {@link buildFoundry}.
 */
function cleanPackDir(dir: string) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir)) {
    if (entry.endsWith(".json")) fs.rmSync(path.join(dir, entry));
  }
}

function writeJson(dir: string, id: string, data: unknown) {
  ensureDir(dir);
  fs.writeFileSync(path.join(dir, `${id}.json`), JSON.stringify(data, null, 2), "utf-8");
}

const DEFAULT_STATS = {
  systemId: "dnd5e",
  systemVersion: "5.3.0",
  coreVersion: "14.359",
  createdTime: null,
  modifiedTime: null,
  lastModifiedBy: null,
  compendiumSource: null,
  duplicateSource: null,
  exportSource: null,
};

// ---------------------------------------------------------------------------
// Overlay loaders
// ---------------------------------------------------------------------------

type OverlayMap = Map<string, Record<string, unknown>>;

/** Load a per-pack metadata overlay from src/foundry-meta/<packName>.json */
function loadOverlay(packName: string): OverlayMap {
  const filePath = path.join(META_DIR, `${packName}.json`);
  if (!fs.existsSync(filePath)) return new Map();
  const raw = JSON.parse(fs.readFileSync(filePath, "utf-8")) as Record<string, Record<string, unknown>>;
  return new Map(Object.entries(raw));
}

/** Load folder documents from src/foundry-meta/<packName>.folders.json */
function loadFolders(packName: string): Record<string, unknown>[] {
  const filePath = path.join(META_DIR, `${packName}.folders.json`);
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, "utf-8")) as Record<string, unknown>[];
}

/** Get overlay metadata for an entity, falling back to defaults */
function getMeta(overlay: OverlayMap, id: string) {
  const meta = overlay.get(id) ?? {};
  // Always emit current DEFAULT_STATS — overlays carry stale version stamps from
  // the original v3-era extraction and we want every rebuild to advertise the
  // version it was actually built against.
  return {
    img: (meta.img as string) ?? "icons/svg/d20-black.svg",
    folder: (meta.folder as string | null) ?? null,
    sort: (meta.sort as number) ?? 0,
    ownership: (meta.ownership as Record<string, unknown>) ?? { default: 0 },
    flags: (meta.flags as Record<string, unknown>) ?? {},
    effects: (meta.effects as unknown[]) ?? [],
    _stats: DEFAULT_STATS,
    // Actor-specific
    prototypeToken: meta.prototypeToken as Record<string, unknown> | undefined,
    items: meta.items as unknown[] | undefined,
    system: meta.system as Record<string, unknown> | undefined,
    // Roll table-specific
    results: meta.results as unknown[] | undefined,
  };
}

/** Write folder documents for a pack */
function writeFolders(packName: string): number {
  const folders = loadFolders(packName);
  for (const folder of folders) {
    const fid = folder._id as string;
    if (fid) writeJson(path.join(DIST, packName), fid, folder);
  }
  return folders.length;
}

// ---------------------------------------------------------------------------
// Per-type converters
// ---------------------------------------------------------------------------

function componentsToProperties(comp: Spell["components"]): string[] {
  const props: string[] = [];
  if (comp.vocal) props.push("vocal");
  if (comp.somatic) props.push("somatic");
  if (comp.material) props.push("material");
  if (comp.concentration) props.push("concentration");
  if (comp.ritual) props.push("ritual");
  return props;
}

function spellToFoundry(spell: Spell, locale: string, overlay: OverlayMap, lr: LinkResolver) {
  const name = t(`spells.${spell.id}.name`, locale);
  const desc = markdownToHtml(t(`spells.${spell.id}.description`, locale), lr);
  const id = spell.foundryId ?? spell.id;
  const m = getMeta(overlay, id);
  const mat = spell.materials;

  return {
    _id: id,
    name,
    type: "spell",
    img: m.img,
    system: {
      description: { value: desc, chat: "" },
      source: { custom: spell.source },
      level: spell.level,
      school: spell.school,
      activation: spell.activation,
      range: spell.range,
      duration: spell.duration,
      target: spell.target ?? { type: "", value: null, width: null, units: "" },
      uses: spell.uses ?? { value: null, max: null, per: null, recovery: "" },
      consume: spell.consume ?? { type: "", target: null, amount: null },
      ability: spell.ability,
      actionType: spell.actionType,
      attackBonus: String(spell.attackBonus || ""),
      chatFlavor: spell.chatFlavor,
      critical: { threshold: spell.critical?.threshold ?? null, damage: spell.critical?.damage ?? "" },
      damage: { parts: spell.damage?.parts ?? [] },
      formula: spell.formula,
      save: spell.save ?? { ability: "", dc: null, scaling: "spell" },
      materials: { value: mat?.description ?? "", consumed: mat?.consumed ?? false, cost: mat?.cost ?? 0, supply: mat?.supply ?? 0 },
      preparation: spell.preparation ?? { mode: "prepared", prepared: false },
      properties: componentsToProperties(spell.components),
    },
    effects: m.effects,
    folder: m.folder,
    sort: m.sort,
    flags: m.flags,
    ownership: m.ownership,
    _stats: m._stats,
    _key: `!items!${id}`,
  };
}

function itemToFoundry(item: Item, locale: string, overlay: OverlayMap, lr: LinkResolver) {
  const name = t(`items.${item.id}.name`, locale);
  const desc = markdownToHtml(t(`items.${item.id}.description`, locale), lr);
  const id = item.foundryId ?? item.id;
  const m = getMeta(overlay, id);

  return {
    _id: id,
    name,
    type: item.type,
    img: m.img,
    system: {
      description: { value: desc, chat: "" },
      source: { custom: item.source },
      type: { value: item.subtype, subtype: "" },
      quantity: item.quantity,
      rarity: item.rarity,
      identified: item.identified,
      equipped: item.equipped,
      attunement: item.attunement,
      price: item.price ?? { value: null, denomination: "gp" },
      weight: item.weight,
      activation: item.activation ?? { type: "", cost: null, condition: "" },
      duration: item.duration ?? { value: null, units: "" },
      range: item.range ?? { value: null, units: "" },
      target: item.target ?? { type: "", value: null, units: "" },
      uses: item.uses ?? { value: null, max: null, per: null, recovery: "", autoDestroy: false },
      actionType: item.actionType,
      attackBonus: String(item.attackBonus || ""),
      chatFlavor: item.chatFlavor,
      damage: { parts: item.damage?.parts ?? [] },
      save: item.save ?? { ability: "", dc: null, scaling: "" },
      formula: item.formula,
      ability: item.ability,
      critical: { threshold: item.critical?.threshold ?? null, damage: item.critical?.damage ?? "" },
      properties: item.properties,
      armor: item.armor ?? { value: null, dex: null },
      proficient: item.proficient,
      capacity: item.capacity ?? { type: "", value: null },
    },
    effects: m.effects,
    folder: m.folder,
    sort: m.sort,
    flags: { ...(item.flags ?? {}), ...m.flags },
    ownership: m.ownership,
    _stats: m._stats,
    _key: `!items!${id}`,
  };
}

function creatureToFoundry(creature: Creature, locale: string, overlay: OverlayMap, lr: LinkResolver) {
  const name = t(`creatures.${creature.id}.name`, locale);
  const desc = markdownToHtml(t(`creatures.${creature.id}.description`, locale), lr);
  const a = creature.abilities;
  const id = creature.foundryId ?? creature.id;
  const m = getMeta(overlay, id);

  return {
    _id: id,
    name,
    type: "npc",
    img: m.img,
    system: {
      description: { value: desc, chat: "" },
      source: { custom: creature.source },
      details: {
        cr: creature.cr,
        xp: { value: creature.xp },
        type: { value: creature.creatureType },
        alignment: creature.alignment,
      },
      traits: {
        size: creature.size,
        di: { value: creature.damageImmunities },
        dr: { value: creature.damageResistances },
        dv: { value: creature.damageVulnerabilities },
        ci: { value: creature.conditionImmunities },
        languages: { value: creature.languages, custom: creature.languagesCustom },
      },
      attributes: {
        ac: { flat: creature.ac, calc: "natural" },
        hp: { value: creature.hp, max: creature.hp, formula: creature.hpFormula },
        movement: creature.speed,
        senses: creature.senses ?? {},
      },
      abilities: {
        str: { value: a.str }, dex: { value: a.dex }, con: { value: a.con },
        int: { value: a.int }, wis: { value: a.wis }, cha: { value: a.cha },
      },
      skills: creature.skillBonuses,
      // Merge extra system fields from overlay (skills overrides, spells, bonuses, etc.)
      ...m.system,
    },
    items: m.items ?? [],
    effects: m.effects,
    prototypeToken: m.prototypeToken ?? {},
    folder: m.folder,
    sort: m.sort,
    flags: m.flags,
    ownership: m.ownership,
    _stats: m._stats,
    _key: `!actors!${id}`,
  };
}

function featureToFoundry(feat: Feature, locale: string, overlay: OverlayMap, lr: LinkResolver) {
  const name = t(`features.${feat.id}.name`, locale);
  const desc = markdownToHtml(t(`features.${feat.id}.description`, locale), lr);
  const id = feat.foundryId ?? feat.id;
  const m = getMeta(overlay, id);

  return {
    _id: id,
    name,
    type: "feat",
    img: m.img,
    system: {
      description: { value: desc, chat: "" },
      source: { custom: feat.source },
      type: { value: feat.featureType },
      requirements: feat.requirements,
      activation: feat.activation ?? { type: "", cost: null, condition: "" },
      duration: feat.duration ?? { value: null, units: "" },
      range: feat.range ?? { value: null, units: "" },
      target: feat.target ?? { type: "", value: null, units: "" },
      uses: feat.uses ?? { value: null, max: null, per: null, recovery: "" },
      recharge: feat.recharge ?? { value: null, charged: true },
      actionType: feat.actionType,
      attackBonus: String(feat.attackBonus || ""),
      damage: { parts: feat.damage?.parts ?? [] },
      save: feat.save ?? { ability: "", dc: null, scaling: "" },
      formula: feat.formula,
    },
    effects: m.effects,
    folder: m.folder,
    sort: m.sort,
    flags: m.flags,
    ownership: m.ownership,
    _stats: m._stats,
    _key: `!items!${id}`,
  };
}

function backgroundToFoundry(bg: Background, locale: string, overlay: OverlayMap, lr: LinkResolver) {
  const name = t(`backgrounds.${bg.id}.name`, locale);
  const desc = markdownToHtml(t(`backgrounds.${bg.id}.description`, locale), lr);
  const id = bg.foundryId ?? bg.id;
  const m = getMeta(overlay, id);

  return {
    _id: id,
    name,
    // dnd5e v4+: backgrounds are a first-class item type, not feat-with-subtype.
    type: "background",
    img: m.img,
    system: {
      description: { value: desc, chat: "" },
      identifier: bg.id,
      source: { custom: bg.source, rules: "2024" },
      advancement: bg.advancement,
      // StartingEquipmentTemplate fields — empty defaults are valid.
      startingEquipment: [],
      wealth: "",
    },
    effects: m.effects,
    folder: m.folder,
    sort: m.sort,
    flags: m.flags,
    ownership: m.ownership,
    _stats: m._stats,
    _key: `!items!${id}`,
  };
}

// dnd5e uses 3-letter size codes (tiny/sm/med/lg/huge/grg). House schema authors
// in long form ("medium") for readability; convert here.
const SIZE_TO_DND5E_CODE: Record<string, string> = {
  tiny: "tiny", small: "sm", medium: "med", large: "lg", huge: "huge", gargantuan: "grg",
};
const SIZE_LABEL: Record<string, string> = {
  tiny: "Tiny", sm: "Small", med: "Medium", lg: "Large", huge: "Huge", grg: "Gargantuan",
};

/**
 * Patch (or inject) the Size advancement on a house's advancement chain.
 *
 * dnd5e v5's `SizeFlow` template renders no body when the configured `sizes`
 * array contains exactly one entry — the size auto-applies silently and the
 * advancement step shows up as a visually-empty pane in the wizard. We work
 * around this by populating the `hint` field with a one-liner stating the
 * size, which the flow header renders via `advancement-flow-header.hbs`.
 *
 * If the data file already authors a Size advancement (every house currently
 * does), we patch in the hint and ensure the `sizes` config matches the
 * schema's `size` field. Otherwise we inject a new Size entry.
 */
function patchHouseSizeAdvancement(house: House): Record<string, unknown>[] {
  const sizeCode = SIZE_TO_DND5E_CODE[house.size] ?? "med";
  const hint = `<p>Your size is ${SIZE_LABEL[sizeCode] ?? "Medium"}.</p>`;
  const sourceAdvancement = house.advancement as Record<string, unknown>[];

  const out: Record<string, unknown>[] = [];
  let sizePatched = false;
  for (const entry of sourceAdvancement) {
    if (entry.type === "Size") {
      out.push({
        ...entry,
        configuration: { sizes: [sizeCode] },
        hint,
      });
      sizePatched = true;
    } else {
      out.push(entry);
    }
  }
  if (!sizePatched) {
    out.unshift({
      _id: stableId(`${house.id}:size`),
      type: "Size",
      configuration: { sizes: [sizeCode] },
      value: {},
      level: 0,
      title: undefined,
      hint,
      icon: undefined,
      classRestriction: undefined,
      flags: {},
    });
  }
  return out;
}

function houseToFoundry(house: House, locale: string, overlay: OverlayMap, lr: LinkResolver) {
  const name = t(`houses.${house.id}.name`, locale);
  const desc = markdownToHtml(t(`houses.${house.id}.description`, locale), lr);
  const id = house.foundryId ?? house.id;
  const m = getMeta(overlay, id);

  return {
    _id: id,
    name,
    type: "race",
    img: m.img,
    system: {
      description: { value: desc, chat: "" },
      source: { custom: house.source },
      type: { value: "humanoid" },
      traits: house.traits,
      movement: house.movement ?? { walk: 30 },
      senses: house.senses ?? {},
      advancement: patchHouseSizeAdvancement(house),
    },
    effects: m.effects,
    folder: m.folder,
    sort: m.sort,
    flags: m.flags,
    ownership: m.ownership,
    _stats: m._stats,
    _key: `!items!${id}`,
  };
}

/**
 * Deterministic 16-char hex ID derived from a seed string. Used to give
 * generated advancement entries stable IDs across rebuilds (so the LevelDB diff
 * stays minimal and existing actor instances keep referring to the same entry).
 */
function stableId(seed: string): string {
  return crypto.createHash("sha1").update(seed).digest("hex").slice(0, 16);
}

/**
 * Expand each subclass entry into one variant per casting-style class.
 *
 * dnd5e v5's Subclass advancement opens the compendium browser with a *locked*
 * filter of `system.classIdentifier === <parent class identifier>`. WANDS
 * schools of magic are explicitly orthogonal to casting style (any school
 * works with any caster — see Chapter 2), so a single subclass entry with an
 * empty classIdentifier matches no parent and "Browse" returns 0 results.
 *
 * The fix is to fan each school out at build time: one compendium entry per
 * (school × caster) pair. Source data stays at one entry per school; the
 * Foundry pack ends up with N_schools × N_casters entries. The original
 * foundryId is preserved for the first caster's variant so existing world
 * references survive; the other variants get deterministic synthetic IDs.
 */
function expandSubclassesPerCaster(items: CastingStyle[], overlay: OverlayMap): CastingStyle[] {
  const casters = items.filter(i => i.type === "class").map(i => i.identifier).filter(Boolean);
  if (casters.length === 0) return items;

  const out: CastingStyle[] = [];
  for (const item of items) {
    if (item.type !== "subclass") {
      out.push(item);
      continue;
    }
    const sourceId = item.foundryId ?? item.id;
    const sourceOverlay = overlay.get(sourceId);
    casters.forEach((classId, idx) => {
      const variantFoundryId = idx === 0
        ? sourceId  // preserve original for first variant — minimizes world-data churn
        : stableId(`${sourceId}:${classId}`);
      // Mirror the source's folder / image / sort onto the synthetic variant by
      // injecting an overlay entry under the new foundryId. Without this, the
      // technique/intellect variants would land in the compendium root with the
      // default placeholder image, which is what the user noticed visually.
      if (sourceOverlay && variantFoundryId !== sourceId && !overlay.has(variantFoundryId)) {
        overlay.set(variantFoundryId, { ...sourceOverlay });
      }
      out.push({
        ...item,
        // Keep `id` (i18n key) shared across variants so name/description lookups still resolve.
        foundryId: variantFoundryId,
        classIdentifier: classId,
      });
    });
  }
  return out;
}

/**
 * Build a slug → Foundry compendium UUID lookup for features.
 *
 * Used by `buildClassAdvancement` to resolve `progression.grants` and
 * `choices.pool` slugs into the `Compendium.wands.features-wands.Item.<id>`
 * UUIDs that dnd5e's `ItemGrant` and `ItemChoice` advancements expect.
 *
 * Throws on lookup miss so a typo in a caster data file fails the build
 * loudly rather than silently producing a broken advancement entry.
 */
function buildFeatureLookup(features: Feature[]): (slug: string) => string {
  const map = new Map<string, string>();
  for (const f of features) {
    const fid = f.foundryId ?? f.id;
    map.set(f.id, `Compendium.wands.features-wands.Item.${fid}`);
  }
  return (slug: string) => {
    const uuid = map.get(slug);
    if (!uuid) throw new Error(`[build-foundry] no feature found for slug "${slug}" — check data/src/data/features/ for the correct id`);
    return uuid;
  };
}

/**
 * Construct the full dnd5e v5 advancement chain for a class item.
 *
 * The chain is composed of three layers:
 *
 *   1. **Implicit baseline** — added unconditionally so the level-up dialog
 *      always functions. HitPoints (multiLevel), Subclass (L1), ASI (L4/8/12/16/19).
 *
 *   2. **Authored progression** — `cs.progression`, `cs.choices`, `cs.scaleValues`
 *      from the caster data file. These mirror the chapter table directly:
 *        - `progression[level].grants` → `ItemGrant` entries (one per level)
 *        - `choices` → one `ItemChoice` entry per pool, with per-level pick counts
 *        - `scaleValues` → one `ScaleValue` entry per identifier
 *
 *   3. **Free-form escape hatch** — `cs.advancement` entries are appended last
 *      for cases the structured fields don't cover. Empty in normal use.
 *
 * Every advancement entry gets a deterministic `_id` derived from a seed
 * unique to the (class, kind, level/identifier) tuple, so rebuilds produce
 * stable output and existing actors keep referring to the same entries.
 */
function buildAdvancementChain(
  cs: CastingStyle,
  featureUuid: (slug: string) => string,
): Record<string, unknown>[] {
  const seed = cs.identifier || cs.id;
  const entry = (kind: string, level: number, idSuffix: string, fields: Record<string, unknown> = {}) => ({
    _id: stableId(`${seed}:${kind}:${idSuffix}`),
    type: kind,
    configuration: {},
    value: {},
    level,
    title: undefined,
    icon: undefined,
    classRestriction: undefined,
    flags: {},
    ...fields,
  });

  const advancement: Record<string, unknown>[] = [];

  // ---- Layer 1: implicit baseline (class items only) --------------------
  // Subclasses don't roll HP, prompt for sub-subclasses, or grant ASI — those
  // belong to the parent class.
  if (cs.type === "class") {
    // HitPoints is multiLevel — one entry handles every level. level=0 by convention.
    advancement.push(entry("HitPoints", 0, "hp"));
    // School of Magic is picked at level 1 in WANDS (Chapter 2).
    advancement.push(entry("Subclass", 1, "subclass"));
    // Modern (2024) ASI cadence: 4, 8, 12, 16, 19. Level 19 is the Epic Boon slot.
    for (const level of [4, 8, 12, 16, 19]) {
      advancement.push(entry("AbilityScoreImprovement", level, `asi-${level}`, {
        configuration: { cap: 2, fixed: {}, locked: [], points: 2 }
      }));
    }
  }

  // ---- Layer 2a: per-level ItemGrants from progression -------------------
  for (const [levelStr, level] of Object.entries(cs.progression)) {
    const lvl = Number(levelStr);
    if (level.grants.length === 0) continue;
    advancement.push(entry("ItemGrant", lvl, `grant-${lvl}`, {
      configuration: {
        items: level.grants.map(slug => ({ uuid: featureUuid(slug), optional: false })),
        optional: false,
        spell: null,
      }
    }));
  }

  // ---- Layer 2b: ItemChoice pools (Metamagic for classes; per-level
  // school feature picks like "Bewitching Studies" / "Combat-Ready" for subclasses).
  for (const choice of cs.choices) {
    advancement.push(entry("ItemChoice", 0, `choice-${choice.title.toLowerCase().replace(/\s+/g, "-")}`, {
      title: choice.title,
      configuration: {
        allowDrops: true,
        choices: Object.fromEntries(
          Object.entries(choice.picksByLevel).map(([lvl, count]) => [
            lvl, { count, replacement: choice.allowReplacement }
          ])
        ),
        pool: choice.pool.map(slug => ({ uuid: featureUuid(slug) })),
        restriction: { level: "", list: [], subtype: "", type: "" },
        spell: null,
        type: "feat",
      },
    }));
  }

  // ---- Layer 2c: ScaleValue advancements ---------------------------------
  for (const sv of cs.scaleValues) {
    advancement.push(entry("ScaleValue", 0, `scale-${sv.identifier}`, {
      title: sv.title,
      configuration: {
        identifier: sv.identifier,
        type: sv.type,
        distance: { units: "" },
        // Skip null entries — dnd5e treats unset levels as inheriting prior value.
        // For levels where the feature isn't yet active (e.g. sorcery points
        // before L2 Font of Magic), we omit the entry so it shows as blank.
        scale: Object.fromEntries(
          Object.entries(sv.values)
            .filter(([, v]) => v !== null)
            .map(([lvl, v]) => [lvl, { value: v }])
        ),
      },
    }));
  }

  // ---- Layer 3: free-form escape hatch -----------------------------------
  return advancement.concat(cs.advancement as Record<string, unknown>[]);
}

function castingStyleToFoundry(
  cs: CastingStyle,
  locale: string,
  overlay: OverlayMap,
  lr: LinkResolver,
  featureUuid: (slug: string) => string,
) {
  const name = t(`casting-styles.${cs.id}.name`, locale);
  const desc = markdownToHtml(t(`casting-styles.${cs.id}.description`, locale), lr);
  const id = cs.foundryId ?? cs.id;
  const m = getMeta(overlay, id);

  // Common system fields shared between class and subclass items.
  const baseSystem = {
    description: { value: desc, chat: "" },
    identifier: cs.identifier,
    source: { custom: cs.source, rules: "2024" },
    spellcasting: {
      progression: cs.spellcastingProgression || "none",
      ability: cs.spellcastingAbility,
      preparation: { formula: "" },
    },
  };

  // dnd5e v5 ClassData adds hd, levels, primaryAbility, properties, startingEquipment.
  // Classes also need a baseline advancement chain or the level-up dialog will not open.
  // dnd5e v5 SubclassData adds classIdentifier. Both share the same advancement
  // builder — `buildAdvancementChain` includes the implicit baseline (HP, ASI,
  // Subclass pick) only for classes.
  const advancement = buildAdvancementChain(cs, featureUuid);
  const system = cs.type === "class"
    ? {
        ...baseSystem,
        hd: { additional: "", denomination: cs.hitDice || "d6", spent: 0 },
        levels: 1,
        primaryAbility: { value: cs.primaryAbility, all: cs.primaryAbility.length <= 1 },
        properties: [],
        startingEquipment: [],
        wealth: "",
        advancement,
      }
    : {
        ...baseSystem,
        classIdentifier: cs.classIdentifier,
        advancement,
      };

  return {
    _id: id,
    name,
    type: cs.type,
    img: m.img,
    system,
    effects: m.effects,
    folder: m.folder,
    sort: m.sort,
    flags: m.flags,
    ownership: m.ownership,
    _stats: m._stats,
    _key: `!items!${id}`,
  };
}

function actorStatBlock(entry: AnimagusForm | MagicalPet, locale: string, ns: string, overlay: OverlayMap, lr: LinkResolver) {
  const name = t(`${ns}.${entry.id}.name`, locale);
  const desc = markdownToHtml(t(`${ns}.${entry.id}.description`, locale), lr);
  const a = entry.abilities;
  const id = entry.foundryId ?? entry.id;
  const m = getMeta(overlay, id);

  return {
    _id: id,
    name,
    type: "npc",
    img: m.img,
    system: {
      description: { value: desc, chat: "" },
      source: { custom: entry.source },
      traits: { size: entry.size },
      attributes: {
        ac: { flat: entry.ac, calc: "natural" },
        hp: { value: entry.hp, max: entry.hp, formula: entry.hpFormula },
        movement: entry.speed,
        senses: entry.senses ?? {},
      },
      abilities: {
        str: { value: a.str }, dex: { value: a.dex }, con: { value: a.con },
        int: { value: a.int }, wis: { value: a.wis }, cha: { value: a.cha },
      },
      ...m.system,
    },
    items: m.items ?? [],
    effects: m.effects,
    prototypeToken: m.prototypeToken ?? {},
    folder: m.folder,
    sort: m.sort,
    flags: m.flags,
    ownership: m.ownership,
    _stats: m._stats,
    _key: `!actors!${id}`,
  };
}

function rollTableToFoundry(table: RollTable, locale: string, overlay: OverlayMap, lr: LinkResolver) {
  const name = t(`roll-tables.${table.id}.name`, locale);
  const desc = markdownToHtml(t(`roll-tables.${table.id}.description`, locale), lr);
  const id = table.foundryId ?? table.id;
  const m = getMeta(overlay, id);

  // If overlay has full results (from old data with documentUuid, _stats, etc.), use those
  // but update names. Otherwise generate from TS source.
  const results = m.results ?? table.entries.map((e, i) => {
    const rid = `${id}_r${i}`;
    return {
      _id: rid,
      type: e.type,
      text: t(e.text, locale),
      weight: e.weight,
      range: e.range,
      drawn: false,
      flags: {},
      _stats: DEFAULT_STATS,
      _key: `!tables.results!${id}.${rid}`,
    };
  });

  return {
    _id: id,
    name,
    img: m.img,
    description: desc,
    results,
    formula: table.formula,
    replacement: table.replacement,
    displayRoll: table.displayRoll,
    folder: m.folder,
    sort: m.sort,
    flags: m.flags,
    ownership: m.ownership,
    _stats: m._stats,
    _key: `!tables!${id}`,
  };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export interface BuildFoundryOptions {
  locale?: string;
  linkResolver: LinkResolver;
  spells?: Spell[];
  items?: Item[];
  creatures?: Creature[];
  features?: Feature[];
  backgrounds?: Background[];
  houses?: House[];
  castingStyles?: CastingStyle[];
  animagusForms?: AnimagusForm[];
  magicalPets?: MagicalPet[];
  rollTables?: RollTable[];
}

export function buildFoundry(opts: BuildFoundryOptions) {
  const locale = opts.locale ?? "en";
  const lr = opts.linkResolver;
  const featureUuid = buildFeatureLookup(opts.features ?? []);
  const counts: Record<string, number> = {};
  let folderCount = 0;

  // Pack definitions: [packName, data array, converter function]
  const packs: Array<{
    name: string;
    items: unknown[];
    convert: (entry: any, overlay: OverlayMap) => unknown;
    getId: (entry: any) => string;
  }> = [
    {
      name: "spells-wands",
      items: opts.spells ?? [],
      convert: (s: Spell, ov) => spellToFoundry(s, locale, ov, lr),
      getId: (s: Spell) => s.foundryId ?? s.id,
    },
    {
      name: "items-wands",
      items: opts.items ?? [],
      convert: (i: Item, ov) => itemToFoundry(i, locale, ov, lr),
      getId: (i: Item) => i.foundryId ?? i.id,
    },
    {
      name: "monsters-wands",
      items: opts.creatures ?? [],
      convert: (c: Creature, ov) => creatureToFoundry(c, locale, ov, lr),
      getId: (c: Creature) => c.foundryId ?? c.id,
    },
    {
      name: "features-wands",
      items: opts.features ?? [],
      convert: (f: Feature, ov) => featureToFoundry(f, locale, ov, lr),
      getId: (f: Feature) => f.foundryId ?? f.id,
    },
    {
      name: "backgrounds-wands",
      items: opts.backgrounds ?? [],
      convert: (b: Background, ov) => backgroundToFoundry(b, locale, ov, lr),
      getId: (b: Background) => b.foundryId ?? b.id,
    },
    {
      name: "houses-wands",
      items: opts.houses ?? [],
      convert: (h: House, ov) => houseToFoundry(h, locale, ov, lr),
      getId: (h: House) => h.foundryId ?? h.id,
    },
    (() => {
      // Build-time expansion: one subclass entry per (school × caster) pair so
      // dnd5e's locked classIdentifier filter on the Subclass advancement browser
      // returns matching options for every parent class. Loaded eagerly here
      // (rather than inside the main loop) so the expansion can inject synthetic
      // overlay entries for the variants' new foundryIds — keeping each variant
      // in the same "Schools of Magic" folder and using the source school's icon.
      const name = "casting-styles-and-schools-of-magic-wands";
      const overlay = loadOverlay(name);
      return {
        name,
        items: expandSubclassesPerCaster(opts.castingStyles ?? [], overlay),
        convert: (cs: CastingStyle, _ov: OverlayMap) =>
          castingStyleToFoundry(cs, locale, overlay, lr, featureUuid),
        getId: (cs: CastingStyle) => cs.foundryId ?? cs.id,
      };
    })(),
    {
      name: "animagus-form-wands",
      items: opts.animagusForms ?? [],
      convert: (af: AnimagusForm, ov) => actorStatBlock(af, locale, "animagus-forms", ov, lr),
      getId: (af: AnimagusForm) => af.foundryId ?? af.id,
    },
    {
      name: "magical-pets-wands",
      items: opts.magicalPets ?? [],
      convert: (p: MagicalPet, ov) => actorStatBlock(p, locale, "magical-pets", ov, lr),
      getId: (p: MagicalPet) => p.foundryId ?? p.id,
    },
    {
      name: "wands-roll-tables",
      items: opts.rollTables ?? [],
      convert: (rt: RollTable, ov) => rollTableToFoundry(rt, locale, ov, lr),
      getId: (rt: RollTable) => rt.foundryId ?? rt.id,
    },
  ];

  for (const pack of packs) {
    const overlay = loadOverlay(pack.name);
    const packDir = path.join(DIST, pack.name);

    // Drop any prior JSON output for this pack so deletions in the source data
    // don't leave stale entries behind for compile-packs.ts to pick up.
    cleanPackDir(packDir);

    // Write entity documents
    for (const entry of pack.items) {
      const id = pack.getId(entry);
      const result = pack.convert(entry, overlay);
      writeJson(packDir, id, result);
    }
    counts[pack.name] = pack.items.length;

    // Write folder documents
    folderCount += writeFolders(pack.name);
  }

  console.log(`[build-foundry] locale=${locale}, ${folderCount} folders`);
  for (const [k, v] of Object.entries(counts)) {
    if (v > 0) console.log(`  ${k}: ${v}`);
  }
}

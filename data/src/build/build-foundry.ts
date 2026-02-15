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

function writeJson(dir: string, id: string, data: unknown) {
  ensureDir(dir);
  fs.writeFileSync(path.join(dir, `${id}.json`), JSON.stringify(data, null, 2), "utf-8");
}

const DEFAULT_STATS = {
  systemId: "dnd5e",
  systemVersion: "3.0.3",
  coreVersion: "13.347",
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
  return {
    img: (meta.img as string) ?? "icons/svg/d20-black.svg",
    folder: (meta.folder as string | null) ?? null,
    sort: (meta.sort as number) ?? 0,
    ownership: (meta.ownership as Record<string, unknown>) ?? { default: 0 },
    flags: (meta.flags as Record<string, unknown>) ?? {},
    effects: (meta.effects as unknown[]) ?? [],
    _stats: (meta._stats as Record<string, unknown>) ?? DEFAULT_STATS,
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
    type: "feat",
    img: m.img,
    system: {
      description: { value: desc, chat: "" },
      source: { custom: bg.source },
      type: { value: "background" },
      requirements: bg.requirements,
      activation: bg.activation ?? { type: "", cost: null, condition: "" },
      duration: bg.duration ?? { value: null, units: "" },
      uses: bg.uses ?? { value: null, max: null, per: null, recovery: "" },
      advancement: bg.advancement,
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
      advancement: house.advancement,
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

function castingStyleToFoundry(cs: CastingStyle, locale: string, overlay: OverlayMap, lr: LinkResolver) {
  const name = t(`casting-styles.${cs.id}.name`, locale);
  const desc = markdownToHtml(t(`casting-styles.${cs.id}.description`, locale), lr);
  const id = cs.foundryId ?? cs.id;
  const m = getMeta(overlay, id);

  return {
    _id: id,
    name,
    type: cs.type,
    img: m.img,
    system: {
      description: { value: desc, chat: "" },
      source: { custom: cs.source },
      identifier: cs.identifier,
      classIdentifier: cs.classIdentifier,
      spellcasting: {
        ability: cs.spellcastingAbility,
        progression: cs.spellcastingProgression,
      },
      advancement: cs.advancement,
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
    {
      name: "casting-styles-and-schools-of-magic-wands",
      items: opts.castingStyles ?? [],
      convert: (cs: CastingStyle, ov) => castingStyleToFoundry(cs, locale, ov, lr),
      getId: (cs: CastingStyle) => cs.foundryId ?? cs.id,
    },
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

    // Write entity documents
    for (const entry of pack.items) {
      const id = pack.getId(entry);
      const result = pack.convert(entry, overlay);
      writeJson(path.join(DIST, pack.name), id, result);
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

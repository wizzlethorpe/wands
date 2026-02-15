/**
 * Build Quartz markdown files from wands-data source.
 *
 * Generates markdown with YAML frontmatter compatible with the wands_quartz
 * Quartz v4 site. Mirrors the output of the old import-*.mjs scripts.
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
import { yamlValue } from "./utils/yaml.js";
import {
  schoolMap, rarityMap, sizeMap, itemTypeMap, consumableSubtypeMap,
  formatDuration, formatRange, formatTarget, formatComponents,
  formatSpeed, formatCR, formatPrice, formatWeight, abilityMod,
} from "./utils/format.js";

const DIST = path.resolve(import.meta.dirname, "../../../site/content/Compendium");

function ensureDir(dir: string) {
  fs.mkdirSync(dir, { recursive: true });
}

function safeName(name: string): string {
  return name.replace(/[<>:"/\\|?*]/g, "_");
}

function writeMd(dir: string, name: string, frontmatter: Record<string, unknown>, body: string) {
  ensureDir(dir);
  const lines = ["---"];
  for (const [k, v] of Object.entries(frontmatter)) {
    lines.push(`${k}: ${yamlValue(v)}`);
  }
  lines.push("---", "", `# ${name}`, "", body, "");
  fs.writeFileSync(path.join(dir, `${safeName(name)}.md`), lines.join("\n"), "utf-8");
}

// ---------------------------------------------------------------------------
// Per-type builders
// ---------------------------------------------------------------------------

function buildSpell(spell: Spell, locale: string) {
  const name = t(`spells.${spell.id}.name`, locale);
  const description = t(`spells.${spell.id}.description`, locale);
  const comp = spell.components;

  writeMd(path.join(DIST, "Spells"), name, {
    public: true,
    name,
    foundry_id: spell.foundryId ?? "",
    type: "spell",
    level: spell.level,
    school: spell.school,
    school_display: schoolMap[spell.school] ?? spell.school,
    source: spell.source,
    activation_type: spell.activation.type,
    activation_cost: spell.activation.cost,
    activation_condition: spell.activation.condition,
    range_value: spell.range.value,
    range_long: spell.range.long,
    range_units: spell.range.units,
    range_display: formatRange(spell.range.value, spell.range.units),
    duration_value: spell.duration.value,
    duration_units: spell.duration.units,
    duration_display: formatDuration(spell.duration.units, spell.duration.value),
    concentration: comp.concentration,
    target_type: spell.target?.type ?? "",
    target_value: spell.target?.value ?? null,
    target_width: spell.target?.width ?? null,
    target_units: spell.target?.units ?? "",
    target_display: formatTarget(spell.target?.type ?? "", spell.target?.value ?? null, spell.target?.units ?? ""),
    ritual: comp.ritual,
    components_vocal: comp.vocal,
    components_somatic: comp.somatic,
    components_material: comp.material,
    components_display: formatComponents(comp.vocal, comp.somatic, comp.material),
    material_description: spell.materials?.description ?? "",
    material_consumed: spell.materials?.consumed ?? false,
    material_cost: spell.materials?.cost ?? 0,
    material_supply: spell.materials?.supply ?? 0,
    action_type: spell.actionType,
    attack_bonus: spell.attackBonus,
    chat_flavor: spell.chatFlavor,
    damage_parts: spell.damage?.parts ?? [],
    damage_versatile: spell.damage?.versatile ?? "",
    save_ability: spell.save?.ability ?? "",
    save_dc: spell.save?.dc ?? null,
    save_scaling: spell.save?.scaling ?? "spell",
    scaling_mode: spell.scaling?.mode ?? "none",
    scaling_formula: spell.scaling?.formula ?? "",
    formula: spell.formula,
    uses_value: spell.uses?.value ?? null,
    uses_max: spell.uses?.max ?? null,
    uses_per: spell.uses?.per ?? null,
    uses_recovery: spell.uses?.recovery ?? "",
    consume_type: spell.consume?.type ?? "",
    consume_target: spell.consume?.target ?? null,
    consume_amount: spell.consume?.amount ?? null,
    critical_threshold: spell.critical?.threshold ?? null,
    critical_damage: spell.critical?.damage ?? null,
    ability: spell.ability,
    preparation_mode: spell.preparation?.mode ?? "prepared",
    preparation_prepared: spell.preparation?.prepared ?? false,
  }, description);
}

function buildItem(item: Item, locale: string) {
  const name = t(`items.${item.id}.name`, locale);
  const description = t(`items.${item.id}.description`, locale);

  let category = itemTypeMap[item.type] ?? item.type;
  if (item.type === "consumable" && item.subtype) {
    category = consumableSubtypeMap[item.subtype] ?? item.subtype;
  }

  writeMd(path.join(DIST, "Items"), name, {
    public: true,
    name,
    foundry_id: item.foundryId ?? "",
    type: item.type,
    subtype: item.subtype,
    category,
    source: item.source,
    rarity: item.rarity,
    rarity_display: rarityMap[item.rarity] ?? item.rarity,
    price_value: item.price?.value ?? null,
    price_denomination: item.price?.denomination ?? "gp",
    price_display: formatPrice(item.price?.value ?? null, item.price?.denomination ?? "gp"),
    weight: item.weight,
    weight_display: formatWeight(item.weight),
    quantity: item.quantity,
    activation_type: item.activation?.type ?? "",
    activation_cost: item.activation?.cost ?? null,
    activation_condition: item.activation?.condition ?? "",
    duration_value: item.duration?.value ?? null,
    duration_units: item.duration?.units ?? "",
    duration_display: formatDuration(item.duration?.units ?? "", item.duration?.value ?? null),
    range_value: item.range?.value ?? null,
    range_units: item.range?.units ?? "",
    target_type: item.target?.type ?? "",
    target_value: item.target?.value ?? null,
    target_units: item.target?.units ?? "",
    uses_value: item.uses?.value ?? null,
    uses_max: item.uses?.max ?? null,
    uses_per: item.uses?.per ?? null,
    uses_recovery: item.uses?.recovery ?? "",
    uses_autoDestroy: item.uses?.autoDestroy ?? false,
    attunement: item.attunement,
    attuned: false,
    action_type: item.actionType,
    attack_bonus: item.attackBonus,
    chat_flavor: item.chatFlavor,
    damage_parts: item.damage?.parts ?? [],
    damage_versatile: item.damage?.versatile ?? "",
    save_ability: item.save?.ability ?? "",
    save_dc: item.save?.dc ?? null,
    save_scaling: item.save?.scaling ?? "",
    formula: item.formula,
    critical_threshold: item.critical?.threshold ?? null,
    critical_damage: item.critical?.damage ?? null,
    properties: item.properties,
    armor_value: item.armor?.value ?? null,
    armor_dex: item.armor?.dex ?? null,
    proficient: item.proficient,
    ability: item.ability,
    capacity_type: item.capacity?.type ?? "",
    capacity_value: item.capacity?.value ?? null,
    equipped: item.equipped,
    identified: item.identified,
  }, description);
}

function buildCreature(creature: Creature, locale: string) {
  const name = t(`creatures.${creature.id}.name`, locale);
  const description = t(`creatures.${creature.id}.description`, locale);
  const a = creature.abilities;

  const savesDisplay = (["str", "dex", "con", "int", "wis", "cha"] as const)
    .filter((ab) => creature.saves?.[ab] !== null && creature.saves?.[ab] !== undefined)
    .map((ab) => `${ab.charAt(0).toUpperCase() + ab.slice(1)} +${creature.saves![ab]}`)
    .join(", ");

  writeMd(path.join(DIST, "Creatures"), name, {
    public: true,
    name,
    foundry_id: creature.foundryId ?? "",
    type: "creature",
    source: creature.source,
    cr: creature.cr,
    cr_display: formatCR(creature.cr),
    xp: creature.xp,
    size: creature.size,
    size_display: sizeMap[creature.size] ?? creature.size,
    creature_type: creature.creatureType,
    alignment: creature.alignment,
    ac: creature.ac,
    ac_type: creature.acType,
    hp: creature.hp,
    hp_formula: creature.hpFormula,
    speed_walk: creature.speed.walk,
    speed_fly: creature.speed.fly,
    speed_swim: creature.speed.swim,
    speed_climb: creature.speed.climb,
    speed_burrow: creature.speed.burrow,
    speed_hover: creature.speed.hover,
    speed_display: formatSpeed(creature.speed),
    str: a.str, dex: a.dex, con: a.con, int: a.int, wis: a.wis, cha: a.cha,
    str_mod: abilityMod(a.str), dex_mod: abilityMod(a.dex), con_mod: abilityMod(a.con),
    int_mod: abilityMod(a.int), wis_mod: abilityMod(a.wis), cha_mod: abilityMod(a.cha),
    saves_str: creature.saves?.str ?? null, saves_dex: creature.saves?.dex ?? null,
    saves_con: creature.saves?.con ?? null, saves_int: creature.saves?.int ?? null,
    saves_wis: creature.saves?.wis ?? null, saves_cha: creature.saves?.cha ?? null,
    saving_throws_display: savesDisplay,
    skill_bonuses: creature.skillBonuses,
    damage_immunities: creature.damageImmunities,
    damage_resistances: creature.damageResistances,
    damage_vulnerabilities: creature.damageVulnerabilities,
    condition_immunities: creature.conditionImmunities,
    senses_darkvision: creature.senses?.darkvision ?? 0,
    senses_blindsight: creature.senses?.blindsight ?? 0,
    senses_tremorsense: creature.senses?.tremorsense ?? 0,
    senses_truesight: creature.senses?.truesight ?? 0,
    senses_special: creature.senses?.special ?? "",
    passive_perception: creature.passivePerception,
    languages: creature.languages,
    languages_custom: creature.languagesCustom,
    proficiency_bonus: creature.proficiencyBonus,
  }, description);
}

function buildFeature(feat: Feature, locale: string) {
  const name = t(`features.${feat.id}.name`, locale);
  const description = t(`features.${feat.id}.description`, locale);

  const featureTypeDisplay: Record<string, string> = {
    race: "Racial Trait", class: "Class Feature", background: "Background Feature",
    feat: "Feat", subclass: "Subclass Feature", monster: "Monster Trait",
  };

  writeMd(path.join(DIST, "Features"), name, {
    public: true,
    name,
    foundry_id: feat.foundryId ?? "",
    type: "feat",
    feature_type: feat.featureType,
    feature_type_display: featureTypeDisplay[feat.featureType] ?? feat.featureType,
    source: feat.source,
    requirements: feat.requirements,
    activation_type: feat.activation?.type ?? "",
    activation_cost: feat.activation?.cost ?? null,
    activation_condition: feat.activation?.condition ?? "",
    duration_value: feat.duration?.value ?? null,
    duration_units: feat.duration?.units ?? "",
    range_value: feat.range?.value ?? null,
    range_units: feat.range?.units ?? "",
    target_type: feat.target?.type ?? "",
    target_value: feat.target?.value ?? null,
    target_units: feat.target?.units ?? "",
    uses_value: feat.uses?.value ?? null,
    uses_max: feat.uses?.max ?? null,
    uses_per: feat.uses?.per ?? null,
    uses_recovery: feat.uses?.recovery ?? "",
    recharge_value: feat.recharge?.value ?? null,
    recharge_charged: feat.recharge?.charged ?? true,
    action_type: feat.actionType,
    attack_bonus: feat.attackBonus,
    damage_parts: feat.damage?.parts ?? [],
    save_ability: feat.save?.ability ?? "",
    save_dc: feat.save?.dc ?? null,
    save_scaling: feat.save?.scaling ?? "",
    formula: feat.formula,
  }, description);
}

function buildBackground(bg: Background, locale: string) {
  const name = t(`backgrounds.${bg.id}.name`, locale);
  const description = t(`backgrounds.${bg.id}.description`, locale);

  writeMd(path.join(DIST, "Backgrounds"), name, {
    public: true,
    name,
    foundry_id: bg.foundryId ?? "",
    type: "background",
    feature_type: bg.featureType,
    source: bg.source,
    requirements: bg.requirements,
    activation_type: bg.activation?.type ?? "",
    activation_cost: bg.activation?.cost ?? null,
    activation_condition: bg.activation?.condition ?? "",
    duration_value: bg.duration?.value ?? null,
    duration_units: bg.duration?.units ?? "",
    uses_value: bg.uses?.value ?? null,
    uses_max: bg.uses?.max ?? null,
    uses_per: bg.uses?.per ?? null,
    uses_recovery: bg.uses?.recovery ?? "",
    advancement: bg.advancement,
  }, description);
}

function buildHouse(house: House, locale: string) {
  const name = t(`houses.${house.id}.name`, locale);
  const description = t(`houses.${house.id}.description`, locale);

  writeMd(path.join(DIST, "Houses"), name, {
    public: true,
    name,
    foundry_id: house.foundryId ?? "",
    type: "race",
    source: house.source,
    creature_type: house.creatureType,
    movement_walk: house.movement?.walk ?? 30,
    movement_fly: house.movement?.fly ?? 0,
    movement_swim: house.movement?.swim ?? 0,
    movement_climb: house.movement?.climb ?? 0,
    movement_burrow: house.movement?.burrow ?? 0,
    movement_display: formatSpeed(house.movement ?? { walk: 30 }),
    senses_darkvision: house.senses?.darkvision ?? 0,
    size: house.size,
    ability_score_increase: house.abilityScoreIncrease,
    traits: house.traits,
    advancement: house.advancement,
  }, description);
}

function buildCastingStyle(cs: CastingStyle, locale: string) {
  const name = t(`casting-styles.${cs.id}.name`, locale);
  const description = t(`casting-styles.${cs.id}.description`, locale);

  writeMd(path.join(DIST, "Casting Styles"), name, {
    public: true,
    name,
    foundry_id: cs.foundryId ?? "",
    type: cs.type,
    source: cs.source,
    identifier: cs.identifier,
    class_identifier: cs.classIdentifier,
    spellcasting_ability: cs.spellcastingAbility,
    spellcasting_progression: cs.spellcastingProgression,
    advancement: cs.advancement,
  }, description);
}

function buildAnimagusForm(af: AnimagusForm, locale: string) {
  const name = t(`animagus-forms.${af.id}.name`, locale);
  const description = t(`animagus-forms.${af.id}.description`, locale);
  const a = af.abilities;

  writeMd(path.join(DIST, "Animagus Forms"), name, {
    public: true,
    name,
    foundry_id: af.foundryId ?? "",
    type: "animagus",
    form_type: af.formType,
    form_style: af.formStyle,
    source: af.source,
    size: af.size,
    size_display: sizeMap[af.size] ?? af.size,
    creature_type: af.creatureType,
    alignment: af.alignment,
    ac: af.ac,
    hp: af.hp,
    hp_formula: af.hpFormula,
    speed_walk: af.speed.walk, speed_fly: af.speed.fly, speed_swim: af.speed.swim, speed_climb: af.speed.climb,
    speed_display: formatSpeed(af.speed),
    str: a.str, dex: a.dex, con: a.con, int: a.int, wis: a.wis, cha: a.cha,
    str_mod: abilityMod(a.str), dex_mod: abilityMod(a.dex), con_mod: abilityMod(a.con),
    int_mod: abilityMod(a.int), wis_mod: abilityMod(a.wis), cha_mod: abilityMod(a.cha),
    senses_darkvision: af.senses?.darkvision ?? 0,
    senses_blindsight: af.senses?.blindsight ?? 0,
    passive_perception: af.passivePerception,
  }, description);
}

function buildMagicalPet(pet: MagicalPet, locale: string) {
  const name = t(`magical-pets.${pet.id}.name`, locale);
  const description = t(`magical-pets.${pet.id}.description`, locale);
  const a = pet.abilities;

  writeMd(path.join(DIST, "Magical Pets"), name, {
    public: true,
    name,
    foundry_id: pet.foundryId ?? "",
    type: "pet",
    source: pet.source,
    cr: pet.cr,
    size: pet.size,
    size_display: sizeMap[pet.size] ?? pet.size,
    creature_type: pet.creatureType,
    alignment: pet.alignment,
    ac: pet.ac,
    hp: pet.hp,
    hp_formula: pet.hpFormula,
    speed_walk: pet.speed.walk, speed_fly: pet.speed.fly, speed_swim: pet.speed.swim, speed_climb: pet.speed.climb,
    speed_display: formatSpeed(pet.speed),
    str: a.str, dex: a.dex, con: a.con, int: a.int, wis: a.wis, cha: a.cha,
    str_mod: abilityMod(a.str), dex_mod: abilityMod(a.dex), con_mod: abilityMod(a.con),
    int_mod: abilityMod(a.int), wis_mod: abilityMod(a.wis), cha_mod: abilityMod(a.cha),
    senses_darkvision: pet.senses?.darkvision ?? 0,
    passive_perception: pet.passivePerception,
    proficiency_bonus: pet.proficiencyBonus,
  }, description);
}

function buildRollTable(table: RollTable, locale: string) {
  const name = t(`roll-tables.${table.id}.name`, locale);
  const description = t(`roll-tables.${table.id}.description`, locale);

  writeMd(path.join(DIST, "Roll Tables"), name, {
    public: true,
    name,
    foundry_id: table.foundryId ?? "",
    type: "rolltable",
    formula: table.formula,
    replacement: table.replacement,
    display_roll: table.displayRoll,
    entries: table.entries.map((e) => ({
      range: e.range,
      weight: e.weight,
      text: t(e.text, locale),
      type: e.type,
    })),
  }, description);
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export interface BuildQuartzOptions {
  locale?: string;
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

export function buildQuartz(opts: BuildQuartzOptions) {
  const locale = opts.locale ?? "en";

  const counts: Record<string, number> = {};

  for (const s of opts.spells ?? []) { buildSpell(s, locale); }
  counts.spells = opts.spells?.length ?? 0;

  for (const i of opts.items ?? []) { buildItem(i, locale); }
  counts.items = opts.items?.length ?? 0;

  for (const c of opts.creatures ?? []) { buildCreature(c, locale); }
  counts.creatures = opts.creatures?.length ?? 0;

  for (const f of opts.features ?? []) { buildFeature(f, locale); }
  counts.features = opts.features?.length ?? 0;

  for (const b of opts.backgrounds ?? []) { buildBackground(b, locale); }
  counts.backgrounds = opts.backgrounds?.length ?? 0;

  for (const h of opts.houses ?? []) { buildHouse(h, locale); }
  counts.houses = opts.houses?.length ?? 0;

  for (const cs of opts.castingStyles ?? []) { buildCastingStyle(cs, locale); }
  counts.castingStyles = opts.castingStyles?.length ?? 0;

  for (const af of opts.animagusForms ?? []) { buildAnimagusForm(af, locale); }
  counts.animagusForms = opts.animagusForms?.length ?? 0;

  for (const p of opts.magicalPets ?? []) { buildMagicalPet(p, locale); }
  counts.magicalPets = opts.magicalPets?.length ?? 0;

  for (const t of opts.rollTables ?? []) { buildRollTable(t, locale); }
  counts.rollTables = opts.rollTables?.length ?? 0;

  console.log(`[build-quartz] locale=${locale}`);
  for (const [k, v] of Object.entries(counts)) {
    if (v > 0) console.log(`  ${k}: ${v}`);
  }
}

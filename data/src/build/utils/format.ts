/** Display-name maps reused by both build targets */

export const schoolMap: Record<string, string> = {
  abj: "Abjuration",
  con: "Conjuration",
  div: "Divination",
  enc: "Enchantment",
  evo: "Evocation",
  ill: "Illusion",
  nec: "Necromancy",
  trs: "Transmutation",
  cha: "Charms",
  hex: "Jinxes, Hexes, and Curses",
  tra: "Transfiguration",
  hea: "Healing",
  mag: "Magizoology",
};

export const rarityMap: Record<string, string> = {
  common: "Common",
  uncommon: "Uncommon",
  rare: "Rare",
  veryRare: "Very Rare",
  legendary: "Legendary",
  artifact: "Artifact",
};

export const sizeMap: Record<string, string> = {
  tiny: "Tiny",
  sm: "Small",
  med: "Medium",
  lg: "Large",
  huge: "Huge",
  grg: "Gargantuan",
};

export const durationUnitMap: Record<string, string> = {
  inst: "Instantaneous",
  round: "round",
  minute: "minute",
  hour: "hour",
  day: "day",
  perm: "Permanent",
  spec: "Special",
  turn: "turn",
};

export const itemTypeMap: Record<string, string> = {
  consumable: "Consumable",
  loot: "Loot",
  tool: "Tool",
  equipment: "Equipment",
  weapon: "Weapon",
  armor: "Armor",
  container: "Container",
  backpack: "Container",
};

export const consumableSubtypeMap: Record<string, string> = {
  potion: "Potion",
  poison: "Poison",
  food: "Food",
  scroll: "Scroll",
  wand: "Wand",
  rod: "Rod",
  trinket: "Trinket",
  ammo: "Ammunition",
};

// ---------------------------------------------------------------------------
// Formatting helpers
// ---------------------------------------------------------------------------

export function formatDuration(units: string, value: number | null): string {
  if (!units) return "Instantaneous";
  if (units === "inst") return "Instantaneous";
  if (units === "perm") return "Permanent";
  if (units === "spec") return "Special";

  if (value === null || value === undefined) {
    return durationUnitMap[units] ?? units;
  }
  const unitName = durationUnitMap[units] ?? units;
  const plural = value !== 1 ? "s" : "";
  return `${value} ${unitName}${plural}`;
}

export function formatRange(value: number | null, units: string): string {
  if (units === "self") return "Self";
  if (units === "touch") return "Touch";
  if (units === "spec") return "Special";
  if (units === "any") return "Unlimited";
  if (value === null || value === undefined) return units || "Self";
  return `${value} ${units}`;
}

export function formatTarget(type: string, value: number | null, units: string): string {
  if (!type) return "";
  if (type === "self") return "Self";

  // Creature/object/space
  if (["creature", "object", "space"].includes(type)) {
    return value && value > 1 ? `${value} ${type}s` : type;
  }

  // Area of effect types
  if (["sphere", "cube", "cone", "cylinder", "line", "radius"].includes(type)) {
    return value && units ? `${value}-${units} ${type}` : type;
  }

  return type;
}

export function formatComponents(vocal: boolean, somatic: boolean, material: boolean): string {
  const parts: string[] = [];
  if (vocal) parts.push("V");
  if (somatic) parts.push("S");
  if (material) parts.push("M");
  return parts.join(", ");
}

export function formatSpeed(speed: { walk?: number; fly?: number; swim?: number; climb?: number; burrow?: number; hover?: boolean }): string {
  const parts: string[] = [];
  if (speed.walk) parts.push(`${speed.walk} ft.`);
  if (speed.fly) parts.push(`fly ${speed.fly} ft.${speed.hover ? " (hover)" : ""}`);
  if (speed.swim) parts.push(`swim ${speed.swim} ft.`);
  if (speed.climb) parts.push(`climb ${speed.climb} ft.`);
  if (speed.burrow) parts.push(`burrow ${speed.burrow} ft.`);
  return parts.join(", ") || "0 ft.";
}

export function formatCR(cr: number): string {
  if (cr === 0.125) return "1/8";
  if (cr === 0.25) return "1/4";
  if (cr === 0.5) return "1/2";
  return String(cr);
}

export function abilityMod(score: number): number {
  return Math.floor((score - 10) / 2);
}

export function formatPrice(value: number | null, denomination: string): string {
  if (value === null || value === undefined) return "";
  return `${value} ${denomination || "gp"}`;
}

export function formatWeight(weight: number | null): string {
  if (weight === null || weight === undefined) return "";
  return `${weight} lb.`;
}

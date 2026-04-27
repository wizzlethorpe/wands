export { combatAnimagusLand } from "./combat-animagus-land.js";
export { combatAnimagusWater } from "./combat-animagus-water.js";
export { evasionAnimagusAir } from "./evasion-animagus-air.js";
export { evasionAnimagusLand } from "./evasion-animagus-land.js";
export { evasionAnimagusWater } from "./evasion-animagus-water.js";

// All entries as an array
import { combatAnimagusLand, combatAnimagusWater, evasionAnimagusAir, evasionAnimagusLand, evasionAnimagusWater } from "./index.js";
import type { Creature } from "../../schemas/index.js";
export const all: Creature[] = [combatAnimagusLand, combatAnimagusWater, evasionAnimagusAir, evasionAnimagusLand, evasionAnimagusWater];

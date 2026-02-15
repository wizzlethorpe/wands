export { pukwudgieIlvermorny } from "./pukwudgie-ilvermorny.js";
export { snake } from "./snake.js";
export { badger } from "./badger.js";
export { wampusIlvermorny } from "./wampus-ilvermorny.js";
export { thunderbirdIlvermorny } from "./thunderbird-ilvermorny.js";
export { beauxbatons } from "./beauxbatons.js";
export { durmstrang } from "./durmstrang.js";
export { lion } from "./lion.js";
export { hornedSerpentIlvermorny } from "./horned-serpent-ilvermorny.js";
export { eagle } from "./eagle.js";

// All entries as an array
import { pukwudgieIlvermorny, snake, badger, wampusIlvermorny, thunderbirdIlvermorny, beauxbatons, durmstrang, lion, hornedSerpentIlvermorny, eagle } from "./index.js";
import type { House } from "../../schemas/index.js";
export const all: House[] = [pukwudgieIlvermorny, snake, badger, wampusIlvermorny, thunderbirdIlvermorny, beauxbatons, durmstrang, lion, hornedSerpentIlvermorny, eagle];

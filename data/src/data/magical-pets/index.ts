export { petAdder } from "./pet-adder.js";
export { petBat } from "./pet-bat.js";
export { petCat } from "./pet-cat.js";
export { petGoliathTarantula } from "./pet-goliath-tarantula.js";
export { petMiniatureFirecrab } from "./pet-miniature-firecrab.js";
export { petOwl } from "./pet-owl.js";
export { petPuffskein } from "./pet-puffskein.js";
export { petRat } from "./pet-rat.js";
export { petSnake } from "./pet-snake.js";
export { petToad } from "./pet-toad.js";

// All entries as an array
import { petAdder, petBat, petCat, petGoliathTarantula, petMiniatureFirecrab, petOwl, petPuffskein, petRat, petSnake, petToad } from "./index.js";
import type { Creature } from "../../schemas/index.js";
export const all: Creature[] = [petAdder, petBat, petCat, petGoliathTarantula, petMiniatureFirecrab, petOwl, petPuffskein, petRat, petSnake, petToad];

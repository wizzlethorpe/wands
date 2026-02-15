import { HouseSchema } from "../../schemas/index.js";

export const lion = HouseSchema.parse({
  id: "lion",
  foundryId: "uZT2hrkmT28GIled",
  type: "race",
  source: "W&W p.p.4",
  creatureType: "",
  size: "medium",
  abilityScoreIncrease: "",
  movement: { walk: 30, fly: 0, swim: 0, climb: 0, burrow: 0 },
  senses: { darkvision: 0, blindsight: 0, tremorsense: 0, truesight: 0, special: "" },
  traits: [],
  advancement: [{"type":"AbilityScoreImprovement","_id":"zpUQehr4A3LiDS37","configuration":{"points":1,"fixed":{"str":0,"dex":0,"con":1,"int":0,"wis":0,"cha":1},"cap":2},"value":{"type":"asi"},"level":0,"title":"","icon":null},{"type":"Size","_id":"IAhk31LNngOKZ5ag","configuration":{"sizes":["med"]},"level":0,"value":{}},{"type":"Trait","configuration":{"grants":["languages:standard:common"],"mode":"default","allowReplacements":false,"choices":[]},"_id":"rFqFCzh8q4usey76","level":0,"value":{"chosen":[]}},{"_id":"YIjtb3Ibnn9upR6r","type":"ItemGrant","configuration":{"items":["Compendium.wands.features-wands.Item.4JedCeLIdY9ASEq6","Compendium.wands.features-wands.Item.sBwG9yIv1XBjokrY"],"optional":false,"spell":null},"value":{},"level":0,"title":"Features","icon":null}],
});

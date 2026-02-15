import { HouseSchema } from "../../schemas/index.js";

export const durmstrang = HouseSchema.parse({
  id: "durmstrang",
  foundryId: "mQ4MOC1aKfPKxlVZ",
  type: "race",
  source: "W&W p.p.6",
  creatureType: "",
  size: "medium",
  abilityScoreIncrease: "",
  movement: { walk: 30, fly: 0, swim: 0, climb: 0, burrow: 0 },
  senses: { darkvision: 0, blindsight: 0, tremorsense: 0, truesight: 0, special: "" },
  traits: [],
  advancement: [{"type":"AbilityScoreImprovement","_id":"nqiSObStSa0fgd1x","configuration":{"points":1,"fixed":{"str":1,"dex":0,"con":1,"int":0,"wis":0,"cha":0},"cap":2},"value":{"type":"asi"},"level":0,"title":"","icon":null},{"type":"Size","_id":"by32y8gRBrm51ndP","configuration":{"sizes":["med"]},"level":0,"value":{}},{"type":"Trait","configuration":{"grants":["languages:standard:common"],"mode":"default","allowReplacements":false,"choices":[]},"_id":"tBJ0Au1OeKncOVRx","level":0,"value":{"chosen":[]}},{"_id":"1Q8k5yFFt3cy3M2m","type":"ItemGrant","configuration":{"items":["Compendium.wands.features-wands.Item.2Xiqd7GNjfvErQOi","Compendium.wands.spells-wands.Item.uzy4BWTrdyAiy7ed","Compendium.wands.features-wands.Item.TxOVEG5EzfBhbuCV"],"optional":false,"spell":{"ability":"","preparation":"","uses":{"max":"","per":""}}},"value":{},"level":0,"title":"Features","icon":null}],
});

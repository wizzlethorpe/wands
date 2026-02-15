import { HouseSchema } from "../../schemas/index.js";

export const wampusIlvermorny = HouseSchema.parse({
  id: "wampus-ilvermorny",
  foundryId: "MsRVqCiVivxBE7Np",
  type: "race",
  source: "W&W p.p.7",
  creatureType: "",
  size: "medium",
  abilityScoreIncrease: "",
  movement: { walk: 30, fly: 0, swim: 0, climb: 0, burrow: 0 },
  senses: { darkvision: 0, blindsight: 0, tremorsense: 0, truesight: 0, special: "" },
  traits: [],
  advancement: [{"type":"AbilityScoreImprovement","_id":"BhDrZJfRqemcPPoO","configuration":{"points":1,"fixed":{"str":0,"dex":1,"con":1,"int":0,"wis":0,"cha":0},"cap":2},"value":{"type":"asi"},"level":0,"title":"","icon":null},{"type":"Size","_id":"kOXerE9KdCcJq5d4","configuration":{"sizes":["med"]},"level":0,"value":{}},{"type":"Trait","configuration":{"grants":["languages:standard:common"],"mode":"default","allowReplacements":false,"choices":[]},"_id":"QCpjzcL1yMqA3ZB1","level":0,"value":{"chosen":[]}},{"_id":"TdJSFdXG9YFDSD2l","type":"ItemGrant","configuration":{"items":["Compendium.wands.features-wands.Item.eKRIFNekxx8Az6HR","Compendium.wands.features-wands.Item.uGzL0mWwlYX6cDrL"],"optional":false,"spell":null},"value":{},"level":0,"title":"Features","icon":null}],
});

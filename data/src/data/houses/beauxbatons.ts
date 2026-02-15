import { HouseSchema } from "../../schemas/index.js";

export const beauxbatons = HouseSchema.parse({
  id: "beauxbatons",
  foundryId: "ZhMND6dAR2E0t270",
  type: "race",
  source: "W&W p.p.6",
  creatureType: "",
  size: "medium",
  abilityScoreIncrease: "",
  movement: { walk: 30, fly: 0, swim: 0, climb: 0, burrow: 0 },
  senses: { darkvision: 0, blindsight: 0, tremorsense: 0, truesight: 0, special: "" },
  traits: [],
  advancement: [{"type":"AbilityScoreImprovement","_id":"GZjnlmZvlKWGJ01k","configuration":{"points":1,"fixed":{"str":0,"dex":1,"con":0,"int":0,"wis":1,"cha":0},"cap":2},"value":{"type":"asi"},"level":0,"title":"","icon":null},{"type":"Size","_id":"wGAjbVBS7jzyimx2","configuration":{"sizes":["med"]},"level":0,"value":{}},{"type":"Trait","configuration":{"grants":["languages:standard:common"],"mode":"default","allowReplacements":false,"choices":[]},"_id":"2VCFiNHHbEWRu0Bb","level":0,"value":{"chosen":[]}},{"_id":"gsEeNnLikz7d504d","type":"ItemGrant","configuration":{"items":["Compendium.wands.features-wands.Item.BlS1I1coRn3gW5Hu","Compendium.wands.features-wands.Item.xFevYAMjnAj0GyZt"],"optional":false,"spell":null},"value":{},"level":0,"title":"Features","icon":null}],
});

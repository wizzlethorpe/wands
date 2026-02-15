import { HouseSchema } from "../../schemas/index.js";

export const thunderbirdIlvermorny = HouseSchema.parse({
  id: "thunderbird-ilvermorny",
  foundryId: "REiacbansQNLrsvL",
  type: "race",
  source: "W&W p.p.8",
  creatureType: "",
  size: "medium",
  abilityScoreIncrease: "",
  movement: { walk: 30, fly: 0, swim: 0, climb: 0, burrow: 0 },
  senses: { darkvision: 0, blindsight: 0, tremorsense: 0, truesight: 0, special: "" },
  traits: [],
  advancement: [{"type":"AbilityScoreImprovement","_id":"OGFKPrpZEdC3oJOB","configuration":{"points":1,"fixed":{"str":1,"dex":0,"con":0,"int":0,"wis":0,"cha":1},"cap":2},"value":{"type":"asi"},"level":0,"title":"","icon":null},{"type":"Size","_id":"L66zunffNyNSDWRw","configuration":{"sizes":["med"]},"level":0,"value":{}},{"type":"Trait","configuration":{"grants":["languages:standard:common"],"mode":"default","allowReplacements":false,"choices":[]},"_id":"5Vo9vg9XHL7aNba4","level":0,"value":{"chosen":[]}},{"_id":"74Us0z9l6TZVj1pG","type":"ItemGrant","configuration":{"items":["Compendium.wands.features-wands.Item.D45jKuNucX2YtWgs","Compendium.wands.features-wands.Item.QscDzf2amq2A0Chj"],"optional":false,"spell":null},"value":{},"level":0,"title":"Features","icon":null}],
});

import { HouseSchema } from "../../schemas/index.js";

export const hornedSerpentIlvermorny = HouseSchema.parse({
  id: "horned-serpent-ilvermorny",
  foundryId: "y8APVo7GHwp4uTil",
  type: "race",
  source: "W&W p.p.7",
  creatureType: "",
  size: "medium",
  abilityScoreIncrease: "",
  movement: { walk: 30, fly: 0, swim: 0, climb: 0, burrow: 0 },
  senses: { darkvision: 0, blindsight: 0, tremorsense: 0, truesight: 0, special: "" },
  traits: [],
  advancement: [{"type":"AbilityScoreImprovement","_id":"9NJdgxiSJZKYlkZB","configuration":{"points":1,"fixed":{"str":0,"dex":0,"con":0,"int":1,"wis":0,"cha":1},"cap":2},"value":{"type":"asi"},"level":0,"title":"","icon":null},{"type":"Size","_id":"XwkCznSIqscn1GU3","configuration":{"sizes":["med"]},"level":0,"value":{}},{"type":"Trait","configuration":{"grants":["languages:standard:common"],"mode":"default","allowReplacements":false,"choices":[]},"_id":"tNZPcJD4lzfJjS2d","level":0,"value":{"chosen":[]}},{"_id":"RjGJoomvs51rmdgJ","type":"ItemGrant","configuration":{"items":["Compendium.wands.features-wands.Item.JuOF7gAFL5zs0Kaw","Compendium.wands.features-wands.Item.OjQqIDGNMILPlEV8"],"optional":false,"spell":null},"value":{},"level":0,"title":"Features","icon":null}],
});

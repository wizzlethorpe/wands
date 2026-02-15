import { HouseSchema } from "../../schemas/index.js";

export const pukwudgieIlvermorny = HouseSchema.parse({
  id: "pukwudgie-ilvermorny",
  foundryId: "2iTn7K5z4mNm2HFZ",
  type: "race",
  source: "W&W p.p.8",
  creatureType: "",
  size: "medium",
  abilityScoreIncrease: "",
  movement: { walk: 30, fly: 0, swim: 0, climb: 0, burrow: 0 },
  senses: { darkvision: 0, blindsight: 0, tremorsense: 0, truesight: 0, special: "" },
  traits: [],
  advancement: [{"type":"AbilityScoreImprovement","_id":"iQD58eY4E1rgctxS","configuration":{"points":1,"fixed":{"str":0,"dex":0,"con":0,"int":0,"wis":1,"cha":1},"cap":2},"value":{"type":"asi"},"level":0,"title":"","icon":null},{"type":"Size","_id":"6yYc4kZVsMWzfRp9","configuration":{"sizes":["med"]},"level":0,"value":{}},{"type":"Trait","configuration":{"grants":["languages:standard:common"],"mode":"default","allowReplacements":false,"choices":[]},"_id":"N93IHbRKuJ9nkn1k","level":0,"value":{"chosen":[]}},{"_id":"UJlm15mZ4FqbS43n","type":"ItemGrant","configuration":{"items":["Compendium.wands.features-wands.Item.U7onCy7go4ftNPJI","Compendium.wands.features-wands.Item.ZAAlZINpw1QhGA6G"],"optional":false,"spell":null},"value":{},"level":0,"title":"Features","icon":null}],
});

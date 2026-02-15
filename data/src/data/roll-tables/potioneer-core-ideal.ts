import { RollTableSchema } from "../../schemas/index.js";

export const potioneerCoreIdeal = RollTableSchema.parse({
  id: "potioneer-core-ideal",
  foundryId: "hbqNQEFAql96OWeX",
  type: "rolltable",
  source: "",
  formula: "1d6",
  replacement: true,
  displayRoll: true,
  entries: [
    {
        "weight": 1,
        "text": "roll-tables.potioneer-core-ideal.entry.0",
        "type": 0
    },
    {
        "weight": 1,
        "text": "roll-tables.potioneer-core-ideal.entry.1",
        "type": 0
    },
    {
        "weight": 1,
        "text": "roll-tables.potioneer-core-ideal.entry.2",
        "type": 0
    }
],
  flags: {"core":{}},
});

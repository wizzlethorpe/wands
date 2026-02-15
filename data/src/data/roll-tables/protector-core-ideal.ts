import { RollTableSchema } from "../../schemas/index.js";

export const protectorCoreIdeal = RollTableSchema.parse({
  id: "protector-core-ideal",
  foundryId: "A86ktgyz6XwSJs5U",
  type: "rolltable",
  source: "",
  formula: "1d6",
  replacement: true,
  displayRoll: true,
  entries: [
    {
        "weight": 1,
        "text": "roll-tables.protector-core-ideal.entry.0",
        "type": 0
    },
    {
        "weight": 1,
        "text": "roll-tables.protector-core-ideal.entry.1",
        "type": 0
    },
    {
        "weight": 1,
        "text": "roll-tables.protector-core-ideal.entry.2",
        "type": 0
    }
],
  flags: {"core":{}},
});

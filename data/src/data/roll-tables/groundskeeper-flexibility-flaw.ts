import { RollTableSchema } from "../../schemas/index.js";

export const groundskeeperFlexibilityFlaw = RollTableSchema.parse({
  id: "groundskeeper-flexibility-flaw",
  foundryId: "wMczx4beRG0O4nXb",
  type: "rolltable",
  source: "",
  formula: "1d6",
  replacement: true,
  displayRoll: true,
  entries: [
    {
        "weight": 1,
        "text": "roll-tables.groundskeeper-flexibility-flaw.entry.0",
        "type": 0
    },
    {
        "weight": 1,
        "text": "roll-tables.groundskeeper-flexibility-flaw.entry.1",
        "type": 0
    },
    {
        "weight": 1,
        "text": "roll-tables.groundskeeper-flexibility-flaw.entry.2",
        "type": 0
    }
],
  flags: {"core":{}},
});

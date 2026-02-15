import { RollTableSchema } from "../../schemas/index.js";

export const bookwormFlexibilityFlaw = RollTableSchema.parse({
  id: "bookworm-flexibility-flaw",
  foundryId: "QWmXp80pXwSaQp20",
  type: "rolltable",
  source: "",
  formula: "1d6",
  replacement: true,
  displayRoll: true,
  entries: [
    {
        "weight": 1,
        "text": "roll-tables.bookworm-flexibility-flaw.entry.0",
        "type": 0
    },
    {
        "weight": 1,
        "text": "roll-tables.bookworm-flexibility-flaw.entry.1",
        "type": 0
    },
    {
        "weight": 1,
        "text": "roll-tables.bookworm-flexibility-flaw.entry.2",
        "type": 0
    }
],
  flags: {"core":{}},
});

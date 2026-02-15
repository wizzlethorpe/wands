import { RollTableSchema } from "../../schemas/index.js";

export const bookwormCoreIdeal = RollTableSchema.parse({
  id: "bookworm-core-ideal",
  foundryId: "r3PDF4XImfDZ7Zvv",
  type: "rolltable",
  source: "",
  formula: "1d6",
  replacement: true,
  displayRoll: true,
  entries: [
    {
        "weight": 1,
        "text": "roll-tables.bookworm-core-ideal.entry.0",
        "type": 0
    },
    {
        "weight": 1,
        "text": "roll-tables.bookworm-core-ideal.entry.1",
        "type": 0
    },
    {
        "weight": 1,
        "text": "roll-tables.bookworm-core-ideal.entry.2",
        "type": 0
    }
],
  flags: {"core":{}},
});

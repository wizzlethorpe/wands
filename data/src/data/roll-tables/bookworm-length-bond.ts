import { RollTableSchema } from "../../schemas/index.js";

export const bookwormLengthBond = RollTableSchema.parse({
  id: "bookworm-length-bond",
  foundryId: "sYd7HPhREPPKa1wa",
  type: "rolltable",
  source: "",
  formula: "1d6",
  replacement: true,
  displayRoll: true,
  entries: [
    {
        "weight": 1,
        "text": "roll-tables.bookworm-length-bond.entry.0",
        "type": 0
    },
    {
        "weight": 1,
        "text": "roll-tables.bookworm-length-bond.entry.1",
        "type": 0
    },
    {
        "weight": 1,
        "text": "roll-tables.bookworm-length-bond.entry.2",
        "type": 0
    }
],
  flags: {"core":{}},
});

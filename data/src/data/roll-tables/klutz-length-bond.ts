import { RollTableSchema } from "../../schemas/index.js";

export const klutzLengthBond = RollTableSchema.parse({
  id: "klutz-length-bond",
  foundryId: "jaMWWr29yvokKvlL",
  type: "rolltable",
  source: "",
  formula: "1d6",
  replacement: true,
  displayRoll: true,
  entries: [
    {
        "weight": 1,
        "text": "roll-tables.klutz-length-bond.entry.0",
        "type": 0
    },
    {
        "weight": 1,
        "text": "roll-tables.klutz-length-bond.entry.1",
        "type": 0
    },
    {
        "weight": 1,
        "text": "roll-tables.klutz-length-bond.entry.2",
        "type": 0
    }
],
  flags: {"core":{}},
});

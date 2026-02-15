import { RollTableSchema } from "../../schemas/index.js";

export const dreamerLengthBond = RollTableSchema.parse({
  id: "dreamer-length-bond",
  foundryId: "8eBUdxKOc3nrDxPF",
  type: "rolltable",
  source: "",
  formula: "1d6",
  replacement: true,
  displayRoll: true,
  entries: [
    {
        "weight": 1,
        "text": "roll-tables.dreamer-length-bond.entry.0",
        "type": 0
    },
    {
        "weight": 1,
        "text": "roll-tables.dreamer-length-bond.entry.1",
        "type": 0
    },
    {
        "weight": 1,
        "text": "roll-tables.dreamer-length-bond.entry.2",
        "type": 0
    }
],
  flags: {"core":{}},
});

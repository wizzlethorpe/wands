import { RollTableSchema } from "../../schemas/index.js";

export const quidditchFanLengthBond = RollTableSchema.parse({
  id: "quidditch-fan-length-bond",
  foundryId: "1wETAYKuFNqx7uQi",
  type: "rolltable",
  source: "",
  formula: "1d6",
  replacement: true,
  displayRoll: true,
  entries: [
    {
        "weight": 1,
        "text": "roll-tables.quidditch-fan-length-bond.entry.0",
        "type": 0
    },
    {
        "weight": 1,
        "text": "roll-tables.quidditch-fan-length-bond.entry.1",
        "type": 0
    },
    {
        "weight": 1,
        "text": "roll-tables.quidditch-fan-length-bond.entry.2",
        "type": 0
    }
],
  flags: {"core":{}},
});

import { RollTableSchema } from "../../schemas/index.js";

export const potioneerLengthBond = RollTableSchema.parse({
  id: "potioneer-length-bond",
  foundryId: "IACL8r7EYUEsf6To",
  type: "rolltable",
  source: "",
  formula: "1d6",
  replacement: true,
  displayRoll: true,
  entries: [
    {
        "weight": 1,
        "text": "roll-tables.potioneer-length-bond.entry.0",
        "type": 0
    },
    {
        "weight": 1,
        "text": "roll-tables.potioneer-length-bond.entry.1",
        "type": 0
    },
    {
        "weight": 1,
        "text": "roll-tables.potioneer-length-bond.entry.2",
        "type": 0
    }
],
  flags: {"core":{}},
});

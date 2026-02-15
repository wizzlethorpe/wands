import { RollTableSchema } from "../../schemas/index.js";

export const protectorLengthBond = RollTableSchema.parse({
  id: "protector-length-bond",
  foundryId: "RPwbn9Qm7tFYKivz",
  type: "rolltable",
  source: "",
  formula: "1d6",
  replacement: true,
  displayRoll: true,
  entries: [
    {
        "weight": 1,
        "text": "roll-tables.protector-length-bond.entry.0",
        "type": 0
    },
    {
        "weight": 1,
        "text": "roll-tables.protector-length-bond.entry.1",
        "type": 0
    },
    {
        "weight": 1,
        "text": "roll-tables.protector-length-bond.entry.2",
        "type": 0
    }
],
  flags: {"core":{}},
});

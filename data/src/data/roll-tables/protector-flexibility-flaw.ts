import { RollTableSchema } from "../../schemas/index.js";

export const protectorFlexibilityFlaw = RollTableSchema.parse({
  id: "protector-flexibility-flaw",
  foundryId: "ovMbxF1L1ZAWC939",
  type: "rolltable",
  source: "",
  formula: "1d6",
  replacement: true,
  displayRoll: true,
  entries: [
    {
        "weight": 1,
        "text": "roll-tables.protector-flexibility-flaw.entry.0",
        "type": 0
    },
    {
        "weight": 1,
        "text": "roll-tables.protector-flexibility-flaw.entry.1",
        "type": 0
    },
    {
        "weight": 1,
        "text": "roll-tables.protector-flexibility-flaw.entry.2",
        "type": 0
    }
],
  flags: {"core":{}},
});

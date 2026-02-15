import { RollTableSchema } from "../../schemas/index.js";

export const klutzFlexibilityFlaw = RollTableSchema.parse({
  id: "klutz-flexibility-flaw",
  foundryId: "s3In5r0Pv73RIgxd",
  type: "rolltable",
  source: "",
  formula: "1d6",
  replacement: true,
  displayRoll: true,
  entries: [
    {
        "weight": 1,
        "text": "roll-tables.klutz-flexibility-flaw.entry.0",
        "type": 0
    },
    {
        "weight": 1,
        "text": "roll-tables.klutz-flexibility-flaw.entry.1",
        "type": 0
    },
    {
        "weight": 1,
        "text": "roll-tables.klutz-flexibility-flaw.entry.2",
        "type": 0
    }
],
  flags: {"core":{}},
});

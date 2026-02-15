import { RollTableSchema } from "../../schemas/index.js";

export const troublemakerFlexibilityFlaw = RollTableSchema.parse({
  id: "troublemaker-flexibility-flaw",
  foundryId: "oyZAal7DUhWWCfIi",
  type: "rolltable",
  source: "",
  formula: "1d6",
  replacement: true,
  displayRoll: true,
  entries: [
    {
        "weight": 1,
        "text": "roll-tables.troublemaker-flexibility-flaw.entry.0",
        "type": 0
    },
    {
        "weight": 1,
        "text": "roll-tables.troublemaker-flexibility-flaw.entry.1",
        "type": 0
    },
    {
        "weight": 1,
        "text": "roll-tables.troublemaker-flexibility-flaw.entry.2",
        "type": 0
    }
],
  flags: {"core":{}},
});

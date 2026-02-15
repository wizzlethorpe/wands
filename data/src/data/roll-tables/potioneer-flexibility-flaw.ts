import { RollTableSchema } from "../../schemas/index.js";

export const potioneerFlexibilityFlaw = RollTableSchema.parse({
  id: "potioneer-flexibility-flaw",
  foundryId: "yTAP6fE8aWEbiHwe",
  type: "rolltable",
  source: "",
  formula: "1d6",
  replacement: true,
  displayRoll: true,
  entries: [
    {
        "weight": 1,
        "text": "roll-tables.potioneer-flexibility-flaw.entry.0",
        "type": 0
    },
    {
        "weight": 1,
        "text": "roll-tables.potioneer-flexibility-flaw.entry.1",
        "type": 0
    },
    {
        "weight": 1,
        "text": "roll-tables.potioneer-flexibility-flaw.entry.2",
        "type": 0
    }
],
  flags: {"core":{}},
});

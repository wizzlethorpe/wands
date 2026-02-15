import { RollTableSchema } from "../../schemas/index.js";

export const troublemakerLengthBond = RollTableSchema.parse({
  id: "troublemaker-length-bond",
  foundryId: "gkELBK6K6J3lRmpN",
  type: "rolltable",
  source: "",
  formula: "1d6",
  replacement: true,
  displayRoll: true,
  entries: [
    {
        "weight": 1,
        "text": "roll-tables.troublemaker-length-bond.entry.0",
        "type": 0
    },
    {
        "weight": 1,
        "text": "roll-tables.troublemaker-length-bond.entry.1",
        "type": 0
    },
    {
        "weight": 1,
        "text": "roll-tables.troublemaker-length-bond.entry.2",
        "type": 0
    }
],
  flags: {"core":{}},
});

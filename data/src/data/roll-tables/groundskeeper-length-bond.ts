import { RollTableSchema } from "../../schemas/index.js";

export const groundskeeperLengthBond = RollTableSchema.parse({
  id: "groundskeeper-length-bond",
  foundryId: "nwGWFXLDWcCP0tX5",
  type: "rolltable",
  source: "",
  formula: "1d6",
  replacement: true,
  displayRoll: true,
  entries: [
    {
        "weight": 1,
        "text": "roll-tables.groundskeeper-length-bond.entry.0",
        "type": 0
    },
    {
        "weight": 1,
        "text": "roll-tables.groundskeeper-length-bond.entry.1",
        "type": 0
    },
    {
        "weight": 1,
        "text": "roll-tables.groundskeeper-length-bond.entry.2",
        "type": 0
    }
],
  flags: {"core":{}},
});

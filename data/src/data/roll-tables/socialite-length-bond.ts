import { RollTableSchema } from "../../schemas/index.js";

export const socialiteLengthBond = RollTableSchema.parse({
  id: "socialite-length-bond",
  foundryId: "1lDnmoV1tYwDSDey",
  type: "rolltable",
  source: "",
  formula: "1d6",
  replacement: true,
  displayRoll: true,
  entries: [
    {
        "weight": 1,
        "text": "roll-tables.socialite-length-bond.entry.0",
        "type": 0
    },
    {
        "weight": 1,
        "text": "roll-tables.socialite-length-bond.entry.1",
        "type": 0
    },
    {
        "weight": 1,
        "text": "roll-tables.socialite-length-bond.entry.2",
        "type": 0
    }
],
  flags: {"core":{}},
});

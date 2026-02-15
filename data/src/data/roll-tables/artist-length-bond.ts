import { RollTableSchema } from "../../schemas/index.js";

export const artistLengthBond = RollTableSchema.parse({
  id: "artist-length-bond",
  foundryId: "WAViVaKrvumFGoYz",
  type: "rolltable",
  source: "",
  formula: "1d3",
  replacement: true,
  displayRoll: true,
  entries: [
    {
        "weight": 1,
        "text": "roll-tables.artist-length-bond.entry.0",
        "type": 0
    },
    {
        "weight": 1,
        "text": "roll-tables.artist-length-bond.entry.1",
        "type": 0
    },
    {
        "weight": 1,
        "text": "roll-tables.artist-length-bond.entry.2",
        "type": 0
    }
],
  flags: {"core":{}},
});

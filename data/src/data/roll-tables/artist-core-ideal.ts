import { RollTableSchema } from "../../schemas/index.js";

export const artistCoreIdeal = RollTableSchema.parse({
  id: "artist-core-ideal",
  foundryId: "dGK1IzVmbELM56nB",
  type: "rolltable",
  source: "",
  formula: "1d3",
  replacement: true,
  displayRoll: true,
  entries: [
    {
        "weight": 1,
        "text": "roll-tables.artist-core-ideal.entry.0",
        "type": 0
    },
    {
        "weight": 1,
        "text": "roll-tables.artist-core-ideal.entry.1",
        "type": 0
    },
    {
        "weight": 1,
        "text": "roll-tables.artist-core-ideal.entry.2",
        "type": 0
    }
],
  flags: {"core":{}},
});

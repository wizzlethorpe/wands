import { RollTableSchema } from "../../schemas/index.js";

export const artistFlexibilityFlaw = RollTableSchema.parse({
  id: "artist-flexibility-flaw",
  foundryId: "FN8pyTc0R4uzUcnI",
  type: "rolltable",
  source: "",
  formula: "1d3",
  replacement: true,
  displayRoll: true,
  entries: [
    {
        "weight": 1,
        "text": "roll-tables.artist-flexibility-flaw.entry.0",
        "type": 0
    },
    {
        "weight": 1,
        "text": "roll-tables.artist-flexibility-flaw.entry.1",
        "type": 0
    },
    {
        "weight": 1,
        "text": "roll-tables.artist-flexibility-flaw.entry.2",
        "type": 0
    }
],
  flags: {"core":{}},
});

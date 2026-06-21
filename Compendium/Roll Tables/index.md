---
title: Roll Tables
summary: Random tables for play.
---

Roll tables for corruption, mishaps, character traits, and more.

```base
filters:
  and:
    - 'file.folder == "Compendium/Roll Tables"'
    - 'file.name != "index"'
properties:
  note.formula: { displayName: Formula }
views:
  - type: table
    name: Contents
    order:
      - file.name
      - note.formula
```

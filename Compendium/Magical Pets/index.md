---
title: Magical Pets
summary: Familiars and magical companions.
---

Magical pets and familiars, with their stats.

```base
filters:
  and:
    - 'file.folder == "Compendium/Magical Pets"'
    - 'file.name != "index"'
properties:
  note.size_display: { displayName: Size }
  note.cr: { displayName: CR }
  note.ac: { displayName: AC }
  note.speed_display: { displayName: Speed }
views:
  - type: table
    name: Contents
    order:
      - file.name
      - note.size_display
      - note.cr
      - note.ac
      - note.speed_display
```

---
title: Creatures
summary: Beasts, beings, and monsters.
---

Creatures and monsters of the wizarding world, with their core stats.

```base
filters:
  and:
    - 'file.folder == "Compendium/Creatures"'
    - 'file.name != "index"'
properties:
  note.creature_type: { displayName: Type }
  note.size_display: { displayName: Size }
  note.cr_display: { displayName: CR }
  note.ac: { displayName: AC }
  note.hp: { displayName: HP }
views:
  - type: table
    name: Contents
    order:
      - file.name
      - note.creature_type
      - note.size_display
      - note.cr_display
      - note.ac
      - note.hp
```

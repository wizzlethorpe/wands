---
title: Spells
summary: Every W.A.N.D.S. spell, by level and school.
---

The complete spell list. Sort by level, school, casting time, or range.

```base
filters:
  and:
    - 'file.folder == "Compendium/Spells"'
    - 'file.name != "index"'
properties:
  note.level: { displayName: Level }
  note.school: { displayName: School }
  note.casting_time: { displayName: Casting Time }
  note.range: { displayName: Range }
views:
  - type: table
    name: Contents
    order:
      - file.name
      - note.level
      - note.school
      - note.casting_time
      - note.range
    sort:
      - column: note.level
        direction: ASC
      - column: file.name
        direction: ASC
```

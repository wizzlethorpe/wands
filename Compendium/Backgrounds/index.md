---
title: Backgrounds
summary: Character backgrounds.
---

Backgrounds and the proficiencies and features they grant.

```base
filters:
  and:
    - 'file.folder == "Compendium/Backgrounds"'
    - 'file.name != "index"'
properties:
  note.requirements: { displayName: Requirements }
  note.source: { displayName: Source }
views:
  - type: table
    name: Contents
    order:
      - file.name
      - note.requirements
      - note.source
```

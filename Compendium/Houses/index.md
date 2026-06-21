---
title: Houses
summary: The Hogwarts houses and their traits.
---

Each house and the traits it grants its students.

```base
filters:
  and:
    - 'file.folder == "Compendium/Houses"'
    - 'file.name != "index"'
properties:
  note.size: { displayName: Size }
  note.source: { displayName: Source }
views:
  - type: table
    name: Contents
    order:
      - file.name
      - note.size
      - note.source
```

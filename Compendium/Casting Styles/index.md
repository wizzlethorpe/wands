---
title: Casting Styles
summary: Casting styles and schools of magic.
---

Casting styles and schools of magic, with their spellcasting progression.

```base
filters:
  and:
    - 'file.folder == "Compendium/Casting Styles"'
    - 'file.name != "index"'
properties:
  note.spellcasting_ability: { displayName: Spellcasting }
  note.spellcasting_progression: { displayName: Progression }
  note.source: { displayName: Source }
views:
  - type: table
    name: Contents
    order:
      - file.name
      - note.spellcasting_ability
      - note.spellcasting_progression
      - note.source
```

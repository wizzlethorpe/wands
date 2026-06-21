---
title: Features
summary: Class, house, and feat features.
---

Features granted by houses, casting styles, backgrounds, feats, and more.

```base
filters:
  and:
    - 'file.folder == "Compendium/Features"'
    - 'file.name != "index"'
properties:
  note.feature_type_display: { displayName: Type }
  note.requirements: { displayName: Requirements }
  note.source: { displayName: Source }
views:
  - type: table
    name: Contents
    order:
      - file.name
      - note.feature_type_display
      - note.requirements
      - note.source
```

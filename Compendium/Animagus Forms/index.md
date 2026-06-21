---
title: Animagus Forms
summary: Animagus transformation forms.
---

The forms an Animagus can take, with their combat stats.

```base
filters:
  and:
    - 'file.folder == "Compendium/Animagus Forms"'
    - 'file.name != "index"'
properties:
  note.size_display: { displayName: Size }
  note.ac: { displayName: AC }
  note.hp: { displayName: HP }
  note.speed_display: { displayName: Speed }
views:
  - type: table
    name: Contents
    order:
      - file.name
      - note.size_display
      - note.ac
      - note.hp
      - note.speed_display
```

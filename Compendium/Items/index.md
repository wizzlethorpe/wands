---
title: Items
summary: Gear, potions, wands, and magical objects.
---

Every item: equipment, consumables, potions, and magical objects.

```base
filters:
  and:
    - 'file.folder == "Compendium/Items"'
    - 'file.name != "index"'
properties:
  note.category: { displayName: Category }
  note.rarity_display: { displayName: Rarity }
  note.price_display: { displayName: Price }
  note.weight_display: { displayName: Weight }
views:
  - type: table
    name: Contents
    order:
      - file.name
      - note.category
      - note.rarity_display
      - note.price_display
      - note.weight_display
```

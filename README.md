# W.A.N.D.S. (Wands & Wizards)

A Harry Potter 5e adaptation for Foundry VTT, with a companion reference website.

## Installation

Install the module in Foundry VTT (v13+) with the D&D 5e system (v3+):

1. Open Foundry VTT and go to **Add-on Modules** → **Install Module**
2. Paste the following manifest URL and click **Install**:
   ```
   https://github.com/wizzlethorpe/wands/releases/latest/download/module.json
   ```
3. Enable the module in your world under **Game Settings** → **Manage Modules**

### Compendium Translations (Optional)

W.A.N.D.S. supports compendium translations via [Babele](https://foundryvtt.com/packages/babele/). To see translated spell names, item descriptions, etc.:

1. Install and enable the **Babele** module
2. Set your preferred language in **Game Settings** → **Configure Settings** → **Language**

Currently supported: **English**, **Português (Brasil)**

---

## Project Overview

This monorepo contains three projects:

- **`data/`** — TypeScript + Zod content definitions (spells, items, creatures, etc.) and build scripts
- **`foundry/`** — Foundry VTT v13 module with LevelDB compendium packs
- **`site/`** — Quartz v4 documentation site

Content is defined once in `data/` and built to both targets.

## Setup

Requires Node.js >= 22.

```bash
npm run install:all    # install dependencies for data/ and site/
```

## Commands

Run from the repo root:

| Command | Description |
|---------|-------------|
| `npm run build` | Build data + compile LevelDB packs into `foundry/packs/` |
| `npm run build:data` | Build data only (Foundry JSON + Quartz markdown) |
| `npm run build:packs` | Build data + compile JSON to LevelDB |
| `npm run build:site` | Build the Quartz site |
| `npm run dev:site` | Build site + preview locally via Wrangler |
| `npm run deploy:site` | Build + deploy site to Cloudflare Pages |
| `npm run release:foundry` | Build, package, and create a GitHub release for the Foundry module |
| `npm run validate` | Validate all data against Zod schemas + check translation coverage |

## Build Process

```
data/src/data/            TypeScript content definitions (1,201 entries)
data/src/locales/en/      English translations (names, descriptions)
data/src/foundry-meta/    Foundry presentation metadata (images, folders, tokens)
        |
        v
   npm run build
        |
        +---> foundry/packs/             LevelDB compendium packs (Foundry VTT)
        +---> site/content/Compendium/   Markdown with YAML frontmatter (Quartz)
```

`data/` is the single source of truth. The build pipeline:

1. Loads all TS content definitions and locale strings
2. Builds a link resolver that maps entity names to `@UUID` references
3. `build-foundry.ts` generates Foundry JSON — converting markdown descriptions to HTML, resolving `[[Wikilinks]]` to `@UUID` cross-references, and applying presentation metadata from `foundry-meta/` overlays
4. `compile-packs.ts` compiles the JSON into LevelDB at `foundry/packs/`
5. `build-quartz.ts` writes markdown with YAML frontmatter directly to `site/content/Compendium/`

## Project Structure

```
wands/
├── data/
│   ├── src/
│   │   ├── schemas/        Zod schema definitions
│   │   ├── data/           Content entries (one .ts file per entry)
│   │   │   ├── spells/
│   │   │   ├── items/
│   │   │   ├── creatures/
│   │   │   ├── features/
│   │   │   ├── backgrounds/
│   │   │   ├── houses/
│   │   │   ├── casting-styles/
│   │   │   ├── animagus-forms/
│   │   │   ├── magical-pets/
│   │   │   └── roll-tables/
│   │   ├── locales/        Translation files (JSON)
│   │   │   └── en/
│   │   ├── foundry-meta/   Foundry presentation metadata (per-pack overlays)
│   │   └── build/          Build scripts
│   └── scripts/            Pack compilation + one-time migrations
├── foundry/
│   ├── module.json         Foundry VTT manifest
│   ├── src/                Module JavaScript
│   ├── styles/             CSS
│   ├── lang/               Foundry UI translations
│   └── packs/              Compiled LevelDB packs (generated)
└── site/
    ├── quartz.config.ts    Site configuration
    ├── quartz/             Quartz framework
    └── content/
        ├── Rules/          Hand-written chapters
        └── Compendium/     Generated from data/ (generated)
```

## Contributing Translations

We welcome community translations! There are two types of translatable content:

### Compendium content (spells, items, creatures, etc.)

Compendium translations live in `data/src/locales/<locale>/` and are served at runtime via [Babele](https://foundryvtt.com/packages/babele/). Each locale folder has 10 JSON files — one per compendium pack.

**To add a new language:**

1. Copy the English locale as a starting point:
   ```bash
   cp -r data/src/locales/en data/src/locales/<locale>
   ```
   Use standard locale codes: `pt-BR`, `es`, `fr`, `de`, `ja`, etc.

2. Translate the values (not the keys) in each JSON file:
   ```json
   {
     "accio.name": "Accio",
     "accio.description": "A target object is pulled directly to the caster..."
   }
   ```

3. You don't need to translate everything at once — missing translations automatically fall back to English. Start with whichever file you like and expand over time.

4. Register the locale in `foundry/module.json` by adding an entry to the `languages` array:
   ```json
   { "lang": "fr", "name": "Français", "path": "lang/fr.json" }
   ```

5. Add a UI strings file at `foundry/lang/<locale>.json` for skill names, spell school names, and sheet labels. Use `foundry/lang/en.json` as a reference.

6. Build and verify:
   ```bash
   npm run build        # generates Babele translation files
   npm run validate     # checks translation coverage
   ```

7. Open a pull request with your changes.

**Compendium translation files:**

| File | Content | Entries |
|------|---------|---------|
| `spells.json` | Spell names and descriptions | 145 |
| `items.json` | Item names and descriptions | 162 |
| `creatures.json` | Creature names and descriptions | 581 |
| `features.json` | Class/race feature names and descriptions | 153 |
| `backgrounds.json` | Background names and descriptions | 28 |
| `houses.json` | House names and descriptions | 10 |
| `casting-styles.json` | Casting style names and descriptions | 9 |
| `animagus-forms.json` | Animagus form names and descriptions | 20 |
| `magical-pets.json` | Magical pet names and descriptions | 35 |
| `roll-tables.json` | Roll table names, descriptions, and result text | 58 |

### UI strings (skill names, spell schools, sheet labels)

UI translations live in `foundry/lang/<locale>.json` and are loaded by Foundry's built-in localization system (no Babele needed). These cover renamed skills, custom spell schools, and character sheet labels.

See `foundry/lang/en.json` for the full set of translatable keys.

## License

Content is based on [Wands & Wizards](https://wandsnwizards.com/) by MadManNBlueBox.

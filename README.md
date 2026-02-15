# W.A.N.D.S. (Wands & Wizards)

A Harry Potter 5e adaptation for Foundry VTT, with a companion reference website.

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

Translations live in `data/src/locales/`. Each locale has JSON files organized by content type.

### Adding a new language

1. Copy the English locale as a starting point:
   ```bash
   cp -r data/src/locales/en data/src/locales/your-locale
   ```
   Use standard locale codes: `pt-BR`, `es`, `fr`, `de`, `ja`, etc.

2. Translate the strings in each JSON file. The format is:
   ```json
   {
     "accio.name": "Accio",
     "accio.description": "A target object is pulled directly to the caster..."
   }
   ```
   Translate the values, not the keys.

3. You don't need to translate every string. Missing translations automatically fall back to English.

4. Test your translations:
   ```bash
   cd data
   npm run build -- --locale=your-locale
   npm run validate
   ```

5. Open a pull request with your new locale directory.

### Translation files

| File | Content |
|------|---------|
| `spells.json` | Spell names and descriptions |
| `items.json` | Item names and descriptions |
| `creatures.json` | Creature names and descriptions |
| `features.json` | Class/race feature names and descriptions |
| `backgrounds.json` | Background names and descriptions |
| `houses.json` | House names and descriptions |
| `casting-styles.json` | Casting style names and descriptions |
| `animagus-forms.json` | Animagus form names and descriptions |
| `magical-pets.json` | Magical pet names and descriptions |
| `roll-tables.json` | Roll table names, descriptions, and result text |

## Foundry VTT Installation

Install the module in Foundry VTT using the manifest URL:

```
https://github.com/kubishi/wands/releases/latest/download/module.json
```

Requires Foundry VTT v13+ and the D&D 5e system v3+.

## License

Content is based on [Wands & Wizards](https://wandsnwizards.com/) by MadManNBlueBox.

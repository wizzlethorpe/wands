# W.A.N.D.S.

A Harry Potter 5e adaptation (Wands & Wizards) for the D&D 5e system, authored as
a [wizzlethorpe vault](https://vaults.wizzlethorpe.com). This one source produces
two things:

- a role-gated **reference wiki** (every spell, item, creature, and rule), and
- an installable **Foundry VTT module** (the compendium packs), compiled from the
  same content.

## Layout

```
WANDS/
├── index.md            wiki home
├── Rules/              hand-authored chapters (Houses, Casting Styles, …)
├── Compendium/         spells, items, creatures, features, … (one page per entry)
│   └── <Type>/         <Name>.md (+ <Name>.foundry.json sidecar of dnd5e data)
├── settings.md         vault config (managed by the `vaults` CLI)
└── foundry/            the Foundry module (built by `vaults build --module`; wiki-ignored)
```

Each compendium page is both a wiki article and a Foundry document: the markdown
body is the description, and `foundry:` frontmatter (+ a `.foundry.json` sidecar,
or inline `foundry.data` for roll tables) carries the dnd5e mechanics.

## Build & deploy

```bash
# Reference wiki (static site → Cloudflare Pages)
vaults build          # render locally
vaults preview        # view it
vaults push           # deploy

# Foundry module (LevelDB compendium packs + module.json, in WANDS/foundry/)
vaults build . --module   # compile this vault into foundry/
```

The Foundry module dir (`foundry/`) is an extensible module you own — the
compiler rewrites only its `packs/` and the `packs` array of `module.json`;
custom code (`src/`), styles, UI `lang/`, `packFolders` and Babele translations
are preserved. See
[foundry/scripts/](foundry/scripts/) for `dev-install.sh` and `release.sh`.

## Credits

Content is based on [Wands & Wizards](https://www.gmbinder.com/share/-LsXE64qLDdLgBczM2kA) by MadManNBlueBox.

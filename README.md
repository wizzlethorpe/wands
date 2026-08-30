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

This vault is pinned to **vaults 0.14.0**, and every command below says so.
Do not run a bare `vaults` here.

```bash
V='npx -y @wizzlethorpe/vaults@0.14.0'

# Reference wiki (static site → Cloudflare Pages)
$V build          # render locally
$V preview        # view it
$V push           # deploy

# Foundry module (LevelDB compendium packs + module.json, in WANDS/foundry/)
$V build . --module   # compile this vault into foundry/
```

### Why it is pinned

`--module` compiles a vault into a module with the content baked in. After
0.14.0 the vaults CLI dropped it: Foundry integration moved to [graft], where a
vault compiles to an entry list that its module fetches and builds on the
reader's machine. WANDS has not made that move yet, so it stays on the last
version that can build it — the same version that produced its last release.

The pin covers the wiki as well, not just the module. A current `vaults build`
runs a migration that renames this vault's Foundry frontmatter (`base` →
`source`, `data` → `patch`) across all 658 pages that use it, and 0.14.0 does
not understand the new names. Running it once would leave the module
uncompilable until WANDS moves to graft.

[graft]: https://github.com/wizzlethorpe/graft

The Foundry module dir (`foundry/`) is an extensible module you own — the
compiler rewrites only its `packs/` and the `packs` array of `module.json`;
custom code (`src/`), styles, UI `lang/`, `packFolders` and Babele translations
are preserved. See
[foundry/scripts/](foundry/scripts/) for `dev-install.sh` and `release.sh`.

## Credits

Content is based on [Wands & Wizards](https://www.gmbinder.com/share/-LsXE64qLDdLgBczM2kA) by MadManNBlueBox.

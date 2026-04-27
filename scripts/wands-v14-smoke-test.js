// === WANDS v14 smoke test ===
// Paste into Foundry's F12 console after loading a world with the wands module enabled.
// Reports pass/fail for each expectation.

(() => {
  const results = [];
  const check = (label, ok, detail = "") => {
    results.push({ label, ok, detail });
    console.log(`${ok ? "PASS" : "FAIL"} | ${label}${detail ? " — " + detail : ""}`);
  };

  // 1. Module is active
  const mod = game.modules.get("wands");
  check("module 'wands' is active", !!mod?.active, mod ? `version ${mod.version}` : "module not found");

  // 2. Foundry / dnd5e versions
  check("Foundry generation >= 14", game.release.generation >= 14, `release ${game.version}`);
  check("dnd5e system version >= 5", Number(game.system.version.split(".")[0]) >= 5, `dnd5e ${game.system.version}`);

  // 3. Skill overrides applied. dnd5e preLocalizes labels at i18nInit, so by the
  // time we read them they're already translated strings — accept either the i18n
  // key or its English translation.
  const skills = CONFIG.DND5E.skills;
  const labelMatches = (got, expectedKey) =>
    got === expectedKey || got === game.i18n.localize(expectedKey);
  check("skill ani relabeled (Magical Creatures)", labelMatches(skills.ani?.label, "WANDS.SkillAnimal"),
    `got "${skills.ani?.label}"`);
  check("skill arc relabeled (Magical Theory)", labelMatches(skills.arc?.label, "WANDS.SkillArcana"),
    `got "${skills.arc?.label}"`);
  check("skill his relabeled (Muggle Studies)", labelMatches(skills.his?.label, "WANDS.SkillHistory"),
    `got "${skills.his?.label}"`);
  check("skill nat relabeled (Herbology, ability=int)",
    labelMatches(skills.nat?.label, "WANDS.SkillHerbology") && skills.nat?.ability === "int",
    `label="${skills.nat?.label}", ability=${skills.nat?.ability}`);
  check("skill ptn added", !!skills.ptn, skills.ptn ? `ability=${skills.ptn.ability}` : "missing");
  check("skill ani retains icon from dnd5e", !!skills.ani?.icon, skills.ani?.icon ?? "icon missing");

  // 4. Spell schools added
  for (const k of ["cha", "jhc", "trf", "hea"]) {
    check(`spell school '${k}' present`, !!CONFIG.DND5E.spellSchools[k]);
  }

  // 5. Currency relabels
  check("currency pp = Ruby", CONFIG.DND5E.currencies.pp.label === "Ruby");
  check("currency gp = Galleon", CONFIG.DND5E.currencies.gp.label === "Galleon");

  // 6. Custom sheets registered. CONFIG.Actor.sheetClasses[type] is keyed by `${scope}.${cls.name}`
  // and each entry has { id, label, default, canBeDefault, canConfigure, cls }.
  const charSheets = CONFIG.Actor.sheetClasses?.character ?? {};
  const expected = ["WandsBadgerSheet", "WandsEagleSheet", "WandsLionSheet", "WandsSnakeSheet",
                    "WandsBeauxbatonsSheet", "WandsIlvermornySheet", "WandsDurmstrangSheet"];
  for (const name of expected) {
    const id = `dnd5e.${name}`;
    const entry = charSheets[id];
    const ok = !!entry?.cls && (entry.cls.prototype instanceof dnd5e.applications.actor.CharacterActorSheet);
    check(`sheet '${name}' registered as ${id}`, ok,
      entry ? `label="${entry.label}", canConfigure=${entry.canConfigure}` : "not in CONFIG.Actor.sheetClasses.character");
  }

  // 7. Sheets actually instantiate (without throwing)
  const Base = dnd5e?.applications?.actor?.CharacterActorSheet;
  check("dnd5e CharacterActorSheet exists", !!Base);

  // 8. Compendium packs are reachable
  const expectedPacks = [
    "wands.features-wands", "wands.backgrounds-wands",
    "wands.casting-styles-and-schools-of-magic-wands", "wands.houses-wands",
    "wands.items-wands", "wands.magical-pets-wands", "wands.monsters-wands",
    "wands.spells-wands", "wands.animagus-form-wands", "wands.wands-roll-tables"
  ];
  for (const id of expectedPacks) {
    check(`pack ${id} loaded`, !!game.packs.get(id));
  }

  // 9. No deprecation warnings from the wands module specifically
  // (manual: look at the F12 console for lines starting with "DEPRECATED" that mention wands)

  const passed = results.filter(r => r.ok).length;
  const failed = results.length - passed;
  console.log(`%c=== ${passed}/${results.length} passed${failed ? `, ${failed} failed` : ""} ===`,
    `font-weight: bold; color: ${failed ? "tomato" : "limegreen"}`);
  return results;
})();

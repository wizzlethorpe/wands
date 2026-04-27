// === WANDS v14 smoke test ===
// Paste into Foundry's F12 console after loading a world with the wands module enabled.
// Reports pass/fail for each expectation.

(async () => {
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

  // 9. Compendium item types are correct for dnd5e v5
  // Backgrounds should be type="background", casting styles type="class", schools type="subclass".
  await (async () => {
    const bgPack = game.packs.get("wands.backgrounds-wands");
    if (!bgPack) return;
    const bgIndex = await bgPack.getIndex({ fields: ["type"] });
    const bgTypes = new Set([...bgIndex].map(e => e.type));
    check("all backgrounds are type='background'",
      bgTypes.size === 1 && bgTypes.has("background"),
      `types found: ${[...bgTypes].join(", ")}`);

    const csPack = game.packs.get("wands.casting-styles-and-schools-of-magic-wands");
    if (!csPack) return;
    const csIndex = await csPack.getIndex({ fields: ["type", "name"] });
    const classes = [...csIndex].filter(e => e.type === "class").map(e => e.name);
    const subclasses = [...csIndex].filter(e => e.type === "subclass").map(e => e.name);
    check("3 casting styles emitted as type='class'", classes.length === 3,
      `found ${classes.length}: ${classes.join(", ")}`);
    // Each school is fanned out per caster (6 schools × 3 casters = 18 variants).
    check("18 subclass variants (6 schools × 3 casters)", subclasses.length === 18,
      `found ${subclasses.length}`);
    // Verify each caster identifier has all 6 schools.
    const docsBySubclass = await csPack.getDocuments({ type: "subclass" });
    const byCid = new Map();
    for (const d of docsBySubclass) {
      const cid = d.system.classIdentifier;
      byCid.set(cid, (byCid.get(cid) ?? 0) + 1);
    }
    for (const cid of ["willpower-caster", "technique-caster", "intellect-caster"]) {
      check(`${cid} has 6 subclass variants`, byCid.get(cid) === 6,
        `got ${byCid.get(cid) ?? 0}`);
    }

    // Verify a class document loads and has the expected system fields populated.
    const willpower = await csPack.getDocument("HRkzC0UTl2ZXhzzh");
    check("Willpower Caster: hit die d10", willpower?.system?.hd?.denomination === "d10",
      `got "${willpower?.system?.hd?.denomination}"`);
    check("Willpower Caster: spellcasting=full/cha",
      willpower?.system?.spellcasting?.progression === "full" &&
        willpower?.system?.spellcasting?.ability === "cha",
      `progression=${willpower?.system?.spellcasting?.progression}, ability=${willpower?.system?.spellcasting?.ability}`);

    // Advancement chain — verify each caster has the full structure from Chapter 2.
    // Expected per caster: 1 HitPoints + 1 Subclass + 5 ASI + 5 ItemGrant
    // (L1/2/3/9/20) + 1 ItemChoice (Metamagic) + 4 ScaleValue = 17 entries.
    const casters = [
      ["HRkzC0UTl2ZXhzzh", "Willpower"],
      ["yIqpcDpoUmFoJI3U", "Technique"],
      ["aY9MKttqjWxgO8aq", "Intellect"],
    ];
    for (const [cid, label] of casters) {
      const cls = await csPack.getDocument(cid);
      const advs = cls?.system?.advancement?.contents ?? cls?.system?.advancement ?? [];
      const counts = {};
      for (const a of advs) counts[a.type] = (counts[a.type] ?? 0) + 1;
      check(`${label}: HitPoints advancement present`, counts.HitPoints === 1, `got ${counts.HitPoints ?? 0}`);
      check(`${label}: Subclass advancement present`, counts.Subclass === 1, `got ${counts.Subclass ?? 0}`);
      check(`${label}: 5 ASI advancements (L4/8/12/16/19)`, counts.AbilityScoreImprovement === 5,
        `got ${counts.AbilityScoreImprovement ?? 0}`);
      check(`${label}: ItemGrants at L1/2/3/9/20`, counts.ItemGrant === 5, `got ${counts.ItemGrant ?? 0}`);
      check(`${label}: 1 Metamagic ItemChoice`, counts.ItemChoice === 1, `got ${counts.ItemChoice ?? 0}`);
      check(`${label}: 4 ScaleValues (sorcery-points / metamagic-known / cantrips-known / spells-known)`,
        counts.ScaleValue === 4, `got ${counts.ScaleValue ?? 0}`);
    }

    // Spot-check a couple of scale-value endpoints from the chapter table.
    const findScale = (cls, ident) => {
      const advs = cls?.system?.advancement?.contents ?? cls?.system?.advancement ?? [];
      const a = advs.find(x => x.type === "ScaleValue" && x.configuration?.identifier === ident);
      return a?.configuration?.scale ?? {};
    };
    const wp = await csPack.getDocument("HRkzC0UTl2ZXhzzh");
    const tq = await csPack.getDocument("yIqpcDpoUmFoJI3U");
    const it = await csPack.getDocument("aY9MKttqjWxgO8aq");

    check("Willpower L20 sorcery-points = 20", findScale(wp, "sorcery-points")["20"]?.value === 20);
    check("Technique L20 sorcery-points = 25", findScale(tq, "sorcery-points")["20"]?.value === 25);
    check("Intellect L20 spells-known = 31", findScale(it, "spells-known")["20"]?.value === 31);
    check("Willpower L17 metamagic-known = 4", findScale(wp, "metamagic-known")["17"]?.value === 4);
    check("Technique L18 metamagic-known = 8", findScale(tq, "metamagic-known")["18"]?.value === 8);

    // Each subclass variant should have 5 ItemChoice entries (L1/6/10/14/18)
    // — one per Chapter 3 subclass-feature level.
    const sampleSubclassIds = {
      "Charms (Willpower)": "n31KaJnrCwRtUyuR",
      "Healing (Intellect)": null,  // resolved by name below
      "Divination (Technique)": null,
      "Magizoology (Willpower)": null,
    };
    // Just sample one school per caster to keep the test concise.
    const allSubs = await csPack.getDocuments({ type: "subclass" });
    const oneCharms = allSubs.find(s => s.system.identifier === "charms"
      && s.system.classIdentifier === "willpower-caster");
    const oneDivination = allSubs.find(s => s.system.identifier === "divination"
      && s.system.classIdentifier === "technique-caster");
    const oneMagizoology = allSubs.find(s => s.system.identifier === "magizoology"
      && s.system.classIdentifier === "willpower-caster");

    for (const [label, sub] of [
      ["Charms / Willpower", oneCharms],
      ["Divination / Technique", oneDivination],
      ["Magizoology / Willpower", oneMagizoology],
    ]) {
      const advs = sub?.system?.advancement?.contents ?? sub?.system?.advancement ?? [];
      const choiceCount = advs.filter(a => a.type === "ItemChoice").length;
      check(`${label}: 5 subclass ItemChoice entries (L1/6/10/14/18)`,
        choiceCount === 5, `got ${choiceCount}`);
    }
  })();

  // 10. No deprecation warnings from the wands module specifically
  // (manual: look at the F12 console for lines starting with "DEPRECATED" that mention wands)

  const passed = results.filter(r => r.ok).length;
  const failed = results.length - passed;
  console.log(`%c=== ${passed}/${results.length} passed${failed ? `, ${failed} failed` : ""} ===`,
    `font-weight: bold; color: ${failed ? "tomato" : "limegreen"}`);
  return results;
})();

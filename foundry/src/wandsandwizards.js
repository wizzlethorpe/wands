Hooks.once("init", function () {
  // ==== Babele compendium translation support ====
  if (typeof Babele !== "undefined") {
    // Register each locale that has Babele translation files
    // dir is relative to modules/wands/
    for (const { lang } of game.modules.get("wands")?.languages ?? []) {
      if (lang === "en") continue;
      game.babele.register({ module: "wands", lang, dir: `babele/${lang}` });
    }
  }

  // ==== W&W config tweaks ====

  // Rename/add skills
  CONFIG.DND5E.skills["ani"] = { label: "WANDS.SkillAnimal", ability: "wis" };     // Magical Creatures
  CONFIG.DND5E.skills["arc"] = { label: "WANDS.SkillArcana", ability: "int" };     // Magical Theory
  CONFIG.DND5E.skills["his"] = { label: "WANDS.SkillHistory", ability: "int" };    // Muggle Studies
  CONFIG.DND5E.skills["nat"] = { label: "WANDS.SkillHerbology", ability: "int" };  // Herbology
  CONFIG.DND5E.skills["ptn"] = { label: "WANDS.SkillPotion", ability: "wis" };     // Potion Making

  // Custom spell schools (dnd5e v3 requires icon field)
  CONFIG.DND5E.spellSchools["cha"] = {
    label: "WANDS.SchoolCharms",
    icon: "icons/magic/light/explosion-star-glow-silhouette.webp"
  };
  CONFIG.DND5E.spellSchools["jhc"] = {
    label: "WANDS.SchoolJHC",
    icon: "icons/magic/unholy/strike-beam-blood-red-purple.webp"
  };
  CONFIG.DND5E.spellSchools["trf"] = {
    label: "WANDS.SchoolTransfig",
    icon: "icons/magic/control/silhouette-hold-change-blue.webp"
  };
  CONFIG.DND5E.spellSchools["hea"] = {
    label: "WANDS.SchoolHealing",
    icon: "icons/magic/life/heart-cross-strong-flame-green.webp"
  };

  // Wizarding currency names
  CONFIG.DND5E.currencies.pp.label = "Ruby";
  CONFIG.DND5E.currencies.gp.label = "Galleon";
  CONFIG.DND5E.currencies.sp.label = "Sickle";
  CONFIG.DND5E.currencies.cp.label = "Knut";

  // ==== Custom character sheets (Foundry v13 / AppV2) ====
  const Base = dnd5e?.applications?.actor?.ActorSheet5eCharacter2;
  if (!Base) {
    console.warn("WANDS: could not locate D&D5e ActorSheet5eCharacter2.");
    return;
  }

  // Creates a named sheet subclass that adds a CSS theme class.
  // eval is needed so each class gets a unique constructor name for Foundry's sheet registry.
  function makeSheet(className, theme) {
    // eslint-disable-next-line no-eval
    return eval(`(class ${className} extends Base {
      static DEFAULT_OPTIONS = foundry.utils.mergeObject(Base.DEFAULT_OPTIONS, {
        classes: ["${theme}"]
      }, { inplace: false });
    })`);
  }

  const sheets = [
    ["WandsBadgerSheet",      "badger",      "WANDS.Sheets.Badger"],
    ["WandsEagleSheet",       "eagle",       "WANDS.Sheets.Eagle"],
    ["WandsLionSheet",        "lion",        "WANDS.Sheets.Lion"],
    ["WandsSnakeSheet",       "snake",       "WANDS.Sheets.Snake"],
    ["WandsBeauxbatonsSheet", "beauxbatons", "WANDS.Sheets.Beauxbatons"],
    ["WandsIlvermornySheet",  "ilvermorny",  "WANDS.Sheets.Ilvermorny"],
    ["WandsDurmstrangSheet",  "durmstrang",  "WANDS.Sheets.Durmstrang"],
  ];

  for (const [className, theme, label] of sheets) {
    Actors.registerSheet("dnd5e", makeSheet(className, theme), {
      types: ["character"], makeDefault: false, label
    });
  }
});

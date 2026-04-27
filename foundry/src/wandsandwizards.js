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

  // Rename/add skills. Merge so we keep dnd5e's icon/fullKey/reference fields.
  const skillOverrides = {
    ani: { label: "WANDS.SkillAnimal", ability: "wis" },     // Magical Creatures
    arc: { label: "WANDS.SkillArcana", ability: "int" },     // Magical Theory
    his: { label: "WANDS.SkillHistory", ability: "int" },    // Muggle Studies
    nat: { label: "WANDS.SkillHerbology", ability: "int" },  // Herbology
    ptn: { label: "WANDS.SkillPotion", ability: "wis" }      // Potion Making (new)
  };
  for (const [key, patch] of Object.entries(skillOverrides)) {
    CONFIG.DND5E.skills[key] = foundry.utils.mergeObject(CONFIG.DND5E.skills[key] ?? {}, patch);
  }

  // Custom spell schools
  CONFIG.DND5E.spellSchools["cha"] = {
    label: "WANDS.SchoolCharms",
    icon: "icons/magic/light/explosion-star-glow-silhouette.webp",
    fullKey: "charms"
  };
  CONFIG.DND5E.spellSchools["jhc"] = {
    label: "WANDS.SchoolJHC",
    icon: "icons/magic/unholy/strike-beam-blood-red-purple.webp",
    fullKey: "jinxesHexesCurses"
  };
  CONFIG.DND5E.spellSchools["trf"] = {
    label: "WANDS.SchoolTransfig",
    icon: "icons/magic/control/silhouette-hold-change-blue.webp",
    fullKey: "transfiguration"
  };
  CONFIG.DND5E.spellSchools["hea"] = {
    label: "WANDS.SchoolHealing",
    icon: "icons/magic/life/heart-cross-strong-flame-green.webp",
    fullKey: "healing"
  };

  // Wizarding currency names
  CONFIG.DND5E.currencies.pp.label = "Ruby";
  CONFIG.DND5E.currencies.gp.label = "Galleon";
  CONFIG.DND5E.currencies.sp.label = "Sickle";
  CONFIG.DND5E.currencies.cp.label = "Knut";

  // ==== Custom character sheets (Foundry v14 / dnd5e v5 AppV2) ====
  const Base = dnd5e?.applications?.actor?.CharacterActorSheet;
  if (!Base) {
    console.warn("WANDS: could not locate dnd5e CharacterActorSheet — sheet themes not registered.");
    return;
  }

  // ApplicationV2 auto-merges DEFAULT_OPTIONS with the parent class (arrays concat,
  // objects merge), so subclasses only need to declare their diff.
  class WandsBadgerSheet      extends Base { static DEFAULT_OPTIONS = { classes: ["badger"] }; }
  class WandsEagleSheet       extends Base { static DEFAULT_OPTIONS = { classes: ["eagle"] }; }
  class WandsLionSheet        extends Base { static DEFAULT_OPTIONS = { classes: ["lion"] }; }
  class WandsSnakeSheet       extends Base { static DEFAULT_OPTIONS = { classes: ["snake"] }; }
  class WandsBeauxbatonsSheet extends Base { static DEFAULT_OPTIONS = { classes: ["beauxbatons"] }; }
  class WandsIlvermornySheet  extends Base { static DEFAULT_OPTIONS = { classes: ["ilvermorny"] }; }
  class WandsDurmstrangSheet  extends Base { static DEFAULT_OPTIONS = { classes: ["durmstrang"] }; }

  const sheets = [
    [WandsBadgerSheet,      "WANDS.Sheets.Badger"],
    [WandsEagleSheet,       "WANDS.Sheets.Eagle"],
    [WandsLionSheet,        "WANDS.Sheets.Lion"],
    [WandsSnakeSheet,       "WANDS.Sheets.Snake"],
    [WandsBeauxbatonsSheet, "WANDS.Sheets.Beauxbatons"],
    [WandsIlvermornySheet,  "WANDS.Sheets.Ilvermorny"],
    [WandsDurmstrangSheet,  "WANDS.Sheets.Durmstrang"]
  ];

  const Actors = foundry.documents.collections.Actors;
  for (const [cls, label] of sheets) {
    Actors.registerSheet("dnd5e", cls, {
      types: ["character"], makeDefault: false, label
    });
  }
});

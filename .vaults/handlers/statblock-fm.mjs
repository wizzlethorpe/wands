// `statblock-fm` code-block handler: render a D&D 5e stat block for an Actor
// page (creature / magical pet / animagus form) straight from the page's
// frontmatter. The fenced block carries no body —
//
//     ```statblock-fm
//     ```
//
// all values are read from frontmatter (ac, hp, speed_display, the six ability
// scores + mods, senses, saves, CR, immunities, languages). This keeps the
// otherwise stat-only Actor pages from rendering blank. Distinct from the
// built-in `statblock` handler, which renders a hand-authored YAML block.

const ABILITIES = [
  ["STR", "str"], ["DEX", "dex"], ["CON", "con"],
  ["INT", "int"], ["WIS", "wis"], ["CHA", "cha"],
];

const SENSES = [
  ["Darkvision", "senses_darkvision"], ["Blindsight", "senses_blindsight"],
  ["Tremorsense", "senses_tremorsense"], ["Truesight", "senses_truesight"],
];

const SKILL_NAMES = {
  acr: "Acrobatics", ani: "Animal Handling", arc: "Arcana", ath: "Athletics",
  dec: "Deception", his: "History", ins: "Insight", itm: "Intimidation",
  inv: "Investigation", med: "Medicine", nat: "Nature", prc: "Perception",
  prf: "Performance", per: "Persuasion", rel: "Religion", slt: "Sleight of Hand",
  ste: "Stealth", sur: "Survival",
};

/** dnd5e `skill_bonuses` is the full skills object; show only proficient ones. */
function formatSkills(skills) {
  if (!skills || typeof skills !== "object" || Array.isArray(skills)) {
    return typeof skills === "string" ? skills : "";
  }
  return Object.entries(skills)
    .filter(([, s]) => s && (Number(s.prof) > 0 || Number(s.value) > 0))
    .map(([key, s]) => {
      const bonus = Number(s.total ?? s.mod ?? 0);
      return `${SKILL_NAMES[key] ?? key} ${bonus >= 0 ? "+" : ""}${bonus}`;
    })
    .join(", ");
}

export const handler = {
  codeBlock: "statblock-fm",
  assets: {
    styles: ["./statblock-fm.css"],
    foundry: { styles: true },
  },
  render(_content, ctx) {
    const fm = ctx.frontmatter ?? {};
    const esc = (v) => ctx.escape(String(v));
    const has = (v) => v !== undefined && v !== null && v !== "" && !(Array.isArray(v) && v.length === 0);
    const list = (v) => (Array.isArray(v) ? v.filter(Boolean).join(", ") : String(v));
    const signed = (n) => (Number(n) >= 0 ? `+${n}` : `${n}`);

    // Header: "Medium beast, neutral evil"
    const headBits = [[fm.size_display, fm.creature_type].filter(has).join(" "), fm.alignment]
      .filter(has).map(esc).join(", ");

    const row = (label, value) =>
      has(value) ? `<div class="wands-sb-row"><span class="wands-sb-key">${esc(label)}</span>`
        + `<span class="wands-sb-val">${esc(list(value))}</span></div>` : "";

    const core = [
      has(fm.ac) ? row("Armor Class", fm.ac_type ? `${fm.ac} (${fm.ac_type})` : fm.ac) : "",
      has(fm.hp) ? row("Hit Points", fm.hp_formula ? `${fm.hp} (${fm.hp_formula})` : fm.hp) : "",
      row("Speed", fm.speed_display),
    ].join("");

    const abilities = ABILITIES.map(([label, key]) => {
      const score = has(fm[key]) ? fm[key] : "—";
      const mod = has(fm[`${key}_mod`]) ? ` (${signed(fm[`${key}_mod`])})` : "";
      return `<div class="wands-sb-abil"><span class="wands-sb-abil-k">${label}</span>`
        + `<span class="wands-sb-abil-v">${esc(score)}${esc(mod)}</span></div>`;
    }).join("");

    // Senses: "Darkvision 60 ft., passive Perception 10"
    const senseBits = SENSES.filter(([, k]) => Number(fm[k]) > 0).map(([label, k]) => `${label} ${fm[k]} ft.`);
    if (has(fm.senses_special)) senseBits.push(list(fm.senses_special));
    if (has(fm.passive_perception)) senseBits.push(`passive Perception ${fm.passive_perception}`);

    const extra = [
      row("Saving Throws", fm.saving_throws_display),
      row("Skills", formatSkills(fm.skill_bonuses)),
      row("Damage Resistances", fm.damage_resistances),
      row("Damage Immunities", fm.damage_immunities),
      row("Damage Vulnerabilities", fm.damage_vulnerabilities),
      row("Condition Immunities", fm.condition_immunities),
      senseBits.length ? row("Senses", senseBits.join(", ")) : "",
      row("Languages", [list(has(fm.languages) ? fm.languages : ""), list(has(fm.languages_custom) ? fm.languages_custom : "")].filter(Boolean).join(", ")),
      has(fm.cr_display) ? row("Challenge", fm.cr_display) : (has(fm.cr) ? row("Challenge", fm.cr) : ""),
    ].join("");

    return {
      html:
        `<div class="wands-statblock">`
        + (headBits ? `<div class="wands-sb-head">${headBits}</div>` : "")
        + core
        + `<div class="wands-sb-abils">${abilities}</div>`
        + extra
        + `</div>`,
    };
  },
};

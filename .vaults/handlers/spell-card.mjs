// `spell-card` code-block handler: renders a spell's mechanical header from
// the page's own frontmatter. The fenced block carries no body —
//
//     ```spell-card
//     ```
//
// all values are read from frontmatter (level, school, casting_time, range,
// components, duration, concentration, ritual). Styles opt into the Foundry
// import bundle so the card also renders inside synced journal pages.

export const handler = {
  codeBlock: "spell-card",
  assets: {
    styles: ["./spell-card.css"],
    foundry: { styles: true },
  },
  render(_content, ctx) {
    const fm = ctx.frontmatter ?? {};
    const esc = (v) => ctx.escape(String(v));

    const level = fm.level === 0 || fm.level === "0" ? "Cantrip" : `Level ${esc(fm.level ?? "?")}`;
    const head = fm.school ? `${level} &middot; ${esc(fm.school)}` : level;

    const row = (label, value) =>
      value === undefined || value === null || value === ""
        ? ""
        : `<div class="wands-spell-row"><span class="wands-spell-key">${esc(label)}</span>`
          + `<span class="wands-spell-val">${esc(value)}</span></div>`;

    const tags = [];
    if (fm.concentration) tags.push("Concentration");
    if (fm.ritual) tags.push("Ritual");
    const tagHtml = tags.length
      ? `<div class="wands-spell-tags">${tags.map((t) => `<span class="wands-spell-tag">${esc(t)}</span>`).join("")}</div>`
      : "";

    return {
      html:
        `<div class="wands-spell-card">`
        + `<div class="wands-spell-head">${head}</div>`
        + row("Casting Time", fm.casting_time)
        + row("Range", fm.range)
        + row("Components", fm.components)
        + row("Duration", fm.duration)
        + tagHtml
        + `</div>`,
    };
  },
};

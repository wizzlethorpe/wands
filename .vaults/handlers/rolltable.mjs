// `rolltable` code-block handler: render a RollTable defined in this page's
// frontmatter as an HTML table, so the wiki page isn't blank. Companion to
// `foundry.base: RollTable` — the same `foundry.data.results[]` block produces
// both a real Foundry RollTable (on sync / compile) and the wiki rendering,
// with no duplicated content. Adapted from the spellcraft vault's handler.
//
// Usage:
//
//   ```rolltable
//   foundry.data
//   ```
//
// The fence body is a dot-path into frontmatter resolving to
// `{ formula?, description?, results: [{ range?, text|name }] }`. The formula
// re-pipes through the built-in `dice:` handler so it's a clickable button.

export const handler = {
  codeBlock: "rolltable",
  assets: {
    // Wiki-only: Foundry shows its own RollTable UI, so the styling would be
    // redundant inside synced journal pages.
    styles: ["./rolltable.css"],
  },
  render(content, ctx) {
    const path = content.trim() || "foundry.data";
    const data = lookup(ctx.frontmatter, path);
    if (!data || typeof data !== "object" || Array.isArray(data)) return missing(path);
    const results = Array.isArray(data.results) ? data.results : [];
    if (results.length === 0) return missing(`${path}.results (empty)`);
    const formula = typeof data.formula === "string" ? data.formula : "";
    const description = typeof data.description === "string" ? data.description : "";

    const rows = results.map((r) => {
      const range = formatRange(r?.range);
      const text = r?.text ?? r?.name ?? r?.description ?? "";
      return `<tr><td class="rolltable-roll">${ctx.escape(range)}</td><td>${ctx.escape(String(text))}</td></tr>`;
    }).join("");

    const captionParts = [];
    if (formula) captionParts.push(`**Roll \`dice: ${formula}\`**`);
    if (description) captionParts.push(description);
    const caption = captionParts.length ? captionParts.join(" — ") + "\n\n" : "";

    return {
      markdown: `${caption}<table class="rolltable"><thead><tr><th>Roll</th><th>Result</th></tr></thead><tbody>${rows}</tbody></table>\n`,
    };
  },
};

function missing(key) {
  return { html: `<code class="fm-missing" title="rolltable data not found">{{rolltable: ${key}}}</code>` };
}

function lookup(root, path) {
  let cur = root;
  for (const seg of path.split(".")) {
    if (cur == null || typeof cur !== "object") return undefined;
    cur = cur[seg];
  }
  return cur;
}

function formatRange(range) {
  if (Array.isArray(range) && range.length === 2 && Number.isFinite(+range[0]) && Number.isFinite(+range[1])) {
    return +range[0] === +range[1] ? String(+range[0]) : `${+range[0]}–${+range[1]}`;
  }
  return "";
}

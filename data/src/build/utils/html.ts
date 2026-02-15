import type { LinkResolver } from "./link-resolver.js";

// ---------------------------------------------------------------------------
// Markdown → HTML (for Foundry build)
// ---------------------------------------------------------------------------

/**
 * Convert markdown description text to Foundry-compatible HTML.
 * Resolves [[Wikilinks]] to @UUID references and converts formatting.
 */
export function markdownToHtml(
  md: string,
  linkResolver: LinkResolver,
): string {
  if (!md) return "";

  // Step 1: Resolve wikilinks BEFORE any other processing.
  // [[/r d20]] and similar roll macros pass through unchanged.
  // [[Display Name]] becomes @UUID[...]{Display Name} via the resolver.
  let text = md.replace(/\[\[([^\]]+)\]\]/g, (_match, inner: string) => {
    // Roll macros: [[/r d20]], [[/r 2d8]], etc. — pass through for Foundry
    if (inner.startsWith("/")) return `[[${inner}]]`;
    // Try to resolve as entity link
    const uuid = linkResolver(inner);
    if (uuid) return uuid;
    // Unresolved — keep as plain text
    return inner;
  });

  // Step 2: Process block-level elements by splitting on double-newlines
  const blocks = text.split(/\n{2,}/);
  const htmlBlocks: string[] = [];

  let i = 0;
  while (i < blocks.length) {
    const block = blocks[i].trim();
    if (!block) { i++; continue; }

    // Markdown table (starts with |)
    if (block.startsWith("|")) {
      htmlBlocks.push(convertMarkdownTable(block));
      i++;
      continue;
    }

    // Heading
    const headingMatch = block.match(/^(#{1,6})\s+(.*)/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const content = inlineFormat(headingMatch[2]);
      htmlBlocks.push(`<h${level}>${content}</h${level}>`);
      i++;
      continue;
    }

    // Unordered list (lines starting with - )
    if (block.match(/^- /m)) {
      const items = block.split(/\n/).filter((l) => l.trim());
      const lis = items
        .map((l) => l.replace(/^-\s*/, ""))
        .map((l) => `<li>${inlineFormat(l)}</li>`)
        .join("");
      htmlBlocks.push(`<ul>${lis}</ul>`);
      i++;
      continue;
    }

    // Ordered list (lines starting with 1. 2. etc.)
    if (block.match(/^\d+\.\s/m)) {
      const items = block.split(/\n/).filter((l) => l.trim());
      const lis = items
        .map((l) => l.replace(/^\d+\.\s*/, ""))
        .map((l) => `<li>${inlineFormat(l)}</li>`)
        .join("");
      htmlBlocks.push(`<ol>${lis}</ol>`);
      i++;
      continue;
    }

    // Horizontal rule
    if (block.match(/^-{3,}$/)) {
      htmlBlocks.push("<hr/>");
      i++;
      continue;
    }

    // Regular paragraph — may contain single newlines (treat as <br>)
    const lines = block.split("\n").map((l) => inlineFormat(l));
    htmlBlocks.push(`<p>${lines.join("<br/>")}</p>`);
    i++;
  }

  return htmlBlocks.join("");
}

/** Convert inline markdown formatting to HTML */
function inlineFormat(text: string): string {
  return (
    text
      // Bold: **text**
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      // Italic: *text*
      .replace(/\*([^*]+)\*/g, "<em>$1</em>")
  );
}

/** Convert a markdown table block to an HTML table */
function convertMarkdownTable(block: string): string {
  const lines = block.split("\n").filter((l) => l.trim());
  if (lines.length < 2) return `<p>${block}</p>`;

  const parseRow = (line: string): string[] =>
    line
      .split("|")
      .slice(1, -1) // remove empty first/last from leading/trailing |
      .map((c) => c.trim());

  const headerCells = parseRow(lines[0]);
  // lines[1] is the separator (| --- | --- |), skip it
  const bodyRows = lines.slice(2).map(parseRow);

  const headerHtml = headerCells
    .map((c) => `<td><strong>${inlineFormat(c)}</strong></td>`)
    .join("");
  const bodyHtml = bodyRows
    .map((row) => `<tr>${row.map((c) => `<td>${inlineFormat(c)}</td>`).join("")}</tr>`)
    .join("");

  return `<table><thead><tr>${headerHtml}</tr></thead><tbody>${bodyHtml}</tbody></table>`;
}

// ---------------------------------------------------------------------------
// HTML → Markdown (for Quartz build)
// ---------------------------------------------------------------------------

/** Convert Foundry HTML descriptions to markdown */
export function htmlToMarkdown(html: string): string {
  if (!html) return "";

  return (
    html
      // Remove secret sections
      .replace(/<section class="secret">[\s\S]*?<\/section>/gi, "")
      // Convert Foundry references to wikilinks
      .replace(/@UUID\[([^\]]+)\]\{([^}]+)\}/g, "[[$2]]")
      .replace(/@Compendium\[([^\]]+)\]\{([^}]+)\}/g, "[[$2]]")
      // Convert HTML tables
      .replace(/<table[\s\S]*?<\/table>/gi, (match) => convertHtmlTable(match))
      // Convert HTML lists
      .replace(/<ol>/gi, "")
      .replace(/<\/ol>/gi, "")
      .replace(/<ul>/gi, "")
      .replace(/<\/ul>/gi, "")
      .replace(/<li>/gi, "- ")
      .replace(/<\/li>/gi, "\n")
      // Convert headings
      .replace(/<h1[^>]*>/gi, "# ")
      .replace(/<\/h1>/gi, "\n")
      .replace(/<h2[^>]*>/gi, "## ")
      .replace(/<\/h2>/gi, "\n")
      .replace(/<h3[^>]*>/gi, "### ")
      .replace(/<\/h3>/gi, "\n")
      // Convert HTML formatting
      .replace(/<strong>/gi, "**")
      .replace(/<\/strong>/gi, "**")
      .replace(/<em>/gi, "*")
      .replace(/<\/em>/gi, "*")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>\s*<p>/gi, "\n\n")
      .replace(/<p>/gi, "")
      .replace(/<\/p>/gi, "\n\n")
      // Remove remaining HTML tags
      .replace(/<[^>]+>/g, "")
      // Decode HTML entities
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      // Clean up whitespace
      .replace(/\n{3,}/g, "\n\n")
      .trim()
  );
}

/** Very basic HTML table → markdown table converter */
function convertHtmlTable(html: string): string {
  const rows: string[][] = [];
  const rowMatches = html.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi);
  for (const m of rowMatches) {
    const cells: string[] = [];
    const cellMatches = m[1].matchAll(/<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/gi);
    for (const c of cellMatches) {
      cells.push(c[1].replace(/<[^>]+>/g, "").trim());
    }
    rows.push(cells);
  }
  if (rows.length === 0) return "";

  const lines: string[] = [];
  const header = rows[0];
  lines.push("| " + header.join(" | ") + " |");
  lines.push("| " + header.map(() => "---").join(" | ") + " |");
  for (let i = 1; i < rows.length; i++) {
    lines.push("| " + rows[i].join(" | ") + " |");
  }
  return "\n" + lines.join("\n") + "\n";
}

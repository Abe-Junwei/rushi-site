/** Wrap each H2 and its following siblings into a foldable section. */
export function wrapDocSections(html: string, options?: { openFirst?: boolean }): string {
  const openFirst = options?.openFirst ?? true;
  const parts = html.split(/(?=<h2[\s>])/i);
  if (parts.length < 2) return html;

  const intro = parts[0];
  const sections = parts.slice(1).map((part, index) => {
    const match = part.match(/^<h2([^>]*)>([\s\S]*?)<\/h2>/i);
    if (!match) return part;

    const attrs = match[1] ?? "";
    const titleHtml = match[2] ?? "";
    const body = part.slice(match[0].length).trim();
    const idMatch = attrs.match(/\sid=["']([^"']+)["']/i);
    const idAttr = idMatch ? ` id="${idMatch[1]}"` : "";
    const openAttr = openFirst && index === 0 ? " open" : "";

    return [
      `<details class="doc-section"${openAttr}${idAttr}>`,
      `<summary class="doc-section-summary">`,
      `<span class="doc-section-title">${titleHtml}</span>`,
      `<span class="doc-section-chevron" aria-hidden="true"></span>`,
      `</summary>`,
      `<div class="doc-section-body">${body}</div>`,
      `</details>`,
    ].join("");
  });

  return `${intro}${sections.join("")}`;
}

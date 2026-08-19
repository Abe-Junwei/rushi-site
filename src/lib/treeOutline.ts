const MAX_DEPTH = 20;

export type OutlineLine = { depth: number; label: string };

export type OutlineNode = {
  label: string;
  depth: number;
  children: OutlineNode[];
};

function resolveMark(charMark: string): string {
  const mark = charMark.charAt(0);
  return mark && mark.trim() ? mark : "#";
}

function countLeadingMarks(line: string, mark: string): number {
  let i = 0;
  while (i < line.length && line[i] === mark) i += 1;
  return i;
}

function stripLeadingMarks(line: string, mark: string): string {
  const trimmed = line.trim();
  let i = 0;
  while (i < trimmed.length && trimmed[i] === mark) i += 1;
  return stripBullet(trimmed.slice(i).trim());
}

function stripBullet(label: string): string {
  return label.replace(/^[-*+]\s+/, "");
}

function leadingWhitespace(line: string): number {
  let width = 0;
  for (const ch of line) {
    if (ch === " ") width += 1;
    else if (ch === "\t" || ch === "\u3000") width += 2;
    else break;
  }
  return width;
}

function isOutlineComment(line: string): boolean {
  const trimmed = line.trim();
  return trimmed.startsWith("%%") || trimmed.startsWith("//") || trimmed.startsWith("<!--");
}

/** 全角井号常被中文输入法打出，按行首标记处理。 */
function normalizeFullwidthHashes(line: string, mark: string): string {
  if (mark !== "#") return line;
  return line.replace(/^(\s*)(＃+)/u, (_all, ws: string, marks: string) => `${ws}${"#".repeat(marks.length)}`);
}

function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    const next = x % y;
    x = y;
    y = next;
  }
  return x || 1;
}

function fillSkippedLevels(raw: OutlineLine[]): { lines: OutlineLine[]; filled: number } {
  const lines: OutlineLine[] = [];
  let previous = 0;
  let filled = 0;
  for (const item of raw) {
    const start = previous === 0 ? 1 : previous + 1;
    for (let depth = start; depth < item.depth; depth += 1) {
      lines.push({ depth, label: "" });
      filled += 1;
    }
    lines.push(item);
    previous = item.depth;
  }
  return { lines, filled };
}

export function parseOutline(
  inputText: string,
  charMark = "#",
): { lines: OutlineLine[]; warnings: string[] } {
  const mark = resolveMark(charMark);
  const warnings: string[] = [];
  const physical = inputText
    .replace(/^\uFEFF/, "")
    .split(/\r\n|\n|\r/)
    .map((line) => normalizeFullwidthHashes(line.replace(/\uFEFF/g, "").replace(/\s+$/, ""), mark))
    .filter((line) => line.trim() && !isOutlineComment(line));
  if (physical[0]?.trim() === "mindmap") physical.shift();

  if (!physical.length) {
    return { lines: [], warnings: ["没有可解析的大纲行。"] };
  }

  // 只看顶格标记，避免缩进大纲里的「# 不是标题」把整篇切成 Markdown。
  const usesMarks = physical.some((line) => line.startsWith(mark));
  const raw: OutlineLine[] = [];
  let unmarked = 0;
  let clamped = 0;

  if (usesMarks) {
    for (const line of physical) {
      const trimmed = line.trim();
      let depth = countLeadingMarks(trimmed, mark);
      if (depth === 0) {
        depth = 1;
        unmarked += 1;
      }
      if (depth > MAX_DEPTH) {
        depth = MAX_DEPTH;
        clamped += 1;
      }
      raw.push({ depth, label: stripLeadingMarks(trimmed, mark) });
    }
  } else {
    const widths = physical.map(leadingWhitespace);
    const nonzero = widths.filter((width) => width > 0);
    const unit = nonzero.reduce((acc, width) => gcd(acc, width), nonzero[0] ?? 2);
    const minWidth = Math.min(...widths, 0);
    const mixedIndent = nonzero.some((width) => width % 2 === 1) && nonzero.some((width) => width % 2 === 0);
    if (mixedIndent) {
      warnings.push("缩进空格数不一致，层级可能被拆得过细。");
    }
    for (const line of physical) {
      let depth = 1 + Math.round((leadingWhitespace(line) - minWidth) / unit);
      if (depth < 1) depth = 1;
      if (depth > MAX_DEPTH) {
        depth = MAX_DEPTH;
        clamped += 1;
      }
      raw.push({ depth, label: stripBullet(line.trim()) });
    }
  }

  const emptyLabels = raw.filter((item) => !item.label).length;
  const { lines, filled } = fillSkippedLevels(raw);
  if (filled) warnings.push(`已补齐 ${filled} 处跳级，按连续层级生成。`);
  if (unmarked) warnings.push(`有 ${unmarked} 行没有标记，已按第 1 层处理。`);
  if (clamped) warnings.push(`有 ${clamped} 行超过 ${MAX_DEPTH} 层，已截到第 ${MAX_DEPTH} 层。`);
  if (emptyLabels) warnings.push(`有 ${emptyLabels} 行标题为空，对应位置会只显示连接线。`);
  return { lines, warnings };
}

export function buildOutlineTree(lines: OutlineLine[]): OutlineNode[] {
  const roots: OutlineNode[] = [];
  const stack: OutlineNode[] = [];
  for (const line of lines) {
    const node: OutlineNode = { label: line.label, depth: line.depth, children: [] };
    while (stack.length && stack[stack.length - 1].depth >= line.depth) stack.pop();
    if (!stack.length) roots.push(node);
    else stack[stack.length - 1].children.push(node);
    stack.push(node);
  }
  return roots;
}

function walkVisible(
  nodes: OutlineNode[],
  visit: (node: OutlineNode, prefix: string, isLast: boolean, isRoot: boolean, depth: number) => void,
  prefix = "",
  isRoot = true,
  depth = 1,
) {
  const visible = nodes.flatMap((node) =>
    node.label === "" && node.children.length ? node.children : [node],
  );
  visible.forEach((node, index) => {
    const isLast = index === visible.length - 1;
    visit(node, prefix, isLast, isRoot, depth);
    const nextPrefix = isRoot ? "" : `${prefix}${isLast ? "\u3000" : "│\u3000"}`;
    if (node.children.length) walkVisible(node.children, visit, nextPrefix, false, depth + 1);
  });
}

export function renderClassicTree(lines: OutlineLine[], ascii = false): string {
  const rows: string[] = [];
  walkVisible(buildOutlineTree(lines), (node, prefix, isLast, isRoot) => {
    if (ascii) {
      const branch = isRoot ? "" : isLast ? "`-- " : "|-- ";
      const asciiPrefix = prefix.replace(/│\u3000/g, "|   ").replace(/\u3000/g, "    ");
      rows.push(`${asciiPrefix}${branch}${node.label}`);
      return;
    }
    const branch = isRoot ? "" : isLast ? "└─" : "├─";
    rows.push(`${prefix}${branch}${node.label}`);
  });
  return rows.join("\n");
}

function mermaidSafe(label: string): string {
  const trimmed = (label.trim() || "（空）").replace(/\s+/g, " ");
  const cleaned = trimmed.replace(/"/g, "”");
  if (/[[\]{}()#"]/.test(trimmed)) return `"${cleaned}"`;
  return cleaned;
}

export function toMermaidMindmap(lines: OutlineLine[]): string {
  const rows = ["mindmap"];
  walkVisible(buildOutlineTree(lines), (node, _prefix, _isLast, _isRoot, depth) => {
    rows.push(`${"  ".repeat(depth)}${mermaidSafe(node.label)}`);
  });
  return rows.join("\n");
}

function latexSafe(label: string): string {
  return (label.trim() || "（空）")
    .replace(/\\/g, "\\textbackslash{}")
    .replace(/([{}$&#_])/g, "\\$1")
    .replace(/~/g, "\\textasciitilde{}")
    .replace(/%/g, "\\%");
}

function forestSafe(label: string): string {
  return latexSafe(label).replace(/\[/g, "{[}").replace(/\]/g, "{]}");
}

export function toLatexForest(lines: OutlineLine[]): string {
  function emit(nodes: OutlineNode[], indent: string): string {
    return nodes
      .flatMap((node) => {
        const visible = node.label === "" && node.children.length ? node.children : [node];
        return visible.map((item) => {
          const inner = item.children.length ? `\n${emit(item.children, `${indent}  `)}\n${indent}` : "";
          return `${indent}[${forestSafe(item.label)}${inner}]`;
        });
      })
      .join("\n");
  }
  return `\\begin{forest}\n${emit(buildOutlineTree(lines), "  ")}\n\\end{forest}`;
}

function dirtreeSafe(label: string): string {
  const safe = latexSafe(label);
  return /[.]/.test(safe) ? `{${safe}}` : safe;
}

export function toLatexDirtree(lines: OutlineLine[]): string {
  const rows = ["\\dirtree{%"];
  walkVisible(buildOutlineTree(lines), (node, _prefix, _isLast, _isRoot, depth) => {
    rows.push(`.${depth} ${dirtreeSafe(node.label)}.`);
  });
  rows.push("}");
  return rows.join("\n");
}

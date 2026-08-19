import {
  parseOutline,
  renderClassicTree,
  toLatexDirtree,
  toLatexForest,
  toMermaidMindmap,
} from "./treeOutline.ts";

const SPECIAL_FULLWIDTH_CHARS = ["│", "└", "┼", "─", "┌", "┬", "┤", "├"];
const BOX_CHARS = new Set(SPECIAL_FULLWIDTH_CHARS);
const IDEOGRAPHIC_SPACE = "\u3000";
const MAX_DEPTH = 20;

type TreeNode = [row: number, depth: number, text: string, path: number[]];

export type TreeLayout = "compact" | "wide" | "outline";
export type TreeExportFormat = "preview" | "mermaid" | "forest" | "dirtree" | "ascii";

export type ConvertTreeOptions = {
  layout?: TreeLayout;
};

export type ConvertTreeResult = {
  text: string;
  html: string;
  warnings: string[];
};

export const DEFAULT_TREE_SAMPLE = `# 神经系统
## 中枢神经系统
### 脑
#### 端脑
#### 间脑
#### 小脑
#### 脑干
##### 中脑
##### 脑桥
##### 延髓
### 脊髓
#### 颈髓
#### 胸髓
#### 腰髓
#### 骶髓
#### 尾髓
## 周围神经系统
### 脑神经
### 脊神经
### 内脏神经系统
#### 交感神经
#### 副交感神经`;

function isIgnorableWidthChar(ch: string): boolean {
  const cp = ch.codePointAt(0);
  if (cp === undefined) return false;
  return cp === 0xfe0f || cp === 0x200d || (cp >= 0x1f3fb && cp <= 0x1f3ff);
}

export function getDisplayWidth(str: string): number {
  return [...str].reduce((acc, ch) => {
    if (isIgnorableWidthChar(ch)) return acc;
    return acc + (isFullwidthChar(ch) ? 2 : 1);
  }, 0);
}

function isFullwidthChar(ch: string): boolean {
  const cp = ch.codePointAt(0);
  if (cp === undefined) return false;
  if (SPECIAL_FULLWIDTH_CHARS.includes(ch)) return true;
  if (cp >= 0xff61 && cp <= 0xffdc) return false;
  return (
    (cp >= 0xff00 && cp <= 0xffef) ||
    (cp >= 0x3000 && cp <= 0x303f) ||
    (cp >= 0x3040 && cp <= 0x30ff) ||
    (cp >= 0x31f0 && cp <= 0x31ff) ||
    (cp >= 0x3400 && cp <= 0x4dbf) ||
    (cp >= 0x4e00 && cp <= 0x9fff) ||
    (cp >= 0xac00 && cp <= 0xd7af) ||
    (cp >= 0xf900 && cp <= 0xfaff)
  );
}

function getFullwidthCount(str: string): number {
  return [...str].reduce((acc, ch) => {
    if (isIgnorableWidthChar(ch)) return acc;
    return acc + (isFullwidthChar(ch) ? 1 : 0);
  }, 0);
}

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function arraysEqual(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function packLeadingSpaces(line: string): string {
  let i = 0;
  while (i < line.length && line[i] === " ") i += 1;
  if (i === 0) return line;
  return `${IDEOGRAPHIC_SPACE.repeat(Math.floor(i / 2))}${" ".repeat(i % 2)}${line.slice(i)}`;
}

function evenWidth(width: number): number {
  return width % 2 === 1 ? width + 1 : width;
}

function padOddDisplayWidth(text: string): string {
  if (text === "│" || text === "┤") return text;
  return getDisplayWidth(text) % 2 === 1 ? `${text} ` : text;
}

function padToDisplayWidth(text: string, width: number): string {
  if (text === "│" || text === "┤") return text;
  let out = text;
  let current = getDisplayWidth(out);
  while (current + 2 <= width) {
    out += "─";
    current += 2;
  }
  if (current < width) {
    out += " ";
    current += 1;
  }
  return out;
}

function wrapHtml(text: string): string {
  if (!text) return "";
  let html = "";
  for (const ch of text) {
    if (ch === "\n") {
      html += "\n";
      continue;
    }
    if (isIgnorableWidthChar(ch)) continue;
    const classes = [isFullwidthChar(ch) ? "tree-cell-fw" : "tree-cell-hw"];
    if (BOX_CHARS.has(ch)) classes.push("tab-symbol");
    html += `<span class="${classes.join(" ")}">${escapeHtml(ch)}</span>`;
  }
  return html;
}

export function convertTree(
  inputText: string,
  charMark = "#",
  options: ConvertTreeOptions = {},
): ConvertTreeResult {
  if (!inputText.trim()) return { text: "", html: "", warnings: [] };

  const layout = options.layout ?? "compact";
  const mark = charMark.charAt(0)?.trim() ? charMark.charAt(0) : "#";
  const { lines, warnings } = parseOutline(inputText, mark);
  if (!lines.length) return { text: "", html: "", warnings };
  if (layout === "outline") {
    const text = renderClassicTree(lines);
    return { text, html: wrapHtml(text), warnings };
  }
  const tree = Array<number>(MAX_DEPTH + 2).fill(0);
  let treeCursor = 0;
  const nodes: TreeNode[] = [];
  const current: TreeNode = [0, 0, "", []];
  let row = 0;
  let depth = 1;
  let maxDepth = 1;
  let maxRow = 1;

  function getFather(node: TreeNode): TreeNode | [] {
    const fatherPath = node[3].map((value, index) => (index === node[1] - 1 ? 0 : value));
    if (fatherPath[0] === 0) return [];
    return nodes.find((candidate) => arraysEqual(candidate[3], fatherPath)) || [];
  }

  function sumAncestorWidths(node: TreeNode | []): number {
    if (!node.length) return 0;
    return getDisplayWidth(node[2]) + sumAncestorWidths(getFather(node));
  }

  function sameFather(a: TreeNode, b: TreeNode): boolean {
    return arraysEqual(getFather(a), getFather(b));
  }

  function isUnder(node: TreeNode, ancestor: TreeNode): boolean {
    let current: TreeNode | [] = node;
    while (current.length) {
      const father = getFather(current);
      if (!father.length) return false;
      if (father === ancestor) return true;
      current = father;
    }
    return false;
  }

  function subtreeEnd(node: TreeNode): number {
    let end = node[0];
    for (const other of nodes) {
      if (other[0] > end && isUnder(other, node)) end = other[0];
    }
    return end;
  }

  function insertRowAfter(row: number) {
    for (const node of nodes) {
      if (node[0] > row) node[0] += 1;
    }
    maxRow += 1;
  }

  function tablelizeGroup(group: TreeNode[]) {
    let spacerRow: number | null = null;
    if (group.length > 1 && group.length % 2 === 0) {
      const endLeft = subtreeEnd(group[group.length / 2 - 1]);
      insertRowAfter(endLeft);
      spacerRow = endLeft + 1;
    }

    const start = group[0][0];
    const end = group[group.length - 1][0];
    const col = group[0][1];

    for (let i = start; i <= end; i += 1) {
      const existing = group.find((node) => node[0] === i);
      if (!existing) {
        nodes.push([i, col, "│", deepClone(group[0][3])]);
      } else {
        existing[2] = `├─${existing[2]}`;
      }
    }

    const last = group.length - 1;
    const mid = spacerRow ?? Math.floor((start + end) / 2);
    const midNodes = nodes.filter((node) => node[0] === mid && node[1] === col);

    if (group.length === 1) {
      group[0][2] = `──${group[0][2].slice(2)}`;
    } else {
      group[last][2] = `└${group[last][2].slice(1)}`;
      group[0][2] = `┌${group[0][2].slice(1)}`;
      if (midNodes[0] === group[0]) {
        group[0][2] = `┬${group[0][2].slice(1)}`;
      } else if (midNodes[0]?.[2] === "│") {
        midNodes[0][2] = "┤";
      } else if (midNodes[0]) {
        midNodes[0][2] = `┼${midNodes[0][2].slice(1)}`;
      }
    }

    const father = getFather(group[0]);
    if (father.length && midNodes[0]) father[0] = midNodes[0][0];
  }

  for (const line of lines) {
    const previousDepth = depth;
    depth = line.depth;
    const depthDelta = depth - previousDepth;
    current[2] = line.label;
    if (depthDelta <= 0) row += 1;
    current[0] = row;
    current[1] = depth;
    treeCursor += depthDelta;
    if (treeCursor < 0) treeCursor = 0;
    if (treeCursor >= tree.length) treeCursor = tree.length - 1;
    tree[treeCursor] += 1;
    for (let i = treeCursor; i < tree.length - 1; i += 1) tree[i + 1] = 0;
    current[3] = deepClone(tree);
    nodes.push(deepClone(current));
    if (depth >= maxDepth) maxDepth = depth;
    if (row >= maxRow) maxRow = current[0];
  }

  const nodeCount = nodes.length;
  for (let d = maxDepth; d > 1; d -= 1) {
    let r = 1;
    while (r <= nodeCount) {
      if (nodes[r - 1][1] === d) {
        let j = 1;
        const group = [nodes[r - 1]];
        while (r + j <= nodeCount) {
          if (nodes[r + j - 1][1] === d) {
            if (sameFather(nodes[r + j - 1], nodes[r - 1])) group.push(nodes[r + j - 1]);
            else break;
          }
          j += 1;
        }
        tablelizeGroup(group);
        r += j;
      } else {
        r += 1;
      }
    }
  }

  for (const node of nodes) node[2] = padOddDisplayWidth(node[2]);

  const columnWidths = Array<number>(maxDepth + 1).fill(0);
  for (const node of nodes) {
    columnWidths[node[1]] = Math.max(columnWidths[node[1]], getDisplayWidth(node[2]));
  }
  for (let d = 1; d <= maxDepth; d += 1) columnWidths[d] = evenWidth(columnWidths[d]);

  function wideAncestorWidth(depthValue: number): number {
    let width = 0;
    for (let d = 1; d < depthValue; d += 1) width += columnWidths[d];
    return width;
  }

  const rows: string[] = [];
  for (let i = 1; i <= maxRow; i += 1) {
    const cells: string[] = [];
    for (let j = 1; j <= maxDepth; j += 1) {
      const matches = nodes.filter((node) => node[0] === i && node[1] === j);
      if (!matches.length) continue;
      const rawText = matches[0][2];
      const continuesRight = nodes.some((node) => node[0] === i && node[1] > j);
      const text =
        layout === "wide" && continuesRight
          ? padToDisplayWidth(rawText, columnWidths[j])
          : rawText;
      const startDisplay =
        layout === "wide" ? wideAncestorWidth(j) : sumAncestorWidths(getFather(matches[0]));
      let start = startDisplay - getFullwidthCount(cells.join(""));
      if (start < 0) start = 0;
      while (cells.length < start + text.length) cells.push(" ");
      for (let k = 0; k < text.length; k += 1) cells[start + k] = text[k];
    }
    rows.push(packLeadingSpaces(cells.join("").replace(/\s+$/, "")));
  }

  const text = rows.join("\n");
  return { text, html: wrapHtml(text), warnings };
}

export function convertToTableText(
  inputText: string,
  charMark = "#",
  options: ConvertTreeOptions = {},
): string {
  return convertTree(inputText, charMark, options).text;
}

export function convertToTableHtml(
  inputText: string,
  charMark = "#",
  options: ConvertTreeOptions = {},
): string {
  return convertTree(inputText, charMark, options).html;
}

export function exportTreeText(
  inputText: string,
  charMark = "#",
  format: TreeExportFormat = "preview",
  layout: TreeLayout = "compact",
): string {
  if (format === "preview") return convertTree(inputText, charMark, { layout }).text;
  const { lines } = parseOutline(inputText, charMark);
  if (format === "ascii") return renderClassicTree(lines, true);
  if (format === "mermaid") return toMermaidMindmap(lines);
  if (format === "forest") return toLatexForest(lines);
  return toLatexDirtree(lines);
}

export type PreviewMode = "grid" | "code";

export type PreviewTreeResult = ConvertTreeResult & { mode: PreviewMode };

export function previewTree(
  inputText: string,
  charMark = "#",
  format: TreeExportFormat = "preview",
  layout: TreeLayout = "compact",
): PreviewTreeResult {
  const table = convertTree(inputText, charMark, { layout });
  if (format === "preview") return { ...table, mode: "grid" };
  return {
    text: exportTreeText(inputText, charMark, format, layout),
    html: "",
    warnings: table.warnings,
    mode: "code",
  };
}

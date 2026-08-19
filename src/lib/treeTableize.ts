import {
  parseOutline,
  renderClassicTree,
  toLatexDirtree,
  toLatexForest,
  toMermaidMindmap,
} from "./treeOutline.ts";

const SPECIAL_FULLWIDTH_CHARS = ["│", "└", "┼", "─", "┌", "┬", "┤", "├"];
const BOX_CHAR_PATTERN = /(│|└|┼|─|┌|┬|┤|├)/g;
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

export const DEFAULT_TREE_SAMPLE = `# 寒假集训课纲
## 第一讲 导论
### 问题意识
### 文献地图
#### 中文研究
#### 英文研究
## 第二讲 方法
### 材料整理
#### 录音转写
#### 术语表
### 论证结构
#### 主张与限定
#### 反例与回应
## 第三讲 写作
### 段落推进
### 引文与注释
## 附录
### 参考书目
### 作业节点`;

export function getDisplayWidth(str: string): number {
  return [...str].reduce((acc, ch) => acc + (isFullwidthChar(ch) ? 2 : 1), 0);
}

function isFullwidthChar(ch: string): boolean {
  const cp = ch.codePointAt(0);
  if (cp === undefined) return false;
  return (
    (0xff00 <= cp && cp <= 0xffef) ||
    (0x3000 <= cp && cp <= 0x303f) ||
    (0x4e00 <= cp && cp <= 0x9fff) ||
    SPECIAL_FULLWIDTH_CHARS.includes(ch)
  );
}

function getFullwidthCount(str: string): number {
  return [...str].reduce((acc, ch) => acc + (isFullwidthChar(ch) ? 1 : 0), 0);
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
  return escapeHtml(text).replace(BOX_CHAR_PATTERN, '<span class="tab-symbol">$1</span>');
}

export function convertTree(
  inputText: string,
  charMark = "#",
  options: ConvertTreeOptions = {},
): ConvertTreeResult {
  if (!inputText.trim()) return { text: "", html: "", warnings: [] };

  const layout = options.layout ?? "compact";
  const mark = charMark.charAt(0) || "#";
  const { lines, warnings } = parseOutline(inputText, mark);
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

  function tablelizeGroup(group: TreeNode[]) {
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
    const mid = Math.floor((start + end) / 2);
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
      const text = layout === "wide" ? padToDisplayWidth(rawText, columnWidths[j]) : rawText;
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

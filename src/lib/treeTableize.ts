const SPECIAL_FULLWIDTH_CHARS = ["│", "└", "┼", "─", "┌", "┬", "┤", "├"];
const BOX_CHAR_PATTERN = /(│|└|┼|─|┌|┬|┤|├)/g;
const IDEOGRAPHIC_SPACE = "\u3000";

type TreeNode = [row: number, depth: number, text: string, path: number[]];

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

function getStringLength(str: string): number {
  return [...str].reduce((acc, ch) => acc + (isFullwidthChar(ch) ? 2 : 1), 0);
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

function countLeadingMarks(line: string, mark: string): number {
  let i = 0;
  while (i < line.length && line[i] === mark) i += 1;
  return i;
}

function stripLeadingMarks(line: string, mark: string): string {
  const trimmed = line.trim();
  let i = 0;
  while (i < trimmed.length && trimmed[i] === mark) i += 1;
  return trimmed.slice(i).trim();
}

function packLeadingSpaces(line: string): string {
  let i = 0;
  while (i < line.length && line[i] === " ") i += 1;
  if (i === 0) return line;
  return `${IDEOGRAPHIC_SPACE.repeat(Math.floor(i / 2))}${" ".repeat(i % 2)}${line.slice(i)}`;
}

export function convertToTableText(inputText: string, charMark = "#"): string {
  if (!inputText.trim()) return "";

  const mark = charMark.charAt(0) || "#";
  const lines = inputText.split(/\r?\n/).filter((line) => line.trim());
  const tree = Array<number>(50).fill(0);
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
    return getStringLength(node[2]) + sumAncestorWidths(getFather(node));
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
    depth = countLeadingMarks(line, mark);
    const depthDelta = depth - previousDepth;
    current[2] = stripLeadingMarks(line, mark);
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

  const rows: string[] = [];
  for (let i = 1; i <= maxRow; i += 1) {
    const cells: string[] = [];
    for (let j = 1; j <= maxDepth; j += 1) {
      const matches = nodes.filter((node) => node[0] === i && node[1] === j);
      if (!matches.length) continue;
      let start = sumAncestorWidths(getFather(matches[0])) - getFullwidthCount(cells.join(""));
      if (start < 0) start = 0;
      const text = matches[0][2];
      while (cells.length < start + text.length) cells.push(" ");
      for (let k = 0; k < text.length; k += 1) cells[start + k] = text[k];
    }
    rows.push(packLeadingSpaces(cells.join("").replace(/\s+$/, "")));
  }

  return rows.join("\n");
}

export function convertToTableHtml(inputText: string, charMark = "#"): string {
  const text = convertToTableText(inputText, charMark);
  if (!text) return "";
  return escapeHtml(text).replace(BOX_CHAR_PATTERN, '<span class="tab-symbol">$1</span>');
}

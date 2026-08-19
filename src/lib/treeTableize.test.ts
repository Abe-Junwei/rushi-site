import assert from "node:assert/strict";
import { test } from "node:test";
import { parseOutline } from "./treeOutline.ts";
import {
  convertToTableHtml,
  convertToTableText,
  convertTree,
  DEFAULT_TREE_SAMPLE,
  exportTreeText,
  getDisplayWidth,
  previewTree,
} from "./treeTableize.ts";

test("trims hash-and-space labels so the root is flush left", () => {
  const text = convertToTableText(
    `# 根节点
## 子节点1
### 子节点1.1
## 子节点2`,
  );
  assert.match(text, /根节点/);
  assert.doesNotMatch(text, / 根节点/);
});

test("uses boxed arms and ideographic leading spaces", () => {
  const text = convertToTableText(
    `# 根节点
## 子节点1
### 子节点1.1
## 子节点2`,
  );
  assert.match(text, /┌─子节点1\s*──子节点1\.1/);
  assert.match(text, /根节点┤/);
  assert.match(text, /└─子节点2/);
  assert.match(text, /\u3000└─/);
});

test("sample follows systematic anatomy and covers five heading levels", () => {
  const marks = DEFAULT_TREE_SAMPLE.split("\n").map((line) => line.match(/^#+/)?.[0].length ?? 0);
  assert.equal(Math.max(...marks), 5);
  assert.ok(DEFAULT_TREE_SAMPLE.split("\n").length >= 16);
  assert.match(DEFAULT_TREE_SAMPLE, /端脑/);
  assert.match(DEFAULT_TREE_SAMPLE, /中脑/);
  assert.match(DEFAULT_TREE_SAMPLE, /内脏神经系统/);
  assert.doesNotMatch(DEFAULT_TREE_SAMPLE, /大脑/);
  assert.doesNotMatch(DEFAULT_TREE_SAMPLE, /躯体神经系统[\s\S]*脑神经/);
  const text = convertToTableText(DEFAULT_TREE_SAMPLE);
  assert.match(text, /神经系统/);
  assert.match(text, /[┌┬└┼]/);
  assert.match(text, /\u3000/);
});

test("fills skipped heading levels and reports a warning", () => {
  const result = convertTree(`# 根节点
#### 深层`);
  assert.match(result.text, /深层/);
  assert.match(result.warnings[0] ?? "", /跳级/);
});

test("treats unmarked lines as depth 1", () => {
  const result = convertTree(`根节点
## 子节点`);
  assert.match(result.text, /根节点/);
  assert.match(result.text, /子节点/);
  assert.match(result.warnings[0] ?? "", /没有标记/);
});

test("centers a parent between an even number of children", () => {
  const two = convertToTableText(`# 根\n## 甲\n## 乙`);
  assert.equal(two, ["　┌─甲", "根┤", "　└─乙"].join("\n"));

  const four = convertToTableText(`# 根\n## 甲\n## 乙\n## 丙\n## 丁`);
  assert.match(four, /┌─甲/);
  assert.match(four, /├─乙/);
  assert.match(four, /^根┤/m);
  assert.match(four, /├─丙/);
  assert.match(four, /└─丁/);
  assert.doesNotMatch(four, /根┼/);
});

test("wide layout does not trail dashes after leaf labels", () => {
  const text = convertToTableText(DEFAULT_TREE_SAMPLE, "#", { layout: "wide" });
  assert.match(text, /脑─/);
  assert.doesNotMatch(text, /大脑─/);
  assert.doesNotMatch(text, /副交感神经─/);
});

test("wide layout aligns same-depth children to one column", () => {
  const text = convertToTableText(
    `# 父节点
## 短
### 甲
## 很长的标题
### 乙`,
    "#",
    { layout: "wide" },
  );
  const lines = text.split("\n");
  const jia = lines.find((line) => line.includes("甲"));
  const yi = lines.find((line) => line.includes("乙"));
  assert.ok(jia && yi);
  assert.equal(getDisplayWidth(jia.slice(0, jia.indexOf("甲"))), getDisplayWidth(yi.slice(0, yi.indexOf("乙"))));
});

test("outline layout uses a vertical tree like Unix tree", () => {
  const text = convertToTableText(DEFAULT_TREE_SAMPLE, "#", { layout: "outline" });
  assert.match(text, /^神经系统/m);
  assert.match(text, /├─中枢神经系统/);
  assert.match(text, /└─周围神经系统/);
  assert.doesNotMatch(text, /[┌┬┼]/);
});

test("accepts indented outlines and markdown bullets", () => {
  const text = convertToTableText(
    `根节点
  - 子节点
    - 叶子`,
    "#",
    { layout: "outline" },
  );
  assert.match(text, /^根节点/);
  assert.match(text, /└─子节点/);
  assert.match(text, /└─叶子/);
});

test("preview HTML uses fixed cells but copies as plain text", () => {
  const sample = DEFAULT_TREE_SAMPLE;
  const text = convertToTableText(sample, "#", { layout: "wide" });
  const html = convertToTableHtml(sample, "#", { layout: "wide" });
  assert.equal(html.replace(/<[^>]+>/g, ""), text);
  assert.match(html, /tree-cell-fw/);
  assert.match(html, /tab-symbol/);
});

test("exports mermaid, forest, dirtree and ascii", () => {
  const sample = `# 根
## 子`;
  assert.match(exportTreeText(sample, "#", "mermaid"), /mindmap\n {2}根\n {4}子/);
  assert.match(exportTreeText(sample, "#", "forest"), /\\begin\{forest\}[\s\S]*\[根[\s\S]*\[子\][\s\S]*\\end\{forest\}/);
  assert.match(exportTreeText(sample, "#", "dirtree"), /\\dirtree\{%\n\.1 根\.\n\.2 子\.\n\}/);
  assert.match(exportTreeText(sample, "#", "ascii"), /`-- 子/);
});

test("counts CJK kana hangul as fullwidth and halfwidth kana as narrow", () => {
  assert.equal(getDisplayWidth("あア한㐀"), 8);
  assert.equal(getDisplayWidth("ｱA"), 2);
  assert.equal(getDisplayWidth("中"), 2);
  assert.equal(getDisplayWidth("🧠\uFE0F"), 1);
});

test("does not treat an indented hash line as a document-wide markdown switch", () => {
  const text = convertToTableText(
    `根
  子
  # 不是标题`,
    "#",
    { layout: "outline" },
  );
  assert.match(text, /^根/m);
  assert.match(text, /不是标题/);
  assert.equal(parseOutline(`根\n  子\n  # 不是标题`).lines.length, 3);
  assert.equal(parseOutline(`根\n  子\n  # 不是标题`).lines[2]?.depth, 2);
});

test("skips comments, BOM, and lone CR line breaks", () => {
  const result = convertTree(`\uFEFF# 根\r%% 注释\r// also\r<!-- hide -->\r## 子`);
  assert.match(result.text, /根/);
  assert.match(result.text, /子/);
  assert.doesNotMatch(result.text, /注释/);
  assert.doesNotMatch(result.text, /also/);
});

test("warns on empty titles and comment-only input", () => {
  const empty = convertTree(`#\n## 子`);
  assert.match(empty.warnings.join(" "), /标题为空/);
  const comments = convertTree(`%% only\n// still`);
  assert.equal(comments.text, "");
  assert.match(comments.warnings.join(" "), /没有可解析/);
});

test("quotes mermaid labels that contain quotes and braces dirtree dots", () => {
  assert.match(exportTreeText(`# 他说"你好"`, "#", "mermaid"), /"他说”你好”"/);
  assert.match(exportTreeText(`# 结束.`, "#", "dirtree"), /\.1 \{结束\.\}\./);
});

test("accepts fullwidth hashes and ideographic indent", () => {
  const hashed = convertToTableText(`＃ 根\n＃＃ 子`, "#", { layout: "outline" });
  assert.match(hashed, /^根/m);
  assert.match(hashed, /└─子/);
  const indented = parseOutline(`根\n\u3000子`);
  assert.equal(indented.lines[0]?.depth, 1);
  assert.equal(indented.lines[1]?.depth, 2);
});

test("warns when indent widths mix odd and even spaces", () => {
  const result = parseOutline(`根\n 子\n  叶`);
  assert.match(result.warnings.join(" "), /缩进空格数不一致/);
});

test("falls back when the mark is only whitespace", () => {
  const text = convertToTableText(`# 根\n## 子`, " ");
  assert.match(text, /根/);
  assert.match(text, /子/);
});

test("preview HTML marks kana as fullwidth cells", () => {
  const html = convertToTableHtml(`# あ\n## 子`, "#", { layout: "outline" });
  assert.match(html, /tree-cell-fw">あ/);
});

test("previewTree keeps a glyph grid for current preview and plain text for exports", () => {
  const sample = `# 根
## 子`;
  const grid = previewTree(sample, "#", "preview", "wide");
  assert.equal(grid.mode, "grid");
  assert.match(grid.html, /tree-cell-fw/);
  assert.equal(grid.text, exportTreeText(sample, "#", "preview", "wide"));

  const mermaid = previewTree(sample, "#", "mermaid", "wide");
  assert.equal(mermaid.mode, "code");
  assert.equal(mermaid.html, "");
  assert.match(mermaid.text, /mindmap\n {2}根\n {4}子/);
  assert.deepEqual(mermaid.warnings, grid.warnings);
});



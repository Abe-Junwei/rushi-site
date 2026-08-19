import assert from "node:assert/strict";
import { test } from "node:test";
import {
  convertToTableText,
  convertTree,
  DEFAULT_TREE_SAMPLE,
  exportTreeText,
  getDisplayWidth,
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

test("sample covers four heading levels and several sibling groups", () => {
  const marks = DEFAULT_TREE_SAMPLE.split("\n").map((line) => line.match(/^#+/)?.[0].length ?? 0);
  assert.equal(Math.max(...marks), 4);
  assert.ok(DEFAULT_TREE_SAMPLE.split("\n").length >= 12);
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

test("exports mermaid, forest, dirtree and ascii", () => {
  const sample = `# 根
## 子`;
  assert.match(exportTreeText(sample, "#", "mermaid"), /mindmap\n {2}根\n {4}子/);
  assert.match(exportTreeText(sample, "#", "forest"), /\\begin\{forest\}[\s\S]*\[根[\s\S]*\[子\][\s\S]*\\end\{forest\}/);
  assert.match(exportTreeText(sample, "#", "dirtree"), /\\dirtree\{%\n\.1 根\.\n\.2 子\.\n\}/);
  assert.match(exportTreeText(sample, "#", "ascii"), /`-- 子/);
});



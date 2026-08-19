import assert from "node:assert/strict";
import { test } from "node:test";
import { convertToTableText, DEFAULT_TREE_SAMPLE } from "./treeTableize.ts";

test("trims hash-and-space labels so the root is flush left", () => {
  const text = convertToTableText(
    `# 根节点
## 子节点1
### 子节点1.1
## 子节点2`,
  );
  assert.match(text, /^根节点/);
  assert.doesNotMatch(text, /^ 根节点/);
});

test("uses boxed arms and ideographic leading spaces", () => {
  const text = convertToTableText(
    `# 根节点
## 子节点1
### 子节点1.1
## 子节点2`,
  );
  assert.match(text, /┬─子节点1──子节点1\.1/);
  assert.match(text, /└─子节点2/);
  assert.match(text, /\u3000└─/);
});

test("sample covers four heading levels and several sibling groups", () => {
  const marks = DEFAULT_TREE_SAMPLE.split("\n").map((line) => line.match(/^#+/)?.[0].length ?? 0);
  assert.equal(Math.max(...marks), 4);
  assert.ok(DEFAULT_TREE_SAMPLE.split("\n").length >= 12);
  const text = convertToTableText(DEFAULT_TREE_SAMPLE);
  assert.match(text, /寒假集训课纲/);
  assert.match(text, /[┌┬└┼]/);
  assert.match(text, /\u3000/);
});

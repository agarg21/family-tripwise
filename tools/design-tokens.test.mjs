import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { countRaw, cssPath, baselinePath } from "./design-tokens.mjs";

test("site/styles.css adds no raw colors or font sizes outside the :root tokens (design-system ratchet)", () => {
  const now = countRaw(readFileSync(cssPath, "utf8"));
  const base = JSON.parse(readFileSync(baselinePath, "utf8"));
  assert.ok(now.colors <= base.colors, `raw colors ${now.colors} > baseline ${base.colors}: use var(--c-*) tokens (docs/design/design-system.md)`);
  assert.ok(now.fontSizes <= base.fontSizes, `raw font sizes ${now.fontSizes} > baseline ${base.fontSizes}: use var(--t-*) tokens`);
});

test("countRaw ignores the :root block, comments and token references", () => {
  const css = ":root { --a: #fff; } /* #000 */ .x { color: var(--c-ink); font-size: var(--t-sm); } .y { color: #123456; font-size: 13px; background: rgba(0,0,0,.1); }";
  assert.deepEqual(countRaw(css), { colors: 2, fontSizes: 1 });
});

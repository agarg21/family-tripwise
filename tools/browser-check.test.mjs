import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { isFilled, headerStateProblems, sitemapPages } from "./browser-check.mjs";

const css = readFileSync(new URL("../site/styles.css", import.meta.url), "utf8");

test("a transparent background is not filled; a painted one is", () => {
  assert.equal(isFilled("rgba(0, 0, 0, 0)"), false);
  assert.equal(isFilled("transparent"), false);
  assert.equal(isFilled("rgb(18, 108, 103)"), true);
  assert.equal(isFilled("rgba(18, 108, 103, 0.5)"), true);
});

test("the header rule flags a filled button without aria-current and the reverse", () => {
  assert.deepEqual(headerStateProblems([{ text: "Deals", filled: false, current: false }, { text: "This week", filled: true, current: true }]), []);
  assert.match(headerStateProblems([{ text: "Deals", filled: true, current: false }])[0], /looks selected/);
  assert.match(headerStateProblems([{ text: "Deals", filled: false, current: true }])[0], /not filled/);
});

test("sitemap paths resolve, with the root as index.html", () => {
  assert.deepEqual(sitemapPages("<loc>https://familytripwise.com/</loc><loc>https://familytripwise.com/deals/</loc>"), ["index.html", "deals/"]);
});

test("only an aria-current or hovered header button gets a background in the stylesheet", () => {
  const rules = [...css.replace(/\/\*[\s\S]*?\*\//g, "").matchAll(/([^{}]+)\{([^{}]*)\}/g)];
  const header = rules.filter((r) => /\.header-(deals|this-week)(?![-\w])/.test(r[1]) && /background/.test(r[2]));
  assert.ok(header.length, "expected the header button rules");
  for (const [, selectors] of header) {
    for (const s of selectors.split(",").filter((x) => /\.header-(deals|this-week)(?![-\w])/.test(x))) {
      assert.match(s, /\[aria-current\]|:hover/, `background on a resting header button: ${s.trim()}`);
    }
  }
});

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const season = JSON.parse(readFileSync(new URL("./page-generation/black-friday.json", import.meta.url), "utf8"));
const page = (p) => readFileSync(new URL(`../site/deals/${p}`, import.meta.url), "utf8");

test("LEGOLAND Florida Black Friday sale is listed unpriced on the Black Friday page until Nov 29", () => {
  const u = season.unconfirmed.find((x) => /^LEGOLAND Florida/.test(x.operator));
  assert.equal(u.observed_on, "2026-11-20");
  assert.equal(u.list_until, "2026-11-29");
  assert.match(u.text, /\$49 a person .*they were from \$69 online on Nov 14/);
  assert.match(page("black-friday-family-travel-deals.html"), /<h3>LEGOLAND Florida, Winter Haven, FL<\/h3>/);
});

test("LEGOLAND Florida sale card is short lines and takes the regular-price pass row off the Black Friday page", () => {
  const u = season.unconfirmed.find((x) => /^LEGOLAND Florida/.test(x.operator));
  assert.deepEqual(u.supersedes, ["legoland-florida-annual-pass"]);
  for (const line of u.lines) assert.ok(line.split(/\s+/).length <= 36, line);
  const html = page("black-friday-family-travel-deals.html");
  assert.match(html, /Why no family total:/);
  assert.match(html, /built on \$69 tickets and \$179 passes \(Nov 14\), and both are now on sale/);
  assert.doesNotMatch(html, /≈ \$588/);
  assert.doesNotMatch(html, /id="legoland-florida-annual-pass"|href="\.\/legoland-florida-annual-pass\.html"/);
});

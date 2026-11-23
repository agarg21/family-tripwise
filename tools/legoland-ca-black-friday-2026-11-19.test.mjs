import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const raw = JSON.parse(readFileSync(new URL("./page-generation/deal-checks.json", import.meta.url), "utf8"));
const checks = Array.isArray(raw) ? raw : raw.checks;
const season = JSON.parse(readFileSync(new URL("./page-generation/black-friday.json", import.meta.url), "utf8"));
const page = (p) => readFileSync(new URL(`../site/deals/${p}`, import.meta.url), "utf8");

test("LEGOLAND California Black Friday sale (read Nov 19): annual pass page no longer says 'not a sale'", () => {
  const c = checks.find((x) => x.id === "legoland-california-annual-pass");
  const text = JSON.stringify(c.v2.catch) + JSON.stringify(c.v2.how) + JSON.stringify(c.v2.cons) + c.headline;
  assert.doesNotMatch(text, /not a sale|Not on sale/);
  assert.ok(c.v2.extra_sources.some((s) => /black-friday-sale/.test(s.url) && s.observed_on === "2026-11-19"));
  // Re-read Nov 21: the pass page and help article name the tier, Standard $139 (regularly $189), to Nov 29.
  assert.equal(c.observed_on, "2026-11-21");
  assert.equal(c.expires_on, "2026-11-29");
  assert.equal(c.deadline_stated, true);
  assert.equal(c.v2.spend_save.with.parts[0].unit_amount, 139);
  // The comparison uses the sale's $64 day tickets, not the Nov 14 $69, so the pass is not flattered.
  assert.equal(c.v2.spend_save.without.parts[0].unit_amount, 64);
  assert.doesNotMatch(page("legoland-california-annual-pass.html"), /not a sale/);
});

test("LEGOLAND California Black Friday sale is listed unpriced on the Black Friday page until Nov 29", () => {
  const u = season.unconfirmed.find((x) => /^LEGOLAND California/.test(x.operator));
  assert.equal(u.observed_on, "2026-11-19");
  assert.equal(u.list_until, "2026-11-29");
  assert.match(u.text, /from \$64 a person online; they started at \$69 online on Nov 14/);
  assert.doesNotMatch(u.text, /tier not named/);
  assert.match(page("black-friday-family-travel-deals.html"), /<h3>LEGOLAND California, Carlsbad, CA<\/h3>/);
});

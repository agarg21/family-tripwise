import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { teenPages } from "./page-generation/upgrade-page-data.mjs";

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const html = read("site/things-to-do/new-york-city-with-teens.html");
const page = teenPages["things-to-do/new-york-city-with-teens.html"];
const esc = value => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");

test("NYC teen top photo banner, then comparison before the quick picks", () => {
  assert.match(html, /<h1>New York City With Teens<\/h1>/);
  assert.match(html, /<title>Things to Do in New York City With Teens: 10 Picks by Trip Style<\/title>/);
  assert.ok(html.indexOf('id="nyc-teen-comparison"') < html.indexOf("Five ways to let the teen choose the anchor"));
  const banner = html.indexOf('<figure class="licensed-photo hero-photo">');
  assert.ok(html.indexOf("<h1>") < banner && banner < html.indexOf('id="nyc-teen-comparison"'));
  assert.equal((html.match(/<figure /g) || []).length, 1);
  assert.equal((html.match(/<article class="quick-pick">/g) || []).length, 5);
  assert.equal((html.match(/<article class="detail-card">/g) || []).length, 5);
  assert.equal((html.match(/<article class="plan-card">/g) || []).length, 3);
  assert.match(html, /new-york-city-central-park\.webp.*loading="eager"/);
  assert.match(html, /Photo: Jet Lowe \/ National Park Service, public domain/);
  assert.doesNotMatch(html, /downloads\/.*\.csv|Spreadsheet copy/);
});

test("every teen decision field and dated budget body remains visible", () => {
  for (const row of page.rows) for (const cell of row) assert.ok(html.includes(esc(cell)), cell);
  for (const budget of [page.admissionBudget,page.transportBudget,page.paymentBudget]) {
    for (const row of budget.rows) for (const cell of row) assert.ok(html.includes(esc(cell)), cell);
    assert.ok(html.includes(esc(budget.note)));
    for (const source of budget.sources) assert.ok(html.includes(esc(source)));
  }
  assert.match(html, /Attraction facts and official sources checked:<\/strong> July 26, 2026/);
  assert.match(html, /Announced from October 19, 2026/);
  assert.match(html, /not an observed future checkout price/);
  assert.match(html, /not a first-ever tap/);
  assert.match(html, /policy checked October 10, 2026/);
});

test("three native budget links and the activity comparison are keyboard-accessible", () => {
  const navigation = html.match(/<nav aria-label="Family budget comparisons">[\s\S]*?<\/nav>/)[0];
  for (const id of ["moma-budget-title","ferry-budget-title","omny-budget-title"]) {
    assert.equal((navigation.match(new RegExp(`href="#${id}"`,"g")) || []).length, 1);
    assert.equal((html.match(new RegExp(`id="${id}"`,"g")) || []).length, 1);
  }
  assert.match(html, /tabindex="0" role="region" aria-label="New York City teen activity comparison"/);
  const table = html.match(/id="nyc-teen-comparison"[\s\S]*?<\/table>/)[0];
  assert.equal((table.match(/scope="col"/g) || []).length, 7);
  assert.equal((table.match(/role="rowheader"/g) || []).length, 10);
  const css = read("site/styles.css");
  assert.match(css, /#nyc-teen-intro h1 \{\s*font-size: var\(--t-2xl\)/);
  assert.match(css, /#nyc-teen-comparison \.comparison-table \{\s*min-width: 1100px/);
  assert.match(css, /#nyc-teen-comparison nav \{[\s\S]*?margin-bottom: 24px/);
  assert.match(css, /#nyc-teen-intro ~ section\[aria-labelledby\] \.comparison-table \{\s*min-width: 800px/);
  assert.match(css, /#nyc-teen-intro ~ section\[aria-labelledby\] \.comparison-table td:first-child \{\s*width: 160px/);
  assert.match(css, /#nyc-teen-intro ~ section\[aria-labelledby\] \.comparison-table td:first-child \{[^}]*position: sticky;[^}]*left: 0;[^}]*background: var\(--surface\)/);
  assert.match(css, /#nyc-teen-intro ~ section\[aria-labelledby\] \.comparison-table td:last-child \{\s*width: 128px/);
});

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { teenPages } from "./page-generation/upgrade-page-data.mjs";

const read = p => readFileSync(new URL("../" + p, import.meta.url), "utf8");
const html = read("site/things-to-do/las-vegas-with-teens.html");
const page = teenPages["things-to-do/las-vegas-with-teens.html"];
const esc = v => String(v).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");

test("Vegas teen top photo banner, then comparison before quick picks", () => {
  const at = html.indexOf('id="lv-activity-comparison"');
  const banner = html.indexOf('<figure class="licensed-photo hero-photo">');
  assert.ok(at > 0 && html.indexOf("<h1>") < banner && banner < at && at < html.indexOf("Five ways to let the teen choose"));
  assert.equal((html.match(/<figure /g) || []).length, 1);
  assert.match(html, /Attraction facts and official sources checked:<\/strong> July 22, 2026/);
  assert.match(html, /AREA15 adult-accompaniment policy separately checked October 9, 2026/);
  assert.match(html, /images\/las-vegas-bellagio-fountains.webp/);
  assert.match(html, /creativecommons.org\/licenses\/by-sa\/4.0\//);
  assert.doesNotMatch(html, /downloads\/.*\.csv/);
});

test("all eight eleven-field rows retain original values in the declared permutation", () => {
  const table = html.match(/id="lv-activity-comparison"[\s\S]*?<\/table>/)[0];
  assert.equal((table.match(/role="rowheader"/g) || []).length, 8);
  assert.equal((table.match(/scope="col"/g) || []).length, 11);
  assert.deepEqual(page.frontComparisonOrder, [0, 9, 1, 2, 3, 4, 5, 6, 7, 10, 8]);
  for (const row of page.rows) {
    assert.equal(row.length, 11);
    const serialized = page.frontComparisonOrder.map((index, n) => n === 0 ? `<td role="rowheader">${esc(row[index])}</td>` : `<td>${esc(row[index])}</td>`).join("");
    assert.ok(table.includes(serialized), row[0]);
  }
  assert.match(table, /<th scope="col">Pair nearby<\/th><th scope="col">Current check<\/th><\/tr>/);
  assert.equal((html.match(/<article class="quick-pick">/g) || []).length, 5);
  assert.equal((html.match(/<article class="detail-card">/g) || []).length, 5);
  assert.equal((html.match(/<article class="plan-card">/g) || []).length, 4);
});

test("Vegas section routes, accessible scroll region and width are scoped", () => {
  for (const id of ["lv-activity-comparison", "lv-activity-quick-picks", "lv-activity-notes"]) {
    assert.equal((html.match(new RegExp(`id="${id}"`, "g")) || []).length, 1);
    assert.equal((html.match(new RegExp(`href="#${id}"`, "g")) || []).length, 1);
  }
  assert.match(html, /tabindex="0" role="region" aria-label="Las Vegas teen activity comparison"/);
  assert.match(html, /class="lv-teen-glance"/);
  assert.doesNotMatch(html, /sa-activity-(comparison|quick-picks|notes)|chi-activity-(comparison|quick-picks|notes)/);
  assert.match(read("site/styles.css"), /#lv-activity-comparison \.comparison-table \{ min-width: 1740px/);
  const engine = read("tools/page-generation/upgrade-engine.mjs");
  assert.match(engine, /type === "teen" && !page.frontComparisonOrder/);
  assert.match(engine, /new Set\(order\)\.size !== order\.length/);
});

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
  assert.ok(at > 0 && html.indexOf("<h1>") < banner && banner < at && at < html.indexOf("Pick by what your teen likes"));
  assert.equal((html.match(/<figure /g) || []).length, 1);
  assert.match(html, /Prices and rules checked:<\/strong> November 1-6, 2026/);
  assert.match(html, /Bellagio and Big Apple Coaster last read:<\/strong> July 22, 2026/);
  assert.match(html, /AREA15 under-18 policy read October 9/);
  assert.match(html, /images\/las-vegas-bellagio-fountains.webp/);
  assert.match(html, /creativecommons.org\/licenses\/by-sa\/4.0\//);
  assert.doesNotMatch(html, /downloads\/.*\.csv/);
});

test("all eight five-field rows retain original values in the declared permutation", () => {
  const table = html.match(/id="lv-activity-comparison"[\s\S]*?<\/table>/)[0];
  assert.equal((table.match(/role="rowheader"/g) || []).length, 8);
  assert.equal((table.match(/scope="col"/g) || []).length, 5);
  assert.deepEqual(page.frontComparisonOrder, [0, 1, 2, 3, 4]);
  for (const row of page.rows) {
    assert.equal(row.length, 5);
    const serialized = page.frontComparisonOrder.map((index, n) => n === 0 ? `<td role="rowheader">${esc(row[index])}</td>` : `<td>${esc(row[index])}</td>`).join("");
    assert.ok(table.includes(serialized), row[0]);
  }
  assert.match(table, /<th scope="col">Time and area<\/th><th scope="col">Check first<\/th><\/tr>/);
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
  assert.match(read("site/styles.css"), /#lv-activity-comparison \.comparison-table \{ min-width: 760px/);
  const engine = read("tools/page-generation/upgrade-engine.mjs");
  assert.match(engine, /type === "teen" && !page.frontComparisonOrder/);
  assert.match(engine, /new Set\(order\)\.size !== order\.length/);
});

test("Vegas teen family cost sits in the box above the photo (G13 fix 2)", () => {
  const box = html.indexOf('class="container answer-box activity-glance"');
  const photo = html.indexOf('<figure class="licensed-photo hero-photo">');
  assert.ok(box > 0 && box < photo);
  assert.ok(box < html.indexOf("Family of 4 (2 adults, 2 teens 13-17), estimate") && html.indexOf("Family of 4 (2 adults, 2 teens 13-17), estimate") < photo);
  assert.match(html, /a car at Red Rock Canyon/);
  assert.doesNotMatch(html, />Low cost</);
});

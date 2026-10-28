import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { garfieldAdmission, garfieldEvidence, garfieldView, renderGarfieldAdmission } from "./garfield-admission.mjs";
import { activityPages } from "./page-generation/upgrade-page-data.mjs";
const root = new URL("../", import.meta.url), page = activityPages["things-to-do/chicago-with-kids.html"];
const html = () => readFileSync(new URL("site/things-to-do/chicago-with-kids.html", root), "utf8");

test("published visitor age bands give known-rate arithmetic without a checkout-total claim", () => {
  const result = garfieldAdmission([35, 36, 7, 12], "nonresident");
  assert.equal(result.known_rate_subtotal, 30);
  assert.equal(result.currency, "USD");
  assert.equal(result.unit, "party/general-admission-known-rate-subtotal");
  assert.equal(result.complete_rate_coverage, true);
  assert.equal(result.complete_checkout_total, false);
  assert.equal(result.tax_fee_total, null);
  assert.equal(result.exact_visit_date, null);
  assert.equal(garfieldAdmission([7, 17, 18, 64, 65], "nonresident").known_rate_subtotal, 35);
});

test("under-seven gaps remain unknown rather than free or a complete family price", () => {
  const result = garfieldAdmission([35, 36, 3, 7], "nonresident");
  assert.equal(result.known_rate_subtotal, 25);
  assert.deepEqual(result.unknown_ages, [3]);
  assert.equal(result.components[2].amount, null);
  assert.equal(result.complete_rate_coverage, false);
  assert.equal(garfieldAdmission([0, 6], "nonresident").complete_rate_coverage, false);
  assert.match(renderGarfieldAdmission(), /USD 25\.00<br><small>\+ unpriced<br>age 3/);
  assert.match(renderGarfieldAdmission(), /Rate for age 3/);
});

test("resident zero applies only under explicit per-person verification, not hotel or Illinois residence", () => {
  const result = garfieldAdmission([35, 36, 3, 7], "each-visitor-verified-city-of-chicago-resident");
  assert.equal(result.known_rate_subtotal, 0);
  assert.equal(result.complete_checkout_total, false);
  assert.equal(result.complete_rate_coverage, true);
  for (const residency of ["Illinois", "Chicago-hotel", "mixed", "resident", true, null]) {
    assert.throws(() => garfieldAdmission([35, 3], residency), /Invalid/);
  }
  assert.match(renderGarfieldAdmission(), /Each person's ZIP\/address evidence/);
});

test("malformed tasks and unqualified sources or rate bands fail closed", () => {
  for (const ages of [[], [3.5], [-1], [121], [, 7], ["7"], null]) assert.throws(() => garfieldAdmission(ages, "nonresident"));
  for (const mutate of [p => p.currency = "GBP", p => p.source_url = "https://example.com/", p => p.checked_on = "bad",
    p => p.rates[1].amount = -1, p => p.rates[0].evidence_class = "OFFICIAL_VISITOR_FACT", p => p.rates[1].min_age = 6,
    p => p.closed_weekdays = ["Sunday"], p => p.childrens_garden.separate_reservation = false]) {
    const bad = structuredClone(garfieldEvidence); mutate(bad);
    assert.throws(() => garfieldView(bad), /Invalid/);
  }
  const before = JSON.stringify(garfieldEvidence); garfieldView(); renderGarfieldAdmission();
  assert.equal(JSON.stringify(garfieldEvidence), before);
});

test("one current Garfield view owns card, main row and map-ready values without renewing other fields", () => {
  const view = garfieldView(), card = page.activityCards.find(c => c.name === garfieldEvidence.venue);
  const row = page.rows.find(r => r[0] === garfieldEvidence.venue);
  assert.equal(card.cost, view.cost); assert.equal(card.rain, view.rain); assert.equal(card.summary, view.summary);
  assert.equal(row[3], view.cost); assert.equal(row[6], view.rain); assert.equal(row[8], view.booking);
  const map = JSON.parse(html().match(/id="map-ready-activities">([\s\S]*?)<\/script>/)[1]);
  assert.equal(map.find(r => r.name === card.name).cost, view.cost);
  assert.equal(map.find(r => r.name === card.name).rain, view.rain);
  assert.equal(map.length, 12);
  assert.equal(card.stroller, "Good"); assert.equal(card.nap, "High");
});

test("native public comparison exposes eligibility, reservation and unresolved full-cost basis", () => {
  const h = html(), section = h.match(/<section[^>]+id="garfield-admission"[\s\S]*?<\/section>/)[0];
  assert.ok(h.includes(renderGarfieldAdmission(page.garfieldAdmission)));
  assert.equal((section.match(/<tr><th scope="row">/g) ?? []).length, 3);
  assert.equal((h.match(/href="#garfield-admission"/g) ?? []).length, 2);
  assert.match(h, /href="#garfield-admission">Admission and reservation checks<\/a>/);
  assert.match(h, /href="#garfield-admission">Admission checks<\/a>/);
  assert.equal((h.match(/id="garfield-admission"/g) ?? []).length, 1);
  for (const phrase of ["Closed Monday/Tuesday", "30-minute reservation", "Under-seven rate unconfirmed", "not checkout totals",
    "Garden cost, taxes/fees and dated availability unconfirmed", "2026-10-13"]) assert.ok(section.includes(phrase));
  assert.match(section, /tabindex="0" role="region" aria-label="Garfield Park admission examples"/);
  assert.doesNotMatch(section, /children under 7.*free|7:15|7:30|19:15|19:30|download/i);
});

test("scoped scroll and sticky identity styles keep the new table independent of other tables", () => {
  const css = readFileSync(new URL("site/styles.css", root), "utf8");
  assert.match(css, /\.garfield-admission-comparison \.comparison-table\s*\{[^}]*min-width: 640px/);
  assert.match(css, /\.garfield-admission-comparison th:first-child\s*\{[^}]*position: sticky/);
  assert.match(css, /\.garfield-admission-comparison th\[scope="row"\]\s*\{[^}]*background: var\(--surface\)/);
});

test("page role, global source dates and source-access limitations are preserved", () => {
  const h = html();
  assert.match(h, /Garfield Park admission checked:<\/strong> October 13, 2026 · <strong>Other attraction sources checked:<\/strong> July 23, 2026/);
  assert.match(h, /Official attraction and city sources checked July 23, 2026/);
  assert.equal((h.match(/<article class="activity-card" data-tags=/g) ?? []).length, 12);
  assert.match(h, /rel="canonical" href="https:\/\/familytripwise.com\/things-to-do\/chicago-with-kids.html"/);
  assert.ok(garfieldEvidence.source_limits.some(s => s.includes("no admission or reservation controls")));
  assert.ok(garfieldEvidence.source_limits.some(s => s.includes("19:15") && s.includes("19:30")));
  assert.equal(garfieldEvidence.childrens_garden.price, null);
  assert.equal(garfieldEvidence.childrens_garden.availability, null);
});

import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { cancunGrandparentsBudget as e, cancunGrandparentsCsv, cancunGrandparentsSection, writeCancunResortPage } from "./page-generation/cancun-resort-page.mjs";
import { cancunEvidence } from "../src/prototypes/cancun-resort-comparison/data.mjs";

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const o = e.observation;
test("grandparents quote retains the rendered exact party and date basis", () => {
  assert.equal(e.action_id, "FT-IMP-106");
  assert.equal(o.adults, 4); assert.deepEqual(o.child_ages, [3, 7]);
  assert.equal(o.exact_child_ages_entered, true); assert.equal(o.rooms, 1);
  assert.equal(o.room_code, "LXUU2"); assert.equal(o.category, "Two Bedroom Luxury Junior Suite");
  assert.equal(o.currency, "USD"); assert.equal(o.unit, "per suite per night");
  assert.equal((Date.parse(o.checkout) - Date.parse(o.checkin)) / 86400000, o.nights);
  const url = new URL(e.source_url);
  for (const [key, value] of Object.entries({ adult: "4", child: "2", childages: "3|7", arrive: o.checkin, depart: o.checkout, room: o.room_code, currency: o.currency, rooms: "1" })) assert.equal(url.searchParams.get(key), value);
  assert.deepEqual(o.plans.map(p => [p.nightly_display, p.total_display]), [[1193, 3579], [1491.87, 4475.61]]);
  for (const p of o.plans) assert.equal(Math.round(p.nightly_display * 100) * o.nights, Math.round(p.total_display * 100));
  const p = o.plans[0]; assert.equal(Math.round((p.pre_tax_total + p.room_taxes_fees) * 100), p.total_display * 100);
  assert.equal(Math.round(p.pre_tax_nightly_rows.reduce((a,b) => a+b, 0) * 100), Math.round(p.pre_tax_total * 100));
});
test("price does not erase connection, category, fee or formal group-rate holds", () => {
  assert.match(o.connection, /Not established/); assert.match(o.room_conflict, /Sleeps 8.*eight total.*six versus two/);
  assert.match(o.room_conflict, /does not resolve the child-limit conflict/);
  assert.equal(cancunEvidence.records.find(r => r.id === "royalton-splash-two-bedroom").room.maximum, 8);
  assert.match(o.fee_basis, /environmental sanitation excluded/);
  assert.match(o.eligibility, /excludes group bookings/);
  assert.match(o.terms, /two days.*48 hours.*two-night no-show/);
  assert.equal(e.grand_check.group_price, null);
  assert.match(e.grand_check.failed_task, /did not change2adults/);
  assert.match(e.grand_check.old_price_limit, /not a four-adult/);
  assert.equal(cancunEvidence.records.find(r => r.id === "grand-family-suite").price.usdFrom, 1945);
  assert.equal(cancunEvidence.records.find(r => r.id === "royalton-splash-two-bedroom").price.usdFrom, 997.7);
  assert.equal(cancunEvidence.checkedOn, "2026-09-23"); assert.equal(cancunEvidence.recheckOn, "2026-10-23");
});
test("additive public case preserves unknown group price and separate dated terms", () => {
  const html = cancunGrandparentsSection();
  for (const value of ["Four adults, two children", "November 9-12, 2026", "USD 1,193.00", "USD 3,579.00", "USD 1,491.87", "USD 4,475.61", "A four-adult, two-child price is not verified", "not a reservation guarantee", "not established", "step-free access", "2026-10-18", "excludes group bookings"]) assert.ok(html.includes(value), value);
  assert.equal((html.match(/<tbody>[\s\S]*?<\/tbody>/)[0].match(/<tr>/g) ?? []).length, 2);
  assert.match(html, /aria-label="Four-adult two-child dated suite prices"/);
  assert.match(html, /<details><summary>Room conflicts and rate conditions/);
  assert.match(html, /do not by themselves guarantee a connecting door/);
  assert.doesNotMatch(html, /SAVE 20|guaranteed for|suitable for grandparents/);
});
test("both CSV plan rows keep party, price and all decision limits", () => {
  const csv = cancunGrandparentsCsv();
  assert.equal(csv.split("\r\n").filter(Boolean).length, 3);
  for (const value of ["\"4\",\"3 | 7\"", "2026-11-09", "2026-11-12", "per suite per night", "3579", "4475.61", "environmental sanitation excluded", "six versus two", "not guaranteed connection", "Grand Family Suite four-adult group price not observed", e.checked_on, e.recheck_on, e.source_url]) assert.ok(csv.includes(value), value);
});
test("party CSV escapes quotes and neutralizes spreadsheet formulas", () => {
  const old = o.plans[0].name;
  try {
    o.plans[0].name = '=HYPERLINK("synthetic")';
    assert.ok(cancunGrandparentsCsv().includes('"\'=HYPERLINK(""synthetic"")"'));
  } finally { o.plans[0].name = old; }
});
test("generated new download and public block are deterministic from the maintained source", () => {
  const output = new Map(); writeCancunResortPage((p,b) => output.set(p,b));
  assert.equal(output.size, 9);
  for (const [p,b] of output) assert.equal(read(`site/${p}`), b, p);
  assert.equal(output.get("downloads/cancun-grandparents-budget.csv"), cancunGrandparentsCsv());
  assert.ok(output.get("where-to-stay/cancun-family-resorts.html").includes(cancunGrandparentsSection()));
});

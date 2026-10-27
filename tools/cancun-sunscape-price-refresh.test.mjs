import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { cancunEvidence } from "../src/prototypes/cancun-resort-comparison/data.mjs";
import { writeCancunResortPage } from "./page-generation/cancun-resort-page.mjs";

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const evidence = JSON.parse(read("docs/research/cancun-sunscape-price-refresh-2026-10-11.json"));
const record = cancunEvidence.records.find(r => r.id === "sunscape-family-junior-suite");
const price = record.price;

test("Sunscape current public sample agrees with exact room, ages, dates and displayed rounding", () => {
  const o = evidence.observation;
  assert.equal(evidence.action_id, "FT-IMP-098");
  assert.equal(price.observedOn, evidence.checked_on);
  assert.equal(price.recheckOn, evidence.recheck_on);
  assert.equal(cancunEvidence.sources.S5, evidence.source_url);
  assert.deepEqual(price.sourceIds, ["S5", "S4"]);
  assert.equal(price.usdFrom, o.nightly_display);
  assert.equal(o.total_display, 934); assert.equal(o.nights, 3);
  assert.deepEqual(o.child_ages, [3, 7]);
  assert.equal(o.exact_child_ages_entered, true);
  assert.equal(o.membership_required, false);
  assert.equal(o.nightly_rows.reduce((a, b) => a + b), 933);
  assert.equal(o.nightly_display_is_rounded, true);
  for (const term of [o.category, "October 27-30, 2026", "two adults and children aged 3 and 7", "three nights", "USD 934 displayed total", "USD 311 rounded per room/night", "do not sum exactly", "Non-member Sun-Kissed Savings"]) assert.ok(price.basis.includes(term), term);
});

test("a quoted October plan does not resolve the narrower child-benefit window", () => {
  assert.deepEqual(evidence.terms.general_promotion_stays, ["2026-10-01", "2027-12-20"]);
  assert.deepEqual(evidence.terms.child_benefit_stays, ["2027-04-01", "2027-12-20"]);
  assert.deepEqual(evidence.terms.child_age_band, [3, 12]);
  assert.equal(evidence.terms.children_per_paid_adult, 1);
  assert.equal(evidence.terms.maximum_children_per_room, 2);
  assert.equal(evidence.observation.child_offer_counterfactual, false);
  assert.match(price.basis, /Child-offer eligibility conflicts.*October 1, 2026.*April 1, 2027/);
  assert.match(price.basis, /Do not infer kids-free eligibility or savings/);
  assert.match(price.basis, /not confirmed booking acceptance/);
  assert.equal(record.room.capacityStatus, "disputed");
});

test("fees, refund boundary and inside-payment-window uncertainty remain visible", () => {
  assert.match(price.fees, /September 27 FAQ observation.*MXN 79 per-room\/night/);
  assert.match(price.fees, /total includes it is unconfirmed/);
  assert.match(price.fees, /14 days.*15 days prior.*100% penalty 14-0 days/);
  assert.match(price.fees, /30 days.*already inside that window is unknown/);
  assert.equal(cancunEvidence.checkedOn, "2026-09-23");
  assert.equal(cancunEvidence.recheckOn, "2026-10-23");
  assert.equal(cancunEvidence.priceRecheckOn, "2026-10-11");
  assert.equal(cancunEvidence.lastUpdatedOn, "2026-09-27");
});

test("page and portable outputs keep the same dated amount and unresolved conditions", () => {
  const output = new Map(); writeCancunResortPage((p, b) => output.set(p, b));
  assert.equal(output.size, 9);
  for (const [p, b] of output) assert.equal(read(`site/${p}`), b, p);
  for (const p of ["where-to-stay/cancun-family-resorts.html", "downloads/cancun-booking-checklist.txt", "downloads/cancun-room-comparison.csv"]) {
    for (const term of ["USD 934 displayed total", "USD 311 rounded per room/night", "Child-offer eligibility conflicts", "April 1, 2027", "100% penalty 14-0 days", "2026-10-11"]) assert.ok(output.get(p).includes(term), `${p}: ${term}`);
  }
  assert.match(output.get("downloads/cancun-room-comparison.csv"), /"2026-10-11","dates passed; older observation"/);
});

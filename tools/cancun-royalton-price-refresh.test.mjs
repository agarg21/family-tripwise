import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { cancunEvidence } from "../src/prototypes/cancun-resort-comparison/data.mjs";
import { writeCancunResortPage } from "./page-generation/cancun-resort-page.mjs";
const read = path => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const evidence = JSON.parse(read("docs/research/cancun-royalton-price-refresh-2026-10-11.json"));
const record = cancunEvidence.records.find(r => r.id === "royalton-splash-two-bedroom");
const price = record.price;

test("Royalton dated public plans retain the exact entered party, code and separate totals", () => {
  const o = evidence.observation;
  assert.equal(evidence.action_id, "FT-IMP-099");
  assert.equal(price.observedOn, evidence.checked_on); assert.equal(price.recheckOn, evidence.recheck_on);
  assert.equal(cancunEvidence.sources.R4, evidence.source_url);
  assert.deepEqual(o.child_ages, [3, 7]); assert.equal(o.exact_child_ages_entered, true);
  assert.equal(o.membership_required, false); assert.equal(o.room_code, "LXUU2"); assert.equal(o.nights, 3);
  assert.equal(price.usdFrom, o.plans[0].nightly_display); assert.equal(price.usdTo, o.plans[1].nightly_display);
  for (const plan of o.plans) assert.ok(Math.abs(plan.nightly_display * 3 - plan.total_display) < 0.001);
  assert.equal(o.plans[0].pre_tax_total + o.plans[0].room_taxes_fees, 2993.10);
  for (const term of ["November 9-12, 2026", "two adults and children aged 3 and 7", "LXUU2", o.current_category, "USD 997.70 per room/night", "USD 2,993.10 total", "USD 1,247.75 per room/night", "USD 3,743.25 total"]) assert.ok(price.basis.includes(term), term);
});

test("same booking code does not establish older view, bedding or child acceptance", () => {
  assert.equal(record.room.category, "Luxury Two Bedroom Junior Suite");
  assert.equal(record.room.maximum, 8); assert.equal(record.room.capacityStatus, "disputed");
  assert.equal(record.room.beds, "Two bedrooms; two kings or one king and two queens. The description also mentions a sofa bed.");
  assert.deepEqual(record.room.sourceIds, ["R1", "R3", "R4"]);
  assert.match(record.room.checks[1], /September 23.*October 11.*LXUU2.*mangrove views.*different bed descriptions/);
  assert.match(record.room.checks[1], /earlier view and bedding are not reconfirmed/);
  assert.match(price.basis, /category continuity and sleeping layout need confirmation/);
  assert.match(price.basis, /not a seasonal range, child-offer savings or confirmed booking acceptance/);
  assert.equal(evidence.observation.child_offer_counterfactual, false);
});

test("current fee exclusion and refund terms do not renew the old levy amount", () => {
  assert.match(price.fees, /current notice gives no numeric amount/);
  assert.match(price.fees, /September 27.*MXN 85.40.*not refreshed/);
  assert.match(price.fees, /USD 559.68.*Standard.*not separately itemize/);
  assert.match(price.fees, /full charge two days.*refund outside 48 hours.*first-night penalty.*two-night no-show penalty/);
  assert.equal(cancunEvidence.checkedOn, "2026-09-23"); assert.equal(cancunEvidence.recheckOn, "2026-10-23");
  assert.equal(cancunEvidence.priceRecheckOn, "2026-10-11"); assert.equal(cancunEvidence.lastUpdatedOn, "2026-09-27");
});

test("all generated outputs agree on current plans and dated room-continuity warning", () => {
  const output = new Map(); writeCancunResortPage((p, b) => output.set(p, b));
  assert.equal(output.size, 9); for (const [p,b] of output) assert.equal(read(`site/${p}`),b,p);
  for (const p of ["where-to-stay/cancun-family-resorts.html", "downloads/cancun-booking-checklist.txt", "downloads/cancun-room-comparison.csv"]) {
    for (const term of ["USD 2,993.10 total", "USD 3,743.25 total", "LXUU2", "earlier view and bedding are not reconfirmed", "amount is not refreshed", "2026-10-11"]) assert.ok(output.get(p).includes(term),`${p}: ${term}`);
  }
  assert.match(output.get("downloads/cancun-room-comparison.csv"), /"2026-10-11","no"/);
});

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { cancunEvidence } from "../src/prototypes/cancun-resort-comparison/data.mjs";
import { writeCancunResortPage } from "./page-generation/cancun-resort-page.mjs";
const read = path => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const evidence = JSON.parse(read("docs/research/cancun-finest-family-price-2026-10-11.json"));
const finest = cancunEvidence.records.find(r => r.id === "finest-family-suite");

test("Finest sample matches exact five-person room, stay and public price", () => {
  const o = evidence.observation, p = finest.price;
  assert.equal(evidence.action_id, "FT-IMP-100");
  assert.equal(o.category, "Family Suite"); assert.equal(o.rooms, 1); assert.equal(o.adults, 2);
  assert.deepEqual(o.child_ages, [3, 7, 12]); assert.equal(o.exact_child_ages_entered, true);
  assert.equal(o.checkin, "2026-11-09"); assert.equal(o.checkout, "2026-11-12");
  assert.equal(o.nights, 3); assert.equal(o.currency, "USD"); assert.equal(o.membership_required, false);
  assert.equal(p.usdFrom, o.nightly_display); assert.equal(p.usdTo, null);
  assert.equal(p.observedOn, evidence.checked_on); assert.equal(p.recheckOn, evidence.recheck_on);
  assert.deepEqual(p.sourceIds, ["F4"]); assert.equal(cancunEvidence.sources.F4, evidence.source_url);
  assert.equal(o.total_display, 3532); assert.notEqual(o.nightly_display * o.nights, o.total_display);
  for (const term of ["November 9-12, 2026", "one Family Suite", "two adults", "3, 7 and 12", "three nights", "Public non-member", "USD 3,532", "USD 1,177 rounded per room/night"]) assert.ok(p.basis.includes(term), term);
});

test("locked price and rounded/refund/payment uncertainties remain explicit", () => {
  assert.equal(evidence.observation.child_offer_counterfactual, false);
  assert.match(finest.price.basis, /locked rewards USD 3,426 total is excluded/);
  assert.match(finest.price.basis, /do not sum exactly/);
  assert.match(finest.price.basis, /not confirmed booking acceptance, a typical range, child-offer savings/);
  for (const term of ["all fees and taxes included", "separately payable local levy", "not itemized", "three-night minimum", "whole-stay penalty", "boundary overlaps", "30 days", "four days", "29-days-before-arrival", "unresolved"]) assert.ok(finest.price.fees.includes(term), term);
  assert.equal(evidence.observation.separately_payable_local_levy, null);
  assert.equal(evidence.excluded_comparisons.length, 4);
});

test("price does not recertify policy, capacity, care or unrelated price dates", () => {
  assert.equal(cancunEvidence.checkedOn, "2026-09-23"); assert.equal(cancunEvidence.recheckOn, "2026-10-23");
  assert.equal(cancunEvidence.lastUpdatedOn, "2026-09-27"); assert.equal(cancunEvidence.priceRecheckOn, "2026-10-11");
  assert.match(finest.room.checks[0], /exact-age rate classification and dated availability are unverified/);
  assert.match(finest.clubs.checks[0], /do not infer admission for age 12/);
  assert.equal(cancunEvidence.records.find(r => r.id === "sapphire-family-junior-suite").price.observedOn, "2026-09-27");
  assert.equal(cancunEvidence.records.find(r => r.id === "ziva-ocean-view-double").price, null);
  for (const id of ["grand-family-suite", "sunscape-family-junior-suite", "royalton-splash-two-bedroom"]) assert.equal(cancunEvidence.records.find(r => r.id === id).price.observedOn, "2026-10-11");
  assert.ok(read("docs/research/cancun-nightly-price-observations-2026-09-27.md").includes("843"));
});

test("all generated outputs and exports retain exact-family total and limits", () => {
  const output = new Map(); writeCancunResortPage((path, bytes) => output.set(path, bytes));
  assert.equal(output.size, 8);
  for (const [path, bytes] of output) assert.equal(read(`site/${path}`), bytes, path);
  for (const path of ["where-to-stay/cancun-family-resorts.html", "downloads/cancun-booking-checklist.txt", "downloads/cancun-room-comparison.csv"]) {
    for (const term of ["USD 3,532", "3, 7 and 12", "locked rewards", "29-days-before-arrival", "boundary overlaps"]) assert.ok(output.get(path).includes(term), `${path}: ${term}`);
  }
});

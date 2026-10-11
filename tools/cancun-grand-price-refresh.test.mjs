import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { cancunEvidence } from "../src/prototypes/cancun-resort-comparison/data.mjs";
import { cancunResortPage, writeCancunResortPage } from "./page-generation/cancun-resort-page.mjs";

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const evidence = JSON.parse(read("docs/research/cancun-grand-price-refresh-2026-10-11.json"));
const price = cancunEvidence.records.find(r => r.id === "grand-family-suite").price;

test("Grand price agrees with the dated official room, party and flexible plan record", () => {
  const o = evidence.observation;
  assert.equal(evidence.action_id, "FT-IMP-097");
  assert.equal(price.usdFrom, o.average_nightly_display);
  assert.equal(price.observedOn, evidence.checked_on);
  assert.equal(price.recheckOn, evidence.recheck_on);
  assert.equal(cancunEvidence.sources.G5, evidence.source_url);
  assert.deepEqual(price.sourceIds, ["G5", "G1"]);
  assert.equal(o.total_display, 9723); assert.equal(o.nights, 5);
  assert.equal(Math.round(o.total_display / o.nights), price.usdFrom);
  assert.deepEqual(o.children, [{ count: 1, min: 4, max: 17 }, { count: 1, min: 0, max: 3 }]);
  for (const term of ["October 18-23, 2026", "Grand Family Suite", "two adults", "4-17", "0-3", "five nights", "USD 9,723 total", "USD 1,945 average per room/night", "Best Flexible Rate"]) assert.ok(price.basis.includes(term), term);
});

test("a no-code sample does not imply non-offer savings or exact party acceptance", () => {
  const o = evidence.observation;
  assert.equal(o.entered_promo_code, null); assert.equal(o.kids_free_benefit_displayed, true);
  assert.equal(o.child_offer_counterfactual, false); assert.equal(o.exact_child_ages_entered, false);
  assert.match(price.basis, /No entered promo code after removing RETURN5/);
  assert.match(price.basis, /not a non-offer rate or proof of savings/);
  assert.match(price.basis, /remembered-search summary still said two people/);
  assert.match(price.basis, /not confirmed party acceptance, a typical rate or a family-of-five quote/);
  assert.match(price.fees, /separately payable local levy is unconfirmed/);
  assert.match(price.fees, /four days.*one-night penalty.*72 hours/);
  assert.equal(evidence.excluded_comparisons.length, 4);
});

test("other price and policy dates are not renewed by a one-room refresh", () => {
  for (const r of cancunEvidence.records.filter(r => !["grand-family-suite", "sunscape-family-junior-suite", "royalton-splash-two-bedroom", "finest-family-suite"].includes(r.id) && r.price)) assert.equal(r.price.observedOn, "2026-09-27", r.id);
  const finest = JSON.parse(read("docs/research/cancun-finest-family-price-2026-10-11.json"));
  assert.equal(cancunEvidence.records.find(r => r.id === "finest-family-suite").price.observedOn, finest.checked_on);
  assert.equal(finest.action_id, "FT-IMP-100");
  const sunscape = JSON.parse(read("docs/research/cancun-sunscape-price-refresh-2026-10-11.json"));
  assert.equal(cancunEvidence.records.find(r => r.id === "sunscape-family-junior-suite").price.observedOn, sunscape.checked_on);
  assert.equal(sunscape.action_id, "FT-IMP-098");
  const royalton = JSON.parse(read("docs/research/cancun-royalton-price-refresh-2026-10-11.json"));
  assert.equal(cancunEvidence.records.find(r => r.id === "royalton-splash-two-bedroom").price.observedOn, royalton.checked_on);
  assert.equal(royalton.action_id, "FT-IMP-099");
  assert.equal(cancunEvidence.checkedOn, "2026-09-23");
  assert.equal(cancunEvidence.recheckOn, "2026-10-23");
  assert.equal(cancunEvidence.priceRecheckOn, "2026-10-11");
  assert.equal(cancunEvidence.lastUpdatedOn, "2026-09-27");
  assert.match(cancunEvidence.sources.G4, /promocode=RETURN5/);
  assert.doesNotMatch(cancunEvidence.sources.G5, /promocode/);
});

test("all generated comparison outputs use the maintained refreshed price", () => {
  const output = new Map(); writeCancunResortPage((path, bytes) => output.set(path, bytes));
  assert.equal(output.size, 8);
  for (const [path, bytes] of output) assert.equal(read(`site/${path}`), bytes, path);
  for (const path of ["where-to-stay/cancun-family-resorts.html", "downloads/cancun-booking-checklist.txt", "downloads/cancun-room-comparison.csv"]) {
    assert.ok(output.get(path).includes("USD 9,723 total"), path);
    assert.ok(output.get(path).includes("No entered promo code after removing RETURN5"), path);
    assert.ok(output.get(path).includes("2026-10-11"), path);
  }
  assert.match(output.get("where-to-stay/cancun-family-resorts.html"), /price examples checked 2026-09-27, 2026-10-11/);
  assert.match(output.get("downloads/cancun-room-comparison.csv"), /"2026-10-11","2026-10-18"/);
  assert.equal(cancunResortPage(), output.get("where-to-stay/cancun-family-resorts.html"));
});

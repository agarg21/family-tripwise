import assert from "node:assert/strict";
import test from "node:test";
import { omnyEvidence, omnyBudget, omnyComparison, omnyReviewClock } from "./nyc-omny-budget.mjs";

test("four independent caps versus one group method preserve fare-only units", () => {
  assert.deepEqual(omnyBudget().scenarios, [
    { trips_per_rider: 8, separate_cents: 9600, shared_cents: 9600 },
    { trips_per_rider: 14, separate_cents: 14000, shared_cents: 16100 }
  ]);
  assert.deepEqual(omnyComparison().rows, [["8", "USD 96.00", "USD 96.00", "USD 0.00"], ["14", "USD 140.00", "USD 161.00", "USD 21.00"]]);
});

test("payment limits remain beside the table", () => {
  const c = omnyComparison();
  assert.match(c.note, /full fare/); assert.match(c.note, /Free transfers/); assert.match(c.note, /Setup\/card costs are excluded/);
  assert.match(c.rule, /only the first tap/); assert.match(c.rule, /already enabled, not a first-ever tap/);
  assert.match(c.method_note, /physical card and its wallet version have separate caps/);
  assert.match(c.method_note, /reloadable OMNY Card/); assert.match(c.method_note, /No teen bank account/);
});

test("changed fare, group, identity, source and party basis requires requalification", () => {
  const edits = [e => e.fare_cents = 350, e => e.cap_cents = 3600, e => e.cap_days = 8, e => e.party.standard_fare_riders = 5, e => e.party.teen_ages[0] = 4, e => e.party.discounts_assumed = true, e => e.policy.maximum_additional_riders = 4, e => e.policy.additional_taps_full_fare_after_cap = false, e => e.policy.physical_card_wallet_separate_methods = false, e => e.policy.free_transfers_do_not_count = false, e => e.policy.first_use_group_payment_not_assumed = false, e => e.source_urls[0] = "https://example.com", e => e.source_publication_dates[0] = "2026-10-10", e => e.scenario_trips_per_rider = [14, 8], e => e.refresh_days = 31, e => e.observed_on = "2026-10-09", e => e.unit = "per family", e => e.currency = "GBP", e => e.source_status = "snippet-only"];
  for (const edit of edits) { const e = structuredClone(omnyEvidence); edit(e); assert.throws(() => omnyBudget(e), /requalification/); }
});

test("source clock is dated, historical-safe and never fact renewal", () => {
  assert.equal(omnyReviewClock("2026-10-10").freshness.due_on, "2026-11-09");
  assert.equal(omnyReviewClock("2026-11-09").freshness.state, "review-due");
  assert.equal(omnyReviewClock("2026-10-09").evidence_state, "not-yet-observed-at-report-date");
  assert.deepEqual(omnyBudget(omnyEvidence, "2026-10-09").scenarios, []);
  assert.throws(() => omnyBudget(omnyEvidence, "2026-02-30"), /requalification/);
});

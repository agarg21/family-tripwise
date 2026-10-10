import { readFileSync } from "node:fs";
import { validDate } from "./hotel-evidence.mjs";
import { ageState } from "./evidence-audit.mjs";

export const omnyEvidence = JSON.parse(readFileSync(new URL("../docs/research/nyc-omny-family-budget-2026-10-10.json", import.meta.url)));
const sources = ["https://www.mta.info/fares-tolls/subway-bus/tap-and-ride", "https://omny.info/faq/fare-cap", "https://omny.info/fares"];
const party = { adults: 2, teen_ages: [13, 17], standard_fare_riders: 4, discounts_assumed: false };
const policy = { only_first_group_tap_counts: true, additional_taps_full_fare_after_cap: true, maximum_additional_riders: 3, physical_card_wallet_separate_methods: true, free_transfers_do_not_count: true, first_use_group_payment_not_assumed: true };

export function omnyBudget(evidence = omnyEvidence, today = "2026-10-10") {
  if (!validDate(today) || evidence?.schema_version !== 1 || evidence.action_id !== "FT-IMP-091" || evidence.observed_on !== "2026-10-10" || evidence.refresh_days !== 30 || evidence.evidence_class !== "OFFICIAL_FARE_AND_GROUP_PAYMENT_POLICY" || evidence.source_status !== "body-inspected" || evidence.currency !== "USD" || evidence.unit !== "per full-fare rider, chargeable subway/local-bus fare trip before cap" || evidence.fare_cents !== 300 || evidence.cap_cents !== 3500 || evidence.cap_days !== 7 || JSON.stringify(evidence.source_urls) !== JSON.stringify(sources) || JSON.stringify(evidence.source_publication_dates) !== JSON.stringify([null, null, null]) || JSON.stringify(evidence.party) !== JSON.stringify(party) || JSON.stringify(evidence.policy) !== JSON.stringify(policy) || JSON.stringify(evidence.scenario_trips_per_rider) !== JSON.stringify([8, 14])) {
    throw Error("OMNY fare/group/party/method basis changed; requalification required");
  }
  const future = today < evidence.observed_on;
  const scenarios = future ? [] : evidence.scenario_trips_per_rider.map(trips => {
    const uncapped = trips * evidence.fare_cents;
    const first = Math.min(uncapped, evidence.cap_cents);
    return { trips_per_rider: trips, separate_cents: first * party.standard_fare_riders, shared_cents: first + uncapped * policy.maximum_additional_riders };
  });
  return { evidence, scenarios, freshness: ageState(evidence.observed_on, evidence.refresh_days, today), evidence_state: future ? "not-yet-observed-at-report-date" : "dated-record-available" };
}

export function omnyComparison(evidence = omnyEvidence) {
  const budget = omnyBudget(evidence);
  return {
    heading: "OMNY: one shared method is not four weekly caps",
    note: "Two adults and teens aged 13 and 17, all paying full fare. Checked October 10, 2026; USD interprets the official dollar amounts. Each rider takes the stated number of chargeable subway/local-bus fare trips within one seven-day cap period. Free transfers are not additional fare trips. Setup/card costs are excluded.",
    headers: ["Fare trips / rider / 7 days", "Four separate methods / party", "One shared method / party", "Shared-method extra"],
    rows: budget.scenarios.map(s => [String(s.trips_per_rider), ...[s.separate_cents, s.shared_cents, s.shared_cents - s.separate_cents].map(c => `USD ${(c / 100).toFixed(2)}`)]),
    rule: "The ordinary tap fare is USD 3.00 and the subway/local-bus cap is USD 35.00 per consistent payment method. With one method paying for four, only the first tap earns the cap; three additional taps stay full fare even after that cap. The shared example assumes group payment is already enabled, not a first-ever tap.",
    method_note: "MTA advises separate methods for everyone's first trip while a new method awaits authorization. Keep each rider's exact method consistent: a physical card and its wallet version have separate caps. A reloadable OMNY Card is an alternative to a bank card or phone; purchase/setup costs are not included above. No teen bank account, device, student discount, actual payment success or cheapest-option claim is assumed.",
    sources: evidence.source_urls
  };
}

export function omnyReviewClock(today, evidence = omnyEvidence) {
  const b = omnyBudget(evidence, today);
  return { id: "nyc-omny-family-payment", page_url: "https://familytripwise.com/things-to-do/new-york-city-with-teens.html", record_path: "docs/research/nyc-omny-family-budget-2026-10-10.json", observed_on: evidence.observed_on, interval_days: 30, evidence_class: evidence.evidence_class, source_urls: evidence.source_urls, freshness: b.freshness, evidence_state: b.evidence_state, next_step: b.freshness.state === "review-due" ? "recheck-fare-cap-group-and-method-rules" : b.freshness.state === "future-date-review" ? "do-not-use-future-evidence-in-historical-report" : "preserve-until-source-change-or-November9", limitation: "Fare-only conditional arithmetic; no card setup, payment authorization, reduced-fare eligibility, route or service assurance" };
}

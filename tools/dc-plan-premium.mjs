import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { validDate } from "./hotel-evidence.mjs";

export const dcPremiumTask = JSON.parse(readFileSync(new URL("../docs/research/dc-plan-premium-task-2026-10-10.json", import.meta.url), "utf8"));

export function dcPlanPremiums(records, asOf = "2026-10-10") {
  if (createHash("sha256").update(JSON.stringify(records)).digest("hex") !== dcPremiumTask.source_sha256 || !validDate(asOf))
    throw new Error("DC premium source or date changed; review required");
  if (asOf < dcPremiumTask.source_observed_on) return [];
  return records.flatMap(record => {
    const baseline = record.rates.find(rate => rate.plan === "Non-refundable" && rate.eligibility === "public");
    // Subtract stay cents before division: rounded nightly samples lose precision.
    const baselineCents = Math.round(baseline.stay_amount * 100);
    return record.rates.filter(rate => rate.eligibility === "public").map(rate => {
      const cents = Math.round(rate.stay_amount * 100) - baselineCents;
      return {record_id: record.record_id, category: record.category, plan: rate.plan, baseline: baseline.plan,
        stay_increment: cents / 100, nightly_increment: Math.round(cents / record.nights) / 100,
        currency: record.currency, unit: record.unit, nightly_unit: "configuration/night-equivalent",
        nights: record.nights, arrival: record.arrival, departure: record.departure, observed_on: record.checked_on,
        review_due: dcPremiumTask.review_due, historical: asOf > dcPremiumTask.review_due,
        cancellation: rate.cancellation, current_refund_right: null, full_cost: null, individual_ages_confirmed: false};
    });
  });
}

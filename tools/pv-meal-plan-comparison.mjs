import {readFileSync} from "node:fs";
import {createHash} from "node:crypto";
import {validDate} from "./hotel-evidence.mjs";

const read = name => JSON.parse(readFileSync(new URL(`../docs/research/${name}`, import.meta.url), "utf8"));
export const pvMealTask = read("puerto-vallarta-public-meal-plan-task-2026-10-09.json");
export const pvMealEvidence = read("puerto-vallarta-garza-family-budget-2026-10-09.json");

export function pvMealPlanComparison(records = pvMealEvidence, asOf = "2026-10-09") {
  // Source drift requires a new evidence review before this bounded comparison changes.
  if (createHash("sha256").update(JSON.stringify(records)).digest("hex") !== pvMealTask.source_sha256 || !validDate(asOf))
    throw new Error("PV meal-plan source or date changed; review required");
  const observation = records[0];
  if (asOf < observation.checked_on) return null;
  const [roomOnly, allInclusive] = observation.rates.filter(rate => rate.eligibility === "public");
  const differenceCents = Math.round(allInclusive.stay_amount * 100) - Math.round(roomOnly.stay_amount * 100);
  return {category: observation.category, currency: observation.currency, party: structuredClone(observation.party),
    arrival: observation.arrival, departure: observation.departure, nights: observation.nights,
    room_only: structuredClone(roomOnly), all_inclusive: structuredClone(allInclusive),
    stay_increment: differenceCents / 100, nightly_increment: Math.round(differenceCents / observation.nights) / 100,
    unit: "configuration/stay", nightly_unit: "configuration/night", observed_on: observation.checked_on,
    review_due: pvMealTask.review_due, historical: asOf > pvMealTask.review_due,
    tax_included: false, full_cost: null, meal_entitlements: null, savings: null,
    cancellation_consistent: false, source_url: observation.source_url};
}

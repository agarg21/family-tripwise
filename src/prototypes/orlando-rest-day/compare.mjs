import { restDayEvidence } from "./data.mjs";

function dateValue(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new TypeError("Use a YYYY-MM-DD date.");
  const date = new Date(`${value}T00:00:00Z`);
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== value) throw new RangeError("Invalid date.");
  return date;
}

export function compareRestDay(input) {
  if (!input || !Array.isArray(input.childAges) || input.childAges.length < 1 || input.childAges.length > 5 ||
      !Array.from(input.childAges).every(age => Number.isInteger(age) && age >= 0 && age <= 17)) {
    throw new TypeError("Provide one to five child ages from 0 to 17.");
  }
  if (!Number.isInteger(input.availableMinutes) || input.availableMinutes < 1 || input.availableMinutes > 720) throw new RangeError("Available visit time must be 1 to 720 minutes.");
  if (typeof input.returnAfterBreak !== "boolean") throw new TypeError("Specify whether leaving and returning is required.");
  const visit = dateValue(input.visitDate);
  const asOf = dateValue(input.asOf ?? new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date()));
  if (asOf < dateValue(restDayEvidence.checkedOn) || visit < asOf) throw new RangeError("Evidence cannot predate its check; visit cannot predate assessment.");
  const needsRecheck = asOf >= dateValue(restDayEvidence.recheckOn) || visit >= dateValue(restDayEvidence.recheckOn);
  const sources = ids => ids.map(id => ({ id, url: restDayEvidence.sources[id], checkedOn: restDayEvidence.checkedOn, publishedOn: null, evidenceClass: "official-published-rule" }));

  // Keep independent constraints visible; none is an overall recommendation.
  return {
    checkedOn: restDayEvidence.checkedOn, recheckOn: restDayEvidence.recheckOn, needsRecheck,
    scope: "Unpublished planning screen. No confirmed opening, admission, route, visit duration or family-fit verdict.",
    records: restDayEvidence.records.map(record => ({
      id: record.id, name: record.name,
      schedule: {
        status: record.schedule.normallyClosedWeekdays.includes(visit.getUTCDay()) ? "normally-closed-check-exception" : "dated-hours-unverified",
        note: record.schedule.note, sources: sources(record.schedule.sourceIds)
      },
      reentry: {
        status: !input.returnAfterBreak ? "not-required-for-this-task" : record.reentry.policy === "conditional" ? "published-conditional-return" : "return-policy-unknown",
        condition: record.reentry.condition, sources: sources(record.reentry.sourceIds)
      },
      duration: {
        status: !record.duration.minutes ? "suggested-duration-unknown" : input.availableMinutes < record.duration.minutes[0] ? "shorter-than-published-suggestion" : "not-below-published-suggestion",
        suggestedMinutes: record.duration.minutes ? [...record.duration.minutes] : null,
        note: "Suggestion only; neither a minimum stay nor a promise of completing the visit. Excludes transport and meal/break time.",
        sources: sources(record.duration.sourceIds)
      },
      children: input.childAges.map(age => ({
        age, area: record.childArea?.name ?? null,
        status: !record.childArea ? "age-guidance-not-assessed" : age <= record.childArea.recommendedMaximumAge ? "within-area-guidance" : "outside-area-guidance-not-venue-exclusion",
        sources: record.childArea ? sources(record.childArea.sourceIds) : []
      })),
      meal: { note: record.meal.note, sources: sources(record.meal.sourceIds) },
      currentOperation: "unknown", totalCost: null, transportTime: null
    }))
  };
}

import { checkedOn, recheckOn, suites } from "./orlando-suite-data.mjs";

export function dateNumber(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new Error("Enter complete calendar dates.");
  const time = Date.parse(`${value}T00:00:00Z`);
  if (!Number.isFinite(time) || new Date(time).toISOString().slice(0, 10) !== value) throw new Error("Enter valid calendar dates.");
  return time;
}

export function compareStay({ arrival = "2026-11-08", departure = "2026-11-13", children = 3, car = "one", feeIncluded = "unknown", asOf = checkedOn } = {}) {
  const start = dateNumber(arrival), end = dateNumber(departure);
  const nights = (end - start) / 86400000;
  dateNumber(asOf);
  if (arrival < checkedOn || arrival > "2027-12-31" || departure > "2028-01-01" || nights < 1 || nights > 30) throw new Error("Choose a 1-30 night stay starting September 24, 2026 through December 31, 2027.");
  if (!Number.isInteger(children) || children < 1 || children > 5) throw new Error("Choose one to five children, with two adults.");
  if (!["none", "one", "unknown"].includes(car) || !["yes", "no", "unknown"].includes(feeIncluded)) throw new Error("Choose the car and rate-fee options.");
  return {
    arrival, departure, nights, people: children + 2, stale: asOf >= recheckOn,
    rows: suites.map(suite => {
      const capacity = suite.maximum === null ? "Capacity unresolved: confirm this exact configuration before shortlisting." : children + 2 > suite.maximum ? `Exceeds the published ${suite.maximum}-person maximum; another category or unit is needed.` : "Within the published headcount only; exact-age booking acceptance is not confirmed.";
      let dateNote = "Confirm facility operations and individual ride restrictions for these dates.";
      if (suite.id === "art-of-animation") dateNote = arrival < "2027-01-01" ? "No included check-in-day water-park benefit for this 2026 arrival." : "2027 benefit eligibility is unresolved: summer dates have not been published. Do not assume admission is included.";
      if (suite.id === "cabana-bay") {
        // Park plans can include checkout day even though hotel fees count nights.
        dateNote = departure >= "2026-10-26" && arrival < "2027-04-01"
          ? "Your stay overlaps the announced Volcano Bay closure/reopening window. Do not rely on park or walking-path access; an early reopening is not confirmed. This is not a hotel-pool closure notice."
          : "The selected dates are outside the announced Volcano Bay closure window; this does not confirm park or hotel-pool operations. Check the current calendar.";
      }
      const parking = car === "unknown" ? null : nights * suite.parking * (car === "one" ? 1 : 0);
      const resortExtra = suite.resortFee === null || feeIncluded === "unknown" ? null : feeIncluded === "yes" ? 0 : suite.resortFee * nights;
      return { id: suite.id, capacity, dateNote, parking, resortExtra };
    })
  };
}

export const escapeHtml = value => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");

export function renderChecks(result, row) {
  const money = value => `$${value.toLocaleString("en-US")}`;
  return `<p class="capacity"><strong>${escapeHtml(row.capacity)}</strong></p>
    <p>${escapeHtml(row.dateNote)}</p>
    <p><strong>Parking illustration (${result.nights} ${result.nights === 1 ? "night" : "nights"}):</strong> ${row.parking === null ? "Unknown until vehicle use is decided." : `${money(row.parking)} before any applicable tax; published parking rate only.`}</p>
${row.id === "holiday-inn" ? `<p><strong>Standard resort-fee add-on illustration:</strong> ${row.resortExtra === null ? "Unknown until your rate's inclusions are confirmed." : row.resortExtra === 0 ? "$0 added here because you selected fee already included; the fee is not free." : `${money(row.resortExtra)} before tax, only if the standard $65 nightly fee applies and is not included.`}</p>` : ""}
    <p class="unknown">Room price, taxes, tickets, cross-resort transport and complete stay total: unknown. These partial amounts cannot rank value.</p>`;
}

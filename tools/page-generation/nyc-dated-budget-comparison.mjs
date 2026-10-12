import { beaconSuite, validateBeaconSuite } from "./nyc-beacon-suite.mjs";
import { radioCityPrice, validateRadioCityPrice } from "./nyc-radio-city-price.mjs";
import { trypPrice, validateTrypPrice } from "./nyc-tryp-price.mjs";

const esc = value => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const money = cents => `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export function datedBudgetRows(records = [beaconSuite, radioCityPrice, trypPrice]) {
  if (!Array.isArray(records) || records.length !== 3) throw new Error("Invalid NYC dated comparison coverage");
  const checked = [validateBeaconSuite(records[0]), validateRadioCityPrice(records[1]), validateTrypPrice(records[2])];
  if (checked.some(r => r.currency !== "USD" || r.checked_on !== "2026-10-11" || r.arrival !== "2026-11-08" || r.departure !== "2026-11-13" || r.nights !== 5 || r.rooms !== 1 || r.adults !== 2 || r.children !== 3)) throw new Error("Mismatched NYC comparison basis");
  const [beacon, radio, tryp] = checked;
  return [
    { record: beacon, label: "Hotel Beacon", unit: "suite/night", anchor: "beacon-suite-budget-rest", charges: `${money(beacon.displayed_tax_total_cents)} displayed taxes/fees. Optional rollaway ${money(beacon.optional_rollaway_cents_per_night)}/night is not automatically included.`, checks: "Ages 4/8/12 entered, but published two-child limit conflicts with three children. Beds conflict. Weekday 9 AM-5 PM renovation notice; selected dates and actual noise unknown." },
    { record: radio, label: "Radio City Apartments", unit: "apartment/night", anchor: "radio-city-dated-price", charges: `${money(radio.displayed_tax_total_cents)} displayed taxes. Separate ${money(radio.deposit_cents)} check-in deposit is not in the stay total; refundability and hold/charge type unknown.`, checks: "Three children under 13 entered by count only; individual ages not entered. Twin versus double beds conflict; exact sleeping allocation unconfirmed." },
    { record: tryp, label: "TRYP", unit: "room/night", anchor: "tryp-family-budget", charges: `${money(tryp.displayed_fee_total_cents)} displayed fees + ${money(tryp.displayed_tax_total_cents)} tax. The ${money(tryp.displayed_fee_inclusive_nightly_cents)} nightly card already includes resort/city fees; do not add them again.`, checks: "Ages 4/8/12 entered; acceptance and bunk/sofa setup unconfirmed. One bathroom and mini refrigerator; cooking equipment not established." }
  ];
}

export function datedBudgetComparisonHtml(records) {
  const rows = datedBudgetRows(records);
  return `<section id="dated-family-budgets" class="band" aria-labelledby="dated-family-budgets-title" style="scroll-margin-top: 80px">
        <div class="container">
          <div class="section-heading"><p class="eyebrow">Dated room budgets</p><h2 id="dated-family-budgets-title">Five-person room budgets for November 8-13</h2></div>
          <p class="review-label">Checked October 11, 2026: one unit, two adults and three children, November 8-13, 2026 (five nights). Different room categories and age-input evidence; these samples are not current quotes, confirmed family acceptance or complete trip budgets.</p>
          <div class="comparison-scroll logistics-comparison" tabindex="0" role="region" aria-label="Dated five-person NYC room budget comparison">
            <table class="comparison-table dated-family-budgets">
              <thead><tr><th scope="col">Hotel / exact category</th><th scope="col">Average nightly USD</th><th scope="col">Five-night displayed total USD</th><th scope="col">Displayed charges / separate amounts</th><th scope="col">Age and room limits</th></tr></thead>
              <tbody>
${rows.map(({record:r,label,unit,anchor,charges,checks}) => `                <tr data-budget-record="${esc(r.id)}"><th scope="row"><a href="#${anchor}">${esc(label)}</a><br>${esc(r.category)}<br>${esc(r.rate_plan)}</th><td><strong>${money(r.room_total_cents / r.nights)}</strong> per ${esc(unit)} before fees/tax<br>${money(r.displayed_stay_total_cents / r.nights)} per ${esc(unit)} with displayed charges</td><td><strong>${money(r.displayed_stay_total_cents)}</strong><br>One ${esc(unit.split("/")[0])}, five nights</td><td>${esc(charges)}</td><td>${esc(checks)}</td></tr>`).join("\n")}
              </tbody>
            </table>
          </div>
          <p>Additional-charge completeness, meals, parking and transport remain unverified. Deposits and optional beds are not automatically extra stay fees. Cancellation and payment conditions remain specific to the named rate in each linked detail.</p>
        </div>
      </section>`;
}

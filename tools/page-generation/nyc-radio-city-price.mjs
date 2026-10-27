import { readFileSync } from "node:fs";

export const radioCityPricePath = "docs/research/nyc-radio-city-family-price-2026-10-11.json";
export function validateRadioCityPrice(record) {
  const fail = () => { throw new Error("Invalid Radio City dated family price record"); };
  if (record.schema_version !== 1 || record.checked_on !== "2026-10-11" || record.hotel !== "Radio City Apartments" || record.category !== "Two Bedroom Apartment" || record.rate_plan !== "Best Available Rate" || record.currency !== "USD") fail();
  if (record.arrival !== "2026-11-08" || record.departure !== "2026-11-13" || record.nights !== 5 || record.rooms !== 1 || record.adults !== 2 || record.children !== 3 || record.child_band !== "under 13" || record.individual_child_ages_entered !== false || record.bed_state !== "disputed") fail();
  const sums = [record.nightly_room_cents, record.displayed_tax_lines?.map(line => line.cents)];
  if (sums.some(values => !Array.isArray(values) || values.some(value => !Number.isSafeInteger(value) || value < 0))) fail();
  if (record.nightly_room_cents.length !== record.nights || sums[0].reduce((a, b) => a + b, 0) !== record.room_total_cents || sums[1].reduce((a, b) => a + b, 0) !== record.displayed_tax_total_cents || record.room_total_cents + record.displayed_tax_total_cents !== record.displayed_stay_total_cents || record.deposit_cents !== 25000) fail();
  if (JSON.stringify(record.sources) !== JSON.stringify(["https://www.radiocityapartments.com/en/apartments-to-rent-new-york-city/two-bedroom-apartment/", "https://radiocityapartments.book.pegsbe.com/"]) || record.unknowns?.length !== 4) fail();
  return structuredClone(record);
}
export const radioCityPrice = validateRadioCityPrice(JSON.parse(readFileSync(new URL(`../../${radioCityPricePath}`, import.meta.url), "utf8")));
const esc = value => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const money = cents => `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export function radioCityPriceHtml(record = radioCityPrice) {
  const r = validateRadioCityPrice(record);
  return `<section id="radio-city-dated-price" aria-labelledby="radio-city-price-title" style="scroll-margin-top: 80px"><h4 id="radio-city-price-title">Two-bedroom budget example</h4>
              <p><strong>Older observation, checked October 11, 2026:</strong> ${esc(r.category)}, ${esc(r.rate_plan)}, November 8-13, 2026: one apartment, five nights, two adults and three children in the booking site's under-13 band. Individual ages were not entered; this does not confirm acceptance for each child or sleeping arrangement.</p>
              <p><strong>USD ${money(r.displayed_stay_total_cents)} displayed stay total</strong>: ${money(r.room_total_cents)} room charge plus ${money(r.displayed_tax_total_cents)} displayed taxes. Average ${money(r.room_total_cents / r.nights)} per apartment/night before tax, or ${money(r.displayed_stay_total_cents / r.nights)} including displayed taxes. Actual pre-tax nights ranged from ${money(Math.min(...r.nightly_room_cents))} to ${money(Math.max(...r.nightly_room_cents))}. This dated sample is not a current quote, typical range or complete trip budget; extra-charge completeness, food, transit, parking and optional extras remain unverified.</p>
              <p><strong>Separate ${money(r.deposit_cents)} deposit per apartment due at check-in.</strong> Its refundability, refund timing and charge-versus-hold type are not established; it is not included in the displayed stay total or classified here as an extra stay fee. ${esc(r.payment)} ${esc(r.cancellation)}</p>
              <p><strong>Bed descriptions conflict:</strong> the official room page lists one queen, two twins and a sofa bed; its booking engine lists a queen, two doubles and a sofa bed. Confirm the second-bedroom beds and exact allocation before paying. Published capacity is five guests plus one child age 12 or under, not six adults or a comfort guarantee.</p>
              <p><a href="${esc(r.sources[0])}">Official two-bedroom layout</a> | <a href="${esc(r.sources[1])}">Official booking source</a>. The July studio-based comparison range and review sample elsewhere in this card retain their original dates; this apartment sample does not renew them.</p></section>`;
}

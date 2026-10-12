import { readFileSync } from "node:fs";

export const trypPricePath = "docs/research/nyc-tryp-family-price-2026-10-11.json";
export function validateTrypPrice(record) {
  const fail = () => { throw new Error("Invalid TRYP dated family price record"); };
  if (record.schema_version !== 1 || record.id !== "NYC-TRYP-FAMILY-2026-10-11" || record.hotel !== "TRYP by Wyndham New York City Times Square / Midtown" || record.checked_on !== "2026-10-11" || record.review_on !== "2026-10-18" || record.evidence_class !== "BOOKING_CHECK" || record.category !== "TRYP FAMILY" || record.rate_plan !== "Standard Rate" || record.currency !== "USD" || record.unit !== "room/night") fail();
  if (record.arrival !== "2026-11-08" || record.departure !== "2026-11-13" || record.nights !== 5 || record.rooms !== 1 || record.adults !== 2 || record.children !== 3 || record.individual_child_ages_entered !== true || JSON.stringify(record.child_ages) !== "[4,8,12]" || record.published_capacity !== 8) fail();
  const integer = value => Number.isSafeInteger(value) && value >= 0;
  const sum = values => values.reduce((a, b) => a + b, 0);
  if (JSON.stringify(record.nightly_room_cents) !== "[48900,49900,48900,51900,61900]" || !integer(record.room_total_cents) || sum(record.nightly_room_cents) !== record.room_total_cents) fail();
  if (JSON.stringify(record.nightly_fee_lines) !== JSON.stringify([{ label: "City Hotel Fee", cents: 350 }, { label: "Resort Fee", cents: 2722 }]) || !integer(record.displayed_fee_total_cents) || sum(record.nightly_fee_lines.map(line => line.cents)) * record.nights !== record.displayed_fee_total_cents) fail();
  const taxes = record.nightly_tax_lines;
  if (!Array.isArray(taxes) || taxes.length !== 5 || taxes.some((line, i) => line.date !== `2026-11-${String(8 + i).padStart(2, "0")}` || !integer(line.sales_tax_cents) || !integer(line.city_accommodation_tax_cents)) || !integer(record.displayed_tax_total_cents) || sum(taxes.map(line => line.sales_tax_cents + line.city_accommodation_tax_cents)) !== record.displayed_tax_total_cents || record.displayed_tax_total_cents !== 38573) fail();
  if (!integer(record.displayed_stay_total_cents) || record.room_total_cents + record.displayed_fee_total_cents + record.displayed_tax_total_cents !== record.displayed_stay_total_cents || record.displayed_fee_inclusive_nightly_cents !== (record.room_total_cents + record.displayed_fee_total_cents) / record.nights) fail();
  if (JSON.stringify(record.sources) !== '["https://www.wyndhamhotels.com/tryp/new-york-city-new-york/tryp-new-york-city-times-square-south-midtown/overview"]' || record.unknowns?.length !== 4 || !record.party_acceptance?.startsWith("Unconfirmed:") || !record.beds?.includes("Two queen beds") || !record.beds?.includes("unconfirmed") || !record.equipment?.includes("not established") || !record.cancellation?.includes("24 hours") || !record.cancellation?.includes("timezone") || !record.guarantee?.includes("not stated")) fail();
  return structuredClone(record);
}
export const trypPrice = validateTrypPrice(JSON.parse(readFileSync(new URL(`../../${trypPricePath}`, import.meta.url), "utf8")));
const esc = value => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const money = cents => `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export function trypPriceHtml(record = trypPrice) {
  const r = validateTrypPrice(record);
  return `<section id="tryp-family-budget" aria-labelledby="tryp-family-budget-title" style="scroll-margin-top: 80px"><h4 id="tryp-family-budget-title">Family-room budget example</h4>
              <p><strong>Checked October 11, 2026:</strong> ${esc(r.category)}, ${esc(r.rate_plan)}, November 8-13, 2026: one room, five nights, two adults and children aged 4, 8 and 12 entered individually. The published eight-guest capacity and returned rate are not final acceptance or a sleeping-allocation guarantee.</p>
              <p><strong>USD ${money(r.displayed_stay_total_cents)} displayed stay total</strong>: ${money(r.room_total_cents)} room charge + ${money(r.displayed_fee_total_cents)} fees + ${money(r.displayed_tax_total_cents)} taxes. Average ${money(r.room_total_cents / r.nights)} per room/night before fees and tax; ${money(r.displayed_stay_total_cents / r.nights)} with displayed fees and tax. Pre-fee/tax nights ranged ${money(Math.min(...r.nightly_room_cents))}-${money(Math.max(...r.nightly_room_cents))}.</p>
              <p><strong>The ${money(r.displayed_fee_inclusive_nightly_cents)} nightly card already includes fees:</strong> ${money(r.nightly_fee_lines[1].cents)} resort fee + ${money(r.nightly_fee_lines[0].cents)} City Hotel Fee per night. Do not add them again. This dated sample is not a current quote, typical range or complete trip budget; extra charges, parking and meals remain unverified.</p>
              <p>Two queens, one sofa bed, one bunk bed and one bathroom are listed. Confirm bed setup, bunk restrictions and allocation. A mini refrigerator is not an established cooking setup. ${esc(r.cancellation)} ${esc(r.guarantee)}</p>
              <p><a href="${esc(r.sources[0])}">Official room and rate source</a>. The July standard-room range and review sample retain their original dates; this exact-category check does not renew them.</p></section>`;
}

import { readFileSync } from "node:fs";

export const beaconSuitePath = "docs/research/nyc-beacon-suite-budget-rest-2026-10-11.json";
export function validateBeaconSuite(record) {
  const fail = () => { throw new Error("Invalid Beacon dated suite budget/rest record"); };
  if (record.schema_version !== 1 || record.checked_on !== "2026-10-11" || record.hotel !== "Hotel Beacon" || record.category !== "Two Bedroom Suite 800 SQ FT" || record.rate_plan !== "Regular Rates" || record.currency !== "USD") fail();
  if (record.arrival !== "2026-11-08" || record.departure !== "2026-11-13" || record.nights !== 5 || record.rooms !== 1 || record.adults !== 2 || record.children !== 3 || record.adult_band !== "Ages 13 or above" || record.child_band !== "Ages 0-12" || JSON.stringify(record.child_ages) !== "[4,8,12]" || record.individual_child_ages_entered !== true || record.party_acceptance !== "unresolved" || record.bed_state !== "disputed") fail();
  const sums = [record.nightly_room_cents, record.displayed_tax_lines?.map(line => line.cents)];
  if (sums.some(values => !Array.isArray(values) || values.some(value => !Number.isSafeInteger(value) || value < 0))) fail();
  if (sums[0].length !== record.nights || sums[0].reduce((a, b) => a + b, 0) !== record.room_total_cents || sums[1].reduce((a, b) => a + b, 0) !== record.displayed_tax_total_cents || record.room_total_cents + record.displayed_tax_total_cents !== record.displayed_stay_total_cents || record.optional_rollaway_cents_per_night !== 3000 || record.displayed_card_nightly_cents !== 220900) fail();
  const n = record.renovation_notice;
  if (!n || n.state !== "published-notice" || n.workdays !== "weekdays" || n.start_local !== "09:00" || n.end_local !== "17:00" || n.end_date !== null || n.affected_floors !== null || n.november_dates_confirmed !== false || n.actual_noise_observed !== false) fail();
  if (JSON.stringify(record.sources) !== JSON.stringify(["https://www.beaconhotel.com/rooms/two-bedroom-suite/", "https://be.synxis.com/?Hotel=33053&Chain=1037"]) || record.unknowns?.length !== 4) fail();
  return structuredClone(record);
}
export const beaconSuite = validateBeaconSuite(JSON.parse(readFileSync(new URL(`../../${beaconSuitePath}`, import.meta.url), "utf8")));
const esc = value => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const money = cents => `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export function beaconSuiteHtml(record = beaconSuite) {
  const r = validateBeaconSuite(record);
  return `<section id="beacon-suite-budget-rest" aria-labelledby="beacon-suite-title" style="scroll-margin-top: 80px"><h4 id="beacon-suite-title">Suite budget and rest-day checks</h4>
              <p><strong>Renovation notice checked October 11, 2026:</strong> the official booking source announces weekday work from 9 a.m. to 5 p.m. It does not establish an end date, affected floors, your November dates or actual noise. Confirm whether your room and dates are affected before relying on the hotel for midday rest.</p>
              <p><strong>USD ${money(r.displayed_stay_total_cents)} displayed five-night suite total</strong>: ${money(r.room_total_cents)} room charge plus ${money(r.displayed_tax_total_cents)} displayed taxes/fees. This older observation (October 11 sample) is for ${esc(r.category)}, ${esc(r.rate_plan)}, November 8-13, 2026, one suite, two adults and three children with ages 4, 8 and 12 entered individually. It is not a current quote or confirmation that this party is accepted.</p>
              <p>Derived average ${money(r.room_total_cents / r.nights)} per suite/night before tax, or ${money(r.displayed_stay_total_cents / r.nights)} including displayed taxes/fees; the booking card displays a different nightly figure of ${money(r.displayed_card_nightly_cents)}. Actual pre-tax nights ranged from ${money(Math.min(...r.nightly_room_cents))} to ${money(Math.max(...r.nightly_room_cents))}. Do not multiply the card price by five. Parking, food, transport, optional extras and complete mandatory-charge coverage remain unverified.</p>
              <p><strong>Room and party limits:</strong> the official narrative lists two doubles, a king, a queen sofa bed and two bathrooms, while the compact booking label says four double beds. Its capacity wording is up to eight guests, including up to six adults and two children; acceptance of the entered three children remains unresolved. Other results returned for this five-person search were labeled Sleeps 4, so a result alone is not capacity approval. Confirm the exact beds and registered party before paying.</p>
              <p>One optional rollaway is published at USD ${money(r.optional_rollaway_cents_per_night)} per night, or ${money(r.optional_rollaway_cents_per_night * r.nights)} before tax for five billed nights; availability, necessity and inclusion in the sample total are unknown. No facility/resort fee is stated, but displayed taxes still apply. Credit-card guarantee amount and payment timing are unconfirmed. Cancel at least two days before arrival by 3 p.m. local time to avoid a charge; the inspected policy does not state the late-charge amount.</p>
              <p><a href="${esc(r.sources[0])}">Official two-bedroom suite</a> | <a href="${esc(r.sources[1])}">Official Beacon booking source</a>. The July standard-room planning band and sampled guest reviews retain their original dates; this scoped check does not renew them.</p></section>`;
}

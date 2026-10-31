import { readFileSync } from "node:fs";
import { screenRoomPack } from "../family-room-task.mjs";
import { labelOlderStaySamples, readableComparisonCsv, roomComparisonCsv } from "../family-room-comparison.mjs";
import { contributorCredit } from "./contributors.mjs";
import { assessFamilyTransit } from "../family-transit-cost.mjs";
import { dcPlanPremiums } from "../dc-plan-premium.mjs";
import { assessMuseumRest, restDurationFields } from "../museum-rest-task.mjs";
import { siteHeader, siteEnd } from "./site-chrome.mjs";
import { readableText } from "./readable-text.mjs";
import { withLinkPreview } from "./link-previews.mjs";
import { easternDate } from "./sitemap.mjs";

export const dcPath = "where-to-stay/washington-dc-family-hotels.html";
export const dcScreenedOn = "2026-10-09";
const read = name => JSON.parse(readFileSync(new URL(`../../docs/research/${name}`, import.meta.url), "utf8"));
export const dcTransitEvidence = read("dc-family-transit-cost-2026-10-03.json");
export const dcTransitExamples = dcTransitEvidence.conditional_inputs.map(({ label, ...input }) => ({ input: { ...input, label }, result: assessFamilyTransit(dcTransitEvidence.policy, input, dcScreenedOn) }));
const owners = new Set(["dc-embassy-deluxe-double", "dc-homewood-two-queen", "dc-pendry-two-bedroom"]);
const original = read("washington-dc-room-configurations-2026-09-30.json");
const withdrawnBasis = ["September 30 rate for a November 2026 stay withdrawn October 30 because it could not be re-observed; no current price"];
export const dcPack = { ...original, evidence_scope: `${original.evidence_scope} Public selection is three categories; Residence Inn is excluded pending its exact-modal reinspection.`,
  records: original.records.filter(record => owners.has(record.id)).map(record => ["dc-embassy-deluxe-double", "dc-homewood-two-queen"].includes(record.id) ? { ...record, price: { ...record.price, missing_basis: withdrawnBasis } } : record) };
// Q17b (OWNER D9/O2, 2026-10-30 ET): the only dated rates were for a November 8-13, 2026 stay that the operator
// cannot re-observe, so they are withdrawn before that stay starts. The observation files stay in docs/research.
export const dcWithdrawnPriceFiles = ["washington-dc-embassy-price-observation-2026-09-30.json", "washington-dc-homewood-price-observation-2026-09-30.json"];
export const dcPrices = [];
export const dcRooms = screenRoomPack(dcPack, dcPack.scenario, dcScreenedOn, dcPrices);
export const dcBaseCsv = readableComparisonCsv(labelOlderStaySamples(roomComparisonCsv(dcPack, dcPack.scenario, dcScreenedOn, dcPrices)));
export const dcPremiums = dcPrices.length ? dcPlanPremiums(dcPrices) : [];
export const dcPricesWithdrawnOn = "2026-10-30";
const withdrawnRooms = new Set(["dc-embassy-deluxe-double", "dc-homewood-two-queen"]);
// Q17b re-observation (D8/D20): Google Hotels listing prices via DataForSEO for 2 adults + kids 4, 8, 12, January 15-20, 2027.
// A figure is used only when exactly one unpaid row matches the hotel and the 1-night control shows it is a nightly price
// (within 10% of the 5-night figure). Room type is not shown by Google, so it is the hotel's listing, not the exact suite.
export const dcGoogleReceiptFile = "dataforseo-q17b-dc-hotel-prices-2026-10-30.json";
const googleReceipt = read(dcGoogleReceiptFile);
const etDate = iso => new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(iso.replace(" +00:00", "Z").replace(" ", "T")));
function googleSample(prefix) {
  const find = label => googleReceipt.searches.find(search => search.label === label);
  const five = find(`${prefix}-5n`), one = find(`${prefix}-1n`);
  const only = search => search && search.matched.length === 1 && !search.matched[0].is_paid && search.matched[0].currency === "USD" && Number.isInteger(search.matched[0].price) && search.matched[0].price > 0 ? search.matched[0].price : null;
  const nightly = only(five), control = only(one);
  if (nightly === null || control === null || Math.abs(nightly - control) > nightly * 0.1) return null;
  if (five.party.adults !== 2 || five.party.child_ages.join() !== "4,8,12" || five.nights !== 5) return null;
  return { nightly, control, check_in: five.check_in, check_out: five.check_out, nights: five.nights, observed_on: etDate(five.checked_at), hotel: five.matched[0].title };
}
export const dcGoogleSamples = { "dc-embassy-deluxe-double": googleSample("dc-embassy"), "dc-homewood-two-queen": googleSample("dc-homewood"), "dc-pendry-two-bedroom": googleSample("dc-pendry") };
// The sample drops on its arrival date, so a passed stay is never shown as a planning price.
export const dcToday = process.env.FT_BUILD_DATE || easternDate();
export const dcLiveSample = (id, today = dcToday) => { const sample = dcGoogleSamples[id]; return sample && today < sample.check_in ? sample : null; };
const dollars = value => `$${Number(value).toLocaleString("en-US")}`;
const sampleBasis = sample => `Google Hotels listing seen ${monthDay(sample.observed_on)}, ${sample.observed_on.slice(0, 4)}, for 2 adults and kids 4, 8 and 12, ${sample.nights} nights ${stayRange(sample)} (${dollars(sample.control)} on a 1-night search). Room type not shown; taxes and fees may not be included. Not a quote.`;
// "January 15 to 20, 2027": the sample drops on its arrival date (dcLiveSample; tools/this-week.mjs re-renders this page daily).
const stayRange = sample => `${monthDay(sample.check_in)} to ${Number(sample.check_out.slice(8, 10))}, ${sample.check_in.slice(0, 4)}`;
const monthDay = iso => new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", { month: "long", day: "numeric", timeZone: "UTC" });
const pendrySearch = googleReceipt.searches.find(search => search.label === "dc-pendry-5n");
const pendryGap = `Google Hotels showed no price for 2 adults and kids 4, 8 and 12, ${monthDay(pendrySearch.check_in)} to ${Number(pendrySearch.check_out.slice(8, 10))}, ${pendrySearch.check_in.slice(0, 4)} (checked ${monthDay(etDate(pendrySearch.checked_at))}, ${etDate(pendrySearch.checked_at).slice(0, 4)}).`;
// Glance band across priced hotels, e.g. "$212-$222"; null when no sample is live.
export const dcGlanceBand = (today = dcToday) => { const values = dcRooms.map(room => dcLiveSample(room.id, today)?.nightly).filter(Number.isFinite); return values.length ? (Math.min(...values) === Math.max(...values) ? dollars(values[0]) : `${dollars(Math.min(...values))}-${dollars(Math.max(...values))}`) : null; };
const quickPrice = (id, today) => { const sample = dcLiveSample(id, today); return sample ? ` About ${dollars(sample.nightly)} a night.` : " No price seen."; };
const cellBasis = sample => `Google Hotels listing seen ${monthDay(sample.observed_on)}, ${sample.observed_on.slice(0, 4)}, for 2 adults and kids 4, 8 and 12, ${stayRange(sample)}. Hotel listing, room type not shown; taxes and fees may be extra. Not a quote.`;
const sampleLine = (room, today) => { const sample = dcLiveSample(room.id, today); return sample ? `<strong>About ${dollars(sample.nightly)} a night</strong><p>${e(cellBasis(sample))}</p>` : null; };
const q = value => `"${String(value).replaceAll('"', '""')}"`;
export const dcCsvFor = (today = dcToday) => {
  const lines = dcBaseCsv.split("\n");
  return lines.map((line, index) => {
    if (!line) return line;
    if (index === 0) return `${line},${["Google Hotels listing (USD per night)", "Listing stay", "Listing seen", "Listing basis"].map(q).join(",")}`;
    const room = dcRooms[index - 1], sample = dcLiveSample(room.id, today);
    return `${line},${(sample ? [sample.nightly, `${sample.check_in} to ${sample.check_out}`, sample.observed_on, sampleBasis(sample)] : ["", "", "", room.id === "dc-pendry-two-bedroom" ? pendryGap : "January 2027 listing sample dropped at its arrival date; get a live quote for your dates."]).map(q).join(",")}`;
  }).join("\n");
};
export const dcCsv = dcCsvFor();
const restRecord = read("dc-rest-time-budget-2026-10-03.json");
const museumRecord = read("washington-dc-museum-rest-task-2026-10-03.json");
export const dcRestExample = assessMuseumRest(museumRecord,
  "National Museum of Natural History", restRecord.hypothetical_durations, dcScreenedOn);
const restLabels = ["Morning visit", "Museum to room", "Room rest", "Room to museum", "Entry wait", "Afternoon visit"];
const e = value => String(readableText(value)).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
const amount = value => `USD ${Number(value).toFixed(2)}`;
const link = (url, label) => `<a href="${e(url)}">${e(label)}</a>`;
const band = room => room.price.rates ? room.price.rates.map(rate => `${amount(rate.nightly_average)} ${e(rate.plan)}`).join(" / ") : "No current price";
const unpricedNote = room => withdrawnRooms.has(room.id) ? "Get a quote on Hilton's site for your dates and each child's age. Our sample for a November 2026 stay could not be re-checked, so it was removed October 30." : `${pendryGap} Get a quote on Pendry's site for your dates and each child's age.`;
const premium = (room, rate) => {
  const result = dcPremiums.find(row => row.record_id === room.id && row.plan === rate.plan);
  return result.stay_increment === 0 ? "Baseline" : `${amount(result.stay_increment)} / five-night stay<p>Approx. ${amount(result.nightly_increment)} / night equivalent</p>`;
};
const cooking = record => record.kitchen === "published-kitchen" ? record.checks.find(check => check.startsWith("Full kitchen lists")) : record.checks.find(check => /Microwave and mini|Coffee\/minibar/.test(check));

export function dcMuseumVisitContext(record = museumRecord) {
  const museum = record.museum_constraints.find(row => row.museum === "National Museum of Natural History");
  const source = record.sources.find(row => row.id === museum?.source_id);
  if (source?.status !== "body-inspected" || source.evidence_class !== "OFFICIAL_VISITOR_FACT" ||
      source.url !== "https://naturalhistory.si.edu/visit" || source.inspected_on !== "2026-10-03" ||
      museum.published_daily_open !== "10:00" || museum.published_daily_close !== "17:30" ||
      museum.closed_date_exception !== "December25" || museum.future_november_operation_confirmed !== false ||
      museum.general_admission?.amount !== 0 || museum.general_admission.currency !== "USD" ||
      museum.general_admission.unit !== "general museum admission/person" || museum.general_admission.tickets_required !== false ||
      museum.general_admission.special_paid_experiences_included !== false || museum.room_return_duration_minutes !== null ||
      museum.second_entry_wait_minutes !== null || museum.specific_hotel_route !== null || museum.stroller_route_assessed !== false ||
      museum.packed_lunch !== "Must be stored away during visit and eaten outside; no lunch seating or refrigerated lunch storage offered" ||
      museum.storage !== "No coat, bag or locker storage offered" ||
      museum.screening !== "Published visitor page requires security screening for visitors; no queue duration or expedited re-entry claim" ||
      record.editorial_derivation.published_nmnh_window_minutes !== 450)
    throw new Error("Natural History public context needs reviewed visitor-source reconciliation");
  return `<div id="nmnh-visit-context" data-museum-visit-context><h3>Natural History: lunch and entry constraints</h3>
<ul><li><strong>Dated hours:</strong> ${e(museum.published_daily_open)}-${e(museum.published_daily_close)} daily; closed December 25. The ${record.editorial_derivation.published_nmnh_window_minutes}-minute opening window is not usable visit time or confirmation of November operation.</li>
<li><strong>General admission:</strong> ${e(museum.general_admission.currency)} ${museum.general_admission.amount} per person; no general-admission ticket required. Paid experiences, food and transport are not included.</li>
<li><strong>Packed lunch:</strong> keep it stored away during the visit and eat outside. No lunch seating or refrigerated lunch storage is offered.</li>
<li><strong>Bags and entry:</strong> security screening is required; no coat, bag or locker storage is offered. Queue time and return-entry conditions remain unknown.</li></ul>
<p>${link(source.url, "Official Natural History visitor source")} &middot; facts checked ${e(source.inspected_on)}. October 11, 2026 recheck unavailable; these facts have not been renewed. Confirm visit-date hours, lunch arrangements and return-entry rules before relying on a hotel-rest plan.</p></div>`;
}

export function dcFamilyRailForm() {
  return `<div id="family-rail-budget" class="dc-rail-budget"><h3>Your family rail budget</h3>
<p>Regular pay-as-you-go rail only. Separately charged journeys, not train changes. October 3, 2026 fare evidence, not a current station-pair quote or confirmation of future service.</p>
<form id="family-rail-form" hidden><div class="dc-rail-inputs">
<label for="rail-adults">Paying adults<input id="rail-adults" name="adults" type="number" min="1" max="20" step="1" inputmode="numeric" autocomplete="off" required></label>
<label for="rail-children">Children (0-17)<select id="rail-children" name="children" required><option value="">Unknown</option>${Array.from({length:7},(_,i)=>`<option value="${i}">${i}</option>`).join("")}</select></label>
<label for="rail-trips">Charged rail journeys<input id="rail-trips" name="rail_trips" type="number" min="1" max="100" step="1" inputmode="numeric" autocomplete="off" required></label>
<label class="dc-rail-period" for="rail-period">Fare period<select id="rail-period" name="fare_period" required><option value="">Unknown</option><option value="weekday-day">Weekday 5am-9:30pm</option><option value="weekday-late">Weekday after 9:30pm</option><option value="weekend">Weekend</option></select></label></div>
<fieldset id="family-rail-age-group" hidden><legend>Child ages on the travel date</legend><div id="family-rail-ages" class="dc-rail-inputs"></div></fieldset>
<div class="dc-rail-actions"><button type="submit">Calculate rail budget</button><button type="reset">Clear rail values</button></div></form>
<p id="family-rail-status" class="dc-rail-status" role="status" aria-live="polite" aria-atomic="true">Rail budget unresolved. Party, ages, journeys and fare period are unknown.</p>
<script type="application/json" id="family-rail-policy">${JSON.stringify(dcTransitEvidence.policy).replaceAll("<", "\\u003c")}</script></div>`;
}

function priceGlance(today) {
  const band = dcGlanceBand(today), samples = dcRooms.map(room => dcLiveSample(room.id, today)).filter(Boolean), sample = samples[0];
  if (!band) return `<p class="dc-price-figure">Price: not shown</p><p class="dc-price-basis">We have no current price for these suites. Get a quote for your own dates and every child's age.</p>`;
  const low = Math.min(...samples.map(row => row.nightly)), high = Math.max(...samples.map(row => row.nightly));
  const stay = low === high ? dollars(low * sample.nights) : `${dollars(low * sample.nights)}-${dollars(high * sample.nights)}`;
  return `<p class="dc-price-figure">About ${band} a night</p><p class="dc-price-basis">${sample.nights} nights ≈ ${stay} (estimate). 2 adults + kids 4, 8, 12 · ${stayRange(sample)} · Google Hotels hotel listings, any room type, seen ${monthDay(sample.observed_on)} · not a quote; taxes and fees may be extra.</p>`;
}
export function dcFamilyHotelPage(today = dcToday) {
  const canonical = `https://familytripwise.com/${dcPath}`;
  const title = "Washington DC Family Hotels: Suites, Kitchens & What to Price";
  const schema = { "@context": "https://schema.org", "@type": "WebPage", name: title, url: canonical, dateModified: dcPricesWithdrawnOn, publisher: { "@type": "Organization", name: "Family Tripwise", url: "https://familytripwise.com/" } };
  return withLinkPreview(`<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title><meta name="description" content="Compare three exact Washington DC suite categories by sleeping setup and kitchen evidence, with the age, fee and price checks to make before booking.">
<link rel="canonical" href="${canonical}"><link rel="stylesheet" href="../styles.css"><link rel="stylesheet" href="../washington-dc-comparison.css?v=ft-d23b">
<script type="application/ld+json">${JSON.stringify(schema)}</script></head>
<body class="dc-page">
${siteHeader("../", "where-to-stay/washington-dc-family-hotels.html", { skipLabel: "Skip to comparison" })}
<main id="main"><section class="dc-intro"><p class="eyebrow">Washington DC</p><h1>Washington DC family hotels</h1>
${contributorCredit()}
<p class="dc-lede">Three DC suites that sleep 5: pick by kitchen, bedrooms or price.</p>
<div class="answer-box dc-answer">${priceGlance(today)}
<ul class="dc-quick"><li><strong>Need a full kitchen?</strong> Homewood Suites, Downtown (two queens plus a sofa bed).${quickPrice("dc-homewood-two-queen", today)}</li><li><strong>Want two bedrooms and two bathrooms?</strong> Pendry, The Wharf (up to 4 adults; the sofa is for children).${quickPrice("dc-pendry-two-bedroom", today)}</li><li><strong>Microwave and mini-fridge are enough?</strong> Embassy Suites, Convention Center (bedroom plus living room with a sofa bed).${quickPrice("dc-embassy-deluxe-double", today)}</li></ul>
<p class="dc-price-basis">Family of 4? Price your own party; rates can differ.</p></div>
<p>Three suites that each list a maximum of 5, not a best-hotel ranking. Room facts checked September 30, 2026.</p>
<div class="dc-links"><a href="#comparison">Compare rooms</a><a href="#prices">What to price</a><a href="#rail-budget">Family rail budget</a><a href="#rest">Museum-day rest</a><a href="../downloads/washington-dc-family-hotels.csv" download>Download full comparison CSV</a><a href="../family-itinerary/washington-dc-with-kids.html">3-day family itinerary</a></div><figure class="licensed-photo hero-photo"><img src="../images/washington-dc-national-mall.webp" width="1600" height="1038" loading="eager" fetchpriority="high" decoding="async" alt="Historic aerial view of the National Mall, with the Lincoln Memorial, Washington Monument and US Capitol."><figcaption>National Mall, 2005. US Navy photo by Chief Photographer's Mate Johnny Bivera; <a href="https://commons.wikimedia.org/wiki/File:WashingtonDCMallAerialNavyPhoto.jpg">source and public domain record</a>. Resized and cropped.</figcaption></figure></section>
<section id="comparison"><h2>One room configuration for five</h2>
<p><strong>Example:</strong> 2 adults, kids 4, 8 and 12, five nights, no car. ${dcGlanceBand(today) ? "Prices are January 2027 hotel listings, not quotes." : "No current price is shown; check live rates."}</p>
<div class="dc-toolbar" hidden><label><input id="kitchen-only" type="checkbox"> Published cooking kitchen only</label><p id="comparison-status" role="status" aria-live="polite">3 room categories</p></div>
<div class="dc-table-scroll" tabindex="0" role="region" aria-label="Room comparison"><table><caption>Dated published categories; prices to get for your own dates</caption><thead><tr><th scope="col">Exact category</th><th scope="col">Sleeping &amp; capacity</th><th scope="col">Cooking</th><th scope="col">Price: check your dates</th></tr></thead><tbody>
${dcRooms.map((room, index) => `<tr data-room="${room.id}" data-kitchen="${room.kitchen}"><th scope="row"><a href="#${room.id}">${e(room.hotel)}</a><p>${e(room.category)}</p></th><td>${e(room.sleeping_setup)}<p>Published maximum ${dcPack.records[index].configurations[0].maximum}${dcPack.records[index].configurations[0].max_adults !== null ? `, no more than ${dcPack.records[index].configurations[0].max_adults} adults` : ""}; ${room.conditions.length ? "confirm who sleeps where" : "confirm your kids' ages"}.</p></td><td>${e(cooking(dcPack.records[index]))}<p>${room.kitchen === "published-kitchen" ? "Dining equipment quantities for five remain unknown." : "No stove listed."}</p></td><td>${sampleLine(room, today) ?? `<strong>${band(room)}</strong><p>${room.price.rates ? "September 30 sample across public plans. Displayed government tax included; additional charges unknown. Unconfirmed child-age basis." 
: unpricedNote(room)}</p>`}</td></tr>`).join("\n")}
</tbody></table></div><p>Homewood's standard two-queen suite is not its Premium category: the maintained Premium card says four, not five. Pendry's sofa for up to two children is not an overall child-count rule.</p></section>
<section id="prices"><h2>What to price before booking</h2>
<p><strong>Budget gap:</strong> ${dcGlanceBand(today) ? "our figures are hotel listings for one January week, not these suites; Pendry showed none." : "we have no current rate for any of these suites."} For each suite:</p>
<ol class="dc-price-steps"><li>Quote the same room category for your dates.</li><li>Enter every child's age, not just a count. Hilton lists adults as 18+, but its September 30 room checks took counts only, not individual ages, so its child-age band is unknown.</li><li>Add taxes and any sofa-bed, parking or other mandatory fees.</li><li>Note the deposit and the cancellation deadline.</li></ol>
${dcRooms.map((room, index) => `<article id="${room.id}" class="dc-room" data-room="${room.id}" data-kitchen="${room.kitchen}"><h3>${e(room.hotel)}</h3><p><strong>${e(room.category)}</strong></p><p>${e(room.sleeping_setup)}</p>${room.conditions.length ? `<p>${room.conditions.map(e).join("; ")}</p>` : ""}
${room.conflicts.length ? `<p class="dc-caution">${room.conflicts.map(e).join("; ")}</p>` : ""}
${room.price.rates ? `<div class="dc-table-scroll" tabindex="0" role="region" aria-label="${e(room.hotel)} dated rates"><table class="dc-rate-table"><caption>Older observation September 30, 2026 &middot; November 8-13 &middot; one configuration &middot; 2 adults / 3 children counts only</caption><thead><tr><th scope="col">Public plan</th><th scope="col">Displayed five-night total</th><th scope="col" data-plan-premium>Extra vs Non-refundable</th><th scope="col">Cancellation / payment</th></tr></thead><tbody>${room.price.rates.map(rate => `<tr><th scope="row">${e(rate.plan)}</th><td>${amount(rate.stay_amount)}</td><td data-plan-premium>${premium(room, rate)}</td><td>${e(rate.cancellation)}<p>${e(rate.meals)}</p></td></tr>`).join("")}</tbody></table></div>
<p>Approximate configuration-night samples are in the <a href="#comparison">comparison table</a>.</p>` : ""}
<p><strong>Unresolved before booking:</strong> confirm the actual bed-sharing and sofa setup, every child's age, mandatory or sofa charges, incidentals authorization and current cancellation terms. ${e(cooking(dcPack.records[index]))}</p>
<details class="how-checked"><summary>How we checked</summary><p>${link(room.source_url, "Official category source")} &middot; facts checked ${room.checked_on}.</p>${room.price.rates ? `<p>${e(room.price.fee_basis)}</p><p>${e(room.price.deposit_basis)}</p><p>${e(room.price.observation_limitation)}</p><p>${link(room.price.source_url, "Dated booking-check source")}; checked ${room.price.observed_on}, not checked again at launch.</p>` : ""}</details></article>`).join("\n")}</section>
<section id="rail-budget"><h2>What could extra family rail trips cost?</h2>
<p><strong>Dated planning example:</strong> two adults and children aged 4, 8 and 12. WMATA's October 3, 2026 policy check allows up to two accompanied children younger than 5 free per paying adult. Here, age 4 is free; two adults plus ages 8 and 12 give four regular-fare riders. No visiting-student discount is assumed.</p>
<div class="dc-table-scroll" tabindex="0" role="region" aria-label="Conditional family rail budget"><table><caption>USD per family / stated number of separately charged rail trips, not per night or a route quote</caption><thead><tr><th scope="col">Hypothetical extra trips</th><th scope="col">Dated fare basis</th><th scope="col">Four paying riders</th></tr></thead><tbody>
${dcTransitExamples.map(({ input, result }) => `<tr><th scope="row">${input.rail_trips} separately charged rail trips</th><td>${input.fare_period === "weekday-day" ? "Weekday daytime, 5am-9:30pm" : "Weekend"}<p>${amount(dcTransitEvidence.policy.rail_fare_bands[input.fare_period].minimum_cents / 100)}-${amount(dcTransitEvidence.policy.rail_fare_bands[input.fare_period].maximum_cents / 100)} per paying rider / one-way journey</p></td><td><strong>${result.minimum === null ? "Unresolved" : `${amount(result.minimum)}-${amount(result.maximum)}`}</strong><p>Conditional network band, not actual trip cost.</p></td></tr>`).join("\n")}
</tbody></table></div>
<p>Two trips might mean one extra outward-and-back room-rest journey; four means four separately charged journeys, not four trains. An internal rail interchange does not by itself add another paid journey. Passes, eligible transfers and payment-media arrangements may change cost and are not applied here.</p>
${dcFamilyRailForm()}
<p class="dc-caution">The station pair, travel time, actual service, trip count and visit-date fare remain unknown. These amounts do not establish a workable rest return or a room-plus-transport all-fee budget. Fare source checked October 3; check current fares before the trip. Recheck ${link(dcTransitEvidence.policy.source.url, "WMATA fares and child eligibility")} and ${link(dcTransitEvidence.corroborating_source.url, "WMATA new-rider guidance")} for the actual trip. Hotel property check dates are unchanged.</p></section>
<section id="rest"><h2>Can you return for a museum-day rest?</h2><p>This comparison does not establish a child-paced, entrance-to-room return, stroller route, queue time, re-entry or useful rest duration for any of these hotels. A property address or map walking estimate cannot answer that task. Choose the museum entrance, hotel category and actual rest window before relying on a midday return; include meals, internal hotel travel and the second activity.</p><p>Indoor-pool operation, meal seating and dietary fit also remain separate checks. None of the rooms is presented as a verified nap-friendly or safest base.</p>
${dcMuseumVisitContext()}
<div id="rest-budget" class="dc-rest-budget"><h3>Museum-day time budget</h3>
<p>Conditional minutes only, not a hotel recommendation. Available time must reflect the actual visit date and opening, entry and re-entry limits; these are not verified here. Journey estimates include entrance-to-room travel; meals and internal hotel travel need time too. Blank durations are unknown, not zero.</p>
<form id="rest-budget-form" hidden>
<label class="dc-rest-window" for="rest-available">Available museum-day minutes<input id="rest-available" name="available_minutes" type="number" min="0.01" max="1440" step="any" inputmode="decimal" autocomplete="off"></label>
<fieldset><legend>Planned minutes</legend><div class="dc-rest-inputs">${restDurationFields.map((key, index) => `<label for="rest-${key}">${restLabels[index]}<input id="rest-${key}" name="${key}" type="number" min="0" max="1440" step="any" inputmode="decimal" autocomplete="off"></label>`).join("")}</div></fieldset>
<div class="dc-rest-actions"><button type="submit">Calculate time budget</button><button type="reset">Clear values</button></div></form>
<p id="rest-budget-status" class="dc-rest-status" role="status" aria-live="polite" aria-atomic="true">Time budget unresolved. Available minutes and all six durations are unknown.</p>
<details class="dc-rest-example"><summary>Hypothetical time example</summary><p>${restDurationFields.map((key, index) => `${restLabels[index]} ${dcRestExample.durations[key]}`).join(" + ")} = ${dcRestExample.total_required_minutes} planned minutes. A hypothetical ${dcRestExample.published_window_minutes}-minute allowance leaves ${dcRestExample.remaining_window_minutes} minutes. No spare time at ${dcRestExample.published_window_minutes} planned minutes; exceeding it creates a shortfall.</p><p>Original October 3, 2026 task arithmetic, not observed journeys, current opening hours, a November schedule or re-entry permission. Actual hotel-return feasibility remains unknown. Neither this example nor a positive calculation establishes a workable rest return.</p></details></div>
</section>
<section id="methodology"><h2>How we checked this page</h2><p>Research, not firsthand hotel reviews: we have not stayed in these suites, tested journeys or verified family suitability.</p><details class="how-checked"><summary>Evidence types, sources and download basis</summary><p>Published property facts, Google Hotels listing prices (collected through DataForSEO for one stated party and stay; not checked on the hotels' own sites), rail-fare arithmetic and unresolved questions are kept separate. This is a focused three-category comparison, not a representative DC hotel ranking. A published maximum does not confirm inventory, sleeping comfort or provider acceptance.</p><p>The downloadable CSV has one row per suite category with room facts and open checks, regardless of the on-page kitchen filter. Its September 30 rate samples for a November 2026 stay were removed October 30 because they could not be re-checked. It adds the Google Hotels listing price (USD per night, stay dates, date seen and basis) where one was shown; the listing drops once its stay dates start. No inputs are transmitted or saved, and no live inventory is queried.</p><p>${link("../about.html", "How Family Tripwise handles evidence and uncertainty")}</p></details></section>
</main>${siteEnd("../", "where-to-stay/washington-dc-family-hotels.html")}<script src="../washington-dc-comparison.js?v=ft-imp093" defer></script><script type="module" src="../shared/museum-rest-budget.mjs?v=ft-imp102"></script><script type="module" data-rail-client src="../shared/family-rail-budget.mjs?v=ft-imp118"></script></body></html>\n`);
}

export function writeWashingtonDcFamilyHotelsPage(writeSite, today = dcToday) {
  writeSite(dcPath, dcFamilyHotelPage(today));
  writeSite("downloads/washington-dc-family-hotels.csv", dcCsvFor(today));
  for (const file of ["rest-time-budget.mjs", "museum-rest-budget.mjs", "family-transit-cost.mjs", "family-rail-budget.mjs"])
    writeSite(`shared/${file}`, readFileSync(new URL(`../../src/shared/${file}`, import.meta.url), "utf8"));
}

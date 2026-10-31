import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { screenRoomPack, validateRoomPack } from "../family-room-task.mjs";
import { validDate } from "../hotel-evidence.mjs";
import { labelOlderStaySamples, readableComparisonCsv, roomComparisonCsv } from "../family-room-comparison.mjs";
import { contributorCredit } from "./contributors.mjs";
import { validateRoomPrices } from "../family-room-price.mjs";
import { bostonMuseumAdmission } from "../boston-museum-admission.mjs";
import { parkPlazaFitnessPolicy } from "../boston-park-plaza-policy.mjs";
import { assessBreakfastUpgrade } from "../../src/shared/breakfast-upgrade-budget.mjs";
import { siteHeader, siteEnd } from "./site-chrome.mjs";
import { readableText } from "./readable-text.mjs";
import { withLinkPreview } from "./link-previews.mjs";
import { googleHotelSample, liveSample, readReceipt, dollars, stayRange, seenText, stayEstimate, dropDate, shortRangeCompact, shortSeen } from "./google-hotel-samples.mjs";
import { easternDate } from "./sitemap.mjs";

export const bostonPath = "where-to-stay/boston-family-hotels.html";
export const bostonScreenedOn = "2026-10-09";
const read = name => JSON.parse(readFileSync(new URL(`../../docs/research/${name}`, import.meta.url), "utf8"));
const original = read("boston-room-configurations-2026-10-01.json");
const owners = new Set(["boston-fenway-two-bedroom-tobt", "boston-park-plaza-deluxe-double", "boston-four-seasons-plaza", "boston-langham-club-two-bedroom"]);
// Q17b (2026-10-31): the November 8-13, 2026 example stay and its rates were withdrawn; the example task now uses the
// January 15-20, 2027 dates of the Google Hotels listing, and record text that pointed to the withdrawn rates is restated.
const q17bText = { "Pre-tax flexible quote in separate dated observation; full taxes/mandatoryfees/deposit unknown": "Older November 2026 rate withdrawn October 31; full taxes/mandatory fees/deposit unknown",
  "Use separate October3 exact-age/date flexible observation; not final all-fee cost": "October 3 rate for a November 2026 stay withdrawn October 31 (could not be re-observed); no current exact-party price",
  "Check exact individual ages and public plan for Nov8-13": "Check exact individual ages and public plan for your dates" };
const restate = list => list.map(text => q17bText[text] ?? text);
const q17bRecord = record => ({ ...record, checks: restate(record.checks), price: { ...record.price, missing_basis: restate(record.price.missing_basis ?? []) } });
const priorPack = { ...original, scenario: { ...original.scenario, stay: { arrival: "2027-01-15", departure: "2027-01-20" } }, evidence_scope: "Four conditional five-person categories from the maintained seven-category pack; not a representative best-hotel ranking or booking acceptance.", records: original.records.filter(record => owners.has(record.id)).map(q17bRecord) };
export const bostonPlazaEvidence = read("boston-four-seasons-family-budget-2026-10-09.json");

export function bostonPackForDate(asOf, evidence = bostonPlazaEvidence) {
  if (!validDate(asOf) || evidence?.schema_version !== 1 || evidence.record_id !== "boston-four-seasons-plaza" ||
      evidence.hotel !== "Four Seasons Hotel Boston" || evidence.category !== "Plaza Suite" ||
      evidence.source?.url !== "https://www.fourseasons.com/boston/accommodations/specialty_suites/plaza-suite/" ||
      !validDate(evidence.source.checked_on) || evidence.source.checked_on < original.checked_on ||
      evidence.facts?.kitchen !== "published-kitchen" || evidence.facts.appliances_verified !== false ||
      evidence.facts.maximum_adults !== 2 || evidence.facts.maximum_children !== 4 || evidence.facts.bedrooms !== 2 ||
      evidence.facts.pricing_basis !== "monthly-call-to-book" || evidence.budget?.status !== "held-no-exact-task-price" ||
      evidence.budget.amount !== null || evidence.budget.price_observed_on !== null || evidence.budget.currency !== "USD" ||
      evidence.budget.unit !== "configuration/night" ||
      !Array.isArray(evidence.checks) || !evidence.checks.length ||
      ![evidence.facts.beds, evidence.facts.kitchen_description, evidence.budget.limitation].every(value => typeof value === "string" && value.trim()))
    throw new Error("Invalid Boston Plaza Suite facts or unpriced basis");
  const refreshed = { ...priorPack, checked_on: evidence.source.checked_on,
    sources: { ...priorPack.sources, "four-plaza-detail": evidence.source },
    records: priorPack.records.map(record => record.id !== evidence.record_id ? record : {
      ...record, source_id: "four-plaza-detail", kitchen: evidence.facts.kitchen,
      sleeping_setup: evidence.facts.beds, checks: evidence.checks,
      price: { ...record.price, missing_basis: [evidence.budget.limitation] }
    }) };
  const errors = validateRoomPack(refreshed);
  if (errors.length) throw new Error(errors.join("; "));
  return asOf < evidence.source.checked_on ? priorPack : refreshed;
}
export const bostonPack = bostonPackForDate(bostonScreenedOn);
export const bostonExcluded = original.records.filter(record => !owners.has(record.id));
// Q17b (OWNER D9/O2, 2026-10-31 ET): the only dated rates were for a November 8-13, 2026 stay that the operator
// cannot re-observe, so they are withdrawn before that stay starts. The observation files stay in docs/research and
// still back the historical breakfast-upgrade arithmetic tests; nothing from them is rendered.
export const bostonWithdrawnPriceFiles = ["boston-fenway-price-observation-2026-10-03.json", "boston-park-plaza-count-price-normalization-2026-10-09.json"];
export const bostonWithdrawnPrices = bostonWithdrawnPriceFiles.flatMap(read);
export const bostonPrices = [];
export const bostonPricesWithdrawnOn = "2026-10-31";
// Q17b re-observation (D8/D20): Google Hotels listing via DataForSEO, 2 adults + kids 4, 8, 12, January 15-20, 2027,
// used only under the shared 10% 1-night control rule (google-hotel-samples.mjs). Room type and room count not shown.
export const bostonGoogleReceiptFile = "dataforseo-q17b-six-pages-a-2026-10-31.json";
const bostonReceipt = readReceipt(bostonGoogleReceiptFile);
export const bostonParkPlazaGoogle = googleHotelSample(bostonReceipt, "bos-park-plaza", { title: "Hilton Boston Park Plaza", childAges: [4, 8, 12] });
const fenwaySearch = bostonReceipt.searches.find(search => search.label === "bos-residence-inn-5n");
// This page is not re-rendered daily, so the listing leaves a week before arrival (tools/boston-google-sample.test.mjs
// fails from that date until the page is regenerated).
export const bostonDropDaysEarly = 7;
export const bostonToday = process.env.FT_BUILD_DATE || easternDate();
export const bostonLiveSample = (id, today = bostonToday) => id === "boston-park-plaza-deluxe-double" ? liveSample(bostonParkPlazaGoogle, today, bostonDropDaysEarly) : null;
export const bostonSampleDrop = dropDate(bostonParkPlazaGoogle, bostonDropDaysEarly);
export const bostonRooms = screenRoomPack(bostonPack, bostonPack.scenario, bostonScreenedOn, bostonPrices);
export const bostonBaseCsv = readableComparisonCsv(labelOlderStaySamples(roomComparisonCsv(bostonPack, bostonPack.scenario, bostonScreenedOn, bostonPrices)));
const q = value => `"${String(value).replaceAll('"', '""')}"`;
const listingBasis = sample => `Google Hotels hotel listing seen ${seenText(sample)} for 2 adults and kids 4, 8 and 12, ${sample.nights} nights ${stayRange(sample)} (${dollars(sample.control)} on a 1-night search). Room type and number of rooms not shown; taxes and fees may be extra. Not a quote.`;
const csvGap = (room, sample) => sample ? listingBasis(sample)
  : room.id === "boston-park-plaza-deluxe-double" ? "January 2027 listing removed a week before its stay; get a live quote for your dates."
  : room.id === "boston-fenway-two-bedroom-tobt" ? `Google Hotels showed no price for this hotel for 2 adults and kids 4, 8 and 12, January 15 to 20, 2027 (checked ${seenText({ observed_on: bostonParkPlazaGoogle.observed_on })}). Older November 2026 rate removed October 31.`
  : "No price seen for this category.";
export const bostonCsvFor = (today = bostonToday) => bostonBaseCsv.split("\n").map((line, index) => {
  if (!line) return line;
  if (index === 0) return `${line},${["Google Hotels listing (USD per night)", "Listing stay", "Listing seen", "Listing basis"].map(q).join(",")}`;
  const room = bostonRooms[index - 1], sample = bostonLiveSample(room.id, today);
  return `${line},${(sample ? [sample.nightly, `${sample.check_in} to ${sample.check_out}`, sample.observed_on] : ["", "", ""]).concat(csvGap(room, sample)).map(q).join(",")}`;
}).join("\n");
export const bostonCsv = bostonCsvFor();
export const bostonDiningScreenedOn = "2026-10-10";
export const bostonDiningCsv = readableComparisonCsv(labelOlderStaySamples(roomComparisonCsv(bostonPack, bostonPack.scenario, bostonDiningScreenedOn, bostonPrices,
  { kitchen: "published", capacity: "not-excluded", minimum_dining_seats: 5 })));
const e = value => String(readableText(value)).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
const amount = value => `USD ${Number(value).toFixed(2)}`;
const link = (url, label) => `<a href="${e(url)}">${e(label)}</a>`;
const cooking = room => room.id === bostonPlazaEvidence.record_id ? bostonPlazaEvidence.facts.kitchen_description : room.kitchen === "published-kitchen" ? "Published stovetop, oven, full refrigerator, microwave and dishwasher; dining table seats four, fifth dining place unknown." : "Cooking kitchen not established. A dining-service Private Kitchen label is not guest cooking equipment.";
const band = room => room.price.rates ? room.price.rates.map(rate => `<p><strong>${amount(rate.nightly_average)}</strong><br>${e(rate.plan)}</p>`).join("") : "<strong>Unpriced</strong>";
const party = room => room.id === "boston-fenway-two-bedroom-tobt" ? "Individual ages 4, 8 and 12 were entered and retained in the October 3 search. No reservation or bed-allocation confirmation." : "October 1 search entered 2 adult / 3 child counts only. Adult label 18+; child-age band and individual age acceptance unknown.";

export function bostonDiningSection() {
  const kitchens = bostonPack.records.filter(room => room.kitchen === "published-kitchen");
  return `<!-- FT-IMP-095 dining start -->
<section id="dining-five"><h2 style="scroll-margin-top:128px">Cooking and a table for five</h2>
<p>Neither kitchen suite confirms a table for five: Residence Inn's table seats four, and the Four Seasons suite lists no seat count.</p>
<details class="how-checked"><summary>Dining details and download</summary>
<p>For the same two-adult, ages 4, 8 and 12 task, a cooking kitchen does not establish five places at one dining table. Fenway's exact TOBT record lists four table seats; a fifth place remains unknown. Four Seasons Plaza Suite has published cooking facilities but no established dining-seat count. Neither record confirms a five-place table.</p>
<div class="dc-table-scroll" tabindex="0" role="region" aria-label="Cooking and dining places"><table><caption>Maintained exact-category evidence &middot; assembled October 10, 2026, not a new hotel inspection</caption><thead><tr><th scope="col">Cooking category</th><th scope="col">Recorded dining table</th><th scope="col">Five-person meal check</th></tr></thead><tbody>
${kitchens.map(room => `<tr><th scope="row">${e(room.hotel)}<p>${e(room.category)}</p></th><td>${room.dining_seats ? `${room.dining_seats.count} seats &middot; recorded ${e(room.dining_seats.checked_on)}` : `Count not established &middot; cooking evidence checked ${e(bostonPack.sources[room.source_id].checked_on)}`}</td><td>${room.dining_seats ? "Below five recorded table places; confirm a fifth place or a different meal arrangement." : "Dining seating and usable equipment remain unknown; the monthly call-to-book category is also unpriced for this stay."} ${link(bostonPack.sources[room.source_id].url, "Official category source")}</td></tr>`).join("\n")}
</tbody></table></div>
<p>The separate dining-check file retains the unpriced Plaza category with unresolved seating; it is not a verified meal-fit shortlist. Fenway's four-seat table is excluded only from this minimum-five-place task, not from the complete room comparison. Recorded seat counts do not establish child-seat geometry, high-chair availability or current equipment. Original room and fee dates are unchanged.</p>
<p><a href="../downloads/boston-cooking-dining-five.csv" download>Download unresolved dining checks CSV</a></p></details></section>
<!-- FT-IMP-095 dining end -->
`;
}
const breakfastEvidence = read("boston-breakfast-upgrade-task-2026-10-09.json");

// Historical arithmetic on the withdrawn November 8-13 observation; tested, not rendered since Q17b.
export function bostonBreakfastUpgrade(prices = bostonWithdrawnPrices, evidence = breakfastEvidence) {
  const observations = prices.filter(record => record.record_id === evidence.record_id);
  const observation = observations[0];
  if (observations.length !== 1 || validateRoomPrices(observations, bostonPack).length ||
      evidence.evidence_class !== "REUSED_BOOKING_CHECK_POLICY_AND_PAGE_ONLY_PROXY_TASK" ||
      evidence.source_observed_on !== observation.checked_on || evidence.source_url !== observation.source_url ||
      evidence.meal_scope.registered_adults_included !== true || evidence.meal_scope.children_age_lte !== 5 ||
      evidence.meal_scope.credit_deducted !== false || observation.currency !== "USD" ||
      JSON.stringify(observation.party) !== JSON.stringify({ adults: evidence.scenario.adults, child_ages: evidence.scenario.child_ages }) ||
      observation.arrival !== evidence.scenario.arrival || observation.departure !== evidence.scenario.departure || observation.nights !== evidence.scenario.nights)
    throw new Error("Mismatched Boston breakfast observation or policy");
  const plans = [evidence.comparison.baseline_plan, evidence.comparison.upgrade_plan].map(name => {
    const matches = observation.rates.filter(rate => rate.plan === name && rate.eligibility === "public");
    if (matches.length !== 1) throw new Error("Missing or ambiguous public breakfast plan");
    return matches[0];
  });
  if (plans[0].cancellation !== plans[1].cancellation) throw new Error("Different breakfast cancellation basis");
  // A new meal, fee or booking basis requires requalification of the derived comparison.
  const terms = { category: observation.category, configuration_count: observation.configuration_count,
    engine_party: observation.engine_party,
    terms: plans.map(rate => ({ plan: rate.plan, meals: rate.meals, cancellation: rate.cancellation })),
    fee_basis: observation.fee_basis, deposit_basis: observation.deposit_basis };
  if (createHash("sha256").update(JSON.stringify(terms)).digest("hex") !== evidence.maintained_terms_sha256)
    throw new Error("Boston breakfast source terms changed; review required");
  const cents = plans.map(rate => Math.round(rate.stay_amount * 100));
  if (cents.some(value => !Number.isSafeInteger(value)) || cents[1] < cents[0]) throw new Error("Invalid breakfast total cents");
  const increment = cents[1] - cents[0];
  return { observation, plans, stay_increment: increment / 100, nightly_equivalent: Math.round(increment / observation.nights) / 100,
    included_adults: observation.party.adults,
    included_child_ages: observation.party.child_ages.filter(age => age <= evidence.meal_scope.children_age_lte),
    uncovered_child_ages: observation.party.child_ages.filter(age => age > evidence.meal_scope.children_age_lte) };
}

function breakfastMenuBlock() {
  return `<div id="park-plaza-breakfast" data-room="boston-park-plaza-deluxe-double" data-kitchen="not-established" class="dc-room">${bostonBreakfastMenuSection()}</div>`;
}

function breakfastSection() {
  const budget = bostonBreakfastUpgrade();
  return `<div id="breakfast-upgrade" data-room="${e(budget.observation.record_id)}" data-kitchen="not-established" class="dc-room"><h3>Park Plaza: what does breakfast add?</h3>
<p><strong>${amount(budget.stay_increment)} more for the five-night sampled stay</strong> than Flexible Rate, equivalent to ${amount(budget.nightly_equivalent)} per configuration/night. The increment is calculated from the two displayed stay totals in the <a href="#${e(budget.observation.record_id)}">Park Plaza rate table</a>, before rounding the nightly equivalent. Both plans had the same November 5 hotel-local cancellation deadline and card-guarantee terms.</p>
<div class="dc-table-scroll" tabindex="0" role="region" aria-label="Park Plaza breakfast upgrade"><table><caption>Older observation October 1, 2026 &middot; 2 Double Beds Deluxe Guestroom &middot; November 8-13, five nights &middot; 1 room / 2 adults / 3 child counts</caption><thead><tr><th scope="col">Dated public plan</th><th scope="col">Breakfast scope for requested ages 4, 8 and 12</th></tr></thead><tbody>
<tr><th scope="row">${e(budget.plans[0].plan)}</th><td>Room only. No included breakfast established.</td></tr>
<tr><th scope="row">${e(budget.plans[1].plan)}</th><td>Registered adults and children aged 5 and under: ${budget.included_adults} adults and age ${budget.included_child_ages.join(", ")} within published meal scope. Ages ${budget.uncovered_child_ages.join(" and ")} outside that inclusion; their breakfast cost is unknown.</td></tr>
</tbody></table></div>
<p class="dc-caution">Not breakfast for all five, and not a value winner: compare the dated increment above with what the covered guests would otherwise spend. No number of breakfasts, food-credit savings or older-child meal price is assumed. Displayed tax and destination fee are already included once; extra bedding, other charges and actual meal service remain unresolved. The original search retained child counts, not individual age acceptance.</p>
<p>${link(budget.observation.source_url,"Dated official booking-check source")} &middot; source and prices observed October 1; comparison assembled October 9, not re-priced; check live rates before booking. This is a historical planning comparison, not a current offer or full-family food budget.</p>
${bostonBreakfastBudgetSection()}
${bostonBreakfastMenuSection()}</div>`;
}

const breakfastMenuEvidence = read("boston-park-plaza-breakfast-menu-2026-10-11.json");

export function bostonBreakfastMenuSection(evidence = breakfastMenuEvidence) {
  if (evidence?.schema_version !== 1 || evidence.record_id !== "boston-park-plaza-deluxe-double" ||
      evidence.source_url !== "https://www.hilton.com/en/hotels/bossrhh-hilton-boston-park-plaza/dining/off-the-common/" ||
      !validDate(evidence.observed_on) || !validDate(evidence.review_due) || evidence.review_due <= evidence.observed_on ||
      evidence.venue !== "Off the Common" || evidence.breakfast_hours?.weekdays !== "Monday-Friday 6:30-11 am" ||
      evidence.breakfast_hours?.weekends !== "Saturday-Sunday 7-11 am" || evidence.breakfast_hours.stay_date_service_confirmed !== false ||
      evidence.price_basis?.currency !== null || evidence.price_basis.unit !== "general menu entry, not an age-specific quote" ||
      evidence.price_basis.tax_included !== false || evidence.price_basis.menu_stated_meals_tax_percent !== 7 ||
      evidence.price_basis.menu_stated_group_gratuity_percent !== 18 || evidence.price_basis.menu_stated_gratuity_group_minimum !== 6 ||
      evidence.price_basis.child_prices_established !== false || evidence.price_basis.package_menu_equivalence_established !== false ||
      evidence.price_basis.credit_eligibility_established !== false ||
      JSON.stringify(evidence.menu) !== JSON.stringify([{ name: "Premium Buffet", displayed_amount: 38 },
        { name: "Buttermilk Pancakes", displayed_amount: 22 }, { name: "Breakfast Cereal", displayed_amount: 10 },
        { name: "Regular or Decaf Coffee", displayed_amount: 7 }]))
    throw new Error("Boston breakfast menu basis changed; requalification required");
  return `<!-- FT-IMP-104 menu start -->
<section id="breakfast-menu"><h3 style="scroll-margin-top:128px">Park Plaza breakfast: menu and timing checks</h3>
<p>${e(evidence.venue)} publishes breakfast hours of ${e(evidence.breakfast_hours.weekdays)} and ${e(evidence.breakfast_hours.weekends)}. Published hours, not confirmed service for your dates. A Breakfast Included rate seen October 1 covered adults and kids 5 and under, not ages 8 and 12.</p>
<details class="how-checked"><summary>Menu prices and what to ask</summary>
<div class="dc-table-scroll" tabindex="0" role="region" aria-label="Park Plaza general breakfast menu"><table><caption>Official breakfast menu checked ${e(evidence.observed_on)} &middot; general menu entries, not child-specific quotes</caption><thead><tr><th scope="col">Menu entry</th><th scope="col">Printed amount</th><th scope="col">Basis still to confirm</th></tr></thead><tbody>
${evidence.menu.map(item => `<tr><th scope="row">${e(item.name)}</th><td>${e(item.displayed_amount)}</td><td>Currency not labeled on the source; child-age applicability and complete meal cost unknown.</td></tr>`).join("\n")}
</tbody></table></div>
<p>The menu states ${e(evidence.price_basis.menu_stated_meals_tax_percent)}% meals tax is added and ${e(evidence.price_basis.menu_stated_group_gratuity_percent)}% gratuity is added for groups of ${e(evidence.price_basis.menu_stated_gratuity_group_minimum)} or more. Other charges and gratuity for this five-person task remain unresolved. No credit is deducted.</p>
<p>An October 1 Hilton booking check showed a Breakfast Included plan covering registered adults and children 5 and under, so not ages 8 and 12; ask whether your rate includes breakfast. Menu amounts are not child prices. ${link(evidence.source_url, "Official breakfast menu and hours")} &middot; menu observed ${e(evidence.observed_on)}; check current menu and hours before booking.</p></details></section>
<!-- FT-IMP-104 menu end -->`;
}

export function bostonBreakfastBudgetBasis() {
  const budget = bostonBreakfastUpgrade();
  const config = { adults: budget.included_adults, included_children: budget.included_child_ages.length,
    upgrade_cents: Math.round(budget.stay_increment * 100), maximum_mornings: budget.observation.nights + 1 };
  assessBreakfastUpgrade(config);
  return config;
}

export function bostonBreakfastBudgetSection() {
  const config = bostonBreakfastBudgetBasis();
  const example = assessBreakfastUpgrade(config, { adult_cost: 25, child_cost: 10, mornings: 5 });
  return `<!-- FT-IMP-103 breakfast start -->
<div id="breakfast-budget" class="dc-rest-budget"><h3>Separate breakfasts versus the dated upgrade</h3>
<p>This fixed comparison covers two registered adults and requested child age 4 only, not ages 8 and 12. Meal amounts and mornings below are hypothetical, not observed prices or confirmed included breakfasts. The six calendar dates in November 8-13 do not establish six meal entitlements. Credits, actual service, child-age acceptance and older-child meals remain unresolved.</p>
<script id="breakfast-budget-basis" type="application/json">${JSON.stringify(config)}</script>
<form id="breakfast-budget-form" hidden><fieldset><legend>Hypothetical covered-guest meals</legend><div class="dc-rest-inputs">
<label for="breakfast-adult">Per adult / breakfast, USD<input id="breakfast-adult" name="adult_cost" type="number" min="0" max="10000" step="0.01" inputmode="decimal" autocomplete="off"></label>
<label for="breakfast-child">Age 4 / breakfast, USD<input id="breakfast-child" name="child_cost" type="number" min="0" max="10000" step="0.01" inputmode="decimal" autocomplete="off"></label>
<label for="breakfast-mornings">Hypothetical mornings<input id="breakfast-mornings" name="mornings" type="number" min="0" max="${config.maximum_mornings}" step="1" inputmode="numeric" autocomplete="off"></label>
</div></fieldset><div class="dc-rest-actions"><button type="submit">Compare breakfast costs</button><button type="reset">Clear meal estimates</button></div></form>
<p id="breakfast-budget-status" class="dc-rest-status" role="status" aria-live="polite" aria-atomic="true">Comparison unresolved. All three hypothetical inputs are unknown.</p>
<p>For example, five hypothetical mornings at USD 25 per adult and USD 10 for age 4 total ${amount(example.alternative_cents / 100)} for those three guests, ${amount(Math.abs(example.difference_cents) / 100)} ${example.comparison} the dated ${amount(config.upgrade_cents / 100)} increment. This is conditional arithmetic, not current meal pricing, guaranteed savings or a booking recommendation. No food credits are deducted.</p></div>
<!-- FT-IMP-103 breakfast end -->`;
}
const bookingChecks = {
  "boston-fenway-two-bedroom-tobt": ["Confirm sofa allocation and a fifth dining place; no rollaway or extra occupancy is established by a crib.", "Obtain current taxes, mandatory charges, payment timing and card-hold terms. Optional valet was USD 72/day (USD 85 outside standard times), excluded from this no-car task.", "Confirm registered-child breakfast terms, dietary needs, internet entitlement and current pool service.", "Check the actual museum-to-room return and usable rest time. MBTA's October 3 published age-11-and-under band includes ages 4 and 8, not 12; two adults plus age 12 imply three regular-fare riders unless another eligibility applies. Current fare, transfers, payment and stroller access remain unverified."],
  "boston-park-plaza-deluxe-double": ["Confirm each child's age, the fifth sleeping place, rollaway availability and any extra bedding charge.", "Obtain a current same-category rate, all mandatory charges, card-hold amount and exact cancellation terms.", "Breakfast-included terms cover the adults and age 4, not ages 8 and 12; obtain their meal costs before comparing plans.", "Check room separation and the actual museum-to-room return before relying on a rest break."],
  "boston-four-seasons-plaza": bostonPlazaEvidence.checks,
  "boston-langham-club-two-bedroom": ["Confirm the complete bed list and exact age acceptance for the named two-bedroom category.", "Obtain a same-task price, club child-access and meal terms, extra bedding, mandatory charges, cancellation and card-hold terms.", "Confirm guest cooking equipment separately from dining-service wording, and check the actual museum-to-room return."]
};

function parkPlazaPolicyNote() {
  const policy = parkPlazaFitnessPolicy();
  return `<p id="park-plaza-gym-policy" class="dc-caution" style="scroll-margin-top:128px"><strong>Destination-fee benefit, not children's gym access:</strong> the published daily USD ${policy.evidence.fee.displayed_daily_amount} mandatory destination charge includes ${e(policy.evidence.fitness.facility)} access, but its facilities are for hotel guests aged ${policy.evidence.fitness.minimum_guest_age} and over, with a first-visit waiver. Ages ${policy.excluded_child_ages.join(", ")} are outside that access band. Do not count this as a children's indoor activity or assume a fee exemption or deduction. Google listing prices may not include it; no extra-bed charge is established. ${link(policy.source_url,"Official gym and destination-fee policy")} inspected October 10, 2026; check current terms before booking. Actual service for your stay dates remains unverified.</p>`;
}

function museumBudgetSection() {
  const budget = bostonMuseumAdmission();
  return `<div id="museum-budget" class="dc-room"><h3>Children's Museum: admission before a room-rest plan</h3>
<p>Children's Museum general admission for this family of 5: ${amount(budget.amount)} before fees (published October 9).</p>
<details class="how-checked"><summary>Ticket details, fees and re-entry</summary><div class="dc-table-scroll" tabindex="0" role="region" aria-label="Museum admission budget"><table><caption>October 9, 2026 published admission &middot; two adults and children aged 4, 8 and 12 &middot; ordinary general admission, not a date-specific ticket quote</caption><thead><tr><th scope="col">Budget component</th><th scope="col">Dated amount or boundary</th></tr></thead><tbody>
<tr><th scope="row">Standard tickets</th><td>${amount(budget.evidence.admission.standard_admission.amount)} per person aged one or older &times; ${budget.tickets} = <strong>${amount(budget.amount)} admission component</strong>. Not a final checkout total.</td></tr>
<tr><th scope="row">Transaction fee</th><td>${amount(budget.transaction_fee)} per transaction. The store says the price will include this fee; keep it separate here and do not add it again to an inclusive checkout quote. Tax inclusion is unknown.</td></tr>
<tr><th scope="row">Leave for the hotel, then return?</th><td>Ordinary admission allows an all-day stay, except TJX $1 Sunday Afternoon tickets. That does not establish exit and re-entry permission or whether another ticket is needed.</td></tr>
</tbody></table></div>
<p>USD is our interpretation of the dollar symbol at this US venue. Future-date availability, final taxes and fees, discounts and actual hotel-return/rest time remain unverified. Published tickets are non-refundable; transfer to another date is subject to availability. Discounts or membership cannot be applied after purchase.</p>
<p>${link(budget.source_url,"Official general-admission source")} &middot; inspected October 9; reused here, not checked again; check current admission before buying. No ticket purchase, date-specific quote or hotel-price renewal.</p></details></div>`;
}

const unpricedNote = room => room.id === "boston-fenway-two-bedroom-tobt" ? "Google Hotels showed no price for January 15 to 20, 2027. Our older November rate was removed October 31." : room.id === bostonPlazaEvidence.record_id ? "Booked by phone; no price seen." : room.id === "boston-park-plaza-deluxe-double" ? "Our January 2027 listing was removed a week before its stay; check live rates." : "No price seen for this suite.";
const quickPrice = (id, today) => { const sample = bostonLiveSample(id, today); return sample ? ` Hotel listing about ${dollars(sample.nightly)} a night.` : " No price seen."; };
function priceGlance(today) {
  const sample = bostonLiveSample("boston-park-plaza-deluxe-double", today);
  if (!sample) return `<p class="dc-price-figure">Price: not shown</p><p class="dc-price-basis">We have no current price for these rooms. Get a quote for your own dates and every child's age.</p>`;
  return `<p class="dc-price-figure">About ${dollars(sample.nightly)} a night</p><p class="dc-price-basis">Hilton Boston Park Plaza listing, room type not confirmed · ${sample.nights} nights ≈ ${stayEstimate(sample)} (estimate) · 2 adults + kids 4, 8, 12 · ${shortRangeCompact(sample)} · Google Hotels, seen ${shortSeen(sample)} · not a quote; taxes and the daily destination charge may be extra.</p>`;
}
const priceCell = (room, today) => { const sample = bostonLiveSample(room.id, today); return sample ? `<strong>About ${dollars(sample.nightly)} a night</strong><p>Google Hotels listing seen ${e(seenText(sample))}, for 2 adults and kids 4, 8 and 12, ${e(stayRange(sample))}. Room type and number of rooms not shown; taxes and fees may be extra. Not a quote.</p>` : `<strong>No current price</strong><p>${e(unpricedNote(room))}</p>`; };

export function bostonFamilyHotelPage(today = bostonToday) {
  const canonical = `https://familytripwise.com/${bostonPath}`;
  const title = "Boston Family Hotels: Rooms for 5, Kitchens & Prices to Check";
  const schema = { "@context": "https://schema.org", "@type": "WebPage", name: title, url: canonical, dateModified: bostonPricesWithdrawnOn, publisher: { "@type": "Organization", name: "Family Tripwise", url: "https://familytripwise.com/" } };
  return withLinkPreview(`<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title><meta name="description" content="Compare four exact Boston room categories for a five-person task, with kitchen evidence, bedding limits, a dated January 2027 price listing and the fees to check.">
<link rel="canonical" href="${canonical}"><link rel="stylesheet" href="../styles.css"><link rel="stylesheet" href="../washington-dc-comparison.css?v=ft-d23b">
<script type="application/ld+json">${JSON.stringify(schema)}</script></head>
<body class="dc-page">${siteHeader("../", "where-to-stay/boston-family-hotels.html", { skipLabel: "Skip to comparison" })}
<main id="main"><section class="dc-intro"><p class="eyebrow">Boston</p><h1>Boston family hotels</h1>
${contributorCredit()}
<p class="dc-lede">Boston rooms for a family of 5: pick by kitchen, bedrooms or price.</p>
<div class="answer-box dc-answer">${priceGlance(today)}
<ul class="dc-quick"><li><strong>Need a kitchen and two bedrooms?</strong> Residence Inn Back Bay/Fenway two-bedroom suite (king, queen and sofa bed; two bathrooms).${quickPrice("boston-fenway-two-bedroom-tobt", today)}</li><li><strong>Two double beds are enough?</strong> Hilton Boston Park Plaza deluxe room (no kitchen; a family of 5 must ask for a fifth bed).${quickPrice("boston-park-plaza-deluxe-double", today)}</li><li><strong>Splurge suite with a kitchen?</strong> Four Seasons Plaza Suite (king and sofa bed; booked by phone).${quickPrice(bostonPlazaEvidence.record_id, today)}</li></ul>
<p class="dc-price-basis">Kitchen suites: no price seen yet; check the hotel's site for your dates. Family of 4: Park Plaza's standard two-double room lists up to 4 guests; price your own dates.</p></div>
<p>Four room categories to check for five (The Langham's two-bedroom suite is in the table), not a best-hotel ranking. Room facts checked October 1-9, 2026.</p>
<div class="dc-links"><a href="#comparison">Compare rooms</a><a href="#prices">What to price</a><a href="#excluded">Rooms that do not fit five</a><a href="../downloads/boston-family-hotels.csv" download>Download full comparison CSV</a><a href="../family-itinerary/boston-with-kids.html">3-day family itinerary</a></div><figure class="licensed-photo hero-photo"><img src="../images/boston-skyline.webp" style="object-position:50% 75%" width="1120" height="840" loading="eager" fetchpriority="high" decoding="async" alt="Boston skyline in a 2019 photograph."><figcaption>Boston, August 31, 2019. Photo by <a href="https://www.flickr.com/photos/ajay_suresh">Ajay Suresh</a>, via <a href="https://commons.wikimedia.org/wiki/File:Boston_-_Skyline_(48718902556).jpg">Wikimedia Commons</a>, <a href="https://creativecommons.org/licenses/by/2.0/">CC BY 2.0</a>. Resized and cropped.</figcaption></figure></section>
<section id="comparison"><h2>One configuration for a five-person task</h2><p><strong>Example:</strong> 2 adults, kids 4, 8 and 12, five nights, no car. ${bostonLiveSample("boston-park-plaza-deluxe-double", today) ? "The one price is a January 2027 hotel listing, not a quote." : "No current price is shown; check live rates."} Published maximum occupancy is not confirmed sleeping comfort or acceptance; a crib is not a place for these children.</p>
<div class="dc-toolbar" hidden><label><input id="kitchen-only" type="checkbox"> Published cooking kitchen only</label><p id="comparison-status" role="status" aria-live="polite">4 room categories</p></div>
<div class="dc-table-scroll" tabindex="0" role="region" aria-label="Room comparison"><table><caption>Exact categories; prices to get for your own dates</caption><thead><tr><th scope="col">Exact category</th><th scope="col">Sleeping &amp; capacity</th><th scope="col">Cooking</th><th scope="col">Price: check your dates</th></tr></thead><tbody>
${bostonRooms.map((room,index)=>`<tr data-room="${room.id}" data-kitchen="${room.kitchen}"><th scope="row"><a href="#${room.id}">${e(room.hotel)}</a><p>${e(room.category)}</p></th><td>${e(room.sleeping_setup)}<p>Published maximum ${bostonPack.records[index].configurations[0].maximum}${bostonPack.records[index].configurations[0].max_adults !== null ? `, no more than ${bostonPack.records[index].configurations[0].max_adults} adults and ${bostonPack.records[index].configurations[0].max_children} children in this configuration` : ""}. ${room.conditions.map(e).join("; ")}</p></td><td>${e(cooking(room))}</td><td>${priceCell(room, today)}</td></tr>`).join("\n")}
</tbody></table></div><p>Fenway's kitchen belongs to its exact two-bedroom TOBT category. Four Seasons is Hotel Boston, not One Dalton; its published child configuration does not settle older-child bed allocation. Langham's full bedroom bed list remains unresolved.</p></section>
${bostonDiningSection()}<section id="prices"><h2>What to price before booking</h2><p><strong>Budget gap:</strong> only Park Plaza has a price here, and it is a Google Hotels listing, not a quote for this room. Price the same room for your dates with every child's age, then add taxes, the destination charge, extra-bed charges and the deposit.</p>
${breakfastMenuBlock()}
${bostonRooms.map(room=>`<article id="${room.id}" class="dc-room" data-room="${room.id}" data-kitchen="${room.kitchen}"><h3>${e(room.hotel)}</h3><p><strong>${e(room.category)}</strong></p><p>${e(room.sleeping_setup)}</p><p>${room.conditions.map(e).join("; ")}</p>${room.conflicts.length ? `<p class="dc-caution">${room.conflicts.map(e).join("; ")}</p>` : ""}
${room.price.rates ? `<p>${party(room)}</p><div class="dc-table-scroll" tabindex="0" role="region" aria-label="${e(room.hotel)} dated rates"><table><caption>Older observation ${room.price.observed_on} &middot; November 8-13 &middot; one configuration &middot; requested 2 adults / ages 4, 8 and 12</caption><thead><tr><th scope="col">Public plan</th><th scope="col">Displayed five-night total</th><th scope="col">Cancellation / meals</th></tr></thead><tbody>${room.price.rates.map(rate=>`<tr><th scope="row">${e(rate.plan)}</th><td>${amount(rate.stay_amount)}</td><td>${e(rate.cancellation)}<p>${e(rate.meals)}</p></td></tr>`).join("")}</tbody></table></div><p>Approximate configuration-night samples are in the <a href="#comparison">comparison table</a>.</p>` : bostonLiveSample(room.id, today) ? `<p><strong>About ${dollars(bostonLiveSample(room.id, today).nightly)} a night:</strong> ${e(listingBasis(bostonLiveSample(room.id, today)))} ${stayEstimate(bostonLiveSample(room.id, today))} for ${bostonLiveSample(room.id, today).nights} nights is our estimate.</p>` : `<p><strong>No current price:</strong> ${e(unpricedNote(room))} Compare the same category and every child's age before deciding cost.</p>`}
${room.id === bostonPlazaEvidence.record_id ? `<p>${e(cooking(room))} ${e(bostonPlazaEvidence.budget.limitation)}</p>` : ""}<p><strong>Before booking:</strong></p><ul>${bookingChecks[room.id].map(check=>`<li>${e(check)}</li>`).join("")}</ul>${room.id === "boston-park-plaza-deluxe-double" ? parkPlazaPolicyNote() : ""}<details class="how-checked"><summary>How we checked</summary><p>${link(room.source_url,"Official category source")} &middot; facts checked ${room.checked_on}.</p>${room.price.rates ? `<p>${e(room.price.fee_basis)}</p><p>${e(room.price.deposit_basis)}</p><p>${e(room.price.observation_limitation)}</p><p>${link(room.price.source_url,"Dated booking-check source")}; checked ${room.price.observed_on}, not checked again at launch. ${room.id.includes("park-plaza") ? "USD retained from saved observation; not a new provider ISO currency verification." : "USD retained from the dated booking check."}</p>` : ""}</details></article>`).join("\n")}</section>
<section id="excluded"><h2>Room names that do not establish space for five</h2><p>Three other room types we checked list a maximum of 3 or 4, so they do not fit five.</p><details class="how-checked"><summary>Which rooms and why</summary><div class="dc-table-scroll" tabindex="0" role="region" aria-label="Excluded room categories"><table><caption>Published limits for the named single-configuration task</caption><thead><tr><th scope="col">Property / exact category</th><th scope="col">Published maximum</th><th scope="col">Do not substitute</th></tr></thead><tbody>${bostonExcluded.map(room=>`<tr><th scope="row">${e(room.hotel)}<p>${e(room.category)}</p></th><td>${room.configurations[0].maximum}</td><td>${room.checks.map(e).join("; ")}</td></tr>`).join("")}</tbody></table></div><p>A generic guest selector, a kitchen, a requested connecting room or marketing Family Suite wording cannot increase these exact-category limits. No connecting bundle or unobserved category price is invented.</p></details></section>
<section id="rest"><h2>Rest, transit and review checks still matter</h2><p>We have not tested a child-paced Aquarium or Children's Museum entrance-to-room return, stroller route, queues, re-entry or usable rest duration. A neighborhood label or map estimate cannot guarantee a nap-friendly base. Check the actual hotel entrance, room, activity and rest window; current pool operation and meal logistics are separate checks.</p>
${museumBudgetSection()}
<p>Two selected Family-labeled Fenway review bodies, inspected October 3, describe April/May 2026 King Studio stays posted in June, with translation markers. They prompt breakfast-variety and kettle questions, not established defects, representative ratings or five-person TOBT evidence. Older pool, sofa and noise reports were not renewed. We have not stayed in these hotels; none is a verified safety or firm suitability recommendation.</p>
</section>
<section id="methodology"><h2>How we checked this page</h2><details class="how-checked"><summary>Evidence types, sources and download basis</summary><p>Official published categories, dated booking observations, arithmetic estimates, limited review signals and unresolved questions are distinct. The complete CSV uses the same validated four-category room records; its last columns carry the dated Google Hotels listing (Park Plaza only) or why no price is shown. Older November 8-13, 2026 rates were removed October 31 because they could not be re-checked before that stay. It does not change when the kitchen filter is active; the three excluded controls are shown separately on the page, not exported as candidates.</p><p>Room limits are a headcount screen, not a reservation or bed-sharing assurance. A Google Hotels figure is used only when the hotel's exact title shows one price in both the 5-night search and a 1-night control within 10%, so it reads as a nightly price; it is the hotel's listing for that party, not this exact room. No live inventory is queried, and no inputs are saved or transmitted.</p><p>${link("../about.html","How Family Tripwise handles evidence and uncertainty")}</p></details></section></main>${siteEnd("../", "where-to-stay/boston-family-hotels.html")}<script src="../washington-dc-comparison.js?v=ft-imp093" defer></script></body></html>\n`);
}
export function writeBostonFamilyHotelsPage(writeSite) {
  writeSite(bostonPath,bostonFamilyHotelPage());
  writeSite("downloads/boston-family-hotels.csv",bostonCsvFor());
  writeSite("downloads/boston-cooking-dining-five.csv",bostonDiningCsv);
  for (const file of ["breakfast-upgrade-budget.mjs", "breakfast-upgrade-form.mjs"])
    writeSite(`shared/${file}`, readFileSync(new URL(`../../src/shared/${file}`, import.meta.url), "utf8"));
}

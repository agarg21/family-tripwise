import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { screenRoomPack, validateRoomPack } from "../family-room-task.mjs";
import { validDate } from "../hotel-evidence.mjs";
import { roomComparisonCsv } from "../family-room-comparison.mjs";
import { contributorCredit } from "./contributors.mjs";
import { validateRoomPrices } from "../family-room-price.mjs";
import { bostonMuseumAdmission } from "../boston-museum-admission.mjs";
import { parkPlazaFitnessPolicy } from "../boston-park-plaza-policy.mjs";

export const bostonPath = "where-to-stay/boston-family-hotels.html";
export const bostonScreenedOn = "2026-10-09";
const read = name => JSON.parse(readFileSync(new URL(`../../docs/research/${name}`, import.meta.url), "utf8"));
const original = read("boston-room-configurations-2026-10-01.json");
const owners = new Set(["boston-fenway-two-bedroom-tobt", "boston-park-plaza-deluxe-double", "boston-four-seasons-plaza", "boston-langham-club-two-bedroom"]);
const priorPack = { ...original, evidence_scope: "Four conditional five-person categories from the maintained seven-category pack; not a representative best-hotel ranking or booking acceptance.", records: original.records.filter(record => owners.has(record.id)) };
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
export const bostonPrices = ["boston-fenway-price-observation-2026-10-03.json", "boston-park-plaza-count-price-normalization-2026-10-09.json"].flatMap(read);
export const bostonRooms = screenRoomPack(bostonPack, bostonPack.scenario, bostonScreenedOn, bostonPrices);
export const bostonCsv = roomComparisonCsv(bostonPack, bostonPack.scenario, bostonScreenedOn, bostonPrices);
const e = value => String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
const amount = value => `USD ${Number(value).toFixed(2)}`;
const link = (url, label) => `<a href="${e(url)}">${e(label)}</a>`;
const cooking = room => room.id === bostonPlazaEvidence.record_id ? bostonPlazaEvidence.facts.kitchen_description : room.kitchen === "published-kitchen" ? "Published stovetop, oven, full refrigerator, microwave and dishwasher; dining table seats four, fifth dining place unknown." : "Cooking kitchen not established. A dining-service Private Kitchen label is not guest cooking equipment.";
const band = room => room.price.rates ? room.price.rates.map(rate => `<p><strong>${amount(rate.nightly_average)}</strong><br>${e(rate.plan)}</p>`).join("") : "<strong>Unpriced</strong>";
const party = room => room.id === "boston-fenway-two-bedroom-tobt" ? "Individual ages 4, 8 and 12 were entered and retained in the October 3 search. No reservation or bed-allocation confirmation." : "October 1 search entered 2 adult / 3 child counts only. Adult label 18+; child-age band and individual age acceptance unknown.";
const breakfastEvidence = read("boston-breakfast-upgrade-task-2026-10-09.json");

export function bostonBreakfastUpgrade(prices = bostonPrices, evidence = breakfastEvidence) {
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

function breakfastSection() {
  const budget = bostonBreakfastUpgrade();
  return `<div id="breakfast-upgrade" data-room="${e(budget.observation.record_id)}" data-kitchen="not-established" class="dc-room"><h3>Park Plaza: what does breakfast add?</h3>
<p><strong>${amount(budget.stay_increment)} more for the five-night sampled stay</strong> than Flexible Rate, equivalent to ${amount(budget.nightly_equivalent)} per configuration/night. The increment is calculated from the displayed stay totals, before rounding the nightly equivalent. Both plans had the same November 5 hotel-local cancellation deadline and card-guarantee terms.</p>
<div class="dc-table-scroll" tabindex="0" role="region" aria-label="Park Plaza breakfast upgrade"><table><caption>October 1, 2026 observation &middot; 2 Double Beds Deluxe Guestroom &middot; November 8-13, five nights &middot; 1 room / 2 adults / 3 child counts</caption><thead><tr><th scope="col">Dated public plan</th><th scope="col">Displayed stay total, USD</th><th scope="col">Breakfast scope for requested ages 4, 8 and 12</th></tr></thead><tbody>
<tr><th scope="row">${e(budget.plans[0].plan)}</th><td>${amount(budget.plans[0].stay_amount)}</td><td>Room only. No included breakfast established.</td></tr>
<tr><th scope="row">${e(budget.plans[1].plan)}</th><td>${amount(budget.plans[1].stay_amount)}</td><td>Registered adults and children aged 5 and under: ${budget.included_adults} adults and age ${budget.included_child_ages.join(", ")} within published meal scope. Ages ${budget.uncovered_child_ages.join(" and ")} outside that inclusion; their breakfast cost is unknown.</td></tr>
</tbody></table></div>
<p class="dc-caution">Not breakfast for all five, and not a value winner: compare the ${amount(budget.stay_increment)} increment with what the covered guests would otherwise spend. No number of breakfasts, food-credit savings or older-child meal price is assumed. Displayed tax and destination fee are already included once; extra bedding, other charges and actual meal service remain unresolved. The original search retained child counts, not individual age acceptance.</p>
<p>${link(budget.observation.source_url,"Dated official booking-check source")} &middot; source and prices observed October 1; comparison assembled October 9, not re-priced. Original price review due October 15. This is a historical planning comparison, not a current offer or full-family food budget.</p></div>`;
}
const bookingChecks = {
  "boston-fenway-two-bedroom-tobt": ["Confirm sofa allocation and a fifth dining place; no rollaway or extra occupancy is established by a crib.", "Obtain current taxes, mandatory charges, payment timing and card-hold terms. Optional valet was USD 72/day (USD 85 outside standard times), excluded from this no-car task.", "Confirm registered-child breakfast terms, dietary needs, internet entitlement and current pool service.", "Check the actual museum-to-room return and usable rest time. MBTA's October 3 published age-11-and-under band includes ages 4 and 8, not 12; two adults plus age 12 imply three regular-fare riders unless another eligibility applies. Current fare, transfers, payment and stroller access remain unverified."],
  "boston-park-plaza-deluxe-double": ["Confirm each child's age, the fifth sleeping place, rollaway availability and any extra bedding charge.", "Obtain a current same-category rate, all mandatory charges, card-hold amount and exact cancellation terms.", "Breakfast-included terms cover the adults and age 4, not ages 8 and 12; obtain their meal costs before comparing plans.", "Check room separation and the actual museum-to-room return before relying on a rest break."],
  "boston-four-seasons-plaza": bostonPlazaEvidence.checks,
  "boston-langham-club-two-bedroom": ["Confirm the complete bed list and exact age acceptance for the named two-bedroom category.", "Obtain a same-task price, club child-access and meal terms, extra bedding, mandatory charges, cancellation and card-hold terms.", "Confirm guest cooking equipment separately from dining-service wording, and check the actual museum-to-room return."]
};

function parkPlazaPolicyNote() {
  const policy = parkPlazaFitnessPolicy();
  return `<p id="park-plaza-gym-policy" class="dc-caution" style="scroll-margin-top:128px"><strong>Destination-fee benefit, not children's gym access:</strong> the published daily USD ${policy.evidence.fee.displayed_daily_amount} mandatory destination charge includes ${e(policy.evidence.fitness.facility)} access, but its facilities are for hotel guests aged ${policy.evidence.fitness.minimum_guest_age} and over, with a first-visit waiver. Ages ${policy.excluded_child_ages.join(", ")} are outside that access band. Do not count this as a children's indoor activity or assume a fee exemption or deduction. The original October 1 sampled stay totals already include the destination charge once; no new price or extra-bed charge is established. ${link(policy.source_url,"Official gym and destination-fee policy")} inspected October 10, 2026; review due November 9. Actual service for your stay dates remains unverified.</p>`;
}

function museumBudgetSection() {
  const budget = bostonMuseumAdmission();
  return `<div id="museum-budget" class="dc-room"><h3>Children's Museum: admission before a room-rest plan</h3>
<div class="dc-table-scroll" tabindex="0" role="region" aria-label="Museum admission budget"><table><caption>October 9, 2026 published admission &middot; two adults and children aged 4, 8 and 12 &middot; ordinary general admission, not a November ticket quote</caption><thead><tr><th scope="col">Budget component</th><th scope="col">Dated amount or boundary</th></tr></thead><tbody>
<tr><th scope="row">Standard tickets</th><td>${amount(budget.evidence.admission.standard_admission.amount)} per person aged one or older &times; ${budget.tickets} = <strong>${amount(budget.amount)} admission component</strong>. Not a final checkout total.</td></tr>
<tr><th scope="row">Transaction fee</th><td>${amount(budget.transaction_fee)} per transaction. The store says the price will include this fee; keep it separate here and do not add it again to an inclusive checkout quote. Tax inclusion is unknown.</td></tr>
<tr><th scope="row">Leave for the hotel, then return?</th><td>Ordinary admission allows an all-day stay, except TJX $1 Sunday Afternoon tickets. That does not establish exit and re-entry permission or whether another ticket is needed.</td></tr>
</tbody></table></div>
<p>USD is our interpretation of the dollar symbol at this US venue. Future-date availability, final taxes and fees, discounts and actual hotel-return/rest time remain unverified. Published tickets are non-refundable; transfer to another date is subject to availability. Discounts or membership cannot be applied after purchase.</p>
<p>${link(budget.source_url,"Official general-admission source")} &middot; inspected October 9; reused here, not checked again. Review due October 23. No ticket purchase, date-specific quote or hotel-price renewal.</p></div>`;
}

export function bostonFamilyHotelPage() {
  const canonical = `https://familytripwise.com/${bostonPath}`;
  const title = "Boston Family Hotels: Exact Rooms, Kitchens & Dated Costs";
  const schema = { "@context": "https://schema.org", "@type": "WebPage", name: title, url: canonical, dateModified: bostonScreenedOn, publisher: { "@type": "Organization", name: "Family Tripwise", url: "https://familytripwise.com/" } };
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title><meta name="description" content="Compare four exact Boston room categories for a five-person task, with kitchen evidence, dated nightly samples, bedding limits and unresolved taxes and fees.">
<link rel="canonical" href="${canonical}"><link rel="stylesheet" href="../styles.css"><link rel="stylesheet" href="../washington-dc-comparison.css">
<script type="application/ld+json">${JSON.stringify(schema)}</script></head>
<body class="dc-page"><a class="skip-link" href="#main">Skip to comparison</a><header class="site-header"><a class="brand" href="../index.html"><span class="brand-mark">FT</span><span>Family Tripwise</span></a><nav aria-label="Site navigation"><a href="../index.html">Destinations</a><a href="../about.html">Our research</a></nav></header>
<main id="main"><section class="dc-intro"><p class="eyebrow">Boston</p><h1>Boston family hotels</h1>
${contributorCredit()}
<p class="dc-lede">Start with the exact room: who can sleep there, what you can cook, and what the dated price leaves out.</p>
<p>Four conditional room categories, not a city-wide best-hotel ranking. Plaza Suite category details checked October 9, 2026; other official room facts checked October 1 or 3. Prices observed October 1 and 3, not re-priced. Page assembled October 9, not a new inspection of every hotel. Park Plaza price review due October 15; Fenway October 17. Obtain current rates and exact sleeping arrangements before booking.</p>
<div class="dc-links"><a href="#comparison">Compare rooms</a><a href="#prices">Rate details</a><a href="#excluded">Rooms that do not fit five</a><a href="../downloads/boston-family-hotels.csv" download>Download full comparison CSV</a></div></section>
<section id="comparison"><h2>One configuration for a five-person task</h2><p><strong>Example task:</strong> two adults and children aged 4, 8 and 12; November 8-13, 2026, five nights, no car. Published maximum occupancy is not confirmed sleeping comfort, inventory or provider acceptance. A crib does not establish an extra place for these children.</p>
<div class="dc-toolbar" hidden><label><input id="kitchen-only" type="checkbox"> Published cooking kitchen only</label><p id="comparison-status" role="status" aria-live="polite">4 room categories</p></div>
<div class="dc-table-scroll" tabindex="0" role="region" aria-label="Room comparison"><table><caption>Exact categories and dated per-configuration nightly samples, not live quotes</caption><thead><tr><th scope="col">Exact category</th><th scope="col">Sleeping &amp; capacity</th><th scope="col">Cooking</th><th scope="col">Approx. configuration / night</th></tr></thead><tbody>
${bostonRooms.map((room,index)=>`<tr data-room="${room.id}" data-kitchen="${room.kitchen}"><th scope="row"><a href="#${room.id}">${e(room.hotel)}</a><p>${e(room.category)}</p></th><td>${e(room.sleeping_setup)}<p>Published maximum ${bostonPack.records[index].configurations[0].maximum}${bostonPack.records[index].configurations[0].max_adults !== null ? `, no more than ${bostonPack.records[index].configurations[0].max_adults} adults and ${bostonPack.records[index].configurations[0].max_children} children in this configuration` : ""}. ${room.conditions.map(e).join("; ")}</p></td><td>${e(cooking(room))}</td><td>${band(room)}<p>${room.price.rates ? room.id === "boston-fenway-two-bedroom-tobt" ? "October 3 pre-tax/fee flexible sample, exact entered ages." : "October 1 public-plan samples including displayed tax and destination fee; ages unresolved, fifth bedding charges unknown." : room.id === bostonPlazaEvidence.record_id ? e(bostonPlazaEvidence.budget.limitation) : "No same-category/party/date rate observed. Not evidence of sold-out inventory."}</p></td></tr>`).join("\n")}
</tbody></table></div><p>Fenway's kitchen belongs to its exact two-bedroom TOBT category. Four Seasons is Hotel Boston, not One Dalton; its published child configuration does not settle older-child bed allocation. Langham's full bedroom bed list remains unresolved.</p></section>
<section id="prices"><h2>What each price includes and leaves open</h2><p>One displayed stay total divided by five hotel nights gives the approximate nightly equivalent. These are dated plan samples, not seasonal ranges or a cheapest-hotel ranking. Fenway's pre-tax amount cannot be compared as an all-in budget with Park Plaza's displayed tax-and-destination-fee totals. Additional bedding, incidentals and mandatory charges can remain unknown.</p>
${breakfastSection()}
${bostonRooms.map(room=>`<article id="${room.id}" class="dc-room" data-room="${room.id}" data-kitchen="${room.kitchen}"><h3>${e(room.hotel)}</h3><p><strong>${e(room.category)}</strong></p><p>${e(room.sleeping_setup)}</p><p>${link(room.source_url,"Official category source")} &middot; facts checked ${room.checked_on}. ${room.conditions.map(e).join("; ")}</p>${room.conflicts.length ? `<p class="dc-caution">${room.conflicts.map(e).join("; ")}</p>` : ""}
${room.price.rates ? `<p>${party(room)}</p><div class="dc-table-scroll" tabindex="0" role="region" aria-label="${e(room.hotel)} dated rates"><table><caption>Observed ${room.price.observed_on} &middot; November 8-13 &middot; one configuration &middot; requested 2 adults / ages 4, 8 and 12</caption><thead><tr><th scope="col">Public plan</th><th scope="col">Approx. nightly</th><th scope="col">Displayed five-night total</th><th scope="col">Cancellation / meals</th></tr></thead><tbody>${room.price.rates.map(rate=>`<tr><th scope="row">${e(rate.plan)}</th><td>${amount(rate.nightly_average)}</td><td>${amount(rate.stay_amount)}</td><td>${e(rate.cancellation)}<p>${e(rate.meals)}</p></td></tr>`).join("")}</tbody></table></div><details><summary>Tax, fee and card-hold basis</summary><p>${e(room.price.fee_basis)}</p><p>${e(room.price.deposit_basis)}</p><p>${e(room.price.observation_limitation)}</p><p>${link(room.price.source_url,"Dated booking-check source")}; checked ${room.price.observed_on}, not checked again at launch. ${room.id.includes("park-plaza") ? "USD retained from saved observation; not a new provider ISO currency verification." : "USD retained from the dated booking check."}</p></details>` : `<p><strong>Unpriced:</strong> exact-party/date public price, fee total and deposit basis are not established. Compare the same category and every child's age before deciding cost.</p>`}
${room.id === bostonPlazaEvidence.record_id ? `<p>${e(cooking(room))} ${e(bostonPlazaEvidence.budget.limitation)}</p>` : ""}<p><strong>Before booking:</strong></p><ul>${bookingChecks[room.id].map(check=>`<li>${e(check)}</li>`).join("")}</ul>${room.id === "boston-park-plaza-deluxe-double" ? parkPlazaPolicyNote() : ""}</article>`).join("\n")}</section>
<section id="excluded"><h2>Room names that do not establish space for five</h2><div class="dc-table-scroll" tabindex="0" role="region" aria-label="Excluded room categories"><table><caption>Published limits for the named single-configuration task</caption><thead><tr><th scope="col">Property / exact category</th><th scope="col">Published maximum</th><th scope="col">Do not substitute</th></tr></thead><tbody>${bostonExcluded.map(room=>`<tr><th scope="row">${e(room.hotel)}<p>${e(room.category)}</p></th><td>${room.configurations[0].maximum}</td><td>${room.checks.map(e).join("; ")}</td></tr>`).join("")}</tbody></table></div><p>A generic guest selector, a kitchen, a requested connecting room or marketing Family Suite wording cannot increase these exact-category limits. No connecting bundle or unobserved category price is invented.</p></section>
<section id="rest"><h2>Rest, transit and review checks still matter</h2><p>We have not tested a child-paced Aquarium or Children's Museum entrance-to-room return, stroller route, queues, re-entry or usable rest duration. A neighborhood label or map estimate cannot guarantee a nap-friendly base. Check the actual hotel entrance, room, activity and rest window; current pool operation and meal logistics are separate checks.</p>
${museumBudgetSection()}
<p>Two selected Family-labeled Fenway review bodies, inspected October 3, describe April/May 2026 King Studio stays posted in June, with translation markers. They prompt breakfast-variety and kettle questions, not established defects, representative ratings or five-person TOBT evidence. Older pool, sofa and noise reports were not renewed. We have not stayed in these hotels; none is a verified safety or firm suitability recommendation.</p>
<figure><img src="https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9b/Boston_-_Skyline_%2848718902556%29.jpg/1280px-Boston_-_Skyline_%2848718902556%29.jpg" width="1280" height="960" loading="lazy" decoding="async" alt="Boston skyline and harbor in a 2019 photograph."><figcaption>Boston, August 31, 2019. Photo by <a href="https://www.flickr.com/photos/ajay_suresh">Ajay Suresh</a>, via <a href="https://commons.wikimedia.org/wiki/File:Boston_-_Skyline_(48718902556).jpg">Wikimedia Commons</a>, <a href="https://creativecommons.org/licenses/by/2.0/">CC BY 2.0</a>. Uncropped resized orientation photo, not a current hotel or route image.</figcaption></figure></section>
<section id="methodology"><h2>Research-based evidence, shared with the download</h2><p>Official published categories, dated booking observations, arithmetic estimates, limited review signals and unresolved questions are distinct. The complete CSV uses the same validated four-category room and price records, including all four public plans and the two unpriced categories. It does not change when the kitchen filter is active; the three excluded controls are shown separately on the page, not exported as candidates.</p><p>Room limits are a headcount screen, not a reservation or bed-sharing assurance. The Park Plaza provenance correction removes an inferred child-age band without changing amounts, original source dates or the original saved observation. No live inventory is queried, and no inputs are saved or transmitted.</p><p>${link("../about.html","How Family Tripwise handles evidence and uncertainty")}</p></section></main><footer class="site-footer"><p>Family Tripwise. Research-based family travel planning.</p><a href="../index.html">Browse destinations</a></footer><script src="../washington-dc-comparison.js" defer></script></body></html>\n`;
}
export function writeBostonFamilyHotelsPage(writeSite) {
  writeSite(bostonPath,bostonFamilyHotelPage());
  writeSite("downloads/boston-family-hotels.csv",bostonCsv);
}

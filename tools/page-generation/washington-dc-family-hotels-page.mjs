import { readFileSync } from "node:fs";
import { screenRoomPack } from "../family-room-task.mjs";
import { roomComparisonCsv } from "../family-room-comparison.mjs";
import { contributorCredit } from "./contributors.mjs";

export const dcPath = "where-to-stay/washington-dc-family-hotels.html";
export const dcScreenedOn = "2026-10-09";
const read = name => JSON.parse(readFileSync(new URL(`../../docs/research/${name}`, import.meta.url), "utf8"));
const owners = new Set(["dc-embassy-deluxe-double", "dc-homewood-two-queen", "dc-pendry-two-bedroom"]);
const original = read("washington-dc-room-configurations-2026-09-30.json");
export const dcPack = { ...original, evidence_scope: `${original.evidence_scope} Public selection is three categories; Residence Inn is excluded pending its exact-modal reinspection.`, records: original.records.filter(record => owners.has(record.id)) };
export const dcPrices = ["washington-dc-embassy-price-observation-2026-09-30.json", "washington-dc-homewood-price-observation-2026-09-30.json"].flatMap(read);
export const dcRooms = screenRoomPack(dcPack, dcPack.scenario, dcScreenedOn, dcPrices);
export const dcCsv = roomComparisonCsv(dcPack, dcPack.scenario, dcScreenedOn, dcPrices);
const e = value => String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
const amount = value => `USD ${Number(value).toFixed(2)}`;
const link = (url, label) => `<a href="${e(url)}">${e(label)}</a>`;
const band = room => room.price.rates ? `${amount(Math.min(...room.price.rates.map(rate => rate.nightly_average)))}-${amount(Math.max(...room.price.rates.map(rate => rate.nightly_average)))}` : "Unpriced";
const cooking = record => record.kitchen === "published-kitchen" ? record.checks.find(check => check.startsWith("Full kitchen lists")) : record.checks.find(check => /Microwave and mini|Coffee\/minibar/.test(check));

export function dcFamilyHotelPage() {
  const canonical = `https://familytripwise.com/${dcPath}`;
  const title = "Washington DC Family Hotels: Suites, Kitchens & Dated Prices";
  const schema = { "@context": "https://schema.org", "@type": "WebPage", name: title, url: canonical, dateModified: dcScreenedOn, publisher: { "@type": "Organization", name: "Family Tripwise", url: "https://familytripwise.com/" } };
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title><meta name="description" content="Compare three exact Washington DC suite categories by sleeping setup, kitchen evidence and dated nightly prices. See age, cancellation and fee limits before booking.">
<link rel="canonical" href="${canonical}"><link rel="stylesheet" href="../styles.css"><link rel="stylesheet" href="../washington-dc-comparison.css">
<script type="application/ld+json">${JSON.stringify(schema)}</script></head>
<body class="dc-page"><a class="skip-link" href="#main">Skip to comparison</a>
<header class="site-header"><a class="brand" href="../index.html"><span class="brand-mark">FT</span><span>Family Tripwise</span></a><nav aria-label="Site navigation"><a href="../index.html">Destinations</a><a href="../about.html">Our research</a></nav></header>
<main id="main"><section class="dc-intro"><p class="eyebrow">Washington DC</p><h1>Washington DC family hotels</h1>
${contributorCredit()}
<p class="dc-lede">Compare the room you would actually book: separate sleeping space, cooking equipment, and a dated cost basis.</p>
<p>Three exact suite categories, not a city-wide shortlist or best-hotel ranking. Room facts checked September 30, 2026; Hilton prices observed September 30 and age provenance corrected October 5. Page assembled October 9, not a new price or property inspection. Price review due October 14; room-source review due October 30. Obtain current rates and terms before booking.</p>
<div class="dc-links"><a href="#comparison">Compare rooms</a><a href="#prices">Rate details</a><a href="#rest">Museum-day rest</a><a href="../downloads/washington-dc-family-hotels.csv" download>Download full comparison CSV</a></div></section>
<section id="comparison"><h2>One room configuration for five</h2>
<p><strong>Example task:</strong> two adults and three children, requested ages 4, 8 and 12; November 8-13, 2026 (five nights), no car. The Hilton booking checks entered counts only, not individual ages. Their child-age band and acceptance of this exact family remain unknown.</p>
<div class="dc-toolbar" hidden><label><input id="kitchen-only" type="checkbox"> Published cooking kitchen only</label><p id="comparison-status" role="status" aria-live="polite">3 room categories</p></div>
<div class="dc-table-scroll" tabindex="0" role="region" aria-label="Room comparison"><table><caption>Dated published categories and approximate nightly samples, not live quotes</caption><thead><tr><th scope="col">Exact category</th><th scope="col">Sleeping &amp; capacity</th><th scope="col">Cooking</th><th scope="col">Approx. per configuration / night</th></tr></thead><tbody>
${dcRooms.map((room, index) => `<tr data-room="${room.id}" data-kitchen="${room.kitchen}"><th scope="row"><a href="#${room.id}">${e(room.hotel)}</a><p>${e(room.category)}</p></th><td>${e(room.sleeping_setup)}<p>Published maximum ${dcPack.records[index].configurations[0].maximum}${dcPack.records[index].configurations[0].max_adults !== null ? `, no more than ${dcPack.records[index].configurations[0].max_adults} adults` : ""}; ${room.conditions.length ? "conditional sleeping allocation" : "headcount screen only"}. Not a reservation or age acceptance.</p></td><td>${e(cooking(dcPack.records[index]))}<p>${room.kitchen === "published-kitchen" ? "Dining equipment quantities for five remain unknown." : "Cooking kitchen not established."}</p></td><td><strong>${band(room)}</strong><p>${room.price.rates ? "September 30 sample across public plans. Displayed government tax included; additional charges unknown. Unconfirmed child-age basis." : "No exact suite / party / date rate observed. Not evidence of sold-out inventory."}</p></td></tr>`).join("\n")}
</tbody></table></div><p>Homewood's standard two-queen suite is not its Premium category: the maintained Premium card says four, not five. Pendry's sofa for up to two children is not an overall child-count rule.</p></section>
<section id="prices"><h2>What each price actually includes</h2>
<p>The nightly figures divide one displayed configuration total by five hotel nights. They are not typical seasonal ranges, current quotes, all-fee totals or comparable exact-age family budgets. USD is the retained interpretation, not a newly confirmed provider currency code. Hilton identifies adults as 18+ but does not establish the child band in these checks.</p>
${dcRooms.map((room, index) => `<article id="${room.id}" class="dc-room" data-room="${room.id}" data-kitchen="${room.kitchen}"><h3>${e(room.hotel)}</h3><p><strong>${e(room.category)}</strong></p><p>${e(room.sleeping_setup)}</p><p>${link(room.source_url, "Official category source")} &middot; facts checked ${room.checked_on}. ${room.conditions.map(e).join("; ")}</p>
${room.conflicts.length ? `<p class="dc-caution">${room.conflicts.map(e).join("; ")}</p>` : ""}
${room.price.rates ? `<div class="dc-table-scroll" tabindex="0" role="region" aria-label="${e(room.hotel)} dated rates"><table><caption>Observed September 30, 2026 &middot; November 8-13 &middot; one configuration &middot; 2 adults / 3 children counts only</caption><thead><tr><th scope="col">Public plan</th><th scope="col">Approx. nightly</th><th scope="col">Displayed five-night total</th><th scope="col">Cancellation / payment</th></tr></thead><tbody>${room.price.rates.map(rate => `<tr><th scope="row">${e(rate.plan)}</th><td>${amount(rate.nightly_average)}</td><td>${amount(rate.stay_amount)}</td><td>${e(rate.cancellation)}<p>${e(rate.meals)}</p></td></tr>`).join("")}</tbody></table></div>
<details><summary>Tax, fee and card-hold basis</summary><p>${e(room.price.fee_basis)}</p><p>${e(room.price.deposit_basis)}</p><p>${e(room.price.observation_limitation)}</p><p>${link(room.price.source_url, "Dated booking-check source")}; checked ${room.price.observed_on}, not checked again at launch.</p></details>` : `<p><strong>Unpriced:</strong> no exact-party/date public rate, mandatory fee total or deposit basis established. Request the same category and all children's ages before comparing cost.</p>`}
<p><strong>Unresolved before booking:</strong> confirm the actual bed-sharing and sofa setup, every child's age, mandatory or sofa charges, incidentals authorization and current cancellation terms. ${e(cooking(dcPack.records[index]))}</p></article>`).join("\n")}</section>
<section id="rest"><h2>Can you return for a museum-day rest?</h2><p>This comparison does not establish a child-paced, entrance-to-room return, stroller route, queue time, re-entry or useful rest duration for any of these hotels. A property address or map walking estimate cannot answer that task. Choose the museum entrance, hotel category and actual rest window before relying on a midday return; include meals, internal hotel travel and the second activity.</p><p>Indoor-pool operation, meal seating and dietary fit also remain separate checks. None of the rooms is presented as a verified nap-friendly or safest base.</p>
<figure><img src="https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1e/WashingtonDCMallAerialNavyPhoto.jpg/1280px-WashingtonDCMallAerialNavyPhoto.jpg" width="1280" height="830" loading="lazy" decoding="async" alt="Historic aerial view of the National Mall, with the Lincoln Memorial, Washington Monument and US Capitol."><figcaption>National Mall, 2005. US Navy photo by Chief Photographer's Mate Johnny Bivera; <a href="https://commons.wikimedia.org/wiki/File:WashingtonDCMallAerialNavyPhoto.jpg">source and public-domain record</a>. Uncropped historic orientation image, not a current route or hotel photograph.</figcaption></figure></section>
<section id="methodology"><h2>Research, not firsthand hotel reviews</h2><p>Published property facts, dated booking observations, arithmetic estimates and unresolved questions are kept separate. We have not stayed in these suites, tested journeys or verified family suitability. This is a focused three-category comparison, not a representative DC hotel ranking. A published maximum does not confirm inventory, sleeping comfort or provider acceptance.</p><p>The downloadable CSV uses the same maintained room and price records and retains date, party, age, fee, deposit and cancellation context. It includes all three categories and all five observed public plans regardless of the on-page kitchen filter. No inputs are transmitted or saved, and no live inventory is queried.</p><p>${link("../about.html", "How Family Tripwise handles evidence and uncertainty")}</p></section>
</main><footer class="site-footer"><p>Family Tripwise. Research-based family travel planning.</p><a href="../index.html">Browse destinations</a></footer><script src="../washington-dc-comparison.js" defer></script></body></html>\n`;
}

export function writeWashingtonDcFamilyHotelsPage(writeSite) {
  writeSite(dcPath, dcFamilyHotelPage());
  writeSite("downloads/washington-dc-family-hotels.csv", dcCsv);
}

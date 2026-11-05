import { readFileSync } from "node:fs";
import { contributorCredit } from "./contributors.mjs";
import { checkedOn, pageUpdatedOn, sources, suites } from "./orlando-suite-data.mjs";
import { compareStay, escapeHtml as e, renderChecks } from "./orlando-suite-model.mjs";
import { siteHeader, siteEnd, addHolidayLink } from "./site-chrome.mjs";
import { withLinkPreview } from "./link-previews.mjs";
import { readReceipt, dollars, kidsText, shortSeen, seenText } from "./google-hotel-samples.mjs";
import { weekendPrice, weekendLive } from "./weekend-hotel-samples.mjs";
import { easternDate } from "./sitemap.mjs";

export const orlandoPath = "where-to-stay/orlando-family-hotels.html";
export const orlandoRateCsvPath = "downloads/orlando-ihg-dated-rates.csv";
export const orlandoCombinedRateCsvPath = "downloads/orlando-dated-rates.csv";
export const orlandoMealCsvPath = "downloads/orlando-meal-planning.csv";
// G18 (OWNER D39, docs/plan/hotel-price-samples.md): Google Hotels listings for a family of 4 on a normal Fri-Sun weekend plus
// Christmas and New Year weekends, each two 1-night searches (per night by construction); a family-of-5 weekend sits beside it.
// The weekend figures, family of 5 and CSV rows leave a week before the first night; each holiday table leaves on its own
// date (tools/orlando-google-sample.test.mjs fails from those dates until the page is regenerated).
const fourKids = [5, 8], fiveKids = [4, 8, 12];
export const orlandoGoogleTitles = { "art-of-animation": "Disney's Art of Animation Resort", "cabana-bay": "Universal's Cabana Bay Beach Resort", "holiday-inn": "Holiday Inn Resort Orlando Suites - Waterpark by IHG" };
const orlandoPrefix = { "art-of-animation": "orl-aoa", "cabana-bay": "orl-cabana", "holiday-inn": "orl-hi" };
const orlandoReceipts = ["a", "b", "c"].map(part => `dataforseo-g18-orlando-${part}-2026-11-05.json`);
const orlandoSearches = orlandoReceipts.flatMap(file => readReceipt(file).searches);
export const orlandoSets = {
  weekend: { tags: ["jan22", "jan23"], kids: fourKids, label: "Fri–Sun, Jan 22–24, 2027", name: "Normal weekend" },
  christmas: { tags: ["dec25", "dec26"], kids: fourKids, label: "Christmas weekend, Fri Dec 25 – Sun Dec 27, 2026", name: "Christmas weekend" },
  newYear: { tags: ["jan1", "jan2"], kids: fourKids, label: "New Year's weekend, Fri Jan 1 – Sun Jan 3, 2027", name: "New Year's weekend" },
  five: { tags: ["jan22-5p", "jan23-5p"], kids: fiveKids, label: "Family of 5, Fri–Sun, Jan 22–24, 2027", name: "Family of 5 weekend" }
};
const orlandoSet = set => Object.fromEntries(suites.map(suite => [suite.id, weekendPrice(orlandoSearches, { prefix: orlandoPrefix[suite.id], title: orlandoGoogleTitles[suite.id], tags: orlandoSets[set].tags, childAges: orlandoSets[set].kids })]));
const orlandoPrices = Object.fromEntries(Object.keys(orlandoSets).map(set => [set, orlandoSet(set)]));
const orlandoToday = () => process.env.FT_BUILD_DATE || easternDate();
const setLive = (set, today) => weekendLive(orlandoPrices[set]["holiday-inn"], today);
export const orlandoListingsDropDate = new Date(Date.parse(`${orlandoPrices.weekend["holiday-inn"].fri.check_in}T12:00:00Z`) - 7 * 86400000).toISOString().slice(0, 10);
export function orlandoListings(today = orlandoToday()) {
  if (!setLive("weekend", today)) return null;
  const rows = orlandoPrices.weekend;
  const figures = Object.values(rows).filter(row => row.both).map(row => row.average);
  return { rows, five: orlandoPrices.five, christmas: setLive("christmas", today) ? orlandoPrices.christmas : null, newYear: setLive("newYear", today) ? orlandoPrices.newYear : null,
    low: Math.min(...figures), high: Math.max(...figures), seen: { observed_on: rows["holiday-inn"].fri.observed_on }, party: `2 adults and ${kidsText(fourKids)}`, fiveParty: `2 adults and ${kidsText(fiveKids)}` };
}
const nightName = row => (row.fri.nightly !== null ? "Friday" : "Saturday");
const chipText = row => (row.both ? `≈ ${dollars(row.average)} a night` : row.any ? `${dollars(row.average)}, ${nightName(row).slice(0, 3)} only` : "No price shown");
const disneyWeekend = orlandoPrices.weekend["art-of-animation"];
const singleNight = disneyWeekend.any && !disneyWeekend.both ? disneyWeekend : null;
const stayText = row => (row.both ? `${dollars(row.total)} for 2 nights` : row.any ? `${nightName(row)} only; no price shown for the other night` : "Google showed no price for either night");
const listingText = (suite, listing) => {
  if (!listing) return "No current family price on this page: check the live rate for your room, dates and every child's age.";
  const row = listing.rows[suite.id];
  if (!row.any) return `Google Hotels showed no price for this resort for ${listing.party}, ${orlandoSets.weekend.label}, seen ${seenText(listing.seen)}. That does not mean sold out. Check the live rate.`;
  const extra = suite.id === "holiday-inn" ? "Taxes, parking and the resort fee may be extra." : "Taxes, parking and any other fees may be extra.";
  return `Google Hotels listed this resort (as "${orlandoGoogleTitles[suite.id]}") for ${listing.party}, ${orlandoSets.weekend.label}, seen ${seenText(listing.seen)}: ${row.both ? `Friday ${dollars(row.fri.nightly)}, Saturday ${dollars(row.sat.nightly)}; the average and 2-night sum are our estimate` : `${nightName(row)} ${dollars(row.average)} only; Google showed no price for the other night`}. Two one-night searches; room type not shown, so not necessarily the ${suite.room.split(" (")[0]}. ${extra} Not a quote.`;
};
const listingCell = (suite, listing) => {
  if (!listing) return "Check live rate";
  const row = listing.rows[suite.id];
  if (!row.any) return "No price shown; check live rate";
  return `<strong>${e(chipText(row))}</strong><br><small>${e(orlandoSets.weekend.label)}; ${e(stayText(row))}; room type not shown; not a quote</small>`;
};
const listingHeadings = ["Property", "Stay set", "Google Hotels title", "Party and age basis", "Check-in", "Nights", "Currency", "Price unit", "Google Hotels listing price", "Room type", "Taxes and fees", "Seen", "Source", "Live comparison"];
const listingRows = (records, today) => {
  const listing = orlandoListings(today);
  const liveSets = listing ? ["weekend", "five", ...(listing.christmas ? ["christmas"] : []), ...(listing.newYear ? ["newYear"] : [])] : [];
  return records.flatMap(suite => {
    const live = `https://familytripwise.com/${orlandoPath}#${suite.id}`;
    if (!listing) return [[suite.name, "", "", "", "", "", "", "", "No current family price; check live rate.", suite.room, "", "", "", live]];
    return liveSets.flatMap(set => [orlandoPrices[set][suite.id].fri, orlandoPrices[set][suite.id].sat].map(night => [suite.name, orlandoSets[set].name, orlandoGoogleTitles[suite.id], `2 adults and ${kidsText(orlandoSets[set].kids)}`, night.check_in, 1, "USD", "per night (Google listing; number and type of rooms not shown)", night.nightly ?? "No price shown", "Not shown by Google; not necessarily the suite above", "Not shown; may be extra", night.observed_on, "Google Hotels listing via DataForSEO, one-night search (receipts docs/research/dataforseo-g18-orlando-a/b/c-2026-11-05.json in github.com/agarg21/family-tripwise); not a quote", live]));
  });
};
const nightCell = night => (night.nightly === null ? `<span class="orl-no-price">No price</span>` : e(dollars(night.nightly)));
const priceTable = (listing, set, heading, prices) => {
  const sorted = suites.filter(suite => prices[suite.id].any).sort((x, y) => prices[x.id].low - prices[y.id].low);
  const none = suites.filter(suite => !prices[suite.id].any).map(suite => suite.name);
  const [friDay, satDay] = { christmas: ["Fri Dec&nbsp;25", "Sat Dec&nbsp;26"], newYear: ["Fri Jan&nbsp;1", "Sat Jan&nbsp;2"], five: ["Fri Jan&nbsp;22", "Sat Jan&nbsp;23"] }[set];
  return `<h3>${e(heading)}</h3>
      <div class="table-scroll" role="region" aria-label="${e(heading)}" tabindex="0"><table class="orl-price-table"><thead><tr><th scope="col">Hotel</th><th scope="col">${friDay.replace(" ", "<br>")}</th><th scope="col">${satDay.replace(" ", "<br>")}</th><th scope="col">Seen</th></tr></thead><tbody>
        ${sorted.map(suite => `<tr><th scope="row">${e(suite.name)}</th><td>${nightCell(prices[suite.id].fri)}</td><td>${nightCell(prices[suite.id].sat)}</td><td>${e(shortSeen(listing.seen))}</td></tr>`).join("\n        ")}
      </tbody></table></div>${none.length ? `\n      <p class="orl-price-note">No price shown on ${e(shortSeen(listing.seen))} for either night: ${e(none.join(", "))}. That does not mean sold out.</p>` : ""}`;
};
const googleBasis = "Google Hotels, one search per night; rooms, taxes and fees not shown. Not a quote.";
const pricesSection = listing => {
  if (!listing) return "";
  const oddNight = listing.newYear?.["art-of-animation"].fri.nightly;
  const holidays = [listing.christmas ? priceTable(listing, "christmas", orlandoSets.christmas.label, listing.christmas) : "", listing.newYear ? priceTable(listing, "newYear", orlandoSets.newYear.label, listing.newYear) : ""].filter(Boolean);
  return `<section id="orlando-more-prices">
      ${holidays.length ? `<h2>Holiday weekend prices</h2>
      <p>Family of 4 (${e(listing.party)}), price a night. ${googleBasis} Prices and rooms change fast; check live.</p>
      ${holidays.join("\n      ")}
      ${oddNight ? `<p class="orl-price-note">Art of Animation's ${e(dollars(oddNight))} is the only figure Google listed for that weekend. We can't explain it; check Disney before planning on it.</p>` : ""}` : ""}
      <h2 id="family-of-5">Family of 5</h2>
      <p>${e(listing.fiveParty[0].toUpperCase() + listing.fiveParty.slice(1))}, price a night. ${googleBasis} Ask the hotel to confirm 3 kids before paying.</p>
      ${priceTable(listing, "five", "Fri–Sun, Jan 22–24, 2027", listing.five)}
      <p class="orl-price-note">A big jump from the family-of-4 price may mean a bigger room or two rooms; Google doesn't say.</p>
    </section>
    `;
};
const rateCsv = rows => {
  const cell = value => {
    const plain = String(value ?? "").replaceAll(/[\r\n\t]+/g, " ");
    const safe = /^\s*[=+\-@]/.test(plain) ? `'${plain}` : plain;
    return `"${safe.replaceAll('"', '""')}"`;
  };
  return rows.map(row => row.map(cell).join(",")).join("\n") + "\n";
};
export function orlandoRateComparisonCsv(records = suites, today = orlandoToday()) {
  return rateCsv([listingHeadings, ...listingRows(records.filter(suite => suite.id === "holiday-inn"), today)]);
}
export function orlandoCombinedRateComparisonCsv(records = suites, today = orlandoToday()) {
  return rateCsv([listingHeadings, ...listingRows(records, today)]);
}
export function orlandoMealComparisonCsv(records = suites) {
  const headings = ["Property", "Exact room", "Published equipment", "Kitchen planning scope", "Breakfast venue", "Breakfast location", "Published breakfast hours", "Meal limits", "Meal source checked", "Equipment or room-scope source", "Breakfast source", "Live comparison"];
  const rows = records.flatMap(suite => {
    const kitchen = suite.kitchenPolicy, meal = suite.mealPolicy;
    const policy = meal ?? kitchen;
    if (!policy) return [];
    const breakfast = meal?.breakfast;
    return [[
      suite.name, suite.room,
      kitchen?.equipment.join("; ") ?? "Unknown for this exact room",
      meal?.kitchenNote ?? kitchen.planningNote,
      breakfast?.venue ?? "Unknown in this equipment record",
      breakfast?.location ?? "Unknown in this equipment record",
      breakfast ? `${breakfast.opens}-${breakfast.closes}` : "Unknown in this equipment record",
      policy.limitation,
      policy.checkedOn, sources[meal?.roomSource ?? kitchen.source],
      meal ? sources[meal.diningSource] : "Not established in this equipment record",
      `https://familytripwise.com/${orlandoPath}#${suite.id}`
    ]];
  });
  return rateCsv([headings, ...rows]);
}
const cite = (key, label) => `<a href="${e(sources[key])}">${label}</a>`;
export const mealPolicy = suite => {
  const policy = suite.mealPolicy;
  if (!policy) return "";
  const breakfast = policy.breakfast;
  return `\n            <div data-meal-policy="${e(suite.id)}"><dt>Kitchen &amp; breakfast</dt><dd><p>${e(policy.kitchenNote)} ${cite(policy.roomSource, "IHG room kitchen scope")}</p><p>Published breakfast buffet: ${e(breakfast.venue)}, ${e(breakfast.location)}, ${e(breakfast.opens)}-${e(breakfast.closes)}. ${cite(policy.diningSource, "IHG breakfast details")}</p><p>${e(policy.limitation)} Meal sources observed ${e(policy.checkedOn)}; check current terms before booking.</p></dd></div>`;
};
export const kitchenPolicy = suite => {
  const policy = suite.kitchenPolicy;
  if (!policy) return "";
  return `\n            <div data-kitchen-policy="${e(suite.id)}"><dt>Kitchenette &amp; meal planning</dt><dd><p>Published equipment: ${policy.equipment.map(e).join(", ")}. ${cite(policy.source, "Official suite equipment")}</p><p>${e(policy.planningNote)}</p><p>${e(policy.limitation)} Equipment observed ${e(policy.checkedOn)}; check current details before booking.</p></dd></div>`;
};
const waterPolicy = suite => {
  const policy = suite.waterPolicy;
  if (!policy) return "";
  return `\n            <div data-water-policy="${e(suite.id)}"><dt>Ride heights &amp; session cost</dt><dd><ul>${policy.rides.map(ride => `<li>${e(ride.name)}: published minimum ${ride.minimumInches} inches.</li>`).join("")}</ul><p>${e(policy.costConflict)} ${cite(suite.waterSource, "IHG fee inclusions")} ${cite(policy.source, "Waterpark FAQ")}</p><p>${e(policy.limitation)} Policy observed ${e(policy.checkedOn)}; check current terms before booking.</p></dd></div>`;
};
export function orlandoSuitePage(today = orlandoToday()) {
  return addHolidayLink(orlandoSuitePageBody(today), orlandoPath);
}

function orlandoSuitePageBody(today) {
  const listing = orlandoListings(today);
  const anchorName = id => `<a href="#${id}">${e(suites.find(suite => suite.id === id).name.replace("Universal ", "").replace(" - Waterpark", ""))}</a>`;
  const priceBox = listing
    ? `<p class="price-answer-label">Family of 4 in Orlando, ${e(orlandoSets.weekend.label)} (estimate)</p>
        <p class="price-figure">About ${e(dollars(listing.low))}–${e(dollars(listing.high))} a&nbsp;night</p>${singleNight ? `
        <p class="price-basis">Disney: ${e(dollars(singleNight.average))} for ${e(nightName(singleNight))} only.</p>` : ""}
        <ul class="pick-list price-rows">
          <li><span class="pick-chip">${e(chipText(listing.rows["holiday-inn"]))}</span> <span>${anchorName("holiday-inn")} · <strong>pool days</strong>, Disney shuttle listed<br><small>${e(stayText(listing.rows["holiday-inn"]))} · may be extra: resort fee $54-$65 and parking $31, each + tax, a night</small></span></li>
          <li><span class="pick-chip">${e(chipText(listing.rows["cabana-bay"]))}</span> <span>${anchorName("cabana-bay")} · <strong>Universal days</strong>, free shuttle buses<br><small>${e(stayText(listing.rows["cabana-bay"]))} · parking $26 + tax per vehicle; resort fee: ask the hotel</small></span></li>
          <li><span class="pick-chip">${e(chipText(listing.rows["art-of-animation"]))}</span> <span>${anchorName("art-of-animation")} · <strong>Disney days</strong>, Skyliner to EPCOT<br><small>${e(stayText(listing.rows["art-of-animation"]))} · free overnight parking; resort fee: ask Disney</small></span></li>
        </ul>
        <p class="price-basis">Google Hotels, 2 adults + ${e(kidsText(fourKids))}, seen ${e(shortSeen(listing.seen))}. Room type and taxes not shown. Not a quote. Weekdays not sampled.</p>
        <p class="price-basis">${listing.christmas || listing.newYear ? `<a href="#orlando-more-prices">Holiday weekend prices</a> · ` : ""}<a href="#family-of-5">Family of 5 prices</a></p>`
    : `<p class="price-answer-label">Family price</p>
        <p class="price-figure">Check live rate</p>
        <p class="price-basis">No current family price on this page. Price your exact suite, dates and every child\'s age with the hotel.</p>`;
  const canonical = `https://familytripwise.com/${orlandoPath}`;
  const example = compareStay({ arrival: "2027-01-22", departure: "2027-01-24", children: 2 });
  const title = "Orlando Family Hotels: Compare Suites, Park Benefits & Fees";
  const schema = { "@context": "https://schema.org", "@type": "WebPage", name: title, url: canonical, dateModified: pageUpdatedOn, publisher: { "@type": "Organization", name: "Family Tripwise", url: "https://familytripwise.com/" } };
  return withLinkPreview(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${e(title)}</title>
  <meta name="description" content="Compare three Orlando family suite options by sleeping setup, Disney or Universal access, water-park exclusions and partial parking or resort fees. Official sources linked.">
  <link rel="canonical" href="${canonical}"><link rel="stylesheet" href="../styles.css"><link rel="stylesheet" href="../orlando-suites.css?v=ft-g18e">
  <script type="application/ld+json">${JSON.stringify(schema)}</script>
</head>
<body class="orlando-page">
  ${siteHeader("../", "where-to-stay/orlando-family-hotels.html", { skipLabel: "Skip to comparison" })}
  <main id="main">
    <section class="intro">
      <p class="eyebrow">Orlando, Florida</p><h1>Orlando family hotels</h1>
      ${contributorCredit()}
      <p class="lede">3 Orlando hotels for a family of 4, with suites listed for up to 6. Pick your parks first.</p>
      <div id="orlando-price-answer" class="answer-box price-answer" role="region" aria-label="Short answer">
        ${priceBox}
        <p class="price-basis"><strong>Main catch:</strong> none of these bases lists transport to both Disney and Universal. Pick your parks first.</p>
      </div>
      <p class="sources-line">Hotel facts checked <time datetime="${checkedOn}">September 24, 2026</time> (IHG capacity and fees <time datetime="${pageUpdatedOn}">September 27</time>)${listing ? `; prices are Google Hotels listings seen ${e(seenText(listing.seen))}` : ""}. <span id="freshness">Check live rates and current terms before paying.</span></p>
      <div class="jump-links"><a href="#quick-compare">Compare bases</a><a href="#stay-check">Check dates &amp; fees</a><a href="#before-booking">Booking questions</a></div>
      <figure class="licensed-photo hero-photo"><img src="../images/orlando-cabana-bay.webp" width="1280" height="919" loading="eager" fetchpriority="high" decoding="async" alt="Cabana Bay Beach Resort exterior photographed in December 2024."><figcaption>Cabana Bay, a Universal-area base, December 31, 2024. Farragutful, <a href="https://commons.wikimedia.org/wiki/File:Cabana_Bay_Beach_Resort_01.jpg">Wikimedia Commons</a>, <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>. Resized and cropped to fit; not a photo of the compared suite.</figcaption></figure>
    </section>
    <section id="quick-compare">
      <h2>Compare the 3 bases by the parks you will visit</h2>
      <p id="overview-caption">Published room categories and Google Hotels prices for a family of 4 (kids 5 and 8), ${listing ? `seen ${e(shortSeen(listing.seen))}; ` : ""}taxes and fees may be extra. Not quotes.</p>
      <p class="scroll-hint">Swipe the table for room and sleeping details.</p>
      <div class="table-scroll" tabindex="0" role="region" aria-label="Suite overview"><table class="overview-table" aria-labelledby="overview-caption"><thead><tr><th scope="col">Base / property</th><th scope="col">Google's price, family of 4 (room type not shown)</th><th scope="col">Exact room category</th><th scope="col">Published headcount</th></tr></thead><tbody>
        ${suites.map(suite => `<tr><th scope="row">${e(suite.base)}<br><a href="#${suite.id}">${e(suite.name)}</a></th><td class="nightly-cell">${listingCell(suite, listing)}</td><td>${e(suite.room)}</td><td>${suite.maximum === null ? "Unresolved" : `Up to ${suite.maximum}`}<br>${cite(suite.capacitySource, suite.id === "holiday-inn" ? "Dated IHG rate details" : "Official rooms")}</td></tr>`).join("\n")}
      </tbody></table></div>
      <p><strong>Disney plus Universal:</strong> no base here lists transport to both. Pick your parks first.</p>
      <details class="price-more"><summary>How these prices work</summary><p>${listing ? `Google Hotels listings for ${e(listing.party)}, a separate one-night search for each night, seen ${e(seenText(listing.seen))}. Room type, taxes and fees are not shown. "No price shown" means Google listed no price that day; it does not mean sold out.` : "No current family price: check the live rate for your dates and every child's age."}</p></details>
      <p class="quiet-links"><a href="../${orlandoCombinedRateCsvPath}" download>Download listing prices (CSV)</a> · <span data-meal-download><a href="../${orlandoMealCsvPath}" download>Download kitchen &amp; breakfast checks (CSV)</a></span></p>
      <p><a href="../things-to-do/orlando-with-kids.html">Plan non-park days: compare Orlando activity admission prices, hours and re-entry rules</a>.</p>
    </section>
    ${pricesSection(listing)}<section id="stay-check">
      <h2>Your dates and known fee components</h2>
      <form id="stay-form" hidden>
        <div class="form-grid">
          <label>Arrival<input name="arrival" type="date" min="${checkedOn}" max="2027-12-31" value="2027-01-22" required></label>
          <label>Departure<input name="departure" type="date" min="2026-09-25" max="2028-01-01" value="2027-01-24" required></label>
          <label>Children (plus two adults)<select name="children">${[1,2,3,4,5].map(n => `<option${n === 2 ? " selected" : ""}>${n}</option>`).join("")}</select></label>
          <label>Overnight vehicle<select name="car"><option value="one">One vehicle</option><option value="none">No vehicle</option><option value="unknown">Not decided</option></select></label>
          <label>Holiday Inn resort fee already in your rate?<select name="feeIncluded"><option value="unknown">Not verified</option><option value="yes">Yes, already included</option><option value="no">No, the standard nightly fee applies separately</option></select></label>
        </div>
        <div class="actions"><button type="submit" disabled>Check fees for my dates</button><button type="reset" disabled>Restore example</button></div>
      </form>
      <noscript><p>Example: two adults and two children, January 22-24, 2027, one vehicle; fee checks only, not prices or quotes. All sources and comparison details are available below; personalized checks need JavaScript.</p></noscript>
      <p id="stay-status" role="status" aria-live="polite"></p>
      <h3 id="results-title">Example fee checks: 4 people / 2 nights / January 22-24, 2027</h3>
      <div id="suite-results" tabindex="-1" aria-labelledby="results-title">${suites.map((suite, index) => `
        <article id="${suite.id}" class="suite">
          <p class="eyebrow">${e(suite.base)}</p><h3>${e(suite.name)}</h3><p class="suite-room">${e(suite.room)}</p>
          ${listing?.rows[suite.id].any ? `<div class="hotel-price-sample"><p><span class="suite-price">${e(chipText(listing.rows[suite.id]))}</span></p><p class="suite-price-basis">Family of 4, ${e(orlandoSets.weekend.label)}: ${e(stayText(listing.rows[suite.id]))}; fees may be extra; room type not shown, may not be this suite (Google Hotels estimate, seen ${e(shortSeen(listing.seen))})</p><details class="price-more"><summary>What this price covers</summary><p>${e(listingText(suite, listing))}</p></details></div>` : `<div class="hotel-price-sample"><p><span class="pick-chip">${listing ? "No price shown" : "Check live rate"}</span> ${e(listingText(suite, listing))}</p></div>`}
          <dl>
            <div><dt>Sleeping setup</dt><dd>${e(suite.layout)} ${cite(suite.layoutSource ?? suite.capacitySource, "Official rooms")}${suite.layoutSource ? ` · ${cite(suite.capacitySource, "Dated IHG rate details")}` : ""}</dd></div>
            <div><dt>Park access</dt><dd>${e(suite.transport)} ${cite(suite.transportSource, "Transport terms")}</dd></div>
          </dl>
          <details class="suite-more"><summary>Kitchen, water park, fees and sources</summary><dl>${kitchenPolicy(suite)}${mealPolicy(suite)}
            <div><dt>Water features &amp; admission</dt><dd>${e(suite.water)} ${cite(suite.waterSource, "Water terms")}</dd></div>${waterPolicy(suite)}
            <div><dt>Important limitation</dt><dd>${e(suite.caution)} ${cite(suite.cautionSource ?? suite.capacitySource, "Check the notice or benefit")}</dd></div>
            <div><dt>Cost evidence</dt><dd>${e(suite.costNote)} ${cite(suite.parkingSource, "Published fees")}</dd></div>
          </dl></details>
          <details class="suite-checks"><summary>Fee checks for these dates</summary><div id="${suite.id}-checks" class="checks">${renderChecks(example, example.rows[index])}</div></details>
          <p><strong>Next booking check:</strong> ${e(suite.next)}</p>
        </article>`).join("")}
      </div>
    </section>
    <section id="before-booking">
      <h2>Before you book one room for everyone</h2>
      <ol>
        <li><strong>Send the exact party:</strong> every child's age at travel, the named room category and your dates. A published maximum is only a preliminary screen; it does not confirm inventory, child-pricing rules, accessible-room availability or acceptance of your party.</li>
        <li><strong>Agree the sleeping plan:</strong> who shares each bed, whether a sofa or pull-down suits your family, and whether a door or partition gives the separation you need. Bed count alone is not an occupancy policy.</li>
        <li><strong>Plan the rest day:</strong> ask about pool opening, slide and ride height rules, paid extras and weather closures. A waterpark benefit is not supervision, a safety assurance or a promise every child can use every attraction.</li>
        <li><strong>Price the same trip:</strong> obtain comparable room totals including tax, mandatory fees, parking, tickets and transfers. Do not add a fee twice when the rate already includes it. The Google listings above do not show the room type, taxes or fees, and do not confirm your children.</li>
        <li><strong>Check the journeys:</strong> verify each park stop, booking requirement and last return service. We have not tested travel times, stroller routes or the ease of returning for naps.</li>
      </ol>
    </section>
    <section id="methodology"><h2>Research, not a hotel review</h2>
      <p>These three room categories illustrate different park-base and water-benefit decisions. We have not stayed at these properties, tested the journeys or assessed service quality. No review score, best-value winner or firm family-suitability verdict is implied.</p>
      <p>Official facts are linked beside each comparison. The fee arithmetic is an illustration from published components, not a booking quote. Cabana Bay parking has no calculated stay subtotal because its published per-vehicle amount does not establish billing frequency. Google Hotels listing prices are one-night listings for the stated party, not quotes for the suite shown; exact-age acceptance and comparable totals remain unknown. This is a focused comparison for a family considering one room, not a best-hotel ranking or a complete Orlando directory. The page does not infer a room maximum from waterpark wristbands, treat an expected reopening as confirmed, or extend a seasonal offer to unspecified dates.</p>
      <p>Inputs are processed locally and are not saved or submitted. This page does not book, contact hotels or check live inventory. Source dates describe our inspection, not when a property's terms last changed.</p>
      <p><a href="../about.html">How Family Tripwise handles research and uncertainty</a></p>
    </section>
  </main>${siteEnd("../", "where-to-stay/orlando-family-hotels.html")}
  <script type="module" src="../orlando/orlando-suite-client.mjs"></script>
</body></html>
`);
}

export function writeOrlandoSuitePage(writeSite) {
  writeSite(orlandoPath, orlandoSuitePage());
  writeSite(orlandoRateCsvPath, orlandoRateComparisonCsv());
  writeSite(orlandoCombinedRateCsvPath, orlandoCombinedRateComparisonCsv());
  writeSite(orlandoMealCsvPath, orlandoMealComparisonCsv());
  for (const name of ["data", "model", "client"]) writeSite(`orlando/orlando-suite-${name}.mjs`, readFileSync(new URL(`./orlando-suite-${name}.mjs`, import.meta.url), "utf8"));
}

import { readFileSync } from "node:fs";
import { contributorCredit } from "./contributors.mjs";
import { checkedOn, pageUpdatedOn, sources, suites } from "./orlando-suite-data.mjs";
import { compareStay, escapeHtml as e, renderChecks } from "./orlando-suite-model.mjs";
import { siteHeader, siteEnd } from "./site-chrome.mjs";
import { withLinkPreview } from "./link-previews.mjs";
import { googleOneNight, dropDate, readReceipt, dollars, kidsText, shortSeen, seenText } from "./google-hotel-samples.mjs";
import { easternDate } from "./sitemap.mjs";

export const orlandoPath = "where-to-stay/orlando-family-hotels.html";
export const orlandoRateCsvPath = "downloads/orlando-ihg-dated-rates.csv";
export const orlandoCombinedRateCsvPath = "downloads/orlando-dated-rates.csv";
export const orlandoMealCsvPath = "downloads/orlando-meal-planning.csv";
// Q17b (OWNER D9/O2): the October 11 booking-engine samples for a November 2026 stay were withdrawn (their stay
// dates pass before they could be re-checked). Prices now come from Google Hotels listings for one family party,
// one-night searches only (per night by construction, never multiplied), and leave the committed page and CSVs
// together a week before the first arrival; tools/orlando-google-sample.test.mjs fails from that date until the
// page is regenerated.
const orlandoKids = [4, 8, 12];
export const orlandoGoogleTitles = { "cabana-bay": "Universal's Cabana Bay Beach Resort", "holiday-inn": "Holiday Inn Resort Orlando Suites - Waterpark by IHG" };
const orlandoGoogle = (() => {
  const fri = { "cabana-bay": readReceipt("dataforseo-q17b-six-pages-b-2026-10-31.json"), "holiday-inn": readReceipt("dataforseo-q17b-six-pages-c-2026-10-31.json") };
  const mon = readReceipt("dataforseo-q17b-midweek-a-2026-10-31.json");
  const labels = { "cabana-bay": "orl-cabana-bay", "holiday-inn": "orl-hi-suites" };
  return Object.fromEntries(Object.entries(labels).map(([id, label]) => {
    const spec = { title: orlandoGoogleTitles[id], childAges: orlandoKids };
    return [id, [googleOneNight(mon, `${label}-mid-1n`, spec), googleOneNight(fri[id], `${label}-1n`, spec)]];
  }));
})();
const orlandoAll = Object.values(orlandoGoogle).flat();
export const orlandoListingsDropDate = orlandoAll.filter(Boolean).map(sample => dropDate(sample, 7)).sort()[0];
const weekdayDay = iso => new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" }).replace(",", "");
const orlandoToday = () => process.env.FT_BUILD_DATE || easternDate();
// All listings leave together, so the price card never shows a partial set.
export function orlandoListings(today = orlandoToday()) {
  if (!orlandoAll.every(Boolean) || today >= orlandoListingsDropDate) return null;
  const rows = Object.fromEntries(Object.entries(orlandoGoogle).map(([id, list]) => [id, [...list].sort((x, y) => x.nightly - y.nightly)]));
  const amounts = orlandoAll.map(sample => sample.nightly);
  const range = id => rows[id].map(sample => dollars(sample.nightly)).join("-");
  const days = id => rows[id].map(sample => weekdayDay(sample.check_in)).join(" / ");
  const pairs = id => rows[id].map(sample => `${weekdayDay(sample.check_in)} ${dollars(sample.nightly)}`).join(" · ");
  return { rows, range, days, pairs, low: Math.min(...amounts), high: Math.max(...amounts), seen: orlandoAll[0], party: `2 adults and ${kidsText(orlandoKids)}` };
}
const listingText = (suite, listing) => {
  if (!listing) return "No current family price on this page: check the live rate for your room, dates and every child's age.";
  if (!listing.rows[suite.id]) return `Google Hotels showed no price for this resort for ${listing.party} (January 2027 searches, ${seenText(listing.seen)}). Check the live rate with Disney.`;
  const extra = suite.id === "holiday-inn" ? "Taxes, parking and the resort fee may be extra." : "Taxes, parking and any other fees may be extra.";
  return `Google Hotels listed this resort (as "${orlandoGoogleTitles[suite.id]}") at about ${listing.rows[suite.id].map(sample => `${dollars(sample.nightly)} (${weekdayDay(sample.check_in)})`).join(" to ")} for one night in January 2027 for ${listing.party}, seen ${seenText(listing.seen)}. One-night searches only; room type not shown, so not necessarily the ${suite.room.split(" (")[0]}. ${extra} Not a quote.`;
};
const listingCell = (suite, listing) => {
  if (!listing) return "Check live rate";
  if (!listing.rows[suite.id]) return "No Google price shown; check live rate";
  return `<strong>${e(listing.range(suite.id))}/night</strong><br><small>2 adults + 3 kids, 1 night (${e(listing.days(suite.id))}, 2027); room type not shown; not a quote</small>`;
};
const listingHeadings = ["Property", "Google Hotels title", "Party and age basis", "Check-in", "Nights", "Currency", "Price unit", "Google Hotels listing price", "Room type", "Taxes and fees", "Seen", "Source", "Live comparison"];
const listingRows = (records, today) => {
  const listing = orlandoListings(today);
  return records.flatMap(suite => {
    const live = `https://familytripwise.com/${orlandoPath}#${suite.id}`;
    const samples = listing?.rows[suite.id];
    if (!samples) return [[suite.name, "", "", "", "", "", "", listing ? "No Google price shown for this party in January 2027; check live rate." : "No current family price; check live rate.", suite.room, "", "", "", live]];
    return samples.map(sample => [suite.name, sample.title, listing.party, sample.check_in, 1, "USD", "per night (Google listing; number and type of rooms not shown)", sample.nightly, "Not shown by Google; not necessarily the suite above", "Not shown; may be extra", sample.observed_on, "Google Hotels listing via DataForSEO, one-night search (receipts docs/research/dataforseo-q17b-six-pages-b/c-2026-10-31.json and dataforseo-q17b-midweek-a-2026-10-31.json in github.com/agarg21/family-tripwise); not a quote", live]);
  });
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
  const listing = orlandoListings(today);
  const anchorName = id => `<a href="#${id}">${e(suites.find(suite => suite.id === id).name.replace("Universal ", "").replace(" - Waterpark", ""))}</a>`;
  const priceBox = listing
    ? `<p class="price-answer-label">Family of 5 in Orlando, January 2027</p>
        <p class="price-figure">About ${e(dollars(listing.low))}-${e(dollars(listing.high))} a&nbsp;night</p>
        <ul class="pick-list price-rows">
          <li><span class="pick-chip">${e(listing.range("holiday-inn"))}/night</span> <span>${anchorName("holiday-inn")} · <strong>pool days</strong>, off-site waterpark<br><small>${e(listing.pairs("holiday-inn"))} · resort fee $54-$65 + tax a night may be extra</small></span></li>
          <li><span class="pick-chip">${e(listing.range("cabana-bay"))}/night</span> <span>${anchorName("cabana-bay")} · <strong>Universal days</strong>, free shuttle buses<br><small>${e(listing.pairs("cabana-bay"))} · parking $26 + tax per vehicle</small></span></li>
          <li><span class="pick-chip">No price</span> <span>${anchorName("art-of-animation")} · <strong>Disney days</strong>, Skyliner to EPCOT<br><small>Google showed no price; check Disney · free overnight parking</small></span></li>
        </ul>
        <p class="price-basis">One-night Google Hotels prices for 2 adults + ${e(kidsText(orlandoKids))}, seen ${e(shortSeen(listing.seen))}. Not a bookable price; taxes extra. All three suites sleep up to 6; smaller rooms may cost less. Ask the hotel to confirm 3 kids before paying.</p>`
    : `<p class="price-answer-label">Family price</p>
        <p class="price-figure">Check live rate</p>
        <p class="price-basis">No current family price on this page. Price your exact suite, dates and every child\'s age with the hotel.</p>`;
  const canonical = `https://familytripwise.com/${orlandoPath}`;
  const example = compareStay();
  const title = "Orlando Family Hotels: Compare Suites, Park Benefits & Fees";
  const schema = { "@context": "https://schema.org", "@type": "WebPage", name: title, url: canonical, dateModified: pageUpdatedOn, publisher: { "@type": "Organization", name: "Family Tripwise", url: "https://familytripwise.com/" } };
  return withLinkPreview(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${e(title)}</title>
  <meta name="description" content="Compare three Orlando family suite options by sleeping setup, Disney or Universal access, water-park exclusions and partial parking or resort fees. Official sources linked.">
  <link rel="canonical" href="${canonical}"><link rel="stylesheet" href="../styles.css"><link rel="stylesheet" href="../orlando-suites.css?v=ft-q17b">
  <script type="application/ld+json">${JSON.stringify(schema)}</script>
</head>
<body class="orlando-page">
  ${siteHeader("../", "where-to-stay/orlando-family-hotels.html", { skipLabel: "Skip to comparison" })}
  <main id="main">
    <section class="intro">
      <p class="eyebrow">Orlando, Florida</p><h1>Orlando family hotels</h1>
      ${contributorCredit()}
      <p class="lede">3 suites for a family of 5: pick your park base first, then price your dates.</p>
      <div id="orlando-price-answer" class="answer-box price-answer" role="region" aria-label="Short answer">
        ${priceBox}
        <p class="price-basis"><strong>Main catch:</strong> none of these bases lists transport to both Disney and Universal. Pick your parks first.</p>
      </div>
      <p class="sources-line">Hotel facts checked <time datetime="${checkedOn}">September 24, 2026</time> (IHG capacity and fees <time datetime="${pageUpdatedOn}">September 27</time>)${listing ? `; prices are Google Hotels listings seen ${e(seenText(listing.seen))}` : ""}. <span id="freshness">Check live rates and current terms before paying.</span></p>
      <div class="jump-links"><a href="#quick-compare">Compare bases</a><a href="#stay-check">Check dates &amp; fees</a><a href="#before-booking">Booking questions</a></div>
      <figure class="licensed-photo hero-photo"><img src="../images/orlando-cabana-bay.webp" width="1280" height="919" loading="eager" fetchpriority="high" decoding="async" alt="Cabana Bay Beach Resort exterior photographed in December 2024."><figcaption>Cabana Bay, a Universal-area base, December 31, 2024. Farragutful, <a href="https://commons.wikimedia.org/wiki/File:Cabana_Bay_Beach_Resort_01.jpg">Wikimedia Commons</a>, <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>. Resized and cropped to fit; not a photo of the compared suite.</figcaption></figure>
    </section>
    <section id="quick-compare">
      <h2>Start with the park days you will repeat</h2>
      <p><a href="../${orlandoCombinedRateCsvPath}" download>Download listing prices (CSV)</a></p>
      <p data-meal-download><a href="../${orlandoMealCsvPath}" download>Download kitchen &amp; breakfast checks (CSV)</a></p>
      <p id="overview-caption">Published room categories and Google Hotels listing prices for a family of 5, not live availability or quotes.</p>
      <div class="table-scroll" tabindex="0" role="region" aria-label="Suite overview"><table class="overview-table" aria-labelledby="overview-caption"><thead><tr><th scope="col">Base / property</th><th scope="col">Exact room category</th><th scope="col">Published headcount</th><th scope="col">Family of 5 price</th></tr></thead><tbody>
        ${suites.map(suite => `<tr><th scope="row">${e(suite.base)}<br><a href="#${suite.id}">${e(suite.name)}</a></th><td>${e(suite.room)}</td><td>${suite.maximum === null ? "Unresolved" : `Up to ${suite.maximum}`}<br>${cite(suite.capacitySource, suite.id === "holiday-inn" ? "Dated IHG rate details" : "Official rooms")}</td><td class="nightly-cell">${listingCell(suite, listing)}</td></tr>`).join("\n")}
      </tbody></table></div>
      <p>${listing ? `Prices: Google Hotels listings for ${e(listing.party)}, one-night searches for Fri Jan 15 and Mon Jan 18, 2027, seen ${e(seenText(listing.seen))}. Room type, taxes and fees are not shown; one-night prices are not multiplied into stay totals, and they leave this page a week before arrival.` : "No current family price: check the live rate for your dates and every child's age."} Earlier booking-engine samples (checked October 11, 2026) were withdrawn because their stay dates could not be re-checked before they pass.</p>
      <p><strong>Disney plus Universal:</strong> none of these records establishes one included transport service covering both resorts. Fix your park list before choosing a base. Compare the cost and effort of cross-resort days, not just the room price.</p>
      <p><a href="../things-to-do/orlando-with-kids.html">Plan non-park days: compare Orlando activity admission prices, hours and re-entry rules</a>.</p>
    </section>
    <section id="stay-check">
      <h2>Your dates and known fee components</h2>
      <form id="stay-form" hidden>
        <div class="form-grid">
          <label>Arrival<input name="arrival" type="date" min="${checkedOn}" max="2027-12-31" value="2027-01-15" required></label>
          <label>Departure<input name="departure" type="date" min="2026-09-25" max="2028-01-01" value="2027-01-20" required></label>
          <label>Children (plus two adults)<select name="children">${[1,2,3,4,5].map(n => `<option${n === 3 ? " selected" : ""}>${n}</option>`).join("")}</select></label>
          <label>Overnight vehicle<select name="car"><option value="one">One vehicle</option><option value="none">No vehicle</option><option value="unknown">Not decided</option></select></label>
          <label>Holiday Inn resort fee already in your rate?<select name="feeIncluded"><option value="unknown">Not verified</option><option value="yes">Yes, already included</option><option value="no">No, the standard nightly fee applies separately</option></select></label>
        </div>
        <div class="actions"><button type="submit" disabled>Compare stay</button><button type="reset" disabled>Restore example</button></div>
      </form>
      <noscript><p>Example: two adults and three children, January 15-20, 2027, one vehicle; fee checks only, not prices or quotes. All sources and comparison details are available below; personalized checks need JavaScript.</p></noscript>
      <p id="stay-status" role="status" aria-live="polite"></p>
      <h3 id="results-title">Example fee checks: 5 people / 5 nights / January 15-20, 2027</h3>
      <div id="suite-results" tabindex="-1" aria-labelledby="results-title">${suites.map((suite, index) => `
        <article id="${suite.id}" class="suite">
          <p class="eyebrow">${e(suite.base)}</p><h3>${e(suite.name)}</h3><p><strong>${e(suite.room)}</strong></p>
          <dl>
            <div><dt>Sleeping setup</dt><dd>${e(suite.layout)} ${cite(suite.layoutSource ?? suite.capacitySource, "Official rooms")}${suite.layoutSource ? ` ${cite(suite.capacitySource, "Dated IHG rate details")}` : ""}</dd></div>${kitchenPolicy(suite)}${mealPolicy(suite)}
            <div><dt>Park access</dt><dd>${e(suite.transport)} ${cite(suite.transportSource, "Transport terms")}</dd></div>
            <div><dt>Water features &amp; admission</dt><dd>${e(suite.water)} ${cite(suite.waterSource, "Water terms")}</dd></div>${waterPolicy(suite)}
            <div><dt>Important limitation</dt><dd>${e(suite.caution)} ${cite(suite.cautionSource ?? suite.capacitySource, "Check the notice or benefit")}</dd></div>
            <div><dt>Cost evidence</dt><dd>${e(suite.costNote)} ${cite(suite.parkingSource, "Published fees")}</dd></div>
          </dl>
          ${listing?.rows[suite.id] ? `<div class="hotel-price-sample"><p><span class="pick-chip">${e(listing.range(suite.id))}/night</span> Family of 5, 1 night: ${e(listing.pairs(suite.id))} (Google Hotels, seen ${e(shortSeen(listing.seen))})</p><details class="price-more"><summary>What this price covers</summary><p>${e(listingText(suite, listing))}</p></details></div>` : `<p class="hotel-price-sample"><strong>Family of 5 price:</strong> ${e(listingText(suite, listing))}</p>`}
          <div id="${suite.id}-checks" class="checks">${renderChecks(example, example.rows[index])}</div>
          <p><strong>Next booking check:</strong> ${e(suite.next)}</p>
        </article>`).join("")}
      </div>
    </section>
    <section id="before-booking">
      <h2>Before choosing one room for five</h2>
      <ol>
        <li><strong>Send the exact party:</strong> every child's age at travel, the named room category and your dates. A published maximum is only a preliminary screen; it does not confirm inventory, child-pricing rules, accessible-room availability or acceptance of your party.</li>
        <li><strong>Agree the sleeping plan:</strong> who shares each bed, whether a sofa or pull-down suits your family, and whether a door or partition gives the separation you need. Bed count alone is not an occupancy policy.</li>
        <li><strong>Plan the rest day:</strong> ask about pool opening, slide and ride height rules, paid extras and weather closures. A waterpark benefit is not supervision, a safety assurance or a promise every child can use every attraction.</li>
        <li><strong>Price the same trip:</strong> obtain comparable room totals including tax, mandatory fees, parking, tickets and transfers. Do not add a fee twice when the rate already includes it. The Google listings above do not show the room type, taxes or fees, and do not confirm three children.</li>
        <li><strong>Check the journeys:</strong> verify each park stop, booking requirement and last return service. We have not tested travel times, stroller routes or the ease of returning for naps.</li>
      </ol>
    </section>
    <section id="methodology"><h2>Research, not a hotel review</h2>
      <p>These three room categories illustrate different park-base and water-benefit decisions. We have not stayed at these properties, tested the journeys or assessed service quality. No review score, best-value winner or firm family-suitability verdict is implied.</p>
      <p>Official facts are linked beside each comparison. The fee arithmetic is an illustration from published components, not a booking quote. Cabana Bay parking has no calculated stay subtotal because its published per-vehicle amount does not establish billing frequency. Google Hotels listing prices are one-night listings for one stated party, not quotes for the suite shown; exact-age acceptance and comparable totals remain unknown. This is a focused comparison for a family considering one room, not a best-hotel ranking or a complete Orlando directory. The page does not infer a room maximum from waterpark wristbands, treat an expected reopening as confirmed, or extend a seasonal offer to unspecified dates.</p>
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

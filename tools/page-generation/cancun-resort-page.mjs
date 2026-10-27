import { readFileSync } from "node:fs";
import { contributorCredit } from "./contributors.mjs";
import { comparisonUrl } from "../../src/prototypes/cancun-resort-comparison/share.mjs";
import { cancunEvidence } from "../../src/prototypes/cancun-resort-comparison/data.mjs";
import { compareCancunFamily } from "../../src/prototypes/cancun-resort-comparison/compare.mjs";
import { bookingChecklistText, childFields, comparisonCsv, esc, renderOverview, renderQuickComparison, renderResults } from "../../src/prototypes/cancun-resort-comparison/render.mjs";
import { siteHeader, siteEnd } from "./site-chrome.mjs";

export const cancunPath = "where-to-stay/cancun-family-resorts.html";
export const cancunChildOffer = JSON.parse(readFileSync(new URL("../../docs/research/cancun-child-offer-eligibility-2026-10-11.json", import.meta.url), "utf8"));
export const cancunGrandparentsBudget = JSON.parse(readFileSync(new URL("../../docs/research/cancun-grandparents-budget-2026-10-11.json", import.meta.url), "utf8"));
const groupMoney = value => `USD ${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
export function cancunGrandparentsCsv() {
  const e = cancunGrandparentsBudget, o = e.observation;
  const headings = ["Hotel", "Booking category", "Room code", "Suites", "Adults", "Child ages", "Arrival", "Departure", "Nights", "Currency", "Nightly unit", "Plan", "Displayed nightly", "Displayed stay total", "Meals", "Tax and fee basis", "Payment and refund", "Offer eligibility", "Connection", "Room conflicts", "Observed", "Source", "Limits"];
  const rows = o.plans.map(p => [o.hotel, o.category, o.room_code, o.rooms, o.adults, o.child_ages.join(" | "), o.checkin, o.checkout, o.nights, o.currency, o.unit, p.name, p.nightly_display, p.total_display, o.meals, o.fee_basis, o.terms, o.eligibility, o.connection, o.room_conflict, e.checked_on, e.source_url, "Older observation for these example stay dates; not a current quote. Dated one-suite party search, not guaranteed connection, booking acceptance, full stay cost, formal group rate, savings or suitability. Grand Family Suite four-adult group price not observed; two-adult examples cannot be borrowed."]);
  const cell = value => {
    const plain = String(value).replaceAll(/[\r\n\t]+/g, " ");
    const safe = /^\s*[=+\-@]/.test(plain) ? `'${plain}` : plain;
    return `"${safe.replaceAll('"', '""')}"`;
  };
  return [headings, ...rows].map(row => row.map(cell).join(",")).join("\r\n") + "\r\n";
}
export function cancunGrandparentsSection() {
  const e = cancunGrandparentsBudget, o = e.observation;
  return `    <!-- FT-IMP-106 grandparents start -->
    <section id="grandparents-budget" aria-labelledby="grandparents-title" style="scroll-margin-top:128px">
      <h2 id="grandparents-title">A trip with grandparents: room linkage and budget</h2>
      <p><strong>Example: two parents, two grandparents and children aged ${o.child_ages.map(esc).join(" and ")}.</strong> Four adults, two children; one suite for November 9-12, 2026 (${o.nights} nights). This is a dated party search, not a confirmed booking or a price for a reunion block; prices below are older observations, not current quotes.</p>
      <p><strong>${esc(o.hotel)}:</strong> booking code ${esc(o.room_code)}, ${esc(o.category)}. Connection is <strong>not established</strong>; two bedrooms do not by themselves guarantee a connecting door. <a href="#royalton-splash-two-bedroom">Older room facts and unresolved child limits</a>.</p>
      <div class="quick-table-scroll" tabindex="0" role="region" aria-label="Four-adult two-child dated suite prices"><table class="quick-table"><caption>One suite for all six guests - official direct USD examples</caption><thead><tr><th scope="col">Public plan</th><th scope="col">Per suite per night</th><th scope="col">Three-night displayed total</th></tr></thead><tbody>${o.plans.map(p => `<tr><th scope="row">${esc(p.name)}</th><td data-label="Per suite per night">${esc(groupMoney(p.nightly_display))}</td><td data-label="Three-night displayed total">${esc(groupMoney(p.total_display))}</td></tr>`).join("")}</tbody></table></div>
      <p>${esc(o.fee_basis)} ${esc(o.meals)}</p>
      <details><summary>Room conflicts and rate conditions</summary><p>${esc(o.room_conflict)}</p><p>${esc(o.terms)}</p><p>${esc(o.eligibility)}</p></details>
      <p class="source-date">Price and booking text observed <time datetime="${esc(e.checked_on)}">${esc(e.checked_on)}</time>; check live rates before booking. <a href="${esc(e.source_url)}">Official four-adult, two-child rate search</a>. The source may reset dates, ages or category; confirm the displayed selection.</p>
      <details id="grandparents-download"><summary>Save this party's budget</summary><p><a href="../downloads/cancun-grandparents-budget.csv" download>Download this party's two-plan budget (.csv)</a></p></details>
      <p><strong>Moon Palace The Grand:</strong> the <a href="${esc(e.grand_check.category_source_url)}">Grand Family Suite category</a> specifies two connecting rooms; this is not a reservation guarantee. <strong>A four-adult, two-child price is not verified.</strong> Its existing two-adult sample is not this party's budget. <a href="#grand-family-suite">Grand room and separate price basis</a>.</p>
      <p>Before choosing either, get written exact-party acceptance, the sleeping places assigned to each generation, connecting-door confirmation and all mandatory charges. Quiet/shared space, step-free access and rest-return practicality remain unverified. Neither result is a savings or family-suitability recommendation.</p>
    </section>
    <!-- FT-IMP-106 grandparents end -->
`;
}
export function cancunChildOfferSection() {
  const offer = cancunChildOffer;
  return `    <!-- FT-IMP-096 offer start -->
    <section id="child-offer" aria-labelledby="child-offer-title" style="scroll-margin-top:128px">
      <h2 id="child-offer-title">Kids stay free: eligibility before savings</h2>
      <p>${esc(offer.scope)}</p>
      <p class="source-date">Offer observed <time datetime="${esc(offer.checked_on)}">${esc(offer.checked_on)}</time>; check current terms before booking. <a href="${esc(offer.source_url)}">Official offer and terms</a>. Conditions can change or be suspended.</p>
      <div class="quick-table-scroll" tabindex="0" role="region" aria-label="Child-offer eligibility conditions">
        <table class="quick-table"><caption>Published conditions and remaining checks</caption><thead><tr><th scope="col">Check</th><th scope="col">Published condition</th><th scope="col">Limit or unresolved check</th></tr></thead><tbody>${offer.rows.map(row => `<tr><th scope="row">${esc(row.check)}</th><td data-label="Published condition">${esc(row.published)}</td><td data-label="Limit or unresolved check">${esc(row.unresolved)}</td></tr>`).join("")}</tbody></table>
      </div>
      <p>${esc(offer.task)}</p>
      <p>${esc(offer.price_limit)}</p>
      <p><a href="#grand-family-suite">Grand room and dated price</a></p>
      <p>Other room and price source dates are unchanged. This is an eligibility check, not booking acceptance or a savings quote.</p>
    </section>
    <!-- FT-IMP-096 offer end -->
`;
}
export function cancunResortPage() {
  const canonical = `https://familytripwise.com/${cancunPath}`;
  const title = "Cancun Family Resorts: Compare Rooms, Club Ages & Transfers";
  const schema = { "@context": "https://schema.org", "@type": "WebPage", name: title, url: canonical, dateModified: cancunEvidence.lastUpdatedOn, publisher: { "@type": "Organization", name: "Family Tripwise", url: "https://familytripwise.com/" } };
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title.replaceAll("&", "&amp;")}</title>
  <meta name="description" content="Compare six Cancun-area all-inclusive family resorts by exact room category, child club ages, airport-transfer terms and unresolved costs. Source-linked policy checks.">
  <link rel="canonical" href="${canonical}">
  <link rel="stylesheet" href="../styles.css">
  <link rel="stylesheet" href="../cancun-resorts.css">
  <script type="application/ld+json">${JSON.stringify(schema)}</script>
</head>
<body class="cancun-page">
  <a class="skip-link" href="#main">Skip to comparison</a>
  ${siteHeader("../", "where-to-stay/cancun-family-resorts.html")}
  <main id="main">
    <section class="page-intro">
      <p class="eyebrow">Cancun area, Mexico</p>
      <h1>Cancun family resorts</h1>
      ${contributorCredit()}
      <p>Six all-inclusive resorts, compared by the room and policy details that can change a family booking. This is a focused planning comparison, not a ranking of every resort.</p>
      <p class="source-date">Official sources checked <time datetime="${cancunEvidence.checkedOn}">September 23, 2026</time>. <span id="freshness">Check live rates and current rules before booking.</span></p>
      <div class="jump-links"><a href="#quick-comparison">Quick room comparison</a><a href="#grandparents-budget">Trip with grandparents</a><a href="#family-check">Your children's ages</a><a href="#child-offer">Child-offer checks</a><a href="#comparison">Full policy checks</a><a href="#before-booking">Before booking</a></div>
    </section>
    <section id="quick-comparison" aria-labelledby="quick-title">
      <h2 id="quick-title">Six rooms at a glance</h2>
      <p>Start with capacity, sleeping places and the nightly price examples. Each price has its own party, date and fee basis; these are not like-for-like family totals. Check club admission and transfers in each detailed record.</p>
      ${renderQuickComparison()}
      <div class="comparison-sharing">
        <div id="comparison-actions" class="actions" hidden>
          <button id="copy-comparison" type="button">Copy comparison link</button>
        </div>
        <a href="${comparisonUrl}">Direct link to this comparison</a>
        <p id="share-status" role="status" aria-live="polite"></p>
        <div id="comparison-link-fallback" hidden><label for="comparison-link">Comparison link</label><input id="comparison-link" type="text" readonly value="${comparisonUrl}"></div>
      </div>
      <details id="comparison-downloads"><summary>Save this comparison</summary>
        <p><a href="../downloads/cancun-booking-checklist.txt" download>Download the booking checklist and source records (.txt)</a></p>
        <p><a href="../downloads/cancun-room-comparison.csv" download>Download the six-room comparison (.csv)</a> · Price examples have different party, date and fee bases; do not sort them as comparable stay totals.</p>
      </details>
    </section>
    <section id="room-setup" aria-labelledby="room-setup-title">
      <h2 id="room-setup-title">Choose by room setup</h2>
      <ul>
        <li><strong>Two adults and two children, Hotel Zone:</strong> <a href="#ziva-ocean-view-double">Hyatt Ziva's Ocean View Double</a> publishes a four-person maximum; exact bedding and club-age rules still need checking.</li>
        <li><strong>Five people:</strong> <a href="#finest-family-suite">Finest's Family Suite</a> publishes five places and a separate children's bedroom. <a href="#sapphire-family-junior-suite">Dreams Sapphire</a> publishes six, with sleeping layout unresolved. <a href="#sunscape-family-junior-suite">Sunscape's capacity listings disagree</a>.</li>
        <li><strong>Six or seven people:</strong> <a href="#grand-family-suite">Moon Palace The Grand's Family Suite</a> publishes seven places across connecting rooms, with a rollaway for the seventh guest (a child). <a href="#royalton-splash-two-bedroom">Royalton Splash's two-bedroom category</a> has conflicting child limits. Confirm exact-age acceptance before relying on either.</li>
      </ul>
      <p>These are published-capacity starting points, not confirmed bookings or price recommendations.</p>
    </section>
${cancunGrandparentsSection()}    <section id="comparison" aria-labelledby="comparison-title">
      <h2 id="comparison-title">Compare the exact room, not just the resort</h2>
      <p>Published policy, not firsthand experience. Location names distinguish the Hotel Zone, Playa Mujeres and Riviera Cancun; these are not interchangeable bases.</p>
      ${renderOverview()}
    </section>
    <section id="family-check" aria-labelledby="family-title">
      <h2 id="family-title">Check your family's age and booking conditions</h2>
      <p>Two adults and one to five children, ages 0-17 at travel. A room maximum, a club-age match and a transfer offer are separate checks. All six resorts stay visible, including conflicts and unknowns.</p>
      <form id="family-form" hidden>
        <div class="form-grid">
          <label for="children">Number of children<select id="children" name="children">${[1,2,3,4,5].map(n => `<option${n === 3 ? " selected" : ""}>${n}</option>`).join("")}</select></label>
          <label for="channel">Booking channel<select id="channel" name="channel"><option value="unknown">Not decided</option><option value="direct-suite">Direct, suite only</option><option value="third-party">Third-party booking</option><option value="flight-package">Flight + hotel package</option></select></label>
          <label for="nights">Nights (optional)<input id="nights" name="nights" type="number" inputmode="numeric" min="1" max="365" step="1"></label>
          <label for="newReservation">New reservation?<select id="newReservation" name="newReservation"><option value="unknown">Not specified</option><option value="yes">Yes</option><option value="no">No, existing booking</option></select></label>
        </div>
        <fieldset><legend>Children at travel</legend><div id="child-fields">${childFields(3, [3,7,12].map(age => ({ age, training: "unknown" })))}</div></fieldset>
        <div class="actions"><button type="submit" disabled>Compare my family</button><button type="reset" disabled>Restore example</button></div>
      </form>
      <noscript><p>The example below and all official policy details remain available. Personalized checks need JavaScript.</p></noscript>
      <p id="comparison-status" role="status" aria-live="polite"></p>
      <h3 id="results-title">Example: children aged 3, 7 and 12</h3>
      <div id="family-results" tabindex="-1" aria-labelledby="results-title">${renderResults(compareCancunFamily({childAges:[3,7,12], asOf:cancunEvidence.checkedOn}))}</div>
    </section>
${cancunChildOfferSection()}    <section id="before-booking">
      <h2>Resolve these points before paying</h2>
      <ol>
        <li><strong>Exact party and category:</strong> supply every child's age at travel and ask whether that exact rate accepts everyone in one booked unit. A club age does not establish the hotel's child-pricing cutoff.</li>
        <li><strong>Every sleeping place:</strong> confirm bedding, any sofa or trundle, and whether a connection is guaranteed rather than requested. Ask whether another room category or unit is needed when capacity conflicts.</li>
        <li><strong>Club admission:</strong> confirm registration, toilet-training rules, current hours and space for each child. Published ages do not guarantee admission or establish the quality of care.</li>
        <li><strong>Complete quote:</strong> request the room total for your party, taxes, mandatory fees, delivery charges, transfers and any paid childcare. Confirm cancellation terms for the actual rate. We have not observed comparable, date-specific quotes across these resorts.</li>
        <li><strong>Stay-date changes:</strong> check current renovation, closure and programme notices with the resort. This policy comparison does not establish that every facility will operate during your stay.</li>
      </ol>
    </section>
    <section class="geography">
      <h2>One airport region, different locations</h2>
      <p>Sunscape and Hyatt Ziva are in Cancun's Hotel Zone; Finest is in Playa Mujeres to the north; Dreams Sapphire and Royalton Splash are in Riviera Cancun. The map links above locate each named resort. No transfer time, beach condition, safe swimming or stroller-route guarantee is implied.</p>
      <figure><img src="https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9a/Canc%C3%BAn_aerial_2024.jpg/1280px-Canc%C3%BAn_aerial_2024.jpg" width="1280" height="960" alt="Aerial view of Cancun's coast and lagoon in January 2024, for geographic context." loading="lazy" decoding="async"><figcaption>Cancun area, January 2024; not a photo of the compared rooms. Antony-22, <a href="https://commons.wikimedia.org/wiki/File:Canc%C3%BAn_aerial_2024.jpg">Wikimedia Commons</a>, <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>. Uncropped, displayed smaller.</figcaption></figure>
    </section>
    <section id="methodology">
      <h2>What this comparison can establish</h2>
      <p>The same dated official-property records supply the comparison and the age checks. These six resorts cover different room sizes, locations, age rules and transfer constraints, not a statistically representative sample or a best-value shortlist. Where two official pages conflict, both remain linked. Missing policy evidence stays unknown rather than becoming an inclusion or admission promise.</p>
      <p>We have not stayed at these resorts. No guest-review quality score, room-noise judgment, live availability, booking acceptance or total-price ranking is claimed. Published prices for other parties or undated starting rates are not family quotes. Sources can change after the dates shown.</p>
      <p>Family inputs are processed in this page, not saved or submitted. The comparison does not book rooms, contact hotels or reserve childcare.</p>
      <p><a href="../about.html">How Family Tripwise handles research and uncertainty</a></p>
    </section>
  </main>
  ${siteEnd("../", "where-to-stay/cancun-family-resorts.html")}
  <script type="module" src="../cancun/client.mjs"></script>
</body>
</html>
`;
}

export function writeCancunResortPage(writeSite) {
  writeSite(cancunPath, cancunResortPage());
  writeSite("downloads/cancun-booking-checklist.txt", bookingChecklistText());
  writeSite("downloads/cancun-room-comparison.csv", comparisonCsv());
  writeSite("downloads/cancun-grandparents-budget.csv", cancunGrandparentsCsv());
  // Copy the reviewed modules unchanged so public and native checks share one model.
  for (const name of ["data", "compare", "render", "client", "share"]) {
    writeSite(`cancun/${name}.mjs`, readFileSync(new URL(`../../src/prototypes/cancun-resort-comparison/${name}.mjs`, import.meta.url), "utf8"));
  }
}

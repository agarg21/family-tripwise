import { readFileSync } from "node:fs";
import { contributorCredit } from "./contributors.mjs";
import { cancunEvidence } from "../../src/prototypes/cancun-resort-comparison/data.mjs";
import { compareCancunFamily } from "../../src/prototypes/cancun-resort-comparison/compare.mjs";
import { childFields, renderOverview, renderResults } from "../../src/prototypes/cancun-resort-comparison/render.mjs";

export const cancunPath = "where-to-stay/cancun-family-resorts.html";
export function cancunResortPage() {
  const canonical = `https://familytripwise.com/${cancunPath}`;
  const title = "Cancun Family Resorts: Compare Rooms, Club Ages & Transfers";
  const schema = { "@context": "https://schema.org", "@type": "WebPage", name: title, url: canonical, dateModified: cancunEvidence.checkedOn, publisher: { "@type": "Organization", name: "Family Tripwise", url: "https://familytripwise.com/" } };
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
  <header class="site-header"><a class="brand" href="../index.html"><span class="brand-mark">FT</span><span>Family Tripwise</span></a><nav aria-label="Site navigation"><a href="../index.html">Destinations</a><a href="../about.html">Our research</a></nav></header>
  <main id="main">
    <section class="page-intro">
      <p class="eyebrow">Cancun area, Mexico</p>
      <h1>Cancun family resorts</h1>
      ${contributorCredit()}
      <p>Six all-inclusive resorts, compared by the room and policy details that can change a family booking. This is a focused planning comparison, not a ranking of every resort.</p>
      <ul>
        <li><strong>Two adults and two children, Hotel Zone:</strong> <a href="#ziva-ocean-view-double">Hyatt Ziva's Ocean View Double</a> publishes a four-person maximum; exact bedding and club-age rules still need checking.</li>
        <li><strong>Five people:</strong> <a href="#finest-family-suite">Finest's Family Suite</a> publishes five places and a separate children's bedroom. <a href="#sapphire-family-junior-suite">Dreams Sapphire</a> publishes six, with sleeping layout unresolved. <a href="#sunscape-family-junior-suite">Sunscape's capacity listings disagree</a>.</li>
        <li><strong>Six or seven people:</strong> <a href="#grand-family-suite">Moon Palace The Grand's Family Suite</a> publishes seven places across connecting rooms, with a rollaway for the seventh guest (a child). <a href="#royalton-splash-two-bedroom">Royalton Splash's two-bedroom category</a> has conflicting child limits. Confirm exact-age acceptance before relying on either.</li>
      </ul>
      <p>These are published-capacity starting points, not confirmed bookings or price recommendations.</p>
      <p class="source-date">Official sources checked <time datetime="${cancunEvidence.checkedOn}">September 23, 2026</time>. <span id="freshness">Next source review due October 23, 2026; verify volatile details before booking.</span></p>
      <div class="jump-links"><a href="#comparison">Room &amp; policy comparison</a><a href="#family-check">Your children's ages</a><a href="#before-booking">Before booking</a></div>
    </section>
    <section id="comparison" aria-labelledby="comparison-title">
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
    <section id="before-booking">
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
      <p>We have not stayed at these resorts. No guest-review quality score, room-noise judgment, live availability, booking acceptance or total-price ranking is claimed. Published prices for other parties or undated starting rates are not family quotes. Sources can change before the next review date.</p>
      <p>Family inputs are processed in this page, not saved or submitted. The comparison does not book rooms, contact hotels or reserve childcare.</p>
      <p><a href="../about.html">How Family Tripwise handles research and uncertainty</a></p>
    </section>
  </main>
  <footer class="site-footer"><p>Family Tripwise. Research-based family travel planning.</p><a href="../index.html">Browse destinations</a></footer>
  <script type="module" src="../cancun/client.mjs"></script>
</body>
</html>
`;
}

export function writeCancunResortPage(writeSite) {
  writeSite(cancunPath, cancunResortPage());
  // Copy the reviewed modules unchanged so public and native checks share one model.
  for (const name of ["data", "compare", "render", "client"]) {
    writeSite(`cancun/${name}.mjs`, readFileSync(new URL(`../../src/prototypes/cancun-resort-comparison/${name}.mjs`, import.meta.url), "utf8"));
  }
}

import { readFileSync } from "node:fs";
import { checkedOn, recheckOn, sources, suites } from "./orlando-suite-data.mjs";
import { compareStay, escapeHtml as e, renderChecks } from "./orlando-suite-model.mjs";

export const orlandoPath = "where-to-stay/orlando-family-hotels.html";
const cite = (key, label) => `<a href="${sources[key]}">${label}</a>`;

export function orlandoSuitePage() {
  const canonical = `https://familytripwise.com/${orlandoPath}`;
  const example = compareStay();
  const title = "Orlando Family Hotels: Compare Suites, Park Benefits & Fees";
  const schema = { "@context": "https://schema.org", "@type": "WebPage", name: title, url: canonical, dateModified: checkedOn, publisher: { "@type": "Organization", name: "Family Tripwise", url: "https://familytripwise.com/" } };
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${e(title)}</title>
  <meta name="description" content="Compare three Orlando family suite options by sleeping setup, Disney or Universal access, water-park exclusions and partial parking or resort fees. Official sources linked.">
  <link rel="canonical" href="${canonical}"><link rel="stylesheet" href="../styles.css"><link rel="stylesheet" href="../orlando-suites.css">
  <script type="application/ld+json">${JSON.stringify(schema)}</script>
</head>
<body class="orlando-page">
  <a class="skip-link" href="#main">Skip to comparison</a>
  <header class="site-header"><a class="brand" href="../index.html"><span class="brand-mark">FT</span><span>Family Tripwise</span></a><nav aria-label="Site navigation"><a href="../index.html">Destinations</a><a href="../about.html">Our research</a></nav></header>
  <main id="main">
    <section class="intro">
      <p class="eyebrow">Orlando, Florida</p><h1>Orlando family hotels</h1>
      <p class="lede">Room for everyone, the right park base, and water benefits that actually apply to your dates.</p>
      <p>Three suite options across Disney, Universal and an off-site waterpark base. This is a focused comparison for a family considering one room, not a best-hotel ranking or a complete Orlando directory.</p>
      <p>Official sources checked <time datetime="${checkedOn}">September 24, 2026</time>. <span id="freshness">Next source review due ${recheckOn}; verify changing terms before paying.</span></p>
      <div class="jump-links"><a href="#quick-compare">Compare bases</a><a href="#stay-check">Check dates &amp; fees</a><a href="#before-booking">Booking questions</a></div>
    </section>
    <section id="quick-compare">
      <h2>Start with the park days you will repeat</h2>
      <div class="table-scroll" tabindex="0" role="region" aria-label="Suite overview"><table><caption>Published room categories, not live availability</caption><thead><tr><th scope="col">Base / property</th><th scope="col">Exact room category</th><th scope="col">Published headcount</th></tr></thead><tbody>
        ${suites.map(suite => `<tr><th scope="row">${e(suite.base)}<br><a href="#${suite.id}">${e(suite.name)}</a></th><td>${e(suite.room)}</td><td>${suite.maximum === null ? "Unresolved" : `Up to ${suite.maximum}`}<br>${cite(suite.capacitySource, "Official rooms")}</td></tr>`).join("\n")}
      </tbody></table></div>
      <p><strong>Disney plus Universal:</strong> none of these records establishes one included transport service covering both resorts. Fix your park list before choosing a base. Compare the cost and effort of cross-resort days, not just the room price.</p>
    </section>
    <section id="stay-check">
      <h2>Your dates and known fee components</h2>
      <form id="stay-form" hidden>
        <div class="form-grid">
          <label>Arrival<input name="arrival" type="date" min="${checkedOn}" max="2027-12-31" value="2026-11-08" required></label>
          <label>Departure<input name="departure" type="date" min="2026-09-25" max="2028-01-01" value="2026-11-13" required></label>
          <label>Children (plus two adults)<select name="children">${[1,2,3,4,5].map(n => `<option${n === 3 ? " selected" : ""}>${n}</option>`).join("")}</select></label>
          <label>Overnight vehicle<select name="car"><option value="one">One vehicle</option><option value="none">No vehicle</option><option value="unknown">Not decided</option></select></label>
          <label>Holiday Inn resort fee already in your rate?<select name="feeIncluded"><option value="unknown">Not verified</option><option value="yes">Yes, already included</option><option value="no">No, standard $65 fee applies separately</option></select></label>
        </div>
        <div class="actions"><button type="submit" disabled>Compare stay</button><button type="reset" disabled>Restore example</button></div>
      </form>
      <noscript><p>Example: two adults and three children, November 8-13, 2026, one vehicle. All sources and comparison details are available below; personalized checks need JavaScript.</p></noscript>
      <p id="stay-status" role="status" aria-live="polite"></p>
      <h3 id="results-title">Example: 5 people / 5 nights / November 8-13, 2026</h3>
      <div id="suite-results" tabindex="-1" aria-labelledby="results-title">${suites.map((suite, index) => `
        <article id="${suite.id}" class="suite">
          <p class="eyebrow">${e(suite.base)}</p><h3>${e(suite.name)}</h3><p><strong>${e(suite.room)}</strong></p>
          <dl>
            <div><dt>Sleeping setup</dt><dd>${e(suite.layout)} ${cite(suite.capacitySource, "Official rooms")}</dd></div>
            <div><dt>Park access</dt><dd>${e(suite.transport)} ${cite(suite.transportSource, "Transport terms")}</dd></div>
            <div><dt>Water features &amp; admission</dt><dd>${e(suite.water)} ${cite(suite.waterSource, "Water terms")}</dd></div>
            <div><dt>Important limitation</dt><dd>${e(suite.caution)} ${cite(suite.cautionSource ?? suite.capacitySource, "Check the notice or benefit")}</dd></div>
            <div><dt>Cost evidence</dt><dd>${e(suite.costNote)} ${cite(suite.parkingSource, "Published fees")}</dd></div>
          </dl>
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
        <li><strong>Price the same trip:</strong> obtain comparable room totals including tax, mandatory fees, parking, tickets and transfers. Do not add a fee twice when the rate already includes it. No date-specific family quotes have been observed here.</li>
        <li><strong>Check the journeys:</strong> verify each park stop, booking requirement and last return service. We have not tested travel times, stroller routes or the ease of returning for naps.</li>
      </ol>
    </section>
    <section>
      <h2>One example of a Universal-area base</h2>
      <figure><img src="https://thumb.wikimedia.org/wikipedia/commons/thumb/b/ba/Cabana_Bay_Beach_Resort_01.jpg/1280px-Cabana_Bay_Beach_Resort_01.jpg" width="1280" height="920" loading="lazy" decoding="async" alt="Cabana Bay Beach Resort exterior photographed in December 2024."><figcaption>Cabana Bay, December 31, 2024. Farragutful, <a href="https://commons.wikimedia.org/wiki/File:Cabana_Bay_Beach_Resort_01.jpg">Wikimedia Commons</a>, <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>. Uncropped, displayed smaller; not a photo of the compared suite.</figcaption></figure>
    </section>
    <section id="methodology"><h2>Research, not a hotel review</h2>
      <p>These three room categories illustrate different park-base and water-benefit decisions. We have not stayed at these properties, tested the journeys or assessed service quality. No review score, best-value winner or firm family-suitability verdict is implied.</p>
      <p>Official facts are linked beside each comparison. The fee arithmetic is an illustration from published components, not a booking quote. Missing room-policy evidence stays unknown. The page does not infer a room maximum from waterpark wristbands, treat an expected reopening as confirmed, or extend a seasonal offer to unspecified dates.</p>
      <p>Inputs are processed locally and are not saved or submitted. This page does not book, contact hotels or check live inventory. Source dates describe our inspection, not when a property's terms last changed.</p>
      <p><a href="../about.html">How Family Tripwise handles research and uncertainty</a></p>
    </section>
  </main><footer class="site-footer"><p>Family Tripwise. Research-based family travel planning.</p><a href="../index.html">Browse destinations</a></footer>
  <script type="module" src="../orlando/orlando-suite-client.mjs"></script>
</body></html>
`;
}

export function writeOrlandoSuitePage(writeSite) {
  writeSite(orlandoPath, orlandoSuitePage());
  for (const name of ["data", "model", "client"]) writeSite(`orlando/orlando-suite-${name}.mjs`, readFileSync(new URL(`./orlando-suite-${name}.mjs`, import.meta.url), "utf8"));
}

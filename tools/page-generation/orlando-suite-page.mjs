import { readFileSync } from "node:fs";
import { contributorCredit } from "./contributors.mjs";
import { checkedOn, pageUpdatedOn, sources, suites } from "./orlando-suite-data.mjs";
import { compareStay, escapeHtml as e, renderChecks } from "./orlando-suite-model.mjs";
import { siteHeader, siteEnd } from "./site-chrome.mjs";
import { withLinkPreview } from "./link-previews.mjs";

export const orlandoPath = "where-to-stay/orlando-family-hotels.html";
export const orlandoRateCsvPath = "downloads/orlando-ihg-dated-rates.csv";
export const orlandoCombinedRateCsvPath = "downloads/orlando-dated-rates.csv";
export const orlandoMealCsvPath = "downloads/orlando-meal-planning.csv";
const rateHeadings = ["Property", "Exact room", "Party and age basis", "Stay dates", "Nights", "Currency", "Price unit", "Dated public plan", "Estimated stay total", "Derived approximate nightly", "Room subtotal", "Included resort fees", "Included displayed taxes", "Plan terms", "Fee and acceptance limits", "Deposit timing conflict", "Price observed", "Terms checked", "Dated source", "Live comparison"];
const ihgRateRows = records => records.flatMap(suite => [suite.priceSample, suite.alternatePriceSample].filter(Boolean).map(rate => [
    suite.name, rate.room, rate.party, `${rate.stay} (older observation)`, rate.nights, "USD", "one room / per night; stay total for stated nights",
    rate.plan, rate.estimatedTotal.toFixed(2), (rate.estimatedTotal / rate.nights).toFixed(2), rate.roomSubtotal.toFixed(2),
    rate.resortFees.toFixed(2), rate.taxes.toFixed(2), rate.terms, suite.priceTerms.limitation, suite.priceTerms.depositConflict,
    rate.observedOn, suite.priceTerms.checkedOn, sources[rate.source], `https://familytripwise.com/${orlandoPath}#ihg-rate-plans`
  ]));
const rateCsv = rows => {
  const cell = value => {
    const plain = String(value ?? "").replaceAll(/[\r\n\t]+/g, " ");
    const safe = /^\s*[=+\-@]/.test(plain) ? `'${plain}` : plain;
    return `"${safe.replaceAll('"', '""')}"`;
  };
  return rows.map(row => row.map(cell).join(",")).join("\n") + "\n";
};
export function orlandoRateComparisonCsv(records = suites) {
  return rateCsv([rateHeadings, ...ihgRateRows(records)]);
}
const combinedRateRows = records => records.flatMap(suite => {
    const booking = suite.bookingRates;
    if (!booking) return ihgRateRows([suite]).map(row => [...row, "USD displayed in the dated IHG currency selector and rate disclosures."]);
    return booking.plans.map(rate => [
      suite.name, booking.room, booking.party, `${booking.stay} (older observation)`, booking.nights, booking.currency,
      "one room / per night; stay total for stated nights", rate.plan, rate.estimatedTotal.toFixed(2),
      (rate.estimatedTotal / booking.nights).toFixed(2), rate.roomSubtotal.toFixed(2), "Unknown", rate.taxes.toFixed(2),
      `${rate.restrictions} ${booking.terms}`, `${booking.feeBasis} ${booking.limitation}`, "Deposit amount and applicable cancellation deadline require confirmation.",
      booking.checkedOn, booking.checkedOn, sources[booking.source],
      `https://familytripwise.com/${orlandoPath}#${suite.id}`, booking.currencyBasis
    ]);
  });
export function orlandoCombinedRateComparisonCsv(records = suites) {
  return rateCsv([[...rateHeadings, "Currency basis"], ...combinedRateRows(records)]);
}
export function orlandoMealComparisonCsv(records = suites) {
  const headings = [...rateHeadings, "Currency basis", "Published equipment", "Kitchen planning scope", "Breakfast venue", "Breakfast location", "Published breakfast hours", "Meal limits", "Meal source checked", "Equipment or room-scope source", "Breakfast source"];
  const rows = records.flatMap(suite => {
    const kitchen = suite.kitchenPolicy, meal = suite.mealPolicy;
    const policy = meal ?? kitchen;
    if (!policy) return [];
    const breakfast = meal?.breakfast;
    const mealCells = [
      kitchen?.equipment.join("; ") ?? "Unknown for this exact room",
      meal?.kitchenNote ?? kitchen.planningNote,
      breakfast?.venue ?? "Unknown in this equipment record",
      breakfast?.location ?? "Unknown in this equipment record",
      breakfast ? `${breakfast.opens}-${breakfast.closes}` : "Unknown in this equipment record",
      policy.limitation,
      policy.checkedOn, sources[meal?.roomSource ?? kitchen.source],
      meal ? sources[meal.diningSource] : "Not established in this equipment record"
    ];
    return combinedRateRows([suite]).map(row => [...row, ...mealCells]);
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
const usd = value => `USD${value.toFixed(2)}`;
const perNight = (total, nights) => `About USD${Math.round(total / nights)} per room/night`;
// One shape for both priced records: shared stay basis plus each public plan.
const ratePlans = suite => {
  const booking = suite.bookingRates;
  if (booking) return {
    observedOn: booking.checkedOn, stay: booking.stay, nights: booking.nights, room: booking.room, party: booking.party,
    plans: booking.plans.map(rate => ({ plan: rate.plan, total: rate.estimatedTotal, roomSubtotal: rate.roomSubtotal, taxes: rate.taxes, terms: rate.restrictions })),
    totalLabel: "displayed"
  };
  const samples = [suite.priceSample, suite.alternatePriceSample].filter(Boolean);
  if (!samples.length) return null;
  const [first] = samples;
  for (const rate of samples) if (rate.stay !== first.stay || rate.nights !== first.nights || rate.room !== first.room || rate.party !== first.party || rate.observedOn !== first.observedOn) throw new Error(`${suite.id} price samples must share one stay basis`);
  return {
    observedOn: first.observedOn, stay: first.stay, nights: first.nights, room: first.room, party: first.party,
    plans: samples.map(rate => ({ plan: rate.plan, total: rate.estimatedTotal, roomSubtotal: rate.roomSubtotal, resortFees: rate.resortFees, taxes: rate.taxes, terms: rate.terms })),
    totalLabel: "estimated"
  };
};
const sampleBasis = () => {
  const bases = [...new Set(suites.map(ratePlans).filter(Boolean).map(rates => `checked ${longDate(rates.observedOn)} for ${rates.stay}`))];
  return `Nightly samples are older observations ${bases.map(e).join("; ")}: one room, two adults and three children (ages not entered), stay total divided by nights. Stay totals, plan terms and how we checked each sample are with each suite below.`;
};
const longDate = iso => new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
export const nightlyCell = suite => {
  const rates = ratePlans(suite);
  if (!rates) return "Not observed for this room, party and dates";
  return rates.plans.map(rate => `${e(rate.plan)}: <strong>${perNight(rate.total, rates.nights)}</strong>`).join("<br>");
};
const sharedResortFee = rates => {
  const fees = [...new Set(rates.plans.map(rate => rate.resortFees).filter(fee => fee !== undefined))];
  return fees.length === 1 ? fees[0] : null;
};
const stayTotals = suite => {
  const rates = ratePlans(suite);
  if (!rates) return `<p><strong>Approx. nightly price:</strong> a matching room/party/date quote has not been observed.</p>`;
  const fee = sharedResortFee(rates);
  if (rates.plans.some(rate => rate.resortFees !== undefined) && fee === null) throw new Error(`${suite.id} plans need one shared resort-fee amount`);
  const ihg = !suite.bookingRates;
  const attrs = ihg ? `id="ihg-rate-plans" data-rate-plans="${e(suite.id)}"` : `data-booking-rates="${e(suite.id)}"`;
  const caption = `Older observation ${longDate(rates.observedOn)} &middot; ${e(rates.stay)} &middot; ${rates.nights} nights &middot; one room, ${e(rates.room)} &middot; ${e(rates.party)}`;
  const rows = rates.plans.map(rate => `<tr><th scope="row">${e(rate.plan)}</th><td>${usd(rate.total)} ${rates.totalLabel} for ${rates.nights} nights</td><td>${usd(rate.roomSubtotal)} room${rate.resortFees !== undefined ? " + resort fees" : ""} + ${usd(rate.taxes)} displayed taxes</td><td>${e(rate.terms)}</td></tr>`).join("");
  const feeLine = fee === null ? "" : ` Both totals also include ${usd(fee)} in resort fees for the ${rates.nights} nights.`;
  return `<div class="stay-totals" ${attrs}><p class="rate-basis">${caption}</p><div class="table-scroll" tabindex="0" role="region" aria-label="${e(suite.name)} dated stay totals"><table><caption>Dated stay totals by public plan</caption><colgroup><col class="plan-col"><col class="total-col"><col class="parts-col"><col></colgroup><thead><tr><th scope="col">Public plan</th><th scope="col">Stay total</th><th scope="col">Made up of</th><th scope="col">Plan terms</th></tr></thead><tbody>${rows}</tbody></table></div><p>Approximate nightly samples are in the <a href="#quick-compare">comparison table</a>.${feeLine} Confirm the deposit, cancellation deadline and fee inclusion for your booking before paying; check live rates.${ihg ? ` <a href="../${orlandoRateCsvPath}" download>Download dated IHG rates (CSV)</a>` : ""}</p></div>`;
};
const howChecked = suite => {
  const booking = suite.bookingRates;
  if (booking) return `<details class="how-checked"><summary>How we checked ${e(suite.name)}</summary><p>${cite(booking.source, "Official Cabana Bay rate details")} &middot; price and terms observed ${e(booking.checkedOn)}, not refreshed during page assembly.</p><p><strong>Deposit and cancellation:</strong> ${e(booking.terms)}</p><p><strong>Taxes and extras:</strong> ${e(booking.feeBasis)}</p><p><strong>Currency:</strong> ${e(booking.currencyBasis)}</p><p><strong>Limits:</strong> ${e(booking.limitation)}</p></details>`;
  const sample = suite.priceSample;
  if (!sample) return "";
  return `<details class="how-checked"><summary>How we checked ${e(suite.name)}</summary><p>${cite(sample.source, "Dated IHG rate details")} &middot; price observed ${e(sample.observedOn)}; price terms checked ${e(suite.priceTerms.checkedOn)}, not refreshed during page assembly.</p><p><strong>Taxes and extras:</strong> ${e(suite.priceTerms.limitation)}</p><p><strong>Deposit timing:</strong> ${e(suite.priceTerms.depositConflict)}</p></details>`;
};

export function orlandoSuitePage() {
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
  <link rel="canonical" href="${canonical}"><link rel="stylesheet" href="../styles.css"><link rel="stylesheet" href="../orlando-suites.css?v=ft-q09c-orl">
  <script type="application/ld+json">${JSON.stringify(schema)}</script>
</head>
<body class="orlando-page">
  ${siteHeader("../", "where-to-stay/orlando-family-hotels.html", { skipLabel: "Skip to comparison" })}
  <main id="main">
    <section class="intro">
      <p class="eyebrow">Orlando, Florida</p><h1>Orlando family hotels</h1>
      ${contributorCredit()}
      <p class="lede">Room for everyone, the right park base, and water benefits that actually apply to your dates.</p>
      <p>Three suite options across Disney, Universal and an off-site waterpark base. This is a focused comparison for a family considering one room, not a best-hotel ranking or a complete Orlando directory.</p>
      <p>Base sources checked <time datetime="${checkedOn}">September 24, 2026</time>; IHG booking capacity and general fee comparison checked <time datetime="${pageUpdatedOn}">September 27, 2026</time>. Dated IHG price plans checked October 11, 2026. <span id="freshness">Check live rates and current terms before paying.</span></p>
      <div class="jump-links"><a href="#quick-compare">Compare bases</a><a href="#stay-check">Check dates &amp; fees</a><a href="#before-booking">Booking questions</a></div>
    </section>
    <section id="quick-compare">
      <h2>Start with the park days you will repeat</h2>
      <p><a href="../${orlandoCombinedRateCsvPath}" download>Download dated Cabana Bay and IHG rates (CSV)</a></p>
      <p data-meal-download><a href="../${orlandoMealCsvPath}" download>Download dated rates &amp; meal checks (CSV)</a></p>
      <p id="overview-caption">Published room categories and dated nightly samples, not live availability or quotes.</p>
      <div class="table-scroll" tabindex="0" role="region" aria-label="Suite overview"><table class="overview-table" aria-labelledby="overview-caption"><thead><tr><th scope="col">Base / property</th><th scope="col">Exact room category</th><th scope="col">Published headcount</th><th scope="col">Dated nightly sample</th></tr></thead><tbody>
        ${suites.map(suite => `<tr><th scope="row">${e(suite.base)}<br><a href="#${suite.id}">${e(suite.name)}</a></th><td>${e(suite.room)}</td><td>${suite.maximum === null ? "Unresolved" : `Up to ${suite.maximum}`}<br>${cite(suite.capacitySource, suite.id === "holiday-inn" ? "Dated IHG rate details" : "Official rooms")}</td><td class="nightly-cell">${nightlyCell(suite)}</td></tr>`).join("\n")}
      </tbody></table></div>
      <p>${sampleBasis()}</p>
      <p><strong>Disney plus Universal:</strong> none of these records establishes one included transport service covering both resorts. Fix your park list before choosing a base. Compare the cost and effort of cross-resort days, not just the room price.</p>
      <p><a href="../things-to-do/orlando-with-kids.html">Plan non-park days: compare Orlando activity admission prices, hours and re-entry rules</a>.</p>
    </section>
    <section id="stay-check">
      <h2>Your dates and known fee components</h2>
      <form id="stay-form" hidden>
        <div class="form-grid">
          <label>Arrival<input name="arrival" type="date" min="${checkedOn}" max="2027-12-31" value="2026-11-08" required></label>
          <label>Departure<input name="departure" type="date" min="2026-09-25" max="2028-01-01" value="2026-11-13" required></label>
          <label>Children (plus two adults)<select name="children">${[1,2,3,4,5].map(n => `<option${n === 3 ? " selected" : ""}>${n}</option>`).join("")}</select></label>
          <label>Overnight vehicle<select name="car"><option value="one">One vehicle</option><option value="none">No vehicle</option><option value="unknown">Not decided</option></select></label>
          <label>Holiday Inn resort fee already in your rate?<select name="feeIncluded"><option value="unknown">Not verified</option><option value="yes">Yes, already included</option><option value="no">No, the standard nightly fee applies separately</option></select></label>
        </div>
        <div class="actions"><button type="submit" disabled>Compare stay</button><button type="reset" disabled>Restore example</button></div>
      </form>
      <noscript><p>Example: two adults and three children, November 8-13, 2026, one vehicle; prices shown are older observations, not current quotes. All sources and comparison details are available below; personalized checks need JavaScript.</p></noscript>
      <p id="stay-status" role="status" aria-live="polite"></p>
      <h3 id="results-title">Example (older observations): 5 people / 5 nights / November 8-13, 2026</h3>
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
          ${stayTotals(suite)}${howChecked(suite)}
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
        <li><strong>Price the same trip:</strong> obtain comparable room totals including tax, mandatory fees, parking, tickets and transfers. Do not add a fee twice when the rate already includes it. The two IHG plans lack child ages and do not price these other rooms or future bookings.</li>
        <li><strong>Check the journeys:</strong> verify each park stop, booking requirement and last return service. We have not tested travel times, stroller routes or the ease of returning for naps.</li>
      </ol>
    </section>
    <section>
      <h2>One example of a Universal-area base</h2>
      <figure><img src="../images/orlando-cabana-bay.webp" width="1280" height="919" loading="lazy" decoding="async" alt="Cabana Bay Beach Resort exterior photographed in December 2024."><figcaption>Cabana Bay, December 31, 2024. Farragutful, <a href="https://commons.wikimedia.org/wiki/File:Cabana_Bay_Beach_Resort_01.jpg">Wikimedia Commons</a>, <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>. Uncropped, displayed smaller; not a photo of the compared suite.</figcaption></figure>
    </section>
    <section id="methodology"><h2>Research, not a hotel review</h2>
      <p>These three room categories illustrate different park-base and water-benefit decisions. We have not stayed at these properties, tested the journeys or assessed service quality. No review score, best-value winner or firm family-suitability verdict is implied.</p>
      <p>Official facts are linked beside each comparison. The fee arithmetic is an illustration from published components, not a booking quote. Cabana Bay parking has no calculated stay subtotal because its published per-vehicle amount does not establish billing frequency. The dated IHG plans are observed party-count/rate-plan results, not transferable family prices; exact-age acceptance and comparable totals remain unknown. The page does not infer a room maximum from waterpark wristbands, treat an expected reopening as confirmed, or extend a seasonal offer to unspecified dates.</p>
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

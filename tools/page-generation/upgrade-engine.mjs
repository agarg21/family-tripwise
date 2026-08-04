import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const markerStart = "<!-- priority-upgrade:start -->";
const markerEnd = "<!-- priority-upgrade:end -->";
const schemaStart = "<!-- schema:start -->";
const schemaEnd = "<!-- schema:end -->";

import { activityPages, stayPages, itineraryPages, teenPages } from "./upgrade-page-data.mjs";

function esc(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function slugify(value) {
  return String(value ?? "")
    .toLowerCase()
    .replaceAll("&", "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function stripMarked(html, start, end) {
  return html.replace(new RegExp(`${start}[\\s\\S]*?${end}\\n?`, "g"), "");
}

function updateHead(html, { title, description }) {
  return html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${esc(description)}">`);
}

function renderQuickPicks(items) {
  return `        <div class="quick-pick-grid">
${items.map(([label, pick, why]) => `          <article class="quick-pick">
            <span>${esc(label)}</span>
            <strong>${esc(pick)}</strong>
            <p>${esc(why)}</p>
          </article>`).join("\n")}
        </div>`;
}

function renderActivityComparison(rows, customHeaders, wrapperClass = "", options = {}) {
  const headers = customHeaders || ["Activity", "Best ages", "Time", "Cost", "Area", "Stroller", "Rain", "Nap", "Booking", "Why worth it", "Pair nearby"];
  const className = ["comparison-scroll", wrapperClass].filter(Boolean).join(" ");
  const wrapperAttributes = options.accessibleLabel
    ? ` tabindex="0" role="region" aria-label="${esc(options.accessibleLabel)}"`
    : "";
  return `        <div class="${esc(className)}"${wrapperAttributes}>
          <table class="comparison-table">
            <thead><tr>${headers.map((header) => `<th${options.accessibleLabel ? ' scope="col"' : ""}>${esc(header)}</th>`).join("")}</tr></thead>
            <tbody>
${rows.map((row) => `              <tr>${row.map((cell, index) => `<td${options.rowHeaders && index === 0 ? ' role="rowheader"' : ""}>${esc(cell)}</td>`).join("")}</tr>`).join("\n")}
            </tbody>
          </table>
        </div>`;
}

function scriptSafeJson(value) {
  return JSON.stringify(value).replaceAll("<", "\\u003c");
}

export function attractionLogisticsCsv(records) {
  const columns = ["name", "area", "setting", "timeEstimate", "costEstimate", "currentCheck", "weatherRole", "transportPrompt", "evidenceNote", "unknowns", "checked", "officialUrl"];
  const csvCell = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
  return [columns, ...records.map((record) => columns.map((column) => record[column]))]
    .map((row) => row.map(csvCell).join(","))
    .join("\r\n");
}

export function attractionCostFrictionCsv(records) {
  const columns = ["name", "zone", "setting", "timeEstimate", "familyAdmissionEstimate", "costBasis", "inclusions", "exclusions", "currentCheck", "evidenceClass", "confidence", "unknowns", "checked", "officialUrl"];
  const csvCell = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
  return [columns, ...records.map((record) => columns.map((column) => record[column]))]
    .map((row) => row.map(csvCell).join(","))
    .join("\r\n");
}

function renderAttractionLogisticsIndex(records, note) {
  return `      <section class="container page-section rank-ready-section" aria-labelledby="san-diego-logistics-index-title">
        <div class="section-heading">
          <p class="eyebrow">Plan the practical details</p>
          <h2 id="san-diego-logistics-index-title">San Diego family attraction logistics index</h2>
        </div>
        <p class="review-label" id="san-diego-logistics-index-note">${esc(note)}</p>
        <p><button class="button primary" id="download-san-diego-attraction-logistics" type="button">Download CSV</button></p>
        <div class="comparison-scroll logistics-comparison" tabindex="0" role="region" aria-label="San Diego family attraction logistics">
          <table class="comparison-table">
            <thead><tr><th scope="col">Choice</th><th scope="col">Setting and time estimates</th><th scope="col">Cost estimate</th><th scope="col">Check now</th><th scope="col">Weather role</th><th scope="col">Transport starting point</th><th scope="col">Still uncertain</th><th scope="col">Official source</th></tr></thead>
            <tbody>
${records.map((record) => `              <tr><th scope="row">${esc(record.name)}<br><small>${esc(record.area)}</small></th><td>${esc(record.setting)} estimate<br>${esc(record.timeEstimate)} estimate</td><td>${esc(record.costEstimate)} estimate</td><td>${esc(record.currentCheck)}</td><td>${esc(record.weatherRole)}</td><td>${esc(record.transportPrompt)}</td><td>${esc(record.unknowns)}</td><td><a href="${esc(record.officialUrl)}">Official source</a><br>Checked ${esc(record.checked)}</td></tr>`).join("\n")}
            </tbody>
          </table>
        </div>
        <script type="application/json" id="san-diego-attraction-logistics-data">${scriptSafeJson(records)}</script>
        <script>
          (() => {
            const button = document.getElementById("download-san-diego-attraction-logistics");
            const data = JSON.parse(document.getElementById("san-diego-attraction-logistics-data").textContent);
            ${attractionLogisticsCsv.toString()}
            button.addEventListener("click", () => {
              const csv = attractionLogisticsCsv(data);
              const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
              const link = document.createElement("a");
              link.href = url;
              link.download = "san-diego-family-attraction-logistics-2026-07-31.csv";
              document.body.append(link);
              link.click();
              link.remove();
              URL.revokeObjectURL(url);
            });
          })();
        </script>
      </section>`;
}

function renderAttractionCostFrictionIndex(records, note, config) {
  const id = config.id;
  return `      <section class="container page-section rank-ready-section" aria-labelledby="${esc(id)}-title">
        <div class="section-heading">
          <p class="eyebrow">${esc(config.eyebrow)}</p>
          <h2 id="${esc(id)}-title">${esc(config.title)}</h2>
        </div>
        <p class="review-label" id="${esc(id)}-note">${esc(note)}</p>
        <p><button class="button primary" id="download-${esc(id)}" type="button">Download CSV</button></p>
        <div class="comparison-scroll logistics-comparison" tabindex="0" role="region" aria-label="${esc(config.ariaLabel)}">
          <table class="comparison-table">
            <thead><tr><th scope="col">Choice</th><th scope="col">Approximate family admission</th><th scope="col">Planning shape</th><th scope="col">Check before going</th><th scope="col">Evidence</th></tr></thead>
            <tbody>
${records.map((record) => `              <tr><th scope="row">${esc(record.name)}<br><small>${esc(record.zone)}</small></th><td><strong>${esc(record.familyAdmissionEstimate)}</strong><br>${esc(record.costBasis)}<br><small>Includes: ${esc(record.inclusions)} Excludes: ${esc(record.exclusions)}</small></td><td>${esc(record.setting)}<br>${esc(record.timeEstimate)} estimate</td><td>${esc(record.currentCheck)}<br><small>Still uncertain: ${esc(record.unknowns)}</small></td><td><strong>Evidence:</strong> ${esc(record.evidenceClass)}<br><strong>Confidence:</strong> ${esc(record.confidence)}<br><a href="${esc(record.officialUrl)}">Official source</a><br>Checked ${esc(record.checked)}</td></tr>`).join("\n")}
            </tbody>
          </table>
        </div>
        <script type="application/json" id="${esc(id)}-data">${scriptSafeJson(records)}</script>
        <script>
          (() => {
            const button = document.getElementById("download-${esc(id)}");
            const data = JSON.parse(document.getElementById("${esc(id)}-data").textContent);
            ${attractionCostFrictionCsv.toString()}
            button.addEventListener("click", () => {
              const csv = attractionCostFrictionCsv(data);
              const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
              const link = document.createElement("a");
              link.href = url;
              link.download = "${esc(config.downloadFilename)}";
              document.body.append(link);
              link.click();
              link.remove();
              URL.revokeObjectURL(url);
            });
          })();
        </script>
      </section>`;
}

function renderVisitorScan(rows) {
  const headers = ["Trip type", "Best picks", "Age band", "Weather", "Budget", "Stroller/transit note", "Next step"];
  return `        <div class="comparison-scroll">
          <table class="comparison-table">
            <thead><tr>${headers.map((header) => `<th>${esc(header)}</th>`).join("")}</tr></thead>
            <tbody>
${rows.map(([trip, picks, ages, weather, budget, note, href, linkText]) => `              <tr><td>${esc(trip)}</td><td>${esc(picks)}</td><td>${esc(ages)}</td><td>${esc(weather)}</td><td>${esc(budget)}</td><td>${esc(note)}</td><td><a href="${esc(href)}">${esc(linkText)}</a></td></tr>`).join("\n")}
            </tbody>
          </table>
        </div>`;
}

function renderDetails(details, compact = false) {
  const labels = compact
    ? ["Why consider it", "Main tradeoff", "How to plan it", "Pair nearby"]
    : ["Why families like it", "Best ages", "What can go wrong", "Parent logistics", "Food/bathroom/reset", "Booking/timing", "Nearby pairing"];
  return `        <div class="detail-card-grid">
${details.map(([name, ...rawValues]) => {
  const values = compact
    ? [`${rawValues[0]} ${rawValues[1]}`, rawValues[2], `${rawValues[3]} ${rawValues[4]} ${rawValues[5]}`, rawValues[6]]
    : rawValues;
  return `          <article class="detail-card">
            <h3>${esc(name)}</h3>
            ${values.map((value, index) => `<section><h4>${esc(labels[index])}</h4><p>${esc(value)}</p></section>`).join("\n            ")}
          </article>`;
}).join("\n")}
        </div>`;
}

function renderPlans(plans) {
  return `        <div class="plan-grid">
${Object.entries(plans).map(([label, plan]) => `          <article class="plan-card">
            <h3>${esc(label)}</h3>
            <p>${esc(plan)}</p>
          </article>`).join("\n")}
        </div>`;
}

function renderDayPlans(plans) {
  return `        <div class="detail-card-grid">
${plans.map(([title, fit, blocks, stopRule]) => `          <article class="detail-card itinerary-plan">
            <h3>${esc(title)}</h3>
            <section><h4>Use this for</h4><p>${esc(fit)}</p></section>
            ${blocks.map(([label, body]) => `<section><h4>${esc(label)}</h4><p>${esc(body)}</p></section>`).join("\n            ")}
            <section><h4>Stop rule</h4><p>${esc(stopRule)}</p></section>
          </article>`).join("\n")}
        </div>`;
}

function renderClusterCards(cards, cardClass = "activity-card") {
  return `        <div class="card-grid">
${cards.map(([title, body, href, linkText]) => `          <article class="${esc(cardClass)}"><h3>${esc(title)}</h3><p>${esc(body)}</p><p><a class="text-link" href="${esc(href)}">${esc(linkText)}</a></p></article>`).join("\n")}
        </div>`;
}

function renderLinkList(links) {
  return links.map(([href, label]) => `<a class="text-link" href="${esc(href)}">${esc(label)}</a>`).join(" ");
}

function renderPersonaRoutes(routes) {
  return `        <div class="card-grid">
${routes.map(([persona, body, links]) => `          <article class="activity-card"><h3>${esc(persona)}</h3><p>${esc(body)}</p><p>${renderLinkList(links)}</p></article>`).join("\n")}
        </div>`;
}

function renderOfficialChecks(checks, cardClass = "activity-card") {
  return `        <div class="card-grid">
${checks.map(([title, body, links]) => `          <article class="${esc(cardClass)}"><h3>${esc(title)}</h3><p>${esc(body)}</p><p>${renderLinkList(links)}</p></article>`).join("\n")}
        </div>`;
}

function renderFaqs(faqs, cardClass = "activity-card") {
  return `        <div class="card-grid">
${faqs.map(([question, answer]) => `          <article class="${esc(cardClass)} faq-card"><h3>${esc(question)}</h3><p>${esc(answer)}</p></article>`).join("\n")}
        </div>`;
}

function replaceBaseActivitySection(html, page) {
  if (!page.activityCards?.length) return html;

  const sectionStart = '      <section class="container page-section">\n        <div class="section-heading">\n          <p class="eyebrow">Activity filters</p>';
  const nextSiblingBand = '      <section class="band">\n        <div class="container card-grid">';
  const sourceSection = '      <section class="container page-section source-section">';
  const start = html.indexOf(sectionStart);
  const possibleEnds = [
    html.indexOf(nextSiblingBand, start),
    html.indexOf(sourceSection, start),
  ].filter((index) => index !== -1);
  const end = possibleEnds.length ? Math.min(...possibleEnds) : -1;
  if (start === -1 || end === -1 || end <= start) {
    throw new Error(`Expected base activity section was not found for ${page.city}`);
  }

  const filters = page.activityFilters || [
    ["all", "All"],
    ["toddler", "Toddler"],
    ["elementary", "Elementary"],
    ["teen", "Teen"],
    ["indoor", "Indoor"],
    ["budget", "Free / low cost"],
  ];
  const cards = page.activityCards.map((activity) => `          <article class="activity-card" data-tags="${esc(activity.tags.join(" "))}">
            <h3>${esc(activity.name)}</h3>
            <p>${esc(activity.summary)}</p>
            <dl>
              <div><dt>Age fit</dt><dd>${esc(activity.age)}</dd></div>
              <div><dt>Time</dt><dd>${esc(activity.time)}</dd></div>
              <div><dt>Cost</dt><dd>${esc(activity.cost)}</dd></div>
              <div><dt>Area</dt><dd>${esc(activity.area)}</dd></div>
            </dl>
          </article>`).join("\n");
  const mapData = page.activityCards.map(({ name, tags, time, cost, area, summary, stroller, rain, nap }) => ({
    name,
    tags,
    time,
    cost,
    stroller,
    rain,
    nap,
    area,
    summary,
  }));
  const section = `      <section class="container page-section">
        <div class="section-heading">
          <p class="eyebrow">Activity filters</p>
          <h2>${esc(page.activityFilterTitle || "Kid-friendly activities by age, pace, and weather")}</h2>
        </div>
        <div class="filter-bar" aria-label="Activity filters">
${filters.map(([value, label], index) => `          <button class="chip${index === 0 ? " active" : ""}" type="button" data-filter="${esc(value)}" aria-pressed="${index === 0 ? "true" : "false"}">${esc(label)}</button>`).join("\n")}
        </div>
        <div class="activity-grid">
${cards}
        </div>
        <script type="application/json" id="map-ready-activities">${JSON.stringify(mapData)}</script>
        <script>
          document.currentScript.closest("section").querySelectorAll(".chip").forEach((chip, _, chips) => {
            chip.addEventListener("click", () => {
              chips.forEach((item) => item.setAttribute("aria-pressed", String(item === chip)));
            });
          });
        </script>
      </section>
`;

  return `${html.slice(0, start)}${section}${html.slice(end)}`;
}

function removeBaseActivitySiblingBand(html, page) {
  if (!page.removeBaseActivitySiblingBand) return html;
  const startMarker = '      <section class="band">\n        <div class="container card-grid">';
  const endMarker = '      <section class="container page-section source-section">';
  const start = html.indexOf(startMarker);
  const end = html.indexOf(endMarker, start);
  if (start === -1 && html.includes(endMarker)) return html;
  if (start === -1 || end === -1 || end <= start) {
    throw new Error(`Expected base activity sibling band was not found for ${page.city}`);
  }
  return `${html.slice(0, start)}${html.slice(end)}`;
}

function renderActivityUpgrade(page) {
  const clusterSection = page.clusterLinks?.length
    ? `
      <section class="band rank-ready-section">
        <div class="container">
          <div class="section-heading">
            <p class="eyebrow">${esc(page.clusterEyebrow || "Plan the cluster")}</p>
            <h2>${esc(page.clusterTitle || "Connect activities to stay area, route, and methodology")}</h2>
          </div>
${renderClusterCards(page.clusterLinks, page.supportCardClass)}
        </div>
      </section>
`
    : "";
  const officialCheckSection = page.officialChecks?.length
    ? `
      <section class="container page-section rank-ready-section">
        <div class="section-heading">
          <p class="eyebrow">${esc(page.officialChecksEyebrow || "Rain and budget checks")}</p>
          <h2>${esc(page.officialChecksTitle || "Verify current offers and backup plans before building around them")}</h2>
        </div>
${renderOfficialChecks(page.officialChecks, page.supportCardClass)}
      </section>
`
    : "";
  const faqSection = page.visibleFaqs && page.faqs?.length
    ? `
      <section class="band rank-ready-section" aria-labelledby="activity-faq-title">
        <div class="container">
          <div class="section-heading">
            <p class="eyebrow">Common planning questions</p>
            <h2 id="activity-faq-title">${esc(page.faqTitle || `${page.city} with kids FAQ`)}</h2>
          </div>
${renderFaqs(page.faqs, page.supportCardClass)}
        </div>
      </section>
`
    : "";
  const plansSection = page.hidePlans
    ? ""
    : `      <section class="container page-section rank-ready-section">
        <div class="section-heading">
          <p class="eyebrow">${esc(page.plansEyebrow || "Mini itineraries")}</p>
          <h2>${esc(page.plansTitle || "Turn the list into a realistic family day")}</h2>
        </div>
${renderPlans(page.plans)}
      </section>`;

  return `${markerStart}
${page.firstTime ? `      <section class="container page-section rank-ready-section">
        <div class="section-heading">
          <p class="eyebrow">First-time visitors</p>
          <h2>Best NYC choices for a first family trip</h2>
        </div>
${renderQuickPicks(page.firstTime)}
        <p class="review-label">Planning guidance only. Verify current museum rules, timed-entry needs, stroller/elevator access, transit changes, weather, and safety advisories before committing to a route.</p>
      </section>

      <section class="band intro-band rank-ready-section">
        <div class="container">
          <div class="section-heading">
            <p class="eyebrow">Tourist trip planning</p>
            <h2>Scan by age, weather, budget, and stroller/transit friction</h2>
          </div>
          <p class="review-label">${esc(page.touristNote)}</p>
${renderVisitorScan(page.scanRows || [])}
        </div>
      </section>

      <section class="container page-section rank-ready-section">
        <div class="section-heading">
          <p class="eyebrow">Next planning step</p>
          <h2>Match activities to your stay base and route</h2>
        </div>
        <div class="card-grid">
          <article class="activity-card"><h3>Choose a family base</h3><p>NYC sightseeing changes by hotel area. Room size, elevator access, subway distance, stroller friction, and evening noise all affect the day.</p><p><a class="text-link" href="../where-to-stay/new-york-city-with-kids.html">Open where to stay in New York City with kids</a></p></article>
          <article class="activity-card"><h3>Turn picks into a route</h3><p>Use the itinerary page to avoid crossing town twice, protect meal windows, and keep rainy-day swaps realistic.</p><p><a class="text-link" href="../family-itinerary/new-york-city-with-kids.html">Open the New York City family itinerary</a></p></article>
          <article class="activity-card"><h3>Keep this page tourist-focused</h3><p>This evergreen guide is for trip planning. Local weekend events, seasonal calendars, and repeat-visit ideas need a separate freshness workflow before publishing.</p></article>
        </div>
      </section>

` : ""}${page.personaRoutes?.length ? `      <section class="container page-section rank-ready-section" aria-labelledby="san-diego-family-constraint-router">
        <div class="section-heading">
          <p class="eyebrow">San Diego cluster router</p>
          <h2 id="san-diego-family-constraint-router">Start with your family constraint</h2>
        </div>
        <p class="review-label">This is the all-ages activity hub. Use it to choose the first planning route, then move to the toddler, teen, stay, hotel, or itinerary page that matches the constraint you actually need to solve.</p>
${renderPersonaRoutes(page.personaRoutes)}
      </section>

` : ""}      <section class="band rank-ready-section">
        <div class="container">
          <div class="section-heading">
            <p class="eyebrow">${esc(page.quickEyebrow || "Quick picks")}</p>
            <h2>${esc(page.quickTitle || "Best choices by family situation")}</h2>
          </div>
${page.quickNote ? `          <p class="review-label">${esc(page.quickNote)}</p>\n` : ""}${renderQuickPicks(page.quick)}
        </div>
      </section>

${page.costFrictionIndex?.length ? renderAttractionCostFrictionIndex(page.costFrictionIndex, page.comparisonNote, page.costFrictionConfig) : page.logisticsIndex?.length ? renderAttractionLogisticsIndex(page.logisticsIndex, page.comparisonNote) : `      <section class="container page-section rank-ready-section">
        <div class="section-heading">
          <p class="eyebrow">Compare activities</p>
          <h2>Activity decision table</h2>
        </div>
${page.comparisonNote ? `        <p class="review-label">${esc(page.comparisonNote)}</p>\n` : ""}${renderActivityComparison(page.rows, page.comparisonHeaders, page.comparisonClass)}
      </section>`}

${page.hideDetails ? "" : `      <section class="band intro-band rank-ready-section">
        <div class="container">
          <div class="section-heading">
            <p class="eyebrow">${esc(page.detailsEyebrow || "Parent logistics")}</p>
            <h2>${esc(page.detailsTitle || "Detailed activity notes")}</h2>
          </div>
${page.detailsNote ? `          <p class="review-label">${esc(page.detailsNote)}</p>\n` : ""}${renderDetails(page.details, page.compactDetails)}
        </div>
      </section>`}

${plansSection}${clusterSection ? `${clusterSection}` : ""}
${officialCheckSection}${faqSection}${markerEnd}
`;
}

function renderTeenUpgrade(page) {
  const indexDecision = page.indexDecision
    ? `        <p class="review-label">${esc(page.indexDecision)}</p>\n`
    : "";
  const clusterCards = page.clusterLinks?.length
    ? renderClusterCards(page.clusterLinks)
    : `          <div class="card-grid">
            <article class="activity-card"><h3>All-ages activity hub</h3><p>Use the main guide when siblings, grandparents, toddlers, or mixed stamina levels change the activity shortlist.</p><p><a class="text-link" href="${esc(page.links.allAges)}">Open the all-ages things-to-do guide</a></p></article>
            <article class="activity-card"><h3>Where to stay</h3><p>Choose the lodging base before locking in teen routes; transit, parking, noise, pool value, and meal access shape the day.</p><p><a class="text-link" href="${esc(page.links.stay)}">Open the where-to-stay guide</a></p></article>
            <article class="activity-card"><h3>Family itinerary</h3><p>Use the itinerary page to keep the teen plan realistic around meals, weather, hotel resets, and younger siblings.</p><p><a class="text-link" href="${esc(page.links.itinerary)}">Open the family itinerary</a></p></article>
          </div>`;
  const officialCheckSection = page.officialChecks?.length
    ? `
      <section class="container page-section rank-ready-section">
        <div class="section-heading">
          <p class="eyebrow">${esc(page.officialChecksEyebrow || "Before locking the plan")}</p>
          <h2>${esc(page.officialChecksTitle || "Current checks for a teen trip")}</h2>
        </div>
${renderOfficialChecks(page.officialChecks)}
      </section>
`
    : "";
  const faqSection = page.visibleFaqs && page.faqs?.length
    ? `
      <section class="band rank-ready-section" aria-labelledby="teen-faq-title">
        <div class="container">
          <div class="section-heading">
            <p class="eyebrow">Common planning questions</p>
            <h2 id="teen-faq-title">${esc(page.faqTitle || `${page.city} with teens FAQ`)}</h2>
          </div>
${renderFaqs(page.faqs)}
        </div>
      </section>
`
    : "";
  return `${markerStart}
      <section class="band rank-ready-section">
        <div class="container">
          <div class="section-heading">
            <p class="eyebrow">Teen quick picks</p>
            <h2>${esc(page.quickHeading || "Best choices by teen trip style")}</h2>
          </div>
${indexDecision}${page.quickNote ? `          <p class="review-label">${esc(page.quickNote)}</p>\n` : ""}${renderQuickPicks(page.quick)}
        </div>
      </section>

      <section class="container page-section rank-ready-section">
        <div class="section-heading">
          <p class="eyebrow">Compare teen activities</p>
          <h2>Teen activity decision table</h2>
        </div>
        <p class="review-label">${esc(page.comparisonNote || "Planning guidance only. Verify current hours, ticketing, age or height rules, weather, transit, stroller needs for siblings, and safety advisories before committing to a teen itinerary.")}</p>
${renderActivityComparison(page.rows, page.comparisonHeaders, page.comparisonClass)}
      </section>

      <section class="band intro-band rank-ready-section">
        <div class="container">
          <div class="section-heading">
            <p class="eyebrow">${esc(page.detailsEyebrow || "Teen logistics")}</p>
            <h2>${esc(page.detailsTitle || "Detailed notes for older-kid planning")}</h2>
          </div>
${page.detailsNote ? `          <p class="review-label">${esc(page.detailsNote)}</p>\n` : ""}${renderDetails(page.details, page.compactDetails)}
        </div>
      </section>

      <section class="container page-section rank-ready-section">
        <div class="section-heading">
          <p class="eyebrow">${esc(page.plansEyebrow || "Teen itineraries")}</p>
          <h2>${esc(page.plansTitle || "Route ideas that avoid generic sightseeing marathons")}</h2>
        </div>
${renderPlans(page.plans)}
      </section>

      <section class="band rank-ready-section">
        <div class="container">
          <div class="section-heading">
            <p class="eyebrow">Plan the cluster</p>
            <h2>Use the teen page with the broader family guide</h2>
          </div>
${clusterCards}
        </div>
      </section>
${officialCheckSection}${faqSection}${markerEnd}
`;
}

function removeGeneratedAgeSections(html) {
  const start = html.indexOf('      <section class="band intro-band">');
  const end = html.indexOf('      <section class="container page-section source-section">');
  if (start === -1 && end !== -1) return html;
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("Expected generated age-page sections were not found");
  }
  return `${html.slice(0, start)}${html.slice(end)}`;
}

function removeGeneratedBodySections(html) {
  return removeGeneratedAgeSections(html);
}

function removeGeneratedItinerarySections(html) {
  const start = html.indexOf('      <section class="container page-section itinerary-layout">');
  const end = html.indexOf('      <section class="container page-section source-section">');
  if (start === -1 && end !== -1) return html;
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("Expected generated itinerary sections were not found");
  }
  return `${html.slice(0, start)}${html.slice(end)}`;
}

function replaceSourceSection(html, page) {
  if (!page.sources?.length) return html;
  const section = `      <section class="container page-section source-section">
        <div class="section-heading">
          <p class="eyebrow">Sources checked</p>
          <h2>Official sources and licensing notes</h2>
        </div>
        <p>${esc(page.sourcesIntro || "Use these official pages to verify current details before planning around them.")}</p>
        <ul class="source-list">
${page.sources.map(([label, href]) => `          <li><a href="${esc(href)}">${esc(label)}</a></li>`).join("\n")}
        </ul>
      </section>`;
  const pattern = /      <section class="container page-section source-section">[\s\S]*?      <\/section>/;
  if (!pattern.test(html)) throw new Error("Expected source section was not found");
  return html.replace(pattern, section);
}

function renderStayMatrix(rows, labelMode = "default", customHeaders, wrapperClass = "") {
  const headers = customHeaders || (labelMode === "verification"
    ? ["Area candidate", "Research angle", "What to verify", "Route/transport check", "Stroller/access check", "Smoke/noise check", "Parking/fee check", "Walking check", "Nearby anchor context", "Property type", "Evidence state"]
    : ["Area", labelMode === "hypothesis" ? "Research angle" : "Best for", "Main tradeoff", "Transit/driving", "Stroller", "Noise", "Parking", "Walkability", "Nearby attractions", "Hotel type", labelMode === "hypothesis" ? "Evidence state" : "Family verdict"]);
  const className = ["comparison-scroll", wrapperClass].filter(Boolean).join(" ");
  return `        <div class="${esc(className)}">
          <table class="comparison-table">
            <thead><tr>${headers.map((header) => `<th>${esc(header)}</th>`).join("")}</tr></thead>
            <tbody>
${rows.map((row) => `              <tr>${row.map((cell) => `<td>${esc(cell)}</td>`).join("")}</tr>`).join("\n")}
            </tbody>
          </table>
        </div>`;
}

function renderItineraryMatrix(rows) {
  const headers = ["Route", "Best structure", "Best for", "Rest window", "Stroller/drive friction", "Meal/reset notes", "What to skip"];
  return `        <div class="comparison-scroll">
          <table class="comparison-table">
            <thead><tr>${headers.map((header) => `<th>${esc(header)}</th>`).join("")}</tr></thead>
            <tbody>
${rows.map((row) => `              <tr>${row.map((cell) => `<td>${esc(cell)}</td>`).join("")}</tr>`).join("\n")}
            </tbody>
          </table>
        </div>`;
}

function renderHotels(hotels) {
  const labels = ["Potential fit", "Room setup", "Pool", "Breakfast", "Kitchen/laundry", "Crib/rollaway", "Parking/fees", "Noise risk", "Family fit to verify"];
  return `        <div class="detail-card-grid">
${hotels.map(([name, ...values]) => `          <article class="detail-card research-card">
            <h3>${esc(name)}</h3>
            ${values.map((value, index) => `<section><h4>${esc(labels[index])}</h4><p>${esc(value)}</p></section>`).join("\n            ")}
          </article>`).join("\n")}
        </div>`;
}

function renderVerificationChecks(checks) {
  return `        <div class="detail-card-grid">
${checks.map(([name, value]) => `          <article class="detail-card research-card">
            <h3>${esc(name)}</h3>
            <p>${esc(value)}</p>
          </article>`).join("\n")}
        </div>`;
}

function renderStayTool() {
  return `      <section class="container page-section rank-ready-section stay-tool-section" aria-labelledby="stay-tool-title">
        <div class="section-heading">
          <p class="eyebrow">Build a shortlist</p>
          <h2 id="stay-tool-title">Choose your biggest family constraint</h2>
        </div>
        <p class="review-label">Select what matters most and get a focused checklist for comparing your final two areas and hotels.</p>
        <div class="stay-tool-layout">
          <form id="san-diego-stay-tool" class="stay-tool-form">
            <fieldset>
              <legend>Hardest trip constraint</legend>
              <label><input type="radio" name="primary" value="beach" checked> Usable beach access</label>
              <label><input type="radio" name="primary" value="activities"> Activity-route simplicity</label>
              <label><input type="radio" name="primary" value="car-light"> Fewer car-dependent moments</label>
              <label><input type="radio" name="primary" value="quiet"> Quiet reset time</label>
              <label><input type="radio" name="primary" value="value"> Full-stay value</label>
              <label><input type="radio" name="primary" value="room"> Room and sleep setup</label>
            </fieldset>
            <fieldset>
              <legend>Expected transport</legend>
              <label><input type="radio" name="transport" value="driving" checked> Driving or rideshare</label>
              <label><input type="radio" name="transport" value="car-light"> Prefer car-light</label>
            </fieldset>
            <fieldset class="stay-tool-needs">
              <legend>Extra constraints</legend>
              <label><input type="checkbox" name="need" value="stroller"> Stroller-sensitive routes</label>
              <label><input type="checkbox" name="need" value="nap"> Midday nap or reset</label>
              <label><input type="checkbox" name="need" value="kitchen"> Kitchen or laundry</label>
            </fieldset>
            <button class="button tool-submit" type="submit">Build my comparison checklist</button>
            <p class="note">Your answers stay in this browser tab and are not sent or stored.</p>
          </form>
          <section class="result-panel stay-tool-result" aria-labelledby="stay-tool-result-title" aria-live="polite">
            <p class="eyebrow">Your research sequence</p>
            <h3 id="stay-tool-result-title">Your comparison checklist</h3>
            <p id="stay-tool-summary">Choose the constraint that would most affect the trip.</p>
            <ol id="stay-tool-checklist">
              <li>Shortlist two areas as hypotheses, not conclusions.</li>
              <li>Verify exact properties, routes, dates, and total prices.</li>
            </ol>
            <p class="note">Recheck changing transit, beach, price, fee, and property information near the booking date.</p>
          </section>
        </div>
        <p class="note stay-tool-sources">Current starting points: <a href="https://www.sandiego.gov/planning/community-plans/mission-valley">City of San Diego Mission Valley plan</a>, <a href="https://www.sdmts.com/getting-around/maps-and-schedules">MTS maps and schedules</a>, and <a href="https://www.sandiegocounty.gov/content/sdc/deh/lwqd/beachandbay.html">County beach and bay status</a>.</p>
        <noscript><p class="review-label">Use the area matrix and four hotel checks below as a manual checklist.</p></noscript>
      </section>`;
}

function renderStayUpgrade(page) {
  const areaNote = page.areaNote ? `        <p class="review-label">${esc(page.areaNote)}</p>\n` : "";
  const decisionSection = page.hotelDecision?.length
    ? `      <section class="container page-section rank-ready-section">
        <div class="section-heading">
          <p class="eyebrow">Hotel decision support</p>
          <h2>How to evaluate family-friendly hotel claims</h2>
        </div>
        <p class="review-label">Hotel guidance on this page is research-based planning support, not a personally verified recommendation. Use official property pages and the booking screen to verify details before paying.</p>
${renderVerificationChecks(page.hotelDecision)}
      </section>`
    : "";
  const bookingSection = page.bookingChecks?.length
    ? `      <section class="container page-section rank-ready-section">
        <div class="section-heading">
          <p class="eyebrow">Booking checks</p>
          <h2>${esc(page.bookingHeading || "Official-source checks before you book")}</h2>
        </div>
${renderVerificationChecks(page.bookingChecks)}
      </section>`
    : "";
  const clusterSection = page.clusterLinks?.length
    ? `      <section class="band rank-ready-section">
        <div class="container">
          <div class="section-heading">
            <p class="eyebrow">Plan the cluster</p>
            <h2>${esc(page.clusterHeading || "Use the stay guide with activities, itinerary, and methodology")}</h2>
          </div>
${renderClusterCards(page.clusterLinks)}
        </div>
      </section>`
    : "";
  const faqSection = page.visibleFaqs && page.faqs?.length
    ? `      <section class="container page-section rank-ready-section" aria-labelledby="stay-faq-title">
        <div class="section-heading">
          <p class="eyebrow">Common planning questions</p>
          <h2 id="stay-faq-title">${esc(page.faqTitle || `${page.city} family stay FAQ`)}</h2>
        </div>
${renderFaqs(page.faqs)}
      </section>`
    : "";
  const hotelSection = page.hideHotelSection ? "" : page.hotels?.length
    ? `      <section class="band intro-band rank-ready-section">
        <div class="container">
          <div class="section-heading">
            <p class="eyebrow">Hotel fit checks</p>
            <h2>Research-backed hotel verification notes</h2>
          </div>
          <p class="review-label">${esc(page.hotelNote || "Research-based hotel fit notes. Verify fees, room type, policies, and amenities before booking; these are not personally verified hotel recommendations.")}</p>
${renderHotels(page.hotels)}
        </div>
      </section>`
    : `      <section class="band intro-band rank-ready-section">
        <div class="container">
          <div class="section-heading">
            <p class="eyebrow">Before booking</p>
            <h2>What to verify before choosing a family hotel</h2>
          </div>
          <p class="review-label">${esc(page.hotelNote || "No firm hotel recommendations are being made in this pass. Verify exact hotel claims before booking.")}</p>
${renderVerificationChecks(page.verify || [])}
        </div>
      </section>`;

  const toolSection = page.stayTool ? `${renderStayTool()}\n\n` : "";

  return `${markerStart}
${toolSection}      <section class="band rank-ready-section">
        <div class="container">
          <div class="section-heading">
            <p class="eyebrow">Quick decision</p>
            <h2>${esc(page.quickHeading || (page.stayTool || page.constraintLed ? "Area hypotheses by family need" : "Best areas by family need"))}</h2>
          </div>
${renderQuickPicks(page.quick)}
        </div>
      </section>

      <section class="container page-section rank-ready-section">
        <div class="section-heading">
          <p class="eyebrow">Area matrix</p>
          <h2>${esc(page.matrixHeading || "Compare the stay tradeoffs before booking")}</h2>
        </div>
${areaNote}${renderStayMatrix(page.rows, page.constraintLed ? "verification" : page.stayTool ? "hypothesis" : "default", page.areaHeaders, page.matrixWrapperClass)}
      </section>

${[decisionSection, hotelSection, bookingSection, clusterSection, faqSection].filter(Boolean).join("\n\n")}
${page.stayTool ? '      <script type="module" src="../san-diego-stay-tool.mjs"></script>\n' : ''}${markerEnd}
`;
}

function renderItineraryUpgrade(page) {
  const clusterCards = page.clusterCards?.length
    ? page.clusterCards
    : [
        ["All-ages activity guide", `Use the main ${page.city} activity guide to compare family stops by age, weather, pacing, and logistics.`, page.links?.allAges || `../things-to-do/${slugify(page.city)}-with-kids.html`, `Open ${page.city} things to do with kids`],
        ["Where to stay first", `Pick the lodging base before locking the route. Area, parking, transit, stroller, noise, and meal access can change the day shape.`, page.links?.stay || `../where-to-stay/${slugify(page.city)}-with-kids.html`, `Open where to stay in ${page.city} with kids`]
      ];

  if (page.dayPlans?.length) {
    const faqSection = page.visibleFaqs && page.faqs?.length
      ? `
      <section class="band rank-ready-section" aria-labelledby="itinerary-faq-title">
        <div class="container">
          <div class="section-heading">
            <p class="eyebrow">Common planning questions</p>
            <h2 id="itinerary-faq-title">${esc(page.faqTitle || `${page.city} family itinerary FAQ`)}</h2>
          </div>
${renderFaqs(page.faqs)}
        </div>
      </section>
`
      : "";
    return `${markerStart}
      <section class="band rank-ready-section">
        <div class="container">
          <div class="section-heading">
            <p class="eyebrow">Quick route decisions</p>
            <h2>${esc(page.quickTitle)}</h2>
          </div>
${renderQuickPicks(page.quick)}
        </div>
      </section>

      <section class="container page-section rank-ready-section">
        <div class="section-heading">
          <p class="eyebrow">Day-by-day routes</p>
          <h2>${esc(page.dayPlansTitle || "Use one, two, or three days without stacking the Strip")}</h2>
        </div>
        <p class="review-label">${esc(page.itineraryNote || "Choose the route shape first, then check the exact attractions, hotel entrance, transport, weather, and tickets for your dates.")}</p>
${renderDayPlans(page.dayPlans)}
      </section>

      <section class="band intro-band rank-ready-section">
        <div class="container">
          <div class="section-heading">
            <p class="eyebrow">Change the route</p>
            <h2>${esc(page.pivotTitle || "Pivot for age, pool time, heat, nature, or budget")}</h2>
          </div>
${renderActivityComparison(page.pivots, page.pivotHeaders, page.pivotComparisonClass, {
  accessibleLabel: page.pivotTableLabel,
  rowHeaders: Boolean(page.pivotTableLabel)
})}
        </div>
      </section>

      <section class="container page-section rank-ready-section">
        <div class="section-heading">
          <p class="eyebrow">Stop rules</p>
          <h2>${esc(page.plansTitle)}</h2>
        </div>
${renderPlans(page.plans)}
      </section>

      <section class="container page-section rank-ready-section">
        <div class="section-heading">
          <p class="eyebrow">Cluster links</p>
          <h2>Finish the activity and lodging decisions</h2>
        </div>
        <div class="card-grid">
${clusterCards.map(([title, body, href, linkText]) => `          <article class="activity-card"><h3>${esc(title)}</h3><p>${esc(body)}</p><p><a class="text-link" href="${esc(href)}">${esc(linkText)}</a></p></article>`).join("\n")}
        </div>
      </section>
${faqSection}${markerEnd}
`;
  }

  return `${markerStart}
      <section class="band rank-ready-section">
        <div class="container">
          <div class="section-heading">
            <p class="eyebrow">Quick route decisions</p>
            <h2>Choose the ${esc(page.city)} plan that matches your family</h2>
          </div>
${renderQuickPicks(page.quick)}
        </div>
      </section>

      <section class="container page-section rank-ready-section">
        <div class="section-heading">
          <p class="eyebrow">Compare itinerary options</p>
          <h2>1-day, 2-day, 3-day, toddler, teen, and rainy-day variants</h2>
        </div>
        <p class="review-label">Planning guidance only. Verify current hours, tickets, weather, route conditions, safety advisories, transit/stroller access, parking, drive or transfer times, and child energy before booking or promising a route.</p>
${renderItineraryMatrix(page.rows)}
      </section>

      <section class="band intro-band rank-ready-section">
        <div class="container">
          <div class="section-heading">
            <p class="eyebrow">Pacing rules</p>
            <h2>How to keep the day from getting too ambitious</h2>
          </div>
${renderPlans(page.plans)}
        </div>
      </section>

      <section class="container page-section rank-ready-section">
        <div class="section-heading">
          <p class="eyebrow">Cluster links</p>
          <h2>Swap activities without rebuilding the whole trip</h2>
        </div>
        <div class="card-grid">
${clusterCards.map(([title, body, href, linkText]) => `          <article class="activity-card"><h3>${esc(title)}</h3><p>${esc(body)}</p><p><a class="text-link" href="${esc(href)}">${esc(linkText)}</a></p></article>`).join("\n")}
        </div>
      </section>
${markerEnd}
`;
}

function faqSchema(page) {
  if (!page.faqs?.length) return "";
  return `${schemaStart}
    <script type="application/ld+json">${JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: page.faqs.map(([question, answer]) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: { "@type": "Answer", text: answer }
      }))
    })}</script>
${schemaEnd}
`;
}

function itemListSchema(page) {
  const items = page.costFrictionIndex?.length ? page.costFrictionIndex : page.logisticsIndex?.length ? page.logisticsIndex : page.rows;
  if (!items?.length) return "";
  return `${schemaStart}
    <script type="application/ld+json">${JSON.stringify({
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: page.schemaName || `${page.city} family travel planning options`,
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: Array.isArray(item) ? item[0] : item.name,
        description: Array.isArray(item)
          ? item[9] || item[1]
          : page.costFrictionIndex?.length
            ? `Approximate family admission: ${item.familyAdmissionEstimate}. Estimated setting: ${item.setting}; estimated time: ${item.timeEstimate}. Current check: ${item.currentCheck}`
            : `Estimated setting: ${item.setting}; estimated time: ${item.timeEstimate}; estimated cost: ${item.costEstimate}. Current check: ${item.currentCheck}.`
      }))
    })}</script>
${schemaEnd}
`;
}

function insertBeforeMainEnd(html, section) {
  if (html.includes('<section class="container page-section source-section">')) {
    return html.replace(
      /\s*<section class="container page-section source-section">/,
      () => `\n${section}      <section class="container page-section source-section">`
    );
  }
  return html.replace(/\s*<\/main>/, () => `\n${section}    </main>`);
}

function insertAfterIntroBand(html, section) {
  const marker = '      <section class="container page-section">\n        <div class="section-heading">\n          <p class="eyebrow">Activity filters</p>';
  if (html.includes(marker)) {
    return html.replace(marker, () => `${section}${marker}`);
  }
  return insertBeforeMainEnd(html, section);
}

function insertSchema(html, schema) {
  if (!schema) return html;
  return html.replace(/\s*<\/body>/, () => `\n${schema}  </body>`);
}

function applyBaseReplacements(html, replacements = []) {
  for (const [before, after] of replacements) {
    if (html.includes(before)) {
      html = html.replace(before, after);
      continue;
    }
    if (!html.includes(after)) {
      throw new Error(`Expected base-page text was not found: ${before.slice(0, 80)}`);
    }
  }
  return html;
}

function upgradeFile(outDir, path, page, type) {
  const full = join(outDir, path);
  let html = readFileSync(full, "utf8");
  html = stripMarked(html, markerStart, markerEnd);
  html = stripMarked(html, schemaStart, schemaEnd);
  html = updateHead(html, page);
  html = applyBaseReplacements(html, page.baseReplacements);
  html = replaceBaseActivitySection(html, page);
  html = removeBaseActivitySiblingBand(html, page);
  if (page.removeGeneratedAgeSections) html = removeGeneratedAgeSections(html);
  if (page.removeGeneratedBodySections) html = removeGeneratedBodySections(html);
  if (page.removeGeneratedItinerarySections) html = removeGeneratedItinerarySections(html);
  html = replaceSourceSection(html, page);
  const section = type === "activity"
    ? renderActivityUpgrade(page)
    : type === "itinerary"
      ? renderItineraryUpgrade(page)
      : type === "teen"
        ? renderTeenUpgrade(page)
      : renderStayUpgrade(page);
  const schema = `${itemListSchema(page)}${faqSchema(page)}`;
  html = page.placement === "after-intro" ? insertAfterIntroBand(html, section) : insertBeforeMainEnd(html, section);
  html = insertSchema(html, schema);
  writeFileSync(full, html);
}

export function upgradePriorityPages(outDir) {
  for (const [path, page] of Object.entries(activityPages)) {
    upgradeFile(outDir, path, page, "activity");
  }
  for (const [path, page] of Object.entries(stayPages)) {
    upgradeFile(outDir, path, page, "stay");
  }
  for (const [path, page] of Object.entries(itineraryPages)) {
    upgradeFile(outDir, path, page, "itinerary");
  }
  for (const [path, page] of Object.entries(teenPages)) {
    upgradeFile(outDir, path, page, "teen");
  }
}

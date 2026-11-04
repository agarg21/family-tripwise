// /holidays/theme-park-christmas-events-with-kids.html (QUEUE G16 step 3, OWNER D32).
// One validated data file (holiday-parks.json) feeds the page. A park leaves after its end_on
// (America/New_York), re-rendered daily by tools/this-week.mjs. No year in the URL: refreshed each season.
import { readFileSync } from "node:fs";
import { contributorCredit } from "./contributors.mjs";
import { siteHeader, siteFooter } from "./site-chrome.mjs";
import { easternDate } from "./sitemap.mjs";
import { withLinkPreview } from "./link-previews.mjs";
import { placeSitePageHero } from "./hero-photos.mjs";

export const holidayParksPath = "holidays/theme-park-christmas-events-with-kids.html";
export const holidayParksUrl = `https://familytripwise.com/${holidayParksPath}`;
export const holidayParksData = () => JSON.parse(readFileSync(new URL("./holiday-parks.json", import.meta.url), "utf8"));
const imageLock = JSON.parse(readFileSync(new URL("../images/commons-images.lock.json", import.meta.url), "utf8"));
const HERO = { slug: "busch-gardens-tampa-bay", alt: "A green steam-style train decorated with holiday garlands passes a lawn at Busch Gardens Tampa Bay, with a roller coaster behind the trees", place: "Busch Gardens Tampa Bay, Florida" };
const MAX_PRICE_AGE_DAYS = 30;
const ISO = /^\d{4}-\d{2}-\d{2}$/;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const e = (v) => String(v ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
const short = (iso) => { const [, m, d] = iso.split("-").map(Number); return `${MONTHS[m - 1]} ${d}`; };
export const familyCost = (park) => Math.round(park.ticket_each * 4);
const ageDays = (from, to) => (Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86400000;
export const priceObservedOn = (park) => park.price_observed_on ?? park.observed_on;
// An old price is never shown as current: past the limit the park stays listed but says "check live".
export const priceIsFresh = (park, today = easternDate()) => ageDays(priceObservedOn(park), today) <= MAX_PRICE_AGE_DAYS;

export function validateHolidayParks(data, today = easternDate()) {
  const errors = [];
  for (const p of data.parks) {
    for (const key of ["id", "name", "place", "event", "dates", "price_note", "extra", "watch", "source_label", "source_url"]) if (!p[key]) errors.push(`${p.id}: missing ${key}`);
    for (const key of ["start_on", "end_on", "observed_on"]) if (!ISO.test(p[key] ?? "")) errors.push(`${p.id}: bad ${key}`);
    if (!["included", "separate"].includes(p.admission)) errors.push(`${p.id}: admission`);
    if (!(p.ticket_each > 0)) errors.push(`${p.id}: ticket_each`);
    if (!/^https:\/\//.test(p.source_url ?? "")) errors.push(`${p.id}: source_url`);
    if (p.price_observed_on && !p.price_source_url) errors.push(`${p.id}: a separate price date needs a price source`);
    if (p.kids?.length !== 3) errors.push(`${p.id}: three kid lines`);
  }
  return errors;
}

export const openParks = (data, today = easternDate()) => data.parks.filter((p) => today <= p.end_on).sort((a, b) => a.ticket_each - b.ticket_each || a.name.localeCompare(b.name));

function card(p, today) {
  const priceSource = p.price_source_url ? `<a href="${e(p.price_source_url)}">${e(p.price_source_label)}</a> (price, read ${short(p.price_observed_on)})` : "";
  return `          <article id="${e(p.id)}" class="holiday-card">
            <h3>${e(p.name)}</h3>
            <p class="holiday-place">${e(p.event)} · ${e(p.place)}</p>
            ${priceIsFresh(p, today) ? `<p class="holiday-figure">from ≈ $${familyCost(p)}<small>tickets for 4, one day, estimate, lowest price we saw, read ${short(priceObservedOn(p))}</small></p>` : `<p class="holiday-figure">Check live<small>our last price read, ${short(priceObservedOn(p))}, is too old to show</small></p>`}
            <p class="holiday-dates"><strong>When:</strong> ${e(p.dates)}</p>
            <ul>${p.kids.map((k) => `<li>${e(k)}</li>`).join("")}</ul>
            <p><strong>Costs extra:</strong> ${e(p.extra)}</p>
            <details class="ds-card-more"><summary>Ticket details, tips and sources</summary>
            <p><strong>Ticket:</strong> ${p.admission === "included" ? "the event comes with a regular park ticket." : "this event has its own ticket."}${priceIsFresh(p, today) ? ` ${e(p.price_note)}` : ""}</p>
            <p><strong>Good to know:</strong> ${e(p.watch)}${p.tip && today <= p.tip_until ? ` ${e(p.tip)}${priceIsFresh(p, today) ? ` ${e(p.tip_price)}` : ""}` : ""}</p>
            <p class="holiday-source"><a href="${e(p.source_url)}">${e(p.source_label)}</a> (read ${short(p.observed_on)})${priceSource ? ` · ${priceSource}` : ""}${p.date_note ? ` ${e(p.date_note)}` : ""}</p>
            </details>
          </article>`;
}

export function holidayParksPage(data = holidayParksData(), today = easternDate()) {
  const errors = validateHolidayParks(data, today);
  if (errors.length) throw new Error(`holiday-parks.json: ${errors.join("; ")}`);
  const parks = openParks(data, today);
  const priced = parks.filter((p) => priceIsFresh(p, today));
  const byId = (id) => parks.find((p) => p.id === id);
  const cheapest = priced[0];
  const top = priced[priced.length - 1];
  const parking = priced.find((p) => p.id === "hersheypark");
  const earliest = parks.filter((p) => p.start_on >= today).sort((a, b) => a.start_on.localeCompare(b.start_on))[0];
  const range = priced.length ? (familyCost(cheapest) === familyCost(top) ? `about $${familyCost(top)}` : `about $${familyCost(cheapest)}&nbsp;to&nbsp;$${familyCost(top)}`) : "";
  const rangeLine = range ? ` One-day tickets for a family of 4 start at ${range}, depending on the park.` : " Check each park's own page for this week's ticket prices.";
  const rows = parks.map((p) => `              <tr><th scope="row"><a href="#${e(p.id)}">${e(p.name)}</a><small>${e(p.place)}${p.table_note ? ` · ${e(p.table_note)}` : ""}</small></th><td class="holiday-when">${e(short(p.start_on))} to ${e(short(p.end_on))}</td><td class="holiday-cost">${priceIsFresh(p, today) ? `from ≈ $${familyCost(p)}` : "Check live"}</td></tr>`).join("\n");
  const small = [
    ["All about Santa", ["hersheypark", "seaworld-san-diego"], "Both pages list Santa with reindeer."],
    ["Kids who love LEGO", ["legoland-florida", "legoland-california"], "Both list reindeer feeding and a giant LEGO tree or light trail."],
    ["A parade and a train", ["silver-dollar-city"], "Its page lists a lights parade and a sing-along steam train."],
    ["Rain in the forecast", ["seaworld-orlando"], "Its page says many shows are indoors, rain or shine."],
    ["Lowest ticket", cheapest ? [cheapest.id] : [], "It's a separate event ticket, so add parking and tax."]
  ].map(([label, ids, why]) => {
    const names = ids.map(byId).filter(Boolean);
    return names.length ? `<li><strong>${e(label)}:</strong> ${names.map((p) => `<a href="#${e(p.id)}">${e(p.name)}</a>`).join(" or ")}. ${e(why)}</li>` : "";
  }).join("");
  const passes = parks.filter((p) => p.pass_check).map((p) => `<li><a href="../deals/${e(p.pass_check)}.html">${e(p.name)} Fun Card check</a>: when a pass beats day tickets, and its blockout dates.</li>`).join("");
  const h1 = priced.length ? `Christmas at ${parks.length} US Theme Parks: Ticket Costs for a Family of 4` : "Theme Park Christmas Events With Kids";
  const img = imageLock[HERO.slug];
  const body = `    <main id="main" class="holiday-page">
      <section class="page-hero">
        <div class="container">
          <p class="eyebrow">US theme parks · Christmas events</p>
          <h1>${e(h1)}</h1>
          <p>${parks.length ? `Lights, Santa and shows at ${parks.length} US parks.${rangeLine}` : "This season's events have ended. We update this page when parks publish their next dates."}</p>
          ${contributorCredit()}
        </div>
      </section>
${parks.length ? `      <section id="holiday-answer" class="container answer-box" aria-label="The short answer">
        <ul>
          ${cheapest ? `<li><strong>Lowest ticket:</strong> ${e(cheapest.name)}, ≈ $${familyCost(cheapest)} for 4</li>` : ""}
          ${parking ? `<li><strong>Free parking included:</strong> ${e(parking.name)} 4-Pack, ≈ $${familyCost(parking)}</li>` : ""}
          ${earliest ? `<li><strong>Next to open:</strong> ${e(earliest.name)}, ${short(earliest.start_on).replace(" ", "&nbsp;")}</li>` : ""}
          <li><strong>Not counted:</strong> tax, fees, food, travel, and parking unless stated</li>
        </ul>
      </section>
      <section class="container page-section" aria-labelledby="holiday-table-title">
        <h2 id="holiday-table-title">Compare the ${parks.length} parks${priced.length === parks.length ? ", lowest price first" : ""}</h2>
        <p class="holiday-note">${priced.length ? "Estimate: the lowest published price we saw times 4, not a quote. Other dates can cost more. We have not priced Christmas week." : "We are re-checking prices. Check each park's live price for your date."}</p>
        <div class="holiday-table-wrap">
          <table class="holiday-table">
            <caption>One day, ${e(data.party)}.</caption>
            <thead><tr><th scope="col">Park</th><th scope="col">Season</th><th scope="col">${priced.length ? "From, for 4" : "Tickets for 4"}</th></tr></thead>
            <tbody>
${rows}
            </tbody>
          </table>
        </div>
        <p>Most parks open on select dates inside these seasons. Check the park calendar for your day.</p>
        <details class="ds-card-more"><summary>Why Disney, Universal and Knott's aren't compared</summary>
          <p>Not listed yet: ${e(data.not_listed)}, because we could not confirm this season's dates and prices on their official pages.</p>
          ${data.date_only_note ? `<p>${e(data.date_only_note)} <a href="${e(data.date_only_source_url)}">${e(data.date_only_source_label)}</a> (read ${short(data.date_only_observed_on)}).</p>` : ""}
        </details>
      </section>
      <section class="container page-section" aria-labelledby="holiday-pick-title">
        <h2 id="holiday-pick-title">Which one fits your kids</h2>
        <ul class="holiday-picks">${small}</ul>
        <p><strong>If bedtime matters:</strong> go by day for Santa and shows, and skip fireworks nights. Check the park's showtimes first. We have no crowd data, so we don't name quiet nights.</p>
      </section>
      <section class="container page-section" aria-labelledby="holiday-cards-title">
        <h2 id="holiday-cards-title">Park by park</h2>
        <div class="holiday-cards">
${parks.map((p) => card(p, today)).join("\n")}
        </div>
      </section>` : ""}
${passes ? `      <section class="container page-section" aria-labelledby="holiday-pass-title">
        <h2 id="holiday-pass-title">Going more than once?</h2>
        <ul>${passes}</ul>
      </section>\n` : ""}      <section class="container page-section" aria-labelledby="holiday-city-title">
        <h2 id="holiday-city-title">City outings</h2>
        <p>What's free and what it costs a family of 4: <a href="./san-diego-christmas-with-kids.html">Christmas in San Diego with kids</a> · <a href="./orlando-christmas-with-kids.html">Christmas in Orlando with kids</a> · <a href="./san-antonio-christmas-with-kids.html">Christmas in San Antonio with kids</a>.</p>
      </section>
      <section class="container trust-panel" aria-label="How we check">
        <p><strong>How we check:</strong> we read each park's own page on the date shown. We have not visited these events. Family figures are the published per-person price times 4. We found no lower child day-ticket price on the ticket pages we read, though one park shows its child price only at checkout (its card says so); free preschool cards are noted on the park's card where we read one.</p>
      </section>
    </main>`;
  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Theme Park Christmas Events With Kids: Cost for a Family of 4 | Family Tripwise</title>
    <meta name="description" content="Compare Christmas events at US theme parks: dates, what kids can do, what costs extra and one-day ticket cost for a family of 4, from each park's own pages.">
    <link rel="canonical" href="${holidayParksUrl}">
    <link rel="stylesheet" href="../styles.css">
  </head>
  <body>
    ${siteHeader("../", holidayParksPath)}
${body}
    ${siteFooter("../", holidayParksPath)}
  </body>
</html>
`;
  return withLinkPreview(placeSitePageHero(html, holidayParksPath, `<img src="../${e(img.path)}" alt="${e(HERO.alt)}" width="${img.width}" height="${img.height}" loading="eager" fetchpriority="high" decoding="async">
          <figcaption>${e(HERO.place)}, an older photo, not of this season's event. Photo: ${e(img.artist)} via <a href="${e(img.source_page)}">Wikimedia Commons</a>, ${img.license_url ? `<a href="${e(img.license_url)}">${e(img.license)}</a>` : e(img.license)}. Resized and cropped.</figcaption>`));
}

export function writeHolidayParksPage(writeSite, today = easternDate()) {
  writeSite(holidayParksPath, holidayParksPage(holidayParksData(), today));
}

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
            ${priceIsFresh(p, today) ? `<p class="holiday-figure">≈ $${familyCost(p)}<small>tickets for 4, one day, estimate, price read ${short(priceObservedOn(p))}</small></p>` : `<p class="holiday-figure">Check live<small>our last price read, ${short(priceObservedOn(p))}, is too old to show</small></p>`}
            <p class="holiday-dates"><strong>When:</strong> ${e(p.dates)}</p>
            <ul>${p.kids.map((k) => `<li>${e(k)}</li>`).join("")}</ul>
            <p><strong>Ticket:</strong> ${p.admission === "included" ? "the event comes with a regular park ticket." : "this event has its own ticket."}${priceIsFresh(p, today) ? ` ${e(p.price_note)}` : ""}</p>
            <p><strong>Costs extra:</strong> ${e(p.extra)}</p>
            <p><strong>Good to know:</strong> ${e(p.watch)}</p>
            <p class="holiday-source"><a href="${e(p.source_url)}">${e(p.source_label)}</a> (read ${short(p.observed_on)})${priceSource ? ` · ${priceSource}` : ""}</p>
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
  const earliest = [...parks].sort((a, b) => a.start_on.localeCompare(b.start_on))[0];
  const range = priced.length ? (familyCost(cheapest) === familyCost(top) ? `about $${familyCost(top)}` : `about $${familyCost(cheapest)} to $${familyCost(top)}`) : "";
  const rangeLine = range ? ` One-day tickets for a family of 4 run ${range}.` : " Check each park's own page for this week's ticket prices.";
  const rows = parks.map((p) => `              <tr><th scope="row"><a href="#${e(p.id)}">${e(p.name)}</a><small>${e(p.place)}</small></th><td class="holiday-when">${e(short(p.start_on))} to ${e(short(p.end_on))}</td><td class="holiday-cost">${priceIsFresh(p, today) ? `≈ $${familyCost(p)}` : "Check live"}</td></tr>`).join("\n");
  const small = [
    ["Small kids, all about Santa", ["hersheypark", "seaworld-san-diego"], "Both pages list Santa plus real reindeer."],
    ["Preschoolers who love building", ["legoland-florida", "legoland-california"], "Reindeer feeding and LEGO characters, at the highest ticket price here."],
    ["A rainy-day risk", ["seaworld-orlando"], "Its page says many shows are indoors, rain or shine."],
    ["Lowest ticket", cheapest ? [cheapest.id] : [], "Check the event date you want, and add parking and tax."]
  ].map(([label, ids, why]) => {
    const names = ids.map(byId).filter(Boolean);
    return names.length ? `<li><strong>${e(label)}:</strong> ${names.map((p) => `<a href="#${e(p.id)}">${e(p.name)}</a>`).join(" or ")}. ${e(why)}</li>` : "";
  }).join("");
  const passes = parks.filter((p) => p.pass_check).map((p) => `<li><a href="../deals/${e(p.pass_check)}.html">${e(p.name)} Fun Card check</a>: when a pass beats day tickets, and its blockout dates.</li>`).join("");
  const img = imageLock[HERO.slug];
  const body = `    <main id="main" class="holiday-page">
      <section class="page-hero">
        <div class="container">
          <p class="eyebrow">US theme parks · Christmas events</p>
          <h1>Theme Park Christmas Events With Kids: What ${parks.length} Cost a Family of 4</h1>
          <p>Lights, Santa and shows at ${parks.length} US parks.${rangeLine}</p>
          ${contributorCredit()}
        </div>
      </section>
      <section id="holiday-answer" class="container answer-box" aria-label="The short answer">
        <ul>
          ${cheapest ? `<li><strong>Lowest ticket:</strong> ${e(cheapest.name)}, ≈ $${familyCost(cheapest)} for 4</li>` : ""}
          ${parking ? `<li><strong>Free parking included:</strong> ${e(parking.name)} 4-Pack, ≈ $${familyCost(parking)}</li>` : ""}
          ${earliest ? `<li><strong>First to open:</strong> ${e(earliest.name)}, ${e(short(earliest.start_on))}</li>` : ""}
          <li><strong>Not counted:</strong> tax, food, travel, and parking unless stated</li>
        </ul>
      </section>
      <section class="container page-section" aria-labelledby="holiday-table-title">
        <h2 id="holiday-table-title">Compare the ${parks.length} parks, lowest price first</h2>
        <div class="holiday-table-wrap">
          <table class="holiday-table">
            <caption>One day, ${e(data.party)}. Estimate from dated published prices, not a quote.</caption>
            <thead><tr><th scope="col">Park</th><th scope="col">Season</th><th scope="col">Tickets for 4</th></tr></thead>
            <tbody>
${rows}
            </tbody>
          </table>
        </div>
        <p class="holiday-note">Most parks open on select dates inside these seasons. Check the park calendar for your day.</p>
      </section>
      <section class="container page-section" aria-labelledby="holiday-pick-title">
        <h2 id="holiday-pick-title">Which one fits your kids</h2>
        <ul class="holiday-picks">${small}</ul>
        <p><strong>Best nights with small kids:</strong> we have no crowd data, so we won't name quiet nights. If a late night is hard, look for parks with daytime Santa and shows, and skip fireworks nights.</p>
      </section>
      <section class="container page-section" aria-labelledby="holiday-cards-title">
        <h2 id="holiday-cards-title">Park by park</h2>
        <div class="holiday-cards">
${parks.map((p) => card(p, today)).join("\n")}
        </div>
      </section>
${passes ? `      <section class="container page-section" aria-labelledby="holiday-pass-title">
        <h2 id="holiday-pass-title">Going more than once?</h2>
        <ul>${passes}</ul>
      </section>\n` : ""}      <section class="container trust-panel" aria-label="How we check">
        <p><strong>How we check:</strong> we read each park's own page on the date shown. We have not visited these events. Family figures are the published price times 4, and no park here shows a lower child price on the pages we read.</p>
        <p>Not listed yet: ${e(data.not_listed)}. We could not confirm this season's dates and prices on their official pages.</p>
      </section>
    </main>`;
  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Theme Park Christmas Events With Kids: Cost for a Family of 4 | Family Tripwise</title>
    <meta name="description" content="Compare Christmas events at ${parks.length} US theme parks: dates, what kids can do, what costs extra and one-day ticket cost for a family of 4, from each park's own pages.">
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

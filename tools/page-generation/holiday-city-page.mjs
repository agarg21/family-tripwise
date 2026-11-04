// /holidays/<city>-christmas-with-kids.html (QUEUE G16 step 4, OWNER D32).
// One validated data file (holiday-cities.json) feeds every city. An event leaves after its end_on
// (America/New_York), re-rendered daily by tools/this-week.mjs. No year in the URL: refreshed each season.
import { readFileSync } from "node:fs";
import { contributorCredit } from "./contributors.mjs";
import { siteHeader, siteFooter } from "./site-chrome.mjs";
import { easternDate } from "./sitemap.mjs";
import { withLinkPreview } from "./link-previews.mjs";
import { placeSitePageHero } from "./hero-photos.mjs";

export const holidayCitiesData = () => JSON.parse(readFileSync(new URL("./holiday-cities.json", import.meta.url), "utf8"));
export const holidayCityPath = (slug) => `holidays/${slug}-christmas-with-kids.html`;
export const holidayCityUrls = () => Object.keys(holidayCitiesData().cities).map((s) => `https://familytripwise.com/${holidayCityPath(s)}`);
const imageLock = JSON.parse(readFileSync(new URL("../images/commons-images.lock.json", import.meta.url), "utf8"));
const MAX_PRICE_AGE_DAYS = 30;
const ISO = /^\d{4}-\d{2}-\d{2}$/;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const e = (v) => String(v ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
const short = (iso) => { const [, m, d] = iso.split("-").map(Number); return `${MONTHS[m - 1]} ${d}`; };
const ageDays = (from, to) => (Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86400000;
export const priceIsFresh = (ev, today = easternDate()) => ageDays(ev.observed_on, today) <= MAX_PRICE_AGE_DAYS;
const priced = (ev) => ev.cost_low > 0;
// A field may be a string or dated parts: [{ text, until }, "always"]. Parts past their date drop, and a part-list that ends up empty renders nothing.
const dated = (v, today) => (Array.isArray(v) ? v.filter((p) => typeof p === "string" || today <= p.until).map((p) => (typeof p === "string" ? p : p.text)).join(" ") : v ?? "");

export function validateHolidayCity(city) {
  const errors = [];
  for (const ev of city.events) {
    for (const key of ["id", "name", "place", "dates", "cost_note", "extra", "watch"]) if (!ev[key]) errors.push(`${ev.id}: missing ${key}`);
    for (const key of ["start_on", "end_on", "observed_on"]) if (!ISO.test(ev[key] ?? "")) errors.push(`${ev.id}: bad ${key}`);
    if (!ev.kids?.length) errors.push(`${ev.id}: kid lines`);
    if (priced(ev) && !(ev.cost_high >= ev.cost_low)) errors.push(`${ev.id}: cost range`);
    if (!ev.sources?.length) errors.push(`${ev.id}: sources`);
    for (const src of ev.sources ?? []) if (!/^https:\/\//.test(src.url ?? "") || !src.label) errors.push(`${ev.id}: source`);
    // Dollar text must be able to hide when the read goes stale.
    for (const key of ["cost_note", "watch"]) if (/\$\d/.test(ev[key] ?? "")) errors.push(`${ev.id}: ${key} holds a price`);
    if (/\$\d/.test(ev.extra) && !ev.extra_stale) errors.push(`${ev.id}: extra needs extra_stale`);
    for (const k of ev.kids ?? []) if (/\$\d/.test(typeof k === "string" ? k : k.stale ?? "") ) errors.push(`${ev.id}: kid line holds a price without a stale form`);
  }
  for (const p of city.picks) for (const id of p.ids) if (!city.events.some((ev) => ev.id === id)) errors.push(`pick ${p.label}: unknown ${id}`);
  return errors;
}

const fresh = priceIsFresh;
const paidCard = (ev, today) => priced(ev) && fresh(ev, today);
export const openEvents = (city, today = easternDate()) => {
  const rank = (ev) => (ev.free ? 0 : ev.free_with ? 1 : ev.rank_after_free ? 2.5 : ev.cost_label ? 2 : paidCard(ev, today) ? 3 : 4);
  return city.events.filter((ev) => today <= ev.end_on).sort((a, b) => rank(a) - rank(b) || (rank(a) === 3 ? a.cost_low - b.cost_low : 0) || a.start_on.localeCompare(b.start_on));
};

const whenText = (ev) => ev.table_when ? e(ev.table_when) : `${ev.start_on === ev.end_on ? nb(short(ev.start_on)) : `${nb(short(ev.start_on))} to ${nb(short(ev.end_on))}`}${ev.table_note ? `, ${e(ev.table_note)}` : ""}`;
const nb = (v) => e(v).replaceAll(" ", "&nbsp;");
const range = (ev) => (ev.cost_low === ev.cost_high ? `${ev.cost_from ? "From " : ""}≈ $${ev.cost_low}` : `≈ $${ev.cost_low} to $${ev.cost_high}`);
function costCell(ev, today) {
  if (ev.free) return "Free";
  if (ev.free_with) return `${e(ev.free_with)}${paidCard(ev, today) ? `<small>rentals ${range(ev)}</small>` : ""}`;
  if (ev.cost_label) return e(ev.cost_label);
  return paidCard(ev, today) ? `<span class="holiday-nowrap">${range(ev)}</span>${ev.table_cost_note ? `<small>${e(dated(ev.table_cost_note, today))}</small>` : ""}` : "Check live";
}
function figure(ev, today) {
  const checked = ev.cost_read ?? `price checked ${short(ev.observed_on)}`;
  if (ev.free) return `<p class="holiday-figure">Free<small>checked ${short(ev.observed_on)}</small></p>`;
  if (ev.free_with) return `<p class="holiday-figure holiday-figure-text">${e(ev.free_with)}<small>${paidCard(ev, today) ? `4 rentals ${range(ev)}, estimate, ${checked}` : "check live for rental prices"}</small></p>`;
  if (ev.cost_label) return `<p class="holiday-figure holiday-figure-text">${e(ev.cost_label)}<small>checked ${short(ev.observed_on)}</small></p>`;
  if (paidCard(ev, today)) return `<p class="holiday-figure">${range(ev)}<small>tickets for 4, estimate${ev.cost_basis ? `; ${e(ev.cost_basis)}` : " from published prices"}, ${checked}</small></p>`;
  return `<p class="holiday-figure holiday-figure-text">Check live<small>${priced(ev) ? `our last price check, ${short(ev.observed_on)}, is too old to show` : `we couldn't read a price on ${short(ev.observed_on)}`}</small></p>`;
}
const kidLine = (k, today) => {
  if (typeof k === "string") return k;
  if (k.until && today > k.until) return null;
  return k.stale && !fresh(k, today) ? k.stale : k.text;
};
function card(ev, today) {
  const isFresh = fresh(ev, today);
  const kids = ev.kids.map((k) => kidLine(typeof k === "string" ? k : { ...k, observed_on: ev.observed_on }, today)).filter(Boolean);
  const sources = ev.sources.map((s) => `<a href="${e(s.url)}">${e(s.label)}</a>`).join(" · ");
  return `          <article id="${e(ev.id)}" class="holiday-card">
            <h3>${e(ev.name)}</h3>
            <p class="holiday-place">${e(ev.place)}</p>
            ${figure(ev, today)}
            <p class="holiday-dates"><strong>When:</strong> ${e(ev.dates)}</p>
            <ul>${kids.map((k) => `<li>${e(k)}</li>`).join("")}</ul>
            <p><strong>${e(ev.extra_label ?? "Costs extra")}:</strong> ${e(isFresh ? ev.extra : ev.extra_stale ?? ev.extra)}</p>
            <details class="ds-card-more"><summary>Ticket details, tips and sources</summary>
            <p><strong>Ticket:</strong> ${isFresh && ev.cost_priced ? `${e(ev.cost_priced)} ` : ""}${e(ev.cost_note)}</p>
            <p><strong>Good to know:</strong> ${e(dated(ev.watch, today))}${isFresh && ev.watch_priced ? ` ${e(ev.watch_priced)}` : ""}</p>
            <p class="holiday-source">${sources} (read ${short(ev.observed_on)} unless noted)</p>
            </details>
          </article>`;
}

export function holidayCityPage(slug, data = holidayCitiesData(), today = easternDate()) {
  const city = data.cities[slug];
  const errors = validateHolidayCity(city);
  if (errors.length) throw new Error(`holiday-cities.json ${slug}: ${errors.join("; ")}`);
  const path = holidayCityPath(slug);
  const url = `https://familytripwise.com/${path}`;
  const events = openEvents(city, today);
  const byId = (id) => events.find((ev) => ev.id === id);
  const link = (ev) => `<a href="#${e(ev.id)}">${e(ev.name)}</a>`;
  const free = events.filter((ev) => ev.free);
  const freeWith = events.filter((ev) => ev.free_with);
  const freeEntry = events.filter((ev) => ev.cost_label?.startsWith("Free"));
  const paid = events.filter((ev) => !ev.free && !ev.free_with && paidCard(ev, today));
  const low = paid.length ? Math.min(...paid.map((ev) => ev.cost_low)) : null;
  const high = paid.length ? Math.max(...paid.map((ev) => ev.cost_high)) : null;
  const unpriced = events.filter((ev) => !ev.free && !ev.free_with && !ev.cost_label && !paidCard(ev, today));
  const count = events.length === 1 ? "1 Outing" : `${events.length}&nbsp;Outings`;
  const place = nb(city.place);
  const anyCost = paid.length > 0;
  const sensoryOpen = events.some((ev) => ev.sensory_until && today <= ev.sensory_until);
  const november = events.filter((ev) => ["10", "11"].includes(ev.end_on.slice(5, 7)));
  const h1 = events.length ? `Christmas in ${place} With Kids: ${count}${anyCost ? " and What They Cost a Family of 4" : ""}` : `Christmas in ${place} With Kids`;
  const lead = !events.length ? "This season's events have ended. We update this page when organizers publish their next dates."
    : (paid.length ? "Dates, what's free and ticket costs for 2 adults and 2 kids." : "Dates and what's free. Check each organizer's page for current ticket prices.");
  const freeParts = [...free.map((ev) => `${link(ev)}, ${e(ev.answer_when ?? ev.table_when ?? "") || nb(short(ev.start_on))}`), ...freeEntry.map((ev) => `${link(ev)} entry`)];
  const freeShown = city.answer_free_limit ? freeParts.slice(0, city.answer_free_limit) : freeParts;
  const freeSummary = `${freeShown.join("; ")}${freeParts.length > freeShown.length ? `; ${freeParts.length - freeShown.length} more below` : ""}`;
  const news = (city.news ?? []).filter((n) => today <= n.until);
  const picks = city.picks.map((p) => {
    const list = p.ids.map(byId).filter((ev) => ev && (!p.sensory || today <= ev.sensory_until));
    return list.length === p.ids.length || ((p.sensory || p.partial) && list.length) ? `<li><strong>${e(p.label)}:</strong> ${list.map(link).join(", ")}. ${e(dated(p.why, today))}</li>` : "";
  }).join("");
  const also = city.also.items.filter((i) => today <= i.until);
  const rows = events.map((ev) => `              <tr><th scope="row"><a href="#${e(ev.id)}">${e(ev.name)}</a><small>${e(ev.place)}</small><small class="holiday-when-inline">${whenText(ev)}</small></th><td class="holiday-when">${whenText(ev)}</td><td class="holiday-cost">${costCell(ev, today)}</td></tr>`).join("\n");
  const plural = events.length === 1 ? "outing" : `${events.length} outings`;
  const img = imageLock[city.hero_slug];
  const body = `    <main id="main" class="holiday-page">
      <section class="page-hero">
        <div class="container">
          <p class="eyebrow">${e(city.place)} · Christmas with kids</p>
          <h1>${h1}</h1>
          <p>${lead}</p>
          ${contributorCredit()}
        </div>
      </section>
${events.length ? `      <section id="holiday-answer" class="container answer-box" aria-label="The short answer">
        ${paid.length ? `<p class="holiday-answer-figure"><span>Paid outings: tickets for 4, per outing</span><strong>≈ $${low}${high > low ? ` to $${high}` : ""}</strong><small>${e(city.answer_note)}</small></p>` : ""}
        <ul>
          ${(city.highlights ?? []).filter((h) => byId(h.id) && today <= h.until).map((h) => `<li><strong>${e(h.label)}:</strong> ${link(byId(h.id))}${h.note ? `, ${e(h.note)}` : ""}</li>`).join("")}
          ${free.length || freeEntry.length ? `<li><strong>Free:</strong> ${freeSummary}</li>` : ""}
          ${freeWith.map((ev) => `<li><strong>${e(ev.free_with)}:</strong> ${link(ev)}</li>`).join("")}
          ${!paid.length && unpriced.length ? `<li><strong>Check live for prices:</strong> ${unpriced.map(link).join(", ")}</li>` : ""}
        </ul>
      </section>
${news.length ? `      <section class="container holiday-news" aria-label="New this season">
        <h2 class="holiday-news-title">New this season</h2>
        <ul>${news.map((n) => `<li><a href="${e(n.href)}">${e(n.name)}</a>: ${e(n.text)}</li>`).join("")}</ul>
      </section>\n` : ""}      <section class="container page-section" aria-labelledby="holiday-table-title">
        <h2 id="holiday-table-title">Compare ${events.length === 1 ? "the outing" : `the ${plural}`}, free first</h2>
        <div class="holiday-table-wrap">
          <table class="holiday-table holiday-table-city">
            <caption><span>Family of 4: ${e(city.party)}.${anyCost ? ` ${e(city.table_note)}` : ""} Travel and food not counted.</span></caption>
            <thead><tr><th scope="col">Outing</th><th scope="col">Dates</th><th scope="col">Tickets for 4</th></tr></thead>
            <tbody>
${rows}
            </tbody>
          </table>
        </div>
        ${november.length ? `<p class="holiday-note"><strong>Coming in December?</strong> ${november.length > 1 ? `${november.slice(0, -1).map((ev) => e(ev.name)).join(", ")} and ${e(november.at(-1).name)}` : e(november[0].name)} ${november.length === 1 ? "is" : "are"} over by then.</p>` : ""}
      </section>
${picks ? `      <section class="container page-section" aria-labelledby="holiday-pick-title">
        <h2 id="holiday-pick-title">Which one fits your kids</h2>
        <ul class="holiday-picks">${picks}</ul>
        <p class="holiday-note">Our picks from the published details, not from a visit. We have no crowd data of our own, so we don't name quiet nights.</p>
      </section>` : ""}
      <section class="container page-section" aria-labelledby="holiday-cards-title">
        <h2 id="holiday-cards-title">Outing by outing</h2>
        <div class="holiday-cards">
${events.map((ev) => card(ev, today)).join("\n")}
        </div>
      </section>
${also.length ? `      <section class="container page-section" aria-labelledby="holiday-also-title">
        <h2 id="holiday-also-title">More to look up</h2>
        <p>Dates from the <a href="${e(city.also.source_url)}">${e(city.also.source_label)}</a>, ${e(city.also.source_note)}, read ${short(city.also.observed_on)}. It lists no prices for these, and we haven't checked them further.</p>
        <ul class="holiday-picks">${also.map((i) => `<li>${e(i.text)}</li>`).join("")}</ul>
      </section>\n` : ""}` : ""}      <section class="container page-section" aria-labelledby="holiday-more-title">
        <h2 id="holiday-more-title">Planning the rest of the trip</h2>
        <ul class="holiday-picks">
          <li><a href="${e(city.things_href ?? `../things-to-do/${slug}-with-kids.html`)}">${e(city.things_label ?? `Things to do in ${city.place} with kids`)}</a>, all year</li>
          <li><a href="${e(city.stay_href ?? `../where-to-stay/${slug}-with-kids.html`)}">${e(city.stay_label ?? `Where to stay in ${city.place} with kids`)}</a></li>
          <li><a href="./theme-park-christmas-events-with-kids.html">Theme park Christmas events, compared</a></li>
        </ul>
      </section>
      <section class="container trust-panel" aria-label="How we check">
        <p><strong>How we check:</strong> we read organizer or official tourism pages on the date shown, and say so when a fact comes only from a news report. ${e(city.check_note)} We have not been to these events.${anyCost ? " Family figures add the published prices for 2 adults and 2 kids." : ""}</p>
      </section>
    </main>`;
  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${anyCost ? `Christmas in ${e(city.short)} With Kids: Free and Paid Events, Family of 4 Cost` : events.length ? `Christmas in ${e(city.short)} With Kids: Dates and What's Free` : `Christmas in ${e(city.short)} With Kids`} | Family Tripwise</title>
    <meta name="description" content="${events.length ? `Christmas events in ${e(city.place)} with kids: dates, what's free${anyCost ? ", ticket cost for a family of 4" : ""}, ages${sensoryOpen ? " and sensory sessions" : ""}, from pages we read and date.` : `Christmas in ${e(city.place)} with kids. This season has ended; we update this page when organizers publish their next dates.`}">
    <link rel="canonical" href="${url}">
    <link rel="stylesheet" href="../styles.css">
  </head>
  <body>
    ${siteHeader("../", path)}
${body}
    ${siteFooter("../", path)}
  </body>
</html>
`;
  const heroHtml = withLinkPreview(placeSitePageHero(html, path, `<img src="../${e(img.path)}"${city.hero_position ? ` style="object-position:${e(city.hero_position)}"` : ""} alt="${e(city.hero_alt)}" width="${img.width}" height="${img.height}" loading="eager" fetchpriority="high" decoding="async">
          <figcaption>${e(city.hero_place)} Photo: ${e(img.artist.split(" from ")[0])} via <a href="${e(img.source_page)}">Wikimedia Commons</a>, ${img.license_url ? `<a href="${e(img.license_url)}">${e(img.license)}</a>` : e(img.license)}. Resized and cropped.</figcaption>`));
  return city.hero_narrow ? heroHtml.replace('<main id="main" class="holiday-page">', '<main id="main" class="holiday-page holiday-hero-narrow">') : heroHtml;
}

export function writeHolidayCityPages(writeSite, today = easternDate()) {
  const data = holidayCitiesData();
  for (const slug of Object.keys(data.cities)) writeSite(holidayCityPath(slug), holidayCityPage(slug, data, today));
}

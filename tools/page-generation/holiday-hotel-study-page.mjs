// /holidays/holiday-hotel-prices-family-of-4.html (QUEUE R1 step 6, OWNER D44, review backlog #10).
// The same hotels priced for the same family on a normal January weekend and on the Christmas and New Year weekends,
// from the G18 receipts (holiday-hotel-study.mjs). Re-rendered daily by tools/this-week.mjs: a weekend leaves 7 days
// before its first night, and the page falls back to a plain "re-pricing" state when no holiday weekend is left.
import { readFileSync } from "node:fs";
import { contributorCredit } from "./contributors.mjs";
import { siteHeader, siteFooter } from "./site-chrome.mjs";
import { withLinkPreview } from "./link-previews.mjs";
import { placeSitePageHero } from "./hero-photos.mjs";
import { holidayHotelStudy, studyToday, STUDY_SETS } from "./holiday-hotel-study.mjs";

export const holidayHotelStudyPath = "holidays/holiday-hotel-prices-family-of-4.html";
export const holidayHotelStudyUrl = `https://familytripwise.com/${holidayHotelStudyPath}`;
const imageLock = JSON.parse(readFileSync(new URL("../images/commons-images.lock.json", import.meta.url), "utf8"));
const HERO = { slug: "san-diego-hotel-del-coronado-2019", alt: "The Hotel del Coronado's white walls and red roofs seen from the beach in San Diego", place: "Hotel del Coronado, San Diego, one of the hotels compared here, 2019 (an older photo)", placeOnly: "Hotel del Coronado, San Diego, 2019 (an older photo)" };
// A city's typical change is named in the short answer only when at least this many hotels were priced both weekends.
export const MIN_HOTELS = 3;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const e = (v) => String(v ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
const usd = (v) => `$${Math.round(v).toLocaleString("en-US")}`;
const pct = (v) => (v > 0 ? `+${v}%` : v < 0 ? `−${Math.abs(v)}%` : "0%");
const short = (iso) => { const [, m, d] = iso.split("-").map(Number); return `${MONTHS[m - 1]} ${d}`; };
const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;

const cell = (cmp) => {
  if (!cmp) return `<td class="holiday-cost">—<small>no hotel compared</small></td>`;
  const verdict = cmp.up === cmp.hotels ? `all ${cmp.hotels} cost more` : cmp.down === cmp.hotels ? `all ${cmp.hotels} cost less` : `${cmp.up} of ${cmp.hotels} cost more`;
  const few = cmp.hotels < MIN_HOTELS ? `${plural(cmp.hotels, "hotel")} only` : verdict;
  return `<td class="holiday-cost">${pct(cmp.medianChange)}<small>${e(few)}</small></td>`;
};

const hotelLine = (title, city) => {
  const parts = ["christmas", "newYear"].map((set) => {
    const pair = city[set]?.pairs.find((p) => p.title === title);
    return pair ? `${set === "christmas" ? "Christmas" : "New Year"} ${usd(pair.holiday)} (${pct(pair.change)})` : null;
  }).filter(Boolean);
  const normal = (city.christmas?.pairs ?? []).concat(city.newYear?.pairs ?? []).find((p) => p.title === title).normal;
  return `<li><strong>${e(title)}</strong><br>${STUDY_SETS.weekend.short} ${usd(normal)} · ${parts.join(" · ")}</li>`;
};

const cityCard = (city) => {
  const titles = [...new Set([...(city.christmas?.pairs ?? []), ...(city.newYear?.pairs ?? [])].map((p) => p.title))];
  if (!titles.length) return "";
  const set = city.christmas && city.christmas.hotels >= MIN_HOTELS ? "christmas" : city.newYear && city.newYear.hotels >= MIN_HOTELS ? "newYear" : null;
  const cmp = set && city[set];
  const figure = cmp
    ? `<p class="holiday-figure">${pct(cmp.medianChange)}<small>${set === "christmas" ? "Christmas" : "New Year's"} weekend, typical of the ${cmp.hotels} hotels compared. ${cmp.example ? `Example: ${e(cmp.example.title)}, ${usd(cmp.example.normal)} → ${usd(cmp.example.holiday)} for 2 nights.` : `Hotels ranged from ${pct(cmp.low)} to ${pct(cmp.high)}.`}</small></p>`
    : `<p class="holiday-figure holiday-figure-text">Too few to call<small>Fewer than ${MIN_HOTELS} hotels priced on both weekends.</small></p>`;
  const skipped = city.skipped.map((k) => `<p class="holiday-source">Left out of ${k.set === "weekend" ? "both comparisons" : k.set === "christmas" ? "the Christmas comparison" : "the New Year comparison"}: ${e(k.name)}, because ${e(k.why)}.</p>`).join("");
  return `          <article class="holiday-card" id="${e(city.id)}">
            <h3>${e(city.name)}</h3>
            ${figure}
            <details class="ds-card-more"><summary>Hotel by hotel, 2 nights for 4</summary>
              <ul>${titles.map((t) => hotelLine(t, city)).join("")}</ul>
              <p class="holiday-source">${plural(city.hotelsSampled, "hotel")} searched; the rest had no price for both nights of a weekend. <a href="../${e(city.page)}">${e(city.name)} family hotels</a></p>${skipped}
            </details>
          </article>`;
};

export function holidayHotelStudyPage(today = studyToday()) {
  const cities = holidayHotelStudy(today);
  const seen = [...new Set(cities.flatMap((c) => c.seen))].sort();
  const seenText = seen.map(short).join(" and ");
  const hasXmas = cities.some((c) => c.christmas);
  const hasNy = cities.some((c) => c.newYear);
  const live = hasXmas || hasNy;
  const solid = (set) => cities.filter((c) => c[set] && c[set].hotels >= MIN_HOTELS).sort((a, b) => b[set].medianChange - a[set].medianChange);
  const lead = hasXmas ? "christmas" : "newYear";
  const ranked = live ? solid(lead) : [];
  const leadName = lead === "christmas" ? "Christmas weekend" : "New Year's weekend";
  const top = ranked[0];
  // Buckets for the short answer: within ±9% reads as "about the same".
  const pricier = ranked.filter((c) => c[lead].medianChange >= 10);
  const cheaper = ranked.filter((c) => c[lead].medianChange <= -10);
  const flat = ranked.filter((c) => Math.abs(c[lead].medianChange) < 10);
  const list = (group) => group.map((c) => `${e(c.name)} ${pct(c[lead].medianChange)}`).join(", ");
  const pairsTotal = cities.reduce((n, c) => n + (c[lead]?.hotels ?? 0), 0);
  const pairs = cities.flatMap((c) => c[lead]?.pairs ?? []);
  const upCount = pairs.filter((p) => p.change > 0).length;
  const title = live ? (hasXmas ? "Christmas Hotel Prices for a Family of 4: 10 Places Compared" : "New Year Hotel Prices for a Family of 4: 10 Places Compared") : "Holiday Hotel Prices for a Family of 4, by City";
  const h1 = live ? `Do hotels cost more on ${leadName}? Same hotels, family of 4, ${cities.length} places` : "Holiday hotel prices for a family of 4, by city";
  const rows = cities.map((c) => `              <tr><th scope="row">${c.christmas || c.newYear ? `<a href="#${e(c.id)}">${e(c.name)}</a>` : e(c.name)}</th>${hasXmas ? cell(c.christmas) : ""}${hasNy ? cell(c.newYear) : ""}</tr>`).join("\n");
  const answer = live && top ? `      <section id="holiday-answer" class="container answer-box" aria-label="The short answer">
        <p class="holiday-answer-figure"><span>Biggest ${e(leadName)} jump (places with ${MIN_HOTELS}+ hotels)</span><strong>${e(top.name)}: ${pct(top[lead].medianChange)}</strong><small>Typical of ${top[lead].hotels} hotels. ${top[lead].example ? `Example: ${e(top[lead].example.title)}, ${usd(top[lead].example.normal)} (${STUDY_SETS.weekend.short}) → ${usd(top[lead].example.holiday)} (${e(STUDY_SETS[lead].short)}) for 2 nights.` : `Hotels ranged from ${pct(top[lead].low)} to ${pct(top[lead].high)}.`} An estimate, not a quote; taxes may be extra.</small></p>
        <ul>
          ${pricier.length ? `<li><strong>Pricier:</strong> ${list(pricier)}</li>` : ""}
          ${flat.length ? `<li><strong>About the same (within 10%):</strong> ${list(flat)}</li>` : ""}
          ${cheaper.length ? `<li><strong>Cheaper:</strong> ${list(cheaper)}</li>` : ""}
          <li><strong>Overall:</strong> ${upCount} of ${pairsTotal} hotels cost more on ${e(leadName)} than on a normal January weekend</li>
          <li><strong>Prices seen:</strong> ${e(seenText)}, 2026. They change fast; check live.</li>
        </ul>
      </section>` : "";
  const body = `    <main id="main" class="holiday-page">
      <section class="page-hero">
        <div class="container">
          <p class="eyebrow">Family hotel prices · ${cities.length} US and Mexico destinations</p>
          <h1>${e(h1)}</h1>
          <p>${live ? `We priced the same hotels for 2 adults and kids 5 and 8 on a normal weekend (${e(STUDY_SETS.weekend.short)}) and on the holiday weekends. Totals are for 2 nights.` : "Our holiday weekend prices are too close to their dates, or past, so we no longer show them."}</p>
          ${contributorCredit()}
        </div>
      </section>
${answer}
${live ? `      <section class="container page-section" aria-labelledby="study-table-title">
        <h2 id="study-table-title">Holiday weekend vs a January weekend</h2>
        <p class="holiday-note">Typical change: the middle hotel's change in its 2-night price, comparing only hotels priced for both nights of both weekends.</p>
        <div class="holiday-table-wrap">
          <table class="holiday-table holiday-study-table">
            <caption>Family of 4, same hotels, 2 nights. Google Hotels prices seen ${e(seenText)}, 2026.</caption>
            <thead><tr><th scope="col">Place</th>${hasXmas ? `<th scope="col">Christmas, ${e(STUDY_SETS.christmas.short)}</th>` : ""}${hasNy ? `<th scope="col">New Year, ${e(STUDY_SETS.newYear.short)}</th>` : ""}</tr></thead>
            <tbody>
${rows}
            </tbody>
          </table>
        </div>
        <ul><li>A holiday weekend was not always pricier in our sample.</li><li>"Only" means too few hotels priced to call a trend.</li></ul>
      </section>
      <section class="container page-section" aria-labelledby="study-cities-title">
        <h2 id="study-cities-title">City by city</h2>
        <div class="holiday-cards">
${cities.map(cityCard).filter(Boolean).join("\n")}
        </div>
      </section>` : ""}
      <section class="container page-section" aria-labelledby="study-next-title">
        <h2 id="study-next-title">Planning a holiday trip?</h2>
        <p>Holiday outings and their family-of-4 costs: <a href="../holidays/theme-park-christmas-events-with-kids.html">theme park Christmas events</a> · <a href="../holidays/new-york-city-christmas-with-kids.html">Christmas in New York City</a> · <a href="../holidays/chicago-christmas-with-kids.html">Christmas in Chicago</a> · <a href="../deals/index.html">family travel deals</a>.</p>
      </section>
      <section class="container trust-panel" aria-label="How we check">
        <p><strong>How we check:</strong> each night is a separate 1-night Google Hotels search for 2 adults and kids 5 and 8, collected through DataForSEO on ${e(seenText)}, 2026, in US dollars. A 2-night figure adds the Friday and Saturday prices; it is an estimate, not a quote. Google does not show the room type or which taxes and fees are included. We compare a hotel only when both nights of both weekends had a price; "no price" never means sold out. We have not stayed at these hotels. Each weekend leaves this page 7 days before it starts. Receipts: docs/research/dataforseo-g18-*.json in github.com/agarg21/family-tripwise.</p>
      </section>
    </main>`;
  const description = live ? `The same hotels priced for a family of 4 on a January weekend and on ${hasXmas ? "Christmas and New Year weekends" : "New Year's weekend"} in ${cities.length} places: which cost more, which cost less. Dated Google Hotels prices.` : "Holiday weekend hotel prices for a family of 4, by city, from dated Google Hotels prices.";
  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${e(title)}</title>
    <meta name="description" content="${e(description)}">
    <link rel="canonical" href="${holidayHotelStudyUrl}">
    <link rel="stylesheet" href="../styles.css">
  </head>
  <body>
    ${siteHeader("../", holidayHotelStudyPath)}
${body}
    ${siteFooter("../", holidayHotelStudyPath)}
  </body>
</html>
`;
  const img = imageLock[HERO.slug];
  return withLinkPreview(placeSitePageHero(html, holidayHotelStudyPath, `<img src="../${e(img.path)}" alt="${e(HERO.alt)}" width="${img.width}" height="${img.height}" loading="eager" fetchpriority="high" decoding="async">
          <figcaption>${e(live ? HERO.place : HERO.placeOnly)}. Photo: ${e(img.artist)} via <a href="${e(img.source_page)}">Wikimedia Commons</a>, <a href="${e(img.license_url)}">${e(img.license)}</a>. Resized.</figcaption>`), holidayHotelStudyPath);
}

export function writeHolidayHotelStudyPage(writeSite, today = studyToday()) {
  writeSite(holidayHotelStudyPath, holidayHotelStudyPage(today));
}

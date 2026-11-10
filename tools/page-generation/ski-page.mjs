// /ski/skiing-near-<city>-with-kids.html (holiday calendar row 12, owner 2026-11-09; spec docs/plan/ski-near-cities.md).
// One validated data file (ski-near-cities.json). Every dollar figure hides once its read is older than
// 30 days (America/New_York), so a stale price never shows as current; tools/this-week.mjs re-renders daily.
import { readFileSync } from "node:fs";
import { contributorCredit } from "./contributors.mjs";
import { siteHeader, siteEnd } from "./site-chrome.mjs";
import { easternDate } from "./sitemap.mjs";
import { withLinkPreview } from "./link-previews.mjs";
import { placeSitePageHero } from "./hero-photos.mjs";

export const skiData = () => JSON.parse(readFileSync(new URL("./ski-near-cities.json", import.meta.url), "utf8"));
export const skiPath = (slug) => `ski/skiing-near-${slug}-with-kids.html`;
export const skiUrls = () => Object.keys(skiData().cities).map((s) => `https://familytripwise.com/${skiPath(s)}`);
const imageLock = JSON.parse(readFileSync(new URL("../images/commons-images.lock.json", import.meta.url), "utf8"));
const MAX_PRICE_AGE_DAYS = 30;
const ISO = /^\d{4}-\d{2}-\d{2}$/;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const e = (v) => String(v ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
const short = (iso) => { const [, m, d] = iso.split("-").map(Number); return `${MONTHS[m - 1]} ${d}`; };
const ageDays = (from, to) => (Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86400000;
export const pricesFresh = (city, today = easternDate()) => ageDays(city.observed_on, today) <= MAX_PRICE_AGE_DAYS;
const hasPrice = (s) => /\$\d/.test(String(s ?? ""));

export function validateSkiCity(city) {
  const errors = [];
  if (!ISO.test(city.observed_on ?? "")) errors.push("bad observed_on");
  for (const key of ["place", "short", "party", "hero_slug", "hero_alt", "hero_place"]) if (!city[key]) errors.push(`missing ${key}`);
  if (city.hero_slug && !imageLock[city.hero_slug]) errors.push(`hero ${city.hero_slug} not self-hosted`);
  const ids = new Set();
  for (const h of city.hills) {
    if (ids.has(h.id)) errors.push(`${h.id}: duplicate`);
    ids.add(h.id);
    for (const key of ["id", "name", "where", "getting_there", "price_note", "table_price"]) if (!h[key]) errors.push(`${h.id}: missing ${key}`);
    if (!h.kids?.length) errors.push(`${h.id}: kid lines`);
    if (!h.sources?.length) errors.push(`${h.id}: sources`);
    for (const s of h.sources ?? []) if (!/^https:\/\//.test(s.url ?? "") || !s.label) errors.push(`${h.id}: source`);
    // Dollar text may live only in price_rows, table_price and price_note, which all hide when stale.
    for (const key of ["name", "where", "getting_there"]) if (hasPrice(h[key])) errors.push(`${h.id}: ${key} holds a price`);
    for (const k of h.kids) if (hasPrice(k)) errors.push(`${h.id}: kid line holds a price`);
    for (const row of h.price_rows ?? []) if (row.length !== 2 || !hasPrice(row[1])) errors.push(`${h.id}: price row`);
  }
  for (const p of city.picks) for (const id of p.ids) if (!ids.has(id)) errors.push(`pick ${p.label}: unknown ${id}`);
  for (const b of city.bullets) if (b.hill && !ids.has(b.hill)) errors.push(`bullet ${b.label}: unknown ${b.hill}`);
  if (city.answer && !ids.has(city.answer.hill)) errors.push("answer hill");
  for (const ps of city.passes ?? []) {
    for (const key of ["name", "who", "gives", "how", "limits"]) if (!ps[key]) errors.push(`${ps.name}: missing ${key}`);
    for (const key of ["name", "who", "gives", "how", "limits"]) if (hasPrice(ps[key])) errors.push(`${ps.name}: ${key} holds a price`);
    if (!/^https:\/\//.test(ps.source?.url ?? "")) errors.push(`${ps.name}: source`);
  }
  return errors;
}

function hillCard(h, fresh, observed) {
  const sources = h.sources.map((s) => `<a href="${e(s.url)}">${e(s.label)}</a>`).join(" · ");
  const rows = fresh && h.price_rows.length
    ? `<p><strong>Prices on its page, read ${short(observed)}:</strong></p><ul>${h.price_rows.map(([k, v]) => `<li>${e(k)}: <strong>${e(v)}</strong></li>`).join("")}</ul>`
    : "";
  const note = fresh ? h.price_note : hasPrice(h.price_note) ? "Our price check is too old to show; check live." : h.price_note;
  return `          <article id="${e(h.id)}" class="holiday-card">
            <h3>${e(h.name)}</h3>
            <p class="holiday-place">${e(h.where)}</p>
            <ul>${h.kids.map((k) => `<li>${e(k)}</li>`).join("")}</ul>
            ${rows}
            <p><strong>Prices:</strong> ${e(note)}</p>
            <details class="ds-card-more"><summary>Getting there and sources</summary>
            <p><strong>Getting there:</strong> ${e(h.getting_there)}</p>
            <p class="holiday-source">${sources} (read ${short(observed)})</p>
            </details>
          </article>`;
}

export function skiPage(slug, data = skiData(), today = easternDate()) {
  const city = data.cities[slug];
  const errors = validateSkiCity(city);
  if (errors.length) throw new Error(`ski-near-cities.json ${slug}: ${errors.join("; ")}`);
  const path = skiPath(slug);
  const url = `https://familytripwise.com/${path}`;
  const fresh = pricesFresh(city, today);
  const obs = city.observed_on;
  const byId = (id) => city.hills.find((h) => h.id === id);
  const link = (h) => `<a href="#${e(h.id)}">${e(h.name)}</a>`;
  const n = city.hills.length;
  const place = e(city.place);
  const answer = city.answer && fresh
    ? `<p class="holiday-answer-figure"><span>${e(city.answer.label)}</span><strong>${e(city.answer.figure)}</strong><small>${e(city.answer.basis)}</small></p>`
    : "";
  const bullets = city.bullets
    .filter((b) => fresh || !hasPrice(b.text))
    .map((b) => `<li><strong>${e(b.label)}:</strong> ${b.hill ? `${link(byId(b.hill))}, ` : ""}${e(b.text)}${b.anchor ? ` (<a href="#${e(b.anchor)}">details</a>)` : ""}</li>`).join("");
  const picks = city.picks.map((p) => `<li><strong>${e(p.label)}:</strong> ${p.ids.map((id) => link(byId(id))).join(" or ")}.${fresh || !hasPrice(p.why) ? ` ${e(p.why)}` : ""}</li>`).join("");
  const rows = city.hills.map((h) => `              <tr><th scope="row"><a href="#${e(h.id)}">${e(h.name)}</a><small>${e(h.where)}</small><small class="holiday-when-inline">${e(h.kids[0])}</small></th><td class="holiday-when">${e(h.kids[0])}</td><td class="holiday-cost">${e(fresh ? h.table_price : hasPrice(h.table_price) ? "Check live" : h.table_price)}</td></tr>`).join("\n");
  const passes = (city.passes ?? []).map((ps) => `          <article class="holiday-card">
            <h3>${e(ps.name)}</h3>
            <p class="holiday-place">${e(ps.who)}</p>
            <ul><li>${e(ps.gives)}</li>${fresh && ps.fee_priced ? `<li><strong>Cost:</strong> ${e(ps.fee_priced)}</li>` : ""}<li><strong>How:</strong> ${e(ps.how)}</li><li><strong>Where:</strong> ${e(ps.limits)}</li></ul>
            <p class="holiday-source"><a href="${e(ps.source.url)}">${e(ps.source.label)}</a> (read ${short(obs)})</p>
          </article>`).join("\n");
  const img = imageLock[city.hero_slug];
  const body = `    <main id="main" class="holiday-page">
      <section class="page-hero">
        <div class="container">
          <p class="eyebrow">${place} · Skiing with kids</p>
          <h1>Skiing Near ${place} With Kids: ${n}&nbsp;Hills, Kids' Ages and What a Day Costs</h1>
          <p>Closest family hills, kids' lesson ages, free-kid rules and grade-school passes, from each hill's own page.</p>
          ${contributorCredit()}
        </div>
      </section>
      <section id="ski-answer" class="container answer-box" aria-label="The short answer">
        ${answer}
        <ul>${bullets}</ul>
      </section>
      <section class="container page-section" aria-labelledby="ski-table-title">
        <h2 id="ski-table-title">Compare the ${n} hills</h2>
        <div class="holiday-table-wrap">
          <table class="holiday-table holiday-table-city">
            <caption><span>Family of 4: ${e(city.party)}. Prices from each hill's page, read ${short(obs)}; most change by date.</span></caption>
            <thead><tr><th scope="col">Hill</th><th scope="col">For kids</th><th scope="col">Prices we could read</th></tr></thead>
            <tbody>
${rows}
            </tbody>
          </table>
        </div>
      </section>
      <section class="container page-section" aria-labelledby="ski-pick-title">
        <h2 id="ski-pick-title">Which one fits your kids</h2>
        <ul class="holiday-picks">${picks}</ul>
        <p class="holiday-note">Our picks from the hills' published details, not from a visit. We don't report snow conditions; check each hill's snow report before you go.</p>
      </section>
      <section class="container page-section" aria-labelledby="ski-cards-title">
        <h2 id="ski-cards-title">Hill by hill</h2>
        <div class="holiday-cards">
${city.hills.map((h) => hillCard(h, fresh, obs)).join("\n")}
        </div>
      </section>
      <section id="passes" class="container page-section" aria-labelledby="ski-pass-title">
        <h2 id="ski-pass-title">Free or cheap passes for 3rd to 5th graders</h2>
        <div class="holiday-cards">
${passes}
        </div>
      </section>
      <section class="container trust-panel" aria-label="How we check">
        <p><strong>How we check:</strong> we read each hill's own pages and the pass programs' pages on the date shown, and leave out any price without a season label. We have not skied these hills. Snow, weather, crowds and safety are not covered here.</p>
      </section>
    </main>`;
  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Skiing Near ${e(city.short)} With Kids: ${n} Hills, Ages and Costs | Family Tripwise</title>
    <meta name="description" content="Skiing near ${place} with kids: ${n} family hills, kids' lesson ages, kids-ski-free rules, grade-school passes and what a day costs a family of 4, from pages we read and date.">
    <link rel="canonical" href="${url}">
    <link rel="stylesheet" href="../styles.css">
  </head>
  <body>
    ${siteHeader("../", path)}
${body}
    ${siteEnd("../", path)}
  </body>
</html>
`;
  return withLinkPreview(placeSitePageHero(html, path, `<img src="../${e(img.path)}" alt="${e(city.hero_alt)}" width="${img.width}" height="${img.height}" loading="eager" fetchpriority="high" decoding="async">
          <figcaption>${e(city.hero_place)} Photo: ${e(img.artist.split(" from ")[0])} via <a href="${e(img.source_page)}">Wikimedia Commons</a>, ${img.license_url ? `<a href="${e(img.license_url)}">${e(img.license)}</a>` : e(img.license)}. Resized and cropped.</figcaption>`));
}

export function writeSkiPages(writeSite, today = easternDate()) {
  const data = skiData();
  for (const slug of Object.keys(data.cities)) writeSite(skiPath(slug), skiPage(slug, data, today));
}

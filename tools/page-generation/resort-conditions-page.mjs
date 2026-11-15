// /ski/<resort>-conditions.html (QUEUE G19; owner D47/D48; spec docs/plan/resort-conditions-pages.md).
// One data file (resort-conditions.json) for official dated facts; the cam read comes only from the snowcam
// feed (`feed` argument), never from typed text. With no feed, an unpublished resort, or a read older than
// 6 hours the card says "No read" and makes no condition claim. Dollar figures hide 30 days after their read.
import { readFileSync } from "node:fs";
import { contributorCredit } from "./contributors.mjs";
import { siteHeader, siteEnd, addHolidayLink } from "./site-chrome.mjs";
import { placeSitePageHero } from "./hero-photos.mjs";
import { easternDate } from "./sitemap.mjs";
import { withLinkPreview } from "./link-previews.mjs";

export const resortData = () => JSON.parse(readFileSync(new URL("./resort-conditions.json", import.meta.url), "utf8"));
export const resortPath = (slug) => `ski/${slug}-conditions.html`;
export const resortUrls = () => Object.keys(resortData().resorts).map((s) => `https://familytripwise.com/${resortPath(s)}`);

const imageLock = JSON.parse(readFileSync(new URL("../images/commons-images.lock.json", import.meta.url), "utf8"));
const MAX_PRICE_AGE_DAYS = 30;
const STALE_MIN = 90;
const HIDE_MIN = 360;
const MIN_CONF = 0.6;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const STATUSES = { "Looks good": "worth_it", Fair: "neutral", Busy: "only_for", Closed: "skip", "No read": "neutral" };
const FIELD_LABELS = {
  fresh_snow: "Fresh snow", snow_cover: "Snow cover", snowmaking: "Snowmaking", lifts_moving: "Lifts",
  base_busyness: "Base area", visibility: "Visibility", falling_snow: "Falling snow",
};
const ALLOWED_BUSY = new Set(["quiet", "normal", "busy"]);
// D47 "never" list: no safety, ice, grooming, open/closed or trail claims from the feed's own words
// ("Closed" may still arrive as the status, which the page attributes to the resort).
const BANNED = /\b(safe|unsafe|safety|ic[ey]|iced|groom\w*|open\w*|closed?|trails?|runs?|people|person|crowd\w*)\b/i;
const e = (v) => String(v ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
const short = (iso) => { const [, m, d] = iso.split("-").map(Number); return `${MONTHS[m - 1]} ${d}`; };
const ageDays = (from, to) => (Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86400000;
const hasPrice = (s) => /\$\d/.test(String(s ?? ""));
const etTime = (iso) => new Date(iso).toLocaleTimeString("en-US", { timeZone: "America/New_York", hour: "numeric", minute: "2-digit" }).replace(" AM", "am").replace(" PM", "pm");
const etDay = (iso) => new Date(iso).toLocaleDateString("en-CA", { timeZone: "America/New_York" });

export function validateResort(r) {
  const errors = [];
  if (!imageLock[r.hero_slug]) errors.push(`hero ${r.hero_slug} not self-hosted`);
  if (r.opening && !r.opening.when) errors.push("opening.when");
  for (const k of ["name", "town", "observed_on", "drive", "subhead", "cam_page", "status_page", "unpriced", "price_basis", "hero_alt", "hero_place"]) if (!r[k]) errors.push(`missing ${k}`);
  if (!r.cams?.length) errors.push("cams");
  for (const k of ["name", "town", "drive", "subhead", "unpriced"]) if (hasPrice(r[k])) errors.push(`${k} holds a price`);
  for (const p of r.plan ?? []) { if (hasPrice(p.text)) errors.push(`plan ${p.label} holds a price`); if (!r.sources[p.source]) errors.push(`plan ${p.label}: source`); }
  for (const p of r.prices ?? []) if (!hasPrice(p.value) || !r.sources[p.source]) errors.push(`price ${p.label}`);
  for (const line of [...(r.getting_there ?? []), ...(r.backup ?? [])]) if (hasPrice(line)) errors.push("line holds a price");
  for (const s of Object.values(r.sources ?? {})) if (!/^https:\/\//.test(s.url ?? "") || !s.label) errors.push("source");
  return errors;
}

/** The publishable cam read for one resort, or a reason there is none. Applies the D47 limits. */
export function camRead(feedResort, now = new Date()) {
  if (!feedResort) return { state: "none", reason: "Our reads start after they pass a hand check for accuracy." };
  if (feedResort.publish !== true) return { state: "none", reason: "Our reads start after they pass a hand check for accuracy." };
  const at = Date.parse(feedResort.read_at ?? "");
  if (!Number.isFinite(at)) return { state: "none", reason: "No recent read." };
  const mins = (now.getTime() - at) / 60000;
  if (mins > HIDE_MIN || mins < -5) return { state: "none", reason: "No recent read: the last one is more than 6 hours old." };
  const status = STATUSES[feedResort.status] ? feedResort.status : "No read";
  const fields = [];
  for (const [key, f] of Object.entries(feedResort.fields ?? {})) {
    if (!FIELD_LABELS[key] || !f || typeof f.conf !== "number" || f.conf < MIN_CONF) continue;
    const value = String(f.value ?? "").trim();
    if (!value || hasPrice(value) || BANNED.test(value)) continue;
    if (key === "base_busyness" && !ALLOWED_BUSY.has(value.toLowerCase())) continue;
    fields.push(`${FIELD_LABELS[key]}: ${value}`);
  }
  const stakeConf = feedResort.stake_conf ?? feedResort.fields?.stake?.conf;
  if (typeof feedResort.stake_inches === "number" && feedResort.stake_inches >= 0 && !(typeof stakeConf === "number" && stakeConf < MIN_CONF)) fields.unshift(`Snow stake: ${feedResort.stake_inches} in.`);
  return {
    state: mins > STALE_MIN ? "stale" : "fresh", status, line: BANNED.test(String(feedResort.line ?? "")) ? "" : String(feedResort.line ?? ""), fields,
    read_at: feedResort.read_at, cams_used: feedResort.cams_used, cams_total: feedResort.cams_total,
    cams: feedResort.cams ?? [],
  };
}

const nextTubing = (t, today) => t.blocks.find(([, end]) => end >= today);

function readCard(r, read, today) {
  const camLink = `<a class="button primary" href="${e(r.cam_page)}">Watch ${e(r.name)}'s own cams</a>`;
  const opening = r.opening && today <= r.opening.date ? `<li>${e(r.opening.text)} (read ${short(r.observed_on)})</li>` : "";
  if (read.state === "none") {
    const lead = r.opening && today < r.opening.date
      ? `<p class="holiday-answer-figure"><span>Not open yet</span><strong>Opens ${e(r.opening.when)}</strong><small>${e(r.name)}'s hours page, read ${short(r.observed_on)}</small></p>`
      : `<p><strong>For snow and open lifts today, check ${e(r.name)}'s own cams and <a href="${e(r.status_page)}">snow report</a>.</strong></p>`;
    return `<section id="ski-answer" class="container answer-box" aria-label="${e(r.name)} today">
        ${lead}
        <p>${camLink}</p>
        <p class="holiday-note">No cam read from us yet. ${e(read.reason)}</p>
      </section>`;
  }
  const chip = read.state === "stale" ? "Older read" : read.status;
  const variant = read.state === "stale" ? "neutral" : STATUSES[read.status];
  const when = `${etDay(read.read_at) === today ? "" : `${short(etDay(read.read_at))}, `}${etTime(read.read_at)} ET`;
  const closed = read.status === "Closed" ? `<p><strong>${e(r.name)} says it is closed.</strong> The cam read below is context only.</p>` : "";
  return `<section id="ski-answer" class="container answer-box" aria-label="Cam read now">
        <ul class="deal-chips"><li class="deal-verdict-${e(variant)}">${e(chip)}</li>${read.fields.map((f) => `<li>${e(f)}</li>`).join("")}</ul>
        ${closed}${read.line ? `<p><strong>${e(read.line)}</strong></p>` : ""}
        <p class="holiday-note">Read from ${e(read.cams_used)} of ${e(read.cams_total)} ${e(r.name)} cams at ${e(when)}${read.state === "stale" ? " (more than 90 minutes ago)" : ""}. Our reading of the pictures, not ${e(r.name)}'s report.</p>
        <ul>${opening}</ul>
        <p>${camLink}</p>
      </section>`;
}

function camTable(r, read) {
  if (read.state === "none") {
    return `<p>${e(r.name)}'s ${r.cams.length} public cams, as named on its <a href="${e(r.cam_page)}">cam page</a> (read ${short(r.observed_on)}): ${r.cams.map((c) => e(c.name)).join(", ")}. Once our reads start, each cam's last read time shows here.</p>`;
  }
  const byName = new Map((read.cams ?? []).map((c) => [c.name, c]));
  const rows = r.cams.map((c) => {
    const f = byName.get(c.name);
    const last = read.state === "none" || !f ? "No read yet" : f.no_read ? `No read: ${f.no_read}` : f.read_at ? etTime(f.read_at) + " ET" : "No read";
    return `              <tr><th scope="row">${e(c.name)}</th><td>${e(c.reads)}</td><td>${e(last)}</td></tr>`;
  }).join("\n");
  return `<div class="holiday-table-wrap">
          <table class="holiday-table">
            <caption><span>${e(r.name)}'s ${r.cams.length} public cams, as named on its cam page (read ${short(r.observed_on)}).</span></caption>
            <thead><tr><th scope="col">Cam</th><th scope="col">What we read from it</th><th scope="col">Last read</th></tr></thead>
            <tbody>
${rows}
            </tbody>
          </table>
        </div>`;
}

export function resortPage(slug, data = resortData(), today = easternDate(), feed = null, now = new Date()) {
  const r = data.resorts[slug];
  const errors = validateResort(r);
  if (errors.length) throw new Error(`resort-conditions.json ${slug}: ${errors.join("; ")}`);
  const path = resortPath(slug);
  const url = `https://familytripwise.com/${path}`;
  const read = camRead(feed?.resorts?.[slug], now);
  const fresh = ageDays(r.observed_on, today) <= MAX_PRICE_AGE_DAYS;
  const obs = short(r.observed_on);
  const src = (k) => `<a href="${e(r.sources[k].url)}">${e(r.sources[k].label)}</a>`;
  const plan = r.plan.map((p) => `<li><strong>${e(p.label)}:</strong> ${e(p.text)}</li>`).join("");
  const tub = r.tubing && nextTubing(r.tubing, today);
  const tubing = tub ? `<li><strong>Tubing:</strong> ${e(r.tubing.text)} ${tub[0] <= today ? "Dates now" : "Next dates"}: ${short(tub[0])}${tub[1] !== tub[0] ? `–${short(tub[1])}` : ""}. Ages not listed.</li>` : "";
  const prices = fresh && r.prices.length
    ? `<p><strong>Childcare prices on ${e(r.name)}'s page, read ${obs}:</strong></p><ul>${r.prices.map((p) => `<li>${e(p.label)}: <strong>${e(p.value)}</strong></li>`).join("")}</ul><p class="holiday-note">${e(r.price_basis)}</p>`
    : `<p>Our ${e(r.name)} childcare price check is too old to show; check live.</p>`;
  const usedSources = ["cams", "hours", "first-timers", "childcare", "getting-here", "mountain-info"].map(src).join(" · ");
  const place = `${e(r.name)}, ${e(r.town)}`;
  const body = `    <main id="main" class="holiday-page">
      <section class="page-hero">
        <div class="container">
          <p class="eyebrow">${place} · Ski conditions</p>
          <h1>${e(r.name)} Conditions and Webcams Today</h1>
          <p>${e(r.subhead)} ${e(r.drive)}.</p>
          ${contributorCredit()}
        </div>
      </section>
      ${readCard(r, read, today)}
      <section class="container page-section" aria-labelledby="cams-title">
        <h2 id="cams-title">Cam by cam</h2>
        ${camTable(r, read)}
      </section>
      <section class="container page-section" aria-labelledby="plan-title">
        <h2 id="plan-title">Plan the day with kids</h2>
        <ul>${plan}${tubing}</ul>
        ${prices}
        <p><strong>Lift tickets and lessons:</strong> ${e(r.unpriced)} See ${src("tickets")}.</p>
        <p class="holiday-source">From ${src("first-timers")}, ${src("childcare")}, ${src("getting-here")} and ${src("hours")}, read ${obs}.</p>
      </section>
      <section class="container page-section" aria-labelledby="getting-title">
        <h2 id="getting-title">Getting there from New York City</h2>
        <ul>${r.getting_there.map((l) => `<li>${e(l)}</li>`).join("")}</ul>
        <p>Closer hills for a day trip: <a href="./skiing-near-new-york-city-with-kids.html">skiing near New York City with kids</a>.</p>
      </section>
      <section class="container page-section" aria-labelledby="backup-title">
        <h2 id="backup-title">If the snow is thin</h2>
        <ul>${r.backup.map((l) => `<li>${e(l).replace(e(`${r.name}'s policies page`), src("policies"))}</li>`).join("")}</ul>
        <p class="holiday-source">From ${src("mountain-info")} and ${src("hours")}, read ${obs}.</p>
      </section>
      <section class="container trust-panel" aria-label="How we read the cams">
        <p><strong>How we read the cams:</strong> a program looks at ${e(r.name)}'s public webcam pictures and notes only what a picture can show: fresh snow, snow cover, snowmaking, moving lifts, how busy the base looks, visibility and the snow stake. Each read shows its time; after 90 minutes it is marked older, after 6 hours it is hidden. We never say whether terrain is safe, icy, groomed or open; ${e(r.name)}'s own report decides that. We don't show the cam pictures or count people.</p>
        <p class="holiday-source">Sources: ${usedSources} (read ${obs}). We haven't skied ${e(r.name)}.</p>
      </section>
    </main>`;
  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${e(r.name)} Conditions and Webcams Today, With Kids Tips</title>
    <meta name="description" content="${e(r.name)} conditions: links to its own webcams and snow report, our dated cam reads once they start, plus ${r.opening ? "opening day, " : ""}kids' lesson ages, childcare and parking for families, from ${e(r.name)}'s pages we read and date.">
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
  const img = imageLock[r.hero_slug];
  // The page sits in the NYC guide set, which carries a one-line holiday link under the photo.
  return addHolidayLink(withLinkPreview(placeSitePageHero(html, path, `<img src="../${e(img.path)}" alt="${e(r.hero_alt)}" width="${img.width}" height="${img.height}" loading="eager" fetchpriority="high" decoding="async">
          <figcaption>${e(r.hero_place)} Photo: ${e(img.artist.split(" from ")[0])} via <a href="${e(img.source_page)}">Wikimedia Commons</a>, ${img.license_url ? `<a href="${e(img.license_url)}">${e(img.license)}</a>` : e(img.license)}. Resized and cropped.</figcaption>`), path), path);
}

export function writeResortPages(writeSite, today = easternDate(), feed = null) {
  const data = resortData();
  for (const slug of Object.keys(data.resorts)) writeSite(resortPath(slug), resortPage(slug, data, today, feed));
}

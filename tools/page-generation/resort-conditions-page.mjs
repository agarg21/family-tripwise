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
// The snowcam feed (docs/plan/resort-conditions-pages.md): the only interface to the cam pipeline.
export const FEED_URL = "https://raw.githubusercontent.com/agarg21/snowcam-feed/main/conditions.json";
export const CLIENT_PATH = "ski/cam-read.js";
/** This resort's entry in the feed (keys may differ from our slugs, e.g. hunter-mountain -> hunter). */
export const feedEntry = (slug, r, feed) => feed?.resorts?.[r.feed_key ?? slug] ?? null;
export const resortUrls = () => Object.keys(resortData().resorts).map((s) => `https://familytripwise.com/${resortPath(s)}`);

const imageLock = JSON.parse(readFileSync(new URL("../images/commons-images.lock.json", import.meta.url), "utf8"));
const MAX_PRICE_AGE_DAYS = 30;
const STALE_MIN = 90;
const HIDE_MIN = 360;
const MIN_CONF = 0.6;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
// Public labels from the feed contract (snowcam 4174658, 2026-11-16); "Closed" is no longer sent but stays harmless.
const STATUSES = { "Looks good": "worth_it", Fair: "neutral", Busy: "only_for", "Thin cover": "only_for", "Lifts not moving": "only_for", Closed: "skip", "No read": "neutral" };
// What each status chip says on the page: names what it refers to (persona review 11-15).
const CHIP_LABELS = { "Looks good": "Snow looks good on cams", Fair: "Fair on cams", Busy: "Base looks busy on cams", "Thin cover": "Thin snow cover on cams", "Lifts not moving": "Lifts not moving on cams", Closed: "Resort says closed", "No read": "No read" };
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
// "Seven Springs'", not "Seven Springs's" (review 11-17).
const poss = (name) => `${e(name)}${/s$/.test(name) ? "'" : "'s"}`;
const hasPrice = (s) => /\$\d/.test(String(s ?? ""));
const etTime = (iso) => new Date(iso).toLocaleTimeString("en-US", { timeZone: "America/New_York", hour: "numeric", minute: "2-digit" }).replace(" AM", "am").replace(" PM", "pm");
const etDay = (iso) => new Date(iso).toLocaleDateString("en-CA", { timeZone: "America/New_York" });

export function validateResort(r) {
  const errors = [];
  if (!imageLock[r.hero_slug]) errors.push(`hero ${r.hero_slug} not self-hosted`);
  if (r.hero_position !== undefined && !/^\d{1,3}% \d{1,3}%$/.test(r.hero_position)) errors.push("hero_position must be like '50% 20%'");
  if (r.opening && !r.opening.when) errors.push("opening.when");
  if (r.opening?.early && !(/^\d{4}-\d{2}-\d{2}$/.test(r.opening.early) && r.opening.early < r.opening.date)) errors.push("opening.early must be an ISO date before opening.date");
  if (r.status_lifts_open !== undefined && (!r.status_note || !Number.isInteger(r.status_lifts_open) || r.status_lifts_open < 0)) errors.push("status_lifts_open needs status_note and a whole number");
  if (r.status_read && (!r.status_note || !/^\d{4}-\d{2}-\d{2}$/.test(r.status_read))) errors.push("status_read needs status_note and an ISO date");
  for (const k of ["name", "town", "observed_on", "drive", "subhead", "cam_page", "status_page", "unpriced", "hero_alt", "hero_place"]) if (!r[k]) errors.push(`missing ${k}`);
  if ((r.prices ?? []).length && !r.price_basis) errors.push("missing price_basis");
  if (!r.cams?.length) errors.push("cams");
  for (const k of ["name", "town", "drive", "subhead", "unpriced", "status_note", "price_heading", "price_meta"]) if (hasPrice(r[k])) errors.push(`${k} holds a price`);
  for (const p of r.plan ?? []) { if (hasPrice(p.text)) errors.push(`plan ${p.label} holds a price`); if (!r.sources[p.source]) errors.push(`plan ${p.label}: source`); }
  for (const p of r.prices ?? []) if (!hasPrice(p.value) || !r.sources[p.source]) errors.push(`price ${p.label}`);
  for (const line of [...(r.getting_there ?? []), ...(r.backup ?? [])]) if (hasPrice(line)) errors.push("line holds a price");
  for (const k of [...(r.extra_sources ?? []), ...(r.backup_sources ?? [])]) if (!r.sources?.[k]) errors.push(`source ${k}`);
  for (const s of Object.values(r.sources ?? {})) if (!/^https:\/\//.test(s.url ?? "") || !s.label) errors.push("source");
  return errors;
}

/** The publishable cam read for one resort, or a reason there is none. Applies the D47 limits. */
export function camRead(feedResort, now = new Date()) {
  if (!feedResort) return { state: "none", reason: "Cam reads show here only when a recent one has passed a separate automated accuracy check." };
  if (feedResort.publish !== true) return { state: "none", reason: "Cam reads show here only when a recent one has passed a separate automated accuracy check." };
  const at = Date.parse(feedResort.read_at ?? "");
  if (!Number.isFinite(at)) return { state: "none", reason: "No recent read." };
  const mins = (now.getTime() - at) / 60000;
  if (mins > HIDE_MIN || mins < -5) return { state: "none", reason: "No recent read: the last one is more than 6 hours old." };
  const status = Object.hasOwn(STATUSES, String(feedResort.status)) ? feedResort.status : "No read";
  const fields = [];
  for (const [key, f] of Object.entries(feedResort.fields ?? {})) {
    if (!Object.hasOwn(FIELD_LABELS, key) || !f || typeof f.conf !== "number" || f.conf < MIN_CONF) continue;
    const value = String(f.value ?? "").trim();
    if (!value || hasPrice(value) || BANNED.test(value)) continue;
    if (key === "base_busyness" && !ALLOWED_BUSY.has(value.toLowerCase())) continue;
    fields.push(`${FIELD_LABELS[key]}: ${value}`);
  }
  const stakeConf = feedResort.stake_conf ?? feedResort.fields?.stake?.conf;
  if (typeof feedResort.stake_inches === "number" && feedResort.stake_inches >= 0 && !(typeof stakeConf === "number" && stakeConf < MIN_CONF)) fields.unshift(`Snow stake: ${feedResort.stake_inches} in.`);
  return {
    state: mins > STALE_MIN ? "stale" : "fresh", status, line: BANNED.test(String(feedResort.line ?? "")) || hasPrice(feedResort.line) ? "" : String(feedResort.line ?? ""), fields,
    read_at: feedResort.read_at, cams_used: feedResort.cams_used, cams_total: feedResort.cams_total,
    cams: feedResort.cams ?? [],
  };
}

const nextTubing = (t, today) => t.blocks.find(([, end]) => end >= today);

/** The resort's own dated status as a short chip plus its line, or null (persona review 11-16: a one-word
 * open/closed chip, attributed and dated). "Not open yet" only before an opening date the resort posted;
 * a lift count only from the resort's status page and only within 7 days of that read. */
function resortStatus(r, today) {
  const nb = (iso) => short(iso).replace(" ", "\u00a0");
  if (r.opening && r.opening.early && today >= r.opening.early && today < r.opening.date) return { chip: "Passholders only today", variant: "only_for", text: `<strong>Opens to everyone ${e(r.opening.when)}</strong> (${poss(r.name)} ${e(r.opening.source ?? "hours page")}, read\u00a0${nb(r.observed_on)}).` };
  if (r.opening && today < r.opening.date) return { chip: "Not open yet", variant: "skip", text: `<strong>Opens ${e(r.opening.when)}</strong> (${poss(r.name)} ${e(r.opening.source ?? "hours page")}, read\u00a0${nb(r.observed_on)}).` };
  // A target date the resort says can move with weather never earns a positive chip on the day (integrity review 11-18).
  if (r.opening && r.opening.target && today === r.opening.date) return { chip: "Target opening day", variant: "neutral", text: `${e(r.opening.text)} Check ${poss(r.name)} own status before you drive (read\u00a0${nb(r.observed_on)}).` };
  if (r.opening && today === r.opening.date) return { chip: "Opening day", variant: "worth_it", text: `${e(r.opening.text)} (read\u00a0${nb(r.observed_on)}).` };
  const read = r.status_read ?? r.observed_on;
  if (!r.status_note || (Date.parse(`${today}T00:00:00Z`) - Date.parse(`${read}T00:00:00Z`)) / 864e5 > 7) return null;
  // The chip carries its own date, so a week-old count never reads as today's (integrity review 11-16).
  const n = r.status_lifts_open;
  const chip = typeof n === "number" ? `${n === 0 ? "No" : n} lift${n === 1 ? "" : "s"} open on ${nb(read)}` : "";
  return { chip, variant: n === 0 ? "skip" : "neutral", text: `${e(r.status_note)} (read\u00a0${nb(read)}).` };
}

function readCard(r, read, today) {
  const camLink = `<a class="button primary" href="${e(r.cam_page)}">Watch ${poss(r.name)} own cams</a>`;
  const st = resortStatus(r, today);
  // The resort's own dated status leads, so a good cam read never reads as "open today".
  const statusBlock = st
    ? `<p class="cam-read-label">${poss(r.name)} own status</p>
        <p class="cam-read-status">${st.chip ? `<span class="cam-read-chip deal-verdict-${e(st.variant)}">${e(st.chip)}</span>` : ""}${st.text}</p>`
    : `<p class="cam-read-label">${poss(r.name)} own status</p>
        <p class="cam-read-status">For open lifts, check ${poss(r.name)} <a href="${e(r.status_page)}">snow report</a>.</p>`;
  if (read.state === "none") {
    return `<section id="ski-answer" class="container answer-box cam-read" aria-label="${e(r.name)} today">
        ${statusBlock}
        <p class="cam-read-label">Our webcam read</p>
        <p class="holiday-note">No cam read from us yet. ${e(read.reason)}</p>
        <p>${camLink}</p>
      </section>`;
  }
  if (read.status === "No read" || !read.cams_used) {
    return `<section id="ski-answer" class="container answer-box cam-read" aria-label="${e(r.name)} today">
        ${statusBlock}
        <p class="cam-read-label">Our webcam read</p>
        <p class="holiday-note">No cam read right now: our program could not read the pictures (checked ${e(etTime(read.read_at))} ET).</p>
        <p>${camLink}</p>
      </section>`;
  }
  const stale = read.state === "stale";
  const chip = stale ? "Older read" : CHIP_LABELS[read.status];
  const variant = stale ? "only_for" : STATUSES[read.status];
  const readDay = etDay(read.read_at);
  const when = `${new Date(`${readDay}T12:00:00Z`).toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" })}, ${short(readDay)} at ${etTime(read.read_at)} ET`;
  const closed = read.status === "Closed" ? `<p><strong>${e(r.name)} says it is closed.</strong> The cam read below is context only.</p>` : "";
  return `<section id="ski-answer" class="container answer-box cam-read" aria-label="Cam read now">
        ${statusBlock}
        <p class="cam-read-label">Our webcam read</p>
        ${closed}<p class="cam-read-head"><span class="cam-read-chip deal-verdict-${e(variant)}">${e(chip)}</span>${read.line ? ` <strong>${e(read.line)}</strong>` : ""}</p>
        ${read.fields.length ? `<ul class="deal-chips">${read.fields.map((f) => `<li>${e(f)}</li>`).join("")}</ul>
        ` : ""}<p class="holiday-note">Read from ${e(read.cams_used)} of ${e(read.cams_total)} ${e(r.name)} cams on ${e(when)}${stale ? " (more than 90 minutes ago)" : ""}. Our reading of the pictures, not ${poss(r.name)} report.</p>
        ${stale ? `<p><strong>Older read: check ${poss(r.name)} live cams before you leave.</strong></p>
        ` : ""}<p>${camLink}</p>
      </section>`;
}

function camTable(r, read) {
  if (read.state === "none") {
    return `<p>${r.cams_note ? `${e(r.cams_note)} (see ${poss(r.name)} own <a href="${e(r.cam_page)}">cam page</a>, ${r.cams_from_feed ? "as listed in our cam feed" : "read"} ${short(r.observed_on)})` : `${poss(r.name)} ${r.cams.length} public cams, as named on its <a href="${e(r.cam_page)}">cam page</a> (read ${short(r.observed_on)})`}: ${r.cams.map((c) => e(c.name)).join(", ")}. Once our reads start, each cam's last read time shows here.</p>`;
  }
  const byName = new Map((read.cams ?? []).map((c) => [c.name, c]));
  const rows = r.cams.map((c) => {
    const f = byName.get(c.feed_name ?? c.name);
    const last = read.state === "none" || !f ? "No read yet" : f.no_read ? (BANNED.test(String(f.no_read)) || hasPrice(f.no_read) ? "No read" : `No read: ${f.no_read}`) : f.read_at ? etTime(f.read_at) : "No read";
    return `              <tr><th scope="row">${e(c.name)}</th><td>${e(c.reads)}</td><td class="cam-read-time">${e(last)}</td></tr>`;
  }).join("\n");
  return `<div class="holiday-table-wrap">
          <table class="holiday-table">
            <caption><span>${r.cams_note ? e(r.cams_note) : `${poss(r.name)} ${r.cams.length} public cams, as named on its cam page`} (read ${short(r.observed_on)}).</span></caption>
            <thead><tr><th scope="col">Cam</th><th scope="col">What we read from it</th><th scope="col" class="cam-read-time">Last read (ET)</th></tr></thead>
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
  const entry = feedEntry(slug, r, feed);
  const read = camRead(entry, now);
  // The HTML itself never carries a read (it could be hours old by the time someone opens it); the page
  // script draws the deploy-time read only while it is 6 hours old or less, then the feed's latest (O53).
  const shown = read.state === "none" ? read : { state: "none", reason: "Our latest read shows here with JavaScript on." };
  const fresh = ageDays(r.observed_on, today) <= MAX_PRICE_AGE_DAYS;
  const obs = short(r.observed_on);
  const src = (k) => `<a href="${e(r.sources[k].url)}">${e(r.sources[k].label)}</a>`;
  // A source read on another day than observed_on says so next to its link.
  const srcd = (k) => `${src(k)}${r.sources[k].read && r.sources[k].read !== r.observed_on ? ` (read ${short(r.sources[k].read)})` : ""}`;
  const plan = r.plan.map((p) => `<li><strong>${e(p.label)}:</strong> ${e(p.text)}</li>`).join("");
  const tub = r.tubing && nextTubing(r.tubing, today);
  const tubing = tub ? `<li><strong>Tubing:</strong> ${e(r.tubing.text)} ${tub[0] <= today ? "Dates now" : "Next dates"}: ${short(tub[0])}${tub[1] !== tub[0] ? `–${short(tub[1])}` : ""}. Ages not listed.</li>` : "";
  const prices = !(r.prices ?? []).length ? "" : fresh
    ? `<p><strong>${e(r.price_heading ?? "Childcare prices")} on ${poss(r.name)} ${r.price_heading ? "pages" : "page"}, read ${obs}:</strong></p><ul>${r.prices.map((p) => `<li>${e(p.label)}: <strong>${e(p.value)}</strong></li>`).join("")}</ul><p class="holiday-note">${e(r.price_basis)}</p>`
    : `<p>Our ${e(r.name)} ${e(r.price_meta ?? "childcare")} check is too old to show; check live.</p>`;
  const usedSources = ["cams", "hours", "first-timers", "childcare", "getting-here", "mountain-info", "home", ...(r.extra_sources ?? [])].filter((k) => r.sources[k]).map(srcd).join(" · ");
  const place = r.town.startsWith(`${r.name},`) ? e(r.town) : `${e(r.name)}, ${e(r.town)}`;
  const body = `    <main id="main" class="holiday-page" data-cam-read="${e(JSON.stringify(clientConfig(slug, r, entry, read)))}">
      <section class="page-hero">
        <div class="container">
          <p class="eyebrow">${place} · Ski conditions</p>
          <h1>${e(r.name)} Conditions and Webcams Today</h1>
          <p>${e(r.subhead)} ${e(r.drive)}.</p>
          ${contributorCredit()}
        </div>
      </section>
      ${readCard(r, shown, today)}
      <section class="container page-section" aria-labelledby="cams-title">
        <h2 id="cams-title">Cam by cam</h2>
        <div id="cam-table">${camTable(r, shown)}</div>
      </section>
      <section class="container page-section" aria-labelledby="plan-title">
        <h2 id="plan-title">Plan the day with kids</h2>
        <ul>${plan}${tubing}</ul>
        ${prices}
        <p><strong>Lift tickets and lessons:</strong> ${e(r.unpriced)} See ${src("tickets")}.</p>
        <p class="holiday-source">From ${[r.sources.home && src("home"), ...(r.extra_sources ?? []).filter((k) => k !== "tubing").map(src), srcd("first-timers"), r.sources.childcare && src("childcare"), src("getting-here")].filter(Boolean).join(", ")} and ${src("hours")}, read ${obs}.</p>
      </section>
      <section class="container page-section" aria-labelledby="getting-title">
        <h2 id="getting-title">${e(r.getting_heading ?? "Getting there from New York City")}</h2>
        <ul>${r.getting_there.map((l) => `<li>${e(l)}</li>`).join("")}</ul>
${r.nyc_link === false ? "" : `        <p>Closer hills for a day trip: <a href="./skiing-near-new-york-city-with-kids.html">skiing near New York City with kids</a>.</p>
`}      </section>
      <section class="container page-section" aria-labelledby="backup-title">
        <h2 id="backup-title">If the snow is thin</h2>
        <ul>${r.backup.map((l) => `<li>${e(l).replace(e(`${r.name}'s policies page`), r.sources.policies ? src("policies") : e(`${r.name}'s policies page`)).replace("its tubing page", r.sources.tubing ? `its ${src("tubing")} page` : "its tubing page")}</li>`).join("")}</ul>
        <p class="holiday-source">From ${(r.backup_sources ?? ["mountain-info", "hours"]).map(src).join(" and ")}, read ${obs}.</p>
      </section>
      <section class="container trust-panel" aria-label="How we read the cams">
        <p><strong>How we read the cams:</strong> a program looks at ${poss(r.name)} public webcam pictures and notes only what a picture can show: fresh snow, snow cover, snowmaking, moving lifts, how busy the base looks, visibility and the snow stake. Each read shows its time; after 90 minutes it is marked older, after 6 hours it is hidden. We never say whether terrain is safe, icy, groomed or open; ${poss(r.name)} own report decides that. We don't show the cam pictures or count people.</p>
        <p class="holiday-source">Sources: ${usedSources} (read ${obs}). We haven't skied ${e(r.name)}.</p>
      </section>
    </main>`;
  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${e(r.name)} Conditions and Webcams Today, With Kids Tips</title>
    <meta name="description" content="${r.meta_description ? e(r.meta_description) : `${e(r.name)} conditions: links to its own webcams and snow report, our dated cam reads once they start, plus ${r.opening ? "opening day, " : ""}kids' lesson ages${(r.prices ?? []).length ? `, ${e(r.price_meta ?? "childcare")}` : ""}${r.plan.some((p) => p.label === "Parking") ? " and parking" : ""} for families, from ${poss(r.name)} pages we read and date.`}">
    <link rel="canonical" href="${url}">
    <link rel="stylesheet" href="../styles.css">
  </head>
  <body>
    ${siteHeader("../", path)}
${body}
    <script src="../${CLIENT_PATH}" defer></script>
    ${siteEnd("../", path)}
  </body>
</html>
`;
  const img = imageLock[r.hero_slug];
  // The page sits in the NYC guide set, which carries a one-line holiday link under the photo.
  return addHolidayLink(withLinkPreview(placeSitePageHero(html, path, `<img src="../${e(img.path)}"${r.hero_position ? ` style="object-position:${e(r.hero_position)}"` : ""} alt="${e(r.hero_alt)}" width="${img.width}" height="${img.height}" loading="eager" fetchpriority="high" decoding="async">
          <figcaption>${e(r.hero_place)} Photo: ${e(img.artist.split(" from ")[0])} via <a href="${e(img.source_page)}">Wikimedia Commons</a>, ${img.license_url ? `<a href="${e(img.license_url)}">${e(img.license)}</a>` : e(img.license)}. Resized and cropped.</figcaption>`), path), path);
}

// What the page script needs to redraw the card and cam table (no prices, no typed condition text).
// `entry` is the deploy-time feed read, only when it was publishable then.
const ENTRY_KEYS = ["publish", "status", "line", "read_at", "cams_used", "cams_total", "fields", "stake_inches", "stake_conf", "cams"];
function clientConfig(slug, r, entry, read) {
  const keep = ["name", "observed_on", "cam_page", "status_page", "status_note", "status_read", "status_lifts_open", "opening", "cams_note"];
  return { ...Object.fromEntries(keep.filter((k) => r[k] !== undefined).map((k) => [k, r[k]])), feed_key: r.feed_key ?? slug,
    ...(read.state !== "none" ? { entry: Object.fromEntries(ENTRY_KEYS.filter((k) => entry[k] !== undefined).map((k) => [k, entry[k]])) } : {}),
    cams: r.cams.map((c) => ({ name: c.name, reads: c.reads, ...(c.feed_name ? { feed_name: c.feed_name } : {}) })) };
}

/** The card and cam table the page script draws for a feed read (tests and fixture QA). */
export function drawnRead(slug, data, today, feed, now = new Date()) {
  const r = data.resorts[slug];
  const read = camRead(feedEntry(slug, r, feed), now);
  return { card: readCard(r, read, today), table: camTable(r, read) };
}

/** Page script: re-checks the read written in at deploy time against the visitor's clock with the same D47
 * rules as the build (the functions are copied from this module, so the two cannot disagree): older than
 * 90 minutes it shows as older, past 6 hours it is hidden. It then asks the feed for the latest read when
 * the page opens and about once an hour while it stays open (OWNER O53, 2026-11-15; the privacy page names
 * this request, id="snowcam-feed"): no cookies, no referrer, nothing stored. A failed or malformed fetch
 * keeps the deploy-time read; a fetched read older than it is ignored. */
export const REFRESH_MIN = 60;
export function clientScript() {
  const consts = { STALE_MIN, HIDE_MIN, MIN_CONF, MONTHS, STATUSES, CHIP_LABELS, FIELD_LABELS, FEED_URL, REFRESH_MIN };
  const fns = { e, poss, short, hasPrice, etTime, etDay };
  // resortStatus is copied in below with readCard.
  return `// Generated by tools/page-generation/resort-conditions-page.mjs (QUEUE G19). Do not edit.
(() => {
${Object.entries(consts).map(([k, v]) => `  const ${k} = ${JSON.stringify(v)};`).join("\n")}
  const ALLOWED_BUSY = new Set(${JSON.stringify([...ALLOWED_BUSY])});
  const BANNED = ${BANNED};
${Object.entries(fns).map(([k, v]) => `  const ${k} = ${v};`).join("\n")}
  ${camRead}
  ${resortStatus}
  ${readCard}
  ${camTable}
  const main = document.querySelector("[data-cam-read]");
  if (!main) return;
  const r = JSON.parse(main.dataset.camRead);
  let entry = r.entry ?? null;
  const draw = () => {
    if (!entry) return;
    const now = new Date();
    const read = camRead(entry, now);
    const card = document.getElementById("ski-answer");
    const table = document.getElementById("cam-table");
    if (card) card.outerHTML = readCard(r, read, etDay(now.toISOString()));
    if (table) table.innerHTML = camTable(r, read);
  };
  draw();
  if (typeof fetch !== "function" || !r.feed_key) return;
  let last = 0;
  const refresh = async () => {
    last = Date.now();
    try {
      const ctl = typeof AbortController === "function" ? new AbortController() : null;
      const timer = ctl && typeof setTimeout === "function" ? setTimeout(() => ctl.abort(), 10000) : null;
      const res = await fetch(FEED_URL, { cache: "no-store", credentials: "omit", referrerPolicy: "no-referrer", ...(ctl ? { signal: ctl.signal } : {}) });
      if (timer) clearTimeout(timer);
      if (!res.ok) throw new Error("feed " + res.status);
      const body = JSON.parse(await res.text());
      if (!body || typeof body.resorts !== "object" || Array.isArray(body.resorts)) throw new Error("feed shape");
      const next = body.resorts[r.feed_key];
      if (next && typeof next === "object" && (!next.cams || Array.isArray(next.cams)) && !(entry && Date.parse(next.read_at ?? "") < Date.parse(entry.read_at ?? ""))) entry = next;
    } catch (err) { /* keep the read we have */ }
    draw();
  };
  refresh();
  if (typeof setInterval !== "function") return;
  // Re-age the read every minute (no request), so the 90-minute and 6-hour rules hold on an open page.
  setInterval(draw, 60000);
  setInterval(() => { if (!document.hidden) refresh(); }, REFRESH_MIN * 60000);
  if (typeof document.addEventListener === "function") document.addEventListener("visibilitychange", () => {
    if (!document.hidden && Date.now() - last > REFRESH_MIN * 60000) refresh();
  });
})();
`;
}

export function writeResortPages(writeSite, today = easternDate(), feed = null) {
  const data = resortData();
  writeSite(CLIENT_PATH, clientScript());
  for (const slug of Object.keys(data.resorts)) writeSite(resortPath(slug), resortPage(slug, data, today, feed));
}

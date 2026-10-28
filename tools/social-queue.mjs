// Social post queue (QUEUE G03, OWNER D12). Builds ops/social-queue/YYYY-MM-DD.json from the same
// verified records that feed /this-week/ (fresh-items.json) and /deals/ (deal-checks.json), and the
// typographic image card for each entry. Nothing here posts anything: the G04 workflow reads these
// files, and must still refuse an expired entry at post time.
//
// Usage:
//   node tools/social-queue.mjs YYYY-MM-DD     write the queue file and card HTML list for that date
//   node tools/social-cards.mjs YYYY-MM-DD     render the cards (needs headless Chromium)
//
// Every sentence in a post is copied from a verified record field; nothing is paraphrased, so a post
// can never say more than the record. Sentences are dropped (never cut) to fit a platform limit.
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { readFreshItems, citySlug } from "./page-generation/this-week-page.mjs";
import { readDealChecks, longDate } from "./page-generation/deals-pages.mjs";

export const root = fileURLToPath(new URL("../", import.meta.url));
export const queueDir = join(root, "ops/social-queue");
export const cardDir = "social/cards"; // under site/, so cards are public JPEG URLs (Instagram needs one)
export const SITE = "https://familytripwise.com";

// Text limits as documented by each platform (characters; Bluesky counts graphemes, and our text is
// plain Latin, so characters are the same). G04 must re-check these against each API before posting.
export const LIMITS = {
  bluesky: { text: 300 },
  threads: { text: 500 },
  facebook: { text: 2000 }, // our own ceiling; Facebook allows far more
  instagram: { text: 2200, hashtags: 5 }, // Instagram allows 30 hashtags; we use at most 5
  pinterest: { title: 100, text: 500 },
  tiktok: { title: 90, text: 2200 },
  youtube: { title: 100, text: 5000 },
};
export const PLATFORMS = Object.keys(LIMITS);

// Per-platform daily caps from docs/research/growth-distribution-landscape-2026-10-28.md §6.2
// (upper end of each range; YouTube 3–7/week ≈ 1/day).
export const DAILY_CAPS = { bluesky: 4, threads: 5, facebook: 2, instagram: 1, pinterest: 10, tiktok: 1, youtube: 1 };
// Total verified "units" a day: 5–6 in Nov–Dec, 2–3 off-season (strategy/current-strategy.md).
export const unitCap = (date) => (/^\d{4}-(11|12)-/.test(date) ? 6 : 3);
// A post may only use an observation at most this many days old; G05 re-observes to keep posting.
export const MAX_OBSERVATION_AGE_DAYS = 14;
// An item posted in any of the previous N days' queues is not queued again.
export const REPEAT_GAP_DAYS = 3;
// Posting times, America/New_York, in queue order.
export const SLOTS = { 3: ["07:30", "12:30", "19:30"], 6: ["07:30", "10:00", "12:30", "15:00", "17:30", "19:30"] };

const ISO = /^\d{4}-\d{2}-\d{2}$/;

export function addDays(iso, days) {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}
export const daysBetween = (a, b) => Math.round((Date.parse(`${b}T12:00:00Z`) - Date.parse(`${a}T12:00:00Z`)) / 86400000);

// UTC offset of America/New_York on a date at noon, as "-04:00" or "-05:00".
export function easternOffset(iso) {
  const name = new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", timeZoneName: "shortOffset" })
    .formatToParts(new Date(`${iso}T16:00:00Z`)).find((p) => p.type === "timeZoneName").value; // e.g. GMT-4
  const hours = Number(name.replace("GMT", ""));
  return `-${String(Math.abs(hours)).padStart(2, "0")}:00`;
}
export const easternTime = (iso, hhmm) => `${iso}T${hhmm}:00${easternOffset(iso)}`;
const shortDate = (iso) => longDate(iso).replace(/, \d{4}$/, "");

// Split a record field into sentences without breaking "a.m. ET" or "p.m. PT".
export function sentences(text) {
  const out = [];
  let current = "";
  const parts = String(text).split(/(?<=[.!?])\s+/);
  for (let i = 0; i < parts.length; i += 1) {
    current = current ? `${current} ${parts[i]}` : parts[i];
    const abbrevThenZone = /\b[ap]\.m\.$/.test(current) && /^[A-Z]{2}\b/.test(parts[i + 1] ?? "");
    if (!abbrevThenZone) {
      out.push(current);
      current = "";
    }
  }
  if (current) out.push(current);
  return out;
}

// The whole field when it is short, else its first sentence (a sentence is never cut).
export const brief = (text, max = 180) => (text.length <= max ? text : sentences(text)[0]);

// Join required and optional sentences; optional ones are added in order while they fit.
function fit(required, optional, limit) {
  let text = required.filter(Boolean).join("\n\n");
  for (const s of optional.filter(Boolean)) {
    const next = text ? `${text}\n\n${s}` : s;
    if (next.length <= limit) text = next;
  }
  return text;
}

// One normalized record per verified item or deal check.
export function sourceRecords({ items = readFreshItems(), checks = readDealChecks() } = {}) {
  const events = items.map((item) => ({
    id: item.id,
    kind: "this-week",
    kicker: `Family event · ${item.city}`,
    city: item.city,
    title: item.title,
    lines: [
      ["When", sentences(item.when)[0]],
      ["Cost", sentences(item.cost)[0]],
    ],
    short: [`When: ${brief(item.when)}`, `Cost: ${brief(item.cost)}`],
    extra: [sentences(item.family)[0], sentences(item.booking)[0]],
    full: [`When: ${item.when}`, `Cost: ${item.cost}`, `Booking: ${item.booking}`, `Family note: ${item.family}`],
    page: `${SITE}/this-week/`,
    anchor: item.id,
    evergreen: `${SITE}/this-week/#${citySlug(item.city)}`,
    official_url: item.official_url,
    source_label: item.source_label,
    observed_on: item.observed_on,
    expires_on: item.expires_on,
    priority_on: item.sort_on,
    third_party: Boolean(item.third_party),
    hashtags: ["#familytravel", `#${citySlug(item.city).replaceAll("-", "")}withkids`],
  }));
  const deals = checks.map((check) => {
    const bookBy = `Book by ${longDate(check.expires_on)}${check.expires_note ? ` (${check.expires_note})` : ""}.`;
    return {
      id: check.id,
      kind: "deal",
      kicker: `Family Deal Check · ${check.category}`,
      city: null,
      title: check.title,
      lines: [
        ["Book by", `${longDate(check.expires_on)}${check.expires_note ? ` (${check.expires_note})` : ""}`],
        ["For a family", check.headline],
      ],
      short: [check.headline, bookBy],
      extra: [sentences(check.family_of_four)[0], bookBy],
      full: [check.headline, check.family_of_four, bookBy],
      page: `${SITE}/deals/${check.id}.html`,
      anchor: null,
      evergreen: `${SITE}/deals/`,
      official_url: check.official_url,
      source_label: check.source_label,
      observed_on: check.observed_on,
      expires_on: check.expires_on,
      priority_on: check.expires_on,
      third_party: false,
      hashtags: ["#familytravel", "#familyvacation"],
    };
  });
  return [...deals, ...events];
}

export function cardHtml(record) {
  const e = (v) => String(v ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
  const rows = record.lines.map(([k, v]) => `<div class="row"><p class="k">${e(k)}</p><p class="v">${e(v)}</p></div>`).join("");
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><style>
*{box-sizing:border-box;margin:0}html,body{width:1080px;height:1350px;background:#fbf8f2}
body{font-family:"DejaVu Sans","Liberation Sans",Arial,sans-serif;color:#1d2a33;padding:84px 84px 72px;display:flex;flex-direction:column}
.kicker{font-size:30px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:#0f6b5c}
h1{font-size:64px;line-height:1.12;margin:28px 0 40px;font-weight:800}
.rows{flex:1;overflow:hidden}.row{border-top:4px solid #e3dccd;padding:26px 0}
.k{font-size:26px;font-weight:700;text-transform:uppercase;color:#6a5d45;letter-spacing:.05em}
.v{font-size:38px;line-height:1.3;margin-top:8px}
.foot{border-top:4px solid #1d2a33;padding-top:26px;font-size:26px;line-height:1.4;color:#3b4a54}
.brand{font-size:34px;font-weight:800;color:#1d2a33;margin-top:10px}
</style></head><body>
<p class="kicker">${e(record.kicker)}</p>
<h1>${e(record.title)}</h1>
<div class="rows">${rows}</div>
<div class="foot"><p>Checked on the official page ${e(longDate(record.observed_on))}: ${e(record.source_label)}. Confirm before booking.</p><p class="brand">familytripwise.com</p></div>
<script>
// Shrink type until everything fits; the renderer refuses a card that still overflows.
{const fits=()=>document.querySelector('.rows').scrollHeight<=document.querySelector('.rows').clientHeight&&document.body.scrollHeight<=1350;
let s=1;while(!fits()&&s>0.6){s-=0.05;document.querySelector('h1').style.fontSize=(64*s)+'px';document.querySelectorAll('.v').forEach(n=>n.style.fontSize=(38*s)+'px');}
document.body.dataset.fits=fits()?'yes':'no';}
</script></body></html>`;
}

export const cardHash = (record) => createHash("sha256").update(cardHtml(record)).digest("hex").slice(0, 10);
export const cardFile = (record) => `${cardDir}/${record.id}-${cardHash(record)}.jpg`;

function link(record, platform, entryId) {
  const base = platform === "pinterest" ? record.evergreen : record.page;
  const [path, hash] = base.split("#");
  const anchor = platform === "pinterest" ? hash : record.anchor;
  return `${path}?utm_source=${platform}&utm_medium=social&utm_campaign=${entryId}${anchor ? `#${anchor}` : ""}`;
}

export function variants(record, entryId) {
  const checked = `Checked on the official page ${shortDate(record.observed_on)}: ${record.source_label}.`;
  const pageWord = record.kind === "deal" ? "familytripwise.com/deals" : "familytripwise.com/this-week";
  // A deal's headline carries its family caveats (fees, ages, exclusions), so it is never dropped.
  const deal = record.kind === "deal";
  const core = deal ? [record.title, record.short[0]] : [record.title];
  const more = deal ? [record.short[1]] : record.short;
  const v = {};
  v.bluesky = { text: fit(core, [...more, checked], LIMITS.bluesky.text) };
  v.threads = { text: fit(core, [...more, record.extra[0], checked], LIMITS.threads.text) };
  v.facebook = { text: fit([record.title, ...record.full, checked], [], LIMITS.facebook.text) };
  v.instagram = { text: fit([record.title, ...record.full, checked, `Details and the official link: ${pageWord}`], [record.hashtags.join(" ")], LIMITS.instagram.text) };
  v.pinterest = { title: record.title, text: fit(core.slice(1), [...more, checked], LIMITS.pinterest.text) };
  v.tiktok = { title: record.title, text: fit([record.title, ...record.full, checked], [record.hashtags.join(" ")], LIMITS.tiktok.text), media: "photo" };
  v.youtube = { title: record.title, text: fit([record.title, ...record.full, checked], [], LIMITS.youtube.text), media: "video_required" };
  for (const p of PLATFORMS) v[p].link = link(record, p, entryId);
  return v;
}

export function readQueue(date, dir = queueDir) {
  const path = join(dir, `${date}.json`);
  return existsSync(path) ? JSON.parse(readFileSync(path, "utf8")) : null;
}

// Pick the day's entries: verified, unexpired, freshly observed, not posted in the last few days,
// most urgent first (deal deadline, event start or lottery close).
export function buildQueue(date, { records = sourceRecords(), previous = (d) => readQueue(d) } = {}) {
  if (!ISO.test(date)) throw new Error(`date must be YYYY-MM-DD, got ${date}`);
  const recent = new Set();
  for (let i = 1; i <= REPEAT_GAP_DAYS; i += 1) for (const entry of previous(addDays(date, -i))?.entries ?? []) recent.add(entry.item_id);
  const eligible = records
    .filter((r) => !r.third_party && r.expires_on >= date && r.observed_on <= date && daysBetween(r.observed_on, date) <= MAX_OBSERVATION_AGE_DAYS && !recent.has(r.id))
    .map((r) => ({ r, key: r.priority_on >= date ? r.priority_on : r.expires_on }))
    .sort((a, b) => a.key.localeCompare(b.key) || a.r.id.localeCompare(b.r.id))
    .slice(0, unitCap(date))
    .map(({ r }) => r);
  const slots = SLOTS[unitCap(date)];
  const used = Object.fromEntries(PLATFORMS.map((p) => [p, 0]));
  const entries = eligible.map((r, i) => {
    const id = `${date}-${r.id}`;
    const all = variants(r, id);
    const platforms = {};
    for (const p of PLATFORMS) if (used[p] < DAILY_CAPS[p]) { platforms[p] = all[p]; used[p] += 1; }
    return {
      id,
      item_id: r.id,
      kind: r.kind,
      scheduled_at: easternTime(date, slots[i]),
      expires_at: easternTime(r.expires_on, "23:59"),
      source: { official_url: r.official_url, label: r.source_label, observed_on: r.observed_on },
      page: r.page,
      image: { path: `site/${cardFile(r)}`, url: `${SITE}/${cardFile(r)}`, width: 1080, height: 1350, alt: `${r.kicker}. ${r.title}. Checked on the official page ${longDate(r.observed_on)}.` },
      platforms,
    };
  });
  return {
    date,
    note: "Generated by tools/social-queue.mjs from fresh-items.json and deal-checks.json. Posting (G04) must skip any entry past expires_at and never post an entry twice.",
    entries,
  };
}

export function queueFiles(dir = queueDir) {
  return existsSync(dir) ? readdirSync(dir).filter((n) => /^\d{4}-\d{2}-\d{2}\.json$/.test(n)).sort() : [];
}

// Returns a list of problems; empty means the queue may be handed to the posting workflow.
export function validateQueue(queue, { records = sourceRecords(), today = null, siteDir = join(root, "site") } = {}) {
  const problems = [];
  const date = queue?.date;
  if (!ISO.test(date ?? "")) return ["queue date missing"];
  const entries = queue.entries ?? [];
  if (entries.length > unitCap(date)) problems.push(`${date}: ${entries.length} entries exceeds ${unitCap(date)} units/day`);
  const perPlatform = Object.fromEntries(PLATFORMS.map((p) => [p, 0]));
  const ids = new Set();
  const byId = new Map(records.map((r) => [r.id, r]));
  for (const entry of entries) {
    const where = `${date} ${entry.id}`;
    if (ids.has(entry.item_id)) problems.push(`${where}: item queued twice`);
    ids.add(entry.item_id);
    const s = entry.source ?? {};
    if (!/^https:\/\//.test(s.official_url ?? "") || !s.label || !ISO.test(s.observed_on ?? "")) problems.push(`${where}: source url, label and observed_on are required`);
    if (s.observed_on > date || daysBetween(s.observed_on, date) > MAX_OBSERVATION_AGE_DAYS) problems.push(`${where}: observation ${s.observed_on} is not within ${MAX_OBSERVATION_AGE_DAYS} days before ${date}`);
    if (!(Date.parse(entry.scheduled_at) < Date.parse(entry.expires_at))) problems.push(`${where}: scheduled after it expires`);
    if (entry.expires_at.slice(0, 10) < date) problems.push(`${where}: expired before the queue date`);
    if (!entry.scheduled_at.startsWith(date)) problems.push(`${where}: scheduled on another day`);
    const img = entry.image ?? {};
    if (!img.alt || img.width !== 1080 || img.height !== 1350 || !/^site\/social\/cards\/[a-z0-9-]+\.jpg$/.test(img.path ?? "")) problems.push(`${where}: image must be a 1080x1350 site/social/cards JPEG with alt text`);
    else if (siteDir && !existsSync(join(siteDir, "..", img.path))) problems.push(`${where}: card ${img.path} not rendered`);
    for (const [p, v] of Object.entries(entry.platforms ?? {})) {
      if (!LIMITS[p]) { problems.push(`${where}: unknown platform ${p}`); continue; }
      perPlatform[p] += 1;
      if (!v.text || v.text.length > LIMITS[p].text) problems.push(`${where}: ${p} text missing or over ${LIMITS[p].text}`);
      if (LIMITS[p].title && (!v.title || v.title.length > LIMITS[p].title)) problems.push(`${where}: ${p} title missing or over ${LIMITS[p].title}`);
      if (LIMITS[p].hashtags && (v.text.match(/#\w+/g) ?? []).length > LIMITS[p].hashtags) problems.push(`${where}: ${p} has too many hashtags`);
      if (!v.link?.startsWith(SITE)) problems.push(`${where}: ${p} link must point to ${SITE}`);
    }
    // While an entry can still be posted, it must match the current verified record exactly.
    if (today && date >= today) {
      const record = byId.get(entry.item_id);
      if (!record) problems.push(`${where}: source record no longer exists; regenerate the queue`);
      else {
        if (record.third_party) problems.push(`${where}: third-party record`);
        if (record.observed_on !== s.observed_on || record.expires_on !== entry.expires_at.slice(0, 10)) problems.push(`${where}: record changed (observed or expiry); regenerate the queue`);
        if (`site/${cardFile(record)}` !== img.path) problems.push(`${where}: card no longer matches the record; regenerate`);
        const fresh = variants(record, entry.id);
        for (const [p, v] of Object.entries(entry.platforms ?? {})) if (fresh[p] && fresh[p].text !== v.text) problems.push(`${where}: ${p} text differs from the record; regenerate`);
      }
    }
  }
  for (const [p, n] of Object.entries(perPlatform)) if (n > DAILY_CAPS[p]) problems.push(`${date}: ${p} has ${n} posts, cap ${DAILY_CAPS[p]}`);
  return problems;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const { writeFileSync, mkdirSync } = await import("node:fs");
  const date = process.argv[2];
  const queue = buildQueue(date);
  mkdirSync(queueDir, { recursive: true });
  writeFileSync(join(queueDir, `${date}.json`), `${JSON.stringify(queue, null, 2)}\n`);
  console.log(`Wrote ops/social-queue/${date}.json with ${queue.entries.length} entries: ${queue.entries.map((e) => e.item_id).join(", ")}`);
}

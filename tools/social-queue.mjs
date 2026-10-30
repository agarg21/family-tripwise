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

// Text limits as documented by each platform (characters). G04 must re-check these against each API
// before posting. Bluesky was dropped from phase 0 by the owner (OWNER D12, revised 2026-10-28).
export const LIMITS = {
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
export const DAILY_CAPS = { threads: 5, facebook: 2, instagram: 1, pinterest: 10, tiktok: 1, youtube: 1 };
// Total verified "units" a day: 5–6 in Nov–Dec, 2–3 off-season (strategy/current-strategy.md).
export const unitCap = (date) => (/^\d{4}-(11|12)-/.test(date) ? 6 : 3);
// A post may only use an observation at most this many days old; G05 re-observes to keep posting.
export const MAX_OBSERVATION_AGE_DAYS = 14;
// Posts stop at 00:00 ET on a record's last day: a deadline that day may fall earlier than any
// slot (DC lottery 3 p.m. ET) or the event may end in another time zone (London 10 p.m. = 17:00 ET).
export const lastPostDay = (expiresOn) => addDays(expiresOn, -1);
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
// DST switches at 02:00 local, so a time before 02:00 takes the previous day's offset.
export const easternTime = (iso, hhmm) => `${iso}T${hhmm}:00${easternOffset(hhmm < "02:00" ? addDays(iso, -1) : iso)}`;
const shortDate = (iso) => longDate(iso).replace(/, \d{4}$/, "");
const VERDICT_LABEL = { worth_it: "Worth it", only_for: "Only for some families", skip: "Skip" };
const imageLock = () => JSON.parse(readFileSync(join(root, "tools/images/commons-images.lock.json"), "utf8"));

// Split a record field into sentences. After "a.m."/"p.m." a sentence ends only when the next word
// starts with a capital letter that is not a time zone or a day/month name ("10 a.m. to noon", "3 p.m. ET" stay whole).
// A day or month name after "a.m."/"p.m." continues the sentence ("until 10 a.m. Saturday, November 7").
// A single-letter initial or a short title/place abbreviation never ends a sentence ("Enid A. Haupt", "St. Louis").
const NAME_ABBREV = /(?:^|[\s(])(?:[A-Z]|St|Mt|Ft|Dr|Mr|Mrs|Ms)\.$/;
const DAY_OR_MONTH = /^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|January|February|March|April|May|June|July|August|September|October|November|December)\b/;
export function sentences(text) {
  const out = [];
  let current = "";
  const parts = String(text).split(/(?<=[.!?])\s+/);
  for (let i = 0; i < parts.length; i += 1) {
    current = current ? `${current} ${parts[i]}` : parts[i];
    const next = parts[i + 1];
    const timeAbbrev = /\b[ap]\.m\.$/.test(current);
    const keepGoing = next !== undefined && ((timeAbbrev && (!/^[A-Z]/.test(next) || /^[A-Z]{1,4}T\b/.test(next) || DAY_OR_MONTH.test(next))) || NAME_ABBREV.test(current));
    if (!keepGoing) {
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
      ["When", brief(item.when)],
      ["Cost", brief(item.cost)],
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
    const label = check.deadline_stated === false ? "Listed until" : "Book by";
    const bookBy = `${label} ${longDate(check.expires_on)}${check.expires_note ? ` (${check.expires_note})` : ""}.`;
    // A headline that already says "book by <this date>" is not followed by the same deadline again
    // (Beaches, Club Med). A deadline with a note (year reading) keeps its own line so the note survives.
    const monthDay = longDate(check.expires_on).replace(/, \d{4}$/, "");
    const headlineHasDeadline = label === "Book by" && !check.expires_note
      && new RegExp(`\\b(?:book|stay) by ${monthDay}(?!\\d)(?:,\\s*${check.expires_on.slice(0, 4)}(?!\\d)|(?!,\\s*\\d{4}))`, "i").test(check.headline);
    const deadline = headlineHasDeadline ? [] : [bookBy];
    return {
      id: check.id,
      kind: "deal",
      kicker: `Family Deal Check · ${check.category}`,
      city: null,
      title: check.title,
      lines: [
        [label, `${longDate(check.expires_on)}${check.expires_note ? ` (${check.expires_note})` : ""}`],
        ["For a family", check.headline],
      ],
      short: [check.headline, ...deadline],
      extra: [sentences(check.family_of_four)[0], ...deadline],
      full: [check.headline, check.family_of_four, ...deadline],
      page: `${SITE}/deals/${check.id}.html`,
      anchor: null,
      evergreen: `${SITE}/deals/`,
      official_url: check.official_url,
      source_label: check.source_label,
      observed_on: check.observed_on,
      expires_on: check.expires_on,
      priority_on: check.expires_on,
      third_party: false,
      // G09 step 2: a deal scored "skip" is never shared (only worth_it and only_for are).
      verdict: check.score?.verdict ?? null,
      hashtags: ["#familytravel", "#familyvacation"],
      // G11 step 2: a check with v2 post lines posts in the v2 order (hook with the key number and the
      // place, verdict, catch, book-by, dated check) and gets the v2 photo card.
      v2: check.v2?.post ? {
        context: check.v2.context,
        headline: check.v2.headline,
        title: check.v2.post.title,
        big_number: check.v2.big_number,
        big_label: check.v2.big_label,
        verdict_label: check.v2?.verdict_pill ?? VERDICT_LABEL[check.score?.verdict] ?? null,
        deadline: `${label} ${longDate(check.expires_on)}`,
        lines: [check.v2.post.hook, check.v2.post.verdict, check.v2.post.catch, check.v2.date_note_short ? `${label} ${longDate(check.expires_on)} (${check.v2.date_note_short}).` : bookBy],
        checked: `Checked on ${new URL(check.official_url).hostname.replace(/^www\./, "")} on ${shortDate(check.observed_on)}.`,
        hero_image: check.v2.hero_image?.slug ?? null,
        hero_alt: check.v2.hero_image?.alt ?? null,
      } : null,
    };
  });
  return [...deals, ...events];
}

const esc = (v) => String(v ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");

// v2 deal card (docs/plan/deal-content-v2.md "Posts"): the page's credited, self-hosted photo with the big
// number, then the post hook (company, where, the number), the verdict chip and deadline, who it is for,
// the catch, the dated check and the brand mark.
// Never an AI image or promotional art; without a hero photo the number panel is plain brand colour.
function cardHtmlV2(record) {
  const v = record.v2;
  const photo = v.hero_image && imageLock()[v.hero_image];
  const bg = photo ? `background:linear-gradient(rgba(11,73,70,0) 30%,rgba(11,73,70,.92) 88%),url(data:image/webp;base64,${readFileSync(join(root, "site", photo.path)).toString("base64")}) center/cover;` : "";
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><style>
*{box-sizing:border-box;margin:0}html,body{width:1080px;height:1350px;background:#fffaf2}
body{font-family:"DejaVu Sans","Liberation Sans",Arial,sans-serif;color:#142029;display:flex;flex-direction:column}
.top{height:540px;flex:none;background:#126c67;${bg}color:#fff;display:flex;flex-direction:column;justify-content:flex-end;padding:56px 72px 30px;text-shadow:0 2px 10px rgba(0,0,0,.55)}
.num{font-size:132px;font-weight:800;line-height:1}.lab{font-size:34px;line-height:1.25;margin-top:14px}
.credit{font-size:20px;margin-top:22px;opacity:.92}
.main{flex:1;padding:40px 72px 48px;display:flex;flex-direction:column;overflow:hidden}
.ctx{font-size:30px;font-weight:700;color:#0b4946;line-height:1.3}
h1{font-size:46px;line-height:1.18;font-weight:800}
.row{display:flex;gap:18px;align-items:center;flex-wrap:wrap;margin-top:24px}
.chip{background:#f0bd56;font-weight:800;font-size:32px;padding:10px 22px;border-radius:999px}
.chip.w{background:#126c67;color:#fff}
.when{font-size:32px;font-weight:700}
.who{font-size:29px;line-height:1.33;margin-top:22px;font-weight:700}
.catch{font-size:29px;line-height:1.33;margin-top:14px;color:#3b4a54}
.brand{margin-top:auto;border-top:4px solid #142029;padding-top:20px;font-size:24px;line-height:1.4;color:#3b4a54}
.brand b{display:block;font-size:34px;color:#142029}
</style></head><body>
<div class="top" id="top"><p class="num">${esc(v.big_number)}</p><p class="lab">${esc(v.big_label)}</p>${photo ? `<p class="credit">Photo: ${esc(photo.artist.split(" from ")[0])}, ${esc(photo.license)}</p>` : ""}</div>
<div class="main" id="main"><h1>${esc(v.lines[0])}</h1>
<div class="row"><span class="chip${v.verdict_label === "Worth it" ? " w" : ""}">${esc(v.verdict_label)}</span><span class="when">${esc(v.deadline)}</span></div>
<p class="who">${esc(v.lines[1])}</p>
<p class="catch">${esc(v.lines[2])}</p>
<div class="brand"><p>${esc(v.checked)} Confirm before booking.</p><b>familytripwise.com · Family Deal Check</b></div></div>
<script>{const m=document.getElementById("main"),t=document.getElementById("top");
document.body.dataset.fits=(m.scrollHeight<=m.clientHeight&&t.scrollHeight<=t.clientHeight&&t.scrollWidth<=t.clientWidth&&document.body.scrollWidth<=1080&&document.body.scrollHeight<=1350)?"yes":"no";}</script>
</body></html>`;
}

export function cardHtml(record) {
  if (record.v2) return cardHtmlV2(record);
  const e = esc;
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

// v2 deal post: hook, verdict, catch, book-by and the dated check, about 350 characters; the link
// travels outside the text (Facebook link field, Threads first comment); Instagram says "link in bio".
function variantsV2(record) {
  const v = record.v2;
  const body = [...v.lines, v.checked].join("\n\n");
  const tags = record.hashtags.join(" ");
  return {
    threads: { text: body },
    facebook: { text: body },
    instagram: { text: `${body}\n\nLink in bio: familytripwise.com/deals\n\n${tags}` },
    pinterest: { title: v.title, text: body },
    tiktok: { title: v.title, text: `${body}\n\n${tags}`, media: "photo" },
    youtube: { title: v.title, text: body, media: "video_required" },
  };
}

export function variants(record, entryId) {
  if (record.v2) {
    const v = variantsV2(record);
    for (const p of PLATFORMS) v[p].link = link(record, p, entryId);
    return v;
  }
  const checked = `Checked on the official page ${shortDate(record.observed_on)}: ${record.source_label}.`;
  const pageWord = record.kind === "deal" ? "familytripwise.com/deals" : "familytripwise.com/this-week";
  // A deal's headline carries its family caveats (fees, ages, exclusions), so it is never dropped.
  const deal = record.kind === "deal";
  const core = deal ? [record.title, record.short[0]] : [record.title];
  const more = (deal ? [record.short[1]] : record.short).filter(Boolean);
  const v = {};
  // The dated check line always closes the post: optional sentences give way to it, never the reverse.
  // When the required title and headline leave no room for the source name, the line keeps just the date.
  const coreLength = core.filter(Boolean).join("\n\n").length;
  const threadsChecked = coreLength + 2 + checked.length <= LIMITS.threads.text ? checked : `Checked on the official page ${shortDate(record.observed_on)}.`;
  v.threads = { text: `${fit(core, [...more, record.extra[0]], LIMITS.threads.text - threadsChecked.length - 2)}\n\n${threadsChecked}` };
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

const cardAlt = (r) => (r.v2
  ? `Family Deal Check card: ${r.v2.lines[0]} ${r.v2.lines[1]} ${r.v2.lines[2]} ${r.v2.deadline}.${r.v2.hero_alt ? ` Photo: ${r.v2.hero_alt}.` : ""}`
  : `${r.kicker}. ${r.title}. Checked on the official page ${longDate(r.observed_on)}.`);

// Events are shareable once verified; a deal check only with a worth_it or only_for verdict.
export const shareable = (r) => r.kind !== "deal" || ["worth_it", "only_for"].includes(r.verdict);

// Pick the day's entries: verified, unexpired, freshly observed, not posted in the last few days,
// most urgent first (deal deadline, event start or lottery close). `skip` lists items the operator
// deliberately left out of this day (a repeat that adds nothing new), each with a written reason; the
// list is stored in the queue so a regeneration keeps the decision.
export function buildQueue(date, { records = sourceRecords(), previous = (d) => readQueue(d), skip = [] } = {}) {
  if (!ISO.test(date)) throw new Error(`date must be YYYY-MM-DD, got ${date}`);
  for (const s of skip) if (!s?.item_id || !String(s.reason ?? "").trim()) throw new Error("each skipped item needs item_id and a reason");
  const skipped = new Set(skip.map((s) => s.item_id));
  const recent = new Set();
  for (let i = 1; i <= REPEAT_GAP_DAYS; i += 1) for (const entry of previous(addDays(date, -i))?.entries ?? []) recent.add(entry.item_id);
  const eligible = records
    .filter((r) => !r.third_party && shareable(r) && lastPostDay(r.expires_on) >= date && r.observed_on <= date && daysBetween(r.observed_on, date) <= MAX_OBSERVATION_AGE_DAYS && !recent.has(r.id) && !skipped.has(r.id))
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
      expires_at: easternTime(r.expires_on, "00:00"),
      source: { official_url: r.official_url, label: r.source_label, observed_on: r.observed_on },
      page: r.page,
      image: { path: `site/${cardFile(r)}`, url: `${SITE}/${cardFile(r)}`, width: 1080, height: 1350, alt: cardAlt(r) },
      platforms,
    };
  });
  return {
    date,
    note: "Generated by tools/social-queue.mjs from fresh-items.json and deal-checks.json. Posting (G04) must skip any entry past expires_at and never post an entry twice.",
    entries,
    ...(skip.length ? { skipped: skip.map(({ item_id, reason }) => ({ item_id, reason })) } : {}),
  };
}

// Re-render the text and card of each entry already in a queue from the current records, keeping the
// day's selection, slots and stored skips (G11: a template change must not reselect a posted day).
// Platforms keep the set the entry already had; an entry whose record is gone is left for validation.
export function refreshQueue(queue, { records = sourceRecords() } = {}) {
  const byId = new Map(records.map((r) => [r.id, r]));
  const entries = queue.entries.map((entry) => {
    const r = byId.get(entry.item_id);
    if (!r) return entry;
    const all = variants(r, entry.id);
    const platforms = Object.fromEntries(Object.keys(entry.platforms).map((p) => [p, all[p]]));
    return {
      ...entry,
      source: { official_url: r.official_url, label: r.source_label, observed_on: r.observed_on },
      page: r.page,
      image: { ...entry.image, path: `site/${cardFile(r)}`, url: `${SITE}/${cardFile(r)}`, alt: cardAlt(r) },
      platforms,
    };
  });
  return { ...queue, entries };
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
    if (!/T00:00:00-0[45]:00$/.test(entry.expires_at ?? "") || entry.expires_at.slice(0, 10) <= date) problems.push(`${where}: expires_at must be 00:00 ET on a day after the queue date`);
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
        if (!shareable(record)) problems.push(`${where}: deal is not scored worth_it or only_for; regenerate the queue`);
        if (record.observed_on !== s.observed_on || record.expires_on !== entry.expires_at.slice(0, 10)) problems.push(`${where}: record changed (observed or expiry); regenerate the queue`);
        if (`site/${cardFile(record)}` !== img.path) problems.push(`${where}: card no longer matches the record; regenerate`);
        const fresh = variants(record, entry.id);
        for (const [p, v] of Object.entries(entry.platforms ?? {})) if (fresh[p] && fresh[p].text !== v.text) problems.push(`${where}: ${p} text differs from the record; regenerate`);
      }
    }
  }
  for (const s of queue.skipped ?? []) {
    if (!s?.item_id || !String(s.reason ?? "").trim()) problems.push(`${date}: a skipped item needs item_id and a reason`);
    else if (ids.has(s.item_id)) problems.push(`${date} ${s.item_id}: listed as skipped but also queued`);
  }
  for (const [p, n] of Object.entries(perPlatform)) if (n > DAILY_CAPS[p]) problems.push(`${date}: ${p} has ${n} posts, cap ${DAILY_CAPS[p]}`);
  return problems;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const { writeFileSync, mkdirSync } = await import("node:fs");
  // node tools/social-queue.mjs YYYY-MM-DD [--skip <item-id> "<reason>"]...
  // A regeneration keeps the skips already stored in that day's queue; --skip adds to them
  // (a repeated item id replaces its stored reason).
  const [date, ...rest] = process.argv.slice(2);
  if (rest[0] === "--refresh") {
    // node tools/social-queue.mjs YYYY-MM-DD --refresh   (re-render texts and cards; same entries)
    const existing = readQueue(date);
    if (!existing) throw new Error(`No ops/social-queue/${date}.json to refresh`);
    const refreshed = refreshQueue(existing);
    writeFileSync(join(queueDir, `${date}.json`), `${JSON.stringify(refreshed, null, 2)}\n`);
    console.log(`Refreshed ops/social-queue/${date}.json in place: ${refreshed.entries.map((e) => e.item_id).join(", ")}`);
    process.exit(0);
  }
  const skip = [];
  for (let i = 0; i < rest.length; i += 1) {
    if (rest[i] !== "--skip" || !rest[i + 1] || !rest[i + 2]) throw new Error('usage: node tools/social-queue.mjs YYYY-MM-DD [--skip <item-id> "<reason>"]...');
    skip.push({ item_id: rest[i + 1], reason: rest[i + 2] });
    i += 2;
  }
  const stored = ISO.test(date ?? "") ? readQueue(date)?.skipped ?? [] : [];
  const merged = [...stored.filter((s) => !skip.some((n) => n.item_id === s.item_id)), ...skip];
  const queue = buildQueue(date, { skip: merged });
  mkdirSync(queueDir, { recursive: true });
  writeFileSync(join(queueDir, `${date}.json`), `${JSON.stringify(queue, null, 2)}\n`);
  console.log(`Wrote ops/social-queue/${date}.json with ${queue.entries.length} entries: ${queue.entries.map((e) => e.item_id).join(", ")}${queue.skipped ? `; skipped: ${queue.skipped.map((s) => s.item_id).join(", ")}` : ""}`);
}

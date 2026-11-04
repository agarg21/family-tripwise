// Reels v2 (QUEUE G17, OWNER D38): a short vertical video that opens on the page's own real, credited
// photo with one big word or number ("FREE", "SAVE ≈ $112"), the place and the date, then our designed
// cards slide in over the moving photo, ending on a save/send prompt. Optionally a credited free-licence
// stock clip of the entry's own place replaces the photo. Never AI video or images of real places, no AI
// voice, no reposted promotional art, no music (silent), and no figure that is not already on the
// entry's image card, in its post or in its page title.
//
// Usage:
//   node tools/social-reels.mjs YYYY-MM-DD
//       Picks the day's reel entry (at most one: a holiday/event entry or a real-deal entry that carries
//       Instagram, else Facebook), renders site/social/reels/<entry-id>-<hash>.mp4 and a poster JPG, and
//       records `reel` on that queue entry. Idempotent: an existing file with the same hash is kept.
//   node tools/social-reels.mjs --item <record-id> --out <dir> [--date YYYY-MM-DD] [--stills] [--test-clip <file>]
//       Review sample for any record: renders into <dir> only (never the queue or site/), with stills.
//       --no-photo renders the cards over the brand teal.
//       --test-clip overlays a local test video labelled "TEST CLIP" to review the stock-clip layout.
//   node tools/social-reels.mjs --fetch-clips
//       Cuts each approved clip segment from its download_url into the local clip cache (needs network).
//
// Posting uses a reel only when ops/media/reels.json says {"enabled": true} for that platform and the
// entry's reel still matches its record (tools/social-post.mjs, reelForPost). Off by default.
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, renameSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { LOGO_SVG, SITE, esc, nunitoFace, queueDir, readQueue, root, shareable, shortDate, sourceRecords, usdS } from "./social-queue.mjs";

export const REEL_VERSION = 2; // bump when the frame design or encoding changes (new hashes, new files)
export const W = 1080;
export const H = 1920;
export const FPS = 30;
export const MIN_SECONDS = 8;
export const MAX_SECONDS = 14;
export const MAX_BYTES = 8 * 1024 * 1024;
// Instagram's Reels UI covers the top ~250 px (header, camera) and the bottom ~350 px (caption, audio
// row); the like/comment/share column sits on the right from about y 1150 to 1700. Text stays inside
// x 64-900 and y 250-1570.
export const SAFE = { top: 250, bottom: 350, left: 64, right: 180 };
export const REEL_DIR = "social/reels"; // under site/, so Zernio gets a public HTTPS URL
export const REEL_PLATFORMS = ["instagram", "facebook"];
export const CLIPS_PATH = join(root, "ops/media/stock-clips.json");
export const CONFIG_PATH = join(root, "ops/media/reels.json");
// Free licences we accept for stock clips (exact names as recorded in ops/media/stock-clips.json).
// ShareAlike clips are not accepted (a reel over one would have to carry that licence).
export const ALLOWED_LICENCES = ["CC0 1.0", "Public domain", "CC BY 2.0", "CC BY 3.0", "CC BY 4.0", "Pexels License"];
const UA = "FamilyTripwise/1.0 (https://familytripwise.com/about.html)";
export const clipCacheDir = () => process.env.REELS_CLIP_CACHE || join(tmpdir(), "familytripwise-reel-clips");

export const readClips = (path = CLIPS_PATH) => (existsSync(path) ? JSON.parse(readFileSync(path, "utf8")).clips ?? [] : []);
// Off unless the operator turns it on after review: {"enabled": true, "platforms": ["instagram", "facebook"]}.
export const readReelConfig = (path = CONFIG_PATH) => {
  const c = existsSync(path) ? JSON.parse(readFileSync(path, "utf8")) : {};
  return { enabled: c.enabled === true, platforms: (c.platforms ?? []).filter((p) => REEL_PLATFORMS.includes(p)) };
};

// ---------- which entry, which clip ----------

// The place a clip must match exactly: the event's city (deal checks carry no single city in v1, so deal
// reels are cards-only until a deal record states its place).
export const placeOf = (record) => record?.city ?? null;

const clipUsable = (c) => c?.status === "approved" && ALLOWED_LICENCES.includes(c.licence?.name) && Boolean(c.licence?.url && c.author && c.source_url && c.source_name && c.download_url && c.shows_short);
// A clip may back an entry only when its place equals the entry's place; a clip listing item_ids shows that
// event or venue and is used only for those items; a clip without item_ids is a neutral view of the city.
export function clipMatches(record, clip) {
  const place = placeOf(record);
  return Boolean(place) && clip?.place === place && (!clip.item_ids?.length || clip.item_ids.includes(record.id)) && clipUsable(clip);
}
export function clipFor(record, clips) {
  const ok = clips.filter((c) => clipMatches(record, c));
  return ok.find((c) => c.item_ids?.length) ?? ok[0] ?? null;
}
export const frameCredit = (clip) => `Video: ${clip.author} / ${clip.source_name}, ${clip.licence.name} · ${clip.shows_short}`;
export const captionCredit = (clip) => `Video: ${clip.shows_short}, by ${clip.author} / ${clip.source_name}, ${clip.licence.name} (${clip.licence.url.replace(/^https?:\/\//, "")}); cropped, darkened, text added.`;

// Reel-eligible (v1 rule): a verified holiday/event entry, or a deal that is a real deal with a
// spend-vs-save card (D22). Never a third-party record.
export function reelEligible(entry, record) {
  if (!entry || !record || record.third_party || entry.item_id !== record.id || entry.kind !== record.kind) return false;
  if (record.kind === "this-week") return Boolean(record.catch);
  return record.kind === "deal" && shareable(record) && Boolean(record.v2?.ss);
}
// At most one reel a day: the first eligible entry that carries Instagram, else the first that carries Facebook.
export function pickReelEntry(queue, records) {
  const byId = new Map(records.map((r) => [r.id, r]));
  const ok = (queue?.entries ?? []).filter((e) => reelEligible(e, byId.get(e.item_id)) && REEL_PLATFORMS.some((p) => e.platforms?.[p]));
  return ok.find((e) => e.platforms.instagram) ?? ok[0] ?? null;
}

// ---------- the opening photo (v2) ----------

// A reel opens on a real, credited photo: a deal's own page photo (v2.hero_image), or for an event the
// photo of its city's holiday page (tools/page-generation/holiday-cities.json hero_slug), else the city
// listed in ops/media/reel-photos.json `cities`. The photo must also be approved for reels in that file,
// with a short honest note of what it shows, and carry a free licence, artist and file in the image lock.
// Never an AI image, never the operator's promotional art with text on it.
export const PHOTOS_PATH = join(root, "ops/media/reel-photos.json");
export const PHOTO_LICENCES = ["CC0", "Public domain", "CC BY 2.0", "CC BY 3.0", "CC BY 4.0", "CC BY-SA 2.0", "CC BY-SA 3.0", "CC BY-SA 4.0"];
const readJson = (p, fallback) => (existsSync(p) ? JSON.parse(readFileSync(p, "utf8")) : fallback);
export const readReelPhotos = (path = PHOTOS_PATH) => readJson(path, { photos: {}, cities: {} });
const readLock = () => readJson(join(root, "tools/images/commons-images.lock.json"), {});
const readCityHeroes = () => Object.fromEntries(Object.values(readJson(join(root, "tools/page-generation/holiday-cities.json"), { cities: {} }).cities ?? {}).map((c) => [c.place, c.hero_slug]));
const cityKey = (s) => String(s ?? "").toLowerCase().replace(/[^a-z]/g, "");
// "Tony Webster from Portland, Oregon" -> "Tony Webster"; "White House. Andrea Hanks, photographer" -> "Andrea Hanks / White House".
export const shortArtist = (a) => {
  const s = String(a).replace(/\s*\([^)]*\)/g, "").replace(/\s+from\s+.*$/, "").trim();
  const m = s.match(/^(.+?)\.\s+(.+), photographer$/);
  return m ? `${m[2]} / ${m[1]}` : s;
};
// Cover scale above this means the photo is too small to fill a 1080x1920 frame sharply: it is shown
// full-width near the top over a blurred copy of itself instead.
export const FULL_BLEED_MAX_SCALE = 2.3;
export function reelPhoto(record, { photos = readReelPhotos(), lock = readLock(), cityHeroes = readCityHeroes() } = {}) {
  if (!record) return null;
  let slug = null;
  if (record.kind === "deal") slug = record.v2?.hero_image ?? null;
  else {
    const k = cityKey(record.city);
    const find = (map) => Object.entries(map ?? {}).find(([place]) => cityKey(place) === k)?.[1] ?? null;
    slug = find(cityHeroes) ?? find(photos.cities);
  }
  const p = slug ? photos.photos?.[slug] : null;
  const l = slug ? lock[slug] : null;
  if (p?.status !== "approved" || !p.shows || !l?.path || !l.artist || !PHOTO_LICENCES.includes(l.license) || (l.license !== "Public domain" && !/^https?:\/\//.test(l.license_url ?? "")) || !(l.width > 0 && l.height > 0)) return null;
  // Honest context: an event reel never shows the event itself; a deal reel says when the photo is not the park.
  const context = record.kind === "deal" ? (p.venue ? "" : "not the park") : "not this event";
  const scale = Math.max(W / l.width, H / l.height);
  return {
    slug, file: `site/${l.path}`, width: l.width, height: l.height, bytes: l.bytes ?? null, source_page: l.source_page ?? null, artist: p.credit_as ?? shortArtist(l.artist), license: l.license, license_url: l.license_url,
    shows: p.shows, context, crop_x: p.crop_x ?? 0.5, crop_y: p.crop_y ?? 0.5, mode: scale > FULL_BLEED_MAX_SCALE ? "framed" : "full", sharealike: /BY-SA/.test(l.license),
  };
}
const photoNote = (ph) => `${ph.shows}${ph.context ? `; ${ph.context}` : ""}`;
export const photoFrameCredit = (ph) => `Photo: ${ph.artist}, ${ph.license} · ${photoNote(ph)}`;
const commonsShort = (u) => (u ? ` (${String(u).replace(/^https?:\/\//, "").replace(/\?.*$/, "")})` : "");
export const photoCaptionCredit = (ph) => `Photo: ${photoNote(ph)}. By ${ph.artist} via Wikimedia Commons${commonsShort(ph.source_page)}, ${ph.license}${ph.license_url ? ` (${ph.license_url.replace(/^https?:\/\//, "")})` : ""}; cropped, text added.${ph.sharealike ? ` This video is shared under ${ph.license} too.` : ""}`;
// What a reel is drawn over: an approved stock clip of the place, else the photo, else the brand teal.
export const noMedia = { clip: null, photo: null };
const mediaCredit = ({ clip, photo }) => (clip ? frameCredit(clip) : photo ? photoFrameCredit(photo) : null);
export const mediaCaptionCredit = ({ clip, photo }) => (clip ? captionCredit(clip) : photo ? photoCaptionCredit(photo) : null);

// ---------- frames (only card and post fields) ----------

const checkedShort = (s) => s.replace(/\b(Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]+/, "$1");
// The event's date for the opening chip, copied from its When line: "Sat Nov 21", "Tuesday, Nov 24",
// "Nov 20 to Jan 3". None when the line lists more dates than that (the facts frame shows them all).
const MONTH = "(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|June?|July?|Aug(?:ust)?|Sept?(?:ember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\\.?\\b";
const WEEKDAY = "(?:(?:Mon|Tue|Tues|Wed|Thu|Thur|Thurs|Fri|Sat|Sun)(?:day|nesday|sday|urday)?,? )?";
const DATE_RE = new RegExp(`${WEEKDAY}${MONTH} \\d{1,2}(?:(?: to | ?[-–] ?)(?:${MONTH} )?\\d{1,2})?`);
// Only a date that opens the line and ends at a comma, period, semicolon or the end ("Sat Nov 21, ..."),
// never one after "25 select nights," / "Daily" / "Through", and never when more dates follow
// ("Nov 21 and 22", "Nov 11, 16, 23", "...; closed Nov 26").
const LEAD_RE = new RegExp(`^${DATE_RE.source}(?=[,.;]|$)`);
export function dateChip(when) {
  const text = String(when).trim();
  const m = text.match(LEAD_RE);
  if (!m) return null;
  const rest = text.slice(m[0].length);
  // A bare day number next ("Nov 21 and 22", "Nov 11, 16, ...") means more dates; a time ("Nov 24, 11 a.m.") does not.
  if (/^,?\s*(?:and\s+)?\d{1,2}(?=\s*(?:,|and\b|\.|;|$))/.test(rest) || DATE_RE.test(rest)) return null;
  // A limit after the dates ("weekends only", "select nights", "closed ...") also means no chip.
  if (/\b(?:select|weekends?|weekdays?|only|except|closed|(?:mon|tues|wednes|thurs|fri|satur|sun)days)\b/i.test(rest)) return null;
  return m[0];
}
// "Free" in big letters only when the Cost line starts with a plain "Free." / "Free;" / "Free,".
export const isFree = (cost) => /^Free(?=[.;,]|$)/.test(String(cost).trim());
const splitTitle = (t) => { const i = t.indexOf(": "); return i > 0 ? [t.slice(0, i), t.slice(i + 2)] : [t, null]; };
// "Sesame Place Philadelphia 2027 season pass from $99.99" -> name "Sesame Place Philadelphia", offer the rest.
export function dealName(title) {
  const name = splitTitle(title)[0].replace(/\s+(?:20\d\d\b|season pass|annual pass|fun card|hotel stays?\b).*$/i, "");
  return { name, offer: title.slice(name.length).replace(/^[:\s]+/, "") || null };
}
const shortName = (n) => (n.length > 20 ? n.split(" ").slice(0, 2).join(" ") : n);
// A tip's "Good to know" line is dropped when the tip already says it ("Free Santa photos by day" vs "Free Santa photos 11 a.m. ...").
const sameStart = (a, b) => { const w = (s) => String(s).toLowerCase().replace(/[^a-z0-9 ]/g, "").split(/\s+/).slice(0, 3).join(" "); return Boolean(a && b) && w(a) === w(b); };

// Each frame's text, copied from the same record fields the image card and post use (social-queue.mjs).
export function reelContent(record) {
  if (record.kind === "deal") {
    const v = record.v2;
    const s = v.ss;
    const { name, offer } = dealName(v.title);
    return [
      { name: "hook", seconds: 3.2, tag: ["Deal check", shortName(name)], word: "Save about", big: usdS(s.save), pct: `(${s.pct}%)`, ww: [usdS(s.without), usdS(s.with)], meta: [`over ${s.unit}`, "family of 4", "estimate"], title: name, sub: offer, date: v.deadline_stated ? v.deadline : null },
      { name: "spend", seconds: 3.8, tag: ["Deal check", shortName(name)], rows: [["Without the deal", s.without], ["With the deal", s.with]], save: ["You save", s.save, `(${s.pct}%)`], basis: `Estimate for ${s.party}${s.sample_month ? `, ${s.sample_month} hotel price` : ""}. ${v.without_basis}` },
      { name: "catch", seconds: 3.2, tag: ["Deal check", shortName(name)], chip: v.verdict_label, worth: v.verdict_label === "Worth it", catch: v.lines[2], deadline: v.deadline_stated ? v.deadline_line : null },
      { name: "end", seconds: 2.6, key: [`Save about ${usdS(s.save)}`, v.deadline_stated ? v.deadline : null], page: [name, "deal check"], checked: `${checkedShort(v.checked)} Confirm before booking.` },
    ];
  }
  const [[, when], [, cost]] = record.lines;
  const free = isFree(cost);
  const [title, sub] = splitTitle(record.title);
  return [
    { name: "hook", seconds: 3.0, tag: ["Family event", record.city], word: free ? "Free" : null, title, sub, date: dateChip(when) },
    { name: "facts", seconds: 3.6, tag: [free ? "Free family event" : "Family event", record.city], rows: [["When", when], ["Cost", cost]] },
    { name: "tip", seconds: 3.2, tag: [free ? "Free family event" : "Family event", record.city], tip: record.catch, note: sameStart(record.family_chip, record.catch) ? null : record.family_chip },
    { name: "end", seconds: 2.6, key: [free ? "Free" : null, dateChip(when)], page: ["This week", "family events by city"], checked: `Checked ${checkedShort(shortDate(record.observed_on))} on the official page. Confirm before booking.` },
  ];
}

// Design System v1 tokens (docs/design/design-system.md), scaled for a 1080-wide phone video.
const TOKENS = `:root{--c-teal-900:#0b4946;--c-teal-700:#126c67;--c-mint-300:#8fd0c4;--c-mint-100:#e6f2f0;--c-sun-400:#f0bd56;--c-sun-100:#fff7e3;--c-save-700:#1f6b45;--c-save-100:#e6f4ea;--c-coral-100:#fbe9e3;--c-ink:#142029;--c-ink-muted:#43515a;--c-paper:#fffaf2;--c-surface:#ffffff;--c-line:#ded8cc;
--t-brand:44px;--t-tag:36px;--t-credit:30px;--t-wm:96px;
--k:1;--rt-xs:calc(40px*var(--k));--rt-sm:calc(44px*var(--k));--rt-base:calc(54px*var(--k));--rt-lg:calc(64px*var(--k));--rt-xl:calc(92px*var(--k));--rt-word:calc(96px*var(--k));--rt-num:calc(210px*var(--k));--rt-free:calc(300px*var(--k));
--s-3:12px;--s-4:16px;--s-5:24px;--s-6:32px;--s-7:48px;--r-md:28px;--r-pill:999px}`;

// Animation: every `.a` element slides up and fades in over ANIM_S seconds after its data-d delay; a
// `.pop` grows in instead; a `.count` counts up to its final number. The final state is in the HTML, so
// a frame without the script still shows the right text, and the hook's first video frame (the cover)
// is already complete: only its big figure pops.
export const INTRO_S = 0.7;
const ANIM_S = 0.35;
const tag = (t, anim = true) => `<p class="tag${anim ? ' a" data-d="0' : ""}"><span>${esc(t[0])}</span><span class="dot">·</span><span>${esc(t[1])}</span></p>`;
const count = (n) => `<span class="ap">≈</span> <span class="count" data-to="${n}" data-pre="$">${esc(usdS(n))}</span>`;
// Keeps "5:30 p.m." and "One-Day" whole when a line wraps.
const nb = (text) => esc(text).replace(/ (?=[ap]\.m\.)/g, "&nbsp;").replace(/(?<=[A-Za-z])-(?=[A-Z])/g, "\u2011");

function frameBody(f) {
  switch (f.name) {
    case "hook":
      if (f.big) {
        return `<div class="hookbox">${tag(f.tag, false)}<p class="word n">${esc(f.word)}</p><p class="big n pop"><span>${esc(f.big)}</span><span class="pct">${esc(f.pct)}</span></p>`
          + `<p class="ww n"><span class="lab">Without</span><span>${esc(f.ww[0])}</span><span class="arrow">→</span><span class="lab">with</span><span>${esc(f.ww[1])}</span></p>`
          + `<p class="meta">${f.meta.map((m) => `<span>${esc(m)}</span>`).join('<span class="dot">·</span>')}</p><p class="title n">${esc(f.title)}</p>${f.sub ? `<p class="sub">${esc(f.sub)}</p>` : ""}${f.date ? `<p class="date">${esc(f.date)}</p>` : ""}</div>`;
      }
      return `<div class="hookbox">${tag(f.tag, false)}${f.word ? `<p class="free n pop">${esc(f.word)}</p><p class="title n">${esc(f.title)}</p>${f.sub ? `<p class="sub">${esc(f.sub)}</p>` : ""}`
        : `${f.sub ? `<p class="title n">${esc(f.title)}</p><h1 class="n">${esc(f.sub)}</h1>` : `<h1 class="n">${esc(f.title)}</h1>`}`}${f.date ? `<p class="date">${esc(f.date)}</p>` : ""}</div>`;
    case "spend":
      return `${tag(f.tag)}<div class="card a" data-d="0.08">${f.rows.map(([k, n]) => `<div class="row"><p class="k">${esc(k)}</p><p class="v n">${count(n)}</p></div>`).join("")}`
        + `<div class="row saverow a" data-d="0.3"><p class="k">${esc(f.save[0])}</p><p class="v n">${count(f.save[1])} <span class="pct">${esc(f.save[2])}</span></p></div><p class="basis">${nb(f.basis)}</p></div>`;
    case "facts":
      return `${tag(f.tag)}<div class="card a" data-d="0.08">${f.rows.map(([k, v], i) => `<div class="row${i === f.rows.length - 1 ? " cost" : ""}"><p class="k">${esc(k)}</p><p class="v">${nb(v)}</p></div>`).join("")}</div>`;
    case "catch":
      return `${tag(f.tag)}<div class="card a" data-d="0.08"><p><span class="chip${f.worth ? " w" : ""}">${esc(f.chip)}</span></p><p class="catchline">${nb(f.catch)}</p>${f.deadline ? `<p class="when">${esc(f.deadline)}</p>` : ""}</div>`;
    case "tip":
      return `${tag(f.tag)}<div class="card a" data-d="0.08"><div class="row"><p class="k">Tip</p><p class="v">${nb(f.tip)}</p></div>${f.note ? `<p class="note"><b>Good to know</b>${esc(f.note)}</p>` : ""}</div>`;
    case "end":
      return `<div class="end">${LOGO_SVG.replace('width="64" height="64"', 'width="200" height="200" class="a pop" data-d="0"')}<p class="wm n a" data-d="0.05">family<b>tripwise</b></p>`
        + `${f.key.some(Boolean) ? `<p class="key n a" data-d="0.08">${f.key.filter(Boolean).map((k) => `<span>${esc(k)}</span>`).join('<span class="dot">·</span>')}</p>` : ""}`
        + `<p class="ask n a" data-d="0.12">Save this for your trip</p><p class="ask2 a" data-d="0.18">Send it to someone you'd go with</p>`
        + `<p class="cta a" data-d="0.24"><span class="chip us">Full check at familytripwise.com</span></p><p class="pagename a" data-d="0.28"><span>${esc(f.page[0])}</span><span class="dot">·</span><span>${esc(f.page[1])}</span></p><p class="checked a" data-d="0.32">${esc(f.checked)}</p></div>`;
    default:
      throw new Error(`unknown frame ${f.name}`);
  }
}

// One full-size frame. Over a photo or clip the page is transparent apart from a scrim (a bottom
// gradient on the opening frame, a fuller one behind the cards), so the photo shows through; with
// neither it sits on the brand teal. Content keeps x 64-900 (clear of the Reels like/comment column)
// and y 250-1570 (clear of the Reels header and caption); the wordmark and credit sit at fixed places.
export const CONTENT = { top: SAFE.top + 104, bottom: SAFE.bottom + 96 };
const framedHeight = (photo) => Math.round((W * photo.height) / photo.width / 2) * 2;
export function frameHtml(f, { clip = null, photo = null } = {}) {
  const media = Boolean(clip || photo);
  const credit = mediaCredit({ clip, photo });
  const hook = f.name === "hook";
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><style>${nunitoFace()}
${TOKENS}
*{box-sizing:border-box;margin:0}html,body{width:${W}px;height:${H}px;background:transparent;overflow:hidden}
body{font-family:"Nunito","DejaVu Sans",sans-serif;color:var(--c-surface);position:relative}
.n,h1{font-weight:800}
.bg{position:absolute;inset:0;background:radial-gradient(120% 70% at 30% 20%,var(--c-teal-700),var(--c-teal-900) 70%)}
.bg.m{background:linear-gradient(rgba(11,73,70,.35),rgba(11,73,70,.55) 40%,rgba(11,73,70,.70) 75%,rgba(11,73,70,.85))}
.bg.m.hook{background:linear-gradient(rgba(11,73,70,.45) 0,rgba(11,73,70,0) 16%,rgba(11,73,70,0) 60%,rgba(11,73,70,.6) 80%,rgba(11,73,70,.85))}
.hookscrim{position:absolute;left:0;right:0;bottom:0;top:${H}px;background:linear-gradient(rgba(11,73,70,0),rgba(11,73,70,.88) 200px,rgba(11,73,70,.94))}
.fade{position:absolute;left:0;right:0;background:linear-gradient(rgba(11,73,70,0),rgba(11,73,70,.95))}
.m-on .tag,.m-on .title,.m-on .sub,.m-on .meta,.m-on .word,.m-on .brand,.m-on .credit,.m-on .end p{text-shadow:0 2px 14px rgba(0,0,0,.55)}
.brand{position:absolute;top:${SAFE.top}px;left:${SAFE.left - 12}px;display:flex;align-items:center;gap:14px;font-size:var(--t-brand);font-weight:800;line-height:1;padding:8px 26px 8px 12px;border-radius:var(--r-pill)}.m-on .brand{background:rgba(11,73,70,.82)}.brand b{color:var(--c-mint-300)}
.safe{position:absolute;top:${CONTENT.top}px;bottom:${CONTENT.bottom}px;left:${SAFE.left}px;right:${SAFE.right}px;display:flex;flex-direction:column;justify-content:flex-start;gap:var(--s-6)}
.safe.hook{justify-content:flex-end}.safe.end{justify-content:center}
.tag{display:flex;flex-wrap:wrap;align-items:center;gap:0 14px;font-size:var(--t-tag);line-height:1.2;font-weight:800;letter-spacing:.03em;text-transform:uppercase;color:var(--c-sun-400)}
.dot{opacity:.8}.tag{align-self:flex-start;padding:8px 24px;border-radius:var(--r-pill);margin-left:-24px}.m-on .tag{background:rgba(11,73,70,.88)}
.hookbox{display:flex;flex-direction:column;gap:var(--s-4)}
.word{font-size:var(--rt-word);line-height:.95;text-transform:uppercase;letter-spacing:.01em}
.big{font-size:var(--rt-num);line-height:.95;color:var(--c-sun-400);display:flex;flex-wrap:wrap;align-items:baseline;gap:0 24px;text-shadow:0 4px 24px rgba(0,0,0,.45);transform-origin:left bottom}.big>span{white-space:nowrap}.big .pct{font-size:.34em;color:var(--c-surface)}
.free{font-size:var(--rt-free);line-height:.9;color:var(--c-sun-400);text-transform:uppercase;letter-spacing:.02em;text-shadow:0 4px 28px rgba(0,0,0,.45);transform-origin:left bottom}
.meta{display:flex;flex-wrap:wrap;gap:0 14px;font-size:var(--rt-xs);font-weight:700;color:var(--c-mint-100)}
.title{font-size:calc(72px*var(--k));line-height:1.1;text-wrap:balance;margin-top:var(--s-3)}
h1{font-size:var(--rt-xl);line-height:1.06;text-wrap:balance;text-shadow:0 2px 18px rgba(0,0,0,.45)}
.sub{font-size:var(--rt-sm);line-height:1.2;font-weight:600;color:var(--c-mint-100);text-wrap:balance}.sub::first-letter{text-transform:uppercase}
.ww{display:flex;flex-wrap:wrap;align-items:baseline;gap:0 16px;font-size:calc(60px*var(--k));line-height:1.1}.ww .lab{font-size:.62em;font-weight:700;color:var(--c-mint-100)}.ww .arrow{color:var(--c-sun-400)}
.ap{font-size:.55em;vertical-align:.15em}
.date{align-self:flex-start;margin-top:var(--s-4);background:var(--c-sun-400);color:var(--c-ink);font-size:var(--rt-base);font-weight:800;padding:10px 32px;border-radius:var(--r-pill)}
.card{background:var(--c-surface);color:var(--c-ink);border-radius:var(--r-md);padding:var(--s-6) 40px;box-shadow:0 8px 40px rgba(20,32,41,.3)}
.row{padding:var(--s-5) 0;border-bottom:4px solid var(--c-line)}.row:last-child{border-bottom:0}
.k{font-size:var(--rt-xs);font-weight:800;text-transform:uppercase;letter-spacing:.05em;color:var(--c-ink-muted)}
.v{font-size:var(--rt-lg);line-height:1.22;margin-top:6px;font-weight:800}
.spend .row .v{font-size:var(--rt-xl);line-height:1.1}.v .pct{font-size:.5em}
.saverow{background:var(--c-save-100);border:0;border-radius:20px;padding:var(--s-5) 28px;margin-top:var(--s-4);color:var(--c-save-700)}.saverow .k{color:var(--c-save-700)}
.basis{font-size:var(--rt-xs);line-height:1.3;color:var(--c-ink-muted);margin-top:var(--s-5);font-weight:600}
.facts .v{font-weight:600;font-size:var(--rt-base);line-height:1.28}.facts .cost .v{font-weight:700}
.chip{display:inline-block;background:var(--c-sun-100);border:4px solid var(--c-sun-400);color:var(--c-ink);font-weight:800;font-size:var(--rt-sm);padding:10px 30px;border-radius:var(--r-pill)}
.chip.w{background:var(--c-save-100);border-color:var(--c-save-700);color:var(--c-save-700)}
.catchline{font-size:var(--rt-lg);line-height:1.25;margin-top:var(--s-6);font-weight:800}
.when{font-size:var(--rt-base);line-height:1.3;margin-top:var(--s-6);font-weight:800;padding-top:var(--s-5);border-top:4px solid var(--c-line)}
.tip .v{font-size:var(--rt-lg);line-height:1.25}
.note{margin-top:var(--s-5);background:var(--c-sun-100);border-left:14px solid var(--c-sun-400);border-radius:20px;padding:var(--s-5) 30px;font-size:var(--rt-base);line-height:1.25;font-weight:700}
.note b{display:block;font-size:var(--rt-xs);text-transform:uppercase;letter-spacing:.05em;color:var(--c-ink-muted);margin-bottom:6px}
.end{display:flex;flex-direction:column;align-items:center;text-align:center;gap:var(--s-5)}
.bg.m.endbg{background:radial-gradient(60% 40% at 50% 50%,rgba(11,73,70,.9),rgba(11,73,70,.7) 75%,rgba(11,73,70,.55))}
.end svg{transform-origin:center}
.wm{font-size:var(--t-wm);line-height:1}.wm b{color:var(--c-mint-300)}
.ask{font-size:var(--rt-lg);line-height:1.15;margin-top:var(--s-4)}.ask2{font-size:var(--rt-base);line-height:1.2;font-weight:700;color:var(--c-mint-100);text-wrap:balance;max-width:780px}
.key{display:flex;flex-wrap:wrap;justify-content:center;gap:0 14px;font-size:var(--rt-lg);color:var(--c-sun-400)}
.chip.us{font-size:var(--rt-sm);padding:12px 32px;white-space:nowrap}
.pagename{display:flex;flex-wrap:wrap;justify-content:center;gap:0 12px;font-size:var(--rt-sm);font-weight:800;color:var(--c-sun-400)}
.checked{font-size:var(--rt-xs);color:var(--c-mint-100);line-height:1.3;font-weight:600}
.credit{position:absolute;left:${SAFE.left}px;right:${SAFE.right}px;bottom:${SAFE.bottom}px;font-size:var(--t-credit);line-height:1.25;font-weight:500;color:var(--c-mint-100);opacity:.9}
.count{display:inline-block}
</style></head><body${media ? ' class="m-on"' : ""}>
<div class="bg${media ? " m" : ""}${hook ? " hook" : ""}${f.name === "end" ? " endbg" : ""}"></div>
${media && hook ? '<div class="hookscrim" id="hs"></div>' : ""}
${f.name === "end" ? "" : `<p class="brand">${LOGO_SVG.replace('width="64" height="64"', 'width="60" height="60"')}<span>family<b>tripwise</b></span></p>`}
${photo?.mode === "framed" ? `<div class="fade" style="top:${framedHeight(photo) - 420}px;height:440px"></div>` : ""}
<div class="safe ${f.name}" id="safe">${frameBody(f)}</div>
${credit ? `<p class="credit">${esc(credit)}</p>` : ""}
<script>{const s=document.getElementById("safe"),r=document.documentElement;
const fits=()=>s.scrollHeight<=s.clientHeight+1&&s.scrollWidth<=s.clientWidth+1&&document.body.scrollWidth<=${W};
// Shrink type until everything fits the content area; the renderer refuses a frame that still overflows.
let k=1;r.style.setProperty("--k",k);while(!fits()&&k>0.72){k-=0.02;r.style.setProperty("--k",k);}
document.body.dataset.fits=fits()?"yes":"no";
// The opening text gets its own dark backing that starts just above it, however tall it is.
const hs=document.getElementById("hs");if(hs)hs.style.top=(s.firstElementChild.getBoundingClientRect().top-180)+"px";
// Numbers keep their final width while they count, so nothing reflows.
document.querySelectorAll(".count").forEach((c)=>{c.style.minWidth=c.getBoundingClientRect().width+"px";});
const ease=(x)=>1-Math.pow(1-Math.min(1,Math.max(0,x)),3);
window.setT=(ts)=>{
  document.querySelectorAll(".a").forEach((el)=>{const e=ease((ts-Number(el.dataset.d||0))/${ANIM_S});
    el.style.opacity=String(e);el.style.transform=el.classList.contains("pop")?"scale("+(0.6+0.4*e)+")":"translateY("+Math.round((1-e)*60)+"px)";});
  document.querySelectorAll(".pop:not(.a)").forEach((el)=>{const e=ease(ts/${ANIM_S});el.style.transform="scale("+(0.9+0.1*e)+")";});
  document.querySelectorAll(".count").forEach((el)=>{const e=ease(ts/0.6);const n=Math.round(Number(el.dataset.to)*e);el.textContent=el.dataset.pre+n.toLocaleString("en-US");});
};}</script>
</body></html>`;
}

export const reelFrames = (record, media = noMedia) => reelContent(record).map((f) => ({ name: f.name, seconds: f.seconds, html: frameHtml(f, media) }));
export const reelSeconds = (frames) => Math.round(frames.reduce((a, f) => a + f.seconds, 0) * 100) / 100;

// The file name carries a hash of everything drawn and how it is encoded, like the cards.
export function reelHash(record, { clip = null, photo = null } = noMedia) {
  const clipKey = clip ? { id: clip.id, download_url: clip.download_url, start_s: clip.start_s ?? 0, crop_x: clip.crop_x ?? 0.5 } : null;
  const photoKey = photo ? { slug: photo.slug, file: photo.file, bytes: photo.bytes, width: photo.width, height: photo.height, crop_x: photo.crop_x, crop_y: photo.crop_y, mode: photo.mode } : null;
  return createHash("sha256").update(JSON.stringify({ v: REEL_VERSION, W, H, FPS, INTRO_S, frames: reelFrames(record, { clip, photo }).map((f) => [f.seconds, f.html]), clip: clipKey, photo: photoKey })).digest("hex").slice(0, 10);
}
export function reelPaths(entry, record, media = noMedia) {
  const name = `${entry.id}-${reelHash(record, media)}`;
  return { mp4: `site/${REEL_DIR}/${name}.mp4`, jpg: `site/${REEL_DIR}/${name}.jpg`, url: `${SITE}/${REEL_DIR}/${name}.mp4`, poster_url: `${SITE}/${REEL_DIR}/${name}.jpg` };
}

// ---------- posting check (used by tools/social-post.mjs) ----------

// The reel to send for this entry and platform, or null (post the image as before). A reel is used only
// when the operator turned the feature on for the platform, the entry is reel-eligible, its recorded
// reel file is the one the current record would render (same hash, so no stale figure), the file exists,
// a recorded clip or photo is still approved for this place, and the caption with the credit (and, on
// Facebook, the link appended after it) fits.
export const CAPTION_MAX = { instagram: 2200, facebook: 2000 };
export function reelForPost({ entry, platform, config, record, clips = [], photoFor = reelPhoto, exists = (p) => existsSync(join(root, p)) }) {
  if (config?.enabled !== true || !REEL_PLATFORMS.includes(platform) || !(config.platforms ?? []).includes(platform)) return null;
  const r = entry?.reel;
  if (!r || !entry.platforms?.[platform] || !reelEligible(entry, record)) return null;
  const clip = r.clip ? clips.find((c) => c.id === r.clip) ?? null : null;
  if (r.clip && !clipMatches(record, clip)) return null;
  const photo = !r.clip && r.photo ? photoFor(record) : null;
  if (r.photo && !r.clip && photo?.slug !== r.photo) return null;
  const want = reelPaths(entry, record, { clip, photo });
  if (r.path !== want.mp4 || r.url !== want.url || !exists(r.path)) return null;
  if (!(r.seconds >= MIN_SECONDS && r.seconds <= MAX_SECONDS)) return null;
  const credit = mediaCaptionCredit({ clip, photo });
  const v = entry.platforms[platform];
  const length = v.text.length + (credit ? credit.length + 2 : 0) + (platform === "facebook" ? (v.link?.length ?? 0) + 2 : 0);
  if (length > CAPTION_MAX[platform]) return null;
  return { url: want.url, credit, seconds: r.seconds, clip: clip?.id ?? null, photo: photo?.slug ?? null };
}

// ---------- rendering ----------

function sh(cmd, args) {
  const p = spawnSync(cmd, args, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  if (p.status !== 0) throw new Error(`${cmd} failed (${p.status}): ${(p.stderr || p.stdout || "").slice(-1500)}`);
  return p.stdout;
}
const probe = (file) => JSON.parse(sh("ffprobe", ["-v", "error", "-show_entries", "format=duration,size:stream=codec_type,codec_name,width,height", "-of", "json", file]));

// Cuts one clip segment from its download_url into the cache, already cropped to 9:16 and 30 fps.
export const clipCacheFile = (clip) => join(clipCacheDir(), `${clip.id}-${createHash("sha256").update(JSON.stringify([clip.download_url, clip.start_s ?? 0, clip.crop_x ?? 0.5])).digest("hex").slice(0, 8)}.mp4`);
export function fetchClip(clip, seconds = MAX_SECONDS + 2) {
  const out = clipCacheFile(clip);
  if (existsSync(out)) return out;
  mkdirSync(dirname(out), { recursive: true });
  const tmp = `${out.slice(0, -4)}.part.mp4`;
  const cx = clip.crop_x ?? 0.5;
  sh("ffmpeg", ["-v", "error", "-y", "-user_agent", UA, "-ss", String(clip.start_s ?? 0), "-t", String(Math.min(seconds, clip.duration_s ?? seconds)), "-i", clip.download_url, "-an",
    "-vf", `scale=-2:${H}:flags=lanczos,crop=${W}:${H}:(iw-${W})*${cx}:0,fps=${FPS},format=yuv420p`, "-c:v", "libx264", "-preset", "veryfast", "-crf", "18", tmp]);
  renameSync(tmp, out);
  return out;
}

// The moving background: the photo with a slow push-in (Ken Burns) over the whole reel, or, in framed
// mode, the photo full-width near the top over a blurred, darkened copy of itself.
function photoFilter(photo, input, n) {
  const zoom = `zoompan=z='1+0.07*on/${n}':x='iw/2-iw/zoom/2':y='ih/2-ih/zoom/2':d=1`;
  if (photo.mode === "full") {
    return `[${input}:v]scale=${W * 2}:${H * 2}:force_original_aspect_ratio=increase:flags=lanczos,crop=${W * 2}:${H * 2}:(iw-ow)*${photo.crop_x}:(ih-oh)*${photo.crop_y},${zoom}:s=${W}x${H}:fps=${FPS},setsar=1,format=yuv420p[bg]`;
  }
  const fh = framedHeight(photo);
  return `[${input}:v]split[pa][pb];[pa]scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H},boxblur=60:3,eq=brightness=-0.3:saturation=0.6,setsar=1[blur];`
    + `[pb]scale=${W * 2}:${fh * 2}:flags=lanczos,${zoom}:s=${W}x${fh}:fps=${FPS},setsar=1[fg];[blur][fg]overlay=0:0:shortest=1,format=yuv420p[bg]`;
}

// Screenshots each frame with headless Chromium (refusing any frame whose text does not fit) at every
// animation step and its final state, then assembles with ffmpeg: one overlay stream over the moving
// photo or clip, a silent AAC track, H.264, faststart, at most 8 MB.
export async function renderReel({ record, clip = null, clipFile = null, photo = null, mp4, jpg, stillsDir = null, log = console.log }) {
  if (clip) photo = null;
  const frames = reelFrames(record, { clip, photo });
  const T = reelSeconds(frames);
  if (T < MIN_SECONDS || T > MAX_SECONDS) throw new Error(`reel length ${T}s outside ${MIN_SECONDS}-${MAX_SECONDS}s`);
  const work = mkdtempSync(join(tmpdir(), "reel-"));
  try {
    const steps = Math.round(INTRO_S * FPS);
    const list = [];
    const { chromium } = createRequire(import.meta.url)("playwright");
    const browser = await chromium.launch();
    try {
      for (const [i, f] of frames.entries()) {
        const page = await browser.newPage({ viewport: { width: W, height: H } });
        await page.setContent(f.html, { waitUntil: "load" });
        await page.evaluate(() => document.fonts.ready);
        if ((await page.evaluate(() => document.body.dataset.fits)) !== "yes") throw new Error(`frame ${f.name} of ${record.id}: text does not fit the content area`);
        const n = Math.round(f.seconds * FPS);
        for (let s = 0; s <= steps; s += 1) {
          await page.evaluate((ts) => window.setT(ts), s / FPS);
          const file = join(work, `f${i}-${String(s).padStart(3, "0")}.png`);
          await page.screenshot({ path: file, omitBackground: Boolean(clip || photo), clip: { x: 0, y: 0, width: W, height: H } });
          list.push([file, s < steps ? 1 : n - steps]);
        }
        await page.close();
      }
    } finally { await browser.close(); }
    // concat demuxer: each step one video frame, each final state the rest of its frame's time.
    const concat = join(work, "frames.txt");
    writeFileSync(concat, `${list.map(([file, k]) => `file '${file}'\nduration ${(k / FPS).toFixed(6)}`).join("\n")}\nfile '${list.at(-1)[0]}'\n`);
    const N = Math.round(T * FPS);
    const args = ["-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", concat];
    if (clip) args.push("-stream_loop", "-1", "-i", clipFile);
    else if (photo) args.push("-loop", "1", "-framerate", String(FPS), "-t", String(T), "-i", join(root, photo.file));
    args.push("-f", "lavfi", "-t", String(T), "-i", "anullsrc=channel_layout=stereo:sample_rate=48000");
    const audioIndex = clip || photo ? 2 : 1;
    const parts = [`[0:v]fps=${FPS},trim=end_frame=${N},setpts=N/(${FPS}*TB),format=rgba[ov]`];
    if (clip) parts.push(`[1:v]fps=${FPS},trim=end_frame=${N},setpts=N/(${FPS}*TB),scale=${W}:${H},zoompan=z='1+0.06*on/${N}':x='iw/2-iw/zoom/2':y='ih/2-ih/zoom/2':d=1:s=${W}x${H}:fps=${FPS},format=yuv420p[bg]`);
    else if (photo) parts.push(photoFilter(photo, 1, N));
    parts.push(clip || photo ? `[bg][ov]overlay=format=auto:shortest=1,format=yuv420p[v]` : `[ov]format=yuv420p[v]`);
    mkdirSync(dirname(mp4), { recursive: true });
    const tmp = join(work, "out.mp4");
    let size = Infinity;
    for (const crf of [20, 24, 28]) {
      sh("ffmpeg", [...args, "-filter_complex", parts.join(";"), "-map", "[v]", "-map", `${audioIndex}:a`, "-t", String(T),
        "-c:v", "libx264", "-preset", "medium", "-profile:v", "high", "-pix_fmt", "yuv420p", "-r", String(FPS), "-g", String(FPS * 2), "-crf", String(crf), "-maxrate", "4500k", "-bufsize", "9000k",
        "-c:a", "aac", "-b:a", "64k", "-ar", "48000", "-movflags", "+faststart", tmp]);
      size = statSync(tmp).size;
      if (size <= MAX_BYTES) break;
    }
    if (size > MAX_BYTES) throw new Error(`reel is ${size} bytes, over ${MAX_BYTES}`);
    const info = probe(tmp);
    const v = info.streams.find((s) => s.codec_type === "video");
    const a = info.streams.find((s) => s.codec_type === "audio");
    const dur = Number(info.format.duration);
    if (v?.codec_name !== "h264" || v.width !== W || v.height !== H || a?.codec_name !== "aac" || !(dur >= MIN_SECONDS && dur <= MAX_SECONDS + 0.2)) throw new Error(`unexpected output: ${JSON.stringify(info)}`);
    // The poster is the opening frame once its big figure has popped in.
    sh("ffmpeg", ["-v", "error", "-y", "-ss", "1.0", "-i", tmp, "-frames:v", "1", "-q:v", "3", join(work, "poster.jpg")]);
    // Write under temporary names, then rename, so a stopped render never leaves a short file behind.
    mkdirSync(dirname(jpg), { recursive: true });
    // Copy beside the target then rename there (the temp folder may be on another disk).
    const place = (from, to) => { const part = `${to}.part`; copyFileSync(from, part); renameSync(part, to); };
    place(join(work, "poster.jpg"), jpg);
    place(tmp, mp4);
    if (stillsDir) {
      mkdirSync(stillsDir, { recursive: true });
      let start = 0;
      frames.forEach((f, i) => {
        sh("ffmpeg", ["-v", "error", "-y", "-ss", (start + Math.max(1.0, f.seconds / 2)).toFixed(2), "-i", mp4, "-frames:v", "1", "-q:v", "2", join(stillsDir, `${basename(mp4, ".mp4")}-still${i + 1}-${f.name}.jpg`)]);
        start += f.seconds;
      });
      sh("ffmpeg", ["-v", "error", "-y", "-ss", "0", "-i", mp4, "-frames:v", "1", "-q:v", "2", join(stillsDir, `${basename(mp4, ".mp4")}-still0-first-frame.jpg`)]);
    }
    log(`rendered ${mp4} (${T}s, ${(size / 1048576).toFixed(2)} MB, ${clip ? `clip ${clip.id}` : photo ? `photo ${photo.slug} (${photo.mode})` : "cards only"})`);
    return { seconds: T, bytes: size };
  } finally { rmSync(work, { recursive: true, force: true }); }
}

// The clip to draw for a record, only if its segment is already in the cache; else its photo; else cards only.
function mediaWithFile(record, clips, log, photoFor = reelPhoto) {
  const clip = clipFor(record, clips);
  if (clip) {
    const file = clipCacheFile(clip);
    if (existsSync(file)) return { clip, clipFile: file, photo: null };
    log(`clip ${clip.id} matches ${record.id} but is not in the cache (run --fetch-clips); using the photo instead`);
  }
  const photo = photoFor(record);
  if (photo && !existsSync(join(root, photo.file))) { log(`photo ${photo.slug} file ${photo.file} is missing; rendering cards only`); return { clip: null, clipFile: null, photo: null }; }
  return { clip: null, clipFile: null, photo };
}

// Old reels leave site/ once their queue day is two days past (posts are made the same day).
export const PRUNE_AFTER_DAYS = 2;
export function pruneReels(date, { dir = join(root, "site", REEL_DIR), log = console.log } = {}) {
  if (!existsSync(dir)) return [];
  const cutoff = new Date(`${date}T12:00:00Z`);
  cutoff.setUTCDate(cutoff.getUTCDate() - PRUNE_AFTER_DAYS);
  const before = cutoff.toISOString().slice(0, 10);
  const gone = readdirSync(dir).filter((f) => /^\d{4}-\d{2}-\d{2}-.+\.(mp4|jpg)$/.test(f) && f.slice(0, 10) < before);
  for (const f of gone) rmSync(join(dir, f), { force: true });
  if (gone.length) log(`pruned ${gone.length} old reel file(s) before ${before}`);
  return gone;
}

// Render the day's reel and record it on its queue entry; other entries lose any stale reel field.
export async function reelsForDate(date, { records = sourceRecords(), clips = readClips(), photoFor = reelPhoto, log = console.log } = {}) {
  const queue = readQueue(date);
  if (!queue) throw new Error(`No ops/social-queue/${date}.json; run node tools/social-queue.mjs ${date} first`);
  const byId = new Map(records.map((r) => [r.id, r]));
  const pick = pickReelEntry(queue, records);
  let changed = false;
  for (const e of queue.entries) if (e !== pick && e.reel) { delete e.reel; changed = true; }
  if (pick) {
    const record = byId.get(pick.item_id);
    const { clip, clipFile, photo } = mediaWithFile(record, clips, log, photoFor);
    const p = reelPaths(pick, record, { clip, photo });
    let seconds = reelSeconds(reelFrames(record, { clip, photo }));
    if (existsSync(join(root, p.mp4)) && existsSync(join(root, p.jpg))) log(`kept ${p.mp4}`);
    else ({ seconds } = await renderReel({ record, clip, clipFile, photo, mp4: join(root, p.mp4), jpg: join(root, p.jpg), log }));
    const reel = { path: p.mp4, url: p.url, poster_url: p.poster_url, width: W, height: H, seconds, clip: clip?.id ?? null, photo: photo?.slug ?? null, credit: mediaCaptionCredit({ clip, photo }) };
    if (JSON.stringify(pick.reel) !== JSON.stringify(reel)) { pick.reel = reel; changed = true; }
  } else log(`no reel-eligible entry with Instagram or Facebook on ${date}`);
  if (changed) writeFileSync(join(queueDir, `${date}.json`), `${JSON.stringify(queue, null, 2)}\n`);
  pruneReels(date, { log });
  return { entry: pick?.id ?? null, changed };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const args = process.argv.slice(2);
  const opt = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };
  if (args[0] === "--fetch-clips") {
    let failed = 0;
    for (const clip of readClips().filter((c) => c.status === "approved")) {
      try { console.log(`cached ${clip.id}: ${fetchClip(clip)}`); } catch (err) { failed += 1; console.error(`could not fetch ${clip.id}: ${err.message.slice(0, 300)}`); }
    }
    process.exit(failed ? 1 : 0);
  } else if (opt("--item")) {
    const out = opt("--out");
    if (!out) throw new Error("--item needs --out <dir> (review samples never go into site/ or the queue)");
    const date = opt("--date") ?? new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York" }).format(new Date());
    const record = sourceRecords().find((r) => r.id === opt("--item"));
    if (!record) throw new Error(`no verified record ${opt("--item")}`);
    const entry = { id: `${date}-${record.id}`, item_id: record.id, kind: record.kind, platforms: { instagram: {} } };
    if (!reelEligible(entry, record)) throw new Error(`${record.id} is not reel-eligible (event with a catch line, or a real deal with a spend-vs-save card)`);
    let { clip, clipFile, photo } = mediaWithFile(record, readClips(), console.log);
    if (args.includes("--no-photo")) photo = null;
    if (opt("--test-clip")) {
      clip = { id: "test-clip", author: "TEST CLIP", source_name: "generated test pattern", licence: { name: "not for publishing", url: "https://familytripwise.com/" }, shows_short: "layout check only" };
      clipFile = opt("--test-clip");
      photo = null;
    }
    const p = reelPaths(entry, record, { clip, photo });
    await renderReel({ record, clip, clipFile, photo, mp4: join(out, basename(p.mp4)), jpg: join(out, basename(p.jpg)), stillsDir: args.includes("--stills") ? out : null });
    const credit = mediaCaptionCredit({ clip, photo });
    if (credit) console.log(`caption credit: ${credit}`);
  } else {
    const date = args[0];
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date ?? "")) throw new Error("usage: node tools/social-reels.mjs YYYY-MM-DD | --item <record-id> --out <dir> [--stills] [--no-photo] | --fetch-clips");
    const { entry, changed } = await reelsForDate(date);
    console.log(entry ? `reel entry ${entry}${changed ? " (queue updated)" : " (queue unchanged)"}` : "no reel today");
  }
}

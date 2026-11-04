// Reels v1 (QUEUE G17, OWNER D38): a short vertical video made only from our own designed cards and
// verified record fields, optionally over a credited free-licence stock clip of the entry's own place.
// Never AI video or images of real places, no AI voice, no reposted promotional art, no music (v1 is
// silent), and no figure that is not already on the entry's image card or in its post.
//
// Usage:
//   node tools/social-reels.mjs YYYY-MM-DD
//       Picks the day's reel entry (at most one: a holiday/event entry or a real-deal entry that carries
//       Instagram, else Facebook), renders site/social/reels/<entry-id>-<hash>.mp4 and a poster JPG, and
//       records `reel` on that queue entry. Idempotent: an existing file with the same hash is kept.
//   node tools/social-reels.mjs --item <record-id> --out <dir> [--date YYYY-MM-DD] [--stills] [--test-clip <file>]
//       Review sample for any record: renders into <dir> only (never the queue or site/), with 4 stills.
//       --test-clip overlays a local test video labelled "TEST CLIP" to review the stock-clip layout.
//   node tools/social-reels.mjs --fetch-clips
//       Cuts each approved clip segment from its download_url into the local clip cache (needs network).
//
// Posting uses a reel only when ops/media/reels.json says {"enabled": true} for that platform and the
// entry's reel still matches its record (tools/social-post.mjs, reelForPost). Off by default.
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, renameSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { LOGO_SVG, SITE, esc, nunitoFace, queueDir, readQueue, root, shareable, shortDate, sourceRecords, usdS } from "./social-queue.mjs";

export const REEL_VERSION = 1; // bump when the frame design or encoding changes (new hashes, new files)
export const W = 1080;
export const H = 1920;
export const FPS = 30;
export const XFADE = 0.5; // seconds of cross-fade between frames
export const MIN_SECONDS = 8;
export const MAX_SECONDS = 14;
export const MAX_BYTES = 8 * 1024 * 1024;
// Instagram's Reels UI covers the top ~250 px (header, camera) and the bottom ~350 px (caption, audio
// row); the like/comment column sits on the right. Key text stays inside these margins.
export const SAFE = { top: 250, bottom: 350, left: 72, right: 112 };
export const REEL_DIR = "social/reels"; // under site/, so Zernio gets a public HTTPS URL
export const REEL_PLATFORMS = ["instagram", "facebook"];
export const CLIPS_PATH = join(root, "ops/media/stock-clips.json");
export const CONFIG_PATH = join(root, "ops/media/reels.json");
// Free licences we accept for stock clips (exact names as recorded in ops/media/stock-clips.json).
export const ALLOWED_LICENCES = ["CC0 1.0", "Public domain", "CC BY 2.0", "CC BY 3.0", "CC BY 4.0", "CC BY-SA 3.0", "CC BY-SA 4.0", "Pexels License"];
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

// ---------- frames (only card and post fields) ----------

const checkedShort = (s) => s.replace(/\b(Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]+/, "$1");
// Each frame's text, copied from the same record fields the image card and post use (social-queue.mjs).
export function reelContent(record) {
  if (record.kind === "deal") {
    const v = record.v2;
    const s = v.ss;
    return [
      { name: "hook", seconds: 3.2, eyebrow: record.kicker, saveKey: `You save over ${s.unit} · family of 4`, big: `≈ ${usdS(s.save)}`, pct: `(${s.pct}%)`, place: v.lines[0] },
      { name: "spend", seconds: 3.6, eyebrow: record.kicker, rows: [["Without the deal", `≈ ${usdS(s.without)}`], ["With the deal", `≈ ${usdS(s.with)}`]], save: [`You save`, `≈ ${usdS(s.save)} (${s.pct}%)`], basis: `Estimate for ${s.party}${s.sample_month ? `, ${s.sample_month} hotel price` : ""}. ${v.without_basis}` },
      { name: "catch", seconds: 3.6, eyebrow: record.kicker, chip: v.verdict_label, worth: v.verdict_label === "Worth it", catch: v.lines[2], deadline: v.deadline_line, soft: !v.deadline_stated },
      { name: "end", seconds: 2.6, checked: `${checkedShort(v.checked)} Confirm before booking.` },
    ];
  }
  const [[, when], [, cost]] = record.lines;
  return [
    { name: "hook", seconds: 3.2, eyebrow: record.kicker, title: record.title },
    { name: "facts", seconds: 3.6, eyebrow: record.kicker, rows: [["When", when], ["Cost", cost]] },
    { name: "tip", seconds: 3.6, eyebrow: record.kicker, tip: record.catch, note: record.family_chip },
    { name: "end", seconds: 2.6, checked: `Checked ${checkedShort(shortDate(record.observed_on))} on the official page. Confirm before booking.` },
  ];
}

// Design System v1 tokens (docs/design/design-system.md), scaled for a 1080-wide phone video.
const TOKENS = `:root{--c-teal-900:#0b4946;--c-teal-700:#126c67;--c-mint-300:#8fd0c4;--c-mint-100:#e6f2f0;--c-sun-400:#f0bd56;--c-sun-100:#fff7e3;--c-save-700:#1f6b45;--c-save-100:#e6f4ea;--c-coral-100:#fbe9e3;--c-ink:#142029;--c-ink-muted:#43515a;--c-paper:#fffaf2;--c-surface:#ffffff;--c-line:#ded8cc;
--k:1;--rt-xs:calc(32px*var(--k));--rt-sm:calc(40px*var(--k));--rt-base:calc(54px*var(--k));--rt-lg:calc(64px*var(--k));--rt-xl:calc(92px*var(--k));--rt-num:calc(160px*var(--k));
--s-3:12px;--s-4:16px;--s-5:24px;--s-6:32px;--s-7:48px;--r-md:28px;--r-pill:999px}`;

function frameBody(f) {
  const rows = (list, cls = "") => list.map(([k, v], i) => `<div class="row${cls && i === list.length - 1 ? ` ${cls}` : ""}"><p class="k">${esc(k)}</p><p class="v">${esc(v)}</p></div>`).join("");
  const eyebrow = `<p class="eyebrow">${esc(f.eyebrow)}</p>`;
  switch (f.name) {
    case "hook":
      return f.big
        ? `<p class="eyebrow">${esc(f.eyebrow)}</p><div class="save"><p class="k">${esc(f.saveKey)}</p><p class="big n">${esc(f.big)} <span class="pct">${esc(f.pct)}</span></p><p class="est">estimate</p></div><p class="place n">${esc(f.place)}</p>`
        : `<p class="eyebrow">${esc(f.eyebrow)}</p><h1 class="n">${esc(f.title)}</h1>`;
    case "spend":
      return `${eyebrow}<div class="card">${rows(f.rows)}<div class="row saverow"><p class="k">${esc(f.save[0])}</p><p class="v n">${esc(f.save[1])}</p></div><p class="basis">${esc(f.basis)}</p></div>`;
    case "facts":
      return `${eyebrow}<div class="card">${rows(f.rows, "cost")}</div>`;
    case "catch":
      return `${eyebrow}<div class="card"><p><span class="chip${f.worth ? " w" : ""}">${esc(f.chip)}</span></p><p class="catch">${esc(f.catch)}</p><p class="when${f.soft ? " soft" : ""}">${esc(f.deadline)}</p></div>`;
    case "tip":
      return `${eyebrow}<div class="card"><div class="row"><p class="k">Tip</p><p class="v">${esc(f.tip)}</p></div><p class="note"><b>Good to know</b>${esc(f.note)}</p></div>`;
    case "end":
      return `<div class="end">${LOGO_SVG.replace('width="64" height="64"', 'width="240" height="240"')}<p class="wm n">family<b>tripwise</b></p><p class="cta n">Details: link in bio<span class="sep"> · </span><br>familytripwise.com</p><p class="chip us">Checked for US families</p><p class="checked">${esc(f.checked)}</p></div>`;
    default:
      throw new Error(`unknown frame ${f.name}`);
  }
}

// One full-size frame. With a clip the page is transparent apart from a dark brand gradient, so the
// clip shows through; without one it sits on the brand teal.
export function frameHtml(f, { clip = null } = {}) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><style>${nunitoFace()}
${TOKENS}
*{box-sizing:border-box;margin:0}html,body{width:${W}px;height:${H}px;background:transparent;overflow:hidden}
body{font-family:"DejaVu Sans","Liberation Sans",Arial,sans-serif;color:var(--c-surface);position:relative}
.n,h1{font-family:"Nunito","DejaVu Sans",sans-serif;font-weight:800}
.bg{position:absolute;inset:0;background:radial-gradient(120% 70% at 30% 20%,var(--c-teal-700),var(--c-teal-900) 70%)}
.bg.clip{background:linear-gradient(rgba(11,73,70,.78),rgba(11,73,70,.62) 35%,rgba(11,73,70,.72) 60%,rgba(11,73,70,.92) 85%)}
.clipped .eyebrow,.clipped .cta,.clipped .wm,.clipped .checked{text-shadow:0 2px 12px rgba(0,0,0,.6)}
.safe{position:absolute;top:${SAFE.top}px;bottom:${SAFE.bottom + (clip ? 70 : 0)}px;left:${SAFE.left}px;right:${SAFE.right}px;display:flex;flex-direction:column;justify-content:center;gap:var(--s-6)}
.eyebrow{font-size:var(--rt-sm);font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:var(--c-sun-400)}
h1{font-size:var(--rt-xl);line-height:1.1;text-wrap:balance;text-shadow:0 2px 14px rgba(0,0,0,.35)}
.place{font-size:var(--rt-lg);line-height:1.18;text-wrap:balance;text-shadow:0 2px 14px rgba(0,0,0,.35)}
.save{background:var(--c-save-100);border:6px solid var(--c-save-700);border-radius:var(--r-md);padding:var(--s-6) 44px;color:var(--c-save-700)}
.save .k{font-size:var(--rt-sm);font-weight:800;text-transform:uppercase;letter-spacing:.03em}
.save .big{font-size:var(--rt-num);line-height:1.05;margin-top:var(--s-3);white-space:nowrap}.save .pct{font-size:.42em;color:var(--c-ink)}
.est{display:inline-block;margin-top:var(--s-3);font-size:var(--rt-xs);font-weight:700;color:var(--c-ink-muted);border:3px solid var(--c-line);background:var(--c-surface);border-radius:var(--r-pill);padding:4px 20px}
.card{background:var(--c-surface);color:var(--c-ink);border-radius:var(--r-md);padding:var(--s-6) 44px;box-shadow:0 8px 40px rgba(20,32,41,.25)}
.row{padding:var(--s-5) 0;border-bottom:4px solid var(--c-line)}.row:last-child{border-bottom:0}
.k{font-size:var(--rt-xs);font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--c-ink-muted)}
.v{font-size:var(--rt-base);line-height:1.28;margin-top:6px}.row .v.n,.cost .v{font-weight:800}
.card .row .v{font-size:var(--rt-lg)}.spend .row .v{font-size:var(--rt-xl)}.card .row:not(.saverow) .v{font-family:"Nunito","DejaVu Sans",sans-serif;font-weight:800}
.saverow{background:var(--c-save-100);border:0;border-radius:20px;padding:var(--s-5) 28px;margin-top:var(--s-4);color:var(--c-save-700)}.saverow .k{color:var(--c-save-700)}.saverow .v{font-size:var(--rt-xl)}
.basis{font-size:var(--rt-xs);line-height:1.38;color:var(--c-ink-muted);margin-top:var(--s-5)}
.facts .v{font-weight:400}
.chip{display:inline-block;background:var(--c-sun-100);border:4px solid var(--c-sun-400);color:var(--c-ink);font-weight:800;font-size:var(--rt-sm);padding:10px 30px;border-radius:var(--r-pill)}
.chip.w{background:var(--c-save-100);border-color:var(--c-save-700);color:var(--c-save-700)}
.catch{font-size:var(--rt-lg);line-height:1.3;margin-top:var(--s-6);font-weight:700}
.when{font-size:var(--rt-base);line-height:1.3;margin-top:var(--s-6);font-weight:700;padding-top:var(--s-5);border-top:4px solid var(--c-line)}.when.soft{font-weight:400;color:var(--c-ink-muted)}
.note{margin-top:var(--s-5);background:var(--c-sun-100);border-left:14px solid var(--c-sun-400);border-radius:20px;padding:var(--s-5) 30px;font-size:var(--rt-base);line-height:1.28;font-weight:700}
.note b{display:block;font-size:var(--rt-xs);text-transform:uppercase;letter-spacing:.06em;color:var(--c-ink-muted);margin-bottom:6px}
.end{display:flex;flex-direction:column;align-items:center;text-align:center;gap:var(--s-5)}
.wm{font-size:calc(100px*var(--k));line-height:1}.sep{display:none}.wm b{color:var(--c-mint-300)}
.cta{font-size:var(--rt-lg);line-height:1.2;text-wrap:balance}
.chip.us{font-size:var(--rt-sm)}
.checked{font-size:var(--rt-sm);color:var(--c-mint-100);line-height:1.35;max-width:820px}
.credit{position:absolute;left:${SAFE.left}px;max-width:${W - SAFE.left - SAFE.right}px;bottom:${SAFE.bottom}px;font-size:26px;line-height:1.3;color:var(--c-surface);background:rgba(20,32,41,.6);border-radius:12px;padding:6px 14px}
</style></head><body${clip ? ' class="clipped"' : ""}>
<div class="bg${clip ? " clip" : ""}"></div>
<div class="safe ${f.name}" id="safe">${frameBody(f)}</div>
${clip ? `<p class="credit">${esc(frameCredit(clip))}</p>` : ""}
<script>{const s=document.getElementById("safe"),r=document.documentElement;
const fits=()=>s.scrollHeight<=s.clientHeight+1&&s.scrollWidth<=s.clientWidth+1&&document.body.scrollWidth<=${W};
// Shrink type until everything fits the safe area; the renderer refuses a frame that still overflows.
let k=1;r.style.setProperty("--k",k);while(!fits()&&k>0.72){k-=0.02;r.style.setProperty("--k",k);}
document.body.dataset.fits=fits()?"yes":"no";}</script>
</body></html>`;
}

export const reelFrames = (record, clip = null) => reelContent(record).map((f) => ({ name: f.name, seconds: f.seconds, html: frameHtml(f, { clip }) }));
export const reelSeconds = (frames) => Math.round((frames.reduce((a, f) => a + f.seconds, 0) - XFADE * (frames.length - 1)) * 100) / 100;

// The file name carries a hash of everything drawn and how it is encoded, like the cards.
export function reelHash(record, clip = null) {
  const clipKey = clip ? { id: clip.id, download_url: clip.download_url, start_s: clip.start_s ?? 0, crop_x: clip.crop_x ?? 0.5 } : null;
  return createHash("sha256").update(JSON.stringify({ v: REEL_VERSION, W, H, FPS, XFADE, frames: reelFrames(record, clip).map((f) => [f.seconds, f.html]), clip: clipKey })).digest("hex").slice(0, 10);
}
export function reelPaths(entry, record, clip = null) {
  const name = `${entry.id}-${reelHash(record, clip)}`;
  return { mp4: `site/${REEL_DIR}/${name}.mp4`, jpg: `site/${REEL_DIR}/${name}.jpg`, url: `${SITE}/${REEL_DIR}/${name}.mp4`, poster_url: `${SITE}/${REEL_DIR}/${name}.jpg` };
}

// ---------- posting check (used by tools/social-post.mjs) ----------

// The reel to send for this entry and platform, or null (post the image as before). A reel is used only
// when the operator turned the feature on for the platform, the entry is reel-eligible, its recorded
// reel file is the one the current record would render (same hash, so no stale figure), the file exists,
// a recorded clip is still approved for this place, and the caption with the credit fits.
export const CAPTION_MAX = { instagram: 2200, facebook: 2000 };
export function reelForPost({ entry, platform, config, record, clips = [], exists = (p) => existsSync(join(root, p)) }) {
  if (config?.enabled !== true || !REEL_PLATFORMS.includes(platform) || !(config.platforms ?? []).includes(platform)) return null;
  const r = entry?.reel;
  if (!r || !entry.platforms?.[platform] || !reelEligible(entry, record)) return null;
  const clip = r.clip ? clips.find((c) => c.id === r.clip) ?? null : null;
  if (r.clip && !clipMatches(record, clip)) return null;
  const want = reelPaths(entry, record, clip);
  if (r.path !== want.mp4 || r.url !== want.url || !exists(r.path)) return null;
  if (!(r.seconds >= MIN_SECONDS && r.seconds <= MAX_SECONDS)) return null;
  const credit = clip ? captionCredit(clip) : null;
  if (entry.platforms[platform].text.length + (credit ? credit.length + 2 : 0) > CAPTION_MAX[platform]) return null;
  return { url: want.url, credit, seconds: r.seconds, clip: clip?.id ?? null };
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

// Screenshots each frame with headless Chromium (refusing any frame whose text does not fit), then
// assembles with ffmpeg: gentle zoom, short cross-fades, silent AAC track, H.264, faststart.
export async function renderReel({ record, clip = null, clipFile = null, mp4, jpg, stillsDir = null, log = console.log }) {
  const frames = reelFrames(record, clip);
  const work = mkdtempSync(join(tmpdir(), "reel-"));
  try {
    const { chromium } = createRequire(import.meta.url)("playwright");
    const browser = await chromium.launch();
    try {
      for (const [i, f] of frames.entries()) {
        const page = await browser.newPage({ viewport: { width: W, height: H } });
        await page.setContent(f.html, { waitUntil: "load" });
        await page.evaluate(() => document.fonts.ready);
        if ((await page.evaluate(() => document.body.dataset.fits)) !== "yes") throw new Error(`frame ${f.name} of ${record.id}: text does not fit the safe area`);
        await page.screenshot({ path: join(work, `f${i}.png`), omitBackground: Boolean(clip), clip: { x: 0, y: 0, width: W, height: H } });
        await page.close();
      }
    } finally { await browser.close(); }
    const T = reelSeconds(frames);
    if (T < MIN_SECONDS || T > MAX_SECONDS) throw new Error(`reel length ${T}s outside ${MIN_SECONDS}-${MAX_SECONDS}s`);
    const args = ["-v", "error", "-y"];
    frames.forEach((_, i) => args.push("-framerate", String(FPS), "-i", join(work, `f${i}.png`)));
    if (clip) args.push("-stream_loop", "-1", "-i", clipFile);
    args.push("-f", "lavfi", "-t", String(T), "-i", "anullsrc=channel_layout=stereo:sample_rate=48000");
    const audioIndex = frames.length + (clip ? 1 : 0);
    const parts = [];
    frames.forEach((f, i) => {
      const n = Math.round(f.seconds * FPS);
      const still = `[${i}:v]loop=loop=-1:size=1,trim=end_frame=${n},setpts=N/(${FPS}*TB)`;
      // Cards only: the whole frame zooms in by 2.5% (drawn at 2x first so the motion does not shimmer).
      // Over a clip the text stays still and the clip moves.
      parts.push(clip
        ? `${still},format=yuva420p[s${i}]`
        : `${still},scale=${W * 2}:${H * 2}:flags=lanczos,zoompan=z='1+0.025*on/${n}':x='iw/2-iw/zoom/2':y='ih/2-ih/zoom/2':d=1:s=${W}x${H}:fps=${FPS},format=yuv420p[s${i}]`);
    });
    let last = "s0";
    let offset = 0;
    for (let i = 1; i < frames.length; i += 1) {
      offset += frames[i - 1].seconds - XFADE;
      parts.push(`[${last}][s${i}]xfade=transition=fade:duration=${XFADE}:offset=${offset.toFixed(3)}[x${i}]`);
      last = `x${i}`;
    }
    if (clip) {
      const n = Math.round(T * FPS);
      parts.push(`[${frames.length}:v]fps=${FPS},trim=end_frame=${n},setpts=N/(${FPS}*TB),scale=${W}:${H},zoompan=z='1+0.06*on/${n}':x='iw/2-iw/zoom/2':y='ih/2-ih/zoom/2':d=1:s=${W}x${H}:fps=${FPS},format=yuv420p[bg]`);
      parts.push(`[bg][${last}]overlay=format=auto,format=yuv420p[v]`);
    } else parts.push(`[${last}]format=yuv420p[v]`);
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
    sh("ffmpeg", ["-v", "error", "-y", "-ss", "1.2", "-i", tmp, "-frames:v", "1", "-q:v", "3", join(work, "poster.jpg")]);
    // Write under temporary names, then rename, so a stopped render never leaves a short file behind.
    mkdirSync(dirname(jpg), { recursive: true });
    renameSync(join(work, "poster.jpg"), jpg);
    renameSync(tmp, mp4);
    if (stillsDir) {
      mkdirSync(stillsDir, { recursive: true });
      let start = 0;
      frames.forEach((f, i) => {
        sh("ffmpeg", ["-v", "error", "-y", "-ss", (start + f.seconds / 2).toFixed(2), "-i", mp4, "-frames:v", "1", "-q:v", "2", join(stillsDir, `${basename(mp4, ".mp4")}-still${i + 1}-${f.name}.jpg`)]);
        start += f.seconds - XFADE;
      });
    }
    log(`rendered ${mp4} (${T}s, ${(size / 1048576).toFixed(2)} MB${clip ? `, clip ${clip.id}` : ", cards only"})`);
    return { seconds: T, bytes: size };
  } finally { rmSync(work, { recursive: true, force: true }); }
}

// The clip to draw for a record, only if its segment is already in the cache (else cards only).
function clipWithFile(record, clips, log) {
  const clip = clipFor(record, clips);
  if (!clip) return { clip: null, clipFile: null };
  const file = clipCacheFile(clip);
  if (!existsSync(file)) { log(`clip ${clip.id} matches ${record.id} but is not in the cache (run --fetch-clips); rendering cards only`); return { clip: null, clipFile: null }; }
  return { clip, clipFile: file };
}

// Render the day's reel and record it on its queue entry; other entries lose any stale reel field.
export async function reelsForDate(date, { records = sourceRecords(), clips = readClips(), log = console.log } = {}) {
  const queue = readQueue(date);
  if (!queue) throw new Error(`No ops/social-queue/${date}.json; run node tools/social-queue.mjs ${date} first`);
  const byId = new Map(records.map((r) => [r.id, r]));
  const pick = pickReelEntry(queue, records);
  let changed = false;
  for (const e of queue.entries) if (e !== pick && e.reel) { delete e.reel; changed = true; }
  if (pick) {
    const record = byId.get(pick.item_id);
    const { clip, clipFile } = clipWithFile(record, clips, log);
    const p = reelPaths(pick, record, clip);
    let seconds = reelSeconds(reelFrames(record, clip));
    if (existsSync(join(root, p.mp4)) && existsSync(join(root, p.jpg))) log(`kept ${p.mp4}`);
    else ({ seconds } = await renderReel({ record, clip, clipFile, mp4: join(root, p.mp4), jpg: join(root, p.jpg), log }));
    const reel = { path: p.mp4, url: p.url, poster_url: p.poster_url, width: W, height: H, seconds, clip: clip?.id ?? null, credit: clip ? captionCredit(clip) : null };
    if (JSON.stringify(pick.reel) !== JSON.stringify(reel)) { pick.reel = reel; changed = true; }
  } else log(`no reel-eligible entry with Instagram or Facebook on ${date}`);
  if (changed) writeFileSync(join(queueDir, `${date}.json`), `${JSON.stringify(queue, null, 2)}\n`);
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
    let { clip, clipFile } = clipWithFile(record, readClips(), console.log);
    if (opt("--test-clip")) {
      clip = { id: "test-clip", author: "TEST CLIP", source_name: "generated test pattern", licence: { name: "not for publishing", url: "https://familytripwise.com/" }, shows_short: "layout check only" };
      clipFile = opt("--test-clip");
    }
    const p = reelPaths(entry, record, clip);
    await renderReel({ record, clip, clipFile, mp4: join(out, basename(p.mp4)), jpg: join(out, basename(p.jpg)), stillsDir: args.includes("--stills") ? out : null });
  } else {
    const date = args[0];
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date ?? "")) throw new Error("usage: node tools/social-reels.mjs YYYY-MM-DD | --item <record-id> --out <dir> [--stills] | --fetch-clips");
    const { entry, changed } = await reelsForDate(date);
    console.log(entry ? `reel entry ${entry}${changed ? " (queue updated)" : " (queue unchanged)"}` : "no reel today");
  }
}

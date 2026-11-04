// Reels v1 (QUEUE G17, OWNER D38). Pure tests: no browser or ffmpeg needed (rendering is checked by the
// operator's sample renders and the persona and design reviews of the frames).
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { cardHtml, variants } from "./social-queue.mjs";
import {
  reelContent, reelFrames, frameHtml, frameCredit, captionCredit, clipFor, clipMatches, reelHash, reelPaths, reelSeconds,
  pickReelEntry, reelEligible, reelForPost, readReelConfig, readClips, MIN_SECONDS, MAX_SECONDS, ALLOWED_LICENCES, CONFIG_PATH,
} from "./social-reels.mjs";
import { DirStore, defaultReels, zernioBody } from "./social-post.mjs";
import { APPROVED, SITE, queue as fixtureQueue, at, zgo } from "./social-post-fixtures.mjs";

// ---------- fixture records, shaped like social-queue.mjs sourceRecords() ----------
const deal = {
  id: "fixture-park-pass", kind: "deal", kicker: "Family Deal Check · Theme park pass", city: null,
  title: "Fixture Park 2027 pass from $99.99", lines: [["Book by", "November 20, 2026"], ["For a family", "Fixture headline"]],
  short: ["Fixture headline"], extra: [], full: ["Fixture headline"],
  page: `${SITE}/deals/fixture-park-pass.html`, anchor: null, evergreen: `${SITE}/deals/`,
  official_url: "https://www.fixturepark.example/pass", source_label: "Fixture pass page", observed_on: "2026-11-02", expires_on: "2026-11-20", priority_on: "2026-11-20",
  third_party: false, verdict: "only_for", real_deal: true, spend_missing: false, hashtags: ["#familytravel"], social: { topic: null, ig_handle: null },
  v2: {
    context: "Fixture Park, Ohio", headline: "Fixture Park pass", title: "Fixture Park 2027 pass from $99.99", big_number: "$99.99", big_label: "a person",
    verdict_label: "Only for 4+ visits", deadline: "Book by November 20, 2026", spend: null,
    ss: { without: 512, with: 400, save: 112, pct: 22, unit: "4 park visits", party: "2 adults and 2 kids aged 3 and 6", sample_month: null },
    save_line: "A family of 4 saves ≈ $112 (22%) over 4 park visits.",
    ww_line: "Without the deal ≈ $512 · with it ≈ $400 (estimate).",
    deadline_line: "Book by November 20, 2026.", deadline_stated: true,
    without_basis: "Without the deal = 16 × One-Day Ticket from $31.99.",
    lines: ["Fixture Park (Akron, OH) 2027 passes, $99.99 a person.", "Only for 4+ visits.", "The catch: no parking on the cheapest pass.", "Book by November 20, 2026."],
    checked: "Checked on fixturepark.example on November 2.", hero_image: null, hero_alt: null,
  },
};
const event = {
  id: "fixture-lights-2026", kind: "this-week", kicker: "Family event · Chicago", city: "Chicago",
  title: "Fixture Lights at the Zoo: four free nights",
  lines: [["When", "Nov 20 to Jan 3, 4:30 to 9 p.m."], ["Cost", "Free Mondays (reserve); else $7 to $12 each."]],
  short: ["When: Nov 20 to Jan 3, 4:30 to 9 p.m.", "Cost: Free Mondays (reserve); else $7 to $12 each."],
  catch: "Free tickets are released a week ahead at 11 a.m. CT.", family_chip: "Infants need a ticket too.",
  extra: ["Infants need a ticket too.", "Everyone needs a ticket."], full: ["When: …", "Cost: …"],
  page: `${SITE}/this-week/`, anchor: "fixture-lights-2026", evergreen: `${SITE}/this-week/#chicago`,
  official_url: "https://www.fixturezoo.example/lights", source_label: "Fixture zoo page", observed_on: "2026-11-03", expires_on: "2027-01-03", priority_on: "2026-11-20",
  third_party: false, hashtags: ["#familytravel"], social: { topic: null, ig_handle: null },
};
const clip = (over = {}) => ({
  id: "commons-chicago-fixture", provider: "wikimedia-commons", place: "Chicago", item_ids: [], shows: "Chicago skyline at night", shows_short: "Chicago skyline, stock video",
  source_name: "Wikimedia Commons", source_url: "https://commons.wikimedia.org/wiki/File:Fixture.webm", author: "Fixture Author",
  licence: { name: "CC BY 3.0", url: "https://creativecommons.org/licenses/by/3.0/" }, download_url: "https://upload.wikimedia.org/fixture.webm",
  start_s: 4, duration_s: 14, crop_x: 0.5, checked_on: "2026-11-04", status: "approved", ...over,
});
const entryFor = (record, platforms = ["threads", "facebook", "instagram"]) => {
  const id = `2026-11-05-${record.id}`;
  const v = variants(record, id);
  return { id, item_id: record.id, kind: record.kind, platforms: Object.fromEntries(platforms.map((p) => [p, v[p]])) };
};

// Visible text chunks of a frame (no style, script or tags).
const unescape = (s) => s.replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("&quot;", '"').replaceAll("&amp;", "&");
const visible = (html) => unescape(html.replace(/<style>[\s\S]*?<\/style>/, "").replace(/<script>[\s\S]*?<\/script>/, "").replace(/<svg[\s\S]*?<\/svg>/, ""))
  .split(/<[^>]+>/).map((t) => t.trim()).filter(Boolean);
const FIXED = new Set(["estimate", "Details: link in bio", "·", "familytripwise.com", "Checked for US families", "family", "tripwise"]);

test("Reel frames carry only text that is on the entry's image card or in its post (no new numbers)", () => {
  for (const record of [deal, event]) {
    // The kicker ("Family Deal Check · <category>", "Family event · <city>") is the record's card eyebrow; it
    // carries no figure. Every other chunk must be on the image card or in the post.
    const source = `${record.kicker}\n${visible(cardHtml(record)).join("\n")}\n${Object.values(variants(record, `2026-11-05-${record.id}`)).map((v) => v.text).join("\n")}`;
    const frames = reelFrames(record);
    assert.ok(frames.length >= 3 && frames.length <= 5, "3-5 frames");
    for (const f of frames) {
      for (const chunk of visible(f.html)) {
        assert.ok(FIXED.has(chunk) || source.includes(chunk), `${record.id} ${f.name}: "${chunk}" is not on the card or in the post`);
        for (const n of chunk.match(/\d[\d,.]*/g) ?? []) assert.ok(`${visible(cardHtml(record)).join("\n")}\n${variants(record, "x").instagram.text}`.includes(n), `${record.id} ${f.name}: number ${n} not on the card or in the post`);
      }
    }
  }
});

test("Reel frames: hook leads with the key number and place; the deal keeps its estimate label and catch; the end frame has the brand lines", () => {
  const [hook, spend, ctch, end] = reelContent(deal);
  assert.equal(hook.big, "≈ $112");
  assert.equal(hook.place, deal.v2.lines[0]);
  assert.match(frameHtml(hook), />estimate</);
  assert.match(spend.basis, /^Estimate for 2 adults and 2 kids/);
  assert.equal(ctch.catch, deal.v2.lines[2]);
  assert.equal(ctch.deadline, deal.v2.deadline_line);
  const endText = visible(frameHtml(end)).join(" ");
  for (const s of ["Details: link in bio", "familytripwise.com", "Checked for US families", "Confirm before booking."]) assert.ok(endText.includes(s), s);
  const eHook = reelContent(event)[0];
  assert.equal(eHook.eyebrow, "Family event · Chicago");
  assert.equal(eHook.title, event.title);
});

test("Reel length is 8-14 s with cross-fades", () => {
  for (const r of [deal, event]) {
    const s = reelSeconds(reelFrames(r));
    assert.ok(s >= MIN_SECONDS && s <= MAX_SECONDS, `${r.id}: ${s}s`);
  }
});

test("Stock clip: the credit is drawn only when a clip is used", () => {
  const c = clip();
  for (const f of reelContent(event)) {
    const withClip = frameHtml(f, { clip: c });
    assert.ok(visible(withClip).includes(frameCredit(c)), `${f.name}: credit on the frame`);
    assert.match(frameCredit(c), /^Video: Fixture Author \/ Wikimedia Commons, CC BY 3\.0/);
    assert.ok(!frameHtml(f).includes("Video:"), `${f.name}: no credit without a clip`);
  }
  assert.match(captionCredit(c), /^Video: Chicago skyline, stock video, by Fixture Author \/ Wikimedia Commons, CC BY 3\.0 \(creativecommons\.org\/licenses\/by\/3\.0\/\); cropped, darkened, text added\.$/);
});

test("Stock clip: only an approved, free-licence clip whose place matches exactly", () => {
  assert.equal(clipFor(event, [clip()]).id, "commons-chicago-fixture");
  assert.equal(clipFor(event, [clip({ place: "New York City" })]), null, "place mismatch");
  assert.equal(clipFor(event, [clip({ place: "chicago" })]), null, "exact match only");
  assert.equal(clipFor(event, [clip({ status: "candidate" })]), null, "not yet approved");
  assert.equal(clipFor(event, [clip({ licence: { name: "All rights reserved", url: "https://example.com" } })]), null, "licence not free");
  assert.equal(clipFor(event, [clip({ item_ids: ["another-event"] })]), null, "clip of another event");
  assert.equal(clipFor(event, [clip({ author: "" })]), null, "no author to credit");
  assert.equal(clipFor(deal, [clip()]), null, "deal records have no place in v1: cards only");
  const own = clip({ id: "own", item_ids: [event.id] });
  assert.equal(clipFor(event, [clip(), own]).id, "own", "a clip of the item itself wins over a city view");
  assert.ok(ALLOWED_LICENCES.includes("Pexels License"), "Pexels entries can be added later");
});

test("Curated stock-clips.json: every clip is complete and nothing is approved without a reviewed licence", () => {
  const clips = readClips();
  assert.ok(clips.length >= 1);
  const ids = new Set();
  for (const c of clips) {
    assert.ok(!ids.has(c.id), `duplicate ${c.id}`); ids.add(c.id);
    for (const k of ["id", "provider", "place", "shows", "shows_short", "source_name", "source_url", "author", "download_url", "checked_on", "status"]) assert.ok(c[k], `${c.id}: ${k}`);
    assert.ok(ALLOWED_LICENCES.includes(c.licence?.name) && /^https:\/\//.test(c.licence.url), `${c.id}: licence`);
    assert.ok(["candidate", "approved", "rejected"].includes(c.status), `${c.id}: status`);
    assert.match(c.checked_on, /^\d{4}-\d{2}-\d{2}$/);
    if (c.status === "approved") assert.ok(!/PENDING/i.test(c.licence_review ?? ""), `${c.id}: licence review pending`);
  }
});

test("Reels are off by default (ops/media/reels.json)", () => {
  assert.deepEqual(readReelConfig(), { enabled: false, platforms: [] });
  assert.deepEqual(readReelConfig(join(mkdtempSync(join(tmpdir(), "reels-")), "missing.json")), { enabled: false, platforms: [] });
  assert.equal(JSON.parse(readFileSync(CONFIG_PATH, "utf8")).enabled, false);
});

test("Output path: site/social/reels/<entry-id>-<hash>.mp4 and .jpg, stable for the same record, new when a figure or clip changes", () => {
  const e = entryFor(deal);
  const p = reelPaths(e, deal);
  assert.match(p.mp4, /^site\/social\/reels\/2026-11-05-fixture-park-pass-[0-9a-f]{10}\.mp4$/);
  assert.equal(p.jpg, p.mp4.replace(/\.mp4$/, ".jpg"));
  assert.equal(p.url, `${SITE}/${p.mp4.slice(5)}`);
  assert.deepEqual(reelPaths(e, structuredClone(deal)), p, "same record, same file (idempotent)");
  const changed = structuredClone(deal); changed.v2.ss.save = 113;
  assert.notEqual(reelHash(changed), reelHash(deal), "a changed figure renders a new file");
  assert.notEqual(reelHash(event, clip()), reelHash(event), "a clip renders a new file");
  assert.notEqual(reelHash(event, clip({ start_s: 9 })), reelHash(event, clip()), "a new segment renders a new file");
});

test("Reel eligibility: events with a catch line and real deals with a spend-vs-save card; at most one a day, Instagram first", () => {
  assert.ok(reelEligible(entryFor(deal), deal));
  assert.ok(reelEligible(entryFor(event), event));
  assert.ok(!reelEligible(entryFor(deal), { ...deal, real_deal: false }), "not a real deal (D22)");
  assert.ok(!reelEligible(entryFor(deal), { ...deal, v2: { ...deal.v2, ss: undefined } }), "no spend-vs-save card");
  assert.ok(!reelEligible(entryFor(event), { ...event, third_party: true }));
  const q = { entries: [entryFor(event, ["threads", "facebook"]), entryFor(deal, ["threads", "instagram"])] };
  assert.equal(pickReelEntry(q, [deal, event]).item_id, deal.id, "the entry carrying Instagram");
  assert.equal(pickReelEntry({ entries: [entryFor(event, ["threads", "facebook"])] }, [event]).item_id, event.id, "else Facebook");
  assert.equal(pickReelEntry({ entries: [entryFor(event, ["threads", "pinterest"])] }, [event]), null, "no Instagram or Facebook: no reel");
});

// ---------- posting ----------
const ON = { enabled: true, platforms: ["instagram", "facebook"] };
function withReel(record, c = null) {
  const e = entryFor(record);
  const p = reelPaths(e, record, c);
  e.reel = { path: p.mp4, url: p.url, poster_url: p.poster_url, width: 1080, height: 1920, seconds: 11.5, clip: c?.id ?? null, credit: c ? captionCredit(c) : null };
  return e;
}
const exists = () => true;

test("reelForPost: a reel only when switched on for the platform, the file exists and it still matches the record", () => {
  const e = withReel(deal);
  const args = { entry: e, record: deal, clips: [], exists };
  assert.deepEqual(reelForPost({ ...args, platform: "instagram", config: ON }), { url: e.reel.url, credit: null, seconds: 11.5, clip: null });
  assert.equal(reelForPost({ ...args, platform: "instagram", config: { enabled: false, platforms: ["instagram"] } }), null, "flag off");
  assert.equal(reelForPost({ ...args, platform: "facebook", config: { enabled: true, platforms: ["instagram"] } }), null, "platform not switched on");
  assert.equal(reelForPost({ ...args, platform: "threads", config: { enabled: true, platforms: ["threads"] } }), null, "never Threads");
  assert.equal(reelForPost({ ...args, platform: "instagram", config: ON, exists: () => false }), null, "file missing");
  const changed = structuredClone(deal); changed.v2.ss.save = 120;
  assert.equal(reelForPost({ ...args, record: changed, platform: "instagram", config: ON }), null, "record changed since the render");
  assert.equal(reelForPost({ ...args, entry: { ...e, reel: undefined }, platform: "instagram", config: ON }), null, "no reel rendered");
  const c = clip();
  const ec = withReel(event, c);
  assert.equal(reelForPost({ entry: ec, record: event, clips: [c], exists, platform: "facebook", config: ON }).credit, captionCredit(c));
  assert.equal(reelForPost({ entry: ec, record: event, clips: [clip({ status: "rejected" })], exists, platform: "facebook", config: ON }), null, "clip withdrawn");
});

test("Zernio body: Instagram sends one video media item and the caption plus credit; Facebook a Reel with the link last; no reel, no change", () => {
  const e = withReel(event, clip());
  const reel = { url: e.reel.url, credit: e.reel.credit };
  const ig = zernioBody({ platform: "instagram", entry: { ...e, image: { url: `${SITE}/social/cards/x.jpg` } }, variant: e.platforms.instagram, accountId: "a", reel });
  assert.deepEqual(ig.mediaItems, [{ type: "video", url: e.reel.url }]);
  assert.equal(ig.content, `${e.platforms.instagram.text}\n\n${e.reel.credit}`);
  assert.equal(ig.platforms[0].platformSpecificData, undefined, "a single video is a Reel with no contentType");
  const fb = zernioBody({ platform: "facebook", entry: e, variant: e.platforms.facebook, accountId: "b", pageId: "123", reel });
  assert.deepEqual(fb.mediaItems, [{ type: "video", url: e.reel.url }]);
  assert.deepEqual(fb.platforms[0].platformSpecificData, { pageId: "123", contentType: "reel" });
  assert.equal(fb.content, `${e.platforms.facebook.text}\n\n${e.reel.credit}\n\n${e.platforms.facebook.link}`);
  const plain = zernioBody({ platform: "instagram", entry: { ...e, image: { url: `${SITE}/social/cards/x.jpg` } }, variant: e.platforms.instagram, accountId: "a" });
  assert.deepEqual(plain.mediaItems, [{ type: "image", url: `${SITE}/social/cards/x.jpg` }]);
  assert.equal(plain.content, e.platforms.instagram.text);
  const fbPlain = zernioBody({ platform: "facebook", entry: e, variant: e.platforms.facebook, accountId: "b" });
  assert.equal(fbPlain.mediaItems, undefined);
});

test("run(): with reels switched on, Instagram and Facebook post the video once; switched off, the image as before", async () => {
  const reelUrl = `${SITE}/social/reels/2026-11-05-morning-0123456789.mp4`;
  const fake = (entry, platform) => (["instagram", "facebook"].includes(platform) && entry.id === "2026-11-05-morning" ? { url: reelUrl, credit: null, seconds: 11.5, clip: null } : null);
  const calls = [];
  const out = mkdtempSync(join(tmpdir(), "reels-run-"));
  const on = await zgo(new DirStore(out, APPROVED), at("08:00"), { calls, reels: fake });
  assert.equal(on.failed.length, 0, JSON.stringify(on.failed));
  const posts = calls.filter((c) => c.host === "zernio.com" && c.path === "/api/v1/posts");
  const byP = Object.fromEntries(posts.map((c) => [c.body.platforms[0].platform, c.body]));
  assert.deepEqual(byP.instagram.mediaItems, [{ type: "video", url: reelUrl }]);
  assert.equal(byP.facebook.platforms[0].platformSpecificData.contentType, "reel");
  assert.deepEqual(byP.pinterest.mediaItems, [{ type: "image", url: fixtureQueue.entries[0].image.url }], "Pinterest keeps the card");
  assert.ok(calls.some((c) => c.method === "HEAD" && `https://${c.host}${c.path}` === reelUrl), "the reel URL is checked live before posting");
  const receipt = JSON.parse(readFileSync(join(out, "ops/social-receipts/2026-11-05/2026-11-05-morning--instagram.json"), "utf8"));
  assert.equal(receipt.media, "reel");
  assert.equal(receipt.reel_url, reelUrl);
  const again = await zgo(new DirStore(out, APPROVED), at("08:10"), { reels: fake });
  assert.equal(again.posted.length, 0, "receipts still block any repeat");

  const offCalls = [];
  await zgo(new DirStore(mkdtempSync(join(tmpdir(), "reels-off-")), APPROVED), at("08:00"), { calls: offCalls, reels: defaultReels({ config: { enabled: false, platforms: [] } }) });
  const ig = offCalls.find((c) => c.host === "zernio.com" && c.path === "/api/v1/posts" && c.body.platforms[0].platform === "instagram");
  assert.deepEqual(ig.body.mediaItems, [{ type: "image", url: fixtureQueue.entries[0].image.url }]);
});

test("run(): a reel is never sent on the direct (non-Zernio) route", async () => {
  const calls = [];
  const { go } = await import("./social-post-fixtures.mjs");
  await go(new DirStore(mkdtempSync(join(tmpdir(), "reels-direct-")), APPROVED), at("08:00"), { calls, reels: () => ({ url: `${SITE}/social/reels/x-0123456789.mp4`, credit: null }) });
  assert.ok(!calls.some((c) => /\.mp4$/.test(c.path) || JSON.stringify(c.body ?? {}).includes(".mp4")));
});

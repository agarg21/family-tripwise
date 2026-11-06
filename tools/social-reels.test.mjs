// Reels v2 (QUEUE G17, OWNER D38). Pure tests: no browser or ffmpeg needed (rendering is checked by the
// operator's sample renders and the persona and design reviews of the frames).
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { readdirSync, writeFileSync } from "node:fs";
import { cardHtml, shareable, sourceRecords, variants } from "./social-queue.mjs";
import {
  reelContent, reelFrames, frameHtml, frameCredit, captionCredit, clipFor, clipMatches, reelHash, reelPaths, reelSeconds,
  pickReelEntry, reelEligible, reelForPost, readReelConfig, readClips, MIN_SECONDS, MAX_SECONDS, ALLOWED_LICENCES, CONFIG_PATH,
  reelPhoto, readReelPhotos, photoFrameCredit, photoCaptionCredit, shortArtist, dateChip, isFree, dealName, pruneReels, SAFE, W,
  reelPhotos, shotIndex, musicFor, musicMood, beatSeconds, readMusic, mediaCaptionCredit, musicCredit, MAX_SHOTS,
} from "./social-reels.mjs";
import { DirStore, defaultReels, simulatedFetch, zernioBody } from "./social-post.mjs";
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
const unescape = (s) => s.replaceAll("&nbsp;", " ").replaceAll("\u2011", "-").replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("&quot;", '"').replaceAll("&amp;", "&");
const visible = (html) => unescape(html.replace(/<style>[\s\S]*?<\/style>/, "").replace(/<script>[\s\S]*?<\/script>/, "").replace(/<svg[\s\S]*?<\/svg>/, ""))
  .split(/<[^>]+>/).map((t) => t.trim()).filter(Boolean);
// Fixed interface words a frame may add; every other chunk must be on the card, in the post or in the
// record's title, and every number must be on the card, in the post or in the page title (a verified record field).
const FIXED = new Set(["Save about", "Without", "with", "→", "≈", "Full check at familytripwise.com", "Deal check", "deal check", "Free family event", "Family event", "family of 4", "estimate", "·", "family", "tripwise",
  "Save this for your trip", "Send it to someone you'd go with", "This week", "family events by city",
  "You save", "Without the deal", "With the deal", "When", "Cost", "Tip", "Good to know"]);
function assertOnlyCardText(record) {
  const card = visible(cardHtml(record)).join("\n");
  const post = Object.values(variants(record, `2026-11-05-${record.id}`)).map((v) => v.text).join("\n");
  const source = `${record.kicker}\n${record.title}\n${record.v2?.title ?? ""}\n${card}\n${post}`;
  const frames = reelFrames(record);
  assert.ok(frames.length >= 3 && frames.length <= 5, "3-5 frames");
  for (const f of frames) {
    for (const chunk of visible(f.html)) {
      const ok = FIXED.has(chunk) || source.includes(chunk) || (chunk.startsWith("Save about ") && source.includes(chunk.slice(11)));
      assert.ok(ok, `${record.id} ${f.name}: "${chunk}" is not on the card, in the post or in the title`);
      for (const n of chunk.match(/\d[\d,.]*\d|\d/g) ?? []) assert.ok(`${card}\n${variants(record, "x").instagram.text}\n${record.title}\n${record.v2?.title ?? ""}`.includes(n), `${record.id} ${f.name}: number ${n} not on the card, in the post or in the title`);
    }
  }
}

test("Reel frames carry only text that is on the entry's image card, in its post or in its title (no new numbers)", () => {
  for (const record of [deal, event]) assertOnlyCardText(record);
});

test("Reel frames for every live reel-eligible record pass the same text and number check", () => {
  const live = sourceRecords().filter((r) => reelEligible({ item_id: r.id, kind: r.kind }, r));
  assert.ok(live.length >= 1);
  for (const r of live) assertOnlyCardText(r);
});

test("Opening frame: a deal leads with SAVE and its saving, an event with FREE (only when plainly free), then the place and date", () => {
  const [hook, spend, ctch, end] = reelContent(deal);
  assert.equal(hook.word, "Save about");
  assert.equal(hook.big, "$112");
  assert.equal(hook.pct, "(22%)");
  assert.deepEqual(hook.ww, ["$512", "$400"], "without and with are on the opening frame (and the cover)");
  assert.deepEqual(hook.meta, ["over 4 park visits", "family of 4", "estimate"]);
  assert.equal(hook.title, "Fixture Park");
  assert.equal(hook.sub, "2027 pass from $99.99");
  assert.equal(hook.date, "Book by November 20, 2026", "a stated book-by date opens with the deal");
  assert.equal(reelContent({ ...deal, v2: { ...deal.v2, deadline_stated: false } })[0].date, null);
  const hookText = visible(frameHtml(hook)).join(" ");
  for (const s of ["Save about", "$112", "(22%)", "Without", "$512", "→", "with", "$400", "estimate"]) assert.ok(hookText.includes(s), s);
  assert.match(spend.basis, /^Estimate for 2 adults and 2 kids/);
  assert.equal(ctch.catch, deal.v2.lines[2]);
  assert.equal(ctch.deadline, deal.v2.deadline_line);
  assert.equal(reelContent({ ...deal, v2: { ...deal.v2, deadline_stated: false } })[2].deadline, null, "no 'no buy-by date' filler");
  const endText = visible(frameHtml(end)).join(" ");
  for (const s of ["Save about $112", "Book by November 20, 2026", "Save this for your trip", "Send it to someone you'd go with", "Full check at familytripwise.com", "Fixture Park", "Confirm before booking."]) assert.ok(endText.includes(s), s);
  const eHook = reelContent(event)[0];
  assert.equal(eHook.word, null, "Free Mondays only: no big FREE");
  assert.equal(eHook.title, "Fixture Lights at the Zoo");
  assert.equal(eHook.sub, "four free nights");
  assert.equal(eHook.date, "Nov 20 to Jan 3");
  assert.deepEqual(eHook.tag, ["Family event", "Chicago"], "the big FREE is not repeated in the eyebrow");
  const freeEvent = { ...event, lines: [["When", "Sat Nov 21, Michigan Avenue: parade 5:30 p.m."], ["Cost", "Free. Metra optional."]] };
  assert.equal(reelContent(freeEvent)[0].word, "Free");
  assert.equal(reelContent(freeEvent)[0].date, "Sat Nov 21");
  assert.deepEqual(reelContent(freeEvent)[3].key, ["Free", "Sat Nov 21"], "the end frame repeats the key fact");
});

test("Helpers: free, date chip, deal name, artist", () => {
  assert.ok(isFree("Free. Food and drinks are for sale.") && isFree("Free; no ticket needed.") && isFree("Free, seen from your car"));
  assert.ok(!isFree("Free Mondays Nov 23 (reserve)") && !isFree("Free to enter") && !isFree("$10 per person"));
  assert.equal(dateChip("Tuesday, Nov 24, 11 a.m. to noon, Boston Common."), "Tuesday, Nov 24");
  assert.equal(dateChip("Sat Nov 21, Michigan Avenue: parade 5:30 p.m."), "Sat Nov 21");
  assert.equal(dateChip("Nov 14 to Jan 3 at all three Universal Orlando theme parks."), null, "no comma/period after the date: not a clean chip");
  assert.equal(dateChip("Nov 13 to Jan 3, indoors at Gaylord Palms."), "Nov 13 to Jan 3");
  // Integrity review 2026-11-04: never drop a limit on the dates.
  for (const w of ["25 select nights, Nov 8 to Dec 22, 7 p.m.", "Select dates, Nov 21 to Jan 3.", "Daily Nov 19 to Jan 3, except Christmas Day", "Nov 21 and 22, 5 p.m.",
    "Through Jan 3.", "Daily from Nov 20.", "Market 5 to 9 p.m.", "Nov 11, 16, 23, 30, Dec 14 and Jan 2, in Vienna, VA.", "Nov 20 to Jan 3, 4:30 to 9 p.m.; closed Nov 26, Dec 1", "Nov 20 to Jan 3, weekends only.", "Nov 27 to Dec 19, select nights.", "Nov 27 to Dec 20, Fridays and Saturdays."]) {
    assert.equal(dateChip(w), null, w);
  }
  assert.equal(dateChip("Friday, Dec 4, 4 to 10 p.m., and Saturday, Dec 5, noon"), null, "more dates follow: no chip");
  assert.equal(dateChip("Select dates."), null);
  assert.deepEqual(dealName("Sesame Place Philadelphia 2027 season pass from $99.99, rest of 2026 included"), { name: "Sesame Place Philadelphia", offer: "2027 season pass from $99.99, rest of 2026 included" });
  assert.deepEqual(dealName("SeaWorld Orlando: unlimited visits through 2027 for $104.99 a person"), { name: "SeaWorld Orlando", offer: "unlimited visits through 2027 for $104.99 a person" });
  assert.deepEqual(dealName("LEGOLAND Florida hotel stays: kids' park tickets from $39 a day"), { name: "LEGOLAND Florida", offer: "hotel stays: kids' park tickets from $39 a day" });
  assert.equal(shortArtist("Tony Webster from Portland, Oregon, United States"), "Tony Webster");
  assert.equal(shortArtist("White House. Andrea Hanks, photographer"), "Andrea Hanks / White House");
  assert.equal(shortArtist("Fred Hsu (Wikipedia:User:Fredhsu on en.wikipedia)"), "Fred Hsu");
});

test("Layout: content stays inside x 64-900 and y 250-1570 (clear of the Reels buttons and caption)", () => {
  assert.equal(SAFE.left, 64);
  assert.ok(W - SAFE.right <= 900);
  assert.ok(SAFE.top >= 250 && SAFE.bottom >= 350);
  for (const f of reelContent(deal)) assert.match(frameHtml(f), /font-family:"Nunito"/);
});

test("Reel length is 8-14 s", () => {
  for (const r of [deal, event]) {
    const s = reelSeconds(reelFrames(r));
    assert.ok(s >= MIN_SECONDS && s <= MAX_SECONDS, `${r.id}: ${s}s`);
  }
});

// ---------- opening photo ----------
const LOCK = {
  "chi-tree": { path: "images/chi-tree.webp", width: 1400, height: 2100, artist: "Michael Barera", license: "CC BY-SA 4.0", license_url: "https://creativecommons.org/licenses/by-sa/4.0" },
  "park-gate": { path: "images/park-gate.webp", width: 640, height: 480, artist: "Pat Doe from Ohio", license: "CC BY 2.0", license_url: "https://creativecommons.org/licenses/by/2.0" },
  "secret": { path: "images/secret.webp", width: 1400, height: 2100, artist: "Someone", license: "All rights reserved", license_url: "https://example.com" },
};
const PHOTOS = { cities: { Boston: "secret" }, photos: {
  "chi-tree": { status: "approved", shows: "Millennium Park tree, Dec 2017" },
  "park-gate": { status: "approved", venue: true, shows: "Fixture Park gate, an older photo" },
  "secret": { status: "approved", shows: "x" },
} };
const photoOpts = { photos: PHOTOS, lock: LOCK, cityHeroes: { Chicago: "chi-tree" } };

test("Opening photo: a deal's page photo or the event city's holiday photo, only when approved with a free licence; honest credit", () => {
  const ph = reelPhoto(event, photoOpts);
  assert.equal(ph.slug, "chi-tree");
  assert.equal(ph.mode, "full");
  assert.equal(photoFrameCredit(ph), "Photo: Michael Barera, CC BY-SA 4.0 · Millennium Park tree, Dec 2017; not this event");
  assert.match(photoCaptionCredit(ph), /^Photo: Millennium Park tree, Dec 2017; not this event\. By Michael Barera via Wikimedia Commons, CC BY-SA 4\.0 \(creativecommons\.org\/licenses\/by-sa\/4\.0\); cropped, colour adjusted, text added\. This video is shared under CC BY-SA 4\.0 too\.$/);
  const dph = reelPhoto({ ...deal, v2: { ...deal.v2, hero_image: "park-gate" } }, photoOpts);
  assert.equal(dph.mode, "framed", "640x480 is too small to fill the frame");
  assert.equal(dph.artist, "Pat Doe");
  assert.equal(photoFrameCredit(dph), "Photo: Pat Doe, CC BY 2.0 · Fixture Park gate, an older photo");
  assert.ok(!photoCaptionCredit(dph).includes("shared under"), "no ShareAlike notice for CC BY");
  assert.equal(reelPhoto({ ...deal, v2: { ...deal.v2, hero_image: "chi-tree" } }, photoOpts).context, "not the park", "a deal photo that is not the venue says so");
  assert.equal(reelPhoto(deal, photoOpts), null, "no page photo: brand teal");
  assert.equal(reelPhoto({ ...event, city: "Boston" }, photoOpts), null, "licence not free");
  assert.equal(reelPhoto({ ...event, city: "Denver" }, photoOpts), null, "no photo for the city");
  assert.equal(reelPhoto(event, { ...photoOpts, photos: { cities: {}, photos: { "chi-tree": { status: "candidate", shows: "x" } } } }), null, "not approved for reels");
  for (const f of reelContent(event)) {
    assert.ok(visible(frameHtml(f, { photo: ph })).includes(photoFrameCredit(ph)), `${f.name}: credit on every frame`);
    assert.ok(!frameHtml(f).includes("Photo:"), `${f.name}: no credit without a photo`);
  }
  assert.notEqual(reelHash(event, { clip: null, photo: ph }), reelHash(event), "a photo renders a new file");
});

test("Curated reel-photos.json: approved photos exist in the lock with a free licence, artist and file", () => {
  const { photos, cities } = readReelPhotos();
  const lock = JSON.parse(readFileSync(new URL("./images/commons-images.lock.json", import.meta.url), "utf8"));
  for (const [slug, p] of Object.entries(photos)) {
    assert.ok(["approved", "candidate", "rejected"].includes(p.status), `${slug}: status`);
    assert.ok(p.shows && p.shows.length <= 60, `${slug}: short note of what it shows`);
    assert.ok(lock[slug]?.artist && (lock[slug].license_url || lock[slug].license === "Public domain"), `${slug}: in the lock with artist and licence`);
    if (p.status === "approved") assert.ok(reelPhoto({ kind: "deal", v2: { hero_image: slug } })?.slug === slug, `${slug}: usable`);
    assert.ok(existsSync(new URL(`../site/${lock[slug].path}`, import.meta.url)), `${slug}: file`);
  }
  for (const slug of Object.values(cities)) assert.ok(photos[slug], `${slug}: city photo listed`);
});

test("A reel-photos item photo beats the city photo for that record only", () => {
  const photos = { items: { "a-fair": "two" }, cities: { Orlando: "one" }, photos: { one: { status: "approved", shows: "One" }, two: { status: "approved", shows: "Two" } } };
  const lock = { one: { path: "images/one.webp", artist: "A", license: "Public domain", width: 1440, height: 1080 }, two: { path: "images/two.webp", artist: "B", license: "Public domain", width: 1440, height: 1080 } };
  assert.equal(reelPhoto({ id: "a-fair", kind: "event", city: "Orlando" }, { photos, lock, cityHeroes: {} }).slug, "two");
  assert.equal(reelPhoto({ id: "b-fair", kind: "event", city: "Orlando" }, { photos, lock, cityHeroes: {} }).slug, "one");
});

test("Old reels leave site/ two days after their queue day", () => {
  const dir = mkdtempSync(join(tmpdir(), "reels-prune-"));
  for (const f of ["2026-11-01-a-0123456789.mp4", "2026-11-01-a-0123456789.jpg", "2026-11-03-b-0123456789.mp4", "2026-11-05-c-0123456789.mp4", "README.md"]) writeFileSync(join(dir, f), "x");
  const gone = pruneReels("2026-11-05", { dir, log: () => {} });
  assert.deepEqual(gone.sort(), ["2026-11-01-a-0123456789.jpg", "2026-11-01-a-0123456789.mp4"]);
  assert.deepEqual(readdirSync(dir).sort(), ["2026-11-03-b-0123456789.mp4", "2026-11-05-c-0123456789.mp4", "README.md"]);
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
  assert.ok(!ALLOWED_LICENCES.some((l) => /BY-SA/.test(l)), "no ShareAlike clips");
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

test("Reels switch: off when the file is missing; on only for Instagram/Facebook and only with the owner's D38 row", () => {
  assert.deepEqual(readReelConfig(join(mkdtempSync(join(tmpdir(), "reels-")), "missing.json")), { enabled: false, platforms: [], hold: [] });
  const c = readReelConfig();
  assert.ok(c.platforms.every((p) => ["instagram", "facebook"].includes(p)));
  if (c.enabled) assert.match(readFileSync(new URL("../ops/OWNER.md", import.meta.url), "utf8"), /D37\/D38[^\n]*Approved[^\n]*Reels v2[^\n]*on for IG\+FB/, "switched on by the owner (OWNER.md D38)");
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
  assert.notEqual(reelHash(event, { clip: clip(), photo: null }), reelHash(event), "a clip renders a new file");
  assert.notEqual(reelHash(event, { clip: clip({ start_s: 9 }), photo: null }), reelHash(event, { clip: clip(), photo: null }), "a new segment renders a new file");
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
function withReel(record, c = null, photo = null) {
  const e = entryFor(record);
  const p = reelPaths(e, record, { clip: c, photo });
  e.reel = { path: p.mp4, url: p.url, poster_url: p.poster_url, width: 1080, height: 1920, seconds: 11.5, clip: c?.id ?? null, photo: photo?.slug ?? null, credit: c ? captionCredit(c) : photo ? photoCaptionCredit(photo) : null };
  return e;
}
const exists = () => true;

test("reelForPost: a reel only when switched on for the platform, the file exists and it still matches the record", () => {
  const e = withReel(deal);
  const args = { entry: e, record: deal, clips: [], exists, photoFor: () => null };
  assert.deepEqual(reelForPost({ ...args, platform: "instagram", config: ON }), { url: e.reel.url, credit: null, seconds: 11.5, clip: null, photo: null, music: null });
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
  const ph = reelPhoto(event, photoOpts);
  const ep = withReel(event, null, ph);
  const pargs = { entry: ep, record: event, clips: [], exists, platform: "instagram", config: ON };
  assert.deepEqual(reelForPost({ ...pargs, photoFor: () => ph }), { url: ep.reel.url, credit: mediaCaptionCredit({ clip: null, photos: [ph], music: null }), seconds: 11.5, clip: null, photo: "chi-tree", music: null });
  assert.equal(reelForPost({ ...pargs, photoFor: () => null }), null, "photo withdrawn since the render");
  assert.equal(reelForPost({ ...pargs, photoFor: () => ({ ...ph, crop_x: 0.2 }) }), null, "photo crop changed since the render");
  // Facebook appends the link after the caption and credit; all of it must fit.
  const long = withReel(event, null, ph);
  long.platforms.facebook = { ...long.platforms.facebook, text: "x".repeat(2000 - mediaCaptionCredit({ clip: null, photos: [ph], music: null }).length - 2 - long.platforms.facebook.link.length - 2) };
  assert.ok(reelForPost({ ...pargs, entry: long, platform: "facebook", photoFor: () => ph }), "exactly at the limit");
  long.platforms.facebook.text += "x";
  assert.equal(reelForPost({ ...pargs, entry: long, platform: "facebook", photoFor: () => ph }), null, "one over: the image instead");
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

test("run(): a reel that is not live yet posts the image card instead of skipping the post", async () => {
  const reelUrl = `${SITE}/social/reels/2026-11-05-morning-0123456789.mp4`;
  const fake = (entry, platform) => (["instagram", "facebook"].includes(platform) ? { url: reelUrl, credit: null, seconds: 11.5, clip: null, photo: null, music: null } : null);
  const calls = [];
  const base = simulatedFetch(calls);
  const fetch = async (url, opts = {}) => (String(url).endsWith(".mp4") ? new Response(null, { status: 404, headers: { "content-type": "text/html" } }) : base(url, opts));
  const out = mkdtempSync(join(tmpdir(), "reels-notlive-"));
  const r = await zgo(new DirStore(out, APPROVED), at("08:00"), { calls, fetch, reels: fake });
  assert.equal(r.failed.length, 0, JSON.stringify(r.failed));
  const ig = calls.find((c) => c.host === "zernio.com" && c.path === "/api/v1/posts" && c.body.platforms[0].platform === "instagram");
  assert.deepEqual(ig.body.mediaItems, [{ type: "image", url: fixtureQueue.entries[0].image.url }]);
  assert.ok(r.posted.some((p) => String(p.key).includes("instagram")), `posted, not skipped: ${JSON.stringify(r.posted.map((p) => p.key))}`);
  const receipt = JSON.parse(readFileSync(join(out, "ops/social-receipts/2026-11-05/2026-11-05-morning--instagram.json"), "utf8"));
  assert.equal(receipt.media, undefined, "the receipt records the image");
});

test("defaultReels(): a broken reel lookup posts the image (never throws)", () => {
  const reels = defaultReels({ config: { enabled: true, platforms: ["instagram"] }, records: [{ id: "x", kind: "deal" }], clips: null });
  const entry = { id: "e", item_id: "x", kind: "deal", reel: { path: "p" }, platforms: { instagram: null } };
  Object.defineProperty(entry.platforms, "instagram", { get() { throw new Error("boom"); } });
  assert.equal(reels(entry, "instagram"), null);
});

test("A news item is never reel-eligible: reel frames are labelled Family event", () => {
  const news = sourceRecords().find((r) => r.news);
  if (news) assert.equal(reelEligible({ item_id: news.id, kind: news.kind }, news), false);
  assert.equal(reelEligible({ item_id: "n", kind: "this-week" }, { id: "n", kind: "this-week", catch: "x", news: true }), false);
  assert.equal(reelEligible({ item_id: "e", kind: "this-week" }, { id: "e", kind: "this-week", catch: "x", news: false }), true);
});

// ---------- Reels v3: shots, music, beat timing ----------
const TRACKS = { tracks: [
  { id: "h1", title: "Holiday One", artist: "A", url: "https://assets.mixkit.co/music/1/1.mp3", mood: "holiday", bpm: 120, start_s: 5, status: "approved" },
  { id: "u1", title: "Up One", artist: "B", url: "https://assets.mixkit.co/music/2/2.mp3", mood: "upbeat", bpm: 64, start_s: 0, status: "approved" },
  { id: "u2", title: "Up Two", artist: "C", url: "https://example.com/2.mp3", mood: "upbeat", bpm: 100, start_s: 0, status: "approved" },
  { id: "r1", title: "Retired", artist: "D", url: "https://assets.mixkit.co/music/3/3.mp3", mood: "upbeat", bpm: 100, start_s: 0, status: "retired" },
] };

test("Music: holiday tracks for Christmas-season events, upbeat for deals; only approved Mixkit tracks; stable per record", () => {
  assert.equal(musicMood(deal), "upbeat");
  assert.equal(musicMood({ ...event, title: "Fixture Lights at the Zoo: four free nights" }), "holiday");
  assert.equal(musicMood({ ...event, title: "Fall Fiesta in the Park", kicker: "Orlando", catch: "Arrive early." }), "upbeat");
  assert.equal(musicFor(deal, { music: TRACKS }).id, "u1", "u2 is not a Mixkit URL, r1 is retired");
  assert.equal(musicFor({ ...event, title: "Zoo Lights" }, { music: TRACKS }).id, "h1");
  assert.equal(musicFor(deal, { music: { tracks: [] } }), null, "no tracks: silent");
  assert.equal(musicCredit(TRACKS.tracks[0]), 'Music: "Holiday One" by A (Mixkit).');
  for (const t of readMusic().tracks) {
    assert.match(t.url, /^https:\/\/assets\.mixkit\.co\/music\/\d+\/\d+\.mp3$/, t.id);
    assert.ok(["holiday", "upbeat"].includes(t.mood) && t.bpm > 0 && t.start_s >= 0 && t.title && t.artist, t.id);
  }
  assert.match(readMusic().note, /never committed/);
});

test("Beat timing: frame lengths snap to whole beats (tempo folded into 90-150 bpm), never under 2 s, total 8-14 s", () => {
  assert.equal(beatSeconds(2.8, 120), 3.0);
  assert.equal(beatSeconds(2.8, 60), 3.0, "60 bpm counts as 120");
  assert.equal(beatSeconds(1.2, 120), 2.0);
  assert.equal(beatSeconds(2.8, 0), 2.8, "no music: unchanged");
  for (const t of readMusic().tracks) for (const r of [deal, event]) {
    const sec = reelSeconds(reelFrames(r, { clip: null, photo: null, photos: [], music: t }));
    assert.ok(sec >= MIN_SECONDS && sec <= MAX_SECONDS, `${t.id} ${r.id}: ${sec}s`);
  }
});

const SHOT_PHOTOS = { cities: {}, photos: {
  "chi-tree": { status: "approved", shows: "Millennium Park tree, Dec 2017", more: ["chi-two", "secret", "chi-three", "chi-four"] },
  "chi-two": { status: "approved", shows: "Michigan Avenue lights" },
  "chi-three": { status: "approved", shows: "Navy Pier" },
  "chi-four": { status: "approved", shows: "Riverwalk" },
  "secret": { status: "approved", shows: "x" },
} };
const SHOT_LOCK = { ...LOCK, "chi-two": { ...LOCK["chi-tree"], path: "images/chi-two.webp", artist: "Two" }, "chi-three": { ...LOCK["chi-tree"], path: "images/chi-three.webp", artist: "Three", license: "CC BY 2.0", license_url: "https://creativecommons.org/licenses/by/2.0" }, "chi-four": { ...LOCK["chi-tree"], path: "images/chi-four.webp" } };

test("Shots: primary photo plus its approved free-licence extras, at most 3; cut hook, cards, end; credit per frame and all in the caption", () => {
  const opts = { photos: SHOT_PHOTOS, lock: SHOT_LOCK, cityHeroes: { Chicago: "chi-tree" } };
  const shots = reelPhotos(event, opts);
  assert.deepEqual(shots.map((x) => x.slug), ["chi-tree", "chi-two", "chi-three"], "secret (not free) skipped, max 3");
  assert.equal(MAX_SHOTS, 3);
  assert.ok(shots.every((x) => x.context === "not this event"));
  assert.deepEqual([0, 1, 2, 3].map((i) => shotIndex(i, 3)), [0, 1, 2, 0]);
  assert.deepEqual([0, 1, 2, 3].map((i) => shotIndex(i, 2)), [0, 1, 1, 0]);
  assert.deepEqual([0, 1, 2, 3].map((i) => shotIndex(i, 1)), [0, 0, 0, 0]);
  const frames = reelFrames(event, { clip: null, photo: shots[0], photos: shots, music: null });
  assert.deepEqual(frames.map((f) => f.photo.slug), ["chi-tree", "chi-two", "chi-three", "chi-tree"]);
  frames.forEach((f) => assert.ok(visible(f.html).includes(photoFrameCredit(f.photo)), `${f.name}: its own shot's credit`));
  const cap = mediaCaptionCredit({ clip: null, photos: shots, music: TRACKS.tracks[0] });
  for (const x of shots) assert.ok(cap.includes(photoCaptionCredit(x, { notice: false })));
  assert.ok(cap.includes('Music: "Holiday One" by A (Mixkit).'));
  assert.ok(cap.endsWith("Our edit of these photos is shared under CC BY-SA 4.0; the music is not (Mixkit licence)."));
  assert.notEqual(reelHash(event, { photos: shots }), reelHash(event, { photos: shots.slice(0, 1) }), "different shots, new file");
  assert.notEqual(reelHash(event, { photos: shots, music: TRACKS.tracks[0] }), reelHash(event, { photos: shots }), "music, new file");
  assert.deepEqual(reelPhotos({ ...event, city: "Denver" }, opts), [], "no primary, no shots");
  const lead = reelPhotos(event, { ...opts, photos: { ...SHOT_PHOTOS, cities: { Chicago: "chi-two" } } });
  assert.equal(lead[0].slug, "chi-two", "a city's reel lead comes before its holiday-page photo");
  const own = reelPhotos(event, { ...opts, photos: { ...SHOT_PHOTOS, cities: { Chicago: "chi-two" }, items: { [event.id]: "chi-three" } } });
  assert.equal(own[0].slug, "chi-three", "a record's own photo comes first");
});

test("reelForPost refuses a reel whose shots or music changed since it was rendered", () => {
  const opts = { photos: SHOT_PHOTOS, lock: SHOT_LOCK, cityHeroes: { Chicago: "chi-tree" } };
  const shots = reelPhotos(event, opts);
  const track = TRACKS.tracks[0];
  const e = entryFor(event);
  const p = reelPaths(e, event, { photo: shots[0], photos: shots, music: track });
  e.reel = { path: p.mp4, url: p.url, poster_url: p.poster_url, width: 1080, height: 1920, seconds: 10.2, clip: null, photo: "chi-tree", photos: shots.map((x) => x.slug), music: track.id };
  const args = { entry: e, record: event, clips: [], exists: () => true, platform: "instagram", config: ON, photoFor: () => shots[0], photosFor: () => shots, musicPick: () => track };
  const ok = reelForPost(args);
  assert.equal(ok.music, "h1");
  assert.ok(ok.credit.includes("Music:"));
  assert.equal(reelForPost({ ...args, musicPick: () => TRACKS.tracks[1] }), null, "music changed");
  assert.equal(reelForPost({ ...args, musicPick: () => null }), null, "music withdrawn");
  assert.equal(reelForPost({ ...args, photosFor: () => shots.slice(0, 2) }), null, "shots changed");
});

test("Holiday match is word-bounded; photo choice follows the season; one ShareAlike notice scoped to the photos", () => {
  assert.equal(musicMood({ ...event, title: "Central Park fall colors", kicker: "New York City", catch: "Walk the Mall at 71st Street." }), "upbeat", "Street is not tree");
  assert.equal(musicMood({ ...event, title: "Tree lighting", kicker: "", catch: "" }), "holiday");
  const P = { cities: { Chicago: "chi-tree" }, everyday: { Chicago: "chi-two" }, photos: {
    "chi-tree": { status: "approved", shows: "Lit tree", holiday: true }, "chi-two": { status: "approved", shows: "Everyday" } } };
  const lock = { "chi-tree": LOCK["chi-tree"], "chi-two": { ...LOCK["chi-tree"], path: "images/chi-two.webp" } };
  const fest = { ...event, title: "Zoo Lights" };
  const plain = { ...event, title: "Toy and game fair", kicker: "Chicago", catch: "Buy tickets ahead." };
  assert.equal(reelPhoto(fest, { photos: P, lock, cityHeroes: {} }).slug, "chi-tree");
  assert.equal(reelPhoto(plain, { photos: P, lock, cityHeroes: {} }).slug, "chi-two", "no lit tree for a non-holiday event");
  assert.equal(reelPhoto(plain, { photos: { ...P, everyday: {} }, lock, cityHeroes: {} }), null, "only a holiday photo: teal instead");
  assert.equal(reelPhoto(plain, { photos: { ...P, items: { [plain.id]: "chi-tree" } }, lock, cityHeroes: {} }).slug, "chi-tree", "a record's own choice stands");
  const a = { slug: "a", sharealike: true, license: "CC BY-SA 2.0", shows: "A", context: "", artist: "X", license_url: "https://x", source_page: null };
  const b = { ...a, slug: "b", license: "CC BY-SA 4.0" };
  const cap = mediaCaptionCredit({ clip: null, photos: [a, b], music: TRACKS.tracks[0] });
  assert.equal((cap.match(/shared under/g) ?? []).length, 1, "one notice");
  assert.ok(cap.endsWith("Our edit of these photos is shared under CC BY-SA 4.0; the music is not (Mixkit licence)."));
  assert.ok(!mediaCaptionCredit({ clip: null, photos: [{ ...a, sharealike: false, license: "CC BY 2.0" }], music: null }).includes("shared under"));
});

test("Shot order: full-bleed shots first, so a reel never opens on a small framed photo when a full one exists", () => {
  const lock = { "big": { ...LOCK["chi-tree"], path: "images/big.webp", width: 1400, height: 2100 }, "small": { ...LOCK["chi-tree"], path: "images/small.webp", width: 640, height: 480 } };
  const photos = { cities: {}, everyday: {}, items: { [event.id]: "small" }, photos: { small: { status: "approved", shows: "Small", more: ["big"] }, big: { status: "approved", shows: "Big" } } };
  assert.deepEqual(reelPhotos(event, { photos, lock, cityHeroes: {} }).map((x) => `${x.slug}:${x.mode}`), ["big:full", "small:framed"]);
});

test("Held records (failed review) get no reel: the picker skips them and posting refuses them", () => {
  const q = { entries: [entryFor(deal), entryFor(event)] };
  assert.equal(pickReelEntry(q, [deal, event], { hold: [] }).item_id, q.entries.find((e) => e.platforms.instagram).item_id);
  assert.equal(pickReelEntry({ entries: [entryFor(event)] }, [event], { hold: [event.id] }), null);
  const e = withReel(deal);
  assert.equal(reelForPost({ entry: e, record: deal, clips: [], exists: () => true, photoFor: () => null, platform: "instagram", config: { ...ON, hold: [deal.id] } }), null);
  assert.ok(Array.isArray(readReelConfig().hold));
});

test("A framed lead photo: the recorded reel (lead + full-first shots) is the one posting accepts", () => {
  const lock = { "big": { ...LOCK["chi-tree"], path: "images/big.webp", width: 1400, height: 2100 }, "small": { ...LOCK["chi-tree"], path: "images/small.webp", width: 640, height: 480 } };
  const photos = { cities: {}, everyday: {}, items: { [event.id]: "small" }, photos: { small: { status: "approved", shows: "Small", more: ["big"] }, big: { status: "approved", shows: "Big" } } };
  const opts = { photos, lock, cityHeroes: {} };
  const lead = reelPhoto(event, opts);
  const shots = reelPhotos(event, opts);
  assert.equal(lead.slug, "small");
  assert.deepEqual(shots.map((x) => x.slug), ["big", "small"], "no duplicate lead");
  const e = entryFor(event);
  const p = reelPaths(e, event, { photo: lead, photos: shots, music: null });
  e.reel = { path: p.mp4, url: p.url, seconds: 10.5, clip: null, photo: lead.slug, photos: shots.map((x) => x.slug), music: null };
  assert.ok(reelForPost({ entry: e, record: event, clips: [], exists: () => true, platform: "instagram", config: ON, photoFor: () => lead, photosFor: () => shots, musicPick: () => null }));
});

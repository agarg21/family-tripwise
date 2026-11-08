import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  run, GitStore, DirStore, simulatedFetch, SIMULATED_ENV, killSwitchOpen, enabledPlatforms, planPosts, sanitize, receiptKey, checkVariant,
  POSTING_PLATFORMS, linkTarget, SIMULATED_ZERNIO_ENV, idempotencyKey, zernioBody, ZERNIO_API,
  zernioPost, locationFor, readLocations, defaultLocations, isLocationError,
} from "./social-post.mjs";
import { DAILY_CAPS, LIMITS } from "./social-queue.mjs";
import { APPROVED, PAUSED, SITE, entry, queue, at, jpeg, remoteRepo, go, zgo, zreply } from "./social-post-fixtures.mjs";

test("kill switch reads only the D12 status word", () => {
  assert.equal(killSwitchOpen(APPROVED), true);
  assert.equal(killSwitchOpen(PAUSED), false);
  assert.equal(killSwitchOpen("- D11 New URLs — Approved"), false);
  assert.equal(killSwitchOpen(""), false);
});

test("a platform is enabled only when all of its secrets exist", () => {
  assert.deepEqual(enabledPlatforms({}), []);
  assert.deepEqual(enabledPlatforms({ PINTEREST_TOKEN: "t", PINTEREST_BOARD_ID: " " }), []);
  assert.deepEqual(enabledPlatforms({ PINTEREST_TOKEN: "x", PINTEREST_BOARD_ID: "1", META_SYSTEM_USER_TOKEN: "t", META_PAGE_ID: "1" }), ["facebook", "pinterest"]);
  assert.deepEqual(enabledPlatforms(SIMULATED_ENV), ["threads", "facebook", "instagram", "pinterest"]);
  assert.deepEqual(enabledPlatforms({ BLUESKY_HANDLE: "familytripwise.com", BLUESKY_APP_PASSWORD: "x" }), [], "Bluesky was dropped (OWNER D12 revised)");
  assert.ok(!POSTING_PLATFORMS.includes("bluesky") && !("bluesky" in LIMITS) && !("bluesky" in DAILY_CAPS));
});

test("end to end (simulated platforms, real git receipts): each due entry posts once per platform, never twice", async () => {
  const { store, receipts } = remoteRepo();
  const early = await go(store, at("07:00"));
  assert.equal(early.posted.length, 0, "nothing is due before its slot");
  const calls = [];
  const first = await go(store, at("08:00"), { calls });
  assert.deepEqual(first.posted.map((p) => p.key.split("--")[1]).sort(), ["facebook.json", "instagram.json", "pinterest.json", "threads.json"]);
  // No credential ever travels in a URL; Threads carries the link outside the text.
  for (const c of calls) assert.ok(!/access_token=|password=/.test(c.search) && !Object.values(SIMULATED_ENV).some((v) => /TOKEN|PASSWORD/i.test(v) && c.search.includes(v)), `${c.host}${c.path}${c.search}`);
  const pin = calls.find((c) => c.host === "api.pinterest.com" && c.path === "/v5/pins");
  const pv = queue.entries[0].platforms.pinterest;
  assert.deepEqual(pin.body, { board_id: SIMULATED_ENV.PINTEREST_BOARD_ID, title: pv.title, description: pv.text, link: pv.link, alt_text: queue.entries[0].image.alt, media_source: { source_type: "image_url", url: queue.entries[0].image.url } });
  assert.equal(pin.headers.authorization, `Bearer ${SIMULATED_ENV.PINTEREST_TOKEN}`);
  assert.ok(calls.some((c) => c.method === "HEAD" && c.path === "/where-to-stay/fixture-guide.html"), "Pinterest's evergreen link target is checked live, not just the dated page");
  assert.equal(linkTarget(pv.link), `${SITE}/where-to-stay/fixture-guide.html`);
  assert.equal(calls.find((c) => c.path.endsWith("/threads")).body.link_attachment, queue.entries[0].platforms.threads.link);
  assert.equal(calls.find((c) => c.path.endsWith("/media")).body.image_url, queue.entries[0].image.url);
  const again = await go(store, at("08:05"));
  assert.equal(again.posted.length, 0, "a receipt on main blocks any repeat");
  const later = await go(store, at("13:00"));
  assert.deepEqual(later.posted.map((p) => p.key).sort(), ["facebook", "pinterest", "threads"].map((p) => receiptKey("2026-11-05", "2026-11-05-noon", p)));
  const all = receipts();
  assert.equal(all.length, 7);
  assert.ok(all.every((r) => r.status === "posted" && r.remote_id));
});

test("one post per platform per run: a late run catches up slot by slot, not in a burst", async () => {
  const { store } = remoteRepo();
  const r1 = await go(store, at("23:00"));
  assert.ok(r1.posted.every((p) => p.key.includes("morning")));
  const r2 = await go(store, at("23:10"));
  assert.ok(r2.posted.every((p) => p.key.includes("noon")));
  const r3 = await go(store, at("23:20"));
  assert.deepEqual(r3.posted.map((p) => p.key.split("--")[1]).sort(), ["pinterest.json", "threads.json"]);
});

test("expired entries never post, even if never posted before", async () => {
  const { store } = remoteRepo();
  const late = new Date("2026-11-06T00:00:00-05:00");
  const r = await go(store, late, { loadQueue: () => queue });
  assert.ok(!r.posted.some((p) => p.key.includes("evening")));
  const plan = planPosts({ queue, now: late, platforms: ["pinterest"], claimedNames: [] });
  assert.ok(plan.every((p) => p.entry.id !== "2026-11-05-evening"));
});

test("kill switch is checked on the latest main before posting", async () => {
  const { store, setOwner, receipts } = remoteRepo();
  setOwner(PAUSED);
  const r = await go(store, at("08:00"));
  assert.equal(r.posted.length, 0);
  assert.equal(receipts().length, 0);
});

test("daily caps count every claimed receipt", () => {
  const claimed = Array.from({ length: DAILY_CAPS.facebook }, (_, i) => `x${i}--facebook.json`);
  const plan = planPosts({ queue, now: at("23:00"), platforms: ["facebook", "pinterest"], claimedNames: claimed });
  assert.deepEqual(plan.map((p) => p.platform), ["pinterest"]);
});

test("a failed post is recorded with secrets redacted and is never retried", async () => {
  const { store, receipts } = remoteRepo();
  const env = { ...SIMULATED_ENV, THREADS_TOKEN: "secret-threads-token-123" };
  const failing = async (url, init) => {
    if (String(url).includes("threads_publish")) return new Response(JSON.stringify({ error: { message: "boom secret-threads-token-123 access_token=abc" } }), { status: 500, headers: { "content-type": "application/json" } });
    return simulatedFetch()(url, init);
  };
  const r = await go(store, at("08:00"), { env, fetch: failing });
  assert.equal(r.failed.length, 1);
  const rec = receipts().find((x) => x.platform === "threads");
  assert.equal(rec.status, "failed");
  assert.ok(!rec.error.includes("secret-threads-token-123") && !rec.error.includes("abc"), rec.error);
  const again = await go(store, at("08:30"), { env });
  assert.ok(!again.posted.some((p) => p.key.includes("morning--threads")), "a failed attempt is never reposted automatically");
  assert.equal(sanitize("password: hunter2", {}), "password=[redacted]");
});

test("nothing is claimed when the page or card is not live, or the queue is invalid", async () => {
  const { store, receipts } = remoteRepo();
  const down = async (url, init) => (String(url).startsWith(SITE) ? new Response("", { status: 404, headers: { "content-type": "text/html" } }) : simulatedFetch()(url, init));
  const r = await go(store, at("08:00"), { fetch: down });
  assert.equal(r.posted.length, 0);
  assert.equal(r.skipped.length, 4);
  const bad = await go(store, at("08:00"), { validate: () => ["record changed"] });
  assert.equal(bad.posted.length, 0);
  assert.equal(receipts().length, 0);
});

test("Pinterest skips (unclaimed) when only its evergreen link target is down", async () => {
  const { store, receipts } = remoteRepo();
  const guideDown = async (url, init) => (String(url).startsWith(`${SITE}/where-to-stay/fixture-guide.html`) ? new Response("", { status: 404, headers: { "content-type": "text/html" } }) : simulatedFetch()(url, init));
  const r = await go(store, at("08:00"), { fetch: guideDown });
  assert.deepEqual(r.posted.map((p) => p.key.split("--")[1]).sort(), ["facebook.json", "instagram.json", "threads.json"]);
  assert.deepEqual(r.skipped.map((s) => s.key), [receiptKey("2026-11-05", "2026-11-05-morning", "pinterest")]);
  const recs = receipts();
  assert.ok(!recs.some((x) => x.platform === "pinterest"));
  assert.equal(recs.find((x) => x.platform === "threads").link, queue.entries[0].platforms.threads.link, "receipts record the posted link");
});

test("variants with a URL in Threads text, a non-site link or a bad Pinterest title/alt are refused", () => {
  const e = entry("x", "2026-11-05T07:30:00-05:00", "2026-11-08T00:00:00-05:00");
  assert.deepEqual(checkVariant("threads", e), []);
  assert.deepEqual(checkVariant("pinterest", e), []);
  e.platforms.threads.text += "\nhttps://familytripwise.com/deals";
  e.platforms.facebook.link = "https://example.com/";
  assert.ok(checkVariant("threads", e).length > 0);
  assert.ok(checkVariant("facebook", e).length > 0);
  const t = entry("y", "2026-11-05T07:30:00-05:00", "2026-11-08T00:00:00-05:00");
  t.platforms.pinterest.title = "x".repeat(LIMITS.pinterest.title + 1);
  assert.ok(checkVariant("pinterest", t).some((p) => /title/.test(p)));
  const a = entry("z", "2026-11-05T07:30:00-05:00", "2026-11-08T00:00:00-05:00");
  a.image.alt = "x".repeat(501);
  assert.ok(checkVariant("pinterest", a).some((p) => /alt text/.test(p)));
});

test("Pinterest: a failed board check (expired token, wrong board) skips without claiming, so it can post later", async () => {
  const { store, receipts } = remoteRepo();
  const env = { ...SIMULATED_ENV, PINTEREST_TOKEN: "expired-pinterest-token" };
  const r = await go(store, at("08:00"), { env });
  assert.equal(r.posted.filter((p) => p.key.endsWith("--pinterest.json")).length, 0);
  const skip = r.skipped.find((s) => s.key.endsWith("--pinterest.json"));
  assert.match(skip.reason, /pinterest board check answered HTTP 401/);
  assert.ok(!skip.reason.includes("expired-pinterest-token"));
  assert.ok(!receipts().some((x) => x.platform === "pinterest"), "no receipt claimed");
  const fixed = await go(store, at("08:30"));
  assert.deepEqual(fixed.posted.map((p) => p.key), [receiptKey("2026-11-05", "2026-11-05-morning", "pinterest")]);
  assert.match(fixed.posted[0].url, /^https:\/\/www\.pinterest\.com\/pin\/simpin\d+\/$/);
});

test("dry-run store writes receipts only to its scratch directory", async () => {
  const dir = mkdtempSync(join(tmpdir(), "social-dry-"));
  const r = await go(new DirStore(dir, APPROVED), at("08:00"));
  assert.equal(r.posted.length, 4);
  assert.equal(readdirSync(join(dir, "ops/social-receipts/2026-11-05")).length, 4);
});

test("workflow posts only from main with secrets, one run at a time, and defaults manual runs to dry run", () => {
  const wf = readFileSync(new URL("../.github/workflows/social-post.yml", import.meta.url), "utf8");
  assert.match(wf, /schedule:/);
  // The operator's hourly ops/STATE.md pushes also start a posting run; nothing else on push does.
  assert.match(wf, /push:\s*\n\s*branches: \[main\]\s*\n\s*paths: \["ops\/STATE\.md"\]/);
  // ...but only the hourly claim commit runs the job; the run's other STATE commits skip.
  assert.match(wf, /\n\s*if: "github\.event_name != 'push' \|\| startsWith\(github\.event\.head_commit\.message, 'ops: claim run'\)"/);
  assert.doesNotMatch(wf, /paths: \[[^\]]*social-receipts/, "receipt commits never retrigger posting");
  assert.doesNotMatch(wf, /pull_request/);
  assert.match(wf, /concurrency:\s*\n\s*group: social-post\s*\n\s*cancel-in-progress: false/);
  assert.match(wf, /ref: main/);
  assert.match(wf, /default: true/);
  for (const s of ["ZERNIO_API_KEY", "META_SYSTEM_USER_TOKEN", "META_PAGE_ID", "IG_USER_ID", "THREADS_USER_ID", "THREADS_TOKEN", "PINTEREST_TOKEN", "PINTEREST_BOARD_ID"]) assert.match(wf, new RegExp(`secrets\\.${s}\\b`));
  assert.doesNotMatch(wf, /BLUESKY/);
  assert.doesNotMatch(wf, /echo[^\n]*secrets\./);
});

test("every workflow file is valid YAML (an unquoted 'ops: claim run' broke posting on 2026-11-03)", async () => {
  const { readdirSync } = await import("node:fs");
  const dir = new URL("../.github/workflows/", import.meta.url);
  for (const f of readdirSync(dir).filter((n) => /\.ya?ml$/.test(n))) {
    const text = readFileSync(new URL(f, dir), "utf8");
    for (const line of text.split("\n")) {
      const m = line.match(/^\s*(?:-\s+)?[\w-]+:\s+(.*)$/);
      if (!m) continue;
      const v = m[1].trim();
      if (!v || /^["'|>&*!{[#]/.test(v)) continue;
      assert.ok(!/:\s/.test(v.replace(/\s+#.*$/, "")), `${f}: unquoted value contains ": " -> ${line.trim()}`);
    }
  }
});

test("G15: Instagram body carries the photo tag only when the variant has one", () => {
  const entry = { image: { url: "https://familytripwise.com/social/cards/x.jpg" } };
  const tagged = zernioBody({ platform: "instagram", entry, variant: { text: "t", user_tags: [{ username: "brand", x: 0.5, y: 0.15 }] }, accountId: "a", photoTags: true });
  assert.equal(zernioBody({ platform: "instagram", entry, variant: { text: "t", user_tags: [{ username: "brand", x: 0.5, y: 0.15 }] }, accountId: "a" }).platforms[0].platformSpecificData, undefined, "off until the field is confirmed (O30)");
  assert.deepEqual(tagged.platforms[0].platformSpecificData, { userTags: [{ username: "brand", x: 0.5, y: 0.15 }] });
  assert.equal(zernioBody({ platform: "instagram", entry, variant: { text: "t" }, accountId: "a" }).platforms[0].platformSpecificData, undefined);
});

test("Instagram location tag: city from ops/media/locations.json, Instagram only, never 'near', deals only when listed", () => {
  const loc = { cities: { "New York City": { id: "108424279189115" }, Orlando: { id: "108288992526695" }, Bad: { id: "x1" } }, items: { "seaworld-orlando-2027-fun-card": "Orlando" } };
  assert.equal(locationFor({ id: "e", kind: "this-week", city: "New York City", title: "Meet the Tree" }, loc), "108424279189115");
  assert.equal(locationFor({ id: "e", kind: "this-week", city: "Orlando", title: "Gaylord Palms ICE! near Orlando" }, loc), null);
  assert.equal(locationFor({ id: "e", kind: "this-week", city: "Chicago", title: "ZooLights" }, loc), null, "unlisted city");
  assert.equal(locationFor({ id: "e", kind: "this-week", city: "Bad", title: "x" }, loc), null, "digits only");
  assert.equal(locationFor({ id: "seaworld-orlando-2027-fun-card", kind: "deal", title: "SeaWorld" }, loc), "108288992526695");
  assert.equal(locationFor({ id: "six-flags-x", kind: "deal", city: "San Antonio", title: "Six Flags" }, loc), null);
  assert.equal(locationFor({ id: "n", kind: "this-week", news: true, city: "New York City", title: "JetBlue bag fees" }, loc), null, "news is not a place");
  const file = readLocations();
  for (const [city, c] of Object.entries(file.cities)) {
    assert.match(c.id, /^\d+$/, city);
    assert.match(c.evidence, /^https:\/\/.+facebook\.com\/.+\/\d+$/, `${city} needs an evidence URL ending in its id`);
    assert.ok(c.evidence.endsWith(c.id), city);
  }
  for (const city of Object.values(file.items)) assert.ok(file.cities[city], city);
  const look = defaultLocations({ locations: loc, records: [{ id: "a", kind: "this-week", city: "New York City", title: "t" }] });
  assert.equal(look({ item_id: "a" }, "instagram"), "108424279189115");
  assert.equal(look({ item_id: "a" }, "facebook"), null);
  assert.equal(defaultLocations({ locations: null, records: null })({ item_id: "nope" }, "threads"), null);
});

test("Instagram location tag rides in platformSpecificData on images and Reels, never on Facebook", () => {
  const entry = { image: { url: "https://familytripwise.com/social/cards/x.jpg" } };
  const reel = { url: "https://familytripwise.com/social/reels/x.mp4", credit: "c" };
  assert.deepEqual(zernioBody({ platform: "instagram", entry, variant: { text: "t" }, accountId: "a", locationId: "123" }).platforms[0].platformSpecificData, { locationId: "123" });
  const r = zernioBody({ platform: "instagram", entry, variant: { text: "t" }, accountId: "a", reel, locationId: "123" });
  assert.deepEqual(r.platforms[0].platformSpecificData, { locationId: "123" });
  assert.equal(r.mediaItems[0].type, "video");
  const fb = zernioBody({ platform: "facebook", entry, variant: { text: "t", link: "https://familytripwise.com/x" }, accountId: "a", reel, locationId: "123" });
  assert.deepEqual(fb.platforms[0].platformSpecificData, { contentType: "reel" });
});

test("a rejected location tag is retried once without it; other failures are not retried", async () => {
  const calls = [];
  const fake = (fail) => async (url, init) => {
    const body = JSON.parse(init.body);
    calls.push({ key: init.headers["idempotency-key"], loc: body.platforms[0].platformSpecificData?.locationId ?? null });
    if (body.platforms[0].platformSpecificData?.locationId) return new Response(JSON.stringify({ error: fail }), { status: 400, headers: { "content-type": "application/json" } });
    return new Response(JSON.stringify({ post: { _id: "p1", status: "published", platforms: [{ platform: "instagram", status: "published", platformPostUrl: "https://instagram.com/p/x" }] } }), { status: 201 });
  };
  const args = { platform: "instagram", entry: { image: { url: "https://familytripwise.com/social/cards/x.jpg" } }, variant: { text: "t" }, env: { ZERNIO_API_KEY: "k" }, key: "2026-11-08/a--instagram", accountId: "a", locationId: "123", sleep: async () => {} };
  const out = await zernioPost({ ...args, fetch: fake("Invalid location_id: Page has no location data") });
  assert.equal(out.remote_id, "p1");
  assert.match(out.location_dropped, /^123: /);
  assert.equal(out.location_id, undefined);
  assert.equal(calls.length, 2);
  assert.notEqual(calls[0].key, calls[1].key, "fresh idempotency key for the untagged retry");
  assert.equal(calls[1].loc, null);
  calls.length = 0;
  await assert.rejects(zernioPost({ ...args, fetch: fake("Media URL not reachable") }), /Media URL/);
  assert.equal(calls.length, 1, "no retry for other errors");
  assert.ok(isLocationError("bad location") && !isLocationError("timeout"));
  // Still processing when polling ends: not a definite failure, so no retry even if the text says location.
  calls.length = 0;
  const pending = async (url, init) => { calls.push(1); return new Response(JSON.stringify({ post: { _id: "p2", status: "publishing", platforms: [{ platform: "instagram", status: "publishing", errorMessage: "waiting on location" }] } }), { status: 201 }); };
  await assert.rejects(zernioPost({ ...args, fetch: pending }), /publishing/);
  assert.ok(calls.length >= 1 && calls.length < 60);
  const firstPosts = calls.length;
  assert.ok(firstPosts > 0);
});

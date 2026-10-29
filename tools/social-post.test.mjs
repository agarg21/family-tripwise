import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  run, GitStore, DirStore, simulatedFetch, SIMULATED_ENV, killSwitchOpen, enabledPlatforms, planPosts, sanitize, receiptKey, checkVariant,
  POSTING_PLATFORMS, linkTarget, SIMULATED_ZERNIO_ENV, idempotencyKey, zernioBody, ZERNIO_API,
} from "./social-post.mjs";
import { DAILY_CAPS, LIMITS } from "./social-queue.mjs";

const APPROVED = "# OWNER\n- D12 Social and newsletter (2026-10-28, owner) — Approved: posts. Kill switch: change \"Approved\" here to \"Paused\" to stop all posting.\n";
const PAUSED = APPROVED.replace("— Approved", "— Paused");
const SITE = "https://familytripwise.com";

// Frozen fixture queue (never the live queue), so data refreshes cannot break these tests.
function entry(slug, scheduled, expires, platforms = ["threads", "facebook", "instagram", "pinterest"]) {
  const id = `2026-11-05-${slug}`;
  const text = `Fixture ${slug} title\n\nKids under 4 stay free on listed dates.\n\nChecked on the official page November 4.`;
  return {
    id, item_id: slug, kind: "deal", scheduled_at: scheduled, expires_at: expires,
    source: { official_url: "https://www.example.com/terms", label: "Fixture terms", observed_on: "2026-11-04" },
    page: `${SITE}/deals/${slug}.html`,
    image: { path: `site/social/cards/${slug}-0123456789.jpg`, url: `${SITE}/social/cards/${slug}-0123456789.jpg`, width: 1080, height: 1350, alt: `Family Deal Check. Fixture ${slug}.` },
    platforms: Object.fromEntries(platforms.map((p) => [p, p === "pinterest"
      ? { title: `Fixture ${slug} title`, text, link: `${SITE}/where-to-stay/fixture-guide.html?utm_source=${p}#deals` }
      : { text, link: `${SITE}/deals/${slug}.html?utm_source=${p}` }])),
  };
}
const queue = {
  date: "2026-11-05",
  entries: [
    entry("morning", "2026-11-05T07:30:00-05:00", "2026-11-08T00:00:00-05:00"),
    entry("noon", "2026-11-05T12:30:00-05:00", "2026-11-09T00:00:00-05:00", ["threads", "facebook", "pinterest"]),
    entry("evening", "2026-11-05T19:30:00-05:00", "2026-11-06T00:00:00-05:00", ["threads", "pinterest"]),
  ],
};
const at = (hhmm) => new Date(`2026-11-05T${hhmm}:00-05:00`);
const jpeg = Buffer.from([0xff, 0xd8, 0xff, 0xd9]);

function remoteRepo(owner = APPROVED) {
  const dir = mkdtempSync(join(tmpdir(), "social-post-test-"));
  const g = (cwd, ...a) => execFileSync("git", a, { cwd, stdio: "pipe" });
  g(dir, "init", "-q", "--bare", "-b", "main", "remote.git");
  g(dir, "clone", "-q", join(dir, "remote.git"), "seed");
  const seed = join(dir, "seed");
  for (const c of [["user.name", "test"], ["user.email", "test@example.com"]]) g(seed, "config", ...c);
  mkdirSync(join(seed, "ops"), { recursive: true });
  writeFileSync(join(seed, "ops/OWNER.md"), owner);
  g(seed, "add", "."); g(seed, "commit", "-qm", "seed"); g(seed, "push", "-q", "origin", "HEAD:main");
  g(dir, "clone", "-q", join(dir, "remote.git"), "work");
  const work = join(dir, "work");
  for (const c of [["user.name", "test"], ["user.email", "test@example.com"]]) g(work, "config", ...c);
  const receipts = () => {
    g(seed, "pull", "-q", "--ff-only", "origin", "main");
    const d = join(seed, "ops/social-receipts/2026-11-05");
    try { return readdirSync(d).sort().map((n) => JSON.parse(readFileSync(join(d, n), "utf8"))); } catch { return []; }
  };
  const setOwner = (text) => { g(seed, "pull", "-q", "--ff-only", "origin", "main"); writeFileSync(join(seed, "ops/OWNER.md"), text); g(seed, "commit", "-qam", "owner"); g(seed, "push", "-q", "origin", "HEAD:main"); };
  return { store: new GitStore(work), receipts, setOwner };
}

const go = (store, now, over = {}) => {
  const calls = over.calls ?? [];
  return run({
    now, clock: () => now.getTime(), env: SIMULATED_ENV, store, fetch: simulatedFetch(calls), sleep: async () => {},
    readImage: () => jpeg, loadQueue: (d) => (d === queue.date ? queue : null), validate: () => [], log: () => {}, ...over,
  });
};

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
  assert.doesNotMatch(wf, /pull_request/);
  assert.match(wf, /concurrency:\s*\n\s*group: social-post\s*\n\s*cancel-in-progress: false/);
  assert.match(wf, /ref: main/);
  assert.match(wf, /default: true/);
  for (const s of ["ZERNIO_API_KEY", "META_SYSTEM_USER_TOKEN", "META_PAGE_ID", "IG_USER_ID", "THREADS_USER_ID", "THREADS_TOKEN", "PINTEREST_TOKEN", "PINTEREST_BOARD_ID"]) assert.match(wf, new RegExp(`secrets\\.${s}\\b`));
  assert.doesNotMatch(wf, /BLUESKY/);
  assert.doesNotMatch(wf, /echo[^\n]*secrets\./);
});

// ---------- Zernio route (QUEUE G08) ----------

const zgo = (store, now, over = {}) => go(store, now, { env: SIMULATED_ZERNIO_ENV, ...over });
const zreply = (status, body) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

test("Zernio: with ZERNIO_API_KEY every platform posts through Zernio once, with the right body, never twice", async () => {
  const { store, receipts } = remoteRepo();
  const calls = [];
  const first = await zgo(store, at("08:00"), { calls });
  assert.deepEqual(first.posted.map((p) => p.key.split("--")[1]).sort(), ["facebook.json", "instagram.json", "pinterest.json", "threads.json"]);
  assert.ok(!calls.some((c) => /graph\.|pinterest\.com/.test(c.host)), "no direct platform API is called on the Zernio route");
  const posts = calls.filter((c) => c.host === "zernio.com" && c.path === "/api/v1/posts");
  assert.equal(posts.length, 4);
  for (const c of posts) {
    assert.equal(c.headers.authorization, `Bearer ${SIMULATED_ZERNIO_ENV.ZERNIO_API_KEY}`);
    assert.ok(!c.search.includes(SIMULATED_ZERNIO_ENV.ZERNIO_API_KEY), "the key never travels in a URL");
    const platform = c.body.platforms[0].platform;
    assert.equal(c.headers["idempotency-key"], idempotencyKey(receiptKey("2026-11-05", "2026-11-05-morning", platform)));
  }
  const e = queue.entries[0];
  const byP = Object.fromEntries(posts.map((c) => [c.body.platforms[0].platform, c.body]));
  assert.equal(byP.threads.content, e.platforms.threads.text);
  assert.equal(byP.threads.platforms[0].platformSpecificData.firstComment, `Details and the official-source link: ${e.platforms.threads.link}`);
  assert.equal(byP.facebook.content, `${e.platforms.facebook.text}\n\n${e.platforms.facebook.link}`);
  assert.deepEqual(byP.instagram.mediaItems, [{ type: "image", url: e.image.url }]);
  assert.deepEqual(byP.pinterest.platforms[0].platformSpecificData, { boardId: "simboard1", title: e.platforms.pinterest.title, link: e.platforms.pinterest.link });
  const recs = receipts();
  assert.ok(recs.every((r) => r.status === "posted" && r.via === "zernio" && /^[0-9a-f]{24}$/.test(r.remote_id) && r.url));
  const again = await zgo(store, at("08:05"));
  assert.equal(again.posted.length, 0, "a receipt on main blocks any repeat");
});

test("Zernio: idempotency keys are stable UUIDs per entry and platform", () => {
  const k = idempotencyKey("ops/social-receipts/2026-11-05/a--threads.json");
  assert.match(k, /^[0-9a-f]{8}-[0-9a-f]{4}-5[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  assert.equal(k, idempotencyKey("ops/social-receipts/2026-11-05/a--threads.json"));
  assert.notEqual(k, idempotencyKey("ops/social-receipts/2026-11-05/a--facebook.json"));
});

test("Zernio: a platform with no connected account, or two, is not posted and nothing is claimed for it", async () => {
  const { store, receipts } = remoteRepo();
  const accounts = async (url, init) => (String(url).startsWith(`${ZERNIO_API}/accounts?`)
    ? zreply(200, { accounts: [
      { _id: "simaccthreads", platform: "threads", isActive: true },
      { _id: "simaccfacebook", platform: "facebook", isActive: true }, { _id: "other", platform: "facebook", isActive: true },
      { _id: "simaccinstagram", platform: "instagram", isActive: false },
      { _id: "x", platform: "twitter", isActive: true },
    ] })
    : simulatedFetch()(url, init));
  const r = await zgo(store, at("08:00"), { fetch: accounts });
  assert.deepEqual(r.posted.map((p) => p.key.split("--")[1]), ["threads.json"]);
  assert.ok(r.skipped.some((s) => /facebook: 2 connected Zernio accounts/.test(s.reason)));
  assert.deepEqual(r.not_connected, ["instagram", "pinterest"], "platforms with no connected account are reported, ambiguous ones are not repeated");
  assert.deepEqual(receipts().map((x) => x.platform), ["threads"]);
});

test("Zernio: a failed account lookup posts nothing, claims nothing, redacts the key and fails the run", async () => {
  const { store, receipts } = remoteRepo();
  const env = { ZERNIO_API_KEY: "sk_live_secret_zernio_key" };
  const down = async (url) => zreply(401, { error: "Invalid key sk_live_secret_zernio_key", code: "unauthorized" });
  const r = await zgo(store, at("08:00"), { env, fetch: down });
  assert.equal(r.posted.length, 0);
  assert.equal(r.failed.length, 1);
  assert.ok(!r.failed[0].error.includes("sk_live_secret_zernio_key"), r.failed[0].error);
  assert.equal(receipts().length, 0);
});

test("Zernio: Pinterest board must be unambiguous (secret or the only public board); otherwise skipped unclaimed", async () => {
  const twoBoards = async (url, init) => (String(url).endsWith("/pinterest-boards")
    ? zreply(200, { boards: [{ id: "b1", name: "A", privacy: "PUBLIC" }, { id: "b2", name: "B", privacy: "PUBLIC" }, { id: "b3", name: "C", privacy: "SECRET" }] })
    : simulatedFetch()(url, init));
  const a = remoteRepo();
  const r = await zgo(a.store, at("08:00"), { fetch: twoBoards });
  assert.ok(!r.posted.some((p) => p.key.endsWith("--pinterest.json")));
  assert.match(r.skipped.find((s) => s.key?.endsWith("--pinterest.json")).reason, /2 public boards; set the PINTEREST_BOARD_ID secret/);
  assert.ok(!a.receipts().some((x) => x.platform === "pinterest"));
  const b = remoteRepo();
  const calls = [];
  const wrong = await zgo(b.store, at("08:00"), { env: { ...SIMULATED_ZERNIO_ENV, PINTEREST_BOARD_ID: "nope" }, calls });
  assert.match(wrong.skipped.find((s) => s.key?.endsWith("--pinterest.json")).reason, /not one of the connected Pinterest account's boards/);
  const right = await zgo(b.store, at("08:30"), { env: { ...SIMULATED_ZERNIO_ENV, PINTEREST_BOARD_ID: "simboard1" } });
  assert.deepEqual(right.posted.map((p) => p.key.split("--")[1]), ["pinterest.json"]);
});

test("Zernio: a partial (207) or non-published result is recorded failed with the post id and never retried", async () => {
  const { store, receipts } = remoteRepo();
  const partial = async (url, init) => {
    if (String(url) === `${ZERNIO_API}/posts` && JSON.parse(init.body).platforms[0].platform === "instagram") {
      return zreply(207, { post: { _id: "65f1c0a9e2b5af0012abcdef", status: "failed", platforms: [{ platform: "instagram", status: "failed", errorMessage: "Media aspect ratio not supported" }] } });
    }
    return simulatedFetch()(url, init);
  };
  const r = await zgo(store, at("08:00"), { fetch: partial });
  assert.equal(r.failed.length, 1);
  const rec = receipts().find((x) => x.platform === "instagram");
  assert.equal(rec.status, "failed");
  assert.equal(rec.via, "zernio");
  assert.match(rec.error, /65f1c0a9e2b5af0012abcdef.*failed\/failed Media aspect ratio/);
  const again = await zgo(store, at("12:31"));
  assert.ok(!again.posted.some((p) => p.key.includes("morning--instagram")));
});

test("Zernio body: Threads link rides in the first comment, never in the post text", () => {
  const e = entry("b", "2026-11-05T07:30:00-05:00", "2026-11-08T00:00:00-05:00");
  const body = zernioBody({ platform: "threads", entry: e, variant: e.platforms.threads, accountId: "a" });
  assert.ok(!/https?:\/\//.test(body.content));
  assert.equal(body.publishNow, true);
  assert.equal(body.mediaItems, undefined);
});

test("Zernio body: Facebook pins the Page only when META_PAGE_ID is set; unknown board privacy is not public", () => {
  const e = entry("c", "2026-11-05T07:30:00-05:00", "2026-11-08T00:00:00-05:00");
  assert.equal(zernioBody({ platform: "facebook", entry: e, variant: e.platforms.facebook, accountId: "a" }).platforms[0].platformSpecificData, undefined);
  assert.deepEqual(zernioBody({ platform: "facebook", entry: e, variant: e.platforms.facebook, accountId: "a", pageId: "123" }).platforms[0].platformSpecificData, { pageId: "123" });
});

test("Zernio: a board without a stated privacy is not treated as public", async () => {
  const { store } = remoteRepo();
  const noPrivacy = async (url, init) => (String(url).endsWith("/pinterest-boards") ? zreply(200, { boards: [{ id: "b1", name: "A" }] }) : simulatedFetch()(url, init));
  const r = await zgo(store, at("08:00"), { fetch: noPrivacy });
  assert.match(r.skipped.find((s) => s.key?.endsWith("--pinterest.json")).reason, /0 public boards/);
});

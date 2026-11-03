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
import { APPROVED, PAUSED, SITE, entry, queue, at, jpeg, remoteRepo, go, zgo, zreply } from "./social-post-fixtures.mjs";

// ---------- Zernio route (QUEUE G08) ----------

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

test("Zernio: an Instagram post still 'publishing' is polled until published, then recorded posted (no false failure)", async () => {
  const { store, receipts } = remoteRepo();
  let polls = 0;
  const slow = async (url, init) => {
    if (String(url) === `${ZERNIO_API}/posts` && JSON.parse(init.body).platforms[0].platform === "instagram") {
      return zreply(200, { post: { _id: "65f1c0a9e2b5af0012abc111", status: "publishing", platforms: [{ platform: "instagram", status: "processing" }] } });
    }
    if (String(url) === `${ZERNIO_API}/posts/65f1c0a9e2b5af0012abc111`) {
      polls += 1;
      assert.match(String(init?.headers?.authorization ?? ""), /^Bearer /, "status checks carry the API key header");
      if (polls === 1) return zreply(503, { error: "busy" }); // a failed status check keeps polling
      return zreply(200, { post: { _id: "65f1c0a9e2b5af0012abc111", status: polls < 3 ? "publishing" : "published", platforms: [{ platform: "instagram", status: polls < 3 ? "processing" : "published", platformPostUrl: "https://www.instagram.com/p/abc/" }] } });
    }
    return simulatedFetch()(url, init);
  };
  const r = await zgo(store, at("08:00"), { fetch: slow });
  assert.equal(polls, 3, "polled until published");
  const rec = receipts().find((x) => x.platform === "instagram");
  assert.equal(rec.status, "posted");
  assert.equal(rec.url, "https://www.instagram.com/p/abc/");
  assert.equal(r.failed.length, 0);
});

test("Zernio: a post that never settles is recorded failed after the polls and never retried", async () => {
  const { store, receipts } = remoteRepo();
  let polls = 0;
  const stuck = async (url, init) => {
    if (String(url) === `${ZERNIO_API}/posts` && JSON.parse(init.body).platforms[0].platform === "instagram") return zreply(200, { post: { _id: "65f1c0a9e2b5af0012abc222", status: "publishing", platforms: [{ platform: "instagram", status: "processing" }] } });
    if (String(url) === `${ZERNIO_API}/posts/65f1c0a9e2b5af0012abc222`) { polls += 1; return zreply(200, { post: { _id: "65f1c0a9e2b5af0012abc222", status: "publishing", platforms: [{ platform: "instagram", status: "processing" }] } }); }
    return simulatedFetch()(url, init);
  };
  await zgo(store, at("08:00"), { fetch: stuck });
  assert.equal(polls, 12);
  assert.equal(receipts().find((x) => x.platform === "instagram").status, "failed");
  const again = await zgo(store, at("12:31"), { fetch: stuck });
  assert.ok(!again.posted.some((p) => p.key.includes("instagram")), "a failed post is never retried");
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

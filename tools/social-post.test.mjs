import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  run, GitStore, DirStore, simulatedFetch, SIMULATED_ENV, killSwitchOpen, enabledPlatforms, planPosts, sanitize, receiptKey, checkVariant,
} from "./social-post.mjs";
import { DAILY_CAPS } from "./social-queue.mjs";

const APPROVED = "# OWNER\n- D12 Social and newsletter (2026-10-28, owner) — Approved: posts. Kill switch: change \"Approved\" here to \"Paused\" to stop all posting.\n";
const PAUSED = APPROVED.replace("— Approved", "— Paused");
const SITE = "https://familytripwise.com";

// Frozen fixture queue (never the live queue), so data refreshes cannot break these tests.
function entry(slug, scheduled, expires, platforms = ["bluesky", "threads", "facebook", "instagram"]) {
  const id = `2026-11-05-${slug}`;
  const text = `Fixture ${slug} title\n\nKids under 4 stay free on listed dates.\n\nChecked on the official page November 4.`;
  return {
    id, item_id: slug, kind: "deal", scheduled_at: scheduled, expires_at: expires,
    source: { official_url: "https://www.example.com/terms", label: "Fixture terms", observed_on: "2026-11-04" },
    page: `${SITE}/deals/${slug}.html`,
    image: { path: `site/social/cards/${slug}-0123456789.jpg`, url: `${SITE}/social/cards/${slug}-0123456789.jpg`, width: 1080, height: 1350, alt: `Family Deal Check. Fixture ${slug}.` },
    platforms: Object.fromEntries(platforms.map((p) => [p, { text, link: `${SITE}/deals/${slug}.html?utm_source=${p}` }])),
  };
}
const queue = {
  date: "2026-11-05",
  entries: [
    entry("morning", "2026-11-05T07:30:00-05:00", "2026-11-08T00:00:00-05:00"),
    entry("noon", "2026-11-05T12:30:00-05:00", "2026-11-09T00:00:00-05:00", ["bluesky", "threads", "facebook"]),
    entry("evening", "2026-11-05T19:30:00-05:00", "2026-11-06T00:00:00-05:00", ["bluesky", "threads"]),
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
  assert.deepEqual(enabledPlatforms({ BLUESKY_HANDLE: "familytripwise.com", BLUESKY_APP_PASSWORD: " " }), []);
  assert.deepEqual(enabledPlatforms({ BLUESKY_HANDLE: "familytripwise.com", BLUESKY_APP_PASSWORD: "x", META_SYSTEM_USER_TOKEN: "t", META_PAGE_ID: "1" }), ["bluesky", "facebook"]);
  assert.deepEqual(enabledPlatforms(SIMULATED_ENV), ["bluesky", "threads", "facebook", "instagram"]);
});

test("end to end (simulated platforms, real git receipts): each due entry posts once per platform, never twice", async () => {
  const { store, receipts } = remoteRepo();
  const early = await go(store, at("07:00"));
  assert.equal(early.posted.length, 0, "nothing is due before its slot");
  const calls = [];
  const first = await go(store, at("08:00"), { calls });
  assert.deepEqual(first.posted.map((p) => p.key.split("--")[1]).sort(), ["bluesky.json", "facebook.json", "instagram.json", "threads.json"]);
  // No credential ever travels in a URL; Bluesky/Threads carry the link outside the text.
  for (const c of calls) assert.ok(!/access_token=|password=/.test(c.search), `${c.host}${c.path}${c.search}`);
  const bsky = calls.find((c) => c.path.endsWith("createRecord")).body.record;
  assert.equal(bsky.embed.external.uri, queue.entries[0].platforms.bluesky.link);
  assert.ok(!bsky.text.includes("http"));
  assert.equal(calls.find((c) => c.path.endsWith("/threads")).body.link_attachment, queue.entries[0].platforms.threads.link);
  assert.equal(calls.find((c) => c.path.endsWith("/media")).body.image_url, queue.entries[0].image.url);
  const again = await go(store, at("08:05"));
  assert.equal(again.posted.length, 0, "a receipt on main blocks any repeat");
  const later = await go(store, at("13:00"));
  assert.deepEqual(later.posted.map((p) => p.key).sort(), ["bluesky", "facebook", "threads"].map((p) => receiptKey("2026-11-05", "2026-11-05-noon", p)));
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
  assert.deepEqual(r3.posted.map((p) => p.key.split("--")[1]).sort(), ["bluesky.json", "threads.json"]);
});

test("expired entries never post, even if never posted before", async () => {
  const { store } = remoteRepo();
  const late = new Date("2026-11-06T00:00:00-05:00");
  const r = await go(store, late, { loadQueue: () => queue });
  assert.ok(!r.posted.some((p) => p.key.includes("evening")));
  const plan = planPosts({ queue, now: late, platforms: ["bluesky"], claimedNames: [] });
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
  const plan = planPosts({ queue, now: at("23:00"), platforms: ["facebook", "bluesky"], claimedNames: claimed });
  assert.deepEqual(plan.map((p) => p.platform), ["bluesky"]);
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

test("variants with a URL in Bluesky/Threads text or a non-site link are refused", () => {
  const e = entry("x", "2026-11-05T07:30:00-05:00", "2026-11-08T00:00:00-05:00");
  e.platforms.bluesky.text += "\nhttps://familytripwise.com/deals";
  e.platforms.facebook.link = "https://example.com/";
  assert.ok(checkVariant("bluesky", e).length > 0);
  assert.ok(checkVariant("facebook", e).length > 0);
  assert.deepEqual(checkVariant("threads", e), []);
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
  for (const s of ["BLUESKY_HANDLE", "BLUESKY_APP_PASSWORD", "META_SYSTEM_USER_TOKEN", "META_PAGE_ID", "IG_USER_ID", "THREADS_USER_ID", "THREADS_TOKEN"]) assert.match(wf, new RegExp(`secrets\\.${s}\\b`));
  assert.doesNotMatch(wf, /echo[^\n]*secrets\./);
});

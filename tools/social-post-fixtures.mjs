// Shared fixtures for social-post*.test.mjs (split so the slow real-git suites run in parallel processes).
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { run, GitStore, simulatedFetch, SIMULATED_ENV, SIMULATED_ZERNIO_ENV } from "./social-post.mjs";

export const APPROVED = "# OWNER\n- D12 Social and newsletter (2026-10-28, owner) — Approved: posts. Kill switch: change \"Approved\" here to \"Paused\" to stop all posting.\n";
export const PAUSED = APPROVED.replace("— Approved", "— Paused");
export const SITE = "https://familytripwise.com";

// Frozen fixture queue (never the live queue), so data refreshes cannot break these tests.
export function entry(slug, scheduled, expires, platforms = ["threads", "facebook", "instagram", "pinterest"]) {
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
export const queue = {
  date: "2026-11-05",
  entries: [
    entry("morning", "2026-11-05T07:30:00-05:00", "2026-11-08T00:00:00-05:00"),
    entry("noon", "2026-11-05T12:30:00-05:00", "2026-11-09T00:00:00-05:00", ["threads", "facebook", "pinterest"]),
    entry("evening", "2026-11-05T19:30:00-05:00", "2026-11-06T00:00:00-05:00", ["threads", "pinterest"]),
  ],
};
export const at = (hhmm) => new Date(`2026-11-05T${hhmm}:00-05:00`);
export const jpeg = Buffer.from([0xff, 0xd8, 0xff, 0xd9]);

export function remoteRepo(owner = APPROVED) {
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

export const go = (store, now, over = {}) => {
  const calls = over.calls ?? [];
  return run({
    now, clock: () => now.getTime(), env: SIMULATED_ENV, store, fetch: simulatedFetch(calls), sleep: async () => {},
    readImage: () => jpeg, loadQueue: (d) => (d === queue.date ? queue : null), validate: () => [], log: () => {}, ...over,
  });
};

export const zgo = (store, now, over = {}) => go(store, now, { env: SIMULATED_ZERNIO_ENV, ...over });
export const zreply = (status, body) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

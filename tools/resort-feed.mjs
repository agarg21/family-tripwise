// Deploy-only step (QUEUE G19): writes the latest snowcam feed read into the deployed copy of each
// /ski/<resort>-conditions.html so the card reads without JavaScript. Runs after the tests, on the
// Pages artifact only; the committed pages always render with no feed. A missing, slow or malformed
// feed leaves the pages as built ("No read"). Never fails the deploy.
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { FEED_URL, HISTORY_DAYS, buildHistory, writeResortPages } from "./page-generation/resort-conditions-page.mjs";
import { easternDate } from "./page-generation/sitemap.mjs";

const siteDir = fileURLToPath(new URL("../site/", import.meta.url));
let feed = null;
try {
  const res = await fetch(FEED_URL, { signal: AbortSignal.timeout(15000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const body = await res.json();
  if (!body || typeof body.resorts !== "object" || Array.isArray(body.resorts)) throw new Error("no resorts object");
  feed = body;
} catch (err) {
  console.log(`resort-feed: feed not used (${err.message}); pages keep "No read".`);
}
// Recent days (owner 11-25): the feed repo keeps each hourly snapshot as a commit; read the last few days of
// them so the page can show what the cams showed even when the latest read is dark. Any failure: no history.
const FEED_REPO = "https://github.com/agarg21/snowcam-feed";
if (feed) {
  const dir = mkdtempSync(join(tmpdir(), "snowcam-feed-"));
  try {
    const git = (...args) => execFileSync("git", args, { cwd: dir, encoding: "utf8", timeout: 60000, maxBuffer: 64 * 1024 * 1024 });
    git("clone", "--quiet", "--depth", "400", "--single-branch", FEED_REPO, ".");
    const since = new Date(Date.now() - (HISTORY_DAYS + 1) * 864e5).toISOString();
    const shas = git("log", `--since=${since}`, "--format=%H", "--", "conditions.json").split("\n").filter(Boolean);
    const snapshots = [];
    for (const sha of shas) {
      try { snapshots.push(JSON.parse(git("show", `${sha}:conditions.json`))); } catch { /* skip a bad snapshot */ }
    }
    feed.history = buildHistory([...snapshots, feed]);
    console.log(`resort-feed: history from ${snapshots.length} snapshots for ${Object.keys(feed.history).length} resorts.`);
  } catch (err) {
    console.log(`resort-feed: no history (${err.message.split("\n")[0]}).`);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}
if (feed) {
  writeResortPages((path, contents) => {
    const full = join(siteDir, path);
    mkdirSync(dirname(full), { recursive: true });
    writeFileSync(full, contents);
  }, easternDate(), feed);
  const published = Object.entries(feed.resorts).filter(([, r]) => r?.publish === true).map(([k]) => k);
  console.log(`resort-feed: feed ${feed.generated_at ?? "?"}; published: ${published.join(", ") || "none"}.`);
}

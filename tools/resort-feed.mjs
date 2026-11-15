// Deploy-only step (QUEUE G19): writes the latest snowcam feed read into the deployed copy of each
// /ski/<resort>-conditions.html so the card reads without JavaScript. Runs after the tests, on the
// Pages artifact only; the committed pages always render with no feed. A missing, slow or malformed
// feed leaves the pages as built ("No read"). Never fails the deploy.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { FEED_URL, writeResortPages } from "./page-generation/resort-conditions-page.mjs";
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
if (feed) {
  writeResortPages((path, contents) => {
    const full = join(siteDir, path);
    mkdirSync(dirname(full), { recursive: true });
    writeFileSync(full, contents);
  }, easternDate(), feed);
  const published = Object.entries(feed.resorts).filter(([, r]) => r?.publish === true).map(([k]) => k);
  console.log(`resort-feed: feed ${feed.generated_at ?? "?"}; published: ${published.join(", ") || "none"}.`);
}

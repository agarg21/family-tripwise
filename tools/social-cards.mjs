// Renders the 1080x1350 JPEG card for each entry in ops/social-queue/YYYY-MM-DD.json (QUEUE G03)
// with headless Chromium. Cards are typographic, built only from the verified record: no photos,
// no AI images, no promotional art. A card whose text does not fit is refused, not cropped.
// Usage: node tools/social-cards.mjs YYYY-MM-DD
import { createRequire } from "node:module";
import { existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { readQueue, sourceRecords, cardHtml, root } from "./social-queue.mjs";

const date = process.argv[2];
const queue = readQueue(date);
if (!queue) throw new Error(`No ops/social-queue/${date}.json; run node tools/social-queue.mjs ${date} first`);
const records = new Map(sourceRecords().map((r) => [r.id, r]));
const { chromium } = createRequire(import.meta.url)("playwright");
const browser = await chromium.launch();
let failed = 0;
for (const entry of queue.entries) {
  const out = join(root, entry.image.path);
  if (existsSync(out)) { console.log(`kept ${entry.image.path}`); continue; }
  const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } });
  await page.setContent(cardHtml(records.get(entry.item_id)), { waitUntil: "load" });
  if ((await page.evaluate(() => document.body.dataset.fits)) !== "yes") {
    console.error(`REFUSED ${entry.item_id}: text does not fit the card`);
    failed += 1;
    await page.close();
    continue;
  }
  mkdirSync(dirname(out), { recursive: true });
  await page.screenshot({ path: out, type: "jpeg", quality: 85, clip: { x: 0, y: 0, width: 1080, height: 1350 } });
  await page.close();
  console.log(`rendered ${entry.image.path}`);
}
await browser.close();
if (failed) process.exit(1);

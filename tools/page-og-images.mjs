// Renders link-preview images for pages without their own (owner D18, QUEUE G13; tags in
// tools/page-generation/link-previews.mjs).
// - Photo cards: each self-hosted photo (tools/images/commons-images.lock.json) cropped to 1200x630
//   JPEG with a small credit strip (author, licence, "cropped"). Same free-licence photo the pages
//   already show and credit; never an AI image or promotional art.
// - Typographic cards (PNG) for pages without a photo: the site, /deals/, /this-week/ and each deal check
//   without a v2 card (company, trip type and its og_card line from deal-checks.json; v2 cards come from
//   tools/deal-og-images.mjs). No dates or verdicts, so cached previews never show a stale deadline.
// Text that does not fit is refused, not cropped. Existing files are kept unless --force.
// Usage: node tools/page-og-images.mjs [--force] [--only=images/og/deals.png]
import { createRequire } from "node:module";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { CARDS, DESTINATIONS, dealCardPath, dealCardText, destinationOf, photoCardPath } from "./page-generation/link-previews.mjs";
import { readDealChecks } from "./page-generation/deals-pages.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const e = (v) => String(v ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const lock = JSON.parse(readFileSync(join(root, "tools/images/commons-images.lock.json"), "utf8"));
const logo = readFileSync(join(root, "brand/logo.svg"), "utf8").replace(/\swidth="1080"\sheight="1080"/, ' width="190" height="190"');

const FIT = `<script>document.body.dataset.fits = [...document.querySelectorAll("[data-fit]")].every((n) => n.scrollWidth <= n.clientWidth + 1 && n.scrollHeight <= n.clientHeight + 1) && document.body.scrollWidth <= 1200 ? "yes" : "no";</script>`;

export function photoCreditText(photo) {
  const author = photo.artist.split(" from ")[0].trim();
  return photo.license === "Public domain" || photo.license === "CC0"
    ? `Photo: ${author} (${photo.license})`
    : `Photo: ${author}, ${photo.license}, cropped`;
}

export function photoCardHtml(slug) {
  const photo = lock[slug];
  const data = readFileSync(join(root, "site", photo.path)).toString("base64");
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  * { box-sizing: border-box; margin: 0; }
  body { width: 1200px; height: 630px; overflow: hidden; font-family: "DejaVu Sans", Arial, sans-serif; background: url(data:image/webp;base64,${data}) center / cover; position: relative; }
  .brand { position: absolute; left: 0; bottom: 0; max-width: 760px; background: rgba(11,73,70,0.94); color: #fffaf2; padding: 18px 30px 16px; border-top-right-radius: 14px; }
  .place { font-size: 46px; font-weight: 800; line-height: 1.1; white-space: nowrap; }
  .site { font-size: 26px; font-weight: 800; margin-top: 6px; }
  .brand b { color: #f0bd56; }
  .credit { position: absolute; right: 0; bottom: 0; max-width: 640px; white-space: nowrap; overflow: hidden; background: rgba(0,0,0,0.6); color: #fff; font-size: 16px; padding: 6px 12px; border-top-left-radius: 8px; }
  </style></head><body>
  <div class="brand" data-fit><div class="place">${e(DESTINATIONS[destinationOf(slug)].place)} with kids</div><div class="site">family<b>tripwise</b>.com</div></div>
  <div class="credit" data-fit>${e(photoCreditText(photo))}</div>
  ${FIT}</body></html>`;
}

const TEXT = {
  site: { kicker: "Family trip planning by city", title: "Where to stay, what to do and what it costs with kids", line: "Checked against official sources, with dates" },
  deals: { kicker: "Family Deal Checks", title: "Family travel deals, checked: what you get and the catch", line: "Deadlines and fine print, checked on each company's own offer page" },
  "this-week": { kicker: "This week for families", title: "Family events and deals worth knowing about this week", line: "Each item checked on its official page, with an end date" }
};

export function textCardHtml(id, text = TEXT[id]) {
  const t = text;
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  * { box-sizing: border-box; margin: 0; }
  body { width: 1200px; height: 630px; overflow: hidden; background: #fffaf2; color: #142029; font-family: "DejaVu Sans", Arial, sans-serif; display: grid; grid-template-columns: 330px 1fr; }
  .mark { background: #0b4946; display: flex; align-items: center; justify-content: center; }
  .main { padding: 56px 60px 44px; display: flex; flex-direction: column; height: 630px; }
  .kicker { font-size: 28px; color: #126c67; font-weight: 800; }
  h1 { font-size: 54px; line-height: 1.15; margin-top: 22px; }
  .line { font-size: 26px; line-height: 1.35; margin-top: 26px; color: #0b4946; font-weight: 700; }
  body.deal h1 { font-size: 48px; line-height: 1.2; }
  .brand { margin-top: auto; font-size: 30px; font-weight: 800; border-top: 3px solid #142029; padding-top: 16px; }
  .brand b { color: #126c67; }
  </style></head><body class="${t.deal ? "deal" : ""}">
  <div class="mark">${logo}</div>
  <div class="main" data-fit><p class="kicker">${e(t.kicker)}</p><h1>${e(t.title)}</h1><p class="line">${e(t.line)}</p><p class="brand">family<b>tripwise</b>.com</p></div>
  ${FIT}</body></html>`;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const force = process.argv.includes("--force");
  const { chromium } = createRequire(import.meta.url)("playwright");
  const browser = await chromium.launch();
  const jobs = [
    ...Object.keys(lock).filter((slug) => destinationOf(slug)).map((slug) => ({ out: photoCardPath(slug), html: () => photoCardHtml(slug), type: "jpeg" })),
    ...Object.keys(CARDS).map((id) => ({ out: CARDS[id].path, html: () => textCardHtml(id), type: "png" })),
    ...readDealChecks().filter((check) => !check.v2 && check.og_card).map((check) => ({ out: dealCardPath(check.id), html: () => textCardHtml(null, { ...dealCardText(check), deal: true }), type: "png" }))
  ];
  const only = process.argv.find((a) => a.startsWith("--only="))?.slice(7);
  let failed = 0;
  for (const job of jobs) {
    const out = join(root, "site", job.out);
    if (only && job.out !== only) continue;
    if (existsSync(out) && !force) { console.log(`kept ${job.out}`); continue; }
    const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
    await page.setContent(job.html(), { waitUntil: "load" });
    if ((await page.evaluate(() => document.body.dataset.fits)) !== "yes") { console.error(`REFUSED ${job.out}: text does not fit`); failed += 1; await page.close(); continue; }
    mkdirSync(dirname(out), { recursive: true });
    await page.screenshot({ path: out, type: job.type, ...(job.type === "jpeg" ? { quality: 82 } : {}), clip: { x: 0, y: 0, width: 1200, height: 630 } });
    await page.close();
    console.log(`rendered ${job.out}`);
  }
  await browser.close();
  if (failed) process.exit(1);
}

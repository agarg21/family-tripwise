// Renders the 1200x630 link-preview image (og:image) for each deal check with a v2 block (QUEUE G11).
// Typographic only, built from the validated record: the big number, the plain headline, the verdict
// chip, the context line and the deadline. No photos, no AI images, no promotional art.
// An image whose text does not fit is refused, not cropped. Existing files are kept unless --force.
// Usage: node tools/deal-og-images.mjs [--force]
import { createRequire } from "node:module";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { readDealChecks, validateDealChecks, deadlineLabel, longDate } from "./page-generation/deals-pages.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const e = (v) => String(v ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const VERDICT = { worth_it: "Worth it", only_for: "Only for some families", skip: "Skip" };

export function dealOgHtml(check) {
  const v = check.v2;
  // The page's own credited, self-hosted photo (if any) fills the number panel; never an AI image.
  const lock = JSON.parse(readFileSync(join(root, "tools/images/commons-images.lock.json"), "utf8"));
  const photo = v.hero_image && lock[v.hero_image.slug];
  const bg = photo ? `background: linear-gradient(rgba(11,73,70,0.05) 15%, rgba(11,73,70,0.9) 62%), url(data:image/webp;base64,${readFileSync(join(root, "site", photo.path)).toString("base64")}) center / cover;` : "";
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  * { box-sizing: border-box; margin: 0; }
  body { width: 1200px; height: 630px; background: #fffaf2; color: #142029; font-family: "DejaVu Sans", Arial, sans-serif; display: grid; grid-template-columns: 330px 1fr; }
  .big { background: #126c67; ${bg} color: #fff; display: flex; flex-direction: column; justify-content: flex-end; padding: 40px 34px; text-shadow: 0 2px 8px rgba(0,0,0,0.5); }
  .credit { font-size: 15px; margin-top: 22px; opacity: 0.9; }
  .num { font-size: 92px; white-space: nowrap; font-weight: 800; line-height: 1; }
  .lab { font-size: 27px; line-height: 1.3; margin-top: 18px; }
  .main { padding: 48px 56px 40px; display: flex; flex-direction: column; }
  .ctx { font-size: 23px; color: #0b4946; font-weight: 700; line-height: 1.3; }
  h1 { font-size: 41px; line-height: 1.18; margin-top: 18px; }
  .row { display: flex; gap: 14px; align-items: center; margin-top: 24px; flex-wrap: wrap; }
  .chip { background: #f0bd56; color: #142029; font-weight: 800; font-size: 24px; padding: 8px 16px; border-radius: 999px; }
  .chip.worth_it { background: #126c67; color: #fff; } .chip.skip { background: #db6d4a; color: #fff; }
  .when { font-size: 24px; font-weight: 700; }
  .chips { font-size: 23px; margin-top: 16px; color: #0b4946; font-weight: 700; line-height: 1.3; }
  .brand { margin-top: auto; font-size: 26px; font-weight: 800; border-top: 3px solid #142029; padding-top: 14px; }
  </style></head><body>
  <div class="big" id="big"><div class="num">${e(v.big_number)}</div><div class="lab">${e(v.big_label)}</div>${photo ? `<div class="credit">Photo: ${e(photo.artist.split(" from ")[0])}, ${e(photo.license)}</div>` : ""}</div>
  <div class="main" id="main">
    <p class="ctx">${e(v.context)}</p>
    <h1>${e(v.headline)}</h1>
    <div class="row"><span class="chip ${e(check.score.verdict)}">${e(VERDICT[check.score.verdict])}</span><span class="when">${e(deadlineLabel(check))} ${e(longDate(check.expires_on))}</span></div>
    <p class="chips">${check.v2.chips.map((c) => `<span style="white-space:nowrap">${e(c)}</span>`).join(" · ")}</p>
    <p class="brand">familytripwise.com · Family Deal Check</p>
  </div>
  <script>const m = document.getElementById("main"); const b = document.getElementById("big"); document.body.dataset.fits = (m.scrollHeight <= m.clientHeight && b.scrollWidth <= b.clientWidth && b.scrollHeight <= b.clientHeight && document.body.scrollWidth <= 1200) ? "yes" : "no";</script>
  </body></html>`;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const force = process.argv.includes("--force");
  const checks = readDealChecks();
  const problems = validateDealChecks(checks);
  if (problems.length) throw new Error(problems.join("\n"));
  const { chromium } = createRequire(import.meta.url)("playwright");
  const browser = await chromium.launch();
  let failed = 0;
  for (const check of checks.filter((c) => c.v2)) {
    const out = join(root, "site", check.v2.og_image);
    if (existsSync(out) && !force) { console.log(`kept ${check.v2.og_image}`); continue; }
    const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
    await page.setContent(dealOgHtml(check), { waitUntil: "load" });
    if ((await page.evaluate(() => document.body.dataset.fits)) !== "yes") { console.error(`REFUSED ${check.id}: text does not fit`); failed += 1; await page.close(); continue; }
    mkdirSync(dirname(out), { recursive: true });
    await page.screenshot({ path: out, type: "png", clip: { x: 0, y: 0, width: 1200, height: 630 } });
    await page.close();
    console.log(`rendered ${check.v2.og_image}`);
  }
  await browser.close();
  if (failed) process.exit(1);
}

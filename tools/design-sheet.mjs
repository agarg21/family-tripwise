// Weekly design contact sheet (docs/plan/design-review.md): first-screen thumbnails of the main templates at
// 390 and 1280 px, for the design reviewer and the owner's taste check. Writes PNGs to a scratch folder,
// never into the repo.
//   node tools/design-sheet.mjs [outDir] [--base http://localhost:8765/] [page ...]
// Serve site/ first (python3 -m http.server 8765 from site/), or pass --base https://familytripwise.com/.
import { createRequire } from "node:module";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

const require = createRequire(import.meta.url);
export const TEMPLATE_PAGES = [
  "index.html",
  "things-to-do/san-diego-with-kids.html",
  "things-to-do/orlando-with-kids.html",
  "where-to-stay/london-family-hotels.html",
  "deals/index.html",
  "deals/busch-gardens-tampa-2027-fun-card.html",
  "this-week/",
  "where-to-stay/cancun-family-resorts.html",
];

const args = process.argv.slice(2);
const baseIdx = args.indexOf("--base");
const base = baseIdx >= 0 ? args.splice(baseIdx, 2)[1] : "http://localhost:8765/";
const outDir = args[0] && !args[0].endsWith(".html") && !args[0].endsWith("/") ? args.shift() : join(tmpdir(), "design-sheet");
const pages = args.length ? args : TEMPLATE_PAGES;
mkdirSync(outDir, { recursive: true });

const { chromium } = require("playwright");
const browser = await chromium.launch();
const shots = [];
for (const [w, h] of [[390, 844], [1280, 800]]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h } });
  for (const path of pages) {
    const page = await ctx.newPage();
    await page.goto(new URL(path, base).href, { waitUntil: "networkidle" });
    const file = join(outDir, `${path.replace(/\/$/, "/index").replace(/[/.]/g, "_")}-${w}.png`);
    await page.screenshot({ path: file });
    shots.push({ w, path, file });
    await page.close();
  }
  await ctx.close();
}
// Compose one sheet per width by screenshotting a grid of the captures.
for (const w of [390, 1280]) {
  const items = shots.filter((s) => s.w === w);
  const thumb = w === 390 ? 300 : 620;
  const html = `<body style="margin:0;padding:12px;background:#fff;font:12px system-ui"><div style="display:grid;grid-template-columns:repeat(${w === 390 ? 4 : 2},${thumb}px);gap:12px">${items.map((s) => `<figure style="margin:0"><img style="width:${thumb}px;border:1px solid #ddd" src="data:image/png;base64,${readFileSync(s.file).toString("base64")}"><figcaption>${s.path}</figcaption></figure>`).join("")}</div></body>`;
  const page = await browser.newPage({ viewport: { width: (w === 390 ? 4 : 2) * (thumb + 12) + 12, height: 400 } });
  await page.setContent(html);
  const sheet = join(outDir, `sheet-${w}.png`);
  await page.screenshot({ path: sheet, fullPage: true });
  await page.close();
  console.log(`wrote ${sheet}`);
}
await browser.close();
writeFileSync(join(outDir, "pages.json"), JSON.stringify(shots.map((s) => s.file), null, 2));

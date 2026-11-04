// Rendered-page check (QUEUE Q20, owner 2026-11-03): headless Chromium at 1280, 390 and 320 px.
//   node tools/browser-check.mjs [page ...]      changed pages (site-relative, e.g. deals/index.html)
//   node tools/browser-check.mjs --all           every sitemap page (use when site/styles.css or site-chrome changes)
// Serves site/ itself, blocks outside requests, writes nothing, and exits 1 when any check fails:
// no horizontal overflow, no console or page errors, static text still readable with JavaScript off,
// and a header button is filled only when it has aria-current (a filled button means "you are here").
import { createRequire } from "node:module";
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const WIDTHS = [1280, 390, 320];
const MIN_NO_JS_TEXT = 200;
const root = fileURLToPath(new URL("../site/", import.meta.url));
const TYPES = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".mjs": "text/javascript", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".avif": "image/avif", ".woff2": "font/woff2", ".xml": "application/xml", ".csv": "text/csv", ".ico": "image/x-icon" };

// True when a computed CSS color paints something (not transparent).
export function isFilled(color) {
  const c = String(color).replace(/\s+/g, "");
  if (c === "transparent") return false;
  const m = c.match(/^rgba\((\d+),(\d+),(\d+),([\d.]+)\)$/);
  return !(m && Number(m[4]) === 0);
}

// The rule itself: returns problems for rows of { text, filled, current }.
export function headerStateProblems(buttons) {
  const problems = [];
  for (const b of buttons) {
    if (b.filled && !b.current) problems.push(`"${b.text}" looks selected without aria-current`);
    if (!b.filled && b.current) problems.push(`"${b.text}" has aria-current but is not filled`);
  }
  return problems;
}

export function sitemapPages(xml) {
  return [...xml.matchAll(/<loc>https:\/\/familytripwise\.com\/([^<]*)<\/loc>/g)].map((m) => m[1] || "index.html");
}

function serve() {
  const server = createServer((req, res) => {
    let path = decodeURIComponent(new URL(req.url, "http://x").pathname).replace(/^\/+/, "");
    if (path === "" || path.endsWith("/")) path += "index.html";
    const file = join(root, normalize(path));
    if (!file.startsWith(root) || !existsSync(file) || !statSync(file).isFile()) {
      res.writeHead(404);
      res.end();
      return;
    }
    res.writeHead(200, { "content-type": TYPES[extname(file)] || "application/octet-stream" });
    res.end(readFileSync(file));
  });
  return new Promise((resolve) => server.listen(0, "127.0.0.1", () => resolve(server)));
}

async function checkPage(browser, origin, path, width) {
  const problems = [];
  const ctx = await browser.newContext({ viewport: { width, height: 800 } });
  await ctx.route("**/*", (route) => (route.request().url().startsWith(origin) ? route.continue() : route.abort()));
  const page = await ctx.newPage();
  page.on("pageerror", (e) => problems.push(`page error: ${e.message}`));
  page.on("console", (m) => {
    if (m.type() === "error" && !/ERR_FAILED/.test(m.text())) problems.push(`console: ${m.text()}`);
  });
  const res = await page.goto(origin + path, { waitUntil: "load" });
  if (!res || res.status() !== 200) problems.push(`status ${res?.status()}`);
  // Measure after the webfont swap, the settled layout a parent reads.
  await page.evaluate(() => document.fonts.ready);
  const state = await page.evaluate(() => ({
    scroll: document.documentElement.scrollWidth,
    view: window.innerWidth,
    buttons: [...document.querySelectorAll(".site-header .header-this-week")].filter((a) => a.offsetParent !== null).map((a) => ({
      text: a.textContent.trim(),
      background: getComputedStyle(a).backgroundColor,
      current: a.hasAttribute("aria-current"),
    })),
  }));
  if (state.scroll > state.view) problems.push(`overflow: ${state.scroll} > ${state.view}`);
  if (!state.buttons.length) problems.push("no visible header button: the header check did not run");
  problems.push(...headerStateProblems(state.buttons.map((b) => ({ ...b, filled: isFilled(b.background) }))));
  await ctx.close();

  const off = await browser.newContext({ viewport: { width, height: 800 }, javaScriptEnabled: false });
  await off.route("**/*", (route) => (route.request().url().startsWith(origin) ? route.continue() : route.abort()));
  const still = await off.newPage();
  await still.goto(origin + path, { waitUntil: "load" });
  const text = (await still.locator("main").first().innerText().catch(() => "")).trim();
  if (text.length < MIN_NO_JS_TEXT) problems.push(`no-JS main text only ${text.length} characters`);
  await off.close();
  return problems;
}

async function main() {
  const args = process.argv.slice(2);
  const pages = args.includes("--all") ? sitemapPages(readFileSync(join(root, "sitemap.xml"), "utf8")) : args;
  if (!pages.length) {
    console.error("usage: node tools/browser-check.mjs --all | <page> ...");
    process.exit(2);
  }
  const { chromium } = createRequire(import.meta.url)("playwright");
  const server = await serve();
  const origin = `http://127.0.0.1:${server.address().port}/`;
  const browser = await chromium.launch();
  const jobs = pages.flatMap((path) => WIDTHS.map((width) => ({ path, width })));
  const failures = [];
  await Promise.all(Array.from({ length: 6 }, async () => {
    for (let job = jobs.shift(); job; job = jobs.shift()) {
      for (const p of await checkPage(browser, origin, job.path, job.width)) failures.push(`${job.path} @${job.width}: ${p}`);
    }
  }));
  await browser.close();
  server.close();
  for (const f of failures.sort()) console.log(f);
  console.log(`browser-check: ${pages.length} pages at ${WIDTHS.join(", ")} px, ${failures.length} problems`);
  process.exit(failures.length ? 1 : 0);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await main();

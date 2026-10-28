import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// Sitemap <lastmod> comes from a committed ledger of each page's content hash.
// The hash covers only the inner HTML of the page's <main> element (whole file when a page
// has none), so shared header/footer/related-guide or <head> changes don't move lastmod;
// it records the last change to the page's own content rather than the build date.
export const ledgerPath = new URL("./sitemap-lastmod.json", import.meta.url);
const origin = "https://familytripwise.com/";

export function sitePathForUrl(url) {
  const path = url.slice(origin.length);
  return path === "" || path.endsWith("/") ? `${path}index.html` : path;
}

export function sha256(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

export function mainContent(html) {
  const match = String(html).match(/<main\b[^>]*>([\s\S]*)<\/main>/);
  return match ? match[1] : String(html);
}

export function contentHash(html) {
  return sha256(mainContent(html));
}

export function easternDate(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
}

export function readLedger(path = ledgerPath) {
  return JSON.parse(readFileSync(path, "utf8"));
}

export function updateLedger(ledger, siteDir, urls, today) {
  const pages = {};
  for (const url of urls) {
    const sitePath = sitePathForUrl(url);
    const hash = contentHash(readFileSync(join(siteDir, sitePath), "utf8"));
    const previous = ledger.pages?.[sitePath];
    pages[sitePath] = previous && previous.sha256 === hash ? previous : { sha256: hash, lastmod: today };
  }
  return { ...ledger, pages };
}

export function sitemapXml(urls, ledger) {
  const rows = urls.map((url) => `  <url><loc>${url}</loc><lastmod>${ledger.pages[sitePathForUrl(url)].lastmod}</lastmod></url>`);
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${rows.join("\n")}\n</urlset>\n`;
}

export function writeSitemap(siteDir, urls, { today = process.env.FT_BUILD_DATE || easternDate() } = {}) {
  const ledger = updateLedger(readLedger(), siteDir, urls, today);
  writeFileSync(ledgerPath, `${JSON.stringify(ledger, null, 2)}\n`);
  writeFileSync(join(siteDir, "sitemap.xml"), sitemapXml(urls, ledger));
}

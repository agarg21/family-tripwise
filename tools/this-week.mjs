// Daily refresh for /this-week/ (QUEUE G01). Re-renders only the this-week page for today's
// America/New_York date, so expired items drop even without an operator run, then rewrites the
// sitemap lastmod ledger for the existing sitemap URLs. Used by the Pages deploy workflow before
// its tests run; it changes no other page.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { writeThisWeekPage } from "./page-generation/this-week-page.mjs";
import { easternDate, writeSitemap } from "./page-generation/sitemap.mjs";

const siteDir = fileURLToPath(new URL("../site/", import.meta.url));
const urls = [...readFileSync(join(siteDir, "sitemap.xml"), "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

const today = process.env.FT_BUILD_DATE || easternDate();
writeThisWeekPage((path, contents) => {
  const full = join(siteDir, path);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, contents);
}, today);
writeSitemap(siteDir, urls, { today });
console.log("Refreshed this-week/index.html and the sitemap ledger.");

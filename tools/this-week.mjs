// Daily refresh for /this-week/ (QUEUE G01), /deals/ (QUEUE G02), /holidays/ (QUEUE G16) and the DC hotel price sample (Q17b). Re-renders only the this-week, deal and DC hotel pages for today's
// America/New_York date, so expired items drop even without an operator run, then rewrites the
// sitemap lastmod ledger for the existing sitemap URLs. Used by the Pages deploy workflow before
// its tests run; it changes no other page. Ended deal checks leave the hub; their pages say the offer ended.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { writeThisWeekPage } from "./page-generation/this-week-page.mjs";
import { writeDealPages } from "./page-generation/deals-pages.mjs";
import { writeHolidayParksPage } from "./page-generation/holiday-parks-page.mjs";
import { writeHolidayCityPages } from "./page-generation/holiday-city-page.mjs";
import { writeBostonFamilyHotelsPage } from "./page-generation/boston-family-hotels-page.mjs";
import { writeLondonFamilyHotelsPage } from "./page-generation/london-family-hotels-page.mjs";
import { writeWashingtonDcFamilyHotelsPage } from "./page-generation/washington-dc-family-hotels-page.mjs";
import { easternDate, writeSitemap } from "./page-generation/sitemap.mjs";

const siteDir = fileURLToPath(new URL("../site/", import.meta.url));
const urls = [...readFileSync(join(siteDir, "sitemap.xml"), "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

const today = process.env.FT_BUILD_DATE || easternDate();
writeThisWeekPage((path, contents) => {
  const full = join(siteDir, path);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, contents);
}, today);
writeDealPages((path, contents) => {
  const full = join(siteDir, path);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, contents);
}, today);
writeHolidayParksPage((path, contents) => {
  const full = join(siteDir, path);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, contents);
}, today);
writeHolidayCityPages((path, contents) => {
  const full = join(siteDir, path);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, contents);
}, today);
// Q17b: the DC hotel page carries a dated Google Hotels sample that drops 7 days before its stay.
writeWashingtonDcFamilyHotelsPage((path, contents) => {
  const full = join(siteDir, path);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, contents);
}, today);
// G18: the Boston hotel page's dated samples also drop 7 days before their stays.
writeBostonFamilyHotelsPage((path, contents) => {
  const full = join(siteDir, path);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, contents);
}, today);
writeSitemap(siteDir, urls, { today });
// G18: the London page's dated samples also drop 7 days before their stays.
writeLondonFamilyHotelsPage((path, contents) => {
  const full = join(siteDir, path);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, contents);
}, today);
console.log("Refreshed this-week/index.html, the deal pages, the holiday parks page, the DC, Boston and London hotel pages and the sitemap ledger.");

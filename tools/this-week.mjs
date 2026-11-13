// Daily refresh for /this-week/ (QUEUE G01), /deals/ (QUEUE G02), /holidays/ (QUEUE G16) and the DC hotel price sample (Q17b). Re-renders only the this-week, deal and DC hotel pages for today's
// America/New_York date, so expired items drop even without an operator run, then rewrites the
// sitemap lastmod ledger for the existing sitemap URLs. Used by the Pages deploy workflow before
// its tests run; it changes no other page. Ended deal checks leave the hub; their pages say the offer ended.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { writeThisWeekPage } from "./page-generation/this-week-page.mjs";
import { writeDealPages, withCurrentDealUrls, readDealChecks } from "./page-generation/deals-pages.mjs";
import { writeHolidayParksPage } from "./page-generation/holiday-parks-page.mjs";
import { writeHolidayCityPages } from "./page-generation/holiday-city-page.mjs";
import { writeSkiPages } from "./page-generation/ski-page.mjs";
import { writeHolidayHotelStudyPage } from "./page-generation/holiday-hotel-study-page.mjs";
import { writeCancunResortPage } from "./page-generation/cancun-resort-page.mjs";
import { writePuertoVallartaFamilyResortsPage } from "./page-generation/puerto-vallarta-family-resorts-page.mjs";
import { writeBostonFamilyHotelsPage } from "./page-generation/boston-family-hotels-page.mjs";
import { writeLondonFamilyHotelsPage } from "./page-generation/london-family-hotels-page.mjs";
import { writeWashingtonDcFamilyHotelsPage } from "./page-generation/washington-dc-family-hotels-page.mjs";
import { easternDate, writeSitemap } from "./page-generation/sitemap.mjs";
import { addSiteSchema } from "./page-generation/site-schema.mjs";

const siteDir = fileURLToPath(new URL("../site/", import.meta.url));
const sitemapUrls = [...readFileSync(join(siteDir, "sitemap.xml"), "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

const today = process.env.FT_BUILD_DATE || easternDate();
// Ended deal checks leave the sitemap the day they end (OWNER D46 #5), as in the full build.
const urls = withCurrentDealUrls(sitemapUrls, readDealChecks(), today);
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
// Ski pages: dollar figures hide 30 days after their read.
writeSkiPages((path, contents) => {
  const full = join(siteDir, path);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, contents);
}, today);
// R1 step 6: holiday weekend hotel study; each weekend leaves 7 days before it starts.
writeHolidayHotelStudyPage((path, contents) => {
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
// G18: the London page's dated samples also drop 7 days before their stays.
writeLondonFamilyHotelsPage((path, contents) => {
  const full = join(siteDir, path);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, contents);
}, today);
// G18: the Cancun page's dated samples also drop 7 days before their stays.
writeCancunResortPage((path, contents) => {
  const full = join(siteDir, path);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, contents);
}, today);
// G18: the Puerto Vallarta page's dated samples also drop 7 days before their stays.
writePuertoVallartaFamilyResortsPage((path, contents) => {
  const full = join(siteDir, path);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, contents);
}, today);
writeSitemap(siteDir, urls, { today });
// Same final pass as generate-pages.mjs, so both builds write identical bytes.
addSiteSchema(siteDir);
console.log("Refreshed this-week/index.html, the deal pages, the holiday parks page, the DC, Boston, London, Cancun and Puerto Vallarta hotel pages and the sitemap ledger.");

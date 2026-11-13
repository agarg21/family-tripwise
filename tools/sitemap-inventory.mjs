// Test helper: the expected sitemap size. Non-deal pages are pinned (51 on 2026-11-13; change it when a
// page is added or removed on purpose). Deal pages follow the calendar (OWNER D46 #5: ended checks leave
// the sitemap the day after they end), judged by the sitemap's own build date, not the test machine's clock.
import { readFileSync } from "node:fs";
import { dealSitemapUrls, readDealChecks } from "./page-generation/deals-pages.mjs";

export const NON_DEAL_SITEMAP_URLS = 51;
const sitemapPath = new URL("../site/sitemap.xml", import.meta.url);

/** Newest <lastmod> in the committed sitemap (/this-week/ changes daily, so this is the build date). */
export function sitemapBuildDate(xml = readFileSync(sitemapPath, "utf8")) {
  return [...xml.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map((m) => m[1]).sort().at(-1);
}

export function expectedSitemapCount(xml = readFileSync(sitemapPath, "utf8")) {
  return NON_DEAL_SITEMAP_URLS + dealSitemapUrls(readDealChecks(), sitemapBuildDate(xml)).length;
}

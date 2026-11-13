// R1 / OWNER D46 #5: ended deal pages stay live but leave the sitemap; the daily refresh matches the full build.
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { allDealUrls, dealSitemapUrls, dealsHubUrl, blackFridayUrl, isEnded, readDealChecks, withCurrentDealUrls } from "./page-generation/deals-pages.mjs";

const checks = [
  { id: "a-live", expires_on: "2026-11-20" },
  { id: "b-ended", expires_on: "2026-11-01" },
  { id: "c-today", expires_on: "2026-11-13" }
];
const url = (id) => `https://familytripwise.com/deals/${id}.html`;

test("dealSitemapUrls keeps the hub, Black Friday page and open checks only", () => {
  assert.deepEqual(dealSitemapUrls(checks, "2026-11-13"), [dealsHubUrl, blackFridayUrl, url("a-live"), url("c-today")]);
  assert.deepEqual(dealSitemapUrls(checks, "2026-11-14"), [dealsHubUrl, blackFridayUrl, url("a-live")]);
});

test("withCurrentDealUrls drops ended checks in place and brings an extended check back", () => {
  const before = ["https://familytripwise.com/", "https://familytripwise.com/this-week/", dealsHubUrl, blackFridayUrl, url("b-ended"), url("a-live"), "https://familytripwise.com/holidays/x.html"];
  assert.deepEqual(withCurrentDealUrls(before, checks, "2026-11-14"),
    ["https://familytripwise.com/", "https://familytripwise.com/this-week/", dealsHubUrl, blackFridayUrl, url("a-live"), "https://familytripwise.com/holidays/x.html"]);
  const extended = checks.map((c) => (c.id === "b-ended" ? { ...c, expires_on: "2026-12-01" } : c));
  assert.ok(withCurrentDealUrls(before, extended, "2026-11-14").includes(url("b-ended")));
  assert.throws(() => withCurrentDealUrls(["https://familytripwise.com/"], checks, "2026-11-14"), /no \/deals\/ hub/);
});

test("committed sitemap lists every open deal page and no ended one", () => {
  const sitemap = readFileSync(new URL("../site/sitemap.xml", import.meta.url), "utf8");
  const listed = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));
  const real = readDealChecks();
  // Judge by the sitemap's own build date (its newest lastmod), not the test machine's clock.
  const built = [...sitemap.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map((m) => m[1]).sort().at(-1);
  for (const check of real) assert.equal(listed.has(url(check.id)), !isEnded(check, built), check.id);
  assert.ok(listed.has(dealsHubUrl) && listed.has(blackFridayUrl));
  assert.equal(allDealUrls(real).length, real.length + 2);
});

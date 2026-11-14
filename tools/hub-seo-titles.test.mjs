import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { skiData, skiPage, skiPath } from "./page-generation/ski-page.mjs";
import { dealsHubPage, blackFridayPage, readDealChecks } from "./page-generation/deals-pages.mjs";

// R1 step 2 (D44): the ski page and the two deal hubs keep <title>s ≤60 chars, open with their query
// family and carry no "| Family Tripwise" suffix; og:title (when present) matches the title.
const unesc = (s) => s.replace(/&amp;/g, "&").replace(/&#39;/g, "'").replace(/&quot;/g, '"');
const titleOf = (html) => unesc(html.match(/<title>([\s\S]*?)<\/title>/)[1].trim());
const ogOf = (html) => html.match(/<meta property="og:title" content="([^"]*)">/)?.[1];

const committed = {
  "ski/skiing-near-new-york-city-with-kids.html": "Skiing Near NYC With Kids",
  "deals/index.html": "Family Travel Deals",
  "deals/black-friday-family-travel-deals.html": "Black Friday Family Travel Deals"
};
for (const [page, prefix] of Object.entries(committed)) {
  test(`${page} title is ≤60 chars, starts with the query family and matches og:title`, () => {
    const html = readFileSync(new URL(`../site/${page}`, import.meta.url), "utf8");
    const title = titleOf(html);
    assert.ok(title.length <= 60, `${title} is ${title.length} chars`);
    assert.ok(title.startsWith(prefix), title);
    assert.doesNotMatch(title, /\| Family Tripwise/);
    const og = ogOf(html);
    if (og) assert.equal(unesc(og), title);
  });
}

test("ski title names lift ticket prices only while the page shows them, and counts the hills", () => {
  const data = skiData();
  for (const [slug, city] of Object.entries(data.cities)) {
    const freshHtml = skiPage(slug, data, city.observed_on);
    const stale = new Date(Date.parse(`${city.observed_on}T00:00:00Z`) + 31 * 864e5).toISOString().slice(0, 10);
    const staleHtml = skiPage(slug, data, stale);
    for (const [html, prices] of [[freshHtml, true], [staleHtml, false]]) {
      const title = titleOf(html);
      assert.ok(title.length <= 60, `${skiPath(slug)}: ${title} is ${title.length} chars`);
      assert.match(title, new RegExp(`: ${city.hills.length} Hills, `));
      assert.equal(/Prices/.test(title), prices, title);
      const desc = html.match(/<meta name="description" content="([^"]*)">/)[1];
      assert.equal(/lift ticket prices for a family of 4/.test(desc), prices, desc);
    }
  }
});

test("deal hub titles stay short on any day", () => {
  const checks = readDealChecks();
  for (const day of ["2026-11-14", "2026-12-02", "2027-01-10"]) {
    for (const html of [dealsHubPage(checks, day), blackFridayPage(checks, day)]) {
      const title = titleOf(html);
      assert.ok(title.length <= 60, `${day}: ${title}`);
      assert.doesNotMatch(title, /\| Family Tripwise/);
    }
  }
});

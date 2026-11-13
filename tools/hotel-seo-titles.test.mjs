import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { bostonFamilyHotelPage } from "./page-generation/boston-family-hotels-page.mjs";
import { dcFamilyHotelPage } from "./page-generation/washington-dc-family-hotels-page.mjs";
import { londonFamilyHotelPage } from "./page-generation/london-family-hotels-page.mjs";

// R1 step 2 (D44): hotel-page <title>s stay ≤60 chars, open with the page's query family,
// carry no "| Family Tripwise" suffix and match og:title; Boston and DC also match the WebPage schema name.
const pages = {
  "where-to-stay/boston-family-hotels.html": "Boston Family Hotels",
  "where-to-stay/washington-dc-family-hotels.html": "Washington DC Family Hotels",
  "where-to-stay/london-family-hotels.html": "London Family Apartments"
};
const unesc = s => s.replace(/&amp;/g, "&").replace(/&#39;/g, "'").replace(/&quot;/g, '"');

for (const [page, prefix] of Object.entries(pages)) {
  test(`${page} title is ≤60 chars, starts with the query family and matches og:title`, () => {
    const html = readFileSync(new URL(`../site/${page}`, import.meta.url), "utf8");
    const title = unesc(html.match(/<title>([\s\S]*?)<\/title>/)[1].trim());
    assert.ok(title.length <= 60, `${title} is ${title.length} chars`);
    assert.ok(title.startsWith(prefix), title);
    assert.doesNotMatch(title, /\| Family Tripwise/);
    assert.equal(unesc(html.match(/<meta property="og:title" content="([^"]*)">/)[1]), title);
    if (!page.includes("london")) assert.equal(JSON.parse(html.match(/<script type="application\/ld\+json">(\{"@context"[^<]*"@type":"WebPage"[^<]*)<\/script>/)[1]).name, title);
    // A count in the title must match the comparison's room rows.
    const count = title.match(/: (\d+) Suites/)?.[1];
    if (count) assert.equal(new Set(html.match(/data-room="[^"]+"/g)).size, Number(count));
    // The title promises prices only while a dated price band is on the page (the build date decides).
    assert.equal(/Prices/.test(title), /About \$\d[\d,]*.\$\d[\d,]* a night/.test(html), `${page}: title "${title}" vs price band on page`);
  });
}

// Samples drop a week before the Jan 22-24, 2027 stay: titles and descriptions must stop promising prices.
const later = "2027-01-16";
for (const [name, render, fallback] of [
  ["Boston", bostonFamilyHotelPage, "Boston Family Hotels: Rooms for 4 or 5 and What to Price"],
  ["Washington DC", dcFamilyHotelPage, "Washington DC Family Hotels: 3 Suites and What to Price"],
  ["London", londonFamilyHotelPage, "London Family Apartments for 6: Beds and What to Check"]
]) {
  test(`${name} hotel title and description drop the price promise once samples expire`, () => {
    const html = render(later);
    const title = unesc(html.match(/<title>([\s\S]*?)<\/title>/)[1].trim());
    assert.equal(title, fallback);
    assert.ok(title.length <= 60);
    assert.doesNotMatch(html, /About \$\d[\d,]*.\$\d[\d,]* a night/);
    assert.doesNotMatch(html.match(/<meta name="description" content="([^"]*)"/)[1], /prices for|listing prices|dated/i);
  });
}

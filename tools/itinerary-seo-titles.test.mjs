import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

// R1 step 2 (D44): itinerary <title>s stay ≤60 chars and open with the page's query family;
// the H1 keeps the longer heading and og:title follows <title>.
const pages = {
  "family-itinerary/new-york-city-with-kids.html": "New York City Itinerary With Kids",
  "family-itinerary/washington-dc-with-kids.html": "Washington DC Itinerary With Kids",
  "family-itinerary/boston-with-kids.html": "Boston Itinerary With Kids",
  "family-itinerary/las-vegas-with-kids.html": "Las Vegas Itinerary With Kids",
  "family-itinerary/san-antonio-with-kids.html": "San Antonio Itinerary With Kids",
  "family-itinerary/san-diego-with-kids.html": "San Diego Itinerary With Kids"
};
const unesc = s => s.replace(/&amp;/g, "&").replace(/&#39;/g, "'").replace(/&quot;/g, '"');

for (const [page, prefix] of Object.entries(pages)) {
  test(`${page} title is ≤60 chars, starts with the query family and matches og:title`, () => {
    const html = readFileSync(new URL(`../site/${page}`, import.meta.url), "utf8");
    const title = unesc(html.match(/<title>([\s\S]*?)<\/title>/)[1].trim());
    assert.ok(title.length <= 60, `${title} is ${title.length} chars`);
    assert.ok(title.startsWith(`${prefix}: `), title);
    assert.doesNotMatch(title, /\| Family Tripwise/);
    assert.equal(unesc(html.match(/<meta property="og:title" content="([^"]*)">/)[1]), title);
    assert.match(html, new RegExp(`<h1>${prefix}: `));
  });
}

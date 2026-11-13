import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

// R1 step 2 (D44): things-to-do <title>s stay ≤60 chars and open with the page's query family;
// the H1 keeps the longer heading and og:title follows <title>.
const pages = {
  "things-to-do/new-york-city-with-kids.html": ["Things to Do in New York City With Kids", "Things to Do in New York City With Kids"],
  "things-to-do/chicago-with-kids.html": ["Things to Do in Chicago With Kids", "Things to Do in Chicago With Kids"],
  // Orlando's H1 is "Orlando With Kids: Non-Park Days"; its title must say the page is about breaks from the parks.
  "things-to-do/orlando-with-kids.html": ["Things to Do in Orlando With Kids", "Orlando With Kids"]
};
const unesc = s => s.replace(/&amp;/g, "&").replace(/&#39;/g, "'").replace(/&quot;/g, '"');

for (const [page, [prefix, h1]] of Object.entries(pages)) {
  test(`${page} title is ≤60 chars, starts with the query family and matches og:title`, () => {
    const html = readFileSync(new URL(`../site/${page}`, import.meta.url), "utf8");
    const title = unesc(html.match(/<title>([\s\S]*?)<\/title>/)[1].trim());
    assert.ok(title.length <= 60, `${title} is ${title.length} chars`);
    assert.ok(title.startsWith(`${prefix}: `), title);
    assert.doesNotMatch(title, /\| Family Tripwise/);
    if (page.includes("orlando")) assert.match(title, /Parks/);
    assert.equal(unesc(html.match(/<meta property="og:title" content="([^"]*)">/)[1]), title);
    assert.match(html, new RegExp(`<h1[^>]*>${h1}: `));
  });
}

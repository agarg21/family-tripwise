import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

// R1 step 2 (D44): things-to-do <title>s stay ≤60 chars and open with the page's query family;
// the H1 keeps the longer heading and og:title follows <title>.
const pages = {
  "things-to-do/new-york-city-with-kids.html": ["Things to Do in New York City With Kids", "Things to Do in New York City With Kids"],
  "things-to-do/chicago-with-kids.html": ["Things to Do in Chicago With Kids", "Things to Do in Chicago With Kids"],
  // Orlando's H1 is "Orlando With Kids: Non-Park Days"; its title must say the page is about breaks from the parks.
  "things-to-do/orlando-with-kids.html": ["Things to Do in Orlando With Kids", "Orlando With Kids"],
  // San Diego kids keeps its plain H1 ("Things to do in San Diego with kids", router test); toddlers and teens keep long H1s.
  "things-to-do/san-diego-with-kids.html": ["Things to Do in San Diego With Kids", null],
  "things-to-do/san-diego-with-toddlers.html": ["Things to Do in San Diego With Toddlers", "Things to Do in San Diego With Toddlers"],
  "things-to-do/san-diego-with-teens.html": ["Things to Do in San Diego With Teens", "Things to Do in San Diego With Teens"],
  // San Antonio kids/teens keep their long H1s; NYC teens keeps its plain H1 "New York City With Teens".
  "things-to-do/san-antonio-with-kids.html": ["Things to Do in San Antonio With Kids", "Things to Do in San Antonio With Kids"],
  "things-to-do/san-antonio-with-teens.html": ["Things to Do in San Antonio With Teens", "Things to Do in San Antonio With Teens"],
  "things-to-do/new-york-city-with-teens.html": ["Things to Do in New York City With Teens", null]
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
    if (h1) assert.match(html, new RegExp(`<h1[^>]*>${h1}: `));
    // A count in the title must match the page's first table (one row per pick, after the header row).
    const count = title.match(/: (\d+) /)?.[1];
    if (count) {
      const rows = (html.match(/<table[\s\S]*?<\/table>/)[0].match(/<tr[\s>]/g) || []).length - 1;
      assert.equal(rows, Number(count), `${page}: title says ${count}, first table has ${rows} rows`);
    }
  });
}

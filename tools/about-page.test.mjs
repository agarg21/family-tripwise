import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { expectedSitemapCount } from "./sitemap-inventory.mjs";

const html = readFileSync("site/about.html", "utf8");
const generator = readFileSync("tools/generate-pages.mjs", "utf8");

test("About profiles distinguish the founder from the AI contributor", () => {
  for (const id of ["apoorva-garg", "miles-rowan"]) {
    assert.equal(html.split(`id="${id}"`).length - 1, 1);
    assert.ok(html.includes(`href="#${id}"`));
  }
  assert.match(html, /Apoorva Garg on LinkedIn/);
  assert.match(html, /href="https:\/\/www\.linkedin\.com\/in\/apoorvag20\/"/);
  assert.match(html, /Founder and publisher/);
  assert.equal(html.split("AI employee &middot; Family travel research").length - 1, 1);
  assert.match(html, /Miles specializes in family hotels, activity comparisons, and itineraries/);
  assert.doesNotMatch(html, /not a human traveler|Miles has no personal trips|not a separate human employee/);
  assert.match(html, /A separate AI reviewer checks material changes/);
  assert.match(html, /#coverage, #contributors, #apoorva-garg, #miles-rowan \{ scroll-margin-top: 96px; \}/);
  assert.doesNotMatch(html, /distinguish official facts, research-based interpretation, and human-verified experience|Human review required|Unless a page says otherwise/);
  assert.match(html, /Every Family Tripwise guide is AI-assisted research from dated official sources\. No guide is based on a firsthand visit by our team\./);
  assert.match(html, /We do not present any guidance as firsthand or human-verified experience\./);
  assert.match(html, /<strong>Last updated:<\/strong> November 13, 2026/);
  // R1 step 4 (review #8): no personality lines for the AI contributor.
  assert.doesNotMatch(html, /Curious about|meticulous|room for a break/i);
  // Only the founder may appear as a Person (Organization founder, R1 step 3); never the AI contributor.
  assert.deepEqual([...html.matchAll(/"@type"\s*:\s*"Person"\s*,\s*"name"\s*:\s*"([^"]+)"/g)].map((m) => m[1]), ["Apoorva Garg"]);
  assert.equal((html.match(/"@type"\s*:\s*"Person"/g) || []).length, 1);
});

test("About profile content is maintained in the generator", () => {
  const profileSection = html.match(/<section[^>]*aria-labelledby="contributors">[\s\S]*?<\/section>/)?.[0];
  assert.ok(profileSection);
  assert.ok(generator.includes(profileSection));
});

test("About preserves metadata and URL inventory while correcting coverage", () => {
  assert.match(html, /<title>How Family Tripwise Builds Family Travel Guides<\/title>/);
  assert.match(html, /<h1>How Family Tripwise builds family travel guides<\/h1>/);
  assert.match(html, /rel="canonical" href="https:\/\/familytripwise\.com\/about\.html"/);
  assert.doesNotMatch(html, /noindex|focused 5-city test/);
  // Scope (R1 step 4): every destination with a guide in the sitemap is named in the coverage list.
  assert.match(html, /<strong>Current scope:<\/strong> 11 destinations/);
  const coverage = html.match(/<ul class="coverage-list">[\s\S]*?<\/ul>/)?.[0];
  assert.ok(coverage);
  for (const city of ["San Diego", "New York City", "Chicago", "Las Vegas", "San Antonio", "Washington DC", "Boston", "Orlando", "Cancun", "Puerto Vallarta", "London, UK"]) assert.ok(coverage.includes(city), city);
  // Every coverage link points at a sitemap URL, so the list cannot link to a missing page.
  const sitemapText = readFileSync("site/sitemap.xml", "utf8");
  const links = [...coverage.matchAll(/href="\.\/([^"]+)"/g)].map((m) => m[1]);
  assert.equal(links.length, 15);
  for (const link of links) assert.ok(sitemapText.includes(`<loc>https://familytripwise.com/${link}</loc>`), link);
  assert.doesNotMatch(html, /Our guides cover San Diego, Las Vegas, New York City, Chicago, and San Antonio\./);
  assert.match(html, /Coverage varies by destination/);
  const sitemap = readFileSync("site/sitemap.xml", "utf8");
  assert.equal((sitemap.match(/<loc>/g) || []).length, expectedSitemapCount());
  assert.match(html, /href="\.\/contributors\/miles-rowan\.html"/);
  assert.equal((sitemap.match(/<loc>https:\/\/familytripwise\.com\/about\.html<\/loc>/g) || []).length, 1);
});

test("Home page does not imply human-reviewed or firsthand claims", () => {
  const index = readFileSync("site/index.html", "utf8");
  assert.doesNotMatch(index, /human-reviewed|human reviewer supplied/);
  assert.match(index, /our guides are AI-assisted research from dated official sources, not firsthand visits/);
});

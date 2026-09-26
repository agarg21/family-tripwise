import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

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
  assert.match(html, /AI research contributor &middot; not a human traveler/);
  assert.match(html, /Miles has no personal trips, hotel stays, or lived experience/);
  assert.match(html, /not a claim that Miles authored every existing guide/);
  assert.match(html, /does not mean Apoorva personally wrote, visited, or reviewed every place or page/);
  assert.match(html, /A separate AI reviewer checks material changes/);
  assert.match(html, /#contributors, #apoorva-garg, #miles-rowan \{ scroll-margin-top: 96px; \}/);
  assert.match(html, /not human review, independent fieldwork, or a guarantee of accuracy/);
  assert.doesNotMatch(html, /"@type"\s*:\s*"Person"/);
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
  assert.match(html, /lodging comparisons for Cancun and Orlando/);
  assert.match(html, /Coverage varies by destination/);
  const sitemap = readFileSync("site/sitemap.xml", "utf8");
  assert.equal((sitemap.match(/<loc>/g) || []).length, 30);
  assert.equal((sitemap.match(/<loc>https:\/\/familytripwise\.com\/about\.html<\/loc>/g) || []).length, 1);
});

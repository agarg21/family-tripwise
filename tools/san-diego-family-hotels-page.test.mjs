import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import assert from "node:assert/strict";

const root = fileURLToPath(new URL("../", import.meta.url));
const pagePath = join(root, "site", "where-to-stay", "san-diego-family-hotels.html");
const html = readFileSync(pagePath, "utf8");

test("publishes the San Diego family hotel page as an indexable comparison guide", () => {
  const sitemap = readFileSync(join(root, "site", "sitemap.xml"), "utf8");

  assert.match(html, /<link rel="canonical" href="https:\/\/familytripwise\.com\/where-to-stay\/san-diego-family-hotels\.html">/);
  assert.doesNotMatch(html, /<meta[^>]+name=["']robots["'][^>]+noindex/i);
  assert.equal((sitemap.match(/https:\/\/familytripwise\.com\/where-to-stay\/san-diego-family-hotels\.html/g) || []).length, 1);
  assert.match(html, /<title>Top Family Hotels in San Diego: 8 Options by Trip Style<\/title>/);
  assert.match(html, /<h1>Top Family Hotels in San Diego: 8 Options by Trip Style<\/h1>/);
  assert.match(html, /Last checked:<\/strong> July 18, 2026/);
  assert.match(html, /hotel facts, public online review patterns, and family planning checks/);
  assert.match(html, /confirm the exact room type, total price, parking, crib or rollaway needs, and cancellation terms/i);
});

test("covers eight named hotel options with dollar ranges and map links", () => {
  const hotelNames = [
    "Bahia Resort Hotel",
    "San Diego Mission Bay Resort",
    "Hyatt Regency Mission Bay Spa and Marina",
    "Paradise Point Resort &amp; Spa",
    "Catamaran Resort Hotel and Spa",
    "Homewood Suites San Diego Downtown/Bayside",
    "LEGOLAND Hotel or Castle Hotel",
    "Loews Coronado Bay Resort"
  ];

  for (const name of hotelNames) {
    assert.match(html, new RegExp(name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  for (const range of ["$340-$630+", "$375-$500+", "$270-$350+", "$240-$360+", "$395-$740+", "$265-$350+", "Package-priced", "$235-$360+"]) {
    assert.match(html, new RegExp(range.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  assert.match(html, /Rough nightly range, not a quote/);
  assert.match(html, /final all-in totals/);
  assert.match(html, /https:\/\/www\.google\.com\/maps\/search\/\?api=1&amp;query=Bahia%20Resort%20Hotel%20San%20Diego/);
  assert.match(html, /Verify before booking/);
  assert.match(html, /Crib, rollaway, connecting room/);
  assert.match(html, /Safety, quiet, exact routes/);
  assert.match(html, /<dt>Online reviews<\/dt><dd>Paraphrased public themes from travel review and booking sites<\/dd>/);
  assert.match(html, /<h4>Online review patterns<\/h4>/);
  assert.match(html, /Online review patterns come from public travel review and booking sites/);
  assert.doesNotMatch(html, /review[- ]signal/i);
});

test("embeds the shared Google My Maps view instead of the native schematic POC", () => {
  assert.match(html, /class="google-my-map"/);
  assert.match(html, /title="Family Tripwise San Diego family hotels and kid activity map"/);
  assert.match(html, /src="https:\/\/www\.google\.com\/maps\/d\/embed\?mid=19tptDfcCGkrLLpofrO8ponPdeCefQKc&amp;ll=32\.823313151707154%2C-117\.28066802355525&amp;z=13"/);
  assert.match(html, /Open the full Google map/);
  assert.match(html, /Use the embedded Google My Maps view for clustering/);
  assert.equal((html.match(/<iframe/g) || []).length, 1);
  assert.doesNotMatch(html, /class="san-diego-schematic-map"|schematic-marker|Schematic map for clustering/i);
  assert.doesNotMatch(html, /maps\.googleapis\.com|key=YOUR_API_KEY|maps\/embed\/v1/i);
});

test("avoids affiliate, ordinal ranking, generic tradeoff blocks, and unsupported claims", () => {
  assert.doesNotMatch(html, /affiliate/i);
  assert.doesNotMatch(html, /#1|No\. 1|number one/i);
  assert.doesNotMatch(html, /safest hotel|quietest hotel|guaranteed family|personally verified/i);
  assert.doesNotMatch(html, /human-review-gated|Evidence status|researched candidates|Research-based and source-dated/i);
  assert.doesNotMatch(html, /<h4>Tradeoffs to check<\/h4>/i);
  assert.doesNotMatch(html, /<dt>Planning band<\/dt>/i);
  assert.doesNotMatch(html, /<th>Fees\/parking signal<\/th>/i);
  assert.doesNotMatch(html, /book now|reserve now|get deal|check availability/i);
  assert.match(html, /Use this as a clean shortlist, not a ranking/);
});

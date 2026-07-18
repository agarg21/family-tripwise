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
  assert.match(html, /Last checked:<\/strong> July 18, 2026/);
  assert.match(html, /hotel facts, public review patterns, and family planning checks/);
  assert.match(html, /confirm the exact room type, total price, parking, crib or rollaway needs, and cancellation terms/i);
});

test("covers eight named hotel options with booking-time caveats", () => {
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

  assert.match(html, /Rough room-night band, not a quote/);
  assert.match(html, /final all-in totals/);
  assert.match(html, /Verify before booking/);
  assert.match(html, /Crib, rollaway, connecting room/);
  assert.match(html, /Safety, quiet, exact routes/);
});

test("avoids affiliate, ordinal ranking, and unsupported trust-sensitive claims", () => {
  assert.doesNotMatch(html, /affiliate/i);
  assert.doesNotMatch(html, /#1|No\. 1|number one/i);
  assert.doesNotMatch(html, /safest hotel|quietest hotel|guaranteed family|personally verified/i);
  assert.doesNotMatch(html, /human-review-gated|Evidence status|researched candidates|Research-based and source-dated/i);
  assert.doesNotMatch(html, /book now|reserve now|get deal|check availability/i);
  assert.match(html, /Use this as a clean shortlist, not a ranking/);
});

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = fileURLToPath(new URL("../", import.meta.url));
const stay = readFileSync(new URL("../site/where-to-stay/san-diego-with-kids.html", import.meta.url), "utf8");
const hotels = readFileSync(new URL("../site/where-to-stay/san-diego-family-hotels.html", import.meta.url), "utf8");
const sitemap = readFileSync(new URL("../site/sitemap.xml", import.meta.url), "utf8");

test("keeps both San Diego lodging pages canonical, indexable, and in the sitemap", () => {
  const urls = [
    "https://familytripwise.com/where-to-stay/san-diego-with-kids.html",
    "https://familytripwise.com/where-to-stay/san-diego-family-hotels.html",
  ];

  for (const [index, url] of urls.entries()) {
    const html = index === 0 ? stay : hotels;
    assert.match(html, new RegExp(`<link rel="canonical" href="${url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}">`));
    assert.doesNotMatch(html, /<meta[^>]+name=["']robots["'][^>]+noindex/i);
    assert.equal((sitemap.match(new RegExp(url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) || []).length, 1);
  }
});

test("gives the area page one scan layer, one detail layer, and one application layer", () => {
  assert.match(stay, /Choose the base that matches the trip/);
  assert.match(stay, /Five areas, matched to different family trips/);
  assert.equal((stay.match(/<article class="quick-pick">/g) || []).length, 5);
  assert.match(stay, /Compare the five bases side by side/);
  assert.match(stay, /<th>Best starting point for<\/th>/);
  assert.equal((stay.match(/<tbody>[\s\S]*?<\/tbody>/g) || []).length, 1);
  assert.match(stay, /Choose your biggest family constraint/);
  assert.match(stay, /Four checks before choosing the exact hotel/);
  assert.match(stay, /Continue planning from the chosen base/);
});

test("keeps hotel-list intent on the hotel page instead of duplicating hotel profiles", () => {
  assert.match(stay, /12 family hotel options/);
  assert.match(stay, /href="\.\/san-diego-family-hotels\.html"/);
  assert.doesNotMatch(stay, /Research-backed hotel verification notes/);
  assert.doesNotMatch(stay, /<h3>Bahia Resort Hotel<\/h3>|<h3>San Diego Mission Bay Resort<\/h3>|<h3>Homewood Suites San Diego Downtown\/Bayside<\/h3>/);

  assert.match(hotels, /12 options, with the useful checks up front/);
  assert.match(hotels, /Themes in sampled online reviews/);
  assert.match(hotels, /Approx\. nightly price/);
});

test("uses concise source boundaries without defensive internal language", () => {
  assert.match(stay, /Last updated:<\/strong> July 20, 2026/);
  assert.match(stay, /Area guidance uses official destination, transit, attraction, and hotel sources/);
  assert.doesNotMatch(stay, /model-derived|unreviewed scores|UNKNOWN|human-review question/i);
  assert.doesNotMatch(stay, /Driving or rideshare for most city attractions|A car is usually the simplest trip model|limited walkability at many hotels|Often practical for returning between driving-based outings/i);
  assert.match(stay, /Getting around to test/);
  assert.match(stay, /Time each return; central location alone does not prove a practical reset/);
  assert.doesNotMatch(hotels, /Evidence status|human-review-gated|researched candidates|universal winner|Release boundary/i);
});

test("keeps both pages detailed without returning to their prior repetition", () => {
  const visibleWords = (html) => html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .trim()
    .split(/\s+/).length;

  assert.ok(visibleWords(stay) >= 900 && visibleWords(stay) <= 1800);
  assert.ok(visibleWords(hotels) >= 2000 && visibleWords(hotels) <= 3200);
});

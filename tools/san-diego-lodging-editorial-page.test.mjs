import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { stripSiteChrome } from "./page-generation/site-chrome.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const stay = readFileSync(new URL("../site/where-to-stay/san-diego-with-kids.html", import.meta.url), "utf8");
const hotels = readFileSync(new URL("../site/where-to-stay/san-diego-family-hotels.html", import.meta.url), "utf8");
const sitemap = readFileSync(new URL("../site/sitemap.xml", import.meta.url), "utf8");
const staySchemas = [...stay.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
  .map((match) => JSON.parse(match[1]));

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
  assert.match(stay, /<title>Where to Stay in San Diego With Kids: 5 Areas Compared<\/title>/);
  assert.match(stay, /<meta name="description" content="Compare five San Diego areas for a family trip/);
  assert.match(stay, /<h1>Where to Stay in San Diego With Kids: 5 Areas Compared<\/h1>/);
  assert.match(stay, /Choose among Mission Bay, La Jolla, Downtown\/Little Italy, Coronado, and Mission Valley/);
  assert.match(stay, /Choose the base that matches the trip/);
  assert.match(stay, /Five areas, matched to different family trips/);
  assert.equal((stay.match(/<article class="quick-pick">/g) || []).length, 5);
  assert.match(stay, /Compare the five bases side by side/);
  assert.match(stay, /<th>Best starting point for<\/th>/);
  assert.equal((stay.match(/<tbody>[\s\S]*?<\/tbody>/g) || []).length, 1);
  assert.match(stay, /Choose your biggest family constraint/);
  assert.match(stay, /Choose the area first, then verify the exact hotel/);
  assert.match(stay, /Move from the chosen area to a named hotel/);

  const itemList = staySchemas.find((schema) => schema["@type"] === "ItemList");
  assert.equal(itemList?.name, "San Diego family stay area options");
  assert.deepEqual(itemList?.itemListElement.map((item) => item.name), [
    "Mission Bay",
    "La Jolla",
    "Downtown / Little Italy",
    "Coronado",
    "Mission Valley / Hotel Circle",
  ]);
  assert.equal(staySchemas.some((schema) => schema["@type"] === "FAQPage"), false);
});

test("keeps hotel-list intent on the hotel page instead of duplicating hotel profiles", () => {
  assert.match(stay, /Compare 12 family hotels/);
  assert.match(stay, /Compare 12 San Diego family hotels/);
  assert.match(stay, /href="\.\/san-diego-family-hotels\.html"/);
  assert.doesNotMatch(stay, /Research-backed hotel verification notes/);
  assert.doesNotMatch(stay, /<h3>Bahia Resort Hotel<\/h3>|<h3>San Diego Mission Bay Resort<\/h3>|<h3>Homewood Suites San Diego Downtown\/Bayside<\/h3>/);

  assert.match(hotels, /12 options, with the useful checks up front/);
  assert.match(hotels, /Themes in sampled online reviews/);
  assert.match(hotels, /Nightly price \(USD\/room\)/);
});

test("uses concise source boundaries without defensive internal language", () => {
  assert.match(stay, /Area guidance checked:<\/strong> July 20, 2026; page updated August 4, 2026/);
  assert.match(stay, /Area guidance uses official destination, transit, attraction, and hotel sources/);
  assert.doesNotMatch(stay, /model-derived|unreviewed scores|UNKNOWN|human-review question/i);
  assert.doesNotMatch(stay, /Driving or rideshare for most city attractions|A car is usually the simplest trip model|limited walkability at many hotels|Often practical for returning between driving-based outings/i);
  assert.match(stay, /Getting around to test/);
  assert.match(stay, /Time each return; central location alone does not prove a practical reset/);
  assert.doesNotMatch(hotels, /Evidence status|human-review-gated|researched candidates|universal winner|Release boundary/i);
});

test("keeps both pages detailed without returning to their prior repetition", () => {
  const visibleWords = (html) => stripSiteChrome(html)
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .trim()
    .split(/\s+/).length;

  assert.ok(visibleWords(stay) >= 900 && visibleWords(stay) <= 1800);
  const roomNote = hotels.match(/<p class="hotel-room-note" data-room-policy="homewood-bayside">[\s\S]*?<\/p>/g) ?? [];
  const roomScope = hotels.match(/<span data-room-source-scope>[\s\S]*?<\/span> /g) ?? [];
  assert.equal(roomNote.length, 1);
  assert.equal(roomScope.length, 1);
  assert.ok(visibleWords(roomNote[0]) <= 180);
  assert.ok(visibleWords(roomScope[0]) <= 30);
  const retainedHotels = hotels.replace(roomNote[0], "").replace(roomScope[0], "");
  // Q07 (2026-10-27) added the answer box, price basis, dated per-hotel samples and the Homewood official family sample.
  assert.ok(visibleWords(retainedHotels) >= 2000 && visibleWords(retainedHotels) <= 3900);
});

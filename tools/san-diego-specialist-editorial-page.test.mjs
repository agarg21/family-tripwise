import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const pages = {
  toddler: readFileSync("site/things-to-do/san-diego-with-toddlers.html", "utf8"),
  teen: readFileSync("site/things-to-do/san-diego-with-teens.html", "utf8"),
  itinerary: readFileSync("site/family-itinerary/san-diego-with-kids.html", "utf8")
};
const sitemap = readFileSync("site/sitemap.xml", "utf8");

test("specialist pages keep their core decision surfaces", () => {
  assert.match(pages.toddler, /Activity decision table/);
  assert.match(pages.toddler, /Detailed activity notes/);
  assert.match(pages.toddler, /Turn the list into a realistic family day/);

  assert.match(pages.teen, /Teen activity decision table/);
  assert.match(pages.teen, /Detailed notes for older-kid planning/);
  assert.match(pages.teen, /Route ideas that avoid generic sightseeing marathons/);

  assert.match(pages.itinerary, /1-day, 2-day, 3-day, toddler, teen, and rainy-day variants/);
  assert.match(pages.itinerary, /Use a real stop rule/);
  assert.match(pages.itinerary, /Swap activities without rebuilding the whole trip/);
});

test("duplicated starter blocks and unrelated source residue are removed", () => {
  for (const html of Object.values(pages)) {
    assert.doesNotMatch(html, /Bahia Resort Hotel FAQ/);
    assert.doesNotMatch(html, /San Diego Mission Bay Resort FAQ/);
    assert.doesNotMatch(html, /Homewood Suites San Diego Downtown\/Bayside/);
    assert.doesNotMatch(html, /How this guide was built:/);
  }

  assert.doesNotMatch(pages.toddler, /Best-fit activities for toddlers/);
  assert.doesNotMatch(pages.toddler, /Teen-friendly plan/);
  assert.doesNotMatch(pages.teen, /Best-fit activities for teens/);
  assert.doesNotMatch(pages.itinerary, /Condensed weekend plan/);
  assert.doesNotMatch(pages.itinerary, /Nap-friendly structure/);
});

test("edited pages retain canonical and indexable state", () => {
  const expectedCanonicals = {
    toddler: "https://familytripwise.com/things-to-do/san-diego-with-toddlers.html",
    teen: "https://familytripwise.com/things-to-do/san-diego-with-teens.html",
    itinerary: "https://familytripwise.com/family-itinerary/san-diego-with-kids.html"
  };

  for (const [name, html] of Object.entries(pages)) {
    assert.match(html, new RegExp(`<link rel="canonical" href="${expectedCanonicals[name]}">`));
    assert.doesNotMatch(html, /noindex/i);
    assert.match(sitemap, new RegExp(`<loc>${expectedCanonicals[name]}</loc>`));
  }
});

test("the corrected two-day itinerary and teen one-day promise remain substantive", () => {
  assert.match(pages.itinerary, /2-day first visit<\/td><td>Day 1 zoo\/Balboa; Day 2 Mission Bay or La Jolla by age/);
  assert.doesNotMatch(pages.itinerary, /2-day option[\s\S]{0,500}Day 1[\s\S]{0,160}Mission Bay or hotel pool, groceries/);
  assert.match(pages.teen, /1-day teen plan/);
  assert.match(pages.teen, /realistic one- and two-day plans/);
});

test("categorical planning fields are visibly labeled as editorial estimates", () => {
  assert.match(pages.toddler, /fields are Family Tripwise editorial estimates, not venue guarantees/);
  assert.match(pages.teen, /fields are Family Tripwise editorial estimates, not venue guarantees/);
  assert.match(pages.toddler, /San Diego County beach and bay status/);
  assert.match(pages.teen, /San Diego County beach and bay status/);
});

test("editorial compression preserves useful detail without returning to page bloat", () => {
  const visibleWordCounts = Object.fromEntries(
    Object.entries(pages).map(([name, html]) => [
      name,
      html.replace(/<script[\s\S]*?<\/script>/g, " ").replace(/<[^>]+>/g, " ").trim().split(/\s+/).length
    ])
  );

  assert.ok(visibleWordCounts.toddler >= 750 && visibleWordCounts.toddler <= 1200);
  assert.ok(visibleWordCounts.teen >= 950 && visibleWordCounts.teen <= 1500);
  assert.ok(visibleWordCounts.itinerary >= 800 && visibleWordCounts.itinerary <= 1300);
});

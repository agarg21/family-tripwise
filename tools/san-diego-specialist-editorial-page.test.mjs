import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const pages = {
  toddler: readFileSync("site/things-to-do/san-diego-with-toddlers.html", "utf8"),
  teen: readFileSync("site/things-to-do/san-diego-with-teens.html", "utf8"),
  itinerary: readFileSync("site/family-itinerary/san-diego-with-kids.html", "utf8")
};
const sitemap = readFileSync("site/sitemap.xml", "utf8");

test("San Diego existing drafts keep a short editing rule, after the plans", () => {
  // D23 4e: the 95-word note moved out of the first screens and became one rule.
  const html = pages.itinerary;
  assert.match(html, /Already have a draft\?/);
  assert.match(html, /Keep your bookings fixed and give each half day one part of town/);
  assert.match(html, /Cut cross-town extras first/);
  assert.doesNotMatch(html, /class="existing-draft-note"/);
  assert.ok(html.indexOf('class="quick-pick-grid"') < html.indexOf("Already have a draft?"));
  for (const peer of [pages.toddler, pages.teen]) assert.doesNotMatch(peer, /existing-draft-note/);
});

test("specialist pages keep their core decision surfaces", () => {
  assert.match(pages.toddler, /Activity decision table/);
  assert.match(pages.toddler, /Detailed activity notes/);
  assert.match(pages.toddler, /A 3-day plan built around naps/);
  // Family-of-4 cost 2nd from official Nov 1 prices, not "$" tiers (D23 3q).
  assert.match(pages.toddler, /<th[^>]*>Family of 4 cost<\/th>/);
  assert.match(pages.toddler, /"name":"Birch Aquarium","description":"Short indoor/);

  assert.match(pages.teen, /Teen activity decision table/);
  // ItemList carries real descriptions, not the age column (D23 3p).
  assert.match(pages.teen, /"name":"Birch Aquarium","description":"Compact weather backup/);
  assert.match(pages.teen, /Detailed notes for older-kid planning/);
  assert.match(pages.teen, /Route ideas that avoid generic sightseeing marathons/);

  // D23 4e: priced plan box, three day plans, swaps, rules.
  assert.match(pages.itinerary, /≈ \$292 to \$422/);
  assert.match(pages.itinerary, /Your day-by-day plans/);
  assert.match(pages.itinerary, /Change the plan for age, weather, budget or your hotel/);
  assert.match(pages.itinerary, /Four rules that protect the itinerary/);
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
  assert.match(pages.itinerary, /Day 1: Zoo[\s\S]{0,300}Day 2: Mission Bay/);
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

  // D23 3q: toddlers now has the teen page's shape (glance, priced table, one more pick), so the teen ceiling.
  assert.ok(visibleWordCounts.toddler >= 750 && visibleWordCounts.toddler <= 1500);
  assert.ok(visibleWordCounts.teen >= 950 && visibleWordCounts.teen <= 1500);
  // D23 4e: same shape as the NYC, Chicago and San Antonio itineraries (official facts and plans mostly collapsed).
  assert.ok(visibleWordCounts.itinerary >= 800 && visibleWordCounts.itinerary <= 2300);
});

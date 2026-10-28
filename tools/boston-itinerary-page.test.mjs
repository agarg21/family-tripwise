import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { bostonItineraryPath, bostonItineraryCheckedOn, bostonVenues, bostonTransit, bostonItineraryPage, bostonItineraryMaintenance } from "./page-generation/boston-itinerary-page.mjs";
import { stripSiteChrome } from "./page-generation/site-chrome.mjs";

const read = (path) => readFileSync(path, "utf8");
const html = read(`site/${bostonItineraryPath}`);
const research = read("docs/research/boston-itinerary-facts-2026-10-27.md");

test("Boston itinerary is generated, canonical, in the sitemap and linked from the Boston hotels page", () => {
  assert.equal(html, bostonItineraryPage());
  assert.match(html, /<link rel="canonical" href="https:\/\/familytripwise.com\/family-itinerary\/boston-with-kids.html">/);
  assert.equal(html.split('<main id="main">').length - 1, 1);
  assert.ok(read("site/sitemap.xml").includes(`<loc>https://familytripwise.com/${bostonItineraryPath}</loc>`));
  const hotels = stripSiteChrome(read("site/where-to-stay/boston-family-hotels.html"));
  assert.ok(hotels.includes('href="../family-itinerary/boston-with-kids.html"'));
  assert.ok(hotels.includes('id="rest"'));
  assert.ok(html.includes('href="../where-to-stay/boston-family-hotels.html#rest"'));
});

test("short answer leads with the plan, the weekday/stroller catch and observed costs only", () => {
  const box = html.match(/<section id="boston-itinerary-answer"[\s\S]*?<\/section>/)[0];
  assert.equal((box.match(/<p>/g) || []).length, 3);
  assert.match(box, /closed Tuesdays/);
  assert.match(box, /Wednesday–Sunday only/);
  assert.match(box, /USD 33 adult \/ USD 28 age 3–11/);
  assert.match(box, /Aquarium prices: check its ticket site/);
  assert.doesNotMatch(box, /Aquarium[^.]*USD/);
});

test("every venue card carries an official source and the observation date; research record lists every source", () => {
  assert.equal(bostonItineraryCheckedOn, "2026-10-27");
  for (const venue of bostonVenues) {
    const card = html.match(new RegExp(`<article class="detail-card" id="venue-${venue.id}">[\\s\\S]*?</article>`))[0];
    assert.ok(card.includes(`href="${venue.source}"`), venue.id);
    assert.match(card, /Official fact, checked October 27, 2026/);
    assert.ok(research.includes(venue.source), venue.source);
    if (venue.extraSource) assert.ok(research.includes(venue.extraSource[0]), venue.extraSource[0]);
  }
  assert.ok(research.includes(bostonTransit.source));
  assert.ok(html.includes(`href="${bostonTransit.source}"`));
});

test("page makes no route, stroller-practicality, firsthand, re-entry or forward review-date claims it cannot support", () => {
  const text = stripSiteChrome(html).replace(/<[^>]+>/g, " ");
  assert.doesNotMatch(text, /stroller[- ]friendly|minute walk|\bwe (visited|stayed|tried)\b|review (by|before)|recheck by/i);
  assert.match(text, /We have not tested walking times, stroller routes or queues/);
  assert.match(text, /planning estimates/);
  assert.match(text, /does not state a re-entry rule/);
  assert.match(text, /Closed for the season/);
  assert.doesNotMatch(text, /2027 (season|fares?) (is|are|runs?)/i);
});

test("maintenance clock is dated and never renews facts", () => {
  assert.equal(bostonItineraryMaintenance("2026-10-26").evidence_state, "not-yet-observed-at-report-date");
  const after = bostonItineraryMaintenance("2026-11-12");
  assert.equal(after.automatic_fact_renewal, false);
  assert.ok(after.official.every((row) => row.checked_on === "2026-10-27" && row.freshness.state === "review-due"));
  assert.ok(bostonItineraryMaintenance("2026-10-28").official.every((row) => row.freshness.state === "within-review-interval"));
});

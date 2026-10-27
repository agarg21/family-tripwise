import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { dcItineraryPath, dcItineraryCheckedOn, dcVenues, dcMetro, washingtonDcItineraryPage, dcItineraryMaintenance } from "./page-generation/washington-dc-itinerary-page.mjs";
import { stripSiteChrome } from "./page-generation/site-chrome.mjs";

const read = (path) => readFileSync(path, "utf8");
const html = read(`site/${dcItineraryPath}`);
const research = read("docs/research/washington-dc-itinerary-facts-2026-10-27.md");

test("DC itinerary is generated, canonical, in the sitemap and linked from the DC hotels page", () => {
  assert.equal(html, washingtonDcItineraryPage());
  assert.match(html, /<link rel="canonical" href="https:\/\/familytripwise.com\/family-itinerary\/washington-dc-with-kids.html">/);
  assert.equal(html.split('<main id="main">').length - 1, 1);
  assert.ok(read("site/sitemap.xml").includes(`<loc>https://familytripwise.com/${dcItineraryPath}</loc>`));
  const hotels = stripSiteChrome(read("site/where-to-stay/washington-dc-family-hotels.html"));
  assert.ok(hotels.includes('href="../family-itinerary/washington-dc-with-kids.html"'));
  assert.ok(html.includes('href="../where-to-stay/washington-dc-family-hotels.html"'));
});

test("short answer leads with the plan, the pass catch and observed costs only", () => {
  const box = html.match(/<section id="dc-itinerary-answer"[\s\S]*?<\/section>/)[0];
  assert.equal((box.match(/<p>/g) || []).length, 3);
  assert.match(box, /free pass for every person, babies included/);
  assert.match(box, /USD 30–40 per vehicle/);
  assert.match(box, /USD 1\.00 fee each/);
});

test("every venue card carries an official source and the observation date; research record lists every source", () => {
  assert.equal(dcItineraryCheckedOn, "2026-10-27");
  for (const venue of dcVenues) {
    const card = html.match(new RegExp(`<article class="detail-card" id="venue-${venue.id}">[\\s\\S]*?</article>`))[0];
    assert.ok(card.includes(`href="${venue.source}"`), venue.id);
    assert.match(card, /Official fact, checked October 27, 2026/);
    assert.ok(research.includes(venue.source.replace(/\/$/, "")), venue.source);
  }
  assert.ok(research.includes(dcMetro.source));
  assert.ok(html.includes(`href="${dcMetro.source}"`));
});

test("page makes no route, stroller-practicality, firsthand or forward review-date claims", () => {
  const text = stripSiteChrome(html).replace(/<[^>]+>/g, " ");
  assert.doesNotMatch(text, /stroller[- ]friendly|minute walk|\bwe (visited|stayed|tried)\b|review (by|before)|recheck by/i);
  assert.match(text, /We have not tested walking times, stroller routes or queues/);
  assert.match(text, /planning estimates/);
});

test("maintenance clock is dated and never renews facts", () => {
  const before = dcItineraryMaintenance("2026-10-26");
  assert.equal(before.evidence_state, "not-yet-observed-at-report-date");
  const after = dcItineraryMaintenance("2026-11-12");
  assert.equal(after.automatic_fact_renewal, false);
  assert.ok(after.official.every((row) => row.checked_on === "2026-10-27" && row.freshness.state === "review-due"));
  assert.ok(dcItineraryMaintenance("2026-10-28").official.every((row) => row.freshness.state === "within-review-interval"));
});

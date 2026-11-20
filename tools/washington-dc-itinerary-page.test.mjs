import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { dcItineraryPath, dcItineraryCheckedOn, dcOlderFacts, dcVenues, dcMetro, washingtonDcItineraryPage, dcItineraryMaintenance } from "./page-generation/washington-dc-itinerary-page.mjs";
import { stripSiteChrome } from "./page-generation/site-chrome.mjs";

const read = (path) => readFileSync(path, "utf8");
const html = read(`site/${dcItineraryPath}`);
const research = read("docs/research/washington-dc-itinerary-facts-2026-11-20.md");

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
  assert.match(box, /\$30–40 per vehicle/);
  assert.match(box, /\$1\.00 fee each/);
});

test("every venue card carries an official source and the observation date; research record lists every source", () => {
  assert.equal(dcItineraryCheckedOn, "2026-11-20");
  for (const venue of dcVenues) {
    const card = html.match(new RegExp(`<article class="detail-card" id="venue-${venue.id}">[\\s\\S]*?</article>`))[0];
    assert.ok(card.includes(`href="${venue.source}"`), venue.id);
    assert.match(card, /Official fact, checked November 20, 2026 unless dated/);
    assert.ok(research.includes(venue.source.replace(/\/$/, "")), venue.source);
  }
  for (const [url] of dcVenues.flatMap((venue) => venue.extraSources || [])) assert.ok(research.includes(url), url);
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
  const after = dcItineraryMaintenance("2026-12-05");
  assert.equal(after.automatic_fact_renewal, false);
  assert.ok(after.official.every((row) => row.freshness.state === "review-due"));
  const fresh = dcItineraryMaintenance("2026-11-21").official;
  assert.ok(fresh.filter((row) => row.checked_on === "2026-11-20").every((row) => row.freshness.state === "within-review-interval"));
  // sources not re-read on 2026-11-20 keep their own older date
  assert.ok(fresh.filter((row) => row.checked_on === "2026-11-06").length >= 3);
});

test("facts not re-shown on the re-read keep their older date on the page", () => {
  assert.ok(dcOlderFacts.length >= 1);
  for (const row of dcOlderFacts) assert.equal(row.checked_on, "2026-11-06");
  const card = html.match(/<article class="detail-card" id="venue-natural-history">[\s\S]*?<\/article>/)[0];
  assert.match(card, /Visitor tips<\/a> \(read November 6\)/);
  const history = html.match(/<article class="detail-card" id="venue-american-history">[\s\S]*?<\/article>/)[0];
  assert.match(history, /from its visit page on November 6; the page showed no hours on November 20, so check before you go/);
  const text = stripSiteChrome(html).replace(/<[^>]+>/g, " ");
  assert.doesNotMatch(text, /there is no storage|October 27/);
  assert.match(text, /its visit page mentions no lockers or bag storage/);
  assert.equal(dcItineraryMaintenance("2026-11-21").older_facts[0].freshness.state, "review-due");
});

test("Monument closure days and the Air and Space gallery release are dated, not forward claims", () => {
  const text = stripSiteChrome(html).replace(/<[^>]+>/g, " ");
  assert.doesNotMatch(text, /November 11|November 26|Thanksgiving/);
  assert.match(text, /hours page \(updated July 1\) lists December 8, the fees page \(updated November 10\) does not/);
  assert.match(text, /visit page says the renovation is complete/);
});

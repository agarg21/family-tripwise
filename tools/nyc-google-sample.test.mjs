// Q17b (OWNER D9/O2): the NYC October 11 samples for November 8-13, 2026 are replaced by labelled Google Hotels
// listings for the same family party that must leave the committed page and CSV a week before arrival.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { googleHotelSample, googleOneNight, liveSample, readReceipt } from "./page-generation/google-hotel-samples.mjs";
import { easternDate } from "./page-generation/sitemap.mjs";

const six = readReceipt("dataforseo-q17b-six-pages-b-2026-10-31.json");
const mid = readReceipt("dataforseo-q17b-midweek-a-2026-10-31.json");
const kids = [4, 8, 12];
const tryp = "TRYP by Wyndham New York City Times Square South";
const page = readFileSync(new URL("../site/where-to-stay/new-york-city-family-hotels.html", import.meta.url), "utf8");
const csv = readFileSync(new URL("../site/downloads/new-york-city-family-hotels.csv", import.meta.url), "utf8");

test("Beacon passes the 1-night control; TRYP and Radio City are 1-night searches only", () => {
  const beacon = googleHotelSample(six, "nyc-beacon", { title: "Hotel Beacon", childAges: kids });
  assert.deepEqual([beacon.nightly, beacon.control, beacon.check_in, beacon.nights, beacon.observed_on], [1160, 1233, "2027-01-15", 5, "2026-10-31"]);
  // Radio City and TRYP 5-night figures fail the 10% control, so they are never used as nightly stay prices.
  assert.equal(googleHotelSample(six, "nyc-radio-city", { title: "Radio City Apartments", childAges: kids }), null);
  assert.equal(googleHotelSample(six, "nyc-tryp", { title: tryp, childAges: kids }), null);
  assert.equal(googleOneNight(six, "nyc-tryp-1n", { title: tryp, childAges: kids }).nightly, 401);
  assert.equal(googleOneNight(mid, "nyc-tryp-mid-1n", { title: tryp, childAges: kids }).nightly, 305);
  assert.equal(googleOneNight(six, "nyc-radio-city-1n", { title: "Radio City Apartments", childAges: kids }).nightly, 798);
  // A 5-night search, an unpriced row, another party or another title never yields a one-night figure.
  assert.equal(googleOneNight(six, "nyc-tryp-5n", { title: tryp, childAges: kids }), null);
  assert.equal(googleOneNight(mid, "nyc-radio-city-mid-1n", { title: "Radio City Apartments", childAges: kids }), null);
  assert.equal(googleOneNight(six, "nyc-tryp-1n", { title: tryp, childAges: [4, 8] }), null);
  assert.equal(googleOneNight(six, "nyc-tryp-1n", { title: "TRYP by Wyndham New York City Times Square / Midtown", childAges: kids }), null);
  assert.equal(liveSample(beacon, "2027-01-07", 7), beacon);
  assert.equal(liveSample(beacon, "2027-01-08", 7), null);
});

test("committed page and CSV show the listings only before the drop date, never the Nov 8-13 samples", () => {
  const today = process.env.FT_BUILD_DATE || easternDate();
  for (const text of [page, csv]) assert.doesNotMatch(text, /November 8-13|12,718\.15|4,251\.14|3,154\.33|2,543\.63|850\.23|630\.87/);
  if (today < "2027-01-08") {
    assert.match(page, /Google Hotels listed Hotel Beacon at about \$1,160 a night for 2 adults and kids 4, 8 and 12, January 15 to 20, 2027 \(5 nights ≈ \$5,800, estimate; \$1,233 on a 1-night search\), seen October 31, 2026\./);
    assert.match(page, /at about \$305 \(Mon Jan 18\) to \$401 \(Fri Jan 15\) for one night/);
    assert.match(csv, /Family listing price \(Google Hotels; not a quote\)/);
    assert.match(csv, /Google Hotels listed Radio City Apartments at about \$798 for one night/);
  } else {
    // From January 8, 2027 this fails until `node tools/generate-pages.mjs` re-renders the page (a week before the stay).
    for (const text of [page, csv]) assert.doesNotMatch(text, /\$1,160|\$798 for one night|\$305 \(Mon/);
  }
});

// Q17b (OWNER D9/O2): London's November 8-13, 2026 samples are replaced by Google Hotels 1-night listings for the
// full party (2 adults + kids 4, 8, 12, 15) that must leave the committed page a week before the first listed night.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { googleOneNight, readReceipt } from "./page-generation/google-hotel-samples.mjs";
import { londonListings, londonListingDropOn, londonFamilyHotelPage } from "./page-generation/london-family-hotels-page.mjs";
import { easternDate } from "./page-generation/sitemap.mjs";

const page = readFileSync(new URL("../site/where-to-stay/london-family-hotels.html", import.meta.url), "utf8");
const kids = [4, 8, 12, 15];

test("1-night listings: exact title, full party, one unpaid USD row", () => {
  const c = readReceipt("dataforseo-q17b-six-pages-c-2026-10-31.json");
  const one = googleOneNight(c, "lon-marlin-limehouse-1n", { title: "Marlin Apartments Commercial Road - Limehouse", childAges: kids });
  assert.equal(one.nightly, 306); assert.equal(one.check_in, "2027-01-15"); assert.equal(one.nights, 1); assert.equal(one.observed_on, "2026-10-31");
  // Wrong party, a multi-night search, a near-miss title or an unpriced row never yields a figure.
  assert.equal(googleOneNight(c, "lon-marlin-limehouse-1n", { title: "Marlin Apartments Commercial Road - Limehouse", childAges: [4, 8, 12] }), null);
  assert.equal(googleOneNight(c, "lon-marlin-limehouse-5n", { title: "Marlin Apartments Commercial Road - Limehouse", childAges: kids }), null);
  assert.equal(googleOneNight(c, "lon-citadines-trafalgar-1n", { title: "Citadines Trafalgar Square", childAges: kids }), null);
  assert.equal(googleOneNight(readReceipt("dataforseo-q17b-midweek-c-2026-10-31.json"), "lon-citadines-trafalgar-mid-5n", { title: "Citadines Trafalgar Square London", childAges: kids }), null);
});

test("listings per apartment and the drop date", () => {
  const l = londonListings("2026-10-31");
  assert.deepEqual(Object.keys(l).sort(), ["citadines-trafalgar-two-bedroom", "marlin-limehouse-two-bedroom"]);
  assert.deepEqual(l["marlin-limehouse-two-bedroom"].map(n => [n.check_in, n.nightly]), [["2027-01-15", 306], ["2027-01-18", 332]]);
  assert.deepEqual(l["citadines-trafalgar-two-bedroom"].map(n => [n.check_in, n.nightly]), [["2027-01-15", 502], ["2027-01-18", 565]]);
  assert.equal(londonListingDropOn, "2027-01-08");
  assert.equal(Object.keys(londonListings("2027-01-07")).length, 2);
  assert.equal(Object.keys(londonListings("2027-01-08")).length, 0);
});

test("committed page shows the listings only before the drop date, never the November samples", () => {
  const today = process.env.FT_BUILD_DATE || easternDate();
  assert.doesNotMatch(page, /November 8-13|GBP \d/);
  if (today < londonListingDropOn) {
    assert.match(page, /About \$306-\$565 a night/);
    assert.match(page, /5 nights ≈ \$1,530-\$2,825 \(estimate\)/);
    assert.match(page, /seen October 31, 2026 · US dollars · room type not shown · taxes and fees may be extra · not a quote\./);
  } else {
    // From January 8, 2027 this fails until `node tools/generate-pages.mjs` re-renders the page.
    assert.doesNotMatch(page, /\$306|\$565/);
  }
});

// G18 (OWNER D39): London prices are 1-night Google Hotels searches for the page's family of 6 on a normal weekend and
// two holiday weekends, plus a family of 4 on the normal weekend. A sample leaves the page 7 days before its first night.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { londonWeekend, londonListings, londonFamilyHotelPage } from "./page-generation/london-family-hotels-page.mjs";
import { easternDate } from "./page-generation/sitemap.mjs";

const page = readFileSync(new URL("../site/where-to-stay/london-family-hotels.html", import.meta.url), "utf8");
const [lime, cit, queen] = ["marlin-limehouse-two-bedroom", "citadines-trafalgar-two-bedroom", "marlin-queen-street-two-bedroom"];
const at = "2026-11-05";
const nights = (id, set, four) => { const w = londonWeekend(id, set, at, four); return [w.fri.nightly, w.sat.nightly, w.average, w.total]; };

test("receipt figures per apartment, party and weekend", () => {
  assert.deepEqual(nights(lime, "weekend"), [374, 352, 363, 726]);
  assert.deepEqual(nights(cit, "weekend"), [605, 605, 605, 1210]); // Saturday from the second-keyword search
  assert.deepEqual(nights(lime, "christmas"), [568, 769, 669, 1337]);
  assert.deepEqual(nights(cit, "christmas"), [892, 1136, 1014, 2028]);
  assert.deepEqual(nights(lime, "newYear"), [519, 483, 501, 1002]);
  assert.deepEqual(nights(cit, "newYear"), [971, 971, 971, 1942]); // Friday from the second-keyword search
  assert.deepEqual(nights(lime, "weekend", true), [229, 191, 210, 420]);
  assert.deepEqual(nights(cit, "weekend", true), [343, 417, 380, 760]);
  assert.equal(londonWeekend(queen, "weekend", at), null); // no Google listing
});

test("samples drop 7 days before their first night", () => {
  assert.ok(londonWeekend(lime, "christmas", "2026-12-17")); assert.equal(londonWeekend(lime, "christmas", "2026-12-18"), null);
  assert.ok(londonWeekend(lime, "newYear", "2026-12-24")); assert.equal(londonWeekend(lime, "newYear", "2026-12-25"), null);
  assert.ok(londonWeekend(lime, "weekend", "2027-01-14")); assert.equal(londonWeekend(lime, "weekend", "2027-01-15"), null);
  assert.deepEqual(Object.keys(londonListings(at)).sort(), [cit, lime]);
  assert.equal(Object.keys(londonListings("2027-01-15")).length, 0);
});

test("committed page shows live samples only, never a past stay or the old January dates", () => {
  const today = process.env.FT_BUILD_DATE || easternDate();
  assert.doesNotMatch(page, /November 8-13|GBP \d|\$306|\$565|\$502|Staying 5 nights/);
  if (today < "2027-01-15") {
    assert.match(page, /About \$363-\$605 a night/);
    assert.match(page, /about \$726-\$1,210 for 2 nights/);
    assert.match(page, /Family of 4 \(kids 5, 8\):<\/strong> about \$210-\$380 a night/);
    assert.match(page, /seen November 5, 2026/i);
  } else assert.doesNotMatch(page, /\$363|\$605/);
  if (today < "2026-12-18") assert.match(page, /Christmas weekend: Dec 25–27, 2026/); else assert.doesNotMatch(page, /\$1,014/);
  if (today < "2026-12-25") assert.match(page, /New Year&#39;s weekend: Jan 1–3, 2027|New Year's weekend: Jan 1–3, 2027/); else assert.doesNotMatch(page, /\$971/);
});

test("after the last drop the page says prices expired, not that Google found no listing", () => {
  const h = londonFamilyHotelPage("2027-01-15");
  assert.doesNotMatch(h, /\$363|\$605|Lowest price|Holiday prices|These prices are for 6|Google prices November 5/);
  assert.match(h, /Check live rate/);
  assert.equal((h.match(/returned no listing matching this apartment/g) || []).length, 1);
  assert.equal((h.match(/were removed a week before those nights/g) || []).length, 2);
  assert.match(h, /Main catch:/);
});

test("this-week re-renders London before the sitemap ledger", () => {
  const src = readFileSync(new URL("./this-week.mjs", import.meta.url), "utf8");
  assert.ok(src.indexOf("writeLondonFamilyHotelsPage((") < src.indexOf("writeSitemap(siteDir"));
});

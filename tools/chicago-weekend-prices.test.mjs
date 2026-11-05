// G18 (OWNER D39, docs/plan/hotel-price-samples.md): Chicago hotels show a Fri-Sun weekend plus Christmas and New Year.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { readReceipt } from "./page-generation/google-hotel-samples.mjs";
import { weekendPrice } from "./page-generation/weekend-hotel-samples.mjs";
import { easternDate } from "./page-generation/sitemap.mjs";
import { createFamilyHotelPages } from "./page-generation/family-hotel-pages.mjs";

const searches = "abcdefghi".split("").flatMap((part) => readReceipt(`dataforseo-g18-chicago-${part}-2026-11-05.json`).searches);
const kids = [5, 8];
const page = readFileSync(new URL("../site/where-to-stay/chicago-family-hotels.html", import.meta.url), "utf8");
const csv = readFileSync(new URL("../site/downloads/chicago-family-hotels.csv", import.meta.url), "utf8");
const pages = createFamilyHotelPages({ esc: (value) => String(value), pageShell: (value) => value });

test("figures come from the receipts; one priced night is never averaged", () => {
  const w = weekendPrice(searches, { prefix: "chi-embassy-suites", title: "Embassy Suites by Hilton Chicago Downtown Magnificent Mile", tags: ["jan22", "jan23"], childAges: kids });
  assert.deepEqual([w.fri.nightly, w.sat.nightly, w.average, w.total], [221, 398, 310, 619]);
  const four = weekendPrice(searches, { prefix: "chi-four-seasons", title: "Four Seasons Hotel Chicago", tags: ["jan22", "jan23"], childAges: kids });
  assert.deepEqual([four.fri.nightly, four.sat.nightly, four.both, four.total], [1248, null, false, null]);
  assert.equal(weekendPrice(searches, { prefix: "chi-langham", title: "The Langham, Chicago", tags: ["jan22", "jan23"], childAges: kids }).any, false);
  assert.ok(searches.filter((search) => search.label.startsWith("chi-langham")).every((search) => search.results.length === 0));
});

test("committed page says no Tuesday, leads with the weekend and never says sold out as a fact", () => {
  const today = process.env.FT_BUILD_DATE || easternDate();
  assert.doesNotMatch(page + csv, /Tuesday|Jan 19|January 19|weeknight|October 31, 2026/);
  if (today < "2027-01-15") {
    const glance = page.match(/<section id="chicago-budget-glance"[\s\S]*?<\/section>/)[0];
    assert.match(glance, /Family of 4, Fri–Sun, Jan 22–24, 2027 \(estimate\)/);
    assert.match(glance, /Four Seasons, Friday only; no price shown: Langham/);
    assert.ok(page.indexOf('id="chicago-budget-glance"') < page.indexOf('class="licensed-photo hero-photo"'));
  } else {
    // From January 15, 2027 this fails until `node tools/generate-pages.mjs` re-renders the page.
    assert.doesNotMatch(page + csv, /Jan 22/);
  }
  if (today < "2026-12-18") {
    const section = page.match(/<section id="chicago-holiday-prices"[\s\S]*?<\/section>/)[0];
    assert.match(section, /<td>Hilton Chicago<\/td><td>\$219<\/td><td>\$165<\/td><td>Nov 5<\/td>/);
    assert.match(section, /<td>Homewood<\/td><td>\$259<\/td><td><span class="hotel-no-price">No price<\/span>/);
    assert.match(section, /either night: Langham\. That does not mean sold out/);
  } else {
    assert.doesNotMatch(page, /Dec 25–27/);
  }
});

test("holiday tables leave a week before arrival", () => {
  const dec18 = pages.chicagoFamilyHotelPage("2026-12-18").body;
  assert.doesNotMatch(dec18, /Christmas weekend, Dec 25/);
  assert.match(dec18, /New Year's weekend, Jan 1/);
  const dec25 = pages.chicagoFamilyHotelPage("2026-12-25").body;
  assert.doesNotMatch(dec25, /chicago-holiday-prices/);
  assert.match(dec25, /\$215/);
});

test("re-read corrections stay on the page", () => {
  assert.match(page, /Lake-View Room for 2 adults, or 2 adults and 1 child/);
  assert.match(page, /Deluxe and Premier rooms for three guests/);
  assert.match(page, /daily mandatory destination charge \(amount not stated\) includes a \$10 food and drink credit/);
  assert.match(page, /cribs as not available/);
});

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { cancunEvidence } from "../src/prototypes/cancun-resort-comparison/data.mjs";
import { PASSED_AS_OF, shownPrice, withdrawnPrice } from "../src/prototypes/cancun-resort-comparison/render.mjs";
import { cancunHolidaySection, cancunListings, cancunPriceAnswer, cancunPriceCards, cancunResortPage } from "./page-generation/cancun-resort-page.mjs";
import { easternDate } from "./page-generation/sitemap.mjs";

// D23 Cancun slice (2026-11-01): a top price card from the dated family samples still ahead of their stays.
const read = path => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const today = process.env.FT_BUILD_DATE || easternDate();

test("no shown Cancun price sample has reached its stay start (move PASSED_AS_OF and regenerate)", () => {
  for (const r of cancunEvidence.records.filter(r => shownPrice(r)?.stayStart)) {
    assert.ok(r.price.stayStart > today, `${r.id} stay starts ${r.price.stayStart}; set PASSED_AS_OF in src/prototypes/cancun-resort-comparison/render.mjs to today and run node tools/generate-pages.mjs`);
  }
  // A sample leaves 7 days before arrival (D39), so the date may lead today by up to 7 days.
  assert.ok(PASSED_AS_OF <= new Date(Date.parse(`${today}T12:00:00Z`) + 7 * 86400000).toISOString().slice(0, 10), "PASSED_AS_OF too far ahead");
});

test("the resort-site samples are all withdrawn, so the card has only Google weekend listings", () => {
  assert.deepEqual(cancunPriceCards(), []);
});

test("card sits in the page top before the photo: family of 4, Fri-Sun weekend, Google estimates", () => {
  const day = "2026-11-06", html = cancunResortPage(day), box = cancunPriceAnswer(day);
  const intro = html.split('<section class="page-intro">')[1].split("</section>")[0];
  assert.ok(intro.includes(box)); assert.ok(intro.indexOf(box) < intro.indexOf("<figure"));
  assert.ok(intro.indexOf("<h1>") < intro.indexOf(box));
  assert.doesNotMatch(box, /USD|Jan 11|kids&nbsp;3/);
  assert.match(box, /From about \$599&nbsp;a&nbsp;night/);
  assert.match(box, /2 adults \+ kids&nbsp;5&nbsp;and&nbsp;8, Fri–Sun, Jan 22–24, 2027: about \$1,197 for 2&nbsp;nights/);
  assert.match(box, /Sunscape Cancun Resort &amp; Spa<\/a><br><strong>≈ \$599&nbsp;a&nbsp;night<\/strong> · Cancun Hotel Zone<br><small>≈ \$1,197 for 2 nights · kids club starts at 4/);
  assert.match(box, /Moon Palace The Grand Cancun<\/a><br><strong>≈ \$999&nbsp;a&nbsp;night[^\n]*kids club ages not confirmed/);
  assert.match(box, /Royalton Splash Riviera Cancun, Finest Playa Mujeres showed no price for this weekend/);
  assert.match(box, /one search per night, seen Nov 5, 2026\. Not quotes\./);
  const label = box.match(/<p class="price-answer-label">([\s\S]*?)<\/p>/)[1];
  assert.ok(label.split(/\s+/).length <= 30);
});

test("samples leave 7 days before arrival: weekend Jan 15, Christmas Dec 18, New Year Dec 25", () => {
  const counts = (set, day) => cancunListings(set, day).filter(l => l.sample).length;
  assert.equal(counts("weekend", "2027-01-14"), 4); assert.equal(counts("weekend", "2027-01-15"), 0);
  assert.equal(counts("christmas", "2026-12-17"), 4); assert.equal(counts("christmas", "2026-12-18"), 0);
  assert.equal(counts("newYear", "2026-12-24"), 4); assert.equal(counts("newYear", "2026-12-25"), 0);
  assert.match(cancunHolidaySection("2026-12-20"), /New Year/); assert.doesNotMatch(cancunHolidaySection("2026-12-20"), /Christmas weekend/);
  assert.equal(cancunHolidaySection("2026-12-25"), "");
  const late = cancunResortPage("2027-01-15");
  assert.doesNotMatch(late, /holiday-prices|Family of 4 weekend, Google/);
  assert.match(late, /No current price yet: check live rates/);
});

test("holiday tables and the six-room table keep date, party, seen date and the second-search figure", () => {
  const day = "2026-11-06", held = cancunHolidaySection(day), html = cancunResortPage(day);
  assert.match(held, /2 adults \+ kids 5 and 8, Friday to Sunday/);
  assert.match(held, /Hyatt Ziva Cancun<\/th><td><strong>≈ \$1,909 a night<\/strong><p>Fri \$2,001, Sat \$1,817: \$3,818 for 2 nights\. A second search also showed \$1,722\. Seen Nov 5\./);
  assert.match(held, /Finest Playa Mujeres<\/th><td><strong>\$2,244 Friday only/);
  assert.match(held, /Royalton Splash Riviera Cancun<\/th><td>No price shown on Nov 5/);
  assert.match(html, /<th scope="col">Family of 4 weekend, Google<\/th>/);
  assert.match(html, /second search also showed \$1,264/);
});

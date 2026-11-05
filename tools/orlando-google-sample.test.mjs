// G18 (OWNER D39) replaced the January 15 and 18 samples. Q17b (OWNER D9/O2): the Orlando October 11 booking samples for a November 8-13, 2026 stay are withdrawn and replaced
// by labelled Google Hotels one-night listings for one family party, which leave the committed page and CSVs together
// a week before the first arrival. Replaces the retired rate-plan tests (orlando-rate-plans, -rate-download,
// -combined-rate-download, -cabana-current-rate, -price-once), whose subject no longer exists.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { easternDate } from "./page-generation/sitemap.mjs";
import { suites } from "./page-generation/orlando-suite-data.mjs";
import { orlandoListings, orlandoListingsDropDate, orlandoSuitePage, orlandoRateComparisonCsv, orlandoCombinedRateComparisonCsv, orlandoMealComparisonCsv, writeOrlandoSuitePage, orlandoGoogleTitles } from "./page-generation/orlando-suite-page.mjs";

const site = path => readFileSync(new URL(`../site/${path}`, import.meta.url), "utf8");
const page = site("where-to-stay/orlando-family-hotels.html");
const csvs = ["downloads/orlando-dated-rates.csv", "downloads/orlando-ihg-dated-rates.csv", "downloads/orlando-meal-planning.csv"].map(site);
const withdrawn = /November 8-13|Nov(?:ember)? 8|USD759\.40|USD815\.65|USD1013\.63|USD1446\.75|759\.40|815\.65|1013\.63|1446\.75|About USD152|About USD163|About USD203|About USD289|Special Offer|Stay Longer And Save|Best Flexible Rate/;
const parse = csv => csv.trimEnd().split("\n").map(line => [...line.matchAll(/"((?:[^"]|"")*)"(?:,|$)/g)].map(m => m[1].replaceAll('""', '"')));

test("weekend and holiday figures come from the 1-night receipts and leave on their own dates", () => {
  const l = orlandoListings("2026-11-05");
  assert.deepEqual([l.low, l.high], [185, 315]);
  assert.deepEqual([l.rows["holiday-inn"].fri.nightly, l.rows["holiday-inn"].sat.nightly, l.rows["holiday-inn"].total], [188, 182, 370]);
  assert.deepEqual([l.rows["cabana-bay"].fri.nightly, l.rows["cabana-bay"].sat.nightly, l.rows["cabana-bay"].total], [314, 316, 630]);
  assert.deepEqual([l.rows["art-of-animation"].fri.nightly, l.rows["art-of-animation"].sat.nightly, l.rows["art-of-animation"].both], [null, 319, false]);
  assert.deepEqual([l.christmas["cabana-bay"].fri.nightly, l.christmas["cabana-bay"].sat.nightly, l.newYear["art-of-animation"].fri.nightly], [302, 385, 910]);
  assert.deepEqual([l.five["cabana-bay"].fri.nightly, l.five["cabana-bay"].sat.nightly, l.five["holiday-inn"].total], [491, 520, 412]);
  assert.equal(orlandoListingsDropDate, "2027-01-15");
  assert.equal(orlandoListings("2026-12-18").christmas, null);
  assert.ok(orlandoListings("2026-12-17").christmas);
  assert.equal(orlandoListings("2026-12-25").newYear, null);
  assert.ok(orlandoListings("2027-01-14"));
  assert.equal(orlandoListings("2027-01-15"), null);
  assert.deepEqual([...new Set(Object.values(l.rows).flatMap(row => [row.fri.observed_on, row.sat.observed_on]))], ["2026-11-05"]);
});

test("committed page and CSVs show the family-of-4 weekend first; never a Monday holiday or MLK weekend sample", () => {
  const today = process.env.FT_BUILD_DATE || easternDate();
  const [combined, ihg] = csvs;
  for (const text of [page, combined, ihg]) assert.doesNotMatch(text, /Jan 15|Jan 18|2027-01-15|2027-01-18|January 15|Mon Jan/);
  if (today < "2026-12-18") {
    assert.match(page, /Family of 4 in Orlando, Fri–Sun, Jan 22–24, 2027 \(estimate\)/);
    assert.match(page, /<p class="price-figure">About \$185–\$315 a&nbsp;night<\/p>/);
    assert.match(page, /≈ \$185 a night<\/span>[^]*?\$370 for 2 nights · may be extra: resort fee \$54-\$65 and parking \$31/);
    assert.match(page, /≈ \$315 a night<\/span>[^]*?\$630 for 2 nights · parking \$26/);
    assert.match(page, /\$319, Sat only/);
    assert.match(page, /Disney: \$319 for Saturday only\./);
    assert.match(page, /2 adults \+ kids 5 and 8, seen Nov 5\./);
    assert.match(page, /Christmas weekend, Fri Dec 25/);
    assert.match(page, /does not mean sold out/);
    const [head, ...rows] = parse(combined);
    assert.equal(head.length, 14);
    assert.equal(rows.length, 24);
    assert.deepEqual(rows.filter(row => row[1] === "Normal weekend").map(row => [row[0], row[4], row[8]]), [["Disney's Art of Animation Resort", "2027-01-22", "No price shown"], ["Disney's Art of Animation Resort", "2027-01-23", "319"], ["Universal Cabana Bay Beach Resort", "2027-01-22", "314"], ["Universal Cabana Bay Beach Resort", "2027-01-23", "316"], ["Holiday Inn Resort Orlando Suites - Waterpark", "2027-01-22", "188"], ["Holiday Inn Resort Orlando Suites - Waterpark", "2027-01-23", "182"]]);
    for (const row of rows) { assert.equal(row[5], "1"); assert.equal(row[6], "USD"); assert.equal(row[11], "2026-11-05"); assert.match(row[12], /not a quote/); }
    assert.equal(parse(ihg).length, 9);
  } else {
    // From December 18, 2026 this fails until `node tools/generate-pages.mjs` re-renders the page (Christmas table drops), then again Dec 25 and Jan 15.
    assert.doesNotMatch(page, /Christmas weekend, Fri Dec 25/);
  }
});

test("after the drop date the page and CSVs say check live rate, with no listing amounts", () => {
  const html = orlandoSuitePage("2027-01-15");
  assert.match(html, /<p class="price-figure">Check live rate<\/p>/);
  assert.doesNotMatch(html, /\$185|\$319|\$315|\$630|Google Hotels listed|Family of 4 in Orlando|orlando-more-prices/);
  assert.equal((html.match(/No current family price on this page: check the live rate/g) ?? []).length, 3);
  for (const csv of [orlandoCombinedRateComparisonCsv(suites, "2027-01-15"), orlandoRateComparisonCsv(suites, "2027-01-15")]) {
    assert.doesNotMatch(csv, /"188"|"182"|"314"|"316"|"319"/);
    assert.match(csv, /No current family price; check live rate\./);
  }
});

test("withdrawn October 11 samples and old January samples are gone from the data, page and every Orlando download", () => {
  for (const suite of suites) for (const key of ["priceSample", "alternatePriceSample", "priceTerms", "bookingRates"]) assert.equal(suite[key], undefined, `${suite.id}.${key}`);
  for (const text of [page, ...csvs]) assert.doesNotMatch(text, withdrawn);
  assert.doesNotMatch(page, /data-rate-plans|data-booking-rates|How we checked Universal|stay-totals|\$177|\$527/);
  assert.match(page, /rooms, taxes and fees not shown[^]*rooms, taxes and fees not shown/);
  assert.match(page, /Art of Animation's \$910/);
});

test("listing CSVs protect formula cells and never mutate shared records; page and assets stay in parity", () => {
  const before = JSON.stringify(suites);
  const copy = structuredClone(suites[1]);
  copy.name = "=HYPERLINK(1)";
  const [, row] = parse(orlandoCombinedRateComparisonCsv([copy], "2026-11-05"));
  assert.equal(row[0], "'=HYPERLINK(1)");
  assert.equal(JSON.stringify(suites), before);
  const out = new Map();
  writeOrlandoSuitePage((path, value) => out.set(path, value));
  assert.equal(out.get("downloads/orlando-dated-rates.csv"), orlandoCombinedRateComparisonCsv());
  assert.equal(out.get("downloads/orlando-ihg-dated-rates.csv"), orlandoRateComparisonCsv());
  assert.equal(out.get("downloads/orlando-meal-planning.csv"), orlandoMealComparisonCsv());
  assert.equal(out.get("where-to-stay/orlando-family-hotels.html"), page);
  assert.match(page, /href="\.\.\/downloads\/orlando-dated-rates\.csv" download>Download listing prices \(CSV\)/);
  assert.match(page, /orlando-suites\.css\?v=ft-g18e/);
  assert.match(site("orlando-suites.css"), /\.orlando-page \.price-answer \{/);
});

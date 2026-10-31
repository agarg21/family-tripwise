// Q17b (OWNER D9/O2): the Orlando October 11 booking samples for a November 8-13, 2026 stay are withdrawn and replaced
// by labelled Google Hotels one-night listings for one family party, which leave the committed page and CSVs together
// a week before the first arrival. Replaces the retired rate-plan tests (orlando-rate-plans, -rate-download,
// -combined-rate-download, -cabana-current-rate, -price-once), whose subject no longer exists.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { googleHotelSample, googleOneNight, readReceipt } from "./page-generation/google-hotel-samples.mjs";
import { easternDate } from "./page-generation/sitemap.mjs";
import { suites } from "./page-generation/orlando-suite-data.mjs";
import { orlandoListings, orlandoListingsDropDate, orlandoSuitePage, orlandoRateComparisonCsv, orlandoCombinedRateComparisonCsv, orlandoMealComparisonCsv, writeOrlandoSuitePage, orlandoGoogleTitles } from "./page-generation/orlando-suite-page.mjs";

const site = path => readFileSync(new URL(`../site/${path}`, import.meta.url), "utf8");
const page = site("where-to-stay/orlando-family-hotels.html");
const csvs = ["downloads/orlando-dated-rates.csv", "downloads/orlando-ihg-dated-rates.csv", "downloads/orlando-meal-planning.csv"].map(site);
const kids = [4, 8, 12];
const withdrawn = /November 8-13|Nov(?:ember)? 8|USD759\.40|USD815\.65|USD1013\.63|USD1446\.75|759\.40|815\.65|1013\.63|1446\.75|About USD152|About USD163|About USD203|About USD289|Special Offer|Stay Longer And Save|Best Flexible Rate/;
const parse = csv => csv.trimEnd().split("\n").map(line => [...line.matchAll(/"((?:[^"]|"")*)"(?:,|$)/g)].map(m => m[1].replaceAll('""', '"')));

test("only one-night searches feed the Orlando prices; 5-night figures fail the 10% control", () => {
  const friB = readReceipt("dataforseo-q17b-six-pages-b-2026-10-31.json"), friC = readReceipt("dataforseo-q17b-six-pages-c-2026-10-31.json");
  const mon = readReceipt("dataforseo-q17b-midweek-a-2026-10-31.json");
  const cabana = { title: orlandoGoogleTitles["cabana-bay"], childAges: kids }, hi = { title: orlandoGoogleTitles["holiday-inn"], childAges: kids };
  assert.equal(googleHotelSample(friB, "orl-cabana-bay", cabana), null);
  assert.equal(googleHotelSample(friC, "orl-hi-suites", hi), null);
  assert.equal(googleHotelSample(mon, "orl-cabana-bay-mid", cabana), null);
  assert.deepEqual([googleOneNight(friB, "orl-cabana-bay-1n", cabana).nightly, googleOneNight(mon, "orl-cabana-bay-mid-1n", cabana).nightly], [527, 348]);
  assert.deepEqual([googleOneNight(friC, "orl-hi-suites-1n", hi).nightly, googleOneNight(mon, "orl-hi-suites-mid-1n", hi).nightly], [199, 177]);
  assert.equal(googleOneNight(friB, "orl-cabana-bay-5n", cabana), null);
  assert.equal(googleOneNight(friB, "orl-cabana-bay-1n", { ...cabana, childAges: [4, 8] }), null);
  assert.equal(orlandoListingsDropDate, "2027-01-08");
  const l = orlandoListings("2027-01-07");
  assert.deepEqual([l.low, l.high, l.range("holiday-inn"), l.range("cabana-bay"), l.days("cabana-bay")], [177, 527, "$177-$199", "$348-$527", "Mon Jan 18 / Fri Jan 15"]);
  assert.equal(l.rows["art-of-animation"], undefined);
  assert.equal(orlandoListings("2027-01-08"), null);
  // The card shows one "seen" date, so every listing must share it.
  assert.deepEqual([...new Set(Object.values(l.rows).flat().map(sample => sample.observed_on))], ["2026-10-31"]);
});

test("withdrawn October 11 samples are gone from the data, page and every Orlando download", () => {
  for (const suite of suites) for (const key of ["priceSample", "alternatePriceSample", "priceTerms", "bookingRates"]) assert.equal(suite[key], undefined, `${suite.id}.${key}`);
  for (const text of [page, ...csvs]) assert.doesNotMatch(text, withdrawn);
  assert.doesNotMatch(page, /data-rate-plans|data-booking-rates|How we checked Universal|stay-totals/);
});

test("committed page and CSVs show the labelled listings only before the drop date", () => {
  const today = process.env.FT_BUILD_DATE || easternDate();
  const [combined, ihg] = csvs;
  if (today < "2027-01-08") {
    assert.match(page, /<p class="price-figure">About \$177-\$527 a&nbsp;night<\/p>/);
    assert.match(page, /Family of 5 in Orlando, January 2027/);
    assert.match(page, /One-night Google Hotels prices for 2 adults \+ kids 4, 8 and 12, seen Oct 31\. Not a bookable price; taxes extra\./);
    assert.match(page, /Mon Jan 18 \$177 · Fri Jan 15 \$199 · resort fee \$54-\$65 \+ tax a night may be extra/);
    assert.match(page, /Mon Jan 18 \$348 · Fri Jan 15 \$527 · parking \$26 \+ tax per vehicle/);
    assert.match(page, /Google Hotels listed this resort \(as &quot;Universal&#39;s Cabana Bay Beach Resort&quot;\) at about \$348 \(Mon Jan 18\) to \$527 \(Fri Jan 15\) for one night in January 2027 for 2 adults and kids 4, 8 and 12, seen October 31, 2026\. One-night searches only; room type not shown, so not necessarily the Poolside Family Suite - Exterior Entry\./);
    assert.match(page, /Taxes, parking and the resort fee may be extra\. Not a quote\./);
    assert.match(page, /Google Hotels showed no price for this resort/);
    assert.match(page, /one-night prices are not multiplied into stay totals/);
    const [head, ...rows] = parse(combined);
    assert.equal(head.length, 13);
    assert.deepEqual(rows.map(row => [row[0], row[3], row[7]]), [["Disney's Art of Animation Resort", "", "No Google price shown for this party in January 2027; check live rate."], ["Universal Cabana Bay Beach Resort", "2027-01-18", "348"], ["Universal Cabana Bay Beach Resort", "2027-01-15", "527"], ["Holiday Inn Resort Orlando Suites - Waterpark", "2027-01-18", "177"], ["Holiday Inn Resort Orlando Suites - Waterpark", "2027-01-15", "199"]]);
    for (const row of rows.slice(1)) { assert.equal(row[4], "1"); assert.equal(row[5], "USD"); assert.equal(row[10], "2026-10-31"); assert.match(row[11], /not a quote/); }
    assert.deepEqual(parse(ihg).slice(1).map(row => row[7]), ["177", "199"]);
  } else {
    // From January 8, 2027 this fails until `node tools/generate-pages.mjs` re-renders the page (a week before the stay).
    for (const text of [page, ...csvs]) assert.doesNotMatch(text, /\$177|\$527|"348"|"199"|Google Hotels listed/);
  }
});

test("after the drop date the page and CSVs say check live rate, with no listing amounts", () => {
  const html = orlandoSuitePage("2027-01-08");
  assert.match(html, /<p class="price-figure">Check live rate<\/p>/);
  assert.doesNotMatch(html, /\$177|\$199|\$348|\$527|Google Hotels listed|Family of 5 in Orlando, January 2027/);
  assert.equal((html.match(/No current family price on this page: check the live rate/g) ?? []).length, 3);
  for (const csv of [orlandoCombinedRateComparisonCsv(suites, "2027-01-08"), orlandoRateComparisonCsv(suites, "2027-01-08")]) {
    assert.doesNotMatch(csv, /"177"|"199"|"348"|"527"/);
    assert.match(csv, /No current family price; check live rate\./);
  }
});

test("listing CSVs protect formula cells and never mutate shared records; page and assets stay in parity", () => {
  const before = JSON.stringify(suites);
  const copy = structuredClone(suites[1]);
  copy.name = "=HYPERLINK(1)";
  const [, row] = parse(orlandoCombinedRateComparisonCsv([copy], "2026-11-01"));
  assert.equal(row[0], "'=HYPERLINK(1)");
  assert.equal(JSON.stringify(suites), before);
  const out = new Map();
  writeOrlandoSuitePage((path, value) => out.set(path, value));
  assert.equal(out.get("downloads/orlando-dated-rates.csv"), orlandoCombinedRateComparisonCsv());
  assert.equal(out.get("downloads/orlando-ihg-dated-rates.csv"), orlandoRateComparisonCsv());
  assert.equal(out.get("downloads/orlando-meal-planning.csv"), orlandoMealComparisonCsv());
  assert.equal(out.get("where-to-stay/orlando-family-hotels.html"), page);
  assert.match(page, /href="\.\.\/downloads\/orlando-dated-rates\.csv" download>Download listing prices \(CSV\)/);
  assert.match(page, /orlando-suites\.css\?v=ft-q17b/);
  assert.match(site("orlando-suites.css"), /\.orlando-page \.price-answer \{/);
});

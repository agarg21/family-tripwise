import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { STUDY_CITIES, holidayHotelStudy, pctChange } from "./page-generation/holiday-hotel-study.mjs";
import { holidayHotelStudyPage, holidayHotelStudyPath } from "./page-generation/holiday-hotel-study-page.mjs";

const text = (html) => html.slice(html.indexOf("<main"), html.indexOf("</main>")).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");

test("every study hotel uses the exact Google title its hotel page uses", () => {
  for (const city of STUDY_CITIES) {
    const source = readFileSync(new URL(`./page-generation/${city.source}`, import.meta.url), "utf8");
    for (const [, title] of city.hotels) assert.ok(source.includes(JSON.stringify(title).slice(1, -1)), `${city.id}: ${title} not in ${city.source}`);
  }
});

test("compares only hotels priced both nights of both weekends, with the observed figures (NYC re-observed Nov 14)", () => {
  const nyc = holidayHotelStudy("2026-11-13").find((c) => c.id === "nyc");
  const marquis = nyc.christmas.pairs.find((p) => p.title === "New York Marriott Marquis");
  assert.deepEqual([marquis.normal, marquis.holiday, marquis.change], [770, 1826, 137]);
  assert.equal(nyc.christmas.hotels, 7);
  assert.ok(!nyc.christmas.pairs.some((p) => p.title === "Residence Inn by Marriott New York Manhattan/Central Park"), "Residence Inn has one Christmas night only");
  assert.deepEqual(nyc.seen, ["2026-11-14"]);
  assert.equal(pctChange(150, 100), 50);
});

test("page on Nov 13: Christmas lead, party, dates, estimate label and sources", () => {
  const html = holidayHotelStudyPage("2026-11-13");
  const t = text(html);
  assert.match(html, /<title>Christmas Hotel Prices for a Family of 4: 10 Places Compared<\/title>/);
  assert.match(t, /2 adults and kids 5 and 8/);
  assert.ok(t.includes("Biggest Christmas weekend jump (places with 3+ hotels) New York City: +137%"));
  assert.match(t, /An estimate, not a quote/);
  assert.match(t, /Cheaper: Chicago −16%, Las Vegas −29%/);
  assert.match(t, /Prices seen: New York City Nov 14, 2026; other places Nov 5, 2026/);
  assert.ok(!/sold out/i.test(t.replace(/never means sold out/, "")), "no price is never 'sold out'");
});

test("pairs a hotel page flags as doubtful stay out and are named", () => {
  const study = holidayHotelStudy("2026-11-13");
  const cancun = study.find((c) => c.id === "cancun");
  const pv = study.find((c) => c.id === "pv");
  assert.ok(!cancun.newYear.pairs.some((p) => /Moon Palace/i.test(p.title)));
  assert.equal(pv.christmas, null);
  assert.ok(pv.newYear.pairs.some((p) => /Hilton/.test(p.title)));
  const t = text(holidayHotelStudyPage("2026-11-13"));
  assert.match(t, /Left out of both comparisons: Moon Palace The Grand Cancun/);
  assert.match(t, /Left out of the Christmas comparison: Hilton Vallarta Riviera/);
  const nyc = study.find((c) => c.id === "nyc");
  assert.equal(nyc.christmas.example.title, "New York Marriott Marquis"); // change closest to the median
});

test("Christmas leaves on Dec 18, New Year on Dec 25, and the page falls back once both are gone", () => {
  const dec18 = holidayHotelStudyPage("2026-12-18");
  assert.ok(!/Dec 25–27/.test(dec18), "Christmas weekend shown within 7 days");
  assert.match(dec18, /<title>New Year Hotel Prices for a Family of 4/);
  const ny = text(dec18);
  assert.ok(ny.includes("New York City: +55%"));
  assert.ok(ny.includes("Hotels ranged from +1% to +110%"), "no example far from the typical change");
  assert.ok(!/Example: Hotel Beacon/.test(ny));
  const dec25 = holidayHotelStudyPage("2026-12-25");
  assert.ok(!/Jan 1–3|Dec 25–27/.test(text(dec25)));
  assert.match(dec25, /<title>Holiday Hotel Prices for a Family of 4, by City<\/title>/);
  assert.ok(!/\$\d/.test(text(dec25)), "no dollar figure once no holiday weekend is live");
});

test("committed page is built and carries Article markup", () => {
  const committed = readFileSync(new URL(`../site/${holidayHotelStudyPath}`, import.meta.url), "utf8");
  assert.match(committed, /holiday-hotel-prices-family-of-4\.html/);
  assert.match(committed, /"@type":"Article"|"@type": "Article"/);
});

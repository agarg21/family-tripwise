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

test("compares only hotels priced both nights of both weekends, with the observed Nov 5 figures", () => {
  const nyc = holidayHotelStudy("2026-11-13").find((c) => c.id === "nyc");
  const marquis = nyc.christmas.pairs.find((p) => p.title === "New York Marriott Marquis");
  assert.deepEqual([marquis.normal, marquis.holiday, marquis.change], [824, 1944, 136]);
  assert.equal(nyc.christmas.hotels, 4);
  assert.ok(!nyc.christmas.pairs.some((p) => p.title === "Hotel Beacon"), "Beacon has one Christmas night only");
  assert.deepEqual(nyc.seen, ["2026-11-05"]);
  assert.equal(pctChange(150, 100), 50);
});

test("page on Nov 13: Christmas lead, party, dates, estimate label and sources", () => {
  const html = holidayHotelStudyPage("2026-11-13");
  const t = text(html);
  assert.match(html, /<title>Christmas Hotel Prices for a Family of 4: 10 Places Compared<\/title>/);
  assert.match(t, /2 adults and kids 5 and 8/);
  assert.match(t, /Biggest Christmas weekend jump New York City: \+129%/);
  assert.match(t, /Estimate, not a quote/);
  assert.match(t, /Cheaper: Chicago −16%, Las Vegas −29%/);
  assert.match(t, /Prices seen: Nov 5, 2026/);
  assert.ok(!/sold out/i.test(t.replace(/never means sold out/, "")), "no price is never 'sold out'");
});

test("Christmas leaves on Dec 18, New Year on Dec 25, and the page falls back once both are gone", () => {
  const dec18 = holidayHotelStudyPage("2026-12-18");
  assert.ok(!/Dec 25–27/.test(dec18), "Christmas weekend shown within 7 days");
  assert.match(dec18, /<title>New Year Hotel Prices for a Family of 4/);
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

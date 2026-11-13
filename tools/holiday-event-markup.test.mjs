// R1 step 3: Event structured data on holiday city pages, only for opted-in, dated, still-open, freshly read events.
import test from "node:test";
import assert from "node:assert/strict";
import { holidayCitiesData, holidayCityPage, validateHolidayCity, markupEvents } from "./page-generation/holiday-city-page.mjs";

const data = holidayCitiesData();
const jsonLd = (html) => [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)].map((m) => JSON.parse(m[1]));
const events = (html) => jsonLd(html).filter((o) => o["@type"] === "Event");

test("every opted-in event validates: confirmed dates, a week or less, locality and region", () => {
  for (const [slug, city] of Object.entries(data.cities)) assert.deepEqual(validateHolidayCity(city), [], slug);
  const bad = structuredClone(data.cities.boston);
  const lights = bad.events.find((ev) => ev.id === "zoolights");
  lights.event_markup = { locality: "Stoneham", region: "MA" };
  assert.ok(validateHolidayCity(bad).some((m) => m.includes("not season-long")));
  bad.events.find((ev) => ev.id === "tree-arrival").event_markup = { locality: "Boston" };
  assert.ok(validateHolidayCity(bad).some((m) => m.includes("2-letter region")));
});

test("Event markup matches the visible card and never carries prices", () => {
  const today = "2026-11-13";
  const expected = { "san-diego": 3, chicago: 3, boston: 3, "new-york-city": 2, "san-antonio": 2, "washington-dc": 2 };
  for (const [slug, count] of Object.entries(expected)) {
    const html = holidayCityPage(slug, data, today);
    const marked = events(html);
    assert.equal(marked.length, count, slug);
    for (const ev of marked) {
      const id = ev.url.split("#")[1];
      const record = data.cities[slug].events.find((x) => x.id === id);
      assert.ok(html.includes(`id="${id}"`), `${slug} card ${id}`);
      assert.equal(ev.name, record.name);
      assert.equal(ev.startDate, record.start_on);
      assert.equal(ev.endDate, record.end_on);
      assert.equal(ev.location.name, record.place);
      assert.equal(ev.location.address.addressCountry, "US");
      assert.equal(ev.offers, undefined);
      assert.ok(!/\$\d/.test(JSON.stringify(ev)));
    }
  }
  for (const slug of ["orlando", "las-vegas"]) assert.equal(events(holidayCityPage(slug, data, today)).length, 0, slug);
});

test("markup drops when an event ends or its read passes 30 days", () => {
  const boston = data.cities.boston;
  assert.deepEqual(markupEvents(boston, "2026-11-25").map((ev) => ev.id), ["copley-lighting", "common-lighting"]);
  // Read Oct 28: 30 days later (Nov 27) still shows; Nov 28 hides until the City of Boston listings are re-read.
  assert.equal(markupEvents(boston, "2026-11-27").length, 2);
  assert.equal(markupEvents(boston, "2026-11-28").length, 0);
  assert.equal(markupEvents(data.cities.chicago, "2026-11-27").length, 0);
  // Lottery-only National Christmas Tree lighting stays unmarked; DC markup (read Nov 4) hides from Dec 5 until re-read.
  assert.ok(!data.cities["washington-dc"].events.find((ev) => ev.id === "national-tree").event_markup);
  assert.deepEqual(markupEvents(data.cities["washington-dc"], "2026-12-04").map((ev) => ev.id).sort(), ["mount-vernon", "wharf-boat-parade"]);
  assert.deepEqual(markupEvents(data.cities["new-york-city"], "2026-11-17").map((ev) => ev.id), ["macys-parade"]);
  assert.equal(markupEvents(data.cities["washington-dc"], "2026-12-05").length, 0);
});

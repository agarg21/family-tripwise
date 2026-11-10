import { test } from "node:test";
import assert from "node:assert/strict";
import { skiData, skiPage, skiPath, validateSkiCity, pricesFresh } from "./page-generation/ski-page.mjs";

const visible = (html) => html.replace(/<head>[\s\S]*?<\/head>/, "").replace(/<[^>]+>/g, " ");

test("ski data validates for every city", () => {
  const data = skiData();
  for (const [slug, city] of Object.entries(data.cities)) assert.deepEqual(validateSkiCity(city), [], slug);
});

test("NYC ski page shows dated prices while fresh and none once the read is over 30 days old", () => {
  const data = skiData();
  const city = data.cities["new-york-city"];
  const freshDay = city.observed_on;
  const html = skiPage("new-york-city", data, freshDay);
  assert.ok(pricesFresh(city, freshDay));
  for (const x of ["$348", "$89", "$99.99", "$45 processing fee", "Family of 4: 2 adults + 2 kids, ages 5 and 8"]) assert.ok(html.includes(x), x);
  const stale = new Date(Date.parse(`${freshDay}T00:00:00Z`) + 31 * 864e5).toISOString().slice(0, 10);
  const old = visible(skiPage("new-york-city", data, stale));
  assert.equal(pricesFresh(city, stale), false);
  assert.doesNotMatch(old, /\$\d/, "no dollar figure once stale");
  assert.match(old, /Check live/);
});

test("a hill without posted prices never shows last season's", () => {
  const html = visible(skiPage("new-york-city", skiData(), skiData().cities["new-york-city"].observed_on));
  assert.match(html, /Thunder Ridge[\s\S]*2026–27 prices not posted yet/);
  assert.doesNotMatch(html, /\$82|\$72\b/, "Thunder Ridge's 2025-26 rates stay off the page");
});

test("validation rejects a price outside the fields that hide", () => {
  const city = structuredClone(skiData().cities["new-york-city"]);
  city.hills[0].kids.push("Lessons $50");
  city.hills[1].getting_there = "Bus $10";
  const errors = validateSkiCity(city);
  assert.ok(errors.some((x) => /kid line holds a price/.test(x)));
  assert.ok(errors.some((x) => /getting_there holds a price/.test(x)));
});

test("ski path", () => assert.equal(skiPath("new-york-city"), "ski/skiing-near-new-york-city-with-kids.html"));

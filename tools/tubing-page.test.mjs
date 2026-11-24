import { test } from "node:test";
import assert from "node:assert/strict";
import { tubingData, skiPage, skiPath, validateSkiCity, pricesFresh, skiUrls } from "./page-generation/ski-page.mjs";

const visible = (html) => html.replace(/<head>[\s\S]*?<\/head>/, "").replace(/<[^>]+>/g, " ");
const data = tubingData();
const city = data.cities["new-york-city"];

test("tubing data validates and gets its own path and URL", () => {
  assert.equal(data.kind, "tubing");
  assert.deepEqual(validateSkiCity(city), []);
  assert.equal(skiPath("new-york-city", "tubing"), "ski/snow-tubing-near-new-york-city-with-kids.html");
  assert.ok(skiUrls().includes("https://familytripwise.com/ski/snow-tubing-near-new-york-city-with-kids.html"));
});

test("NYC tubing page uses tubing words, height rules and a dated family estimate", () => {
  const html = skiPage("new-york-city", data, city.observed_on);
  const title = html.match(/<title>([^<]*)<\/title>/)[1];
  assert.ok(title.length <= 60, title);
  assert.match(title, /^Snow Tubing Near NYC With Kids: 5 Parks, Heights, Prices$/);
  assert.match(html, /<h1>Snow Tubing Near New York City With Kids: 5&nbsp;Parks, Height Rules and Prices<\/h1>/);
  assert.match(html, /Height rule for kids/);
  assert.doesNotMatch(visible(html), /lift ticket|Hill by hill|3rd to 5th graders|We haven't skied/i);
  for (const x of ["$196", "4 tickets × $49", "48 inches or taller", "33 to 43 inches", "Little Tikes", "prices read Nov 24"]) assert.ok(html.includes(x), x);
  assert.match(html, /href="\.\/skiing-near-new-york-city-with-kids\.html"/);
});

test("tubing prices hide once the read is over 30 days old", () => {
  const stale = new Date(Date.parse(`${city.observed_on}T00:00:00Z`) + 31 * 864e5).toISOString().slice(0, 10);
  assert.equal(pricesFresh(city, stale), false);
  const html = skiPage("new-york-city", data, stale);
  assert.doesNotMatch(visible(html), /\$\d/);
  assert.match(html.match(/<title>([^<]*)<\/title>/)[1], /Height Rules$/);
});

test("a future read date is refused", () => {
  const day = new Date(Date.parse(`${city.observed_on}T00:00:00Z`) - 864e5).toISOString().slice(0, 10);
  assert.throws(() => skiPage("new-york-city", data, day), /after today/);
});

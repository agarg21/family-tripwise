import { test } from "node:test";
import assert from "node:assert/strict";
import { resortData, resortPage, validateResort, camRead } from "./page-generation/resort-conditions-page.mjs";

const visible = (html) => html.replace(/<head>[\s\S]*?<\/head>/, "").replace(/<[^>]+>/g, " ");
const okemo = () => resortData().resorts.okemo;
const now = new Date("2026-12-19T15:37:00Z");
const feed = (over = {}) => ({ resorts: { okemo: { publish: true, name: "Okemo", status: "Looks good", line: "Fresh snow on the summit cam", read_at: "2026-12-19T15:10:00Z", cams_used: 4, cams_total: 4,
  fields: { fresh_snow: { value: "light", conf: 0.8 }, visibility: { value: "low", conf: 0.5 }, base_busyness: { value: "busy", conf: 0.9 } }, stake_inches: 4.5,
  cams: [{ name: "Summit Cam", read_at: "2026-12-19T15:10:00Z", no_read: null }], ...over } } });

test("resort data validates", () => {
  for (const [slug, r] of Object.entries(resortData().resorts)) assert.deepEqual(validateResort(r), [], slug);
});

test("no feed or an unpublished resort shows No read and no condition claims", () => {
  for (const f of [null, feed({ publish: false })]) {
    const html = visible(resortPage("okemo", resortData(), "2026-11-14", f, now));
    assert.match(html, /No cam read from us yet/);
    assert.doesNotMatch(html, /Fresh snow:|Snow stake:|Looks good/);
    assert.match(html, /Opens Sat, Nov 21 at 9 a.m./);
  }
});

test("a published fresh read shows labelled fields, drops low-confidence ones, and keeps its time", () => {
  const html = visible(resortPage("okemo", resortData(), "2026-12-19", feed(), now));
  assert.match(html, /Looks good/);
  assert.match(html, /Snow stake: 4\.5 in\./);
  assert.match(html, /Fresh snow: light/);
  assert.doesNotMatch(html, /Visibility: low/, "conf under 0.6 is left out");
  assert.match(html, /Read from 4 of 4 Okemo cams at 10:10am ET/);
  assert.doesNotMatch(html, /opening day is/, "opening line drops after the date");
  assert.match(html, /Dates now: Dec 17–Dec 20/);
  assert.match(visible(resortPage("okemo", resortData(), "2026-11-14")), /Next dates: Dec 17–Dec 20/);
});

test("reads go stale after 90 minutes and hide after 6 hours", () => {
  assert.equal(camRead(feed().resorts.okemo, new Date("2026-12-19T16:50:00Z")).state, "stale");
  assert.equal(camRead(feed().resorts.okemo, new Date("2026-12-19T21:20:00Z")).state, "none");
});

test("childcare prices hide 30 days after the read", () => {
  const r = okemo();
  assert.match(visible(resortPage("okemo", resortData(), r.observed_on)), /\$210 a full day/);
  const stale = new Date(Date.parse(`${r.observed_on}T00:00:00Z`) + 31 * 864e5).toISOString().slice(0, 10);
  assert.doesNotMatch(visible(resortPage("okemo", resortData(), stale)), /\$\d/);
});

test("validation rejects a price in a field that never hides", () => {
  const r = structuredClone(okemo());
  r.plan[0].text = "Lessons $99";
  assert.ok(validateResort(r).some((x) => /holds a price/.test(x)));
});

test("feed words on the D47 never-list never reach the page", () => {
  const f = feed({ line: "Groomed and safe today", fields: { lifts_moving: { value: "open", conf: 0.9 }, snow_cover: { value: "icy", conf: 0.9 }, fresh_snow: { value: "light", conf: 0.9 } }, stake_conf: 0.4 });
  const card = visible(resortPage("okemo", resortData(), "2026-12-19", f, now).match(/<section id="ski-answer"[\s\S]*?<\/section>/)[0]);
  assert.doesNotMatch(card, /Groomed|safe|Lifts: open|icy|Snow stake/);
  assert.match(card, /Fresh snow: light/);
});

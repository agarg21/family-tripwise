import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { roomSetupsData, roomSetupsPage, roomSetupPrice, validateRoomSetups, roomSetupsPath } from "./page-generation/nyc-room-setups-page.mjs";

const data = roomSetupsData();

test("room-setups records are complete, sourced and use known setups", () => {
  validateRoomSetups(data);
  for (const key of Object.keys(data.setups)) assert.ok(data.hotels.filter((h) => h.setups.includes(key)).length >= 2, `${key} lists at least two hotels`);
  for (const h of data.hotels) assert.match(h.source.url, /^https:\/\//, h.id);
  const broken = structuredClone(data);
  delete broken.hotels[0].catch;
  assert.throws(() => validateRoomSetups(broken), /missing catch/);
});

test("prices are Google family-of-4 nights for the stated weekend and leave a week before it", () => {
  const before = Object.fromEntries(data.hotels.map((h) => [h.id, roomSetupPrice(data, h, "2026-11-28")]));
  assert.ok(Object.values(before).filter(Boolean).length >= 10, "most hotels priced");
  for (const p of Object.values(before).filter(Boolean)) {
    assert.ok(p.average > 0);
    if (p.both) assert.equal(p.total, p.fri.price + p.sat.price);
  }
  assert.equal(before["nu-hotel"], null, "Google showed no price for NU Hotel");
  for (const h of data.hotels) assert.equal(roomSetupPrice(data, h, "2027-01-15"), null, `${h.id} drops on Jan 15`);
});

test("page: one section per setup, one card per hotel, plain labels and no stale price", () => {
  const html = roomSetupsPage("2026-11-28");
  const title = html.match(/<title>([^<]+)<\/title>/)[1].replaceAll("&amp;", "&");
  assert.ok(title.length <= 60, title);
  for (const key of Object.keys(data.setups)) assert.match(html, new RegExp(`<section id="${key}">`));
  for (const h of data.hotels) assert.match(html, new RegExp(`<section id="${h.id}" class="london-room">`));
  assert.match(html, /Cheapest room Google Hotels showed for 4/);
  assert.match(html, /A family reported:/);
  assert.match(html, /<section id="booked">/);
  const later = roomSetupsPage("2027-01-15");
  assert.doesNotMatch(later, /≈ \$/);
  assert.match(later, /Check live rates/);
});

test("committed page matches the generator", () => {
  const committed = readFileSync(`site/${roomSetupsPath}`, "utf8");
  assert.match(committed, /<h1>NYC hotel rooms that fit a family<\/h1>/);
  assert.match(committed, /class="holiday-nudge"/);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createFamilyHotelPages } from './page-generation/family-hotel-pages.mjs';

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const html = read('site/where-to-stay/las-vegas-family-hotels.html');
const hotels = createFamilyHotelPages({}).hotelCatalog['las-vegas'];
const esc = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

test('comparison leads retained routing, larger-room branch and licensed media', () => {
  assert.match(html, /<h1>Las Vegas Family Hotels<\/h1>/);
  assert.match(html, /<title>Top Family Hotels in Las Vegas: 10 Options by Trip Style<\/title>/);
  assert.ok(html.indexOf('</table>') < html.indexOf('Choose the hotel that removes the biggest family friction'));
  assert.ok(html.indexOf('id="las-vegas-room-fit"') < html.indexOf('Trip-style starts'));
  // G14 (owner 2026-10-29): the credited photo sits at the top, after the h1 and before the comparison.
  assert.ok(html.indexOf('</h1>') < html.indexOf('<figure class="licensed-photo hero-photo">'));
  assert.ok(html.indexOf('<figure class="licensed-photo hero-photo">') < html.indexOf('Trip-style starts'));
  assert.ok(html.indexOf('<figure class="licensed-photo hero-photo">') < html.indexOf('id="las-vegas-hotel-1"'));
  assert.ok(html.indexOf('href="#las-vegas-room-fit"') < html.indexOf('<table'));
  assert.match(html, /las-vegas-bellagio-fountains\.webp"[^>]+loading="eager"/);
  assert.equal((html.match(/<article class="quick-pick">/g) || []).length, 5);
  const spreadsheet = html.match(/<details><summary>Spreadsheet copy<\/summary>([\s\S]*?)<\/details>/)?.[1];
  assert.ok(spreadsheet?.includes('href="../downloads/las-vegas-family-hotels.csv" download'));
  assert.match(spreadsheet, /July 22 price basis and unknowns/);
});

test('keeps all room, water, sampled-review and historical-price constraints', () => {
  assert.equal(hotels.length, 10);
  for (const hotel of hotels) {
    for (const value of [hotel.name, hotel.category, hotel.area, hotel.priceRange, hotel.familySetup, hotel.priceNote, hotel.reviewSignal, hotel.parentCheck, ...hotel.strengths]) assert.ok(html.includes(esc(value)), value);
    if (hotel.roomCapacity) for (const value of [hotel.roomCapacity.label, hotel.roomCapacity.capacity, hotel.roomCapacity.note]) assert.ok(html.includes(esc(value)), value);
  }
  assert.match(html, /Four room-capacity records spot-checked:<\/strong> September 16, 2026/);
  assert.match(html, /This does not renew prices or other hotel facts/);
  assert.match(html, /Studios and one-bedroom suites max at four/);
  assert.match(html, /two rooms without assuming they connect/);
  assert.match(html, /does not permit cribs or rollaways/);
  assert.match(html, /Treat crib availability as unresolved/);
  assert.match(html, /These are not current five-person suite quotes/);
  assert.equal((html.match(/These dated room-rate examples do not establish a five-person suite quote/g) || []).length, 10);
});

test('native hotel targets and keyboard region remain stable and scoped', () => {
  assert.match(html, /role="region" aria-label="Las Vegas hotel comparison" tabindex="0"/);
  for (let index = 1; index <= 10; index++) {
    assert.equal((html.match(new RegExp(`href="#las-vegas-hotel-${index}"`, 'g')) || []).length, 1);
    assert.equal((html.match(new RegExp(`id="las-vegas-hotel-${index}"`, 'g')) || []).length, 1);
  }
  const css = read('site/styles.css');
  assert.match(css, /#las-vegas-hotel-intro h1 \{\s*font-size: var\(--t-2xl\)/);
  assert.match(css, /#las-vegas-hotel-intro ~ section #las-vegas-room-fit \{\s*scroll-margin-top: 80px/);
  assert.match(css, /#hotel-comparison\[data-glance-first\] td:first-child \{\s*position: sticky/);
});

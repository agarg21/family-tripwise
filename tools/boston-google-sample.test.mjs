// Q17b (OWNER D9/O2): Boston's Nov 8-13, 2026 samples are withdrawn; Park Plaza shows a labelled Google Hotels
// listing that must leave the committed page and CSV a week before its arrival date (the page is not re-rendered daily).
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { googleHotelSample, readReceipt } from "./page-generation/google-hotel-samples.mjs";
import { bostonParkPlazaGoogle, bostonSampleDrop, bostonLiveSample, bostonFamilyHotelPage } from "./page-generation/boston-family-hotels-page.mjs";
import { easternDate } from "./page-generation/sitemap.mjs";

const receipt = readReceipt("dataforseo-q17b-six-pages-a-2026-10-31.json");
const page = readFileSync(new URL("../site/where-to-stay/boston-family-hotels.html", import.meta.url), "utf8");
const csv = readFileSync(new URL("../site/downloads/boston-family-hotels.csv", import.meta.url), "utf8");

test("Park Plaza sample: exact title, same party, nightly per the 1-night control; Fenway shows none", () => {
  assert.equal(bostonParkPlazaGoogle.nightly, 311);
  assert.equal(bostonParkPlazaGoogle.control, 321);
  assert.equal(bostonParkPlazaGoogle.check_in, "2027-01-15");
  assert.equal(bostonParkPlazaGoogle.nights, 5);
  assert.equal(bostonParkPlazaGoogle.observed_on, "2026-10-31");
  assert.equal(googleHotelSample(receipt, "bos-park-plaza", { title: "Hilton Boston Park Plaza", childAges: [4, 8] }), null);
  assert.equal(googleHotelSample(receipt, "bos-residence-inn", { title: "Residence Inn by Marriott Boston Back Bay/Fenway", childAges: [4, 8, 12] }), null);
  assert.equal(bostonLiveSample("boston-fenway-two-bedroom-tobt", "2026-10-31"), null);
});

test("listing leaves a week before arrival", () => {
  assert.equal(bostonSampleDrop, "2027-01-08");
  assert.equal(bostonLiveSample("boston-park-plaza-deluxe-double", "2027-01-07"), bostonParkPlazaGoogle);
  assert.equal(bostonLiveSample("boston-park-plaza-deluxe-double", "2027-01-08"), null);
  const after = bostonFamilyHotelPage("2027-01-08");
  assert.doesNotMatch(after, /\$311/);
  assert.match(after, /Price: not shown/);
});

test("committed page and CSV show the listing only before the drop, never the Nov 8-13 samples", () => {
  const today = process.env.FT_BUILD_DATE || easternDate();
  for (const text of [page, csv]) assert.doesNotMatch(text, /372\.1|444\.84|528\.68|"781"|419\.22|Older observation 2026-10-0/);
  assert.doesNotMatch(page, /November 8-13, (?:five nights|2026, five nights)|November 8-13 &middot;/);
  if (today < "2027-01-08") {
    assert.match(page, /<p class="dc-price-figure">About \$311 a night<\/p><p class="dc-price-basis">Hilton Boston Park Plaza · 5 nights ≈ \$1,555 \(estimate\) · 2 adults \+ kids 4, 8, 12 · January 15 to 20, 2027 · Google Hotels listing seen October 31; room type and number of rooms not shown · not a quote/);
    assert.match(csv, /"311","2027-01-15 to 2027-01-20","2026-10-31"/);
  } else {
    // From January 8, 2027 this fails until `node tools/generate-pages.mjs` re-renders the page (a week before the stay).
    assert.doesNotMatch(page, /\$311 a night/);
    assert.doesNotMatch(csv, /"311"/);
  }
});

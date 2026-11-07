// Q17b (OWNER D9/O2): the San Diego Homewood Nov 8-13, 2026 sample is replaced by a labelled Google Hotels listing
// that must leave the committed page and CSV on its arrival date.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { dropDate, googleHotelSample, liveSample, readReceipt } from "./page-generation/google-hotel-samples.mjs";
import { easternDate } from "./page-generation/sitemap.mjs";

const receipt = readReceipt("dataforseo-q17b-six-pages-a-2026-10-31.json");
const title = "Homewood Suites by Hilton San Diego Downtown/Bayside";
const page = readFileSync(new URL("../site/where-to-stay/san-diego-family-hotels.html", import.meta.url), "utf8");
const csv = readFileSync(new URL("../site/downloads/san-diego-family-hotels.csv", import.meta.url), "utf8");

test("Homewood sample: exact title, same party, nightly per the 1-night control", () => {
  const sample = googleHotelSample(receipt, "sd-homewood", { title, childAges: [4, 8, 12] });
  assert.equal(sample.nightly, 272);
  assert.equal(sample.control, 287);
  assert.equal(sample.check_in, "2027-01-15");
  assert.equal(sample.nights, 5);
  assert.equal(sample.observed_on, "2026-10-31");
  // A different party or a similarly named hotel never yields the figure.
  assert.equal(googleHotelSample(receipt, "sd-homewood", { title, childAges: [4, 8] }), null);
  assert.equal(googleHotelSample(receipt, "sd-homewood", { title: "Homewood Suites by Hilton San Diego Mission Valley/Zoo", childAges: [4, 8, 12] }), null);
  // Controls more than 10% apart (Radio City $678 vs $798) and unpriced hotels are not used.
  assert.equal(googleHotelSample(readReceipt("dataforseo-q17b-six-pages-b-2026-10-31.json"), "nyc-radio-city", { title: "Radio City Apartments", childAges: [4, 8, 12] }), null);
  assert.equal(googleHotelSample(receipt, "pv-garza-blanca", { title: "Garza Blanca Preserve Resort & Spa Puerto Vallarta", childAges: [4, 8, 12] }), null);
});

test("sample drops on its arrival date, or a week early for this not-daily-rendered page", () => {
  const sample = googleHotelSample(receipt, "sd-homewood", { title, childAges: [4, 8, 12] });
  assert.equal(liveSample(sample, "2027-01-14"), sample);
  assert.equal(liveSample(sample, "2027-01-15"), null);
  assert.equal(dropDate(sample, 7), "2027-01-08");
  assert.equal(liveSample(sample, "2027-01-07", 7), sample);
  assert.equal(liveSample(sample, "2027-01-08", 7), null);
});

test("committed page and CSV never show the Nov 8-13 sample or the older Jan 15-20 listing", () => {
  for (const text of [page, csv]) assert.doesNotMatch(text, /November 8-13|1,355\.19|1,647\.58|271\.04|329\.52|January 15 to 20|\$1,360/);
});

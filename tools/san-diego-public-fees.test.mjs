import { readFileSync } from "node:fs";
import { test } from "node:test";
import assert from "node:assert/strict";
import { sanDiegoCurrentFeeNote } from "./page-generation/san-diego-hotel-evidence.mjs";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const html = read("site/where-to-stay/san-diego-family-hotels.html");
const escape = (value) => value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

test("three public fee notes use the exact maintained fee envelopes and dates", () => {
  for (const [name, path] of [
    ["Loews Coronado Bay Resort", "docs/research/loews-coronado-fees-2026-10-06.json"],
    ["La Jolla Shores Hotel", "docs/research/la-jolla-shores-fees-2026-10-05.json"],
    ["The Dana on Mission Bay", "docs/research/dana-fee-hold-2026-10-08.json"]
  ]) {
    const record = JSON.parse(read(path)).fee_envelope;
    const note = sanDiegoCurrentFeeNote(name);
    assert.deepEqual(note.sourceUrls, record.source_urls);
    assert.ok(note.text.includes(`checked ${record.observed_on}`));
    assert.ok(note.text.includes(`$${record.value.resort_fee_usd}`));
    assert.ok(html.includes(escape(note.text)));
    for (const source of note.sourceUrls) assert.ok(html.includes(`href="${escape(source)}"`));
  }
  assert.equal((html.match(/class="hotel-fee-note"/g) || []).length, 3);
});

test("Loews keeps parking alternatives, nightly tax and conditional one-time processing distinct", () => {
  const text = sanDiegoCurrentFeeNote("Loews Coronado Bay Resort").text;
  assert.match(text, /\$42 per room\/night plus tax/);
  assert.match(text, /\$50\/night or valet \$55\/night, each plus tax/);
  assert.match(text, /Conditional \$1\.99 one-time if applicable/);
  assert.match(text, /FAQ only, not numeric amenities corroboration/);
  assert.match(text, /Rate inclusion, taxes, charged nights and family-room total remain unknown/);
  assert.doesNotMatch(text, /\$47|all-in total|guaranteed/);
});

test("La Jolla keeps daily parking separate from nightly resort fees and unknown parking tax", () => {
  const text = sanDiegoCurrentFeeNote("La Jolla Shores Hotel").text;
  assert.match(text, /\$50\/night plus taxes; parking \$55\/day/);
  assert.match(text, /limited availability/);
  assert.match(text, /Parking tax, billed days and rate inclusion unknown/);
  assert.match(text, /not an all-fee family-room quote/);
  assert.doesNotMatch(text, /\$45|parking \$55\/night|parking.*tax included/);
});

test("Dana separates nightly payable components from daily non-payable authorization", () => {
  const text = sanDiegoCurrentFeeNote("The Dana on Mission Bay").text;
  assert.match(text, /resort \$25\/night plus tax; self-parking \$35\/night, no valet/);
  assert.match(text, /Optional \$10\/night rollaway: selected rooms, limited, not guaranteed/);
  assert.match(text, /stay amount plus \$50\/day incidentals/);
  assert.match(text, /hold, not an extra payable fee/);
  assert.match(text, /Hold days, release timing, parking\/rollaway taxes, billed nights and rate inclusion unknown/);
  assert.match(text, /not an all-fee quote or full cash requirement/);
  assert.doesNotMatch(text, /\$50\/night|hold included|\$110|\$300|released.*72/);
  assert.match(html, /Dana fee and authorization policy October 8, 2026/);
});

test("fee rendering does not renew unrelated hotel or historical price evidence", () => {
  assert.equal(sanDiegoCurrentFeeNote("unknown"), null);
  assert.equal(sanDiegoCurrentFeeNote("constructor"), null);
  assert.equal(sanDiegoCurrentFeeNote("toString"), null);
  assert.match(html, /Room, pool, and renovation facts were checked August 17, 2026 and are not renewed here/);
  assert.match(html, /Other fee and parking facts retain earlier checks/);
  assert.match(html, /not renewed or live quotes/);
  for (const range of ["$340-$630+", "$375-$500+", "$270-$350+", "$240-$360+", "$395-$740+", "$265-$350+", "Package-priced", "$235-$360+", "$350-$550+", "$600-$900+", "$250-$400+", "$300-$450+"]) assert.ok(html.includes(range));
});

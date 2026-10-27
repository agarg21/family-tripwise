import { hotelEvidence } from "./hotel-evidence.mjs";
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { sanDiegoCurrentRoomNote, sanDiegoCurrentFeeNote } from "./page-generation/san-diego-hotel-evidence.mjs";
const evidence = JSON.parse(readFileSync(new URL("../docs/research/san-diego-homewood-room-policy-2026-10-11.json", import.meta.url)));
const html = readFileSync(new URL("../site/where-to-stay/san-diego-family-hotels.html", import.meta.url), "utf8");

test("Homewood scoped room note comes from exact-category maintained evidence", () => {
  const note = sanDiegoCurrentRoomNote(evidence.hotel);
  assert.equal(note.sourceUrl, evidence.source_url);
  assert.equal(note.policySourceUrl, evidence.policy_source_url);
  for (const fact of [evidence.checked_on, "check current details before booking", evidence.category, evidence.sleeping_setup, ...evidence.equipment]) assert.ok(note.text.includes(fact), fact);
  assert.equal(evidence.published_maximum, 6);
  assert.equal(evidence.size_sq_ft, 570);
  assert.equal(sanDiegoCurrentRoomNote("The Dana on Mission Bay"), null);
  assert.equal(sanDiegoCurrentRoomNote("Homewood Suites Orlando"), null);
  assert.equal(sanDiegoCurrentFeeNote(evidence.hotel), null);
});

test("Room facts do not qualify price, dining capacity, fees, age acceptance or comfort", () => {
  assert.ok(Object.values(evidence.unknowns).every(value => value === null));
  const note = sanDiegoCurrentRoomNote(evidence.hotel);
  assert.match(note.text, /chair, cookware and place-setting quantities for five are unknown/);
  assert.match(note.text, /not confirmed booking acceptance, comfortable sleeping or sofa allocation/);
  assert.match(note.text, /mandatory fees and incidental-hold amount remain unknown/);
  assert.match(note.text, /older one-night sample is not a quote for this category/);
  assert.doesNotMatch(note.text, /price band/);
  assert.match(evidence.task.not_qualified, /RES133.*remain held/);
  assert.match(evidence.policy_audit, /not proof of zero fees/);
});

test("One additive room note preserves original cards, current fees and dated price samples", () => {
  assert.equal((html.match(/data-room-policy="homewood-bayside"/g) ?? []).length, 1);
  const note = sanDiegoCurrentRoomNote(evidence.hotel);
  assert.ok(html.includes(note.text));
  assert.equal((html.match(/class="detail-card hotel-card"/g) ?? []).length, 12);
  assert.equal((html.match(/class="hotel-fee-note"/g) ?? []).length, 3);
  assert.equal((html.match(/class="quick-pick"/g) ?? []).length, 6);
  assert.ok(html.includes("Older 1-night sample: $265 (2 adults; Jul 18)"));
  assert.equal((html.match(/class="hotel-price-sample"/g) ?? []).length, 1);
  const sample = hotelEvidence().find(r => r.hotel === evidence.hotel).fields.price.value.official_family_sample;
  assert.equal(sample.checked_on, "2026-10-04");
  assert.deepEqual(sample.rates.map(r => r.nightly_average), [271.04, 329.52]);
  assert.match(readFileSync(new URL("../docs/research/san-diego-hotel-price-display-2026-10-27.md", import.meta.url), "utf8"), /Homewood hold decision/);
  assert.doesNotMatch(html, /\$265-\$350\+/);
  assert.ok(html.includes(`href="${note.sourceUrl}">Exact-suite source</a>`));
  assert.ok(html.includes(`href="${note.policySourceUrl}">Hotel policy source</a>`));
});

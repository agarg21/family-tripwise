import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { compareStay, renderChecks } from "./page-generation/orlando-suite-model.mjs";
import { suites, checkedOn, recheckOn, pageUpdatedOn, priceRecheckOn } from "./page-generation/orlando-suite-data.mjs";
import { orlandoSuitePage } from "./page-generation/orlando-suite-page.mjs";
import { hotelEvidence } from "./hotel-evidence.mjs";
const evidence = JSON.parse(readFileSync(new URL("../docs/research/orlando-cabana-parking-unit-2026-10-11.json", import.meta.url)));

test("Cabana fee retains amount and unknown unit with its own source clock", () => {
  const s = suites.find(s => s.id === "cabana-bay");
  assert.equal(s.parking, evidence.parking.amount);
  assert.equal(s.parkingUnit, null);
  assert.equal(s.parkingCheckedOn, evidence.parking.checked_on);
  assert.equal(s.parkingRecheckOn, evidence.parking.recheck_on);
  assert.equal(evidence.parking.billing_frequency, null);
  assert.equal(evidence.parking.tax_amount, null);
  assert.equal(evidence.parking.rate_inclusion, null);
  assert.deepEqual([checkedOn,recheckOn,pageUpdatedOn], ["2026-09-24","2026-10-24","2026-09-27"]);
  assert.equal(priceRecheckOn, suites[2].priceTerms.recheckOn);
  assert.match(s.costNote, /not a displayed ISO label/);
  assert.match(s.costNote, /Other property facts and room prices are not renewed/);
  const fees = hotelEvidence().find(r=>r.id === "orlando-cabana-bay").fields.fees;
  assert.equal(fees.observed_on, "2026-09-24");
  assert.equal(fees.value.parking, 26);
  assert.match(fees.value.cost_note, /Parking wording checked October 11, 2026; recheck October 18/);
});

test("Unknown frequency never creates a one-, five-, or thirty-night parking subtotal", () => {
  for (const departure of ["2026-11-09","2026-11-13","2026-12-08"]) {
    for (const car of ["one","unknown"]) {
      const result = compareStay({departure,car});
      assert.equal(result.rows[1].parking, null);
      const html = renderChecks(result,result.rows[1]);
      assert.match(html, /Parking stay subtotal:/);
      assert.match(html, /billing frequency, tax and rate inclusion are not established/);
      assert.match(html, /Do not multiply by the number of nights/);
      assert.doesNotMatch(html, /\$130|\$780|\$26 before/);
    }
  }
});

test("No vehicle is selected zero, not a free-parking or fee-waiver claim", () => {
  const result = compareStay({car:"none"});
  assert.equal(result.rows[1].parking,0);
  assert.match(renderChecks(result,result.rows[1]), /no vehicle is planned; parking itself is not free/);
  assert.deepEqual(compareStay({feeIncluded:"no"}).rows.map(r=>[r.parking,r.resortExtra]), [[0,null],[null,null],[155,325]]);
  assert.deepEqual(compareStay({car:"unknown"}).rows.map(r=>r.parking),[null,null,null]);
  assert.equal(compareStay({feeIncluded:"yes"}).rows[2].resortExtra,0);
});

test("Static and generated public output share the corrected null, not hidden130", () => {
  const html = orlandoSuitePage();
  assert.equal(readFileSync(new URL("../site/where-to-stay/orlando-family-hotels.html",import.meta.url),"utf8"),html);
  assert.match(html, /Parking wording checked October 11, 2026/);
  assert.match(html, /no calculated stay subtotal/);
  assert.doesNotMatch(html, /\$130|per vehicle per night[^<]*Cabana/);
  assert.ok(html.includes(`About USD${Math.round(suites[2].priceSample.estimatedTotal / suites[2].priceSample.nights)} per room/night`));
  assert.match(html, /October 26, 2026/);
});

import test from "node:test";
import assert from "node:assert/strict";
import {execFileSync, spawnSync} from "node:child_process";
import {readFileSync} from "node:fs";
import {calculateLakeEolaRental} from "../src/shared/lake-eola-rental.mjs";
import {calculateAdmissionBudget} from "../src/shared/admission-budget.mjs";
import {compareOrlandoAdmission, admissionCliArguments} from "./orlando-admission-budget.mjs";
import {lakeEolaSwanBoatRental as rental, admissionTariffs, checkedOn, seaLifeTicket} from "./page-generation/orlando-activity-data.mjs";

const task = {travelerAges:[30,35,4,8,13], asOf:"2026-10-27", visitDate:"2026-10-28"};
const calculate = (patch = {}, record = rental) => calculateLakeEolaRental(record, {
  partySize:5, boatLoads:[5], asOf:task.asOf, visitDate:task.visitDate, ...patch
});

test("five passengers price one rental, not five admission tickets", () => {
  const row = calculate();
  assert.equal(row.publishedRentalSubtotalCents, 1500);
  assert.equal(row.rentals, 1);
  assert.equal(row.rentalMinutes, 30);
  assert.equal(row.maximumPeoplePerBoat, 5);
  assert.equal(row.maximumPoundsPerBoat, 1400);
  assert.equal(row.unit, "per boat per 30-minute rental");
  assert.equal(row.status, "published-rental-subtotal-not-quote");
  assert.match(row.product, /not park admission/);
});

test("six passengers cannot be assigned one boat; two explicit loads price two rentals", () => {
  assert.throws(() => calculate({partySize:6, boatLoads:[6]}));
  const row = calculate({partySize:6, boatLoads:[3,3]});
  assert.equal(row.publishedRentalSubtotalCents, 3000);
  assert.equal(row.rentals, 2);
  assert.equal(row.simultaneousBoatsAvailable, "unknown");
  assert.equal(row.childSupervisionAndAgeEligibility, "not-established");
  assert.equal(row.actualWeightsWithinLimit, "not-assessed");
  assert.match(row.scope, /not an approved seating or supervision plan/);
});

test("all source weekdays use the visit's calendar date and Monday withholds a subtotal", () => {
  for (const [date, closed] of [["2026-11-01",false],["2026-11-02",true],["2026-11-03",false]]) {
    const row = calculate({visitDate:date});
    assert.equal(row.publishedClosedWeekday, closed);
    assert.equal(row.publishedRentalSubtotalCents, closed ? null : 1500);
    if (closed) assert.equal(row.status, "published-closed-weekday");
    assert.equal(row.selectedDateAvailability, "unknown");
  }
});

test("review boundary labels historical arithmetic without renewing source dates", () => {
  assert.equal(calculate({visitDate:"2026-10-28"}).needsRecheck, false);
  for (const patch of [{visitDate:"2026-10-29"},{asOf:"2026-10-29",visitDate:"2026-10-30"}]) {
    const row = calculate(patch);
    assert.equal(row.needsRecheck, true);
    assert.equal(row.status, "historical-subtotal-needs-recheck");
    assert.equal(row.publishedRentalSubtotalCents, 1500);
    assert.equal(row.checkedOn, "2026-10-15");
    assert.equal(row.selectedDateAvailability, "unknown");
  }
});

test("malformed counts, missing party members and unsupported party sizes fail", () => {
  for (const loads of [[], [0,5], [2,2], [2.5,2.5], ["5"], [6], Array(5), [5,undefined], null])
    assert.throws(() => calculate({boatLoads:loads}));
  for (const partySize of [0,15,-1,5.5,"5",null]) assert.throws(() => calculate({partySize}));
  assert.equal(calculate({partySize:14,boatLoads:[5,5,4]}).publishedRentalSubtotalCents,4500);
});

test("invalid and future-evidence dates fail rather than producing a price", () => {
  for (const patch of [{asOf:"2026-10-14"},{visitDate:"2026-10-14"},{visitDate:"2026-02-30"},
    {visitDate:"2026-2-20"},{asOf:null},{visitDate:123}]) assert.throws(() => calculate(patch));
  assert.throws(() => calculate({}, {...rental,recheckOn:rental.checkedOn}));
});

test("malformed maintained rental basis fails closed", () => {
  for (const patch of [{currency:"EUR"},{centsPerRental:-1},{centsPerRental:15.1},
    {centsPerRental:Number.MAX_SAFE_INTEGER},{maximumPeoplePerBoat:6},{maximumPoundsPerBoat:null},
    {rentalMinutes:60},{closedWeekdays:[]},{closedWeekdays:Array(1)},
    {sourceUrl:"http://example.com"},{unitSourceUrl:"https://user:secret@example.com"},
    {conditions:[]},{exclusions:[undefined]},{unit:""}]) assert.throws(() => calculate({}, {...rental,...patch}));
});

test("rental output preserves unknown fees and cost scope with defensive copies", () => {
  const loads = [5], row = calculate({boatLoads:loads});
  assert.equal(row.completeDayCostCents, null);
  assert.match(row.taxAndFeeStatus, /not established/);
  assert.match(row.sourceUrl, /orlando\.gov/);
  assert.match(row.unitSourceUrl, /visitorlando\.org/);
  assert.ok(row.conditions.some(text => text.includes("first-come")));
  assert.ok(row.exclusions.some(text => text.includes("Park admission remains")));
  row.boatLoads[0]=1; row.conditions.push("changed"); row.exclusions.length=0;
  assert.deepEqual(loads,[5]);
  assert.notEqual(calculate().conditions.at(-1),"changed");
  assert.ok(calculate().exclusions.length);
});

test("optional rental never changes default admission outputs or historical clocks", () => {
  assert.deepEqual(compareOrlandoAdmission(task),calculateAdmissionBudget(admissionTariffs,task));
  const result=compareOrlandoAdmission({...task,boatLoads:[5]});
  const {optionalRental,...admission}=result;
  assert.deepEqual(admission,compareOrlandoAdmission(task));
  assert.equal(optionalRental.publishedRentalSubtotalCents,1500);
  for (const id of ["lake-eola","sea-life"])
    assert.equal(result.records.find(row=>row.id===id).publishedAdmissionSubtotalCents,null);
  assert.equal(checkedOn,"2026-10-13");
  assert.equal(seaLifeTicket.checked_on,"2026-10-13");
  assert.equal(admissionTariffs.find(row=>row.id==="lake-eola").checkedOn,"2026-10-13");
});

test("CLI requires explicit dense boat loads covering every traveler", () => {
  const args=["--ages","30,35,4,8,10,13","--as-of",task.asOf,"--visit-date",task.visitDate,"--boat-loads","3,3"];
  const input=admissionCliArguments(args);
  assert.deepEqual(input.boatLoads,[3,3]);
  const output=JSON.parse(execFileSync(process.execPath,["tools/orlando-admission-budget.mjs",...args],{encoding:"utf8"}));
  assert.deepEqual(output,compareOrlandoAdmission(input));
  assert.equal(output.optionalRental.publishedRentalSubtotalCents,3000);
  for (const bad of [[...args,"--boat-loads","3,3"], [...args.slice(0,-1),"6"],
    [...args.slice(0,-1),"3,,3"],[...args.slice(0,-1),"3,2"],[...args.slice(0,-1),""],
    [...args,"--boat","3,3"], [...args.slice(0,-1)]]) {
    const result=spawnSync(process.execPath,["tools/orlando-admission-budget.mjs",...bad],{encoding:"utf8"});
    assert.equal(result.status,1);
    assert.equal(result.stdout,"");
  }
});

test("source-dated desk tasks match executable rental cases, without public delivery", () => {
  const record=JSON.parse(readFileSync(new URL("../docs/research/lake-eola-rental-budget-2026-10-15.json",import.meta.url)));
  for (const row of record.tasks) {
    const input={travelerAges:row.ages,boatLoads:row.boat_loads,asOf:row.as_of,visitDate:row.visit_date};
    // Desk tasks dated before the newest admission observation are historical: the engine must refuse
    // to assess them against later evidence rather than reuse the old arithmetic.
    const predatesEvidence = admissionTariffs.some(tariff => row.as_of < tariff.checkedOn);
    if (row.result.startsWith("REJECT") || predatesEvidence) assert.throws(()=>compareOrlandoAdmission(input));
    else assert.equal(compareOrlandoAdmission(input).optionalRental.publishedRentalSubtotalCents,row.published_rental_subtotal_cents);
  }
  assert.equal(record.public_release,false);
  assert.equal(record.external_mutation,false);
});

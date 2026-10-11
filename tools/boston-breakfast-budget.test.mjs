import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { assessBreakfastUpgrade, breakfastBudgetFields } from "../src/shared/breakfast-upgrade-budget.mjs";
import { initializeBreakfastBudget, breakfastBudgetMessage } from "../src/shared/breakfast-upgrade-form.mjs";
import { bostonBreakfastBudgetBasis, bostonFamilyHotelPage, bostonBreakfastUpgrade, writeBostonFamilyHotelsPage, bostonCsv, bostonDiningCsv } from "./page-generation/boston-family-hotels-page.mjs";

const config = bostonBreakfastBudgetBasis();
const read = path => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const estimate = { adult_cost: 25, child_cost: 10, mornings: 5 };

test("Breakfast basis comes from the guarded dated public-plan join, never rounded nightly differences", () => {
  const source = bostonBreakfastUpgrade();
  assert.deepEqual(config, { adults: 2, included_children: 1, upgrade_cents: 41922, maximum_mornings: 6 });
  assert.equal(source.observation.checked_on, "2026-10-01");
  assert.equal(source.observation.requested_individual_ages_confirmed, false);
  assert.deepEqual(source.included_child_ages, [4]); assert.deepEqual(source.uncovered_child_ages, [8, 12]);
  assert.notEqual(config.upgrade_cents, Math.round((528.68 - 444.84) * 5 * 100));
});

test("Blank and partial meal inputs remain unknown, not free complete breakfasts", () => {
  assert.deepEqual(assessBreakfastUpgrade(config).missing_inputs, breakfastBudgetFields);
  const partial = assessBreakfastUpgrade(config, { adult_cost: 25 });
  assert.equal(partial.alternative_cents, null); assert.equal(partial.comparison, "UNKNOWN");
  assert.equal(assessBreakfastUpgrade(config, { ...estimate, child_cost: null }).difference_cents, null);
});

test("Integer cents compare below, equal and above, with explicit zero and decimal regression", () => {
  const below = assessBreakfastUpgrade(config, estimate);
  assert.equal(below.alternative_cents, 30000); assert.equal(below.difference_cents, -11922);
  assert.equal(below.comparison, "below");
  assert.equal(assessBreakfastUpgrade(config, { adult_cost: 200, child_cost: 19.22, mornings: 1 }).comparison, "equal");
  const above = assessBreakfastUpgrade(config, { adult_cost: 45, child_cost: 10, mornings: 5 });
  assert.equal(above.alternative_cents, 50000); assert.equal(above.difference_cents, 8078);
  assert.equal(above.comparison, "above");
  assert.equal(assessBreakfastUpgrade(config, { adult_cost: 0, child_cost: 0, mornings: 0 }).alternative_cents, 0);
  assert.equal(assessBreakfastUpgrade(config, { adult_cost: 0.29, child_cost: 0.1, mornings: 3 }).alternative_cents, 204);
  assert.match(breakfastBudgetMessage(below), /USD 300.00.*USD 119.22 below.*USD 419.22.*Not actual savings/);
});

test("Invalid amounts, fractional/out-of-span mornings, extra keys and executable objects fail closed", () => {
  let coerced = false;
  const executable = { valueOf() { coerced = true; return 25; } };
  assert.throws(() => assessBreakfastUpgrade(config, { ...estimate, adult_cost: executable }));
  assert.equal(coerced, false, "Invalid meal values must not execute coercion hooks");
  for (const value of [undefined, -1, 10001, 0.001, 19.222, NaN, Infinity, "25", {}, false])
    assert.throws(() => assessBreakfastUpgrade(config, { ...estimate, adult_cost: value }));
  for (const value of [undefined, -1, 1.5, 7, Infinity, "5", NaN])
    assert.throws(() => assessBreakfastUpgrade(config, { ...estimate, mornings: value }));
  for (const value of [null, [], Object.create(estimate), { ...estimate, older_children: 2 },
    { [Symbol("meal")]: 1 }, { get adult_cost() { throw Error("must not execute"); } }])
    assert.throws(() => assessBreakfastUpgrade(config, value));
  for (const value of [null, {}, { ...config, upgrade_cents: 419.22 }, { ...config, adults: 0 },
    { ...config, included_children: -1 }, { ...config, maximum_mornings: 0 },
    { ...config, extra: 1 }, { get adults() { throw Error("must not execute"); } }])
    assert.throws(() => assessBreakfastUpgrade(value, estimate));
  const result = assessBreakfastUpgrade(config, estimate); result.inputs.adult_cost = 100;
  assert.equal(estimate.adult_cost, 25);
});

function fixture(basis = config) {
  const listeners = {}, fields = Object.fromEntries(breakfastBudgetFields.map(key => [key, { value: "" }]));
  const form = { hidden: true, elements: { namedItem: key => fields[key] }, addEventListener: (name, fn) => { listeners[name] = fn; } };
  const status = { textContent: "Comparison unresolved." };
  const document = { querySelector: id => id === "#breakfast-budget-form" ? form : id === "#breakfast-budget-status" ? status : id === "#breakfast-budget-basis" ? { textContent: JSON.stringify(basis) } : null };
  initializeBreakfastBudget(document);
  return { form, fields, status, listeners, submit() { let prevented = false; listeners.submit({ preventDefault() { prevented = true; } }); assert.ok(prevented); } };
}

test("Browser adapter starts unknown, calculates, invalidates stale output and resets without transmission", () => {
  const f = fixture(); assert.equal(f.form.hidden, false); assert.match(f.status.textContent, /3 of 3 inputs unknown/);
  f.fields.adult_cost.value = "25"; f.submit(); assert.match(f.status.textContent, /2 of 3 inputs unknown/);
  f.fields.child_cost.value = "10"; f.fields.mornings.value = "5"; f.submit();
  assert.match(f.status.textContent, /USD 300.00.*USD 119.22 below/);
  f.listeners.input(); assert.match(f.status.textContent, /previous calculation no longer applies/);
  f.fields.mornings.value = "1.5"; f.submit(); assert.match(f.status.textContent, /Check whole mornings/);
  f.listeners.reset(); assert.match(f.status.textContent, /All three hypothetical inputs are unknown/);
  assert.doesNotMatch(read("src/shared/breakfast-upgrade-form.mjs"), /fetch\(|XMLHttpRequest|localStorage|sessionStorage|sendBeacon|https?:/);
});

test("Missing or malformed maintained configuration cannot reveal a live calculator", () => {
  assert.equal(fixture({}).form.hidden, true);
  initializeBreakfastBudget({ querySelector: () => null });
});

test("Public and source modules, generated config/example and unchanged full/dining CSV share one basis", () => {
  for (const name of ["breakfast-upgrade-budget.mjs", "breakfast-upgrade-form.mjs"])
    assert.equal(read(`src/shared/${name}`), read(`site/shared/${name}`));
  const page = bostonFamilyHotelPage();
  assert.equal(read("site/where-to-stay/boston-family-hotels.html"), page);
  assert.deepEqual(JSON.parse(page.match(/id="breakfast-budget-basis" type="application\/json">(.*?)<\/script>/)[1]), config);
  assert.match(page, /USD 300.00.*USD 119.22 below.*USD 419.22 increment/);
  assert.equal(read("site/downloads/boston-family-hotels.csv"), bostonCsv);
  assert.equal(read("site/downloads/boston-cooking-dining-five.csv"), bostonDiningCsv);
  const generated = new Map(); writeBostonFamilyHotelsPage((path, content) => generated.set(path, content));
  assert.deepEqual([...generated.keys()], ["where-to-stay/boston-family-hotels.html", "downloads/boston-family-hotels.csv", "downloads/boston-cooking-dining-five.csv", "shared/breakfast-upgrade-budget.mjs", "shared/breakfast-upgrade-form.mjs"]);
});

test("Worksheet stays blank, labeled and conditional; original source and price clocks are not renewed", () => {
  const page = bostonFamilyHotelPage(), section = page.split("<!-- FT-IMP-103 breakfast start -->")[1].split("<!-- FT-IMP-103 breakfast end -->")[0];
  assert.match(section, /form id="breakfast-budget-form" hidden/);
  for (const id of ["breakfast-adult", "breakfast-child", "breakfast-mornings"])
    assert.match(section, new RegExp(`for="${id}"`));
  assert.equal((section.match(/type="number"/g) || []).length, 3);
  assert.doesNotMatch(section, /value="\d/);
  for (const text of ["not ages 8 and 12", "hypothetical", "do not establish six meal entitlements", "Credits", "Not actual savings", "No food credits are deducted"])
    assert.ok((section + breakfastBudgetMessage(assessBreakfastUpgrade(config, estimate))).includes(text), text);
  assert.match(section, /aria-live="polite" aria-atomic="true"/);
  assert.match(page, /source and prices observed October 1/); assert.match(page, /price review due October 15/);
});

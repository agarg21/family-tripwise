import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { initializeRestBudget, restBudgetMessage } from "../src/shared/museum-rest-budget.mjs";
import { assessRestTimeBudget, restDurationFields } from "../src/shared/rest-time-budget.mjs";
import { dcFamilyHotelPage, dcRestExample, dcCsv } from "./page-generation/washington-dc-family-hotels-page.mjs";

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

function fixture() {
  const listeners = {}, fields = Object.fromEntries(["available_minutes", ...restDurationFields].map(key => [key, { value: "" }]));
  const form = { hidden: true, elements: { namedItem: key => fields[key] }, addEventListener: (name, fn) => { listeners[name] = fn; } };
  const status = { textContent: "" };
  const document = { querySelector: id => id === "#rest-budget-form" ? form : id === "#rest-budget-status" ? status : null };
  initializeRestBudget(document);
  return { form, fields, status, listeners, submit() { let prevented = false; listeners.submit({ preventDefault() { prevented = true; } }); assert.ok(prevented); } };
}

test("Browser adapter starts unknown, calculates, invalidates stale output and resets without data transmission", () => {
  const f = fixture();
  assert.equal(f.form.hidden, false);
  assert.match(f.status.textContent, /unresolved.*0 known minutes; 6 of 6 durations missing/);
  f.fields.room_rest_minutes.value = "90"; f.submit();
  assert.match(f.status.textContent, /90 known minutes; 5 of 6 durations missing/);
  f.fields.available_minutes.value = "450";
  [120, 30, 90, 30, 30, 120].forEach((n, i) => { f.fields[restDurationFields[i]].value = String(n); });
  f.submit(); assert.match(f.status.textContent, /30 minutes remaining. 420 planned minutes.*unverified/);
  f.fields.afternoon_visit_minutes.value = "150"; f.listeners.input();
  assert.match(f.status.textContent, /previous calculation no longer applies/);
  f.submit(); assert.match(f.status.textContent, /No spare minutes. 450 planned/);
  f.fields.afternoon_visit_minutes.value = "151"; f.submit();
  assert.match(f.status.textContent, /1 minute over.*451 planned/);
  f.fields.room_rest_minutes.value = ""; f.submit(); assert.match(f.status.textContent, /unresolved/);
  f.fields.room_rest_minutes.value = "-1"; f.submit(); assert.match(f.status.textContent, /Check/);
  f.listeners.reset(); assert.match(f.status.textContent, /all six durations are unknown/);
  assert.doesNotMatch(read("src/shared/museum-rest-budget.mjs"), /fetch\(|XMLHttpRequest|localStorage|sessionStorage|sendBeacon|https?:/);
});

test("Public and Node cores and adapters are byte-identical, page and original full CSV deterministic", () => {
  for (const name of ["rest-time-budget.mjs", "museum-rest-budget.mjs"])
    assert.equal(read(`src/shared/${name}`), read(`site/shared/${name}`));
  assert.equal(read("site/where-to-stay/washington-dc-family-hotels.html"), dcFamilyHotelPage());
  assert.equal(read("site/downloads/washington-dc-family-hotels.csv"), dcCsv);
  assert.equal(dcRestExample.total_required_minutes, 420);
  assert.equal(dcRestExample.remaining_window_minutes, 30);
  assert.equal(dcRestExample.inspected_on, "2026-10-03");
});

test("Rest form is additive, labeled, numeric, blank by default and conditional with no-JS example", () => {
  const page = dcFamilyHotelPage();
  assert.match(page, /form id="rest-budget-form" hidden/);
  assert.equal((page.match(/name="(?:available_minutes|[a-z_]+_minutes)" type="number"/g) || []).length, 7);
  for (const key of restDurationFields) assert.match(page, new RegExp(`for="rest-${key}"`));
  assert.match(page, /aria-live="polite" aria-atomic="true"/);
  assert.match(page, /type="submit">Calculate time budget/);
  assert.match(page, /type="reset">Clear values/);
  assert.match(page, /Original October 3, 2026 task arithmetic, not observed journeys, current opening hours/);
  assert.match(page, /Actual hotel-return feasibility remains unknown/);
  assert.match(page, /museum-rest-budget.mjs\?v=ft-imp102/);
  assert.doesNotMatch(page.slice(page.indexOf('id="rest-budget"'), page.indexOf("<figure>")), /value="\d/);
  assert.match(restBudgetMessage(assessRestTimeBudget(null)), /unresolved/);
  initializeRestBudget({ querySelector: () => null });
});

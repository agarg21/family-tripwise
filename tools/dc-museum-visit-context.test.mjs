import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { dcMuseumVisitContext, dcFamilyHotelPage } from "./page-generation/washington-dc-family-hotels-page.mjs";

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const record = () => JSON.parse(read("docs/research/washington-dc-museum-rest-task-2026-10-03.json"));

test("Natural History public constraints retain dated scope and complete-budget unknowns", () => {
  const block = dcMuseumVisitContext();
  for (const phrase of ["10:00-17:30", "closed December 25", "450-minute", "not usable visit time", "confirmation of November operation", "USD 0 per person", "no general-admission ticket", "Paid experiences, food and transport", "eat outside", "No lunch seating or refrigerated lunch storage", "security screening", "no coat, bag or locker storage", "return-entry conditions remain unknown", "facts checked 2026-10-03", "October 11, 2026 recheck unavailable", "have not been renewed"])
    assert.ok(block.includes(phrase), phrase);
  assert.match(block, /href="https:\/\/naturalhistory.si.edu\/visit"/);
  assert.doesNotMatch(block, /American History|free family trip|re-entry is allowed|stroller-friendly|current hours|verified route|<form|download|<table/);
});

test("public context sits inside existing rest decision before its unchanged calculator", () => {
  const html = dcFamilyHotelPage(), block = dcMuseumVisitContext();
  assert.equal(html.split(block).length, 2);
  assert.ok(html.indexOf('<section id="rest">') < html.indexOf(block));
  assert.ok(html.indexOf(block) < html.indexOf('<div id="rest-budget"'));
  assert.equal(html, read("site/where-to-stay/washington-dc-family-hotels.html"));
  assert.equal((block.match(/<li>/g) || []).length, 4);
  assert.equal((block.match(/<h3>/g) || []).length, 1);
});

test("unreviewed source, policy and uncertainty drift stops public-context generation", () => {
  const changes = [
    value => { value.sources[0].status = "unavailable"; },
    value => { value.sources[0].evidence_class = "COMMUNITY_HYPOTHESIS"; },
    value => { value.sources[0].inspected_on = "2026-10-11"; },
    value => { value.sources[0].url = "https://example.com"; },
    value => { value.museum_constraints[0].published_daily_close = "18:00"; },
    value => { value.museum_constraints[0].general_admission.amount = 5; },
    value => { value.museum_constraints[0].general_admission.tickets_required = true; },
    value => { value.museum_constraints[0].general_admission.special_paid_experiences_included = true; },
    value => { value.museum_constraints[0].future_november_operation_confirmed = true; },
    value => { value.museum_constraints[0].packed_lunch = "Lunch is allowed inside"; },
    value => { value.museum_constraints[0].storage = "Lockers available"; },
    value => { value.museum_constraints[0].room_return_duration_minutes = 15; },
    value => { value.museum_constraints[0].second_entry_wait_minutes = 0; },
    value => { value.museum_constraints[0].stroller_route_assessed = true; },
    value => { value.editorial_derivation.published_nmnh_window_minutes = 480; }
  ];
  for (const change of changes) {
    const value = record(); change(value);
    assert.throws(() => dcMuseumVisitContext(value), /reviewed visitor-source reconciliation/);
  }
});

test("task evidence cannot turn failed freshness check into fact renewal or parent demand", () => {
  const task = JSON.parse(read("docs/research/dc-museum-meal-rest-public-task-2026-10-11.json"));
  assert.equal(task.source_renewed, false);
  assert.equal(task.human_tested, false);
  assert.equal(task.source_inspected_on, "2026-10-03");
  assert.equal(task.current_source_check.attempts, 1);
  assert.equal(task.current_source_check.result, "403 Forbidden");
  assert.equal(task.current_source_check.prior_denied_links_retried, false);
  assert.match(task.current_source_check.next_check, /no unchanged retry/);
  assert.match(task.public_scope, /Natural History only/);
  assert.match(task.confidence, /not user testing, demand, satisfaction or SEO/);
});

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { assessFamilyTransit } from "../src/shared/family-transit-cost.mjs";
import { assessFamilyTransit as assessNode } from "./family-transit-cost.mjs";
import { readRailInputs, railBudgetMessage, initializeRailBudget, unresolvedRailMessage } from "../src/shared/family-rail-budget.mjs";
import { dcFamilyHotelPage, dcFamilyRailForm } from "./page-generation/washington-dc-family-hotels-page.mjs";
const policy = JSON.parse(readFileSync(new URL("../docs/research/dc-family-transit-cost-2026-10-03.json", import.meta.url))).policy;
const values = { adults: "2", children: "3", child_age_0: "4", child_age_1: "8", child_age_2: "12", rail_trips: "2", fare_period: "weekday-day" };
const formFor = data => ({ elements: { namedItem: key => key in data ? { value: data[key] } : null } });
const assess = data => assessFamilyTransit(policy, readRailInputs(formFor(data)), "2026-10-11");

test("Shared browser and Node engine retain dated policy and all conditional results", () => {
  for (const child_ages of [[], [0, 4], [4, 8, 12], [5, 8, 12], [0, 1, 4], [17]])
    for (const adults of [1, 2]) for (const fare_period of ["weekday-day", "weekday-late", "weekend"])
      for (const asOf of ["2026-10-11", "2026-11-02", "2026-11-03"]) {
        const input = { adults, child_ages, fare_period, rail_trips: 2, one_way_fare_cents: null, fare_product: "regular-pay-as-you-go" };
        assert.deepEqual(assessFamilyTransit(policy, input, asOf), assessNode(policy, input, asOf));
      }
  assert.equal(policy.source.inspected_on, "2026-10-03");
});

test("Own-family age5 and excess-under5 boundaries never inherit fixed example amounts", () => {
  assert.match(railBudgetMessage(assess(values)), /Regular-fare riders: 4.*USD 18\.00-54\.00/);
  assert.match(railBudgetMessage(assess({ ...values, child_age_0: "5" })), /Regular-fare riders: 5.*USD 22\.50-67\.50/);
  const excess = assess({ ...values, adults: "1", child_age_0: "0", child_age_1: "1", child_age_2: "4" });
  assert.equal(excess.minimum, null);
  assert.match(railBudgetMessage(excess), /additional under-five fares: 1, unknown, not zero/);
  assert.match(railBudgetMessage(assess({ ...values, children: "0", fare_period: "weekend" })), /USD 9\.00-10\.00/);
});

test("Missing, malformed and stale inputs cannot become a computed current fare", () => {
  for (const change of [{ adults: "" }, { children: "" }, { children: "7" }, { children: "-1" }, { rail_trips: "" }, { child_age_0: "" }, { child_age_0: "4.5" }, { child_age_0: "0x4" }])
    assert.throws(() => readRailInputs(formFor({ ...values, ...change })));
  for (const change of [{ adults: "0" }, { child_age_0: "18" }, { rail_trips: "0" }, { rail_trips: "101" }, { fare_period: "" }]) assert.throws(() => assess({ ...values, ...change }));
  const stale = assessFamilyTransit(policy, readRailInputs(formFor(values)), "2026-11-03");
  assert.match(railBudgetMessage(stale), /needs rechecking.*No current estimate/);
  assert.equal(stale.minimum, null);
  assert.equal(stale.actual_trip_cost, null);
});

function fixture() {
  const handlers = {}, fields = Object.fromEntries(Object.entries(values).map(([key, value]) => [key, { value }]));
  fields.children.addEventListener = (name, handler) => { handlers[`children-${name}`] = handler; };
  const form = { hidden: true, elements: { namedItem: key => fields[key] ?? null }, addEventListener: (name, handler) => { handlers[name] = handler; } };
  const status = { textContent: "" }, ageGroup = { hidden: true };
  const ages = { labels: [], replaceChildren() { this.labels = []; for (const key of Object.keys(fields)) if (key.startsWith("child_age_")) delete fields[key]; }, append(label) { this.labels.push(label); } };
  const elements = { "#family-rail-form": form, "#family-rail-status": status, "#family-rail-policy": { textContent: JSON.stringify(policy) }, "#family-rail-ages": ages, "#family-rail-age-group": ageGroup };
  const document = { querySelector: key => elements[key] ?? null, createElement: tag => ({ tag, value: "", append(input) { this.input = input; fields[input.name] = input; } }) };
  return { document, handlers, fields, status, ages, ageGroup, form };
}

test("Progressive form creates individually labeled ages and invalidates changed/reset results", () => {
  const f = fixture();
  initializeRailBudget(f.document, () => "2026-10-11");
  assert.equal(f.form.hidden, false);
  assert.equal(f.status.textContent, unresolvedRailMessage);
  f.handlers["children-change"]();
  assert.equal(f.ages.labels.length, 3);
  assert.equal(f.ageGroup.hidden, false);
  for (const [i, label] of f.ages.labels.entries()) {
    assert.equal(label.htmlFor, `rail-child-age-${i}`);
    assert.equal(label.input.required, true);
    assert.equal(label.input.min, "0");
    assert.equal(label.input.max, "17");
    label.input.value = ["4", "8", "12"][i];
  }
  let prevented = false;
  f.handlers.submit({ preventDefault() { prevented = true; } });
  assert.equal(prevented, true);
  assert.match(f.status.textContent, /USD 18\.00-54\.00/);
  f.handlers.input();
  assert.match(f.status.textContent, /previous calculation no longer applies/);
  f.fields.child_age_0.value = "";
  f.handlers.submit({ preventDefault() {} });
  assert.doesNotMatch(f.status.textContent, /USD/);
  f.handlers.reset();
  assert.equal(f.ages.labels.length, 0);
  assert.equal(f.ageGroup.hidden, true);
  assert.equal(f.status.textContent, unresolvedRailMessage);
});

test("Static fallback, native page generation and browser mirrors use the maintained policy", () => {
  const html = dcFamilyHotelPage();
  assert.equal(html, readFileSync(new URL("../site/where-to-stay/washington-dc-family-hotels.html", import.meta.url), "utf8"));
  assert.ok(html.includes(dcFamilyRailForm()));
  assert.equal((html.match(/id="family-rail-form"/g) ?? []).length, 1);
  assert.match(dcFamilyRailForm(), /<form id="family-rail-form" hidden/);
  assert.ok(html.includes(unresolvedRailMessage));
  const embedded = JSON.parse(html.match(/<script type="application\/json" id="family-rail-policy">([^]*?)<\/script>/)[1]);
  assert.deepEqual(embedded, policy);
  for (const name of ["family-transit-cost.mjs", "family-rail-budget.mjs"])
    assert.equal(readFileSync(new URL(`../src/shared/${name}`, import.meta.url), "utf8"), readFileSync(new URL(`../site/shared/${name}`, import.meta.url), "utf8"));
});

test("Browser lifecycle fails closed on expired source and malformed configuration", () => {
  const stale = fixture();
  initializeRailBudget(stale.document, () => "2026-11-03");
  stale.handlers.submit({ preventDefault() {} });
  assert.match(stale.status.textContent, /needs rechecking.*No current estimate/);
  assert.doesNotMatch(stale.status.textContent, /USD/);
  const malformed = fixture();
  malformed.document.querySelector("#family-rail-policy").textContent = "{";
  initializeRailBudget(malformed.document);
  assert.equal(malformed.form.hidden, true);
  assert.equal(malformed.handlers.submit, undefined);
  assert.doesNotMatch(readFileSync(new URL("../src/shared/family-rail-budget.mjs", import.meta.url), "utf8"), /fetch\(|XMLHttpRequest|localStorage|sessionStorage|sendBeacon/);
});

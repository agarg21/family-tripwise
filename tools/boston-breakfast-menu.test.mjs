import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { bostonBreakfastMenuSection, bostonFamilyHotelPage, bostonBreakfastBudgetBasis } from "./page-generation/boston-family-hotels-page.mjs";

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const evidence = JSON.parse(read("docs/research/boston-park-plaza-breakfast-menu-2026-10-11.json"));

test("Source-dated menu and service checks derive from one qualified record", () => {
  const section = bostonBreakfastMenuSection();
  for (const item of evidence.menu) assert.ok(section.includes(`<th scope="row">${item.name}</th><td>${item.displayed_amount}</td>`));
  for (const value of [evidence.source_url, evidence.observed_on, evidence.review_due, evidence.breakfast_hours.weekdays, evidence.breakfast_hours.weekends]) assert.ok(section.includes(value));
  assert.match(section, /7% meals tax is added.*18% gratuity.*6 or more/);
  assert.match(section, /tabindex="0" role="region" aria-label="Park Plaza general breakfast menu"/);
  assert.equal((section.match(/<th scope="row">/g) || []).length, 4);
});

test("Menu preserves unknown currency, child prices, entitlements and original clocks", () => {
  const section = bostonBreakfastMenuSection();
  for (const value of ["Currency not labeled", "not child-specific quotes", "not confirmed service", "Other charges and gratuity", "No credit is deducted", "Ages 8 and 12 still need meal-cost confirmation", "buffet inclusion", "calculator above stays hypothetical and blank", "observation October 1 and review October 15 are unchanged"]) assert.ok(section.includes(value), value);
  assert.doesNotMatch(section, /USD (?:38|22|10|7)|free breakfast|guaranteed|savings|child price (?:is|of)/i);
  assert.deepEqual(bostonBreakfastBudgetBasis(), { adults: 2, included_children: 1, upgrade_cents: 41922, maximum_mornings: 6 });
});

test("Changed menu amounts or strengthened evidence basis fail closed pending requalification", () => {
  for (const mutate of [e => e.menu[0].displayed_amount = 39, e => e.price_basis.currency = "USD", e => e.price_basis.child_prices_established = true,
    e => e.price_basis.package_menu_equivalence_established = true, e => e.price_basis.credit_eligibility_established = true,
    e => e.breakfast_hours.stay_date_service_confirmed = true, e => e.breakfast_hours.weekdays = "6-11 am",
    e => e.price_basis.menu_stated_meals_tax_percent = 8, e => e.source_url += "?different=1", e => e.review_due = "2026-10-01",
    e => e.menu.push({ name: "Child breakfast", displayed_amount: 5 })]) {
    const copy = structuredClone(evidence); mutate(copy); assert.throws(() => bostonBreakfastMenuSection(copy), /requalification/);
  }
});

test("Generated public owner retains a single additive menu block and blank hypothetical form", () => {
  const page = bostonFamilyHotelPage();
  assert.equal(read("site/where-to-stay/boston-family-hotels.html"), page);
  assert.equal((page.match(/FT-IMP-104 menu start/g) || []).length, 1);
  assert.match(page, /form id="breakfast-budget-form" hidden/);
  assert.doesNotMatch(page, /id="breakfast-(?:adult|child|mornings)"[^>]*value=/);
  assert.equal((read("site/sitemap.xml").match(/<loc>/g) || []).length, 35);
});

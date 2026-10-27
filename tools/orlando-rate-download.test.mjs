import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { suites, sources } from "./page-generation/orlando-suite-data.mjs";
import { orlandoRateComparisonCsv, orlandoRateCsvPath, orlandoSuitePage, writeOrlandoSuitePage } from "./page-generation/orlando-suite-page.mjs";

const parse = csv => csv.trimEnd().split("\n").map(line => [...line.matchAll(/"((?:[^"]|"")*)"(?:,|$)/g)].map(m => m[1].replaceAll('""', '"')));
test("portable rates retain both same-room plans and all dated fee/age/term boundaries", () => {
  const [head, ...rows] = parse(orlandoRateComparisonCsv());
  assert.equal(head.length, 20);
  assert.equal(rows.length, 2);
  const hotel = suites[2];
  for (const [i, row] of rows.entries()) {
    assert.equal(row.length, head.length);
    const values = Object.fromEntries(head.map((name, j) => [name, row[j]]));
    const p = [hotel.priceSample, hotel.alternatePriceSample][i];
    assert.equal(values["Exact room"], p.room);
    assert.equal(values["Party and age basis"], p.party);
    assert.equal(values["Stay dates"], p.stay);
    assert.equal(values.Nights, "5");
    assert.equal(values.Currency, "USD");
    assert.equal(values["Price unit"], "one room / per night; stay total for stated nights");
    assert.equal(values["Dated public plan"], p.plan);
    for (const [column, field] of [["Estimated stay total", "estimatedTotal"], ["Room subtotal", "roomSubtotal"], ["Included resort fees", "resortFees"], ["Included displayed taxes", "taxes"]]) assert.equal(values[column], p[field].toFixed(2));
    assert.equal(values["Derived approximate nightly"], (p.estimatedTotal / p.nights).toFixed(2));
    assert.equal(values["Plan terms"], p.terms);
    assert.equal(values["Fee and acceptance limits"], hotel.priceTerms.limitation);
    assert.equal(values["Deposit timing conflict"], hotel.priceTerms.depositConflict);
    assert.equal(values["Price observed"], p.observedOn);
    assert.equal(values["Terms checked"], "2026-10-11");
    assert.equal(values["Recheck due"], undefined);
    assert.equal(values["Dated source"], sources[p.source]);
    assert.match(values["Live comparison"], /orlando-family-hotels\.html#ihg-rate-plans$/);
  }
  assert.match(rows[0].join(" "), /non-refundable/);
  assert.match(rows[1].join(" "), /6:00 PM local hotel time on November 6, 2026/);
  assert.match(rows[0].join(" "), /Parking is extra.*not typical ranges, live quotes/);
  assert.doesNotMatch(orlandoRateComparisonCsv(), /763\.90|151\.880000|Disney's Art/);
});
test("CSV escaping and formula protection retain row boundaries", () => {
  for (const prefix of ["=", "+", "-", "@", "  ="]) {
    const sample = structuredClone(suites[2]);
    sample.name = `${prefix}test, "quoted"\nnext\ttab`;
    const [, row] = parse(orlandoRateComparisonCsv([sample]));
    assert.equal(row[0], `'${prefix}test, "quoted" next tab`);
    assert.equal(row.length, 20);
  }
});
test("no-JS native link and generated asset stay in parity without changing shared records", () => {
  const html = orlandoSuitePage();
  assert.equal((html.match(/id="ihg-rate-plans"/g) ?? []).length, 1);
  assert.equal((html.match(/href="\.\.\/downloads\/orlando-ihg-dated-rates.csv" download/g) ?? []).length, 1);
  assert.match(html, /Download dated IHG rates \(CSV\)/);
  const out = new Map();
  writeOrlandoSuitePage((path, value) => out.set(path, value));
  assert.equal(out.get(orlandoRateCsvPath), orlandoRateComparisonCsv());
  assert.equal(readFileSync(new URL(`../site/${orlandoRateCsvPath}`, import.meta.url), "utf8"), orlandoRateComparisonCsv());
  assert.equal(out.size, 7);
  assert.ok(out.has("downloads/orlando-meal-planning.csv"));
  assert.equal(out.get("where-to-stay/orlando-family-hotels.html"), html);
});

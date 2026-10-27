import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { suites, sources } from "./page-generation/orlando-suite-data.mjs";
import { orlandoCombinedRateComparisonCsv, orlandoCombinedRateCsvPath, orlandoRateComparisonCsv, orlandoSuitePage, writeOrlandoSuitePage } from "./page-generation/orlando-suite-page.mjs";

const parse = csv => csv.trimEnd().split("\n").map(line => [...line.matchAll(/"((?:[^"]|"")*)"(?:,|$)/g)].map(m => m[1].replaceAll('""', '"')));
test("combined export keeps four source-based plans and property-specific unknowns", () => {
  const [head, ...rows] = parse(orlandoCombinedRateComparisonCsv());
  assert.equal(head.length, 21);
  assert.equal(rows.length, 4);
  const booking = suites[1].bookingRates;
  for (const [i, row] of rows.entries()) {
    assert.equal(row.length, 21);
    const v = Object.fromEntries(head.map((name, j) => [name, row[j]]));
    assert.equal(v.Nights, "5");
    assert.equal(v.Currency, "USD");
    assert.equal(v["Stay dates"], "November 8-13, 2026");
    assert.equal(v["Price observed"], "2026-10-11");
    assert.equal(v["Recheck due"], undefined);
    assert.match(v["Party and age basis"], /three children.*ages not entered/);
    if (i < 2) {
      const p = booking.plans[i];
      assert.equal(v.Property, suites[1].name);
      assert.equal(v["Exact room"], booking.room);
      assert.equal(v["Estimated stay total"], p.estimatedTotal.toFixed(2));
      assert.equal(v["Derived approximate nightly"], (p.estimatedTotal / booking.nights).toFixed(2));
      assert.equal(v["Room subtotal"], p.roomSubtotal.toFixed(2));
      assert.equal(v["Included displayed taxes"], p.taxes.toFixed(2));
      assert.equal(v["Included resort fees"], "Unknown");
      assert.equal(v["Plan terms"], `${p.restrictions} ${booking.terms}`);
      assert.equal(v["Fee and acceptance limits"], `${booking.feeBasis} ${booking.limitation}`);
      assert.equal(v["Currency basis"], booking.currencyBasis);
      assert.equal(v["Dated source"], sources[booking.source]);
      assert.match(v["Live comparison"], /#cabana-bay$/);
    } else {
      const [legacyHead, ...legacyRows] = parse(orlandoRateComparisonCsv());
      assert.deepEqual(row.slice(0, legacyHead.length), legacyRows[i - 2]);
      assert.match(v["Currency basis"], /USD displayed/);
      assert.match(v["Fee and acceptance limits"], /do not add that fee again.*Parking is extra/);
      assert.match(v["Deposit timing conflict"], /due at booking.*seven days/);
    }
  }
  assert.doesNotMatch(orlandoCombinedRateComparisonCsv(), /Disney's Art|1019\.25|1455\.75/);
});
test("combined CSV protects cells and never mutates shared records", () => {
  const before = JSON.stringify(suites);
  for (const prefix of ["=", "+", "-", "@", "  ="]) {
    const copy = structuredClone(suites[1]);
    copy.bookingRates.plans[0].plan = `${prefix}plan, "quoted"\nnext\ttab`;
    const [, row] = parse(orlandoCombinedRateComparisonCsv([copy]));
    assert.equal(row[7], `'${prefix}plan, "quoted" next tab`);
    assert.equal(row.length, 21);
  }
  orlandoCombinedRateComparisonCsv();
  assert.equal(JSON.stringify(suites), before);
});
test("native combined link and static asset match generation, legacy CSV remains separate", () => {
  const out = new Map();
  writeOrlandoSuitePage((p, value) => out.set(p, value));
  const html = orlandoSuitePage();
  assert.equal((html.match(/href="\.\.\/downloads\/orlando-dated-rates.csv" download/g) ?? []).length, 1);
  assert.match(html, /Download dated Cabana Bay and IHG rates \(CSV\)/);
  assert.equal(out.get(orlandoCombinedRateCsvPath), orlandoCombinedRateComparisonCsv());
  assert.equal(readFileSync(new URL(`../site/${orlandoCombinedRateCsvPath}`, import.meta.url), "utf8"), orlandoCombinedRateComparisonCsv());
  assert.equal(readFileSync(new URL("../site/downloads/orlando-ihg-dated-rates.csv", import.meta.url), "utf8"), orlandoRateComparisonCsv());
});

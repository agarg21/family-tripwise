import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { readableText, runTogetherTokens } from "./page-generation/readable-text.mjs";

const lodgingPages = [
  "where-to-stay/boston-family-hotels.html",
  "where-to-stay/washington-dc-family-hotels.html",
  "where-to-stay/cancun-family-resorts.html",
  "where-to-stay/puerto-vallarta-family-resorts.html",
  "where-to-stay/london-family-hotels.html",
  "where-to-stay/orlando-family-hotels.html"
];

const visibleText = html => html
  .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
  .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
  .replace(/<template\b[\s\S]*?<\/template>/gi, " ")
  .replace(/<[^>]+>/g, " ")
  .replace(/&nbsp;/g, " ")
  .replace(/&amp;/g, "&");

test("readableText only inserts spaces between glued words, numbers and currency codes", () => {
  const cases = [
    ["free cancellation before11:59PM local hotel time Nov5,2026; thereafter displayed872.21USDfee.",
      "free cancellation before 11:59 PM local hotel time Nov 5, 2026; thereafter displayed 872.21 USD fee."],
    ["exception may apply with25USDHomewoodservicefee, not free", "exception may apply with 25 USD Homewood service fee, not free"],
    ["scenario2adults/age4 within scope, ages8/12 not", "scenario 2 adults/age 4 within scope, ages 8/12 not"],
    ["free cancellation beforeOctober28,2026 at23:59; up to10days beforearrival", "free cancellation before October 28, 2026 at 23:59; up to 10 days before arrival"],
    ["Saver1286.25GBP accommodation plus257.25GBP INC20PC VAT", "Saver 1286.25 GBP accommodation plus 257.25 GBP INC20PC VAT"],
    ["min2nights15percentoffer observed", "min 2 nights 15 percent offer observed"],
    ["Details show15.95%per-room/night", "Details show 15.95% per-room/night"],
    ["Same card October28at23:59 versus children3to12", "Same card October 28 at 23:59 versus children 3 to 12"],
    ["15USDdailyfoodcredit(excludes roomservice), cards309(member)", "15 USD daily food credit (excludes room service), cards 309 (member)"]
  ];
  for (const [input, expected] of cases) {
    const output = readableText(input);
    assert.equal(output, expected);
    assert.equal(output.replace(/[\s-]/g, ""), input.replace(/[\s-]/g, ""), "only spacing (and check-in hyphen) may change");
  }
});

test("readableText leaves URLs, paths, identifiers and ordinary sentences unchanged", () => {
  for (const value of ["https://example.com/a1b2?x=USD5", "../shared/form.mjs?v=ft-imp093", "boston-park-plaza-deluxe-double",
    '{"adults":2}', "Two adults and children aged 4, 8 and 12; November 8-13, 2026.", "INC20PC", "USD 781.00"]) {
    assert.equal(readableText(value), value);
  }
});

test("lodging pages show no run-together number/word tokens in visible text", () => {
  for (const page of lodgingPages) {
    const html = readFileSync(new URL(`../site/${page}`, import.meta.url), "utf8");
    assert.deepEqual(runTogetherTokens(visibleText(html)), [], page);
  }
});

test("lodging CSV downloads get display spacing in text cells only; URLs, amounts and JSON records unchanged", async () => {
  const { readableComparisonCsv, labelOlderStaySamples, roomComparisonCsv, parseQuotedCsv, comparisonHeadings } = await import("./family-room-comparison.mjs");
  const generators = [
    ["boston-family-hotels.csv", "./page-generation/boston-family-hotels-page.mjs", "bostonPack", "bostonPrices"],
    ["washington-dc-family-hotels.csv", "./page-generation/washington-dc-family-hotels-page.mjs", "dcPack", "dcPrices"],
    ["puerto-vallarta-family-resorts.csv", "./page-generation/puerto-vallarta-family-resorts-page.mjs", "pvPack", "pvPrices"]
  ];
  for (const [file, module, packName, pricesName] of generators) {
    const mod = await import(module);
    const raw = labelOlderStaySamples(roomComparisonCsv(mod[packName], mod[packName].scenario, "2026-10-09", mod[pricesName]));
    const published = readFileSync(new URL(`../site/downloads/${file}`, import.meta.url), "utf8");
    assert.equal(published, readableComparisonCsv(raw), file);
    const [rawHead, ...rawRows] = parseQuotedCsv(raw);
    const [head, ...rows] = parseQuotedCsv(published);
    assert.deepEqual(head, rawHead);
    assert.equal(rows.length, rawRows.length);
    rows.forEach((row, r) => row.forEach((value, c) => {
      const before = rawRows[r][c];
      if (["Category source", "Price source"].includes(comparisonHeadings[c]) || !/\s/.test(before) || /^[{[]/.test(before) || /https?:/.test(before))
        assert.equal(value, before, `${file} ${comparisonHeadings[c]} must be unchanged`);
      else {
        // Only spaces may change, plus the two documented COMPOUNDS hyphens (all-fee, check-in).
        const norm = text => text.replace(/\s/g, "").replaceAll("all-fee", "allfee").replaceAll("check-in", "checkin");
        assert.equal(norm(value), norm(before), `${file} ${comparisonHeadings[c]} may change spacing only`);
      }
      if (!/^[{[]/.test(value)) assert.deepEqual(runTogetherTokens(value), [], `${file} ${comparisonHeadings[c]}`);
    }));
  }
});

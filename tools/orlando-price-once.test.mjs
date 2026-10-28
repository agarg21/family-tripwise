import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { stripSiteChrome } from "./page-generation/site-chrome.mjs";
import { orlandoSuitePage } from "./page-generation/orlando-suite-page.mjs";
import { suites } from "./page-generation/orlando-suite-data.mjs";
import { escapeHtml as e } from "./page-generation/orlando-suite-model.mjs";

const page = () => stripSiteChrome(orlandoSuitePage());
const visibleText = html => html
  .replace(/<script[\s\S]*?<\/script>/g, "")
  .replace(/<details class="how-checked">[\s\S]*?<\/details>/g, "")
  .replace(/<[^>]+>/g, " ")
  .replaceAll("&amp;", "&");

test("each dated Orlando amount appears once outside the collapsed How we checked blocks", () => {
  const text = visibleText(page());
  const amounts = text.match(/(?:USD|\$)\d[\d,]*(?:\.\d\d)?/g) ?? [];
  const counts = amounts.reduce((map, amount) => map.set(amount, (map.get(amount) ?? 0) + 1), new Map());
  for (const [amount, count] of counts) assert.equal(count, 1, `${amount} appears ${count} times on screen`);
  const plans = suites.flatMap(suite => suite.bookingRates ? suite.bookingRates.plans.map(p => [p, suite.bookingRates.nights]) : [suite.priceSample, suite.alternatePriceSample].filter(Boolean).map(p => [p, p.nights]));
  assert.equal(plans.length, 4);
  for (const [p, nights] of plans) {
    assert.ok(text.includes(`About USD${Math.round(p.estimatedTotal / nights)} per room/night`), p.plan);
    assert.ok(text.includes(`USD${p.estimatedTotal.toFixed(2)}`), p.plan);
  }
});

test("nightly samples sit in the comparison table, labelled by plan; stay totals sit with each suite", () => {
  const html = page();
  const table = html.match(/<section id="quick-compare">[\s\S]*?<\/section>/)[0];
  for (const suite of suites) {
    const row = table.match(new RegExp(`<tr><th scope="row">${e(suite.base)}[\\s\\S]*?</tr>`))[0];
    if (suite.bookingRates) for (const p of suite.bookingRates.plans) assert.ok(row.includes(`${e(p.plan)}: <strong>About USD${Math.round(p.estimatedTotal / suite.bookingRates.nights)} per room/night</strong>`), p.plan);
    else if (suite.priceSample) for (const p of [suite.priceSample, suite.alternatePriceSample]) assert.ok(row.includes(`${e(p.plan)}: <strong>About USD${Math.round(p.estimatedTotal / p.nights)} per room/night</strong>`), p.plan);
    else assert.match(row, /Not observed for this room, party and dates/);
  }
  assert.match(table, /older observations checked October 11, 2026 for November 8-13, 2026/);
  for (const suite of suites) {
    const article = html.match(new RegExp(`<article id="${suite.id}"[\\s\\S]*?</article>`))[0];
    const blocks = article.match(/<details class="how-checked">/g) ?? [];
    if (!suite.bookingRates && !suite.priceSample) { assert.equal(blocks.length, 0); assert.match(article, /quote has not been observed/); continue; }
    assert.equal(blocks.length, 1, suite.id);
    assert.ok(article.includes(`<summary>How we checked ${e(suite.name)}</summary>`));
    assert.ok(article.includes('href="#quick-compare"'));
    const how = article.match(/<details class="how-checked">([\s\S]*?)<\/details>/)[1];
    assert.match(how, /Taxes and extras:/);
    assert.match(how, /not refreshed during page assembly/);
    if (suite.bookingRates) for (const text of [suite.bookingRates.terms, suite.bookingRates.feeBasis, suite.bookingRates.currencyBasis, suite.bookingRates.limitation]) assert.ok(how.includes(e(text)));
    else for (const text of [suite.priceTerms.limitation, suite.priceTerms.depositConflict]) assert.ok(how.includes(e(text)));
  }
});

test("Orlando stylesheet styles the collapsed blocks and carries a cache version", () => {
  const html = orlandoSuitePage();
  assert.match(html, /orlando-suites\.css\?v=ft-q09c-orl/);
  const css = readFileSync(new URL("../site/orlando-suites.css", import.meta.url), "utf8");
  assert.ok(css.includes(".orlando-page .how-checked > summary { cursor:pointer; min-height:44px;"));
});

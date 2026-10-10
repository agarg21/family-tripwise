import assert from "node:assert/strict";
import { cpSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { upgradePriorityPages } from "./upgrade-priority-pages.mjs";
import { summitPolicyEvidence } from "./nyc-summit-policy.mjs";
import { teenPages } from "./page-generation/upgrade-page-data.mjs";
import { momaComparison } from "./nyc-moma-budget.mjs";
import { ferryComparison } from "./nyc-ferry-budget.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const target = "things-to-do/new-york-city-with-teens.html";

test("budget deep-link headings reserve space below desktop fixed navigation", () => {
  const html = readFileSync(join(root, "site", target), "utf8");
  for (const id of ["moma-budget-title", "ferry-budget-title"]) {
    assert.equal((html.match(new RegExp(`id="${id}"`, "g")) || []).length, 1);
    assert.ok(html.includes(`<h2 id="${id}" style="scroll-margin-top:128px">`));
  }
  assert.equal((html.match(/<h2[^>]*style="scroll-margin-top:128px"/g) || []).length, 2);
});

function schemas(html) {
  return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]));
}

function filesUnder(directory, base = directory) {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    return statSync(path).isDirectory() ? filesUnder(path, base) : [relative(base, path)];
  });
}

test("keeps one canonical, indexable ten-choice New York City teen page", () => {
  const html = readFileSync(join(root, "site", target), "utf8");
  const sitemap = readFileSync(join(root, "site", "sitemap.xml"), "utf8");
  const names = [
    "SUMMIT One Vanderbilt",
    "Museum of the Moving Image",
    "SPYSCAPE or SPYGAMES",
    "Intrepid Museum",
    "MoMA",
    "Tenement Museum, one exact tour",
    "One selected Broadway show",
    "Yankee Stadium classic tour or selected game",
    "High Line and Chelsea, one bounded segment",
    "NYC Ferry to DUMBO / Brooklyn Bridge Park"
  ];

  assert.match(html, /<title>Things to Do in New York City With Teens: 10 Picks by Trip Style<\/title>/);
  assert.match(html, /<h1>Things to Do in New York City With Teens: 10 Picks by Trip Style<\/h1>/);
  assert.match(html, /<link rel="canonical" href="https:\/\/familytripwise\.com\/things-to-do\/new-york-city-with-teens\.html">/);
  assert.doesNotMatch(html, /<meta[^>]+name="robots"[^>]+noindex/i);
  assert.equal((sitemap.match(/https:\/\/familytripwise\.com\/things-to-do\/new-york-city-with-teens\.html/g) || []).length, 1);
  assert.match(html, /Attraction facts and official sources checked:<\/strong> July 26, 2026/);
  for (const name of names) assert.ok(html.includes(name), `missing ${name}`);
  assert.equal((html.match(/<tbody>[\s\S]*?<\/tbody>/)?.[0].match(/<tr>/g) || []).length, 10);
});

test("uses a compact teen-choice flow with mixed-age and current-decision support", () => {
  const html = readFileSync(join(root, "site", target), "utf8");

  assert.equal((html.match(/<article class="quick-pick">/g) || []).length, 5);
  assert.equal((html.match(/<article class="detail-card">/g) || []).length, 5);
  assert.equal((html.match(/<article class="plan-card">/g) || []).length, 3);
  assert.match(html, /Five choices that need an exact decision/);
  assert.match(html, /Teen reason/);
  assert.match(html, /teen choose one anchor/i);
  assert.match(html, /mixed-age/i);
  assert.match(html, /class="comparison-scroll teen-comparison"/);
  assert.match(html, /Set your family's supervision boundaries and check the exact outbound and return route/);
  assert.doesNotMatch(html, /<h4>Pair nearby<\/h4><p>(?:undefined)?<\/p>/);
  assert.doesNotMatch(html, /<p>undefined<\/p>/);
  assert.doesNotMatch(html, /Best overall|Best-fit activities for teens|More independence, fewer little-kid compromises/i);
  assert.doesNotMatch(html, /personally stayed|personally visited|personally verified|safe neighborhood/i);
});

test("aligns visible FAQ, schema, official checks, sources, and cluster routes", () => {
  const html = readFileSync(join(root, "site", target), "utf8");
  const blocks = schemas(html);
  const itemList = blocks.find((block) => block["@type"] === "ItemList");
  const faq = blocks.find((block) => block["@type"] === "FAQPage");

  assert.equal(itemList.itemListElement.length, 10);
  assert.equal(faq.mainEntity.length, 3);
  assert.equal((html.match(/<article class="activity-card faq-card">/g) || []).length, 3);
  const visible = html.slice(0, html.indexOf('<script type="application/ld+json">'));
  for (const question of faq.mainEntity.map((item) => item.name)) {
    assert.ok(visible.includes(`<h3>${question}</h3>`), `FAQ is not visible: ${question}`);
  }

  for (const required of [
    "Growler requires a 40-inch minimum",
    "Under-16 accompaniment",
    "16 and under free",
    "movingimage.org/education/game-design-lab/",
    "summitov.com/ticketterms/",
    "new-york-city-family-hotels.html",
    "new-york-city-with-kids.html",
    "family-itinerary/new-york-city-with-kids.html",
    "Central_Park_New_York_City_New_York_23_cropped.jpg"
  ]) assert.match(html, new RegExp(required));
});

test("SUMMIT shared policy answers split visits in visible and structured outputs without general fact renewal", () => {
  const html=readFileSync(join(root,"site",target),"utf8"),page=teenPages[target],copy=summitPolicyEvidence.public_copy;
  assert.equal(page.rows[0][5],copy.comparison_check);assert.equal(page.details[0][4],copy.detail_check);
  assert.equal(page.officialChecks[0][1],copy.official_check);assert.equal(page.faqs[2][1],copy.faq);
  for(const text of Object.values(copy)) assert.ok(html.includes(text.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;')),text);
  assert.equal(schemas(html).find(s=>s['@type']==='FAQPage').mainEntity[2].acceptedAnswer.text,copy.faq);
  assert.match(html,/July 26, 2026/);assert.match(html,/policy checked October 10, 2026/);
  assert.doesNotMatch(html,/16 and older can enter independently|17-year-old qualifies as an adult|adult must be 18/i);
});

test("MoMA admission-only party totals, conditional ID and ticket-preserving breaks are discoverable without JS", () => {
 const html=readFileSync(join(root,"site",target),"utf8"),start=html.indexOf('<!-- moma-admission:start -->'),end=html.indexOf('<!-- moma-admission:end -->');
 assert.ok(start>html.indexOf('Teen activity decision table'));assert.ok(end>start);
 const block=html.slice(start,end),comparison=momaComparison();
 assert.match(block,/tabindex="0" role="region" aria-label="MoMA family admission comparison"/);
 assert.equal((block.match(/<tr>/g)||[]).length,4);assert.equal((block.match(/scope="col"/g)||[]).length,3);
 assert.equal((block.match(/role="rowheader"/g)||[]).length,3);
 for(const row of comparison.rows)for(const cell of row)assert.ok(block.includes(cell));
 assert.match(block,/not checkout totals/);assert.match(block,/full-time students with ID/);assert.match(block,/Free child admission still needs a ticket/);assert.match(block,/same day if you retain your ticket/);
 assert.doesNotMatch(block,/<script|student admission guaranteed|rest guaranteed|final checkout total/i);
 assert.match(html,/July 26, 2026/);assert.match(html,/SUMMIT minor policy checked October 10, 2026/);
});

test("NYC Ferry fare dates and return budgets are no-JS, accessible and not discount or future-checkout assurances",()=>{
 const html=readFileSync(join(root,"site",target),"utf8"),start=html.indexOf('<!-- ferry-budget:start -->'),end=html.indexOf('<!-- ferry-budget:end -->'),b=html.slice(start,end),c=ferryComparison();
 assert.ok(start>html.indexOf('<!-- moma-admission:end -->'));assert.ok(end>start);assert.match(b,/tabindex="0" role="region" aria-label="NYC Ferry family fare comparison"/);assert.equal((b.match(/<tr>/g)||[]).length,3);assert.equal((b.match(/scope="col"/g)||[]).length,4);assert.equal((b.match(/role="rowheader"/g)||[]).length,2);
 for(const row of c.rows)for(const cell of row)assert.ok(b.includes(cell));for(const source of c.sources)assert.ok(b.includes(source));
 assert.match(b,/Announced from October 19, 2026/);assert.match(b,/not an observed future checkout price/);assert.match(b,/not a return trip/);assert.match(b,/not checkout totals or the cheapest/);assert.match(b,/all over 44 inches/);assert.match(b,/older USD 4.00/);assert.doesNotMatch(b,/<script|free return|student fare guaranteed|boarding guaranteed/i);assert.match(html,/July 26, 2026/);assert.match(html,/MoMA: teen ages change/);
});

test("routes from the all-ages page and home while preserving one sitemap URL", () => {
  const home = readFileSync(join(root, "site", "index.html"), "utf8");
  const allAges = readFileSync(join(root, "site", "things-to-do/new-york-city-with-kids.html"), "utf8");
  const sitemap = readFileSync(join(root, "site", "sitemap.xml"), "utf8");

  assert.match(home, /href="\.\/things-to-do\/new-york-city-with-teens\.html"/);
  assert.match(allAges, /href="\.\/new-york-city-with-teens\.html"/);
  assert.match(allAges, /Use the specialist when an older child should choose/);
  assert.equal((sitemap.match(/new-york-city-with-teens\.html/g) || []).length, 1);
});

test("keeps the seven-column comparison readable in the mobile scroller", () => {
  const html = readFileSync(join(root, "site", target), "utf8");
  const css = readFileSync(join(root, "site", "styles.css"), "utf8");
  const table = html.match(/<div class="comparison-scroll teen-comparison">([\s\S]*?)<\/table>/)?.[1] || "";

  assert.equal((table.match(/<th>/g) || []).length, 7);
  assert.equal((table.match(/<tr>/g) || []).length, 11);
  assert.match(css, /\.teen-comparison \.comparison-table \{[\s\S]*?min-width: 820px/);
  assert.match(css, /\.teen-comparison \.comparison-table th:first-child,[\s\S]*?position: sticky/);
});

test("priority regeneration is idempotent and changes no unrelated site file", () => {
  const temp = mkdtempSync(join(tmpdir(), "family-tripwise-nyc-teen-"));
  const copy = join(temp, "site");
  cpSync(join(root, "site"), copy, { recursive: true });

  try {
    const before = new Map(filesUnder(copy).map((path) => [path, readFileSync(join(copy, path))]));
    upgradePriorityPages(copy);
    const after = new Map(filesUnder(copy).map((path) => [path, readFileSync(join(copy, path))]));
    assert.deepEqual(after, before);
  } finally {
    rmSync(temp, { recursive: true, force: true });
  }
});

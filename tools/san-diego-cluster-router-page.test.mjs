import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import assert from "node:assert/strict";

const root = fileURLToPath(new URL("../", import.meta.url));
const pagePath = join(root, "site", "things-to-do", "san-diego-with-kids.html");
const html = readFileSync(pagePath, "utf8");

test("keeps the San Diego all-ages activities page canonical, indexable, and in the sitemap", () => {
  const sitemap = readFileSync(join(root, "site", "sitemap.xml"), "utf8");

  assert.match(html, /<link rel="canonical" href="https:\/\/familytripwise\.com\/things-to-do\/san-diego-with-kids\.html">/);
  assert.doesNotMatch(html, /<meta[^>]+name=["']robots["'][^>]+noindex/i);
  assert.equal((sitemap.match(/https:\/\/familytripwise\.com\/things-to-do\/san-diego-with-kids\.html/g) || []).length, 1);
  assert.match(html, /<title>Things to Do in San Diego With Kids: Age, Stroller, Rain and Nap Guide<\/title>/);
  assert.match(html, /<h1>Things to do in San Diego with kids<\/h1>/);
  assert.match(html, /Last updated:<\/strong> July 20, 2026/);
});

test("routes research-derived personas to the relevant San Diego cluster pages", () => {
  for (const persona of [
    "First-time family",
    "Toddler, nap, or stroller-sensitive family",
    "Teen or tween family",
    "Lodging-led planner",
    "Rainy, free, or budget planner"
  ]) {
    assert.match(html, new RegExp(persona.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  for (const href of [
    "../family-itinerary/san-diego-with-kids.html",
    "./san-diego-with-toddlers.html",
    "./san-diego-with-teens.html",
    "../where-to-stay/san-diego-with-kids.html",
    "../where-to-stay/san-diego-family-hotels.html"
  ]) {
    assert.match(html, new RegExp(href.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  assert.match(html, /This is the all-ages activity hub/);
  assert.match(html, /Start with your family constraint/);
  assert.match(html, /San Diego cluster router/);
});

test("adds official rainy-day, free, budget, and beach-status checks without stale guarantees", () => {
  assert.match(html, /Rain and budget checks/);
  assert.match(html, /Verify current offers and backup plans before building around them/);
  assert.match(html, /https:\/\/www\.sandiego\.org\/c\/kids-free/);
  assert.match(html, /https:\/\/sandiegomuseumcouncil\.org\/specials\/kidsfree\//);
  assert.match(html, /https:\/\/www\.sandiegocounty\.gov\/content\/sdc\/deh\/lwqd\/beachandbay\.html/);
  assert.match(html, /date-specific checks, not evergreen guarantees/);
  assert.doesNotMatch(html, /kids (?:eat|stay|play) for free all October/i);
});

test("keeps trust boundaries clear for route, stroller, safety, quiet, and family-fit claims", () => {
  for (const blocked of [
    /safest/i,
    /quietest/i,
    /guaranteed/i,
    /personally verified/i,
    /water-safe/i,
    /Best stroller-friendly/i,
    /firm family-fit/i
  ]) {
    assert.doesNotMatch(html, blocked);
  }

  assert.match(html, /Verify the exact paved route/);
  assert.match(html, /verify current hours, timed-entry rules, parking/);
});

import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import test from "node:test";
import { contributorCredit, milesProfilePage, milesContributor } from "./page-generation/contributors.mjs";

const sitemap = readFileSync("site/sitemap.xml", "utf8");
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
const guides = urls.filter(url => /\/(where-to-stay|things-to-do|family-itinerary)\//.test(url));

test("all 28 guides have one disclosed AI credit immediately after their title", () => {
  assert.equal(guides.length, 28);
  for (const url of guides) {
    const path = `site${new URL(url).pathname}`;
    const html = readFileSync(path, "utf8");
    assert.equal(html.split(contributorCredit()).length - 1, 1, path);
    assert.ok(html.includes(`</h1>\n`), path);
    assert.match(html, /<\/h1>\s*<p class="contributor-credit">AI research contributor:/, path);
    assert.ok(existsSync(resolve(dirname(path), `../${milesContributor.path}`)), path);
  }
});

test("Miles profile is generated, linked and honest about AI and historical attribution", () => {
  const html = readFileSync(`site/${milesContributor.path}`, "utf8");
  assert.equal(html, milesProfilePage());
  assert.match(html, /rel="canonical" href="https:\/\/familytripwise.com\/contributors\/miles-rowan.html"/);
  assert.match(html, /<h1 id="profile-name">Miles Rowan<\/h1>/);
  assert.match(html, /AI research contributor &middot; not a human traveler/);
  assert.match(html, /no personal hotel stays/);
  assert.match(html, /does not claim Miles originally authored every sentence/);
  assert.match(html, /not human review, fieldwork, or a guarantee/);
  assert.match(html, /href="..\/about.html#apoorva-garg"/);
  assert.doesNotMatch(html, /"@type"\s*:\s*"Person"|noindex/);
});

test("supporting profile inventory is complete without attributing non-guide pages", () => {
  const inventory = JSON.parse(readFileSync("ops/gsc-monitor.json", "utf8"));
  assert.equal(urls.length, 31);
  assert.deepEqual([...urls].sort(), [...inventory.urls].sort());
  assert.equal(urls.filter(url => url.endsWith(`/${milesContributor.path}`)).length, 1);
  for (const path of ["index.html", "about.html", milesContributor.path]) {
    assert.ok(!readFileSync(`site/${path}`, "utf8").includes(contributorCredit()), path);
  }
});

import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const origin = "https://familytripwise.com";
const read = path => readFileSync(new URL(`../site/${path}`, import.meta.url), "utf8");
const urls = [...read("sitemap.xml").matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
const normalize = url => url.replace(/\/index\.html$/, "/");
const links = (html, base) => [...html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)]
  .map(match => new URL(match[1], base)).filter(url => url.origin === origin)
  .map(url => normalize(`${url.origin}${url.pathname}`));

test("all canonical pages have another canonical page linking to them and are reachable from home", () => {
  const graph = new Map(urls.map(url => [url, links(read(new URL(url).pathname.slice(1) || "index.html"), url)]));
  for (const url of urls) assert.ok([...graph].some(([from, to]) => from !== url && to.includes(url)), `Orphan: ${url}`);
  const seen = new Set([`${origin}/`]);
  const queue = [...seen];
  for (const url of queue) for (const next of graph.get(url) ?? []) {
    if (graph.has(next) && !seen.has(next)) { seen.add(next); queue.push(next); }
  }
  assert.equal(seen.size, urls.length);
});

test("homepage primary directory distinguishes eight destinations and links all hotel comparisons", () => {
  const home = read("index.html");
  const directory = home.split('id="destinations"')[1].split("</section>")[0];
  assert.equal((directory.match(/<article /g) ?? []).length, 8);
  for (const slug of ["san-diego", "las-vegas", "new-york-city", "chicago", "san-antonio", "orlando", "washington-dc"]) {
    assert.ok(directory.includes(`where-to-stay/${slug}-family-hotels.html`));
  }
  assert.ok(directory.includes("where-to-stay/cancun-family-resorts.html"));
  assert.match(home, /Cancun, Orlando and Washington DC currently focus on family lodging comparisons/);
  assert.doesNotMatch(home, /Five active destination clusters/);
});

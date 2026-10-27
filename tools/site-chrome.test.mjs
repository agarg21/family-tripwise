import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, dirname, posix } from "node:path";
import { fileURLToPath } from "node:url";
import { destinations, allGuidePaths } from "./page-generation/site-chrome.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const site = join(root, "site");
const base = "https://familytripwise.com/";
const sitemap = readFileSync(join(site, "sitemap.xml"), "utf8");
const sitemapPaths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].slice(base.length) || "index.html");

function htmlFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? htmlFiles(full) : name.endsWith(".html") ? [full] : [];
  });
}

function resolveHref(href, fromPath) {
  const clean = href.split("#")[0].split("?")[0];
  if (!clean || /^[a-z]+:/i.test(clean)) return clean.startsWith(base) ? clean.slice(base.length) || "index.html" : null;
  const resolved = clean.startsWith("/") ? clean.slice(1) : posix.normalize(posix.join(posix.dirname(fromPath), clean));
  return resolved === "" || resolved === "." ? "index.html" : resolved;
}

const pages = Object.fromEntries(htmlFiles(site).map((f) => [relative(site, f).split("\\").join("/"), readFileSync(f, "utf8")]));

test("every guide in the sitemap is registered once in the shared chrome", () => {
  const guides = sitemapPaths.filter((p) => !["index.html", "about.html", "contributors/miles-rowan.html"].includes(p));
  assert.deepEqual([...allGuidePaths].sort(), [...guides].sort());
  assert.equal(new Set(allGuidePaths).size, allGuidePaths.length);
});

test("every sitemap page carries the one shared header reaching all destinations", () => {
  for (const path of sitemapPaths) {
    const html = pages[path];
    assert.ok(html, path);
    const headers = html.match(/<header class="site-header">[\s\S]*?<\/header>/g) || [];
    assert.equal(headers.length, 1, path);
    const targets = new Set([...headers[0].matchAll(/href="([^"]+)"/g)].map((m) => resolveHref(m[1], path)));
    for (const d of destinations) assert.ok(targets.has(d.guides[0][0]), `${path} header misses ${d.name}`);
  }
});

test("every sitemap URL has at least 3 internal inbound links from other pages", () => {
  const inbound = Object.fromEntries(sitemapPaths.map((p) => [p, new Set()]));
  for (const [from, html] of Object.entries(pages)) {
    for (const m of html.matchAll(/<a\b[^>]*href="([^"]+)"/g)) {
      const to = resolveHref(m[1], from);
      if (to && inbound[to] && to !== from) inbound[to].add(from);
    }
  }
  for (const [path, set] of Object.entries(inbound)) assert.ok(set.size >= 3, `${path} has ${set.size} inbound pages`);
});

test("each guide lists its destination's other guides, and hotel lists link itinerary and stay areas", () => {
  for (const d of destinations) {
    for (const [path] of d.guides) {
      const html = pages[path];
      const related = html.match(/<nav class="related-guides"[\s\S]*?<\/nav>/);
      assert.ok(related, `${path} lacks related guides`);
      const targets = new Set([...related[0].matchAll(/href="([^"]+)"/g)].map((m) => resolveHref(m[1], path)));
      for (const [other] of d.guides) if (other !== path) assert.ok(targets.has(other), `${path} misses ${other}`);
      if (/family-(hotels|resorts)\.html$/.test(path)) {
        for (const [other] of d.guides.filter(([p]) => /family-itinerary\/|where-to-stay\/[^/]+-with-kids\.html$/.test(p))) {
          assert.ok(targets.has(other), `${path} hotel list misses ${other}`);
        }
      }
    }
  }
});

test("every internal link in the shared chrome points at an existing page", () => {
  for (const [path, html] of Object.entries(pages)) {
    const chrome = (html.match(/<header class="site-header">[\s\S]*?<\/header>|<nav class="related-guides"[\s\S]*?<\/nav>|<footer class="site-footer">[\s\S]*?<\/footer>/g) || []).join("");
    for (const m of chrome.matchAll(/href="([^"]+)"/g)) {
      const to = resolveHref(m[1], path);
      if (to) assert.ok(pages[to], `${path} chrome links missing ${to}`);
    }
  }
});

test("every page with the shared header opens with one skip link to its single <main id=\"main\">", () => {
  for (const [path, html] of Object.entries(pages)) {
    if (!html.includes('<header class="site-header">')) continue;
    assert.equal((html.match(/<a class="skip-link" href="#main">[^<]+<\/a><header class="site-header">/g) || []).length, 1, `${path} skip link`);
    assert.equal((html.match(/class="skip-link"/g) || []).length, 1, `${path} has a duplicate skip link`);
    assert.equal((html.match(/<main\b/g) || []).length, 1, `${path} main count`);
    assert.match(html, /<main id="main"[\s>]/, `${path} main id`);
    assert.equal((html.match(/\bid="main"/g) || []).length, 1, `${path} duplicate id="main"`);
  }
});

test("shared chrome styles outrank page stylesheets' h2/ul/li rules and align with each layout", () => {
  const css = readFileSync(join(site, "styles.css"), "utf8");
  for (const selector of ["body .related-guides h2", "body .related-guides ul", "body .related-guides li", ".site-footer .guide-directory h2", ".site-footer .guide-directory ul", ".site-footer .guide-directory li"]) {
    assert.ok(css.includes(`${selector} {`), selector);
  }
  assert.doesNotMatch(css, /^\.related-guides (h2|ul|li) \{/m, "unprefixed related-guides rules lose to page h2/ul rules");
  for (const [file, cls] of [["washington-dc-comparison.css", "dc-page"], ["orlando-suites.css", "orlando-page"], ["cancun-resorts.css", "cancun-page"]]) {
    assert.match(readFileSync(join(site, file), "utf8"), new RegExp(`\\.${cls} \\.related-guides \\{ ?width:`), file);
  }
  assert.match(css, /\.london-page \.related-guides \{ width:/);
});

// The privacy policy makes factual claims about the built site; these tests keep them true.
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { embeddedHosts, privacyPage, termsPage, contactEmail } from "./page-generation/legal-pages.mjs";

const site = new URL("../site/", import.meta.url).pathname;
function files(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) files(full, out);
    else if (/\.(html|js|mjs|css)$/.test(name)) out.push(full);
  }
  return out;
}
const all = Object.fromEntries(files(site).map((f) => [relative(site, f).split("\\").join("/"), readFileSync(f, "utf8")]));
const html = Object.entries(all).filter(([p]) => p.endsWith(".html"));
const code = Object.entries(all).filter(([p]) => /\.(m?js)$/.test(p)).concat(html.map(([p, h]) => [p, [...h.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]).join("\n")]));

test("committed legal pages match the generator", () => {
  assert.equal(all["privacy.html"], privacyPage());
  assert.equal(all["terms.html"], termsPage());
});

test("both pages are in the sitemap, canonical, indexable and linked from every page's footer", () => {
  const sitemap = readFileSync(join(site, "sitemap.xml"), "utf8");
  for (const page of ["privacy.html", "terms.html"]) {
    assert.match(sitemap, new RegExp(`<loc>https://familytripwise\\.com/${page.replace(".", "\\.")}</loc>`));
    assert.match(all[page], new RegExp(`rel="canonical" href="https://familytripwise\\.com/${page.replace(".", "\\.")}"`));
    assert.doesNotMatch(all[page], /noindex/);
    assert.match(all[page], new RegExp(contactEmail.replace(".", "\\.")));
  }
  for (const [path, page] of html) {
    const footer = page.match(/<footer class="site-footer">[\s\S]*?<\/footer>/);
    if (!footer) continue;
    assert.match(footer[0], /href="(\.\/|\.\.\/)*privacy\.html"/, `${path} footer lacks Privacy`);
    assert.match(footer[0], /href="(\.\/|\.\.\/)*terms\.html"/, `${path} footer lacks Terms`);
  }
});

test("privacy claim: the site sets no cookies or browser storage and runs no analytics or beacons", () => {
  for (const [path, source] of code) {
    assert.doesNotMatch(source, /document\.cookie|localStorage|sessionStorage|indexedDB|sendBeacon|XMLHttpRequest|\bfetch\s*\(|gtag\(|googletagmanager|google-analytics|plausible\.io|fbq\(|connect\.facebook\.net/, path);
  }
  for (const [path, page] of html) {
    assert.doesNotMatch(page, /<script\b[^>]*src="https?:\/\//, `${path} loads a third-party script`);
  }
});

test("privacy claim: planning forms are client-side only (no action, no POST)", () => {
  for (const [path, page] of html) {
    for (const form of page.match(/<form\b[^>]*>/g) || []) {
      assert.doesNotMatch(form, /\baction=|method="post"/i, `${path}: ${form}`);
    }
  }
});

test("privacy claim: every third-party host the site embeds content from is named in the policy", () => {
  const embedded = new Map();
  for (const [path, page] of html) {
    for (const m of page.matchAll(/<(?:img|iframe|script|source|video|audio|link)\b[^>]*\b(?:src|srcset|href)="(https?:\/\/[^"/]+)/g)) {
      const tag = m[0].match(/^<(\w+)/)[1];
      if (tag === "link" && !/rel="(stylesheet|preload|icon)"/.test(m[0])) continue;
      const host = new URL(m[1]).host;
      if (host === "familytripwise.com") continue;
      if (!embedded.has(host)) embedded.set(host, new Set());
      embedded.get(host).add(path);
    }
  }
  const privacy = all["privacy.html"];
  for (const [host, pages] of embedded) {
    const anchor = embeddedHosts[host];
    assert.ok(anchor, `${host} is embedded on ${[...pages].join(", ")} but not covered by the privacy policy`);
    assert.match(privacy, new RegExp(`id="${anchor}"`));
  }
  // The policy names the one page with a Google map; keep that true.
  assert.deepEqual([...(embedded.get("www.google.com") || [])], ["where-to-stay/san-diego-family-hotels.html"]);
});

test("terms make no booking, commission or firsthand claims the site contradicts", () => {
  const terms = all["terms.html"];
  assert.match(terms, /do not sell travel, take bookings or payments/);
  assert.match(terms, /not based on firsthand visits/);
  for (const [path, page] of html) {
    assert.doesNotMatch(page, /rel="[^"]*sponsored|affiliate/i, `${path} has an affiliate or sponsored link; update the terms`);
  }
});

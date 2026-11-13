// R1 step 8 (review #16): what search engines see, checked before and after each deploy. No network in these tests.
import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  approvedUrls, checkLocal, compareAfterDeploy, compareBeforeDeploy, describe, parseRobots, readHead, robotsBlocks, sitemapUrls
} from "./indexability-check.mjs";

const O = "https://familytripwise.com";
const page = (path, extraHead = "") => `<!doctype html><html><head><title>x</title><link rel="canonical" href="${O}${path}">${extraHead}</head><body>ok</body></html>`;
const sitemap = (paths) => `<urlset>${paths.map((p) => `<url><loc>${O}${p}</loc></url>`).join("")}</urlset>`;
const robotsOk = `User-agent: *\nAllow: /\n\nSitemap: ${O}/sitemap.xml\n`;

function fixture(files) {
  const dir = mkdtempSync(join(tmpdir(), "ft-index-"));
  for (const [path, body] of Object.entries(files)) {
    mkdirSync(join(dir, path, ".."), { recursive: true });
    writeFileSync(join(dir, path), body);
  }
  return dir;
}

function liveFrom(files) {
  const pages = new Map();
  for (const url of sitemapUrls(files["sitemap.xml"])) {
    let p = new URL(url).pathname;
    if (p.endsWith("/")) p += "index.html";
    const body = files[p.slice(1)];
    pages.set(url, body === undefined ? { status: 404, html: "" } : { status: 200, html: body });
  }
  return { robotsTxt: files["robots.txt"], sitemapXml: files["sitemap.xml"], pages };
}

const base = {
  "robots.txt": robotsOk,
  "sitemap.xml": sitemap(["/", "/deals/", "/deals/a.html"]),
  "index.html": page("/"),
  "deals/index.html": page("/deals/"),
  "deals/a.html": page("/deals/a.html")
};

test("readHead finds robots/googlebot noindex and canonicals in <head> only", () => {
  const h = readHead(`<head><meta content="NOINDEX, follow" name="googlebot"><link href="${O}/x" rel="canonical"></head><body><meta name="robots" content="noindex"></body>`);
  assert.equal(h.noindex, true);
  assert.deepEqual(h.canonicals, [`${O}/x`]);
  assert.equal(readHead(`<head><meta name="robots" content="max-image-preview:large"></head>`).noindex, false);
  assert.equal(readHead(`<head><meta name="robots" content="none"></head>`).noindex, true);
  assert.equal(readHead(`<head><meta name="robots" content="index, max-image-preview:none"></head>`).noindex, false);
  assert.equal(readHead(`<head><meta data-name="robots" content="noindex"></head>`).noindex, false);
});

test("robots.txt rules: longest match wins, Allow wins ties, googlebot group overrides *", () => {
  const rules = parseRobots("User-agent: *\nDisallow: /deals/\nAllow: /deals/a.html\nDisallow: /*.json$\n");
  assert.equal(robotsBlocks(rules, `${O}/deals/b.html`), true);
  assert.equal(robotsBlocks(rules, `${O}/deals/a.html`), false);
  assert.equal(robotsBlocks(rules, `${O}/release.json`), true);
  assert.equal(robotsBlocks(rules, `${O}/`), false);
  assert.equal(robotsBlocks(parseRobots("User-agent: *\nDisallow:\n"), `${O}/x`), false);
  assert.equal(robotsBlocks(parseRobots("User-agent: *\nDisallow: /\nUser-agent: Googlebot\nAllow: /\n"), `${O}/x`), false);
});

test("describe lists every reason a URL is not indexable", () => {
  const rec = describe(`${O}/a`, { status: 200, html: page("/b", `<meta name="robots" content="noindex">`) }, parseRobots("User-agent: *\nDisallow: /a\n"));
  assert.equal(rec.indexable, false);
  assert.equal(rec.reasons.length, 3);
  assert.equal(describe(`${O}/a`, { status: 404, html: "" }, []).reasons[0], "status 404");
  const two = describe(`${O}/a`, { status: 200, html: `<head><link rel="canonical" href="${O}/a"><link rel="canonical" href="${O}/a"></head>` }, []);
  assert.match(two.reasons[0], /2 canonicals/);
});

test("checkLocal: the committed site's sitemap URLs are all indexable and robots.txt names the sitemap", () => {
  const result = checkLocal(new URL("../site", import.meta.url).pathname);
  assert.deepEqual(result.errors, []);
  assert.ok(result.urls.length > 40);
});

test("checkLocal flags noindex, a foreign canonical, a missing file and robots.txt without the sitemap", () => {
  const dir = fixture({
    ...base,
    "robots.txt": "User-agent: *\nAllow: /\n",
    "deals/index.html": page("/deals/", `<meta name="robots" content="noindex, follow">`),
    "deals/a.html": page("/"),
    "sitemap.xml": sitemap(["/", "/deals/", "/deals/a.html", "/gone.html"])
  });
  const { errors } = checkLocal(dir);
  assert.equal(errors.length, 4);
  assert.match(errors.join("\n"), /robots\.txt does not name/);
  assert.match(errors.join("\n"), /deals\/ .*noindex/);
  assert.match(errors.join("\n"), /a\.html .*canonical https:\/\/familytripwise\.com\//);
  assert.match(errors.join("\n"), /gone\.html .*status 404/);
});

test("before deploy: an indexable live URL turning noindex fails unless an owner-approved entry covers it", () => {
  const live = liveFrom(base);
  const dir = fixture({ ...base, "deals/a.html": page("/deals/a.html", `<meta name="robots" content="noindex">`) });
  const local = { ...checkLocal(dir), siteDir: dir };
  const r = compareBeforeDeploy(local, live);
  assert.equal(r.errors.length, 1);
  assert.match(r.errors[0], /a\.html is indexable live but would not be/);
  assert.deepEqual(compareBeforeDeploy(local, live, new Set([`${O}/deals/a.html`])).errors, []);
});

test("before deploy: a robots.txt Disallow or a deleted page is caught for live URLs even when they leave the sitemap", () => {
  const live = liveFrom(base);
  const blocked = fixture({ ...base, "robots.txt": `User-agent: *\nDisallow: /deals/\n\nSitemap: ${O}/sitemap.xml\n` });
  const r1 = compareBeforeDeploy({ ...checkLocal(blocked), siteDir: blocked }, live);
  assert.equal(r1.errors.length, 2);
  assert.ok(r1.notes.includes("robots.txt changes in this deploy"));
  const removedFiles = { ...base, "sitemap.xml": sitemap(["/", "/deals/"]) };
  delete removedFiles["deals/a.html"];
  const removed = fixture(removedFiles);
  const r2 = compareBeforeDeploy({ ...checkLocal(removed), siteDir: removed }, live);
  assert.equal(r2.errors.length, 1);
  assert.match(r2.errors[0], /a\.html .*status 404/);
});

test("before deploy: an ended deal that only leaves the sitemap is a warning; new URLs are notes", () => {
  const live = liveFrom(base);
  const dir = fixture({ ...base, "sitemap.xml": sitemap(["/", "/deals/", "/deals/b.html"]), "deals/b.html": page("/deals/b.html") });
  const r = compareBeforeDeploy({ ...checkLocal(dir), siteDir: dir }, live);
  assert.deepEqual(r.errors, []);
  assert.equal(r.warnings.length, 1);
  assert.match(r.warnings[0], /a\.html leaves the sitemap but stays indexable/);
  assert.ok(r.notes.some((n) => /b\.html joins the sitemap/.test(n)));
});

test("after deploy: production must match the build (sitemap, robots.txt, status, robots meta, canonical)", () => {
  const dir = fixture(base);
  const local = { ...checkLocal(dir), siteDir: dir };
  assert.deepEqual(compareAfterDeploy(local, liveFrom(base)).errors, []);
  const stale = liveFrom({ ...base, "deals/a.html": page("/deals/old.html") });
  assert.match(compareAfterDeploy(local, stale).errors.join("\n"), /a\.html live canonical/);
  const short = liveFrom({ ...base, "sitemap.xml": sitemap(["/"]) });
  assert.match(compareAfterDeploy(local, short).errors.join("\n"), /live sitemap lists 1 URLs, the build 3/);
});

test("approved entries need an OWNER D row and stop counting after their until date", () => {
  const { ok, errors } = approvedUrls([
    { url: `${O}/a`, owner_row: "D47", until: "2026-11-20" },
    { url: `${O}/b`, owner_row: "D47", until: "2026-11-01" },
    { url: `${O}/c`, until: "2026-12-01" }
  ], "2026-11-13");
  assert.deepEqual([...ok], [`${O}/a`]);
  assert.equal(errors.length, 1);
  const committed = JSON.parse(readFileSync(new URL("./indexability-approved.json", import.meta.url), "utf8"));
  assert.deepEqual(approvedUrls(committed.changes, "2026-11-13").errors, []);
});

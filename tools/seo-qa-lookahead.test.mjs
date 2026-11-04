// seo-qa warns a week before page text starts failing QA (and so blocking every deploy). Added after the
// 2026-10-31 and 2026-11-03 deploy blocks, which nobody saw coming. Warnings only: errors are unchanged.
import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const QA = fileURLToPath(new URL("./seo-qa.mjs", import.meta.url));
const fmt = (days) => new Date(Date.now() + days * 86400000).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });

function runQa(body) {
  const root = mkdtempSync(join(tmpdir(), "seo-qa-"));
  mkdirSync(join(root, "site"));
  writeFileSync(join(root, "site", "sitemap.xml"), "<urlset><url><loc>https://familytripwise.com/</loc></url></urlset>");
  writeFileSync(join(root, "site", "index.html"), `<!doctype html><title>t</title><p>${body}</p>`);
  try {
    return { code: 0, out: execFileSync(process.execPath, [QA], { env: { ...process.env, SEO_QA_ROOT: root }, encoding: "utf8" }) };
  } catch (error) {
    return { code: error.status, out: String(error.stdout) };
  }
}

test("a notice ending within 7 days is a warning now, not an error", () => {
  const { code, out } = runQa(`Pool closed through ${fmt(3)}.`);
  assert.equal(code, 0, out);
  assert.match(out, /Errors: 0/);
  assert.match(out, /WARN site\/index\.html will fail QA within 7 days \(notice ends/);
});

test("a notice ending later than 7 days gets no early warning", () => {
  const { code, out } = runQa(`Pool closed through ${fmt(20)}.`);
  assert.equal(code, 0, out);
  assert.doesNotMatch(out, /will fail QA/);
});

test("an already expired notice is still an error (strictness unchanged)", () => {
  const { code, out } = runQa(`Pool closed through ${fmt(-2)}.`);
  assert.equal(code, 1, out);
  assert.match(out, /ERROR site\/index\.html has an expired operational notice/);
  assert.doesNotMatch(out, /will fail QA/);
});

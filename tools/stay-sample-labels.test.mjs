import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { findPastStaySamples } from "./content-freshness.mjs";

// Q16: stay samples must stay correctly labelled after their example dates pass,
// without the committed pages depending on the build date.
const siteDir = fileURLToPath(new URL("../site/", import.meta.url));
const walk = dir => readdirSync(dir).flatMap(entry => {
  const path = join(dir, entry);
  return statSync(path).isDirectory() ? walk(path) : [path];
});
const files = walk(siteDir);

for (const now of ["2026-11-08", "2026-11-09", "2026-11-14", "2027-01-15"].map(day => new Date(`${day}T12:00:00Z`))) {
  test(`no unlabelled past-stay sample in site pages or downloads on ${now.toISOString().slice(0, 10)}`, () => {
    const found = [];
    for (const file of files) {
      if (file.endsWith(".html")) {
        found.push(...findPastStaySamples(readFileSync(file, "utf8"), { now }).map(sample => `${file}: ${sample}`));
      } else if (/\/downloads\/[^/]+\.(?:csv|txt)$/.test(file)) {
        for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
          found.push(...findPastStaySamples(`<p>${line.replaceAll("<", " ")}</p>`, { now }).map(sample => `${file}: ${sample}`));
        }
      }
    }
    assert.deepEqual(found, []);
  });
}

test("Cancun labels do not claim dates passed for stays that had not begun on the label date", () => {
  const csv = readFileSync(join(siteDir, "downloads/cancun-room-comparison.csv"), "utf8");
  assert.match(csv, /"older observation; stay starts 2026-11-09"/);
  assert.doesNotMatch(csv, /"no"/);
  const page = readFileSync(join(siteDir, "where-to-stay/cancun-family-resorts.html"), "utf8");
  assert.match(page, /Older observation; not a current quote\. November 9-12, 2026/);
});

import assert from "node:assert/strict";
import { cpSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { upgradePriorityPages } from "./upgrade-priority-pages.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const target = "where-to-stay/las-vegas-with-kids.html";

function filesUnder(directory, base = directory) {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    return statSync(path).isDirectory() ? filesUnder(path, base) : [relative(base, path)];
  });
}

test("keeps the Las Vegas stay page canonical, indexable, and constraint-led", () => {
  const html = readFileSync(join(root, "site", target), "utf8");
  const sitemap = readFileSync(join(root, "site", "sitemap.xml"), "utf8");

  assert.match(html, /<link rel="canonical" href="https:\/\/familytripwise\.com\/where-to-stay\/las-vegas-with-kids\.html">/);
  assert.doesNotMatch(html, /<meta[^>]+name="robots"[^>]+noindex/i);
  assert.equal((sitemap.match(/https:\/\/familytripwise\.com\/where-to-stay\/las-vegas-with-kids\.html/g) || []).length, 1);
  assert.match(html, /Last updated:<\/strong> July 15, 2026/);

  for (const required of ["Total-fee check", "Room-assignment check", "Pool-access check", "Smoke/noise-exposure check", "Route-friction check"]) {
    assert.match(html, new RegExp(required));
  }
  assert.match(html, /not personally verified rankings or recommendations/i);
  assert.match(html, /UNKNOWN until the exact property, room, route, date/i);
  assert.match(html, /Human-review question:/);

  for (const blocked of [
    "Best overall area",
    "Best family compromise",
    "Best pool-first Strip candidate",
    "Best smoke-free, casino-free central option",
    "Best suite/value option",
    "Best fit when",
    "South Strip is often the best compromise",
  ]) {
    assert.doesNotMatch(html, new RegExp(blocked, "i"));
  }
});

test("regeneration is idempotent and changes no unrelated site file", () => {
  const temp = mkdtempSync(join(tmpdir(), "family-tripwise-las-vegas-"));
  const copy = join(temp, "site");
  cpSync(join(root, "site"), copy, { recursive: true });

  try {
    const before = new Map(filesUnder(copy).map((path) => [path, readFileSync(join(copy, path))]));
    upgradePriorityPages(copy);
    const afterFirst = new Map(filesUnder(copy).map((path) => [path, readFileSync(join(copy, path))]));
    upgradePriorityPages(copy);
    const afterSecond = new Map(filesUnder(copy).map((path) => [path, readFileSync(join(copy, path))]));

    assert.deepEqual(afterSecond, afterFirst);
    const changed = [...afterFirst].filter(([path, contents]) => !before.get(path)?.equals(contents)).map(([path]) => path);
    assert.deepEqual(changed, []);
  } finally {
    rmSync(temp, { recursive: true, force: true });
  }
});

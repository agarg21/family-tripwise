import assert from "node:assert/strict";
import { cpSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { cities, agePages } from "./page-generation/city-data.mjs";
import { upgradePriorityPages as engineUpgrade } from "./page-generation/upgrade-engine.mjs";
import { upgradePriorityPages as publicUpgrade } from "./upgrade-priority-pages.mjs";

const root = dirname(dirname(fileURLToPath(import.meta.url)));

function filesUnder(dir) {
  return readdirSync(dir, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => join(entry.parentPath ?? entry.path, entry.name))
    .sort();
}

test("keeps compatibility entry points small while data and logic live in explicit modules", () => {
  const generator = readFileSync(join(root, "tools", "generate-pages.mjs"), "utf8");
  const upgrader = readFileSync(join(root, "tools", "upgrade-priority-pages.mjs"), "utf8");

  assert.equal(publicUpgrade, engineUpgrade);
  assert.ok(generator.includes('./page-generation/city-data.mjs"'));
  assert.ok(generator.includes('./page-generation/family-hotel-pages.mjs"'));
  assert.ok(!generator.includes("const cities = ["));
  assert.ok(!generator.includes("const sanDiegoFamilyHotels = ["));
  assert.equal(
    upgrader,
    'export { upgradePriorityPages } from "./page-generation/upgrade-engine.mjs";\n'
  );
  assert.deepEqual(cities.map((city) => city.slug), [
    "chicago",
    "san-antonio",
    "san-diego",
    "las-vegas",
    "new-york-city"
  ]);
  assert.equal(agePages.length, 6);
});

test("rebuilding one damaged upgrade target restores it without changing another site file", () => {
  const temp = mkdtempSync(join(tmpdir(), "family-tripwise-generator-"));
  const site = join(temp, "site");
  cpSync(join(root, "site"), site, { recursive: true });

  try {
    const targetRelative = "things-to-do/san-diego-with-kids.html";
    const target = join(site, targetRelative);
    const originals = new Map(
      filesUnder(site).map((path) => [relative(site, path), readFileSync(path)])
    );
    const damaged = readFileSync(target, "utf8")
      .replace(/<!-- priority-upgrade:start -->[\s\S]*?<!-- priority-upgrade:end -->\n?/, "")
      .replace(/<!-- schema:start -->[\s\S]*?<!-- schema:end -->\n?/, "");
    assert.notEqual(damaged, originals.get(targetRelative).toString());
    writeFileSync(target, damaged);

    publicUpgrade(site);

    for (const path of filesUnder(site)) {
      const pathRelative = relative(site, path);
      assert.deepEqual(
        readFileSync(path),
        originals.get(pathRelative),
        `${pathRelative} changed during isolated target restoration`
      );
    }
  } finally {
    rmSync(temp, { recursive: true, force: true });
  }
});

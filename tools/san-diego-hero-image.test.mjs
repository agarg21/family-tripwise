import assert from "node:assert/strict";
import { cpSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import test from "node:test";

const root = fileURLToPath(new URL("../", import.meta.url));
const targetPaths = [
  "things-to-do/san-diego-with-kids.html",
  // San Diego with teens (D23 3p) and toddlers (D23 3q) moved to the shared banner (tools/hero-photos-batch2.test.mjs).
  // The San Diego itinerary moved to Mission Bay (D23 4e), then Balboa Park (Q21, 2026-11-08; asserted below).
  // Where to stay moved to Downtown seen from Coronado (Q21, 2026-11-08; asserted below).
];
const expectedImage = /<img src="\.\.\/images\/san-diego-zoo\.webp" alt="A red panda at the San Diego Zoo\." width="1600" height="1066" class="intrinsic-photo" loading="eager" fetchpriority="high" decoding="async">/;

// Q21 step 3 (2026-11-08): the itinerary shows Balboa Park (its one-day plan ends there), not the shared Mission Bay photo.
test("the San Diego itinerary shows the credited Balboa Park photo once", () => {
  const html = readFileSync(join(root, "site", "family-itinerary/san-diego-with-kids.html"), "utf8");
  assert.equal((html.match(/<figure /g) || []).length, 1);
  assert.match(html, /images\/san-diego-balboa-park-botanical-building-2026\.webp" style="object-position:50% 62%" width="1440" height="864"/);
  assert.match(html, /Christian David via <a href="https:\/\/commons\.wikimedia\.org\/wiki\/File:Lily_pond_and_Botanical_Building_among_palms,_Balboa_Park,_San_Diego,_California\.jpg">Wikimedia Commons<\/a>, <a href="https:\/\/creativecommons\.org\/licenses\/by-sa\/4\.0\/">CC BY-SA 4\.0<\/a>/);
  assert.doesNotMatch(html, /san-diego-mission-bay\.webp/);
});

// Q21 step 3 (2026-11-08): the stay page shows two of its five bases (Downtown from Coronado), not the shared zoo photo.
test("San Diego where to stay shows the credited Downtown-from-Coronado photo once", () => {
  const html = readFileSync(join(root, "site", "where-to-stay/san-diego-with-kids.html"), "utf8");
  assert.equal((html.match(/<figure /g) || []).length, 1);
  assert.match(html, /images\/san-diego-skyline-dusk-2015\.webp" style="object-position:50% 45%" width="1600" height="1070"/);
  assert.match(html, /russellstreet via <a href="https:\/\/commons\.wikimedia\.org\/wiki\/File:San_Diego_skyline_at_dusk_from_Coronado_2015\.jpg">Wikimedia Commons<\/a>, <a href="https:\/\/creativecommons\.org\/licenses\/by-sa\/2\.0\/">CC BY-SA 2\.0<\/a>/);
  assert.match(html, /og\/photos\/san-diego-skyline-dusk-2015\.jpg/);
  assert.doesNotMatch(html, /san-diego-zoo\.(?:webp|jpg)/);
});

test("all shared San Diego hero images reserve the verified intrinsic aspect ratio", () => {
  for (const relativePath of targetPaths) {
    const html = readFileSync(join(root, "site", relativePath), "utf8");
    assert.match(html, expectedImage, relativePath);
    assert.equal((html.match(/width="1600" height="1066"/g) || []).length, 1, relativePath);
  }

  const css = readFileSync(join(root, "site", "styles.css"), "utf8");
  assert.match(css, /\.licensed-photo img\.intrinsic-photo \{\s*height: auto;\s*\}/);
});

test("the full generator reproduces the three dimensioned San Diego pages", () => {
  const temp = mkdtempSync(join(tmpdir(), "family-tripwise-san-diego-hero-"));

  try {
    cpSync(join(root, "tools"), join(temp, "tools"), { recursive: true });
    cpSync(join(root, "docs/research"), join(temp, "docs/research"), { recursive: true });
    cpSync(join(root, "src/prototypes/cancun-resort-comparison"), join(temp, "src/prototypes/cancun-resort-comparison"), { recursive: true });
    cpSync(join(root, "src/shared"), join(temp, "src/shared"), { recursive: true });
    cpSync(join(root, "site"), join(temp, "site"), { recursive: true });
    execFileSync(process.execPath, [join(temp, "tools", "generate-pages.mjs")], {
      cwd: temp,
      stdio: "ignore"
    });

    for (const relativePath of targetPaths) {
      assert.equal(
        readFileSync(join(temp, "site", relativePath), "utf8"),
        readFileSync(join(root, "site", relativePath), "utf8"),
        relativePath
      );
    }
  } finally {
    rmSync(temp, { recursive: true, force: true });
  }
});

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
  "things-to-do/san-diego-with-toddlers.html",
  "things-to-do/san-diego-with-teens.html",
  "where-to-stay/san-diego-with-kids.html",
  "family-itinerary/san-diego-with-kids.html"
];
const expectedImage = /<img src="\.\.\/images\/san-diego-zoo\.webp" alt="A red panda at the San Diego Zoo\." width="1600" height="1066" class="intrinsic-photo" loading="eager" fetchpriority="high" decoding="async">/;

test("all shared San Diego hero images reserve the verified intrinsic aspect ratio", () => {
  for (const relativePath of targetPaths) {
    const html = readFileSync(join(root, "site", relativePath), "utf8");
    assert.match(html, expectedImage, relativePath);
    assert.equal((html.match(/width="1600" height="1066"/g) || []).length, 1, relativePath);
  }

  const css = readFileSync(join(root, "site", "styles.css"), "utf8");
  assert.match(css, /\.licensed-photo img\.intrinsic-photo \{\s*height: auto;\s*\}/);
});

test("the full generator reproduces the five dimensioned San Diego pages", () => {
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

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
const expectedImage = /<img src="https:\/\/commons\.wikimedia\.org\/wiki\/Special:Redirect\/file\/San%20Diego%20Zoo%2C%20San%20Diego%2C%20United%20States%20%28Unsplash%20QZwf5yNopUo%29\.jpg" alt="A red panda at the San Diego Zoo\." width="3766" height="2509" class="intrinsic-photo" loading="eager" decoding="async">/;

test("all shared San Diego hero images reserve the verified intrinsic aspect ratio", () => {
  for (const relativePath of targetPaths) {
    const html = readFileSync(join(root, "site", relativePath), "utf8");
    assert.match(html, expectedImage, relativePath);
    assert.equal((html.match(/width="3766" height="2509"/g) || []).length, 1, relativePath);
  }

  const css = readFileSync(join(root, "site", "styles.css"), "utf8");
  assert.match(css, /\.licensed-photo img\.intrinsic-photo \{\s*height: auto;\s*\}/);
});

test("the full generator reproduces the five dimensioned San Diego pages", () => {
  const temp = mkdtempSync(join(tmpdir(), "family-tripwise-san-diego-hero-"));

  try {
    cpSync(join(root, "tools"), join(temp, "tools"), { recursive: true });
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

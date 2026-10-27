import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";

// Keeps the operator's start-of-run state small enough to read every run.
const root = new URL("..", import.meta.url).pathname;
const read = (p) => readFileSync(join(root, p), "utf8");
const bytes = (p) => statSync(join(root, p)).size;

test("lean operator state files exist and stay within size limits", () => {
  assert.ok(bytes("ops/STATE.md") <= 8 * 1024, "ops/STATE.md must be ≤8 KB");
  assert.ok(bytes("ops/QUEUE.md") <= 12 * 1024, "ops/QUEUE.md must be ≤12 KB");
  assert.ok(bytes("ops/OWNER.md") <= 4 * 1024, "ops/OWNER.md must be ≤4 KB");
});

test("STATE.md carries the fields each run depends on", () => {
  const state = read("ops/STATE.md");
  for (const field of ["today:", "run:", "last_public_release:"]) {
    assert.match(state, new RegExp(`^${field}`, "m"), `STATE.md missing ${field}`);
  }
});

test("QUEUE.md holds at most 15 items", () => {
  const items = read("ops/QUEUE.md").match(/^## Q\d+/gm) ?? [];
  assert.ok(items.length >= 1 && items.length <= 15, `QUEUE has ${items.length} items`);
});

test("no live ops file outside data folders grows past 50 KB", () => {
  const exempt = new Set(["gsc-snapshots", "evidence-audits", "page-quality"]);
  const walk = (dir) => {
    for (const name of readdirSync(join(root, dir))) {
      const rel = join(dir, name);
      if (statSync(join(root, rel)).isDirectory()) {
        if (!exempt.has(name)) walk(rel);
      } else {
        assert.ok(bytes(rel) <= 50 * 1024, `${rel} exceeds 50 KB; summarize or archive it`);
      }
    }
  };
  walk("ops");
});

test("archived Codex-era logs are not recreated", () => {
  for (const p of ["ops/seo-roadmap.json", "ops/seo-roadmap.md", "ops/operator-review.md",
    "ops/current-cycle.md", "ops/needs-user.md", "backlog/product-learning-ledger.md"]) {
    assert.ok(!existsSync(join(root, p)), `${p} was archived; use ops/STATE.md, QUEUE.md or runs/`);
  }
});

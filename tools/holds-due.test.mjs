import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, readdirSync, statSync, readFileSync as rf } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { parseHolds, due, easternDate } from "./holds-due.mjs";
import { rollover, nextPart, ROLL_AT } from "./runs-rollover.mjs";

test("due() returns lines on or before the date and owner lines only on request", () => {
  const { holds } = parseHolds("- 2026-11-28 | a\n- 2026-11-29 | b\n- owner | c\nnot a hold\n");
  assert.deepEqual(due(holds, "2026-11-28").map((h) => h.text), ["a"]);
  assert.deepEqual(due(holds, "2026-11-29").map((h) => h.text), ["a", "b"]);
  assert.deepEqual(due(holds, "2026-11-28", true).map((h) => h.text), ["a", "c"]);
  assert.equal(easternDate(new Date("2026-11-28T04:30:00Z")), "2026-11-27");
});

test("runs rollover moves a large live file to the next part and leaves small ones alone", () => {
  const dir = mkdtempSync(join(tmpdir(), "runs-"));
  writeFileSync(join(dir, "2026-12-part1.md"), "x");
  writeFileSync(join(dir, "2026-12.md"), "# Run notes 2026-12\n\n## small\n");
  assert.equal(rollover(dir, "2026-12"), null);
  writeFileSync(join(dir, "2026-12.md"), "# Run notes 2026-12\n\n## big\n" + "y".repeat(ROLL_AT));
  assert.equal(rollover(dir, "2026-12", "2026-12-20"), "2026-12.md -> 2026-12-part2.md");
  assert.match(rf(join(dir, "2026-12-part2.md"), "utf8"), /^# Run notes 2026-12, part 2 \(moved from 2026-12.md on 2026-12-20 ET\)\n\n## big/);
  assert.ok(statSync(join(dir, "2026-12.md")).size < 200);
  assert.equal(nextPart(readdirSync(dir), "2026-12"), 3);
});

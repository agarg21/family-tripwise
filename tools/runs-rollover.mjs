#!/usr/bin/env node
// Moves this month's live run-notes file to the next part file once it passes 40 KB, so the 50 KB
// ops-state limit is never reached by hourly appends (Muse review 2026-11-28 #1). Run at step 8,
// before appending. Prints what it did; does nothing below the threshold.
import { readFileSync, writeFileSync, readdirSync, statSync, renameSync, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { easternDate } from "./holds-due.mjs";

export const ROLL_AT = 40 * 1024;

export function nextPart(names, month) {
  const nums = names.map((n) => n.match(new RegExp(`^${month}-part(\\d+)\\.md$`))).filter(Boolean).map((m) => +m[1]);
  return (nums.length ? Math.max(...nums) : 0) + 1;
}

export function rollover(dir, month, today = easternDate()) {
  const live = join(dir, `${month}.md`);
  if (!existsSync(live) || statSync(live).size <= ROLL_AT) return null;
  const n = nextPart(readdirSync(dir), month);
  const body = readFileSync(live, "utf8").replace(/^# [^\n]*\n/, "");
  writeFileSync(join(dir, `${month}-part${n}.md`), `# Run notes ${month}, part ${n} (moved from ${month}.md on ${today} ET)\n${body}`);
  writeFileSync(live, `# Run notes ${month} (older entries: ${month}-part1.md to part${n}.md)\n`);
  return `${month}.md -> ${month}-part${n}.md`;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const root = fileURLToPath(new URL("..", import.meta.url));
  const month = process.argv[2] ?? easternDate().slice(0, 7);
  console.log(rollover(join(root, "ops/runs"), month) ?? `ops/runs/${month}.md under ${ROLL_AT} bytes; no rollover`);
}

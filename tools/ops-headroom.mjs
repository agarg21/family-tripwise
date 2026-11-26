#!/usr/bin/env node
// Early warnings for the ops checks (Muse review 2026-11-26): the size tests in ops-state.test.mjs fail
// at the limit, so warn at 90% first, and flag a GSC snapshot older than 4 days (GitHub's cron skipped
// or delayed the Mon/Thu snapshot several times in November). Prints GitHub ::warning:: lines; never fails.
// With --stale-gsc-exit it exits 3 when the snapshot is stale, so the workflow can start a new one.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const LIMITS = { "ops/STATE.md": 8 * 1024, "ops/QUEUE.md": 12 * 1024, "ops/OWNER.md": 4 * 1024 };
export const WARN_AT = 0.9;
export const GSC_MAX_DAYS = 4;

export function headroom(files = LIMITS, size = (p) => statSync(join(root, p)).size) {
  const out = [];
  for (const [p, limit] of Object.entries(files)) {
    const n = size(p);
    if (n > WARN_AT * limit) out.push(`${p} is ${n} of ${limit} bytes (${Math.round((100 * n) / limit)}%); trim it before it fails ops-state.`);
  }
  return out;
}

// Only this month's live file (ops/runs/YYYY-MM.md); part files and closed months don't grow.
export function runsHeadroom(dir = join(root, "ops/runs"), limit = 50 * 1024, month = new Date().toISOString().slice(0, 7)) {
  return readdirSync(dir).filter((f) => f === `${month}.md`).map((f) => [f, statSync(join(dir, f)).size])
    .filter(([, n]) => n > WARN_AT * limit).map(([f, n]) => `ops/runs/${f} is ${n} of ${limit} bytes; move older notes to a part file.`);
}

export function gscAgeDays(dir = join(root, "ops/gsc-snapshots"), now = Date.now()) {
  const latest = readdirSync(dir).filter((f) => /^\d{4}-\d{2}-\d{2}\.json$/.test(f)).sort().pop();
  if (!latest) return Infinity;
  const at = Date.parse(JSON.parse(readFileSync(join(dir, latest), "utf8")).collected_at);
  return (now - at) / 864e5;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const notes = [...headroom(), ...runsHeadroom()];
  const age = gscAgeDays();
  const stale = age > GSC_MAX_DAYS;
  if (stale) notes.push(`Newest GSC snapshot is ${age.toFixed(1)} days old (limit ${GSC_MAX_DAYS}); STATE's scoreboard is stale.`);
  for (const n of notes) console.log(`::warning::${n}`);
  if (!notes.length) console.log("ops headroom ok; GSC snapshot age " + age.toFixed(1) + " days");
  if (stale && process.argv.includes("--stale-gsc-exit")) process.exit(3);
}

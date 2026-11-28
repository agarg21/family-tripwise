#!/usr/bin/env node
// Prints the ops/HOLDS.md lines due on or before today's Eastern date (Muse review 2026-11-28 #1:
// dated holds moved out of the 8 KB STATE so each run reads only what is due, not ~60 waiting lines).
// Usage: node tools/holds-due.mjs [YYYY-MM-DD] [--owner]   (--owner also prints owner-session lines)
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
export const LINE = /^- (\d{4}-\d{2}-\d{2}|owner) \| (.+)$/;

export function parseHolds(text) {
  const holds = [], bad = [];
  for (const line of text.split("\n")) {
    if (!line.startsWith("- ")) continue;
    const m = line.match(LINE);
    if (m) holds.push({ from: m[1], text: m[2] }); else bad.push(line);
  }
  return { holds, bad };
}

export const easternDate = (now = new Date()) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York" }).format(now);

export function due(holds, today, owner = false) {
  return holds.filter((h) => (h.from === "owner" ? owner : h.from <= today));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const today = process.argv.find((a) => /^\d{4}-\d{2}-\d{2}$/.test(a)) ?? easternDate();
  const { holds, bad } = parseHolds(readFileSync(`${root}ops/HOLDS.md`, "utf8"));
  const now = due(holds, today, process.argv.includes("--owner"));
  for (const h of now) console.log(`- ${h.from} | ${h.text}`);
  const later = holds.filter((h) => h.from !== "owner" && h.from > today);
  const next = later.map((h) => h.from).sort()[0];
  console.log(`${now.length} due by ${today}; ${later.length} later${next ? ` (next ${next})` : ""}; ${holds.length - now.length - later.length} owner-session.`);
  for (const b of bad) console.log(`::warning::ops/HOLDS.md line has no "<date> | " prefix: ${b.slice(0, 80)}`);
}

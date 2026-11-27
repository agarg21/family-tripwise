#!/usr/bin/env node
// Daily lift and trail counts from each resort's own status page (owner D57, 2026-11-26: read every
// resort's status page once a day through 2027-04-15). Plain code, no model: fetch with the deal
// watcher's robots.txt, Crawl-delay and block-page rules, then read "X / Y Lifts Open" style counts
// that the page prints as text. A page that loads its counts with JavaScript gives no count; we never
// guess one. Output: tools/page-generation/resort-status.json, one entry per resort, dated.
//
// Run during lift hours (the workflow runs at 18:31 UTC: 1:31 pm ET, 11:31 am MT, 10:31 am PT), since
// Vail Resorts pages show 0 lifts open overnight.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { fetchSource, pageText } from "./deal-watch.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const DATA = path.join(ROOT, "tools/page-generation/resort-conditions.json");
export const OUT = path.join(ROOT, "tools/page-generation/resort-status.json");
export const UA_TOKEN = "FamilyTripwiseStatus";
export const UA = `${UA_TOKEN}/1.0 (+https://familytripwise.com/)`;
export const LAST_DAY = "2027-04-15";

const LIMITS = { lifts: [1, 80], trails: [2, 450] };
const WORD = { lifts: "lifts?", trails: "(?:trails?|runs?)" };
const FRACTION = /^(\d{1,3})\s*(?:\/|of|out of)\s*(\d{1,3})$/i;

// Layouts seen on resort pages (11-26 dry runs). Only labels that say "open" count: Killington's
// "Scheduled Lifts" is not an open count, and a bare number with no total ("Lifts Open 10") gives nothing.
//   Vail Resorts:   "8" | "/ 34" | "Lifts Open" | "See Lifts"   (number above the label)
//   Windham, Jay:   "Lifts Open" | "0/12"   or  "Open Lifts" | "0 / 9"   (number below the label)
//   Holiday Valley: "0 of 13 OPEN LIFTS"   (one line)
// When a page gives one kind several different counts (Holiday Valley counts trails per difficulty),
// the count is ambiguous and we report none for that kind. The page then checks each total against the
// resort's known total (lifts_total / trails_total in resort-conditions.json) before showing it.
export function parseCounts(text) {
  const raw = String(text).split("\n").map((l) => l.replace(/\s+/g, " ").trim()).filter(Boolean);
  const lines = [];
  for (let i = 0; i < raw.length; i++) {  // join a fraction split over lines ("8" | "/ 34", "8" | "/" | "34")
    const [a, b, c] = [raw[i], raw[i + 1] ?? "", raw[i + 2] ?? ""];
    if (/^\d{1,3}$/.test(a) && /^\/\s*\d{1,3}$/.test(b)) { lines.push(`${a} ${b}`); i += 1; }
    else if (/^\d{1,3}$/.test(a) && b === "/" && /^\d{1,3}$/.test(c)) { lines.push(`${a} / ${c}`); i += 2; }
    else lines.push(a);
  }
  const isLabel = (kind, l) => new RegExp(`^(?:open\\s+${WORD[kind]}|${WORD[kind]}\\s+open)$`, "i").test(l);
  // Which side of its label a page prints the number on, decided by labels with only one fraction next
  // to them (or Vail's "See Lifts" line below). A label with fractions on both sides follows the page.
  const votes = { above: 0, below: 0 };
  // Any count label votes, including ones we don't report ("Scheduled Lifts", "Open Terrain Parks").
  const anyLabel = /^(?:open\s+|scheduled\s+)?(?:lifts?|trails?|runs?|terrain parks?|uphill trails?)(?:\s+open)?$/i;
  lines.forEach((l, i) => {
    if (!anyLabel.test(l)) return;
    const above = FRACTION.test(lines[i - 1] ?? ""), below = FRACTION.test(lines[i + 1] ?? "");
    if (/^see\s/i.test(lines[i + 1] ?? "") && above) votes.above++;
    else if (above !== below) votes[above ? "above" : "below"]++;
  });
  const side = votes.above > votes.below ? "above" : votes.below > votes.above ? "below" : null;
  const out = {};
  for (const kind of ["lifts", "trails"]) {
    const w = WORD[kind];
    // One count per line, and the line is only that count: "Trails Open 0/60 Lifts Open 0/12" on one
    // line gives nothing rather than a trails number read as lifts (integrity review 11-26).
    const inline = [
      new RegExp(`^(\\d{1,3})\\s*(?:/|of|out of)\\s*(\\d{1,3})\\s+(?:open\\s+${w}|${w}\\s+open)(?:\\s+(?:today|now))?$`, "i"),
      new RegExp(`^(?:open\\s+${w}|${w}\\s+open)\\s*:?\\s*(\\d{1,3})\\s*(?:/|of|out of)\\s*(\\d{1,3})$`, "i"),
    ];
    const found = [];
    lines.forEach((l, i) => {
      if (isLabel(kind, l)) {
        const prev = lines[i - 1] ?? "", next = lines[i + 1] ?? "";
        const above = FRACTION.test(prev), below = FRACTION.test(next);
        const pick = above && below ? (side === "above" ? prev : side === "below" ? next : "") : above ? prev : below ? next : "";
        const m = pick.match(FRACTION);
        if (m) found.push([Number(m[1]), Number(m[2]), side === "below" || (!above && below) ? `${l} ${pick}` : `${pick} ${l}`]);
        return;
      }
      for (const re of inline) { const m = l.match(re); if (m) { found.push([Number(m[1]), Number(m[2]), l]); break; } }
    });
    const [lo, hi] = LIMITS[kind];
    const ok = found.filter(([o, t]) => o <= t && t >= lo && t <= hi);
    if (!ok.length || new Set(ok.map(([o, t]) => `${o}/${t}`)).size > 1) continue;
    out[kind] = [ok[0][0], ok[0][1]];
    out.evidence = { ...(out.evidence || {}), [kind]: ok[0][2].slice(0, 60) };
  }
  return out;
}

export function textOf(html) {
  const t = pageText(html);
  return [t.title, t.h1, ...t.lines].join("\n");
}

function etStamp(d) {
  const f = new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false });
  const p = Object.fromEntries(f.formatToParts(d).map((x) => [x.type, x.value]));
  return { date: `${p.year}-${p.month}-${p.day}`, time: `${p.hour === "24" ? "00" : p.hour}:${p.minute}` };
}

export async function readAll({ resorts, prev = {}, fetchImpl = fetch, now = () => Date.now(), sleep = (ms) => new Promise((r) => setTimeout(r, ms)), log = () => {} }) {
  const robotsCache = new Map(), lastFetchAt = new Map(), out = {};
  for (const [slug, r] of Object.entries(resorts)) {
    if (!r.status_page) continue;
    // A page that denied us stays parked: never retried unchanged (AGENTS.md). Delete its entry to retry.
    if (prev[slug]?.kind === "denied" && prev[slug].url === r.status_page) { out[slug] = prev[slug]; log(`${slug}: parked (denied ${prev[slug].read_et?.date})`); continue; }
    const res = await fetchSource(r.status_page, { fetchImpl, robotsCache, lastFetchAt, sleep, now, userAgent: UA, token: UA_TOKEN });
    const at = new Date(now());
    const stamp = etStamp(at);
    if (res.kind !== "ok") { out[slug] = { url: r.status_page, read_at: at.toISOString(), read_et: stamp, kind: res.kind, error: res.reason || res.kind }; log(`${slug}: ${res.kind} ${res.reason || ""}`); continue; }
    const text = textOf(res.html);
    const counts = parseCounts(text);
    if (process.env.STATUS_CONTEXT) {
      const L = text.split("\n");
      L.forEach((l, i) => { if (/\b(lifts?|trails?|runs?)\b/i.test(l) && /open/i.test(l) && l.length < 80) log(`   ${slug} ctx: ${L.slice(Math.max(0, i - 2), i + 3).join(" | ")}`); });
    }
    out[slug] = { url: r.status_page, read_at: at.toISOString(), read_et: stamp, ...counts };
    log(`${slug}: ${counts.lifts ? `lifts ${counts.lifts.join("/")}` : "no lift count"}${counts.trails ? `, trails ${counts.trails.join("/")}` : ""} ${JSON.stringify(counts.evidence || {})}`);
  }
  return out;
}

async function main() {
  const today = etStamp(new Date()).date;
  if (today > LAST_DAY) { console.log(`D57 daily reads end ${LAST_DAY}; nothing to do.`); return; }
  // Read only while lifts turn coast to coast: 12:30-3:29pm ET is 9:30am-12:29pm PT in either season,
  // inside the pages' 9:30am-3:30pm resort-time window. A late cron start reads nothing rather than a
  // closed-for-the-night 0 (11-26 ran at 01:51 UTC).
  const { time } = etStamp(new Date());
  if (!process.env.STATUS_DRY_RUN && (time < "12:30" || time > "15:29")) { console.log(`outside lift hours (${time} ET); nothing read.`); return; }
  const { resorts } = JSON.parse(fs.readFileSync(DATA, "utf8"));
  const prev = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, "utf8")) : { resorts: {} };
  // At most one read per resort per ET day (D57); a second run the same day keeps the first read.
  // A dry run reads one resort (STATUS_ONLY, default vail) so testing never re-reads every page (review 11-26).
  const only = process.env.STATUS_DRY_RUN ? (process.env.STATUS_ONLY || "vail") : null;
  const due = Object.fromEntries(Object.entries(resorts).filter(([slug]) => (!only || slug === only) && prev.resorts?.[slug]?.read_et?.date !== today));
  const fresh = await readAll({ resorts: due, prev: prev.resorts || {}, log: console.log });
  const merged = { note: "Lift and trail counts printed on each resort's own status page, read once a day by tools/resort-status.mjs (D57). Missing count = the page did not print one as text.", resorts: { ...prev.resorts, ...fresh } };
  for (const slug of Object.keys(merged.resorts)) if (!resorts[slug]) delete merged.resorts[slug];
  fs.writeFileSync(OUT, JSON.stringify(merged, null, 2) + "\n");
  const n = Object.values(fresh).filter((x) => x.lifts).length;
  console.log(`read ${Object.keys(fresh).length} status pages; ${n} with a lift count`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) await main();

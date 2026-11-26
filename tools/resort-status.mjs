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

// Count patterns seen on resort pages, most specific first. Each returns [open, total].
function patterns(kind) {
  const w = WORD[kind];
  return [
    new RegExp(`(\\d{1,3})\\s*/\\s*(\\d{1,3})\\s*${w}\\s+open`, "i"),            // Vail Resorts: "8 / 34 Lifts Open"
    new RegExp(`${w}\\s+open\\s*:?\\s*(\\d{1,3})\\s*(?:/|of|out of)\\s*(\\d{1,3})`, "i"), // "Lifts Open 8/34", "Trails open: 13 of 277"
    new RegExp(`(\\d{1,3})\\s*(?:of|out of)\\s*(\\d{1,3})\\s*${w}(?:\\s+(?:are\\s+)?open)?`, "i"), // "8 of 34 lifts open"
    new RegExp(`open\\s+${w}\\s*:?\\s*(\\d{1,3})\\s*(?:/|of|out of)\\s*(\\d{1,3})`, "i"),  // "Open lifts 8/34"
  ];
}

// Matches may not cross a blank line between unrelated blocks, so read line by line with one line of
// lookahead ("8 / 34" on one line, "Lifts Open" on the next is the Vail Resorts layout).
export function parseCounts(text) {
  const out = {};
  for (const kind of ["lifts", "trails"]) {
    for (const re of patterns(kind)) {
      const m = text.match(re);
      if (!m) continue;
      const [open, total] = [Number(m[1]), Number(m[2])];
      const [lo, hi] = LIMITS[kind];
      if (open <= total && total >= lo && total <= hi) {
        out[kind] = [open, total];
        out.evidence = { ...(out.evidence || {}), [kind]: m[0].replace(/\s+/g, " ").slice(0, 60) };
        break;
      }
    }
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

export async function readAll({ resorts, fetchImpl = fetch, now = () => Date.now(), sleep = (ms) => new Promise((r) => setTimeout(r, ms)), log = () => {} }) {
  const robotsCache = new Map(), lastFetchAt = new Map(), out = {};
  for (const [slug, r] of Object.entries(resorts)) {
    if (!r.status_page) continue;
    const res = await fetchSource(r.status_page, { fetchImpl, robotsCache, lastFetchAt, sleep, now, userAgent: UA, token: UA_TOKEN });
    const at = new Date(now());
    const stamp = etStamp(at);
    if (res.kind !== "ok") { out[slug] = { url: r.status_page, read_at: at.toISOString(), read_et: stamp, error: res.reason || res.kind }; log(`${slug}: ${res.kind} ${res.reason || ""}`); continue; }
    const counts = parseCounts(textOf(res.html));
    out[slug] = { url: r.status_page, read_at: at.toISOString(), read_et: stamp, ...counts };
    log(`${slug}: ${counts.lifts ? `lifts ${counts.lifts.join("/")}` : "no lift count"}${counts.trails ? `, trails ${counts.trails.join("/")}` : ""} ${JSON.stringify(counts.evidence || {})}`);
  }
  return out;
}

async function main() {
  const today = etStamp(new Date()).date;
  if (today > LAST_DAY) { console.log(`D57 daily reads end ${LAST_DAY}; nothing to do.`); return; }
  const { resorts } = JSON.parse(fs.readFileSync(DATA, "utf8"));
  const prev = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, "utf8")) : { resorts: {} };
  // At most one read per resort per ET day (D57); a second run the same day keeps the first read.
  const due = Object.fromEntries(Object.entries(resorts).filter(([slug]) => prev.resorts?.[slug]?.read_et?.date !== today));
  const fresh = await readAll({ resorts: due, log: console.log });
  const merged = { note: "Lift and trail counts printed on each resort's own status page, read once a day by tools/resort-status.mjs (D57). Missing count = the page did not print one as text.", resorts: { ...prev.resorts, ...fresh } };
  for (const slug of Object.keys(merged.resorts)) if (!resorts[slug]) delete merged.resorts[slug];
  fs.writeFileSync(OUT, JSON.stringify(merged, null, 2) + "\n");
  const n = Object.values(fresh).filter((x) => x.lifts).length;
  console.log(`read ${Object.keys(fresh).length} status pages; ${n} with a lift count`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) await main();

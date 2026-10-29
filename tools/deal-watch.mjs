#!/usr/bin/env node
// Deal fast lane, step 1: hourly change watch on official deal pages (QUEUE G09, OWNER D15).
//
// Run only by .github/workflows/deal-watch.yml (hourly cron, no secrets). For each source in
// ops/deal-watch/sources.json it checks robots.txt, fetches the page at most once per run, extracts
// the offer-signal lines (title, h1, meta description and short lines that look like offer terms),
// and stores their hash in ops/deal-watch/state.json. When the signal changes it adds a pending flag
// to ops/deal-watch/flags.json; the next operator run verifies the change on the official page
// before anything is published. A flag is a lead, never a fact.
//
// Never bypasses robots.txt, blocks or CAPTCHAs: a source that is disallowed, denied or shows a bot
// page is recorded and skipped on every later run until its sources.json entry changes (an
// unchanged denial is never retried). Stores short extracted lines, never raw page bodies.

import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

export const USER_AGENT_TOKEN = "FamilyTripwiseDealWatch";
export const USER_AGENT = `${USER_AGENT_TOKEN}/1.0 (+https://familytripwise.com/)`;
export const MAX_SIGNAL_LINES = 60;
export const MAX_LINE_CHARS = 240;
export const MAX_DIFF_LINES = 12;
export const MAX_STORED_SIGNAL_CHARS = 2000; // per source, keeps state.json small; line_hashes cover the rest
export const MAX_ERRORS = 3;
export const MAX_CRAWL_DELAY_S = 60;
const MAX_BODY_BYTES = 3_000_000;
const MAX_REDIRECTS = 3;

const sha = (s) => createHash("sha256").update(s).digest("hex");
export const sourceSig = (src) => sha(JSON.stringify({ url: src.url, retry: src.retry ?? 0 })).slice(0, 16);

// ---------- robots.txt (RFC 9309 subset: groups, Allow/Disallow, * and $, Crawl-delay) ----------
export function parseRobots(text) {
  const groups = [];
  let current = null;
  let lastWasAgent = false;
  for (const raw of String(text).split(/\r?\n/)) {
    const line = raw.replace(/#.*/, "").trim();
    const m = line.match(/^([A-Za-z-]+)\s*:\s*(.*)$/);
    if (!m) continue;
    const key = m[1].toLowerCase();
    const value = m[2].trim();
    if (key === "user-agent") {
      if (!lastWasAgent || !current) { current = { agents: [], rules: [], crawlDelay: null }; groups.push(current); }
      current.agents.push(value.toLowerCase());
      lastWasAgent = true;
      continue;
    }
    lastWasAgent = false;
    if (!current) continue;
    if (key === "allow" || key === "disallow") current.rules.push({ allow: key === "allow", path: value });
    else if (key === "crawl-delay") { const n = Number(value); if (Number.isFinite(n) && n >= 0) current.crawlDelay = n; }
  }
  return groups;
}

function pickGroups(groups, token) {
  const t = token.toLowerCase();
  const named = groups.filter((g) => g.agents.some((a) => a !== "*" && t.startsWith(a)));
  if (named.length) return named;
  return groups.filter((g) => g.agents.includes("*"));
}

function patternMatch(pattern, path) {
  if (pattern === "") return -1;
  const anchored = pattern.endsWith("$");
  const body = anchored ? pattern.slice(0, -1) : pattern;
  const re = new RegExp("^" + body.split("*").map((p) => p.replace(/[.+?^${}()|[\]\\]/g, "\\$&")).join(".*") + (anchored ? "$" : ""));
  return re.test(path) ? body.length : -1;
}

export function robotsVerdict(text, url, token = USER_AGENT_TOKEN) {
  const groups = pickGroups(parseRobots(text), token);
  const u = new URL(url);
  const path = (u.pathname || "/") + (u.search || "");
  let best = { len: -1, allow: true };
  let crawlDelay = null;
  for (const g of groups) {
    if (g.crawlDelay != null) crawlDelay = Math.max(crawlDelay ?? 0, g.crawlDelay);
    for (const r of g.rules) {
      if (!r.allow && r.path === "") continue; // "Disallow:" (empty) allows everything
      const len = patternMatch(r.path, path);
      if (len < 0) continue;
      if (len > best.len || (len === best.len && r.allow)) best = { len, allow: r.allow };
    }
  }
  return { allowed: best.allow, crawlDelay };
}

// ---------- page text and offer signal ----------
const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", ndash: "–", mdash: "—", rsquo: "’", lsquo: "‘", rdquo: "”", ldquo: "“", hellip: "…", reg: "®", trade: "™", copy: "©" };
export function decodeEntities(s) {
  return String(s).replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => {
    if (e[0] === "#") { const n = e[1].toLowerCase() === "x" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10); return Number.isFinite(n) && n > 0 && n < 0x110000 ? String.fromCodePoint(n) : " "; }
    return ENTITIES[e.toLowerCase()] ?? m;
  });
}
const clean = (s) => decodeEntities(String(s).replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();

export function pageText(html) {
  const h = String(html)
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<(script|style|noscript|svg|template|iframe)\b[\s\S]*?<\/\1\s*>/gi, " ");
  const title = clean((h.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i) || [])[1] || "");
  const h1 = clean((h.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i) || [])[1] || "");
  const metaTag = (h.match(/<meta\b[^>]*name=["']description["'][^>]*>/i) || [])[0] || "";
  const description = clean((metaTag.match(/content=["']([^"']*)["']/i) || [])[1] || "");
  const body = h
    .replace(/<head\b[\s\S]*?<\/head\s*>/i, " ")
    .replace(/<h1\b[\s\S]*?<\/h1\s*>/i, "\n")
    .replace(/<\/?(p|div|li|ul|ol|h[1-6]|br|tr|td|th|section|article|header|footer|nav|main|aside|span|a|button|dd|dt|figcaption|label|option|strong|em|b)\b[^>]*>/gi, "\n")
    .replace(/<[^>]*>/g, " ");
  const lines = decodeEntities(body).split("\n").map((l) => l.replace(/\s+/g, " ").trim()).filter(Boolean);
  return { title, h1, description, lines };
}

const OFFER_RE = /(\d+\s?%|\bfree\b|\bsave\b|\bsavings\b|\b\d+\s?off\b|% off|\boff\b.*\b(stay|night|fare|ticket|package|cruise)|\bbook (by|now|between)\b|\bends?\b|\bexpires?\b|\bdeal\b|\boffer\b|\bsale\b|\bpromo|\bcredit\b|\bkids?\b.*\b(free|stay|sail|eat|ages?)\b|\$\s?\d|\bUSD\s?\d|\bfrom \$|\bper (person|night)\b|\bblack friday\b|\bcyber monday\b)/i;
const NOISE_RE = /^(©|copyright\b|all rights reserved|cookie|privacy|terms of use|skip to|sign in|log in|menu)\b/i;

export function extractSignal(html) {
  const { title, h1, description, lines } = pageText(html);
  const seen = new Set();
  const signal = [];
  for (const l of lines) {
    if (l.length < 8 || l.length > 400 || NOISE_RE.test(l) || !OFFER_RE.test(l)) continue;
    const t = l.length > MAX_LINE_CHARS ? l.slice(0, MAX_LINE_CHARS - 1) + "…" : l;
    const key = t.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    signal.push(t);
    if (signal.length >= MAX_SIGNAL_LINES) break;
  }
  const headline = (h1 || title || description || "").slice(0, MAX_LINE_CHARS);
  const hash = sha([title, h1, description, ...signal].join("\n").toLowerCase()).slice(0, 32);
  return { title: title.slice(0, MAX_LINE_CHARS), h1: h1.slice(0, MAX_LINE_CHARS), description: description.slice(0, MAX_LINE_CHARS), headline, signal, hash };
}

export const lineHash = (line) => sha(line.toLowerCase()).slice(0, 10);

// Stored excerpt: the first signal lines up to MAX_STORED_SIGNAL_CHARS in total.
export function storedSignal(lines) {
  const out = [];
  let total = 0;
  for (const l of lines) { if (total + l.length > MAX_STORED_SIGNAL_CHARS) break; out.push(l); total += l.length; }
  return out;
}

// before: {signal, line_hashes} from state; after: full signal lines of this fetch.
// Added lines are exact (hash comparison over every line); removed lines can only be shown when
// they were in the stored excerpt, and removed_count counts all of them.
export function diffSignal(before = {}, after = []) {
  const prevHashes = new Set(before.line_hashes || (before.signal || []).map(lineHash));
  const nowHashes = new Set(after.map(lineHash));
  const added = after.filter((x) => !prevHashes.has(lineHash(x)));
  const removedCount = [...prevHashes].filter((h) => !nowHashes.has(h)).length;
  const removed = (before.signal || []).filter((x) => !nowHashes.has(lineHash(x)));
  return { added: added.slice(0, MAX_DIFF_LINES), removed: removed.slice(0, MAX_DIFF_LINES), added_count: added.length, removed_count: removedCount };
}

const BLOCK_RE = /(captcha|access denied|request unsuccessful|are you a (human|robot)|verify you are human|attention required|cf-chl|px-captcha|incapsula|perimeterx|bot detection|unusual traffic|pardon our interruption)/i;
export function denialReason(status, html = "") {
  if ([401, 403, 407, 429, 451].includes(status)) return `HTTP ${status}`;
  const sample = String(html).slice(0, 20000);
  const { title, h1 } = pageText(sample);
  if (BLOCK_RE.test(title) || BLOCK_RE.test(h1)) return "bot or block page";
  if (status >= 200 && status < 300 && sample.length < 4000 && BLOCK_RE.test(sample)) return "bot or block page";
  return null;
}

// ---------- fetching ----------
async function readBody(res) {
  const reader = res.body?.getReader?.();
  if (!reader) return await res.text();
  const chunks = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.length;
    if (total > MAX_BODY_BYTES) { await reader.cancel(); break; }
    chunks.push(value);
  }
  return new TextDecoder("utf-8").decode(Buffer.concat(chunks.map((c) => Buffer.from(c))));
}

export async function robotsFor(origin, { fetchImpl, cache }) {
  if (cache.has(origin)) return cache.get(origin);
  let result;
  try {
    const res = await fetchImpl(`${origin}/robots.txt`, { headers: { "user-agent": USER_AGENT }, redirect: "follow" });
    const body = await readBody(res);
    if (res.status === 404 || res.status === 410) result = { ok: true, text: "" };
    else if (res.status >= 200 && res.status < 300 && !/^\s*</.test(body)) result = { ok: true, text: body };
    else if (res.status >= 500) result = { ok: false, transient: true, reason: `robots.txt HTTP ${res.status}` };
    else result = { ok: false, reason: res.status >= 200 && res.status < 300 ? "robots.txt is an HTML page, not rules" : `robots.txt HTTP ${res.status}` };
  } catch (err) {
    result = { ok: false, transient: true, reason: `robots.txt unreachable (${err?.name || "error"})` };
  }
  cache.set(origin, result);
  return result;
}

// Returns {kind: ok|robots|denied|error, status, html, reason, finalUrl}
export async function fetchSource(url, { fetchImpl, robotsCache, lastFetchAt, sleep, now }) {
  let current = url;
  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    const u = new URL(current);
    if (u.protocol !== "https:") return { kind: "error", reason: "not https" };
    const robots = await robotsFor(u.origin, { fetchImpl, cache: robotsCache });
    if (!robots.ok) return { kind: robots.transient ? "error" : "robots", reason: robots.reason };
    const verdict = robotsVerdict(robots.text, current);
    if (!verdict.allowed) return { kind: "robots", reason: "disallowed by robots.txt" };
    if (verdict.crawlDelay != null && verdict.crawlDelay > MAX_CRAWL_DELAY_S) return { kind: "robots", reason: `Crawl-delay ${verdict.crawlDelay}s exceeds ${MAX_CRAWL_DELAY_S}s` };
    const delayMs = (verdict.crawlDelay ?? 1) * 1000;
    const last = lastFetchAt.get(u.host);
    if (last != null) { const wait = last + delayMs - now(); if (wait > 0) await sleep(wait); }
    let res;
    try {
      lastFetchAt.set(u.host, now());
      res = await fetchImpl(current, { headers: { "user-agent": USER_AGENT, accept: "text/html,application/xhtml+xml" }, redirect: "manual" });
    } catch (err) {
      return { kind: "error", reason: `fetch failed (${err?.name || "error"})` };
    }
    if ([301, 302, 303, 307, 308].includes(res.status)) {
      const loc = res.headers.get("location");
      if (!loc) return { kind: "error", status: res.status, reason: "redirect without location" };
      current = new URL(loc, current).href;
      continue;
    }
    const html = await readBody(res);
    const denied = denialReason(res.status, html);
    if (denied) return { kind: "denied", status: res.status, reason: denied };
    if (res.status < 200 || res.status >= 300) return { kind: "error", status: res.status, reason: `HTTP ${res.status}` };
    return { kind: "ok", status: res.status, html, finalUrl: current };
  }
  return { kind: "error", reason: "too many redirects" };
}

// ---------- one watch run ----------
export function validateSources(doc) {
  const errors = [];
  const ids = new Set();
  if (!doc || !Array.isArray(doc.sources)) return ["sources.json must have a sources array"];
  for (const [i, s] of doc.sources.entries()) {
    const at = `sources[${i}]`;
    if (!s || typeof s.id !== "string" || !/^[a-z0-9-]+$/.test(s.id)) errors.push(`${at}: id must be kebab-case`);
    else if (ids.has(s.id)) errors.push(`${at}: duplicate id ${s.id}`);
    else ids.add(s.id);
    try { const u = new URL(s?.url); if (u.protocol !== "https:") errors.push(`${at}: url must be https`); } catch { errors.push(`${at}: bad url`); }
    if (!s?.operator) errors.push(`${at}: operator required`);
    if (!["offer-index", "offer-page", "offer-terms"].includes(s?.kind)) errors.push(`${at}: kind must be offer-index, offer-page or offer-terms`);
    if (s?.retry != null && !Number.isInteger(s.retry)) errors.push(`${at}: retry must be an integer`);
  }
  return errors;
}

export function upsertFlag(flags, flag) {
  const i = flags.findIndex((f) => f.source_id === flag.source_id && f.kind === flag.kind);
  if (i < 0) { flags.push(flag); return flag; }
  const old = flags[i];
  const merged = { ...flag, detected_at: old.detected_at, updated_at: flag.detected_at };
  if (flag.kind === "changed") {
    merged.previous_headline = old.previous_headline;
    merged.added = [...new Set([...(old.added || []), ...(flag.added || [])])].slice(0, MAX_DIFF_LINES);
    merged.removed = [...new Set([...(old.removed || []), ...(flag.removed || [])])].slice(0, MAX_DIFF_LINES);
  }
  flags[i] = merged;
  return merged;
}

export async function runWatch({ sources, state = { sources: {} }, flags = { flags: [] }, fetchImpl, now = () => Date.now(), sleep = (ms) => new Promise((r) => setTimeout(r, ms)), log = () => {} }) {
  const errors = validateSources(sources);
  if (errors.length) throw new Error(`invalid sources.json:\n${errors.join("\n")}`);
  const nextState = { sources: {} };
  const nextFlags = { flags: [...(flags.flags || [])] };
  const robotsCache = new Map();
  // Flags raised this run, kept so the workflow can re-apply them on top of an operator's
  // concurrent flags.json edit instead of losing them (state already moved on).
  const raiseFlag = (flag) => { raised.push(flag); upsertFlag(nextFlags.flags, flag); };
  const lastFetchAt = new Map();
  const fetchedThisRun = new Set();
  const raised = [];
  let changed = 0;
  for (const src of sources.sources) {
    const sig = sourceSig(src);
    const prev = state.sources?.[src.id];
    const iso = new Date(now()).toISOString();
    const keep = prev && prev.source_sig === sig ? prev : null;
    if (keep && (keep.status === "robots" || keep.status === "denied" || (keep.status === "error" && (keep.errors ?? 0) >= MAX_ERRORS))) {
      nextState.sources[src.id] = keep; // never retry an unchanged denial
      log(`${src.id}: skipped (${keep.status}: ${keep.reason})`);
      continue;
    }
    if (fetchedThisRun.has(src.url)) { nextState.sources[src.id] = keep || prev; continue; }
    fetchedThisRun.add(src.url);
    const r = await fetchSource(src.url, { fetchImpl, robotsCache, lastFetchAt, sleep, now });
    const base = { url: src.url, source_sig: sig };
    if (r.kind === "ok") {
      const s = extractSignal(r.html);
      const entry = { ...base, status: "ok", headline: s.headline, title: s.title, h1: s.h1, description: s.description, signal_hash: s.hash, signal: storedSignal(s.signal), line_hashes: s.signal.map(lineHash), first_seen_at: keep?.first_seen_at || iso, changed_at: keep?.changed_at || iso };
      if (keep?.signal_hash && keep.signal_hash !== s.hash) {
        const d = diffSignal(keep, s.signal);
        entry.changed_at = iso;
        raiseFlag({ source_id: src.id, operator: src.operator, url: src.url, check_id: src.check_id ?? null, kind: "changed", detected_at: iso, previous_headline: keep.headline || "", headline: s.headline, added: d.added, removed: d.removed, added_count: d.added_count, removed_count: d.removed_count });
        changed++;
        log(`${src.id}: CHANGED (+${d.added.length} / -${d.removed.length})`);
      } else if (!keep?.signal_hash) {
        log(`${src.id}: baseline recorded (${s.signal.length} signal lines)`);
      } else {
        log(`${src.id}: unchanged`);
      }
      nextState.sources[src.id] = entry;
    } else {
      const errorsSoFar = r.kind === "error" ? ((keep?.status === "error" ? keep.errors ?? 0 : 0) + 1) : undefined;
      const entry = { ...(keep && keep.status === "ok" ? { headline: keep.headline, title: keep.title, h1: keep.h1, description: keep.description, signal_hash: keep.signal_hash, signal: keep.signal, line_hashes: keep.line_hashes, first_seen_at: keep.first_seen_at, changed_at: keep.changed_at } : {}), ...base, status: r.kind, reason: r.reason, since: keep?.status === r.kind ? keep.since : iso };
      if (errorsSoFar != null) entry.errors = errorsSoFar;
      // A new denial, robots block or a run of errors is worth one flag so the operator knows the
      // source went dark; it is never retried until sources.json changes.
      if (errorsSoFar === MAX_ERRORS || (r.kind !== "error" && !(keep && keep.status === r.kind))) {
        raiseFlag({ source_id: src.id, operator: src.operator, url: src.url, check_id: src.check_id ?? null, kind: r.kind === "error" ? "unreachable" : "blocked", detected_at: iso, reason: r.reason });
      }
      log(`${src.id}: ${r.kind} (${r.reason})`);
      nextState.sources[src.id] = entry;
    }
  }
  return { state: nextState, flags: nextFlags, changed, raised };
}

// ---------- CLI ----------
const stable = (obj) => JSON.stringify(obj, null, 2) + "\n";

async function main() {
  const root = new URL("..", import.meta.url);
  const dir = new URL("ops/deal-watch/", root);
  const read = (name, fallback) => { const p = new URL(name, dir); return existsSync(p) ? JSON.parse(readFileSync(p, "utf8")) : fallback; };
  const reapply = process.argv.indexOf("--reapply");
  if (reapply > 0) {
    // After a merge conflict: keep main's flags.json (the operator may have deleted handled flags)
    // and add back only the flags this run raised.
    const flags = read("flags.json", { flags: [] });
    for (const f of JSON.parse(readFileSync(process.argv[reapply + 1], "utf8"))) upsertFlag(flags.flags, f);
    writeFileSync(new URL("flags.json", dir), stable(flags));
    console.log(`deal-watch: re-applied raised flags; ${flags.flags.length} pending`);
    return;
  }
  const sources = read("sources.json", null);
  const state = read("state.json", { sources: {} });
  const flags = read("flags.json", { flags: [] });
  const result = await runWatch({ sources, state, flags, fetchImpl: globalThis.fetch, log: (m) => console.log(m) });
  const note = state.note || "Written only by .github/workflows/deal-watch.yml (tools/deal-watch.mjs). Extracted offer-signal lines from official pages, not raw bodies. Do not edit by hand.";
  const flagNote = flags.note || "Pending deal-watch flags (QUEUE G09). The operator verifies each on the official page, then deletes the flag. A flag is a lead, not a fact.";
  // Write only when content changed, so an unchanged hour makes no commit.
  const out = [["state.json", { note, ...result.state }], ["flags.json", { note: flagNote, ...result.flags }]];
  for (const [name, data] of out) {
    const p = new URL(name, dir);
    const text = stable(data);
    if (!existsSync(p) || readFileSync(p, "utf8") !== text) writeFileSync(p, text);
  }
  if (process.env.DEAL_WATCH_RAISED) writeFileSync(process.env.DEAL_WATCH_RAISED, stable(result.raised));
  console.log(`deal-watch: ${result.changed} changed source(s); ${result.flags.flags.length} pending flag(s)`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch((err) => { console.error(err?.message || err); process.exit(1); });
}

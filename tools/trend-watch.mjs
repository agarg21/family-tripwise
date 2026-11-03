#!/usr/bin/env node
// Trend fast lane, step 1 and 2: watch local news feeds and GDELT for new family-relevant items in
// our holiday cities, score them, and write leads for the operator (QUEUE G16, docs/plan/trend-fast-lane.md).
//
// Run only by .github/workflows/trend-watch.yml (every 30 minutes, no secrets). For each feed in
// ops/trend-watch/sources.json it checks robots.txt (with tools/deal-watch.mjs helpers: groups, Crawl-delay,
// each URL at most once per run, an unchanged denial never retried), parses RSS 2.0, RSS 1.0 or Atom,
// keeps per item only a short title, link, outlet, published and first-seen times, city and matched terms,
// and scores it (fit, novelty, momentum, actionable; blockers drop it). Items at or above the threshold
// become flags in ops/trend-watch/flags.json. A flag is a lead, never a fact: the operator verifies it on
// the primary source before anything is built (docs/plan/trend-fast-lane.md section 3).
//
// Never stores article bodies; descriptions are read in memory for matching only.

import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { fetchSource, decodeEntities, sourceSig, MAX_ERRORS, BLOCK_RE } from "./deal-watch.mjs";
export const REQUEST_TIMEOUT_MS = 20000;

export const USER_AGENT_TOKEN = "FamilyTripwiseTrendWatch";
export const USER_AGENT = `${USER_AGENT_TOKEN}/1.0 (+https://familytripwise.com/)`;
export const MAX_FILE_BYTES = 40 * 1024; // ops files must stay under 50 KB (tools/ops-state.test.mjs)
export const MAX_TITLE_CHARS = 160;
const FEED_ACCEPT = "application/rss+xml, application/atom+xml, application/xml;q=0.9, text/xml;q=0.9, */*;q=0.5";
const HOUR = 3600_000;

// ---------- tunable config (scoring = docs/plan/trend-fast-lane.md section 2) ----------
export const CONFIG = {
  threshold: 7, // flag when the score reaches this
  high_momentum_signals: 2, // priority "high" when momentum has at least this many signals
  max_age_h: 72, // older items are not new: ignored
  fresh_h: 24, // novelty point for items published within this window
  momentum_window_h: 24, // same story in 2+ outlets within this window
  seen_ttl_h: 120, // dedupe memory for relevant items (longer than max_age_h)
  recent_keep_h: 30, // relevant items kept in state for cross-run momentum
  max_recent: 60,
  max_items_per_source: 60,
  max_gdelt_items_per_city: 12,
  gdelt_min_hits: 2, // GDELT articles in the same story for the "gdelt" momentum signal
  max_flag_links: 6,
  max_matched_terms: 12,
  weights: { city_mention: 1, family: 2, topic: 2, novelty: 2, fresh: 1, momentum: 2, actionable: 1 },
  similarity: { min_shared: 3, overlap: 0.6 },
  cities: {
    "New York City": ["new york city", "nyc", "new york", "manhattan", "brooklyn", "queens", "the bronx", "bronx", "staten island", "times square", "central park", "rockefeller center", "hudson yards", "coney island", "bryant park"],
    Chicago: ["chicago", "chicagoland", "navy pier", "millennium park", "magnificent mile", "mag mile", "lincoln park zoo", "brookfield zoo", "wrigleyville", "maggie daley park"],
    "San Diego": ["san diego", "balboa park", "la jolla", "coronado", "seaworld san diego", "legoland california", "carlsbad", "del mar", "chula vista", "gaslamp quarter", "gaslamp", "mission bay"],
    Orlando: ["orlando", "kissimmee", "lake buena vista", "winter park", "walt disney world", "disney world", "magic kingdom", "epcot", "hollywood studios", "animal kingdom", "disney springs", "universal orlando", "epic universe", "islands of adventure", "seaworld orlando", "icon park", "central florida"],
    "San Antonio": ["san antonio", "river walk", "riverwalk", "the alamo", "pearl district", "six flags fiesta texas", "seaworld san antonio", "brackenridge park", "hemisfair", "market square"],
    "Washington DC": ["washington, d.c.", "washington d.c.", "washington dc", "d.c.", "national mall", "smithsonian", "georgetown", "navy yard", "the wharf", "national zoo", "nationals park", "the ellipse"],
  },
  terms: {
    family: ["kids", "kid", "kid-friendly", "kids'", "kid's", "children", "children's", "child", "family", "families", "family-friendly", "toddler", "toddlers", "parents", "all ages", "all-ages", "stroller", "little ones", "tweens", "with teens", "for teens"],
    topic: ["holiday", "holidays", "christmas", "xmas", "hanukkah", "chanukah", "menorah", "kwanzaa", "diwali", "thanksgiving", "turkey trot", "parade", "light show", "light display", "lights festival", "holiday lights", "christmas lights", "lights", "tree lighting", "lighting ceremony", "winter wonderland", "ice skating", "ice rink", "skating rink", "snow", "gingerbread", "nutcracker", "santa", "zoo", "zoolights", "aquarium", "botanic garden", "botanical garden", "festival", "holiday market", "christmas market", "christkindlmarket", "new year's eve", "fireworks", "drone show", "free admission", "free entry", "free event", "free museum", "theme park", "water park", "new attraction", "grand opening", "pop-up", "museum", "legoland", "seaworld", "universal", "disney", "black friday"],
    novelty: ["new", "first", "first-ever", "opening", "opens", "now open", "grand opening", "debut", "debuts", "debuting", "returns", "returning", "is back", "back for", "announced", "announces", "unveil", "unveils", "unveiled", "launch", "launches", "this year", "this season"],
    buzz: ["viral", "went viral", "tiktok", "instagram", "long lines", "line wrapped", "sold out", "sold-out", "sells out", "selling out", "packed", "crowds", "waitlist", "trending"],
    disney: ["disney", "walt disney world", "disney world", "magic kingdom", "epcot", "hollywood studios", "animal kingdom", "disney springs"],
  },
  patterns: {
    date: /\b(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|june?|july?|aug(?:ust)?|sept?(?:ember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\.?\s+\d{1,2}(?:st|nd|rd|th)?\b|\b\d{1,2}\/\d{1,2}\b|\b(?:mondays?|tuesdays?|wednesdays?|thursdays?|fridays?|saturdays?|sundays?|tonight|today|tomorrow|this weekend|next weekend|thanksgiving day|black friday|christmas eve|new year'?s eve)\b/i,
    price: /\$\s?\d|\bfree\b|\btickets?\b|\badmission\b/i,
    // Capitalized name ending in a venue or event head word ("Nationals Park", "Lights of Esperanza" is caught by "Lights").
    entity: /\b((?:[A-Z][\w'&.-]*\s+){1,4}(?:Park|Zoo|Garden|Gardens|Museum|Square|Center|Centre|Pier|Plaza|Aquarium|Theatre|Theater|Hall|Market|Yards|Village|Arena|Stadium|Mall|Library|Island|Beach|Riverwalk|Festival|Parade|Lights|Spectacular|Celebration|Wonderland|Fair|Lighting|Kingdom|Studios|Springs|Universe|World)|Lightscape|ZooLights|Christkindlmarket|Enchant)\b/g,
  },
  // Generic words that do not make a name specific enough to match two stories.
  generic_words: ["the", "a", "an", "at", "in", "on", "of", "for", "and", "new", "annual", "this", "visit", "holiday", "holidays", "christmas", "thanksgiving", "winter", "day", "night", "lights", "light", "show", "festival", "parade", "market", "celebration", "fair", "lighting", "tree", "free", "family", "kids", "best", "city", "park", "center", "world"],
  stopwords: ["the", "and", "for", "with", "this", "that", "from", "your", "you", "are", "will", "has", "have", "its", "into", "what", "where", "when", "how", "why", "who", "here", "there", "about", "after", "before", "more", "most", "than", "can", "all", "our", "out", "now", "just", "get", "know", "need", "things", "year", "years"],
  // Crime, politics and child-subject words are matched in the title only (a parade story's summary may
  // mention police street closures); private homes and paywalls in the title and summary.
  blocker_title_only: ["crime_tragedy", "politics", "child_subject", "adult_only", "past_recap"],
  blockers: {
    private_home: /\b(?:homeowners?|neighbou?rs?'?|residential display|front yard|backyard|driveway|private (?:home|residence|property)|(?:his|her|their) (?:home|house|yard)|family'?s? (?:home|house)|(?:christmas|holiday) (?:house|home) on)\b/i,
    crime_tragedy: /\b(?:shooting|shootings|shot|gunfire|gunman|killed|kills|killing|dies|died|death|deaths|murder|homicide|stabbing|stabbed|arrest|arrested|charged|robbery|robbed|police|crash|crashes|collision|injured|injury|injuries|fire|blaze|flood|flooding|evacuat\w*|missing|tragedy|tragic|victims?|funeral|overdose|assault|lawsuit|sued|recall|recalled|outbreak|hospitalized)\b|(?<!of the )\bdead\b/i,
    politics: /\b(?:elections?|ballots?|voters?|voting|candidates?|campaign|midterms?|senate|senator|congress|congressional|democrats?|democratic|republicans?|gop|partisan|trump|legislature|lawmakers|polls (?:open|close)|at the polls|city council|governor(?!'?s island))\b/i,
    child_subject: /\b\d{1,2}-year-old\b|\b(?:boy|girl|toddler|infant|baby|newborn|student|teen|teenager|child|kid|son|daughter)\s+(?:who|named|is|was|has|had|raises|dies|died|injured|hurt|missing|found|saved|battling|diagnosed|got)\b|\b(?:kids|children|students|teens)\s+(?:were|got|hospitalized|injured|hurt|sick|missing)\b|\bmake-a-wish\b|\bwish kid\b|\bamber alert\b|\bfoster\b/i,
    adult_only: /\b(?:bar crawl|pub crawl|21\+|21 and over|adults[- ]only|beer fest(?:ival)?|wine fest(?:ival)?|cocktails?|burlesque|drag brunch|santacon|brewery|beer garden)(?![\w])/i,
    past_recap: /\b(?:recap|highlights from|last night|photos:|in photos|look back|looking back)\b/i,
    paywall: /\b(?:subscriber[- ]only|for subscribers|subscribers only|premium content)\b/i,
  },
};

// ---------- small helpers ----------
const sha = (s) => createHash("sha256").update(s).digest("hex");
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const isoMin = (t) => new Date(t).toISOString().replace(/:\d\d\.\d{3}Z$/, "Z");
const unique = (xs) => [...new Set(xs)];
const reCache = new WeakMap();
function termRe(list) {
  if (reCache.has(list)) return reCache.get(list);
  const alts = [...list].sort((a, b) => b.length - a.length).map((t) => esc(t).replace(/\s+/g, "[\\s-]+"));
  const re = new RegExp(`(?<![\\w])(?:${alts.join("|")})(?![\\w])`, "gi");
  reCache.set(list, re);
  return re;
}
export function matchTerms(list, text) {
  return unique([...String(text).matchAll(termRe(list))].map((m) => m[0].toLowerCase().replace(/[\s-]+/g, " ")));
}
export const normText = (s) => String(s).replace(/[‘’ʼ]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, " ").trim();
export const clip = (s, n = MAX_TITLE_CHARS) => (s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s);

const TRACKING = /^(utm_\w+|fbclid|gclid|mc_cid|mc_eid|ref|cmpid|ito|partner-feed|outputtype|taid|cid|sr_share)$/i;
export function normalizeLink(url) {
  try {
    const u = new URL(url);
    const host = u.hostname.toLowerCase().replace(/^(www|m|amp)\./, "");
    const params = [...u.searchParams].filter(([k]) => !TRACKING.test(k)).sort(([a], [b]) => a.localeCompare(b));
    const search = params.length ? "?" + params.map(([k, v]) => `${k}=${v}`).join("&") : "";
    return `${host}${u.pathname.replace(/\/+$/, "") || "/"}${search}`;
  } catch { return null; }
}
export function outletKey(url) {
  try { return new URL(url).hostname.toLowerCase().split(".").slice(-2).join("."); } catch { return ""; }
}
export const normTitle = (t) => normText(t).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
export const linkHash = (url) => sha(normalizeLink(url) || String(url)).slice(0, 12);
export const titleHash = (outlet, title) => sha(`${outlet}|${normTitle(title)}`).slice(0, 12);

// ---------- feed parsing (RSS 2.0, RSS 1.0/RDF, Atom) ----------
function tagInner(block, names) {
  for (const name of names) {
    const m = block.match(new RegExp(`<${esc(name)}(?=[\\s>/])[^>]*?(?:/>|>([\\s\\S]*?)</${esc(name)}\\s*>)`, "i"));
    if (m && m[1] != null && m[1].trim()) return m[1];
  }
  return "";
}
function textOf(raw) {
  let s = String(raw).replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1");
  s = decodeEntities(s.replace(/<[^>]*>/g, " "));
  if (/&(#\d+|#x[0-9a-f]+|[a-z]+);/i.test(s)) s = decodeEntities(s); // double-encoded titles
  return normText(s.replace(/<[^>]*>/g, " "));
}
const attr = (tag, name) => (tag.match(new RegExp(`\\s${name}\\s*=\\s*["']([^"']*)["']`, "i")) || [])[1];
export function parseDate(s) {
  if (!s) return null;
  const v = String(s).trim();
  const g = v.match(/^(\d{4})(\d\d)(\d\d)T?(\d\d)(\d\d)(\d\d)Z?$/); // GDELT seendate 20261103T150000Z
  const t = g ? Date.UTC(+g[1], +g[2] - 1, +g[3], +g[4], +g[5], +g[6]) : Date.parse(v);
  return Number.isFinite(t) ? t : null;
}
export const looksLikeFeed = (body) => /<(rss|feed|rdf:RDF)[\s>]/i.test(String(body).slice(0, 4000));

export function parseFeed(xml) {
  const body = String(xml).replace(/<!--[\s\S]*?-->/g, " ");
  const head = body.slice(0, 4000);
  const kind = /<feed[\s>]/i.test(head) ? "atom" : /<rdf:RDF[\s>]/i.test(head) ? "rdf" : /<rss[\s>]/i.test(head) ? "rss" : null;
  if (!kind) return { kind: null, items: [] };
  const re = kind === "atom" ? /<entry\b[^>]*>([\s\S]*?)<\/entry\s*>/gi : /<item\b([^>]*)>([\s\S]*?)<\/item\s*>/gi;
  const items = [];
  for (const m of body.matchAll(re)) {
    const block = kind === "atom" ? m[1] : m[2];
    const title = textOf(tagInner(block, ["title"]));
    let link = "";
    if (kind === "atom") {
      const links = [...block.matchAll(/<link\b[^>]*>/gi)].map((x) => x[0]);
      const alt = links.find((l) => /rel\s*=\s*["']alternate["']/i.test(l)) || links.find((l) => !/rel\s*=/i.test(l)) || "";
      link = attr(alt, "href") || "";
    } else {
      link = textOf(tagInner(block, ["link"])) || (kind === "rdf" ? attr(`<item${m[1]}>`, "rdf:about") || "" : "");
      if (!/^https?:/i.test(link)) { const guid = textOf(tagInner(block, ["guid"])); if (/^https?:/i.test(guid)) link = guid; }
    }
    link = decodeEntities(link.trim());
    const published = parseDate(textOf(tagInner(block, ["pubDate", "dc:date", "published", "updated", "a10:updated"])));
    const summary = textOf(tagInner(block, ["description", "summary", "dc:subject"])).slice(0, 400);
    if (!title || !/^https?:\/\//i.test(link)) continue;
    items.push({ title, link, published, summary });
  }
  return { kind, items };
}

export function parseGdelt(text) {
  let doc;
  try { doc = JSON.parse(text); } catch { return { ok: false, reason: `GDELT returned non-JSON (${normText(String(text).slice(0, 80))})` }; }
  const arts = Array.isArray(doc?.articles) ? doc.articles : [];
  return {
    ok: true,
    items: arts
      .filter((a) => a && a.title && /^https?:\/\//i.test(a.url || ""))
      .map((a) => ({ title: normText(a.title), link: a.url, published: parseDate(a.seendate), summary: "", outlet: a.domain || outletKey(a.url) })),
  };
}

export function gdeltUrl(g, query) {
  const p = new URLSearchParams({ query, mode: "ArtList", format: "json", timespan: g.timespan || "24h", maxrecords: String(g.maxrecords || 75), sort: "DateDesc" });
  return `${g.endpoint}?${p.toString()}`;
}

// ---------- analysis and scoring ----------
export function extractEntities(text, config = CONFIG) {
  const generic = new Set(config.generic_words);
  const out = [];
  for (const m of String(text).matchAll(config.patterns.entity)) {
    const words = m[1].toLowerCase().replace(/[^a-z0-9' ]+/g, " ").split(/\s+/).filter(Boolean);
    while (words.length && generic.has(words[0]) && words.length > 1) words.shift();
    if (!words.some((w) => !generic.has(w))) continue;
    out.push(words.join(" "));
  }
  return unique(out);
}

export function titleTokens(title, config = CONFIG) {
  const stop = new Set(config.stopwords);
  return unique(normTitle(title).split(" ").filter((w) => w.length >= 3 && !stop.has(w)));
}

export function similar(a, b, config = CONFIG) {
  const ta = a.w || [], tb = b.w || [];
  const shared = ta.filter((x) => tb.includes(x)).length;
  if (shared >= 1 && a.e?.some((x) => b.e?.includes(x))) return true; // same named place or event
  return shared >= config.similarity.min_shared && shared / Math.max(1, Math.min(ta.length, tb.length)) >= config.similarity.overlap;
}

// Returns null when the item is not relevant (wrong city, no family/topic fit, too old, or a blocker).
export function analyzeItem(item, source, { now, config = CONFIG, firstSeen = now }) {
  const text = normText(`${item.title} . ${item.summary || ""}`);
  const mentioned = Object.keys(config.cities).filter((c) => matchTerms(config.cities[c], text).length);
  const city = mentioned.includes(source.city) ? source.city : mentioned[0] || (source.require_city_mention ? null : source.city);
  if (!city) return { relevant: false, why: "no city" };
  const title = normText(item.title);
  for (const [name, re] of Object.entries(config.blockers)) {
    if (re.test(config.blocker_title_only.includes(name) ? title : text)) return { relevant: false, why: `blocker:${name}`, blocker: name };
  }
  if (source.paywall) return { relevant: false, why: "blocker:paywall", blocker: "paywall" };
  const family = matchTerms(config.terms.family, text);
  const topic = matchTerms(config.terms.topic, text);
  if (!family.length && !topic.length) return { relevant: false, why: "no family or topic fit" };
  const pub = item.published != null && item.published <= now + HOUR ? item.published : null;
  const age = now - (pub ?? firstSeen);
  if (age > config.max_age_h * HOUR) return { relevant: false, why: "older than max_age_h" };
  const year = String(new Date(now).getUTCFullYear());
  const novelty = unique([...matchTerms(config.terms.novelty, text), ...(new RegExp(`\\b${year}\\b`).test(text) ? [year] : [])]);
  const entities = extractEntities(text, config);
  const dateM = text.match(config.patterns.date);
  const priceM = text.match(config.patterns.price);
  const W = config.weights;
  const sig = { fit: [], novelty: [], actionable: [] };
  let score = 0;
  if (mentioned.includes(city)) { score += W.city_mention; sig.fit.push(`city:${city}`); } else sig.fit.push(`city:${city} (local outlet)`);
  if (family.length) { score += W.family; sig.fit.push(`family:${family[0]}`); }
  if (topic.length) { score += W.topic; sig.fit.push(`topic:${topic.slice(0, 3).join(",")}`); }
  if (novelty.length) { score += W.novelty; sig.novelty.push(...novelty.slice(0, 3)); }
  if (age <= config.fresh_h * HOUR) { score += W.fresh; sig.novelty.push(`published<${config.fresh_h}h`); }
  if (dateM) { score += W.actionable; sig.actionable.push(`date:${dateM[0].toLowerCase()}`); }
  if (entities.length) { score += W.actionable; sig.actionable.push(`place:${entities[0]}`); }
  if (priceM) { score += W.actionable; sig.actionable.push(`price:${priceM[0].toLowerCase()}`); }
  const buzz = matchTerms(config.terms.buzz, text);
  const disney = city === "Orlando" && matchTerms(config.terms.disney, text).length > 0;
  return {
    relevant: true, city, score, sig, buzz, disney, published: pub, entities,
    terms: unique([...family, ...topic, ...novelty, ...buzz]).slice(0, config.max_matched_terms),
  };
}

function momentumOf(members, config) {
  const outlets = unique(members.filter((m) => !m.x).map((m) => m.o)); // GDELT hits count once, under gdelt (review P3)
  const gdelt = members.filter((m) => m.x).length;
  const buzz = unique(members.flatMap((m) => m.b || []));
  const sig = [];
  if (outlets.length >= 2) sig.push(`outlets:${outlets.length}`);
  if (gdelt >= config.gdelt_min_hits) sig.push(`gdelt:${gdelt}`);
  if (buzz.length) sig.push(`buzz:${buzz.slice(0, 3).join(",")}`);
  return sig;
}

// ---------- flags ----------
export function upsertTrendFlag(list, flag, config = CONFIG) {
  const i = list.findIndex((f) => f.id === flag.id);
  if (i < 0) { list.push(flag); return "new"; }
  const old = list[i];
  const links = [...old.links];
  for (const l of flag.links) if (!links.some((x) => x.url === l.url)) links.push(l);
  const union = (k) => unique([...(old.signals?.[k] || []), ...(flag.signals?.[k] || [])]);
  list[i] = {
    ...old,
    links: links.slice(0, config.max_flag_links),
    signals: { fit: union("fit"), novelty: union("novelty"), momentum: flag.signals.momentum.length >= (old.signals?.momentum?.length || 0) ? flag.signals.momentum : old.signals.momentum, actionable: union("actionable") },
    matched_terms: unique([...(old.matched_terms || []), ...(flag.matched_terms || [])]).slice(0, config.max_matched_terms),
    score: Math.max(old.score, flag.score),
    priority: old.priority === "high" || flag.priority === "high" ? "high" : "normal",
    ...(old.disney_specific || flag.disney_specific ? { disney_specific: true } : {}),
    updated_at: flag.updated_at || flag.first_seen,
  };
  return "updated";
}

export function upsertAlert(list, alert) {
  const i = list.findIndex((a) => a.source_id === alert.source_id && a.kind === alert.kind);
  if (i < 0) list.push(alert); else list[i] = { ...alert, detected_at: list[i].detected_at };
}

// ---------- sources ----------
export function validateSources(doc, config = CONFIG) {
  const errors = [];
  const ids = new Set();
  if (!doc || !Array.isArray(doc.feeds)) return ["sources.json must have a feeds array"];
  const kinds = ["local-tv", "newspaper", "city-guide", "public-radio", "tourism-board", "family-guide", "alt-weekly", "neighborhood-news"];
  for (const [i, s] of doc.feeds.entries()) {
    const at = `feeds[${i}]`;
    if (!s || typeof s.id !== "string" || !/^[a-z0-9-]+$/.test(s.id)) errors.push(`${at}: id must be kebab-case`);
    else if (ids.has(s.id)) errors.push(`${at}: duplicate id ${s.id}`);
    else ids.add(s.id);
    try { const u = new URL(s?.url); if (u.protocol !== "https:") errors.push(`${at}: url must be https`); } catch { errors.push(`${at}: bad url`); }
    if (!config.cities[s?.city]) errors.push(`${at}: city must be one of ${Object.keys(config.cities).join(", ")}`);
    if (!s?.outlet) errors.push(`${at}: outlet required`);
    if (!kinds.includes(s?.kind)) errors.push(`${at}: kind must be one of ${kinds.join(", ")}`);
    if (!/^\d{4}-\d\d-\d\d$/.test(s?.checked_on || "")) errors.push(`${at}: checked_on (YYYY-MM-DD) required`);
    if (s?.retry != null && !Number.isInteger(s.retry)) errors.push(`${at}: retry must be an integer`);
  }
  const g = doc.gdelt;
  if (g) {
    if (typeof g.enabled !== "boolean") errors.push("gdelt.enabled must be true or false");
    try { if (new URL(g.endpoint).protocol !== "https:") errors.push("gdelt.endpoint must be https"); } catch { errors.push("gdelt.endpoint bad url"); }
    if (!(g.min_interval_s >= 5)) errors.push("gdelt.min_interval_s must be at least 5 (GDELT asks for one request every 5 s)");
    for (const c of Object.keys(g.queries || {})) if (!config.cities[c]) errors.push(`gdelt.queries: unknown city ${c}`);
  }
  return errors;
}

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
export function gdeltSources(doc) {
  const g = doc.gdelt;
  if (!g?.enabled) return [];
  return Object.entries(g.queries || {}).map(([city, query]) => ({ id: `gdelt-${slug(city)}`, city, outlet: "GDELT", kind: "gdelt", url: gdeltUrl(g, query), require_city_mention: true, retry: g.retry ?? 0 }));
}

// ---------- one watch run ----------
export async function runWatch({ sources, state = {}, flags = {}, fetchImpl, now = () => Date.now(), sleep = (ms) => new Promise((r) => setTimeout(r, ms)), log = () => {}, config = CONFIG }) {
  const errors = validateSources(sources, config);
  if (errors.length) throw new Error(`invalid sources.json:\n${errors.join("\n")}`);
  const t0 = now();
  const iso = isoMin(t0);
  const nextState = { sources: {}, seen: {}, recent: [] };
  const nextFlags = { flags: [...(flags.flags || [])], source_alerts: [...(flags.source_alerts || [])] };
  const raised = { flags: [], alerts: [] };
  const robotsCache = new Map();
  const lastFetchAt = new Map();
  const fetched = new Set();
  const collected = []; // {item, source}

  const feedDenial = (status, body) => ([401, 403, 407, 429, 451].includes(status) ? `HTTP ${status}` : status >= 200 && status < 300 && !looksLikeFeed(body) && BLOCK_RE.test(String(body).slice(0, 4000)) ? "bot or block page" : null);
  const apiDenial = (status) => ([401, 403, 407, 451].includes(status) ? `HTTP ${status}` : null); // GDELT 429 = slow down: an error, not a denial

  const all = [...sources.feeds.map((s) => ({ ...s, kind_group: "feed" })), ...gdeltSources(sources).map((s) => ({ ...s, kind_group: "gdelt" }))];
  for (const src of all) {
    const sig = sourceSig(src);
    const prev = state.sources?.[src.id];
    const keep = prev && prev.source_sig === sig ? prev : null;
    if (keep && (keep.status === "robots" || keep.status === "denied" || (keep.status === "error" && (keep.errors ?? 0) >= MAX_ERRORS))) {
      nextState.sources[src.id] = keep; // never retry an unchanged denial
      log(`${src.id}: skipped (${keep.status}: ${keep.reason})`);
      continue;
    }
    if (fetched.has(src.url)) { if (keep) nextState.sources[src.id] = keep; continue; }
    fetched.add(src.url);
    const isGdelt = src.kind_group === "gdelt";
    const r = await fetchSource(src.url, {
      fetchImpl, robotsCache, lastFetchAt, sleep, now, userAgent: USER_AGENT, token: USER_AGENT_TOKEN,
      accept: isGdelt ? "application/json" : FEED_ACCEPT, denial: isGdelt ? apiDenial : feedDenial,
      minDelayS: isGdelt ? sources.gdelt.min_interval_s : 0,
    });
    let parsed = null;
    let failure = r.kind === "ok" ? null : r;
    if (r.kind === "ok") {
      if (isGdelt) {
        const g = parseGdelt(r.html);
        if (g.ok) parsed = g.items; else failure = { kind: "error", reason: g.reason };
      } else {
        const f = parseFeed(r.html);
        if (f.kind) parsed = f.items; else failure = { kind: "error", reason: "not an RSS or Atom feed" };
      }
    }
    const base = { url: src.url, source_sig: sig };
    if (parsed) {
      // A source's first successful read is a baseline: its items are remembered, not flagged (like deal-watch).
      const baseline = !keep?.ok_since;
      nextState.sources[src.id] = { ...base, status: "ok", ok_since: keep?.ok_since || iso };
      for (const item of parsed.slice(0, config.max_items_per_source)) collected.push({ item, source: src, baseline });
      log(`${src.id}: ${parsed.length} item(s)`);
    } else {
      const errorsSoFar = failure.kind === "error" ? (keep?.status === "error" ? keep.errors ?? 0 : 0) + 1 : undefined;
      const entry = { ...base, status: failure.kind, reason: String(failure.reason || "").slice(0, 120), since: keep?.status === failure.kind ? keep.since : iso, ...(keep?.ok_since ? { ok_since: keep.ok_since } : {}) };
      if (errorsSoFar != null) entry.errors = errorsSoFar;
      nextState.sources[src.id] = entry;
      if (errorsSoFar === MAX_ERRORS || (failure.kind !== "error" && !(keep && keep.status === failure.kind))) {
        const alert = { source_id: src.id, city: src.city, url: src.url, kind: failure.kind === "error" ? "unreachable" : "blocked", reason: entry.reason, detected_at: iso };
        raised.alerts.push(alert);
        upsertAlert(nextFlags.source_alerts, alert);
      }
      log(`${src.id}: ${failure.kind} (${failure.reason})`);
    }
  }

  // Dedupe memory: keep unexpired seen keys.
  for (const [k, exp] of Object.entries(state.seen || {})) if (Date.parse(exp) > t0) nextState.seen[k] = exp;
  const recentPrev = (state.recent || []).filter((r) => t0 - Date.parse(r.t ?? r.fs) <= config.recent_keep_h * HOUR);

  // Analyse new items.
  const fresh = [];
  const runKeys = new Set();
  const gdeltPerCity = {};
  for (const { item, source, baseline } of collected) {
    const isGdelt = source.kind_group === "gdelt";
    const outlet = isGdelt ? item.outlet : source.outlet;
    const o = outletKey(item.link);
    const lk = `l${linkHash(item.link)}`;
    const tk = `t${titleHash(o, item.title)}`;
    if (runKeys.has(lk) || runKeys.has(tk)) continue;
    if (nextState.seen[lk] || nextState.seen[tk]) continue;
    const a = analyzeItem(item, source, { now: t0, config });
    if (!a.relevant) continue;
    if (isGdelt) { gdeltPerCity[a.city] = (gdeltPerCity[a.city] || 0) + 1; if (gdeltPerCity[a.city] > config.max_gdelt_items_per_city) continue; }
    runKeys.add(lk); runKeys.add(tk);
    const exp = new Date(t0 + config.seen_ttl_h * HOUR).toISOString().slice(0, 13) + "Z";
    nextState.seen[lk] = exp; nextState.seen[tk] = exp;
    fresh.push({
      k: lk.slice(1), c: a.city, o, n: outlet, u: item.link, h: clip(item.title, 120), p: a.published != null ? isoMin(a.published) : null, fs: iso,
      t: isoMin(a.published ?? t0), s: a.score, g: a.sig, b: a.buzz.length ? a.buzz : undefined, x: isGdelt ? 1 : undefined, d: a.disney ? 1 : undefined,
      e: a.entities.length ? a.entities.slice(0, 2) : undefined, w: titleTokens(item.title, config), m: a.terms, full: clip(item.title), bl: baseline || undefined,
    });
  }

  // Cluster new items with recent ones (same city, within the momentum window, similar title or same named place/event).
  const pool = [...recentPrev.map((r) => ({ ...r, w: r.w || titleTokens(r.h, config) })), ...fresh];
  const parent = pool.map((_, i) => i);
  const find = (i) => (parent[i] === i ? i : (parent[i] = find(parent[i])));
  for (let i = 0; i < pool.length; i++) for (let j = i + 1; j < pool.length; j++) {
    const a = pool[i], b = pool[j];
    if (a.c !== b.c) continue;
    if (Math.abs(Date.parse(a.t) - Date.parse(b.t)) > config.momentum_window_h * HOUR) continue;
    if (a.k === b.k || similar(a, b, config)) parent[find(i)] = find(j);
  }
  const clusters = new Map();
  pool.forEach((m, i) => { const r = find(i); if (!clusters.has(r)) clusters.set(r, []); clusters.get(r).push(m); });

  let newFlags = 0;
  for (const members of clusters.values()) {
    if (!members.some((m) => fresh.includes(m) && !m.bl)) continue;
    const momentum = momentumOf(members, config);
    const best = [...members].sort((a, b) => b.s - a.s || (a.x ? 1 : 0) - (b.x ? 1 : 0) || Date.parse(a.t) - Date.parse(b.t))[0];
    const score = best.s + momentum.length * config.weights.momentum;
    const priority = momentum.length >= config.high_momentum_signals ? "high" : "normal";
    const known = members.find((m) => m.f);
    const existing = nextFlags.flags.find((f) => (known && f.id === known.f) || f.links?.some((l) => members.some((m) => m.u === l.url)));
    if (score < config.threshold) continue;
    // A story the operator already handled (flag deleted) returns only when it escalates to high priority.
    if (!existing && known && !(priority === "high" && known.pr !== "high")) continue;
    const id = existing?.id || `t-${sha(best.u).slice(0, 10)}`;
    const ordered = [best, ...members.filter((m) => m !== best).sort((a, b) => Date.parse(a.t) - Date.parse(b.t))];
    const flag = {
      id, city: best.c, title: best.full || best.h,
      links: ordered.slice(0, config.max_flag_links).map((m) => ({ outlet: m.n, url: m.u, published: m.p })),
      first_seen: members.map((m) => m.fs).sort()[0],
      signals: { fit: best.g.fit, novelty: best.g.novelty, momentum, actionable: best.g.actionable },
      matched_terms: unique(members.flatMap((m) => m.m || [])).slice(0, config.max_matched_terms),
      score, priority,
      ...(members.some((m) => m.d) ? { disney_specific: true } : {}),
      updated_at: iso,
    };
    if (!existing) delete flag.updated_at;
    const how = upsertTrendFlag(nextFlags.flags, flag, config);
    raised.flags.push(flag);
    if (how === "new") newFlags++;
    for (const m of members) { m.f = id; m.pr = priority === "high" || m.pr === "high" ? "high" : "normal"; }
    log(`${how === "new" ? "FLAG" : "flag update"} ${id} [${priority}] ${best.c}: ${best.h} (score ${score})`);
  }

  // Keep only what cross-run momentum needs: recent relevant items, short fields, no matched-term lists.
  nextState.recent = pool
    .filter((r) => t0 - Date.parse(r.t) <= config.recent_keep_h * HOUR)
    .sort((a, b) => Date.parse(b.t) - Date.parse(a.t))
    .slice(0, config.max_recent)
    .map(({ full, w, m, bl, ...r }) => Object.fromEntries(Object.entries(r).filter(([, v]) => v !== undefined && v !== null)));
  return { state: nextState, flags: nextFlags, newFlags, raised };
}

// ---------- serialization and size caps ----------
// One line per source, seen key, recent item or flag link list keeps the files small and diffs readable.
export function serializeState(doc) {
  const block = (v, ind) => {
    if (Array.isArray(v)) return v.length ? `[\n${v.map((x) => `${ind}  ${JSON.stringify(x)}`).join(",\n")}\n${ind}]` : "[]";
    if (v && typeof v === "object") { const e = Object.entries(v); return e.length ? `{\n${e.map(([k, x]) => `${ind}  ${JSON.stringify(k)}: ${JSON.stringify(x)}`).join(",\n")}\n${ind}}` : "{}"; }
    return JSON.stringify(v);
  };
  return `{\n${Object.entries(doc).map(([k, v]) => `  ${JSON.stringify(k)}: ${block(v, "  ")}`).join(",\n")}\n}\n`;
}
export const serializeFlags = (doc) => JSON.stringify(doc, null, 2) + "\n";
const stateBytes = (doc) => Buffer.byteLength(serializeState(doc));
const bytes = (doc) => Buffer.byteLength(serializeFlags(doc));
export function fitState(doc, limit = MAX_FILE_BYTES) {
  // Drop the oldest recent items and the oldest seen keys in turn; source statuses are never dropped.
  doc.recent ||= []; doc.seen ||= {};
  const keys = Object.entries(doc.seen).sort((a, b) => a[1].localeCompare(b[1]));
  while (stateBytes(doc) > limit && (doc.recent.length || keys.length)) {
    doc.recent.pop();
    for (const [k] of keys.splice(0, 10)) delete doc.seen[k];
  }
  if (stateBytes(doc) > limit) throw new Error(`state JSON still over ${limit} bytes`);
  return doc;
}
export function fitFlags(doc, limit = MAX_FILE_BYTES) {
  // Drop the oldest normal-priority flags first, then the oldest high-priority ones.
  const order = () => doc.flags.map((f, i) => [f, i]).sort(([a], [b]) => (a.priority === "high") - (b.priority === "high") || a.first_seen.localeCompare(b.first_seen));
  while (bytes(doc) > limit && doc.flags.length) { const [f] = order()[0]; doc.flags.splice(doc.flags.indexOf(f), 1); }
  while (bytes(doc) > limit && doc.source_alerts?.length) doc.source_alerts.shift();
  if (bytes(doc) > limit) throw new Error(`flags JSON still over ${limit} bytes`);
  return doc;
}

// ---------- CLI ----------
const STATE_NOTE = "Written only by .github/workflows/trend-watch.yml (tools/trend-watch.mjs). Per-source status, dedupe keys and recent relevant items (short titles and links only). Do not edit by hand.";
const FLAG_NOTE = "Pending trend-watch leads (QUEUE G16, docs/plan/trend-fast-lane.md). A flag is a lead, never a fact: verify on the primary source, build per section 3, then delete the flag in the same commit. source_alerts: feeds that went dark (blocked or unreachable).";

async function main() {
  const dir = new URL("../ops/trend-watch/", import.meta.url);
  const read = (name, fallback) => { const p = new URL(name, dir); return existsSync(p) ? JSON.parse(readFileSync(p, "utf8")) : fallback; };
  const write = (name, data) => { const p = new URL(name, dir); const text = name === "state.json" ? serializeState(data) : serializeFlags(data); if (!existsSync(p) || readFileSync(p, "utf8") !== text) writeFileSync(p, text); };
  const reapply = process.argv.indexOf("--reapply");
  if (reapply > 0) {
    // After a merge conflict: keep main's flags.json (the operator may have deleted handled flags) and add
    // back only what this run raised.
    const flags = read("flags.json", { flags: [], source_alerts: [] });
    flags.flags ||= []; flags.source_alerts ||= [];
    const raised = JSON.parse(readFileSync(process.argv[reapply + 1], "utf8"));
    for (const f of raised.flags || []) upsertTrendFlag(flags.flags, f);
    for (const a of raised.alerts || []) upsertAlert(flags.source_alerts, a);
    write("flags.json", fitFlags({ note: FLAG_NOTE, flags: flags.flags, source_alerts: flags.source_alerts }));
    console.log(`trend-watch: re-applied raised flags; ${flags.flags.length} pending`);
    return;
  }
  const sources = read("sources.json", null);
  const state = read("state.json", {});
  const flags = read("flags.json", { flags: [], source_alerts: [] });
  // Every request gets a 20 s timeout (review P2): a slow source must fail fast, count as an error and be
  // parked like any other, never hang the job until the workflow timeout kills it with nothing committed.
  const fetchImpl = (u, o = {}) => globalThis.fetch(u, { ...o, signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) });
  const result = await runWatch({ sources, state, flags, fetchImpl, log: (m) => console.log(m) });
  write("state.json", fitState({ note: STATE_NOTE, ...result.state }));
  write("flags.json", fitFlags({ note: FLAG_NOTE, ...result.flags }));
  // sources_changed: a source's status changed (new baseline, block, error); the workflow commits state then too.
  const sourcesChanged = JSON.stringify(state.sources || {}) !== JSON.stringify(result.state.sources);
  if (process.env.TREND_WATCH_RAISED) writeFileSync(process.env.TREND_WATCH_RAISED, serializeFlags({ new: result.newFlags, sources_changed: sourcesChanged, ...result.raised }));
  console.log(`trend-watch: ${result.newFlags} new flag(s); ${result.flags.flags.length} pending`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch((err) => { console.error(err?.message || err); process.exit(1); });
}

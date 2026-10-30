// /deals/ hub and one page per Family Deal Check (QUEUE G02, OWNER D11).
// One validated data file (deal-checks.json) feeds every deal page. A check whose expires_on is
// before today's America/New_York date leaves the hub; its own page stays and says the offer ended (or that we stopped listing it, when no deadline was stated).
// No build date is shown, so pages change only when checks are added, edited or end.
// tools/this-week.mjs re-renders these pages daily in the Pages deploy workflow.
import { readFileSync } from "node:fs";
import { contributorCredit } from "./contributors.mjs";
import { siteHeader, siteFooter } from "./site-chrome.mjs";
import { easternDate } from "./sitemap.mjs";
import { withLinkPreview } from "./link-previews.mjs";
import { placeSitePageHero } from "./hero-photos.mjs";

const imageLock = JSON.parse(readFileSync(new URL("../images/commons-images.lock.json", import.meta.url), "utf8"));
// Free licences only: no NonCommercial or NoDerivatives photos (OWNER D17).
const FREE_LICENCE = /^(?:CC0|Public domain|CC BY(?:-SA)? \d\.\d(?: [A-Za-z]+)?)$/;

export const dealsHubPath = "deals/index.html";
export const dealsHubUrl = "https://familytripwise.com/deals/";
export const dealChecksPath = new URL("./deal-checks.json", import.meta.url);
export const dealPagePath = (check) => `deals/${check.id}.html`;
export const dealPageUrl = (check) => `https://familytripwise.com/deals/${check.id}.html`;

const ISO = /^\d{4}-\d{2}-\d{2}$/;
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const TEXT_FIELDS = ["operator", "category", "title", "headline", "family_of_four", "source_label"];
const LIST_FIELDS = ["unclear", "before_booking"];
// Rows every check must carry, in some wording: when booking closes and which children count.
const REQUIRED_TERMS = [/^Book by$/, /^(Travel|Stay)/, /^Child ages$|^Age rule$/];

const e = (value) => String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");

export function longDate(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}

function validDate(iso) {
  if (typeof iso !== "string" || !ISO.test(iso)) return false;
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d;
}

export function readDealChecks(path = dealChecksPath) {
  return JSON.parse(readFileSync(path, "utf8")).checks;
}

// Optional note when the deadline year or day is our reading rather than the page's exact words.
// deadline_stated: false marks a date that is not a booking deadline the page states (we list the check until then);
// such a date never reads as "book by". Short lists keep the date note either way.
export const deadlineLabel = (check) => (check.deadline_stated === false ? "Listed until" : "Book by");
const shortDeadline = (check) => {
  const when = e(longDate(check.expires_on));
  if (check.deadline_stated === false) return `listed until ${when}${check.expires_note ? `; ${e(check.expires_note)}` : ""}`;
  return `book by ${when}${check.expires_note ? `; ${e(check.expires_note)}` : ""}`;
};
// An ended check whose date was never a stated deadline does not claim the offer ended; we only stopped listing it.
export const endedLabel = (check) => (check.deadline_stated === false ? "We stopped listing this check after" : "This offer ended");
const dateNote = (check) => (check.expires_note ? ` (${e(check.expires_note)})` : "");

export function isEnded(check, today = easternDate()) {
  return check.expires_on < today;
}

// G09 step 2 (OWNER D15): every check carries a score that decides whether it is shared on social.
// family_value is rated only from observed prices: a level other than "unknown" needs an observed
// family_total plus an observed regular price for the same party and dates (family_value.compare).
// "worth_it" needs a rated family value, so a deal without observed family math is at most "only_for".
// Urgency is not stored (it would go stale): dealUrgency() derives it from expires_on on the day.
export const VERDICTS = ["worth_it", "only_for", "skip"];
const VALUE_LEVELS = ["unknown", "low", "medium", "high"];
const APPEAL_LEVELS = ["broad", "medium", "narrow"];
// none_found: a quick search on checked_on found no coverage; agency_listed: only travel-agency or
// coupon listings; news_covered: news or travel-media coverage. The links are what the search showed.
const NOVELTY_LEVELS = ["none_found", "agency_listed", "news_covered"];
const hostOf = (url) => { try { return new URL(url).hostname; } catch { return ""; } };
const onDomain = (host, domain) => Boolean(host && domain) && (host === domain || host.endsWith(`.${domain}`));
const sentence = (x) => typeof x === "string" && x.trim().length > 10;

export function dealUrgency(check, today = easternDate()) {
  if (check.deadline_stated === false || isEnded(check, today)) return "low";
  const days = Math.round((Date.parse(`${check.expires_on}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`)) / 86400000);
  return days <= 3 ? "high" : days <= 10 ? "medium" : "low";
}

export function validateDealScore(check, { today = easternDate() } = {}) {
  const where = `check ${check?.id ?? "(no id)"}`;
  const s = check?.score;
  if (!s || typeof s !== "object") return [`${where}: score is required (G09 step 2)`];
  const problems = [];
  if (!validDate(s.scored_on) || s.scored_on < check.observed_on || s.scored_on > today) problems.push(`${where}: score.scored_on must be a real date between observed_on and today`);
  const v = s.family_value ?? {};
  if (!VALUE_LEVELS.includes(v.level) || !sentence(v.basis)) problems.push(`${where}: score.family_value needs level (${VALUE_LEVELS.join("/")}) and basis`);
  else if (v.level !== "unknown") {
    const c = v.compare ?? {};
    const t = check.family_total;
    const ok = t && typeof t.amount === "string" && /^[A-Z]{3} [\d,]+(\.\d\d)?$/.test(t.amount) && validDate(t.observed_on) && typeof c.amount === "string" && /^[A-Z]{3} [\d,]+(\.\d\d)?$/.test(c.amount) && validDate(c.observed_on) && sentence(c.basis);
    if (!ok) problems.push(`${where}: a rated family_value needs an observed family_total and compare {amount, observed_on, basis} for the same party and dates`);
    else {
      const [tCur, tNum] = [t.amount.slice(0, 3), Number(t.amount.slice(4).replaceAll(",", ""))];
      const [cCur, cNum] = [c.amount.slice(0, 3), Number(c.amount.slice(4).replaceAll(",", ""))];
      if (!/\b2 adults\b.*\b2 (children|kids)\b/i.test(String(t.party))) problems.push(`${where}: a rated family_value needs a family_total for 2 adults and 2 children`);
      if (tCur !== cCur) problems.push(`${where}: family_value.compare must use the family_total currency`);
      else if (!(cNum > tNum)) problems.push(`${where}: family_value.compare must be above the family_total (a saving)`);
      if (c.observed_on !== t.observed_on) problems.push(`${where}: family_value.compare must be observed the same day as the family_total`);
    }
  }
  const a = s.appeal ?? {};
  if (!APPEAL_LEVELS.includes(a.level) || !sentence(a.fits)) problems.push(`${where}: score.appeal needs level (${APPEAL_LEVELS.join("/")}) and fits`);
  const n = s.novelty ?? {};
  const links = n.links ?? [];
  if (!NOVELTY_LEVELS.includes(n.level) || !validDate(n.checked_on) || n.checked_on > today || !Array.isArray(links)) problems.push(`${where}: score.novelty needs level (${NOVELTY_LEVELS.join("/")}), checked_on and links`);
  else {
    if (!links.every((l) => l && sentence(l.label) && /^https:\/\/[^\s]+$/.test(l.url ?? ""))) problems.push(`${where}: score.novelty.links must be {label, url} with https URLs`);
    if (n.level === "none_found" && links.length) problems.push(`${where}: novelty none_found cannot list coverage links`);
    if (n.level !== "none_found" && !links.length) problems.push(`${where}: novelty ${n.level} needs at least one link`);
    const official = hostOf(check.official_url).split(".").slice(-2).join(".");
    if (links.some((l) => onDomain(hostOf(l?.url), official))) problems.push(`${where}: novelty links must be coverage by others, not the operator's own site`);
  }
  if (!VERDICTS.includes(s.verdict)) problems.push(`${where}: score.verdict must be one of ${VERDICTS.join("/")}`);
  if (s.verdict === "worth_it" && !["medium", "high"].includes(v.level)) problems.push(`${where}: worth_it needs an observed family_value of medium or high`);
  if (s.verdict === "only_for" && !sentence(s.who)) problems.push(`${where}: only_for needs who (the families it fits)`);
  if (s.verdict !== "only_for" && s.who !== undefined) problems.push(`${where}: who is only for only_for verdicts`);
  if (!sentence(s.why)) problems.push(`${where}: score.why is required`);
  return problems;
}

// Returns a list of problems; an empty list means every check may be published.
export function validateDealChecks(checks, { today = easternDate() } = {}) {
  const problems = [];
  const ids = new Set();
  for (const check of checks) {
    const id = check?.id;
    const where = `check ${id ?? "(no id)"}`;
    if (typeof id !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) problems.push(`${where}: id must be kebab-case`);
    if (ids.has(id)) problems.push(`${where}: duplicate id`);
    ids.add(id);
    for (const field of TEXT_FIELDS) {
      if (typeof check[field] !== "string" || check[field].trim().length < 3) problems.push(`${where}: ${field} is required`);
    }
    for (const field of LIST_FIELDS) {
      if (!Array.isArray(check[field]) || !check[field].every((x) => typeof x === "string" && x.length > 10)) problems.push(`${where}: ${field} must be a list of sentences`);
    }
    if (!Array.isArray(check.terms) || check.terms.length < 4 || !check.terms.every((row) => Array.isArray(row) && row.length === 2 && row.every((x) => typeof x === "string" && x.trim().length > 1))) {
      problems.push(`${where}: terms must be at least 4 [label, value] rows`);
    } else {
      for (const pattern of REQUIRED_TERMS) if (!check.terms.some(([label]) => pattern.test(label))) problems.push(`${where}: terms need a row matching ${pattern}`);
    }
    if (typeof check.official_url !== "string" || !/^https:\/\/[^\s]+$/.test(check.official_url)) problems.push(`${where}: official_url must be an https URL`);
    for (const field of ["observed_on", "expires_on"]) if (!validDate(check[field])) problems.push(`${where}: ${field} must be a real YYYY-MM-DD date`);
    if (validDate(check.observed_on) && check.observed_on > today) problems.push(`${where}: observed_on is in the future`);
    if (check.expires_on < check.observed_on) problems.push(`${where}: expires_on is before observed_on`);
    if (check.expires_note !== undefined && !(typeof check.expires_note === "string" && check.expires_note.length > 10)) problems.push(`${where}: expires_note must be a sentence when present`);
    if (check.deadline_stated !== undefined && typeof check.deadline_stated !== "boolean") problems.push(`${where}: deadline_stated must be true or false when present`);
    if (check.deadline_stated === false && !check.expires_note) problems.push(`${where}: a date that is not a stated deadline needs an expires_note saying why it is listed`);
    // A family total is published only when observed for a named party on named dates.
    if (check.family_total !== null) {
      const t = check.family_total || {};
      const ok = typeof t.amount === "string" && /^[A-Z]{3} [\d,]+(\.\d\d)?$/.test(t.amount) && typeof t.party === "string" && t.party.length > 5 && validDate(t.stay_from) && validDate(t.stay_to) && typeof t.includes === "string" && t.includes.length > 5 && validDate(t.observed_on);
      if (!ok) problems.push(`${where}: family_total must be null or {amount "USD 1,234.00", party, stay_from, stay_to, includes, observed_on}`);
      else if (t.stay_from < today) problems.push(`${where}: family_total stay dates have started or passed; remove it or re-observe`);
    }
    // No carried-forward years in what the hub and title say.
    const observedYear = Number(String(check.observed_on).slice(0, 4));
    for (const field of ["title", "headline"]) {
      for (const match of String(check[field] ?? "").matchAll(/\b(20\d\d)\b/g)) {
        if (Number(match[1]) < observedYear) problems.push(`${where}: ${field} mentions ${match[1]}, before the observation year`);
      }
    }
    problems.push(...validateDealScore(check, { today }));
    if (check.v2 !== undefined) problems.push(...validateDealV2(check, { today }));
  }
  return problems;
}


// G11 deal content v2 (AGENTS.md Content Standard, docs/plan/deal-content-v2.md). A check with a v2 block
// renders in the parent-first order: context line, plain headline, verdict, cost and savings for a family
// of 4, what you get, is it a good deal, the catch, how to get it, things to do there, pros and cons, full
// terms, sources and "how we check" last. v2 text uses "$", never "USD", and carries no placeholder lines.
const V2_TEXT = ["page_title", "context", "big_number", "big_label", "headline", "best_for", "not_for", "cost", "saves", "family"];
const V2_LISTS = { get: [2, 4], compare: [1, 3], catch: [1, 3], how: [2, 5], pros: [2, 4], cons: [2, 4] };
const V2_PLACEHOLDER = /\b(?:not observed|tbd|tba|n\/a|lorem ipsum)\b/i;
const POST_LINE_MAX = 140;
const POST_LINES_MAX = 340;
const VERDICT_POST = { worth_it: "Worth it", only_for: "Only for " };
const validSource = (src) => src && sentence(src.label) && /^https:\/\/[^\s]+$/.test(src.url ?? "") && validDate(src.observed_on);

export function validateDealV2(check, { today = easternDate() } = {}) {
  const where = `check ${check?.id ?? "(no id)"} v2`;
  const v = check.v2;
  if (!v || typeof v !== "object") return [`${where}: must be an object`];
  const problems = [];
  const texts = [];
  for (const field of V2_TEXT) {
    if (typeof v[field] !== "string" || v[field].trim().length < 3) problems.push(`${where}: ${field} is required`);
    else texts.push(v[field]);
  }
  for (const [field, [min, max]] of Object.entries(V2_LISTS)) {
    const list = v[field];
    if (!Array.isArray(list) || list.length < min || list.length > max || !list.every(sentence)) problems.push(`${where}: ${field} must be ${min}-${max} sentences`);
    else texts.push(...list);
  }
  const t = v.things_to_do ?? {};
  if (!Array.isArray(t.items) || t.items.length < 2 || !t.items.every(sentence) || !validSource(t.source)) problems.push(`${where}: things_to_do needs 2+ items and a dated https source`);
  else {
    texts.push(...t.items);
    if (t.source.observed_on > today) problems.push(`${where}: things_to_do source observed in the future`);
  }
  if (!validSource(v.context_source) || v.context_source?.observed_on > today) problems.push(`${where}: context_source needs a dated https source`);
  // Other official pages the v2 copy relies on (for example a price used for comparison) are listed in the sources.
  if (v.extra_sources !== undefined && (!Array.isArray(v.extra_sources) || !v.extra_sources.every((src) => validSource(src) && src.observed_on <= today && sentence(src.covers)))) problems.push(`${where}: extra_sources must be dated https sources with what they cover`);
  if (!/\$\d/.test(v.headline ?? "") || !/\$\d/.test(v.big_number ?? "")) problems.push(`${where}: headline and big_number must state a $ amount`);
  // Optional short form of expires_note for the hero chip and the post (the full note stays in the terms and status lines).
  if (v.date_note_short !== undefined && !(check.expires_note && /reading/.test(check.expires_note) && typeof v.date_note_short === "string" && v.date_note_short.length >= 6 && v.date_note_short.length <= 30 && /reading/.test(v.date_note_short))) problems.push(`${where}: date_note_short must be a 6-30 character note saying the date is our reading, and needs an expires_note`);
  if (!Array.isArray(v.chips) || v.chips.length < 1 || v.chips.length > 4 || !v.chips.every((x) => typeof x === "string" && x.length >= 4 && x.length <= 40)) problems.push(`${where}: chips must be 1-4 short labels`);
  else texts.push(...v.chips);
  if (check.family_total === null && /\$\s?\d/.test(v.cost ?? "")) problems.push(`${where}: no family total was observed, so the cost line cannot state a $ amount`);
  if (!/^Trip cost\b/.test(v.cost ?? "") || !/^Saves\b/.test(v.saves ?? "")) problems.push(`${where}: cost starts "Trip cost", saves starts "Saves"`);
  if (!/\b2 adults\b.*\b2 (?:kids|children)\b.*\baged? \d/i.test(v.family ?? "")) problems.push(`${where}: family must name 2 adults and 2 kids with ages`);
  if (v.hero_image !== undefined) {
    const img = imageLock[v.hero_image?.slug];
    if (!img) problems.push(`${where}: hero_image.slug must be a self-hosted photo in tools/images/commons-images.lock.json`);
    else if (!FREE_LICENCE.test(img.license ?? "") || !img.artist || !img.source_page) problems.push(`${where}: hero_image needs a free licence, an author and a source page`);
    if (!sentence(v.hero_image?.alt) || !sentence(v.hero_image?.caption)) problems.push(`${where}: hero_image needs alt and caption`);
  }
  // Optional dated hotel price sample (QUEUE G12): a provider reading for a named family party and stay dates,
  // shown as a labelled estimate beside the official terms, never as a quote, a total or a saving. The page
  // drops it automatically once the stay start date arrives (deal pages re-render daily).
  if (v.price_sample !== undefined) {
    const ps = v.price_sample;
    const n = (x) => Number.isInteger(x) && x > 0 && x < 100000;
    const ok = ps && typeof ps === "object" && sentence(ps.hotel) && n(ps.amount) && (ps.low === undefined || (n(ps.low) && n(ps.high) && ps.low <= ps.amount && ps.amount <= ps.high))
      && /^2 adults and 2 kids aged \d+ and \d+$/.test(ps.party ?? "") && validDate(ps.stay_from) && validDate(ps.stay_to) && ps.stay_to > ps.stay_from
      && validDate(ps.observed_on) && ps.observed_on <= today && ps.observed_on < ps.stay_from && sentence(ps.source_label) && /^https:\/\/[^\s]+$/.test(ps.source_url ?? "")
      && sentence(ps.caveat) && !/\$\s?\d|\bUSD\b|\btotal\b|\bsav/i.test(ps.caveat)
      && (ps.low === undefined || (sentence(ps.range_note) && /\{low\}/.test(ps.range_note) && /\{high\}/.test(ps.range_note) && !/\$\s?\d|\bUSD\b|\btotal\b|\bsav/i.test(ps.range_note.replace(/\{(?:low|high)\}/g, ""))))
      && String(v.family ?? "").includes(ps.party.replace(/^2 adults and 2 kids /, ""));
    if (ok) texts.push(ps.hotel, ps.caveat, ...(ps.range_note ? [ps.range_note] : []));
    if (!ok) problems.push(`${where}: price_sample needs hotel, whole-dollar amount (and optional low/high with range_note), party "2 adults and 2 kids aged X and Y", stay_from/stay_to after observed_on, source_label, https source_url and a caveat without $ figures; the range_note uses {low} and {high}; v2.family names the same kids' ages`);
  }
  // Optional short pill naming who an "Only for" deal suits (replaces the generic "Only for some families").
  if (v.verdict_pill !== undefined && (check.score?.verdict !== "only_for" || typeof v.verdict_pill !== "string" || !/^Only for \S/.test(v.verdict_pill) || v.verdict_pill.length > 30)) problems.push(`${where}: verdict_pill must start "Only for " (at most 30 characters) and needs an only_for verdict`);
  else if (v.verdict_pill !== undefined) texts.push(v.verdict_pill);
  if (v.og_image !== `images/og/deals/${check.id}.png`) problems.push(`${where}: og_image must be images/og/deals/${check.id}.png`);
  // Social post lines (docs/plan/deal-content-v2.md "Posts"): hook with the key number and the place,
  // verdict and who it is for, the catch; tools/social-queue.mjs adds the book-by line and the dated check.
  const post = v.post;
  if (!post || typeof post !== "object") problems.push(`${where}: post (title, hook, verdict, catch) is required`);
  else {
    for (const field of ["hook", "verdict", "catch"]) {
      if (!sentence(post[field]) || post[field].length > POST_LINE_MAX) problems.push(`${where}: post.${field} must be one sentence of at most ${POST_LINE_MAX} characters`);
      else texts.push(post[field]);
    }
    if (!/\$\d/.test(post.hook ?? "")) problems.push(`${where}: post.hook must state the key $ number`);
    if (typeof post.title !== "string" || post.title.length < 10 || post.title.length > 100 || !/\$\d/.test(post.title)) problems.push(`${where}: post.title (Pinterest, TikTok, YouTube) must be 10-100 characters with the $ number`);
    else texts.push(post.title);
    const label = VERDICT_POST[check.score?.verdict];
    if (!label || !String(post.verdict ?? "").startsWith(`${label}`)) problems.push(`${where}: post.verdict must start "${label ?? "Worth it/Only for"}" to match the scored verdict`);
    if (!/^The catch: /.test(post.catch ?? "")) problems.push(`${where}: post.catch starts "The catch: "`);
    // Dates and night counts in the post must be ones the observed terms state, like $ figures below.
    const termsText = [...(check.terms ?? []).flat(), longDate(check.expires_on ?? "")].join(" ");
    const postText = ["title", "hook", "verdict", "catch"].map((f) => String(post[f] ?? "")).join(" ");
    for (const m of postText.matchAll(/\b(January|February|March|April|May|June|July|August|September|October|November|December) (\d{1,2})\b/g)) {
      if (!new RegExp(`\\b${m[1]} ${m[2]}\\b`).test(termsText)) problems.push(`${where}: post date "${m[0]}" is not a date the observed terms state`);
    }
    for (const m of postText.matchAll(/\b(\d+)\+? (?:paid )?nights?\b/g)) {
      if (!new RegExp(`\\b${m[1]}\\+? (?:paid[- ])?nights?\\b`, "i").test(termsText)) problems.push(`${where}: post night count "${m[0]}" is not in the observed terms`);
    }
    const total = ["hook", "verdict", "catch"].reduce((n, f) => n + String(post[f] ?? "").length, 0);
    if (total > POST_LINES_MAX) problems.push(`${where}: post lines total ${total} characters; keep them under ${POST_LINES_MAX} so the post stays about 350-400`);
  }
  for (const text of texts) {
    if (/\bUSD\b/.test(text)) problems.push(`${where}: use "$", not "USD" ("${text.slice(0, 40)}")`);
    if (V2_PLACEHOLDER.test(text)) problems.push(`${where}: placeholder wording ("${text.slice(0, 40)}")`);
  }
  // Every $ figure in v2 copy must be one the observed terms (or an observed family total) state, so the
  // presentation layer can never introduce a price, fee or saving of its own.
  const termText = [...(check.terms ?? []).flat(), check.family_total?.amount ?? ""].join(" ");
  const stated = new Set([...termText.matchAll(/(?:USD|\$)\s?([\d,]+(?:\.\d\d)?)/g)].map((m) => m[1].replaceAll(",", "")));
  for (const text of [...texts, v.big_number ?? ""]) {
    for (const m of String(text).matchAll(/\$\s?([\d,]+(?:\.\d\d)?)/g)) {
      if (!stated.has(m[1].replaceAll(",", ""))) problems.push(`${where}: $${m[1]} is not a figure the observed terms state ("${String(text).slice(0, 40)}")`);
    }
  }
  // A dollar total for the family is never claimed in v2 copy without an observed family_total.
  if (check.family_total === null && /\btotal\b[^.]*\$\d|\$\d[^.]*\btotal\b/i.test(texts.join(" "))) problems.push(`${where}: no family total was observed, so v2 copy cannot state one`);
  if (v.spend_save !== undefined) problems.push(...validateSpendSave(check, stated, today));
  return problems;
}

// v3 spend-vs-save card (AGENTS.md Content Standard 2026-10-30; OWNER D21/O10): "Without the deal ≈ $A ·
// With the deal ≈ $B · You save ≈ $C (D%)" for a named party and unit, labelled estimate. Each side is a
// sum of parts; every part is a figure the observed terms state (or the dated hotel price sample) times a
// whole quantity, with its own dated source, so the generator only adds and multiplies observed figures.
const SPEND_SIDES = ["without", "with"];
const SPEND_WORDS_MAX = 30;
const words = (x) => String(x ?? "").trim().split(/\s+/).filter(Boolean).length;
function validateSpendSave(check, stated, today) {
  const where = `check ${check.id} v2.spend_save`;
  const v = check.v2;
  const ss = v.spend_save;
  const problems = [];
  if (!ss || typeof ss !== "object") return [`${where}: must be an object`];
  if (!/^2 adults and 2 kids aged (\d+) and (\d+)$/.test(ss.party ?? "") || !String(v.family ?? "").includes(ss.party.replace(/^2 adults and 2 kids /, ""))) problems.push(`${where}: party must be "2 adults and 2 kids aged X and Y" with the same ages as v2.family`);
  if (!sentence(ss.unit) || ss.unit.length > 60) problems.push(`${where}: unit (what one comparison covers, for example "one night and one park day") is required, at most 60 characters`);
  if (!sentence(ss.note) || !/\b(?:rough|estimate)\b/i.test(ss.note)) problems.push(`${where}: note must say why this is a rough estimate (dates, ticket types, taxes)`);
  if (typeof ss.unit_short !== "string" || ss.unit_short.length < 4 || ss.unit_short.length > 24) problems.push(`${where}: unit_short (the unit for posts, at most 24 characters) is required`);
  if (typeof ss.basis !== "string" || ss.basis.length < 8 || words(ss.basis) > 12 || /\$\s?\d|\bUSD\b/.test(ss.basis)) problems.push(`${where}: basis must be a short note (at most 12 words, no $ figures) on what the estimate leaves out, for example tax and parking`);
  if (!sentence(ss.verdict_line) || words(ss.verdict_line) > SPEND_WORDS_MAX) problems.push(`${where}: verdict_line must be one plain sentence of at most ${SPEND_WORDS_MAX} words`);
  // Concise top of page (Content Standard): the lines above the first details stay short.
  for (const [name, text] of [["score.why", check.score?.why], ["best_for", v.best_for], ["not_for", v.not_for]]) {
    if (words(text) > SPEND_WORDS_MAX) problems.push(`${where}: ${name} has ${words(text)} words; keep it to ${SPEND_WORDS_MAX} on a v3 page`);
  }
  const ps = v.price_sample;
  const ok$ =(text) => [...String(text ?? "").matchAll(/\$\s?([\d,]+(?:\.\d\d)?)/g)].every((m) => stated.has(m[1].replaceAll(",", "")) || (ps && Number(m[1].replaceAll(",", "")) === ps.amount));
  for (const side of SPEND_SIDES) {
    const s = ss[side];
    if (!s || !sentence(s.includes) || !Array.isArray(s.parts) || s.parts.length < 1 || s.parts.length > 4) { problems.push(`${where}: ${side} needs includes and 1-4 parts`); continue; }
    if (!ok$(s.includes)) problems.push(`${where}: ${side}.includes states a $ figure the terms do not`);
    s.parts.forEach((p, i) => {
      const at = `${where}: ${side}.parts[${i}]`;
      if (!p || !sentence(p.what) || !ok$(p.what)) problems.push(`${at}: what must describe the figure and state only observed $ figures`);
      if (!Number.isInteger(p?.qty) || p.qty < 1 || p.qty > 20) problems.push(`${at}: qty must be a whole number 1-20`);
      if (!(typeof p?.unit_amount === "number" && p.unit_amount > 0 && Math.round(p.unit_amount * 100) === p.unit_amount * 100)) problems.push(`${at}: unit_amount must be a positive dollar figure`);
      if (p?.from === "terms") {
        if (!stated.has(String(p.unit_amount))) problems.push(`${at}: $${p.unit_amount} is not a figure the observed terms state`);
        if (!validSource(p.source) || p.source.observed_on > today) problems.push(`${at}: a terms part needs a dated https source`);
      } else if (p?.from === "price_sample") {
        if (ps && !String(p.what ?? "").includes(shortStay(ps.stay_from, ps.stay_to).replace(/, \d{4}$/, ""))) problems.push(`${at}: what must name the sampled stay dates (${shortStay(ps.stay_from, ps.stay_to)})`);
        if (!ps || ps.amount !== p.unit_amount || ps.party !== ss.party) problems.push(`${at}: a price_sample part must use v2.price_sample.amount for the same party`);
      } else problems.push(`${at}: from must be "terms" or "price_sample"`);
    });
  }
  const r = problems.length ? null : spendSave(check, "0000-01-01");
  if (r?.ok && r.save_pct < 5 && !/\bnot (?:a discount|really cheaper|cheaper)\b/i.test(ss.verdict_line)) problems.push(`${where}: the deal saves under 5%, so verdict_line must say plainly it is not a discount or not really cheaper`);
  for (const text of [ss.unit, ss.note, ss.verdict_line]) {
    if (/\bUSD\b/.test(String(text))) problems.push(`${where}: use "$", not "USD"`);
    if (!ok$(text)) problems.push(`${where}: "${String(text).slice(0, 40)}" states a $ figure the terms do not`);
  }
  return problems;
}

const usd = (n) => `$${n.toLocaleString("en-US")}`;
// Builds the card from a validated spend_save. A side that relies on the hotel price sample cannot be built
// once the sampled stay has started (or the deal has ended): then the card says what is missing instead.
export function spendSave(check, today = easternDate()) {
  const v = check.v2;
  const ss = v?.spend_save;
  if (!ss) return null;
  const psLive = Boolean(v.price_sample && v.price_sample.stay_from > today);
  const sides = {};
  for (const side of SPEND_SIDES) {
    const parts = ss[side].parts.map((p) => ({ ...p, amount: Math.round(p.unit_amount * p.qty), source: p.from === "price_sample" ? { label: v.price_sample.source_label, url: v.price_sample.source_url, observed_on: v.price_sample.observed_on } : p.source }));
    sides[side] = { includes: ss[side].includes, parts, total: parts.reduce((n, p) => n + p.amount, 0), stale: parts.some((p) => p.from === "price_sample") && !psLive };
  }
  const checkedOn = [...new Set(SPEND_SIDES.flatMap((x) => sides[x].parts.map((p) => p.source.observed_on)))].sort();
  const sample = SPEND_SIDES.some((x) => ss[x].parts.some((p) => p.from === "price_sample")) ? v.price_sample : null;
  const checkedText = checkedOn.length > 1 && checkedOn[0].slice(0, 7) === checkedOn.at(-1).slice(0, 7) ? `${longDate(checkedOn[0]).replace(/, \d{4}$/, "")} to ${Number(checkedOn.at(-1).slice(8))}, ${checkedOn[0].slice(0, 4)}` : checkedOn.map(longDate).join(" and ");
  const basis = `${sample ? `Hotel price for ${shortStay(sample.stay_from, sample.stay_to)}; ` : ""}prices checked ${checkedText}. ${ss.basis}`;
  const base = { party: ss.party, unit: ss.unit, note: ss.note, verdict_line: ss.verdict_line, sides, basis, sample_month: sample ? MONTHS[Number(sample.stay_from.slice(5, 7)) - 1] : null };
  if (isEnded(check, today)) return { ...base, ok: false, missing: "The deal has ended, so we no longer compare its price." };
  const stale = SPEND_SIDES.filter((side) => sides[side].stale);
  if (stale.length) return { ...base, ok: false, missing: `We cannot price ${stale.map((x) => (x === "with" ? "the deal" : "the trip without the deal")).join(" or ")} right now: the hotel price we saw was for dates that have now started. Price your own dates on the official site.` };
  const A = sides.without.total;
  const B = sides.with.total;
  const save = A - B;
  const save_pct = Math.round((save / A) * 100);
  const saveText = save > 0
    ? `You save ≈ ${usd(save)} (${save_pct}%)`
    : save === 0 ? "You save ≈ $0 (same price)" : `You save nothing: it costs ≈ ${usd(-save)} (${-save_pct}%) more`;
  const postSave = save > 0 ? `you save ≈ ${usd(save)} (${save_pct}%)` : save === 0 ? "you save $0" : `you save nothing (≈ ${usd(-save)} more)`;
  return { ...base, ok: true, without: A, with: B, save, save_pct, saveText, line: `Without the deal ≈ ${usd(A)} · With the deal ≈ ${usd(B)} · ${saveText}`, post: `Family of 4, ${ss.unit_short}${base.sample_month ? ` (${base.sample_month.slice(0, 3)} hotel price)` : ""}, estimate: without the deal ≈ ${usd(A)} · with it ≈ ${usd(B)} · ${postSave}.` };
}

// The card at the top of a v3 deal page, and the breakdown under it (every part with its dated source).
function spendSaveCard(check, today) {
  const r = spendSave(check, today);
  if (!r) return "";
  const head = `<p class="ss-title">Estimate for ${e(r.party)}, ${e(r.unit)}</p>`;
  if (!r.ok) return `<div class="spend-save spend-save-missing" role="group" aria-label="What it costs a family of 4">${head}<p>${e(r.missing)}</p></div>`;
  return `<div class="spend-save${r.save_pct < 5 ? " spend-save-nodeal" : ""}" role="group" aria-label="What it costs a family of 4 with and without the deal">${head}
              <dl class="ss-row"><div><dt>Without the deal</dt><dd>≈ ${e(usd(r.without))}</dd></div><div><dt>With the deal</dt><dd>≈ ${e(usd(r.with))}</dd></div><div class="ss-save"><dt>You save</dt><dd>${r.save > 0 ? `≈ ${e(usd(r.save))} <small>(${r.save_pct}%)</small>` : r.save === 0 ? "≈ $0" : `nothing <small>(≈ ${e(usd(-r.save))} more)</small>`}</dd></div></dl>
              <p class="ss-basis">${e(r.basis)}</p>
              <p class="ss-verdict">${e(r.verdict_line)}</p>
            </div>`;
}

function spendSaveDetails(check, today) {
  const r = spendSave(check, today);
  if (!r?.ok) return "";
  const rows = SPEND_SIDES.flatMap((side) => [
    `<tr class="ss-side"><th scope="rowgroup" colspan="3">${side === "with" ? "With the deal" : "Without the deal"} ≈ ${e(usd(r.sides[side].total))}: ${e(r.sides[side].includes)}</th></tr>`,
    ...r.sides[side].parts.map((p) => `<tr><td>${e(p.what)}</td><td>${p.qty > 1 ? `${e(usd(p.unit_amount))} × ${p.qty} = ` : ""}${e(usd(p.amount))}</td><td><a href="${e(p.source.url)}">${e(p.source.label)}</a>, checked ${e(longDate(p.source.observed_on))}</td></tr>`)
  ]).join("");
  return `        <details class="ss-details">
          <summary>How we got these numbers</summary>
          <div class="table-wrap"><table class="ss-table"><caption>Estimate for ${e(r.party)}, ${e(r.unit)}: sums of published and observed prices, not a quote</caption><thead><tr><th scope="col">Part</th><th scope="col">Amount</th><th scope="col">Source</th></tr></thead><tbody>${rows}</tbody></table></div>
          <p>${e(r.note)}</p>
        </details>`;
}

const VERDICT_TEXT = { worth_it: "Worth it", only_for: "Only for some families", skip: "Skip" };
const list = (items, cls = "") => `<ul${cls ? ` class="${cls}"` : ""}>${items.map((x) => `<li>${e(x)}</li>`).join("")}</ul>`;
const sourceLine = (src) => `<a href="${e(src.url)}">${e(src.label)}</a>, checked ${e(longDate(src.observed_on))}`;

const nights = (ps) => Math.round((Date.parse(`${ps.stay_to}T00:00:00Z`) - Date.parse(`${ps.stay_from}T00:00:00Z`)) / 86400000);
const shortStay = (from, to) => {
  const [a, b] = [longDate(from), longDate(to)];
  const [am, ad, ay] = a.replace(",", "").split(" ");
  const [bm, bd, by] = b.replace(",", "").split(" ");
  return am === bm && ay === by ? `${am} ${ad} to ${bd}, ${ay}` : `${a} to ${b}`;
};
// Visible only while the sampled stay is still ahead (never a price sample whose stay dates have started or passed).
export function priceSampleLine(v, today = easternDate()) {
  const ps = v.price_sample;
  if (!ps || ps.stay_from <= today) return "";
  const range = ps.low === undefined ? "" : ` ${ps.range_note.replace(/\{low\}/g, usd(ps.low)).replace(/\{high\}/g, usd(ps.high))}`;
  return `<p class="deal-price-sample"><strong>Hotel price we saw (estimate, not a quote):</strong> about ${e(usd(ps.amount))} a night at the ${e(ps.hotel)} for ${e(ps.party)}, ${nights(ps)} nights, ${e(shortStay(ps.stay_from, ps.stay_to))}, on <a href="${e(ps.source_url)}">${e(ps.source_label)}</a>, checked ${e(longDate(ps.observed_on))}.${e(range)} ${e(ps.caveat)}</p>`;
}

function heroFigure(v) {
  if (!v.hero_image) return "";
  const img = imageLock[v.hero_image.slug];
  return `        <figure class="container licensed-photo deal-photo">
          <img src="../${e(img.path)}" alt="${e(v.hero_image.alt)}" width="${img.width}" height="${img.height}" class="intrinsic-photo" loading="eager" fetchpriority="high" decoding="async">
          <figcaption>${e(v.hero_image.caption)} Photo: ${e(img.artist)}, Wikimedia Commons, ${img.license_url ? `<a href="${e(img.license_url)}">${e(img.license)}</a>` : e(img.license)}; Family Tripwise serves a resized copy. <a href="${e(img.source_page)}">License and source</a>.</figcaption>
        </figure>`;
}

function dealCheckPageV2(checks, check, today, ended) {
  const v = check.v2;
  const s = check.score;
  // v3: a buildable spend-vs-save card replaces the saves/cost lines at the top; they move into its details.
  const v3 = !ended && Boolean(spendSave(check, today)?.ok);
  const rows = check.terms.map(([label, value]) => `<tr role="row"><th scope="row" role="rowheader">${e(label)}</th><td role="cell">${e(String(value).replace(/\bUSD ?(?=\d)/g, "$"))}</td></tr>`).join("");
  const status = ended
    ? `<p class="deal-status deal-status-ended" role="status"><strong>${endedLabel(check)} ${e(longDate(check.expires_on))}${dateNote(check)}.</strong> The details below are what the official page said when we checked; they are kept for reference only.</p>`
    : `<p class="deal-status"><strong>${deadlineLabel(check)} ${e(longDate(check.expires_on))}</strong>${dateNote(check)}.</p>`;
  const sources = [
    [check.source_label, check.official_url, check.observed_on, "the offer terms"],
    [v.context_source.label, v.context_source.url, v.context_source.observed_on, v.context_source.covers ?? "where the resorts are and what they include"],
    ...(v.things_to_do.source.url === v.context_source.url ? [] : [[v.things_to_do.source.label, v.things_to_do.source.url, v.things_to_do.source.observed_on, "things to do"]]),
    ...(v.extra_sources ?? []).map((src) => [src.label, src.url, src.observed_on, src.covers]),
    ...(!ended && priceSampleLine(v, today) ? [[v.price_sample.source_label, v.price_sample.source_url, v.price_sample.observed_on, "the hotel price we saw (an estimate, not a quote)"]] : [])
  ];
  if (v3) {
    for (const side of SPEND_SIDES) for (const p of spendSave(check, today).sides[side].parts) {
      if (!sources.some(([, url]) => url === p.source.url)) sources.push([p.source.label, p.source.url, p.source.observed_on, "a price in the spend-vs-save estimate"]);
    }
  }
  const body = `    <main id="main" class="deal-v2">
      <section class="page-hero deal-hero">
        <div class="container deal-hero-grid">
          <div>
            <p class="eyebrow deal-context">${e(v.context)}</p>
            <h1>${e(v.headline)}</h1>${!ended && v.spend_save ? `
            ${spendSaveCard(check, today)}` : ""}
            ${ended ? "" : `<ul class="deal-chips" aria-label="Key terms"><li class="deal-chip-verdict deal-verdict-${e(s.verdict)}">${e(v.verdict_pill ?? VERDICT_TEXT[s.verdict])}</li><li>${e(deadlineLabel(check))} ${e(longDate(check.expires_on))}${check.deadline_stated === false ? "" : (v.date_note_short ? ` (${e(v.date_note_short)})` : dateNote(check))}</li>${v.chips.map((x) => `<li>${e(x)}</li>`).join("")}</ul>`}
            ${ended ? status : ""}
            ${contributorCredit()}
          </div>
          <div class="deal-big" aria-hidden="true"><span class="deal-big-number${v.big_number.length > 5 ? " deal-big-number-long" : ""}">${e(v.big_number)}</span><span class="deal-big-label">${e(v.big_label)}</span></div>
        </div>
      </section>
      <section id="deal-answer" class="container answer-box deal-glance" aria-label="Verdict, cost and savings">
${ended ? `        <p class="deal-verdict">While it ran: ${e(v.saves.replace(/^Saves:\s*/, ""))}</p>` : `        <p class="deal-verdict deal-verdict-${e(s.verdict)}"><strong>Our verdict:</strong> ${e(s.why)}</p>
        <p><strong>Best for:</strong> ${e(v.best_for)}</p>
        <p><strong>Not for:</strong> ${e(v.not_for)}</p>
${v3 ? `${spendSaveDetails(check, today).replace("</details>", `  <p>${e(v.cost)}</p>${priceSampleLine(v, today) ? `
          ${priceSampleLine(v, today)}` : ""}
        </details>`)}` : `        <p class="deal-money"><strong>${e(v.saves)}</strong></p>
        <p>${e(v.cost)}</p>${priceSampleLine(v, today) ? `
        ${priceSampleLine(v, today)}` : ""}`}`}
      </section>
${heroFigure(v)}
      <section class="container page-section" aria-labelledby="deal-get-title">
        <h2 id="deal-get-title">What a family of 4 gets</h2>
        <p>${e(v.family)}</p>
        ${list(v.get)}
      </section>
      <section class="container page-section" aria-labelledby="deal-compare-title">
        <h2 id="deal-compare-title">Is it a good deal?</h2>
        ${list(v.compare)}
      </section>
      <section class="container page-section" aria-labelledby="deal-catch-title">
        <h2 id="deal-catch-title">The catch</h2>
        ${list(v.catch, "deal-catch")}
      </section>
      ${ended ? "" : `<section class="container page-section" aria-labelledby="deal-how-title">
        <h2 id="deal-how-title">How to get it</h2>
        <ol>${v.how.map((x) => `<li>${e(x)}</li>`).join("")}</ol>
        <p><a href="${e(check.official_url)}">Go to the ${e(check.source_label)}</a> (terms checked ${e(longDate(check.observed_on))}).</p>
      </section>`}
      <section class="container page-section" aria-labelledby="deal-todo-title">
        <h2 id="deal-todo-title">What kids can do there</h2>
        ${list(v.things_to_do.items)}
        <p class="review-label">From ${sourceLine(v.things_to_do.source)}. This is what ${e(check.operator)} says; we have not visited.</p>
      </section>
      <section class="container page-section" aria-labelledby="deal-proscons-title">
        <h2 id="deal-proscons-title">Pros and cons</h2>
        <div class="deal-proscons">
          <div><h3>Pros</h3>${list(v.pros)}</div>
          <div><h3>Cons</h3>${list(v.cons)}</div>
        </div>
      </section>
      <section class="container page-section" aria-labelledby="deal-terms-title">
        <h2 id="deal-terms-title">Full terms</h2>
        <details class="deal-terms-details">
          <summary>Show all ${check.terms.length} terms from the offer page</summary>
          <div class="table-wrap deal-terms-wrap">
            <table class="deal-terms" role="table">
              <caption>What the ${e(check.operator)} offer page said on ${e(longDate(check.observed_on))}</caption>
              <thead role="rowgroup"><tr role="row"><th scope="col" role="columnheader">Term</th><th scope="col" role="columnheader">What the official page says</th></tr></thead>
              <tbody role="rowgroup">${rows}</tbody>
            </table>
          </div>
        </details>
        <p><strong>Unclear on the offer page:</strong></p>
        ${list(check.unclear.map((x) => String(x).replace(/\bUSD ?(?=\d)/g, "$")))}
        <p class="review-label">Official page, checked ${e(longDate(check.observed_on))}: <a href="${e(check.official_url)}">${e(check.source_label)}</a>.</p>
      </section>
${otherChecks(checks, check, today)}
      <section class="container page-section deal-sources" aria-labelledby="deal-sources-title">
        <h2 id="deal-sources-title">Sources and how we check</h2>
        <ul>${sources.map(([label, url, on, what]) => `<li>${e(what[0].toUpperCase() + what.slice(1))}: <a href="${e(url)}">${e(label)}</a>, checked ${e(longDate(on))}.</li>`).join("")}</ul>
        <p>Every term was read on the company's own pages on the dates shown. We have not booked this offer or been there ourselves. "Family of 4" notes are our reading of the terms, not a quote. ${v3 ? "The spend-vs-save figures are estimates we added up from the dated prices listed in \"How we got these numbers\", not a quote or a price we saw for your trip. " : "We show a trip price only when we saw one on the official site for a named family and named dates. "}${!ended && priceSampleLine(v, today) ? "The hotel price we saw is a dated Google Hotels reading, not a price checked on the official site. " : ""}Prices and availability change: check live before you book.</p>
      </section>
    </main>`;
  return page({
    title: `${v.page_title} | Family Tripwise`,
    description: `${v.context}. ${v.headline}. ${ended ? endedLabel(check) : deadlineLabel(check)} ${longDate(check.expires_on)}.`,
    canonical: dealPageUrl(check),
    path: dealPagePath(check),
    body,
    og: { title: v.page_title, description: `${v.headline}. ${ended ? endedLabel(check) : deadlineLabel(check)} ${longDate(check.expires_on)}.`, image: `https://familytripwise.com/${v.og_image}`, alt: `${v.big_number} ${v.big_label}` }
  });
}

export function currentChecks(checks, today = easternDate()) {
  return checks
    .filter((check) => !isEnded(check, today))
    .sort((a, b) => a.expires_on.localeCompare(b.expires_on) || a.id.localeCompare(b.id));
}

function page({ title, description, canonical, path, body, og }) {
  const ogTags = og ? `
    <meta property="og:type" content="article">
    <meta property="og:site_name" content="Family Tripwise">
    <meta property="og:title" content="${e(og.title)}">
    <meta property="og:description" content="${e(og.description)}">
    <meta property="og:url" content="${canonical}">
    <meta property="og:image" content="${e(og.image)}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="${e(og.alt)}">
    <meta name="twitter:card" content="summary_large_image">` : "";
  return withLinkPreview(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${e(title)}</title>
    <meta name="description" content="${e(description)}">
    <link rel="canonical" href="${canonical}">${ogTags}
    <link rel="stylesheet" href="../styles.css">
  </head>
  <body>
    ${siteHeader("../", path)}
${body}
    ${siteFooter("../", path)}
  </body>
</html>
`);
}

const trustPanel = `      <section class="container trust-panel" aria-label="How Family Deal Checks work">
        <p><strong>How we check:</strong> every term below was read on the company's own offer page on the date shown, with a link to that page. We have not booked these offers. "For a family of 4" notes are our reading of those terms, not a quote or firsthand experience.</p>
        <p>We show a family total only when we observed one on the official site for a named party and named dates. A "Without the deal · With the deal" line is an estimate we added up from dated published prices (and, where shown, a dated Google Hotels reading), not an observed total. Prices and availability change: check live before you book.</p>
      </section>`;

// The /deals/ card shows the spend-vs-save line when it can be built (hub pages re-render daily).
const hubSpend = (check, today) => { const r = spendSave(check, today); return r?.ok ? `${r.line} (estimate, ${r.party}, ${r.unit}).` : null; };

function hubCard(check, today = easternDate()) {
  if (check.v2) {
    return `          <article class="detail-card deal-card" id="${e(check.id)}">
            <p class="fresh-type">${e(check.v2.context)}</p>
            <h3><a href="./${e(check.id)}.html">${e(check.v2.headline)}</a></h3>
            <p>${e(hubSpend(check, today) ?? check.v2.saves)}</p>
            <p class="deal-deadline"><strong>${deadlineLabel(check)}:</strong> ${e(longDate(check.expires_on))}${dateNote(check)}</p>
            <p class="review-label">Official page, checked ${e(longDate(check.observed_on))}: <a href="${e(check.official_url)}">${e(check.source_label)}</a>.</p>
          </article>`;
  }
  return `          <article class="detail-card deal-card" id="${e(check.id)}">
            <p class="fresh-type">${e(check.category)} · ${e(check.operator)}</p>
            <h3><a href="./${e(check.id)}.html">${e(check.title)}</a></h3>
            <p>${e(check.headline)}</p>
            <p class="deal-deadline"><strong>${deadlineLabel(check)}:</strong> ${e(longDate(check.expires_on))}${dateNote(check)}</p>
            <p class="review-label">Official page, checked ${e(longDate(check.observed_on))}: <a href="${e(check.official_url)}">${e(check.source_label)}</a>.</p>
          </article>`;
}

export function dealsHubPage(checks, today = easternDate()) {
  const problems = validateDealChecks(checks, { today });
  if (problems.length) throw new Error(`deal-checks.json is not publishable:\n${problems.join("\n")}`);
  const current = currentChecks(checks, today);
  const list = current.length
    ? `<div class="detail-card-grid">\n${current.map((c) => hubCard(c, today)).join("\n")}\n        </div>`
    : `<p>No verified family deals are open right now. New checks appear here when an offer is confirmed on its official page.</p>`;
  const closing = current.slice(0, 5).map((c) => `<li><a href="#${e(c.id)}">${e(c.operator)}</a> <span class="fresh-upcoming-meta">(${shortDeadline(c)})</span></li>`).join("");
  const body = `    <main id="main">
      <section class="page-hero">
        <div class="container">
          <p class="eyebrow">Family Deal Checks</p>
          <h1>Family Travel Deals, Checked for a Family of 4</h1>
          ${contributorCredit()}
          <p>What each offer really means for a family: which ages count, room or cabin occupancy, blackout dates, minimum stays and the fees the headline leaves out.</p>
        </div>
      </section>
${trustPanel}
      <section id="deals-answer" class="container answer-box" aria-label="Closing soonest">
        <p><strong>Closing soonest:</strong></p>
        <ul class="fresh-upcoming">${closing || "<li>No verified family deals are open right now.</li>"}</ul>
      </section>
      <section class="container page-section" aria-labelledby="deals-open-title">
        <h2 id="deals-open-title">Open offers (${current.length})</h2>
        ${list}
        <p class="fresh-guide-link">Offers leave this list after their booking deadline. For dated family events, see <a href="../this-week/">this week's events and deadlines</a>.</p>
      </section>
    </main>`;
  return placeSitePageHero(page({
    title: "Family Travel Deals Checked for a Family of 4 | Family Tripwise",
    description: "Current family travel offers with the terms that matter to parents: child ages, occupancy, blackout dates, minimum stays and fees, each checked on the official page.",
    canonical: dealsHubUrl,
    path: dealsHubPath,
    body
  }), dealsHubPath);
}

function otherChecks(checks, current, today) {
  // v2 pages say "$"; other checks' v1 titles still say "USD 39" until G11 rolls v2 out to them.
  const t = (c) => (current.v2 ? String(c.v2?.headline ?? c.title).replace(/\bUSD (?=\d)/g, "$") : c.title);
  const others = checks.filter((c) => c.id !== current.id).sort((a, b) => Number(isEnded(a, today)) - Number(isEnded(b, today)) || a.expires_on.localeCompare(b.expires_on));
  if (!others.length) return "";
  const items = others.map((c) => `<li><a href="./${e(c.id)}.html">${e(t(c))}</a> <span class="fresh-upcoming-meta">(${isEnded(c, today) ? `${c.deadline_stated === false ? "no longer listed after" : "ended"} ${e(longDate(c.expires_on))}` : shortDeadline(c)})</span></li>`).join("");
  return `      <nav class="container page-section deal-others" aria-labelledby="deal-others-title">
        <h2 id="deal-others-title">More Family Deal Checks</h2>
        <ul>${items}</ul>
        <p><a href="./">All open family deals</a></p>
      </nav>`;
}

function totalSection(check) {
  const t = check.family_total;
  if (t) {
    return `<p><strong>${e(t.amount)}</strong> for ${e(t.party)}, ${e(longDate(t.stay_from))} to ${e(longDate(t.stay_to))}, ${e(t.includes)}. Observed on the official site ${e(longDate(t.observed_on))}; check live, prices change.</p>`;
  }
  return `<p><strong>Not observed. Check live.</strong> We did not see a total for a family of 4 on named dates on the official site, so we show none. Use the terms above and the checklist below when you price your own dates.</p>`;
}

export function dealCheckPage(checks, check, today = easternDate()) {
  const problems = validateDealChecks(checks, { today });
  if (problems.length) throw new Error(`deal-checks.json is not publishable:\n${problems.join("\n")}`);
  const ended = isEnded(check, today);
  if (check.v2) return dealCheckPageV2(checks, check, today, ended);
  const status = ended
    ? `<p class="deal-status deal-status-ended" role="status"><strong>${endedLabel(check)} ${e(longDate(check.expires_on))}${dateNote(check)}.</strong> The terms below are what the official page said when we checked; they are kept for reference only.</p>`
    : `<p class="deal-status"><strong>${deadlineLabel(check)} ${e(longDate(check.expires_on))}</strong>${dateNote(check)}${check.expires_note ? `; official page checked ${e(longDate(check.observed_on))}` : `, per the official page checked ${e(longDate(check.observed_on))}`}.</p>`;
  const rows = check.terms.map(([label, value]) => `<tr role="row"><th scope="row" role="rowheader">${e(label)}</th><td role="cell">${e(value)}</td></tr>`).join("");
  const body = `    <main id="main">
      <section class="page-hero">
        <div class="container">
          <p class="eyebrow">Family Deal Check · ${e(check.category)}</p>
          <h1>${e(check.title)}</h1>
          ${contributorCredit()}
          ${status}
        </div>
      </section>
      <section id="deal-answer" class="container answer-box" aria-label="For a family of 4">
        <p><strong>In short:</strong> ${e(check.headline)}</p>
        <p><strong>For a family of 4:</strong> ${e(check.family_of_four)}</p>
      </section>
${trustPanel}
      <section class="container page-section" aria-labelledby="deal-terms-title">
        <h2 id="deal-terms-title">The terms that matter to families</h2>
        <div class="table-wrap deal-terms-wrap">
          <table class="deal-terms" role="table">
            <caption>What the ${e(check.operator)} offer page said on ${e(longDate(check.observed_on))}</caption>
            <thead role="rowgroup"><tr role="row"><th scope="col" role="columnheader">Term</th><th scope="col" role="columnheader">What the official page says</th></tr></thead>
            <tbody role="rowgroup">${rows}</tbody>
          </table>
        </div>
        <p class="review-label">Official page, checked ${e(longDate(check.observed_on))}: <a href="${e(check.official_url)}">${e(check.source_label)}</a>.</p>
      </section>
      <section class="container page-section" aria-labelledby="deal-total-title">
        <h2 id="deal-total-title">Family total on named dates</h2>
        ${totalSection(check)}
      </section>
      <section class="container page-section" aria-labelledby="deal-unclear-title">
        <h2 id="deal-unclear-title">Unclear or missing on the offer page</h2>
        <ul>${check.unclear.map((x) => `<li>${e(x)}</li>`).join("")}</ul>
      </section>
      ${ended ? "" : `<section class="container page-section" aria-labelledby="deal-check-title">
        <h2 id="deal-check-title">Before you book, check</h2>
        <ul>${check.before_booking.map((x) => `<li>${e(x)}</li>`).join("")}</ul>
      </section>`}
${otherChecks(checks, check, today)}
    </main>`;
  return page({
    title: `${check.title}: Family Deal Check | Family Tripwise`,
    description: `${check.headline}`.slice(0, 300),
    canonical: dealPageUrl(check),
    path: dealPagePath(check),
    body
  });
}

export function dealSitemapUrls(checks = readDealChecks()) {
  return [dealsHubUrl, ...checks.map(dealPageUrl)];
}

export function writeDealPages(writeSite, today = easternDate()) {
  const checks = readDealChecks();
  writeSite(dealsHubPath, dealsHubPage(checks, today));
  for (const check of checks) writeSite(dealPagePath(check), dealCheckPage(checks, check, today));
}

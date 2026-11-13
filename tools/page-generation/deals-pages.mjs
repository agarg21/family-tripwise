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
  // R1 step 2: optional search title (≤60 characters, no brand suffix) used while the deal is live; it must
  // keep the start of page_title (the operator and offer name) so the query family stays first.
  if (v.seo_title !== undefined && (typeof v.seo_title !== "string" || v.seo_title.length > 60 || v.seo_title.length < 20 || v.seo_title.split(":")[0].trim().length < 3 || !v.page_title?.startsWith(v.seo_title.split(":")[0]) || V2_PLACEHOLDER.test(v.seo_title) || /\bUSD\b/.test(v.seo_title))) problems.push(`${where}: seo_title must be 20-60 characters and start with page_title's name`);
  if (!validSource(v.context_source) || v.context_source?.observed_on > today) problems.push(`${where}: context_source needs a dated https source`);
  // Other official pages the v2 copy relies on (for example a price used for comparison) are listed in the sources.
  if (v.extra_sources !== undefined && (!Array.isArray(v.extra_sources) || !v.extra_sources.every((src) => validSource(src) && src.observed_on <= today && sentence(src.covers)))) problems.push(`${where}: extra_sources must be dated https sources with what they cover`);
  // A percent-only offer with no observed price (spend_missing) has no honest $ figure to lead with.
  if (!/\$\d/.test(v.headline ?? "") || !(/\$\d/.test(v.big_number ?? "") || (v.spend_missing && /\d%/.test(v.big_number ?? "")))) problems.push(`${where}: headline and big_number must state a $ amount`);
  // Optional possible-end line on saver rows. Its date must be the check's listing date, so extending a check forces a re-read of this line and of hub_deadline.
  if (v.saver_flag !== undefined) {
    const want = `May end ${new Date(`${check.expires_on}T00:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" })}`;
    if (v.saver_flag !== want) problems.push(`${where}: v2.saver_flag must read "${want}" (it follows expires_on)`);
    if (check.deadline_stated !== false) problems.push(`${where}: v2.saver_flag is only for a date the page does not state as a deadline`);
    if (!String(check.hub_deadline ?? "").includes(want.replace("May end ", ""))) problems.push(`${where}: hub_deadline must give the same date as v2.saver_flag`);
  }
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
  if (v.spend_missing !== undefined) problems.push(...validateSpendMissing(check, stated));
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
  // Optional: the visit/day the page's own reasoning says the pass pays off from (overrides the hub's average-price estimate).
  if (ss.pays_off_from !== undefined && !(Number.isInteger(ss.pays_off_from) && ss.pays_off_from >= 1 && ss.pays_off_from <= 20)) problems.push(`${where}: pays_off_from must be a whole number from 1 to 20`);
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
      if (!(typeof p?.unit_amount === "number" && p.unit_amount > 0 && Math.abs(Math.round(p.unit_amount * 100) - p.unit_amount * 100) < 1e-6)) problems.push(`${at}: unit_amount must be a positive dollar figure`);
      if (p?.from === "terms") {
        if (!stated.has(String(p.unit_amount)) && !stated.has(p.unit_amount.toFixed(2))) problems.push(`${at}: $${p.unit_amount} is not a figure the observed terms state`);
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

// A deal whose with- or without-the-deal side cannot be built from observed figures still gets the card at
// the top (Content Standard), saying plainly what is missing; spendSave() then returns ok: false, so the
// deal is never posted and never enters the hub's savings box.
function validateSpendMissing(check, stated) {
  const where = `check ${check.id} v2.spend_missing`;
  const v = check.v2;
  const sm = v.spend_missing;
  if (!sm || typeof sm !== "object") return [`${where}: must be an object`];
  const problems = [];
  if (v.spend_save !== undefined) problems.push(`${where}: use spend_save or spend_missing, not both`);
  if (!/^2 adults and 2 kids aged (\d+) and (\d+)$/.test(sm.party ?? "") || !String(v.family ?? "").includes(sm.party.replace(/^2 adults and 2 kids /, ""))) problems.push(`${where}: party must be "2 adults and 2 kids aged X and Y" with the same ages as v2.family`);
  if (!sentence(sm.unit) || sm.unit.length > 60) problems.push(`${where}: unit (what the comparison would cover) is required, at most 60 characters`);
  if (!sentence(sm.text) || words(sm.text) > SPEND_WORDS_MAX || !/\b(?:no|not|cannot|could not)\b/i.test(sm.text)) problems.push(`${where}: text must say in at most ${SPEND_WORDS_MAX} words which price is missing`);
  for (const text of [sm.unit, sm.text]) {
    if (/\bUSD\b/.test(String(text))) problems.push(`${where}: use "$", not "USD"`);
    for (const m of String(text ?? "").matchAll(/\$\s?([\d,]+(?:\.\d\d)?)/g)) if (!stated.has(m[1].replaceAll(",", ""))) problems.push(`${where}: $${m[1]} is not a figure the observed terms state`);
  }
  return problems;
}

const usd = (n) => `$${n.toLocaleString("en-US", Number.isInteger(n) ? {} : { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
// Builds the card from a validated spend_save. A side that relies on the hotel price sample cannot be built
// once the sampled stay has started (or the deal has ended): then the card says what is missing instead.
export function spendSave(check, today = easternDate()) {
  const v = check.v2;
  const ss = v?.spend_save;
  if (!ss && v?.spend_missing) {
    const sm = v.spend_missing;
    return { party: sm.party, unit: sm.unit, ok: false, missing: isEnded(check, today) ? "The deal has ended, so we no longer compare its price." : sm.text };
  }
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
  const basis = `${sample ? `Hotel price for ${shortStay(sample.stay_from, sample.stay_to)}; prices` : "Prices"} checked ${checkedText}. ${ss.basis}`;
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
// D23 3b: at most 4 chips above the fold (verdict, deadline, two terms); the rest sit in the glance box.
const HERO_CHIPS = 2;

function spendSaveCard(check, today) {
  const r = spendSave(check, today);
  if (!r) return "";
  const head = `<p class="ss-title">Estimate for ${e(r.party)}, ${e(r.unit)}</p>`;
  if (!r.ok) return `<div class="spend-save spend-save-missing" role="group" aria-label="What it costs a family of 4"><p class="ss-title">Trip cost for ${e(r.party)}, ${e(r.unit)}</p>${/^No estimate:\s*/.test(r.missing) ? `<p class="ss-lead">No price estimate yet</p><p>${e(r.missing.replace(/^No estimate:\s*(.)/, (_, c) => c.toUpperCase()))}</p>` : `<p>${e(r.missing)}</p>`}</div>`;
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
  return `<p class="deal-price-sample"><strong>Hotel price we saw (estimate, not a quote):</strong> about ${e(usd(ps.amount))} a night at the ${e(ps.hotel)} for ${e(ps.party)}, ${nights(ps)} night${nights(ps) === 1 ? "" : "s"}, ${e(shortStay(ps.stay_from, ps.stay_to))}, on <a href="${e(ps.source_url)}">${e(ps.source_label)}</a>, checked ${e(longDate(ps.observed_on))}.${e(range)} ${e(ps.caveat)}</p>`;
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
  const bigBox = v.hide_big ? "" : `<div class="deal-big${v3 ? " deal-big-quiet" : ""}" aria-hidden="true"><span class="deal-big-number${v.big_number.length > 5 ? " deal-big-number-long" : ""}">${e(v.big_number)}</span><span class="deal-big-label">${e(v.big_label)}</span></div>`;
  const body = `    <main id="main" class="deal-v2">
      <section class="page-hero deal-hero">
        <div class="container deal-hero-grid">
          <div>
            <p class="eyebrow deal-context">${e(v.context)}</p>
            <h1>${e(v.headline)}</h1>${!ended && (v.spend_save || v.spend_missing) ? `
            ${v3 && bigBox ? `<div class="ss-with-big">${spendSaveCard(check, today)}${bigBox}</div>` : spendSaveCard(check, today)}` : ""}
            ${ended ? "" : `<ul class="deal-chips" aria-label="Key terms"><li class="deal-chip-verdict deal-verdict-${e(s.verdict)}">${e(v.verdict_pill ?? VERDICT_TEXT[s.verdict])}</li><li>${e(deadlineLabel(check))} ${e(longDate(check.expires_on))}${check.deadline_stated === false ? "" : (v.date_note_short ? ` (${e(v.date_note_short)})` : dateNote(check))}</li>${v.chips.slice(0, HERO_CHIPS).map((x) => `<li>${e(x)}</li>`).join("")}</ul>`}
            ${ended ? status : ""}
            ${contributorCredit()}
          </div>
          ${v3 ? "" : bigBox}
        </div>
      </section>
      <section id="deal-answer" class="container answer-box deal-glance" aria-label="Verdict, cost and savings">
${ended ? `        <p class="deal-verdict">While it ran: ${e(v.saves.replace(/^Saves:\s*/, ""))}</p>${brandLink(check, true)}` : `        <p class="deal-verdict deal-verdict-${e(s.verdict)}"><strong>Our verdict:</strong> ${e(s.why)}</p>
        <p><strong>Best for:</strong> ${e(v.best_for)}</p>
        <p><strong>Not for:</strong> ${e(v.not_for)}</p>
${v.chips.length > HERO_CHIPS ? `        <p class="deal-also"><strong>Also note:</strong> ${v.chips.slice(HERO_CHIPS).map((x) => e(x)).join(" · ")}</p>
` : ""}${v3 ? `${spendSaveDetails(check, today).replace("</details>", `  <p>${e(v.cost)}</p>${priceSampleLine(v, today) ? `
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
        <p><a href="${e(check.official_url)}">Go to the ${e(check.source_label)}</a> (terms checked ${e(longDate(check.observed_on))}).</p>${brandLink(check, false)}
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
              <caption>${e(check.terms_caption ?? `What the ${check.operator} offer page said on ${longDate(check.observed_on)}`)}</caption>
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
    title: !ended && v.seo_title ? v.seo_title : `${v.page_title} | Family Tripwise`,
    description: `${v.context}. ${v.headline}. ${ended ? endedLabel(check) : deadlineLabel(check)} ${longDate(check.expires_on)}.`,
    canonical: dealPageUrl(check),
    path: dealPagePath(check),
    body,
    og: { title: v.page_title, description: `${v.headline}. ${ended ? endedLabel(check) : deadlineLabel(check)} ${longDate(check.expires_on)}.`, image: `https://familytripwise.com/${v.og_image}`, alt: `${v.big_number} ${v.big_label}` }
  });
}

// Owner D22 (2026-10-30): only a real deal is publicized. A real deal has a spend-vs-save card built from
// observed figures that saves at least REAL_DEAL_MIN_PCT of the without-deal cost. Anything else (under 5%,
// costs more, or not priced yet) keeps its page but gets no social post, newsletter mention or hub promotion.
export const REAL_DEAL_MIN_PCT = 5;
export function isRealDeal(check, today = easternDate()) {
  const r = spendSave(check, today);
  // Compare the unrounded share: a 4.7% saving shows as "5%" but is not a real deal.
  return Boolean(r?.ok && r.save > 0 && r.save / r.without >= REAL_DEAL_MIN_PCT / 100 && check.score?.verdict !== "skip");
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
// A small positive saving (under 5%) also says plainly on the hub that the deal is not really cheaper.

// A pass pays off from visit k: the smallest k whose per-visit ticket cost (without ÷ visits, from the card's
// observed figures) exceeds the pass cost. Shown only for theme-park passes priced over N visits or days.
function breakEven(check, r) {
  const m = /^(\d+) park (visits|days)$/.exec(check.v2?.spend_save?.unit_short ?? "");
  if (check.category !== "Theme park pass" || !m || r.save <= 0) return "";
  const perVisit = r.without / Number(m[1]);
  const k = check.v2.spend_save.pays_off_from ?? Math.floor(r.with / perVisit) + 1;
  const ord = k === 1 ? "1st" : k === 2 ? "2nd" : k === 3 ? "3rd" : `${k}th`;
  return `<p class="hub-ss-break"><strong>Pays off from your ${ord} ${m[2] === "days" ? "park day" : "visit"}</strong> (estimate, at the same ticket prices).</p>\n            `;
}

// Hub deadline line: when the official page states no end date, say so plainly instead of our listing date.
const hubDeadline = (check) => (check.hub_deadline
  ? `<p class="deal-deadline"><strong>Deadline:</strong> ${e(check.hub_deadline)}</p>`
  : check.deadline_stated === false
  ? `<p class="deal-deadline"><strong>Deadline:</strong> none posted on the official page (checked ${e(longDate(check.observed_on))}); it could end any time.</p>`
  : `<p class="deal-deadline"><strong>${deadlineLabel(check)}:</strong> ${e(longDate(check.expires_on))}${dateNote(check)}</p>`);

// Hub spend-vs-save figures (Content Standard: a reader can state without, with and save at a glance).
function hubSpendBlock(check, today = easternDate()) {
  const r = spendSave(check, today);
  if (!r?.ok) return null;
  const save = r.save > 0 ? `≈ ${e(usd(r.save))} <small>(${r.save_pct}%)</small>` : r.save === 0 ? "≈ $0" : `nothing <small>(≈ ${e(usd(-r.save))} more)</small>`;
  return `<dl class="hub-ss"><div><dt>Without the deal</dt><dd>≈ ${e(usd(r.without))}</dd></div><div><dt>With the deal</dt><dd>≈ ${e(usd(r.with))}</dd></div><div class="hub-ss-save${r.save / r.without < REAL_DEAL_MIN_PCT / 100 ? " hub-ss-nodeal" : ""}"><dt>You save</dt><dd>${save}</dd></div></dl>
            ${breakEven(check, r)}<p class="hub-ss-basis">${r.save / r.without < REAL_DEAL_MIN_PCT / 100 ? `<strong class="hub-ss-flag">Not really cheaper.</strong> ` : ""}Estimate: ${e(r.party)}, ${e(r.unit)}. ${e(check.v2.spend_save.basis)}</p>`;
}

function hubCard(check, today = easternDate()) {
  if (check.v2) {
    return `          <article class="detail-card deal-card" id="${e(check.id)}">
            <p class="fresh-type">${e(check.v2.context)}</p>
            <h3><a href="./${e(check.id)}.html">${e(check.v2.headline)}</a></h3>
            ${hubSpendBlock(check, today) ?? `<p>${e(check.v2.saves)}</p>`}
            ${hubDeadline(check)}
            <p class="deal-source">Official page, checked ${e(longDate(check.observed_on))}: <a href="${e(check.official_url)}">${e(check.source_label)}</a></p>
          </article>`;
  }
  return `          <article class="detail-card deal-card" id="${e(check.id)}">
            <p class="fresh-type">${e(check.category)} · ${e(check.operator)}</p>
            <h3><a href="./${e(check.id)}.html">${e(check.title)}</a></h3>
            <p>${e(check.headline)}</p>
            ${hubDeadline(check)}
            <p class="deal-source">Official page, checked ${e(longDate(check.observed_on))}: <a href="${e(check.official_url)}">${e(check.source_label)}</a></p>
          </article>`;
}

export function dealsHubPage(checks, today = easternDate()) {
  const problems = validateDealChecks(checks, { today });
  if (problems.length) throw new Error(`deal-checks.json is not publishable:\n${problems.join("\n")}`);
  const current = currentChecks(checks, today);
  // D22: the top of the hub and the main list show real deals only (saving ≥ 5%, priced from observed figures).
  const real = current.filter((c) => isRealDeal(c, today));
  const priced = (c) => spendSave(c, today)?.ok;
  const unpriced = current.filter((c) => !priced(c));
  const notReal = current.filter((c) => priced(c) && !isRealDeal(c, today)); // includes a priced deal scored skip
  const grid = (cs) => `<div class="detail-card-grid">\n${cs.map((c) => hubCard(c, today)).join("\n")}\n        </div>`;
  // Real deals, biggest saving first; the top box and the list use the same order.
  real.sort((a, b) => spendSave(b, today).save - spendSave(a, today).save || a.id.localeCompare(b.id));
  const list = real.length
    ? grid(real)
    : !current.length ? `<p>No verified family deals are open right now. New checks appear here when an offer is confirmed on its official page.</p>`
    : `<p>No offer we checked saves a family at least ${REAL_DEAL_MIN_PCT}% right now. New deals appear here once we can price them against booking the same trip without the offer.</p>`;
  const savers = real.slice(0, 3).map((c) => { const r = spendSave(c, today); return `<li class="saver"><a class="saver-name" href="#${e(c.id)}">${e(c.operator)}</a> <span class="saver-meta">${e(c.category)}</span> <span class="saver-save">Save ≈ ${e(usd(r.save))} <small>(${r.save_pct}%)</small> <small class="saver-over">over ${e(c.v2.spend_save.unit_short)}</small></span> <span class="saver-sides">Without ≈ ${e(usd(r.without))} · with ≈ ${e(usd(r.with))}</span>${c.v2.saver_flag ? ` <span class="saver-sides"><strong>${e(c.v2.saver_flag)}</strong></span>` : ""}</li>`; }).join("");
  const others = unpriced.length || notReal.length ? `
      <section class="container page-section" aria-labelledby="deals-other-title">
        <h2 id="deals-other-title">Other offers we checked (${unpriced.length + notReal.length})</h2>
        <p>Not counted as deals: we only list an offer above when it saves at least ${REAL_DEAL_MIN_PCT}% against booking the same trip without it.</p>${notReal.length ? `
        <details class="deals-other">
          <summary>Saves under ${REAL_DEAL_MIN_PCT}%, costs more or not worth it (${notReal.length})</summary>
          ${grid(notReal)}
        </details>` : ""}${unpriced.length ? `
        <details class="deals-other">
          <summary>Can't price for a family right now (${unpriced.length})</summary>
          ${grid(unpriced)}
        </details>` : ""}
      </section>` : "";
  const body = `    <main id="main">
      <section class="page-hero">
        <div class="container">
          <p class="eyebrow">Family Deal Checks</p>
          <h1>Family Travel Deals, Checked for a Family of 4</h1>
          <p>We count an offer as a deal only when it saves a family of 4 at least ${REAL_DEAL_MIN_PCT}% against booking the same trip without it.</p>
          ${contributorCredit()}
        </div>
      </section>
${savers ? `      <section id="deals-answer" class="container answer-box deals-savers" aria-label="Biggest savings">
        <p class="savers-title"><strong>Biggest savings right now</strong></p>
        <p class="savers-note">Estimates for a family of 4; each deal below shows ages, visits and what is not counted.</p>
        <ul class="savers" role="list">${savers}</ul>
      </section>
` : ""}      <section class="container page-section" aria-labelledby="deals-open-title">
        <h2 id="deals-open-title">Real deals open now (${real.length})</h2>
        ${list}
        <p class="fresh-guide-link">Offers leave this list after their booking deadline. Shopping the sales? See <a href="./black-friday-family-travel-deals.html">Black Friday family travel deals</a>. Planning a holiday outing? See <a href="../holidays/theme-park-christmas-events-with-kids.html">theme park Christmas events, compared</a>, or Christmas with kids in <a href="../holidays/san-diego-christmas-with-kids.html">San Diego</a>, <a href="../holidays/orlando-christmas-with-kids.html">Orlando</a>, <a href="../holidays/san-antonio-christmas-with-kids.html">San Antonio</a>, <a href="../holidays/washington-dc-christmas-with-kids.html">Washington, DC</a>, <a href="../holidays/new-york-city-christmas-with-kids.html">New York City</a>, <a href="../holidays/chicago-christmas-with-kids.html">Chicago</a> or <a href="../holidays/las-vegas-christmas-with-kids.html">Las Vegas</a>. Comparing yearly passes? See ${PASS_BRANDS.map((b) => `<a href="./${e(b.slug)}.html">${e(b.name)} passes, park by park</a>`).join(", ")}. For dated family events, see <a href="../this-week/">this week's events and deadlines</a>. Going away for Christmas? See <a href="../holidays/holiday-hotel-prices-family-of-4.html">holiday weekend hotel prices for a family of 4</a>.</p>
      </section>${others}
${trustPanel}
    </main>`;
  return placeSitePageHero(page({
    title: "Family Travel Deals, Checked for a Family of 4",
    description: "Current family travel offers with the terms that matter to parents: child ages, occupancy, blackout dates, minimum stays and fees, each checked on the official page.",
    canonical: dealsHubUrl,
    path: dealsHubPath,
    body
  }), dealsHubPath, hubBanner(real[0]));
}

// D23 3c: the hub banner shows the biggest current saving's own photo (not an unrelated city); fallback: sitePageHeroes.
function hubBanner(top) {
  const v = top?.v2;
  const img = v?.hero_image && imageLock[v.hero_image.slug];
  if (!img) return undefined;
  return `<img src="../${e(img.path)}" alt="${e(v.hero_image.alt)}" width="${img.width}" height="${img.height}" loading="eager" fetchpriority="high" decoding="async">
          <figcaption>Biggest saving right now: ${e(top.operator)}. ${e(v.hero_image.caption)} Photo: ${e(img.artist)} via <a href="${e(img.source_page)}">Wikimedia Commons</a>, ${img.license_url ? `<a href="${e(img.license_url)}">${e(img.license)}</a>` : e(img.license)}. Resized and cropped.</figcaption>`;
}

// R1 / OWNER D46 #11: one durable page per pass brand ("is the pass worth it for a family of 4"), built only from
// deal-checks.json, so it cannot disagree with the dated check pages. Open checks show their spend-vs-save card;
// ended checks stay as older dated observations (never as today's price). Ended check pages link here.
export const PASS_BRANDS = [
  {
    slug: "seaworld-passes",
    name: "SeaWorld",
    match: (c) => c.category === "Theme park pass" && /^SeaWorld /.test(c.operator),
    title: "SeaWorld Passes for a Family of 4, Park by Park",
    seo_title: "SeaWorld Pass Prices for a Family of 4 | Family Tripwise",
    context: "SeaWorld: marine theme parks in Orlando, San Diego and San Antonio",
    lead: "Each park sells its own yearly pass (Fun Card or season pass). Here is when one beats day tickets for 2 adults and 2 kids.",
    age_tip: "Price one pass for each family member who needs a ticket: San Diego and San Antonio let under-3s in free; the Orlando offer page states no age rule.",
    check_tip: "Check parking (extra with the Orlando and San Diego Fun Cards in our checks; included with the San Antonio pass), the blockout dates and any automatic renewal on the official page.",
    description: "SeaWorld Fun Card and season pass prices at Orlando, San Diego and San Antonio, checked on SeaWorld's own pages: what four passes cost a family of 4 against day tickets, and from which visit a pass pays off."
  }
];
export const brandPagePath = (brand) => `deals/${brand.slug}.html`;
export const brandPageUrl = (brand) => `https://familytripwise.com/deals/${brand.slug}.html`;
export const brandFor = (check) => PASS_BRANDS.find((b) => b.match(check));

function brandLink(check, ended) {
  const b = brandFor(check);
  if (!b) return "";
  return ended
    ? `\n        <p class="deal-brand-link"><strong>Looking for a ${e(b.name)} pass now?</strong> <a href="./${e(b.slug)}.html">${e(b.name)} passes for a family of 4, park by park</a>.</p>`
    : `\n        <p class="deal-brand-link">Comparing parks? See <a href="./${e(b.slug)}.html">${e(b.name)} passes for a family of 4, park by park</a>.</p>`;
}
const dateIn = (iso, today) => (iso.slice(0, 4) === today.slice(0, 4) ? longDate(iso).replace(/, \d{4}$/, "") : longDate(iso));
const ordinal = (k) => (k === 1 ? "1st" : k === 2 ? "2nd" : k === 3 ? "3rd" : `${k}th`);
// Totals from the check's own observed parts (also for ended checks, as an older dated observation).
function brandFigures(check, today) {
  const r = spendSave(check, today);
  if (!r?.sides || r.sides.without.stale || r.sides.with.stale) return null;
  const without = r.sides.without.total;
  const withPass = r.sides.with.total;
  const m = /^(\d+) park (visits|days)$/.exec(check.v2.spend_save.unit_short ?? "");
  const k = m && withPass < without ? (check.v2.spend_save.pays_off_from ?? Math.floor(withPass / (without / Number(m[1]))) + 1) : null;
  return { r, without, withPass, k, unit: m ? (m[2] === "days" ? "park day" : "visit") : "visit" };
}

function brandParkCard(check, today) {
  const ended = isEnded(check, today);
  const f = brandFigures(check, today);
  const v = check.v2;
  const park = check.operator;
  const terms = Object.fromEntries(check.terms);
  const ages = terms["Child ages"];
  const fig = !f ? `<p>We could not price this pass for a family of 4 from observed figures.</p>`
    : ended
    ? `<p class="brand-old"><strong>Seen ${e(longDate(check.observed_on))}:</strong> 4 passes ≈ ${e(usd(f.withPass))} vs ≈ ${e(usd(f.without))} in day tickets for ${e(check.v2.spend_save.unit_short)} (${e(f.r.party.replace(/ and 2 kids aged /, ", kids "))}). Check today's price.</p>`
    : spendSaveCard(check, today);
  const pays = f?.k ? `<p class="hub-ss-break"><strong>Paid off from the ${ordinal(f.k)} ${f.unit}</strong>${ended ? " at the prices we last saw" : " (estimate, at the same ticket prices)"}.</p>` : "";
  const status = ended
    ? `<p class="deal-deadline"><strong>Status:</strong> ${e(check.deadline_stated === false ? "we stopped listing this offer after" : "this offer ended")} ${e(longDate(check.expires_on))}.</p>`
    : hubDeadline(check);
  return `          <article class="detail-card deal-card brand-park" id="${e(check.id)}">
            <p class="fresh-type">${e(v.context)}</p>
            <h3>${e(park)}: ${e(ended ? "last pass price we checked" : "pass offer open now")}</h3>
            ${fig}
            ${pays}${status}
            ${ages ? `<p class="deal-deadline"><strong>Child ages:</strong> ${e(String(ages).replace(/\bUSD ?(?=\d)/g, "$"))}</p>` : ""}
            <p class="deal-source"><a href="./${e(check.id)}.html">Full dated check: terms, catch and blockout dates</a>. Official page, checked ${e(longDate(check.observed_on))}: <a href="${e(check.official_url)}">${e(check.source_label)}</a></p>
          </article>`;
}

export function brandPage(checks, brand, today = easternDate()) {
  const problems = validateDealChecks(checks, { today });
  if (problems.length) throw new Error(`deal-checks.json is not publishable:\n${problems.join("\n")}`);
  const mine = checks.filter(brand.match);
  if (!mine.length) throw new Error(`no checks for pass brand ${brand.slug}`);
  const open = mine.filter((c) => !isEnded(c, today)).sort((a, b) => a.expires_on.localeCompare(b.expires_on));
  const ended = mine.filter((c) => isEnded(c, today)).sort((a, b) => b.observed_on.localeCompare(a.observed_on) || a.id.localeCompare(b.id));
  // The answer box leads with each open offer's without / with / save line; ended offers get one short line.
  const openLine = (c) => {
    const f = brandFigures(c, today);
    const place = c.operator.replace(/^SeaWorld /, "");
    const deadline = c.deadline_stated === false ? "no end date posted" : `${deadlineLabel(c).toLowerCase()} ${dateIn(c.expires_on, today)}`;
    if (!f?.r.ok) return `<li><a href="#${e(c.id)}"><strong>${e(place)}</strong></a> (${e(deadline)}): no price estimate yet; see the check below.</li>`;
    return `<li><a href="#${e(c.id)}"><strong>${e(place)}</strong></a> (open, ${e(deadline)}), ${e(c.v2.spend_save.unit_short)}, ${e(f.r.party.replace(/ and 2 kids aged /, ", kids "))}: without the pass <strong>≈&nbsp;${e(usd(f.without))}</strong> · with it <strong>≈&nbsp;${e(usd(f.withPass))}</strong> · you save <strong>≈&nbsp;${e(usd(f.r.save))} (${f.r.save_pct}%)</strong>.${f.k ? ` One visit: a day ticket is cheaper; the pass pays off from the ${ordinal(f.k)} ${f.unit}.` : ""}</li>`;
  };
  const rows = open.map(openLine).join("") + (ended.length ? `<li><strong>No longer listed:</strong> ${ended.map((c) => `<a href="#${e(c.id)}">${e(c.operator.replace(/^SeaWorld /, ""))}</a>`).join(", ")} (last prices we saw, with dates, below).</li>` : "");

  const body = `    <main id="main">
      <section class="page-hero">
        <div class="container">
          <p class="eyebrow">Family Deal Checks · ${e(brand.context)}</p>
          <h1>${e(brand.title)}</h1>
          <p>${e(brand.lead)}</p>
          ${contributorCredit()}
        </div>
      </section>
      <section id="brand-answer" class="container answer-box" aria-label="${e(brand.name)} passes for a family of 4">
        <p><strong>${open.length ? `Open now (${open.length}):` : "No offer open right now."}</strong> ${open.length ? `${open.map((c) => e(c.operator)).join(", ")}.` : `Below are the last prices we saw, with dates; check the official page for today's price.`}</p>
        <p class="savers-note">Estimates for 2 adults and 2 kids, added up from prices on ${e(brand.name)}'s own pages (not quotes):</p>
        <ul class="brand-parks">${rows}</ul>
      </section>
      <section class="container page-section" aria-labelledby="brand-open-title">
        <h2 id="brand-open-title">${open.length ? "Pass offers open now" : "No pass offer open now"}</h2>
        ${open.length ? `<div class="detail-card-grid">\n${open.map((c) => brandParkCard(c, today)).join("\n")}\n        </div>` : `<p>None of the ${e(brand.name)} pass offers we checked is open. A new one appears here once we read it on the official page.</p>`}
      </section>${ended.length ? `
      <section class="container page-section" aria-labelledby="brand-ended-title">
        <h2 id="brand-ended-title">Earlier offers we no longer list: last prices we saw</h2>
        <p>These are older dated observations, kept so you can compare. They are not today's prices.</p>
        <div class="detail-card-grid">
${ended.map((c) => brandParkCard(c, today)).join("\n")}
        </div>
      </section>` : ""}
      <section class="container page-section" aria-labelledby="brand-tips-title">
        <h2 id="brand-tips-title">Before you buy a pass</h2>
        <ul>
          <li>Count the visits you will really make before the pass ends: one visit is cheaper on a day ticket.</li>
          <li>${e(brand.age_tip)}</li>
          <li>${e(brand.check_tip)}</li>
        </ul>
        <p class="fresh-guide-link">More offers: <a href="./">all open family deals</a> and <a href="./black-friday-family-travel-deals.html">Black Friday family travel deals</a>.</p>
      </section>
${trustPanel}
    </main>`;
  const photo = [...open, ...ended].find((c) => c.v2?.hero_image && imageLock[c.v2.hero_image.slug]);
  const img = photo && imageLock[photo.v2.hero_image.slug];
  const banner = img ? `<img src="../${e(img.path)}" alt="${e(photo.v2.hero_image.alt)}" width="${img.width}" height="${img.height}" loading="eager" fetchpriority="high" decoding="async">
          <figcaption>${e(photo.v2.hero_image.caption)} Photo: ${e(img.artist)} via <a href="${e(img.source_page)}">Wikimedia Commons</a>, ${img.license_url ? `<a href="${e(img.license_url)}">${e(img.license)}</a>` : e(img.license)}. Resized and cropped.</figcaption>` : undefined;
  return placeSitePageHero(page({
    title: brand.seo_title,
    description: brand.description,
    canonical: brandPageUrl(brand),
    path: brandPagePath(brand),
    body
  }), brandPagePath(brand), banner);
}

// QUEUE G16 (OWNER D32): the seasonal page, kept at one URL with no year in the slug and refreshed each season.
// It adds no facts of its own beyond black-friday.json: cards, savings and deadlines come from deal-checks.json,
// so it cannot disagree with the hub, and offers leave it on the same day they leave the hub.
export const blackFridayPath = "deals/black-friday-family-travel-deals.html";
export const blackFridayUrl = "https://familytripwise.com/deals/black-friday-family-travel-deals.html";
export const blackFridaySeason = () => JSON.parse(readFileSync(new URL("./black-friday.json", import.meta.url), "utf8"));
const shortDate = (iso) => longDate(iso).replace(/, \d{4}$/, "");

export function blackFridayPage(checks, today = easternDate(), season = blackFridaySeason()) {
  const problems = validateDealChecks(checks, { today });
  if (problems.length) throw new Error(`deal-checks.json is not publishable:\n${problems.join("\n")}`);
  const current = currentChecks(checks, today);
  const saving = (c) => spendSave(c, today).save;
  // D22: only real deals are shown as deals. Tagged sales we cannot price (or that do not save) stay collapsed.
  const real = current.filter((c) => isRealDeal(c, today)).sort((a, b) => saving(b) - saving(a) || a.id.localeCompare(b.id));
  const unpricedSales = current.filter((c) => c.black_friday_offer && !isRealDeal(c, today));
  const unconfirmed = season.unconfirmed.filter((u) => u.list_until >= today && u.observed_on <= today);
  const beforeSale = today <= season.black_friday;
  // Counted over the offers on this page only, and stated only while they bear it out.
  const noEndDate = real.filter((c) => c.deadline_stated === false && !c.v2.saver_flag).length;
  const mayEndEarly = real.filter((c) => c.v2.saver_flag).map((c) => `${c.operator} ${c.v2.saver_flag.replace(/^May/, "may")}.`).join(" ");
  const endsEarly = real.filter((c) => c.deadline_stated !== false && c.expires_on < season.black_friday).length;
  const waitRisk = [
    noEndDate ? `${noEndDate === 1 ? "One offer" : `${noEndDate} offers`} on this page ${noEndDate === 1 ? "names" : "name"} no end date, so ${noEndDate === 1 ? "it" : "they"} could end any time.` : "",
    endsEarly ? `${endsEarly === 1 ? "One ends" : `${endsEarly} end`} before Black Friday.` : "",
    mayEndEarly
  ].filter(Boolean).join(" ");
  const passes = real.filter((c) => c.category === "Theme park pass").length;
  const topIsPass = real[0]?.category === "Theme park pass";
  const topSides = real.length ? spendSave(real[0], today) : null;
  // One lead: the top saving with both sides, then the buy-or-wait answer. It says only what the offer pages show.
  const lead = beforeSale
    ? (real.length ? `Biggest saving: ≈\u00a0${usd(saving(real[0]))} for a family of 4 on a ${real[0].operator} ${topIsPass ? "pass" : "offer"} (${usd(topSides.without)} without, ${usd(topSides.with)} with${topIsPass ? `, ${real[0].v2.spend_save.unit_short.replace(/^(\d+) park /, "$1 ")}` : ""}; estimate). No offer we read promises lower Black Friday prices.` : `Black Friday is ${shortDate(season.black_friday)}. No open offer we checked can be priced as a real saving today.`)
    : `Black Friday has passed.${real.length ? " These offers are still open, each priced in dollars for a family of 4." : ""}`;
  const soonest = real.filter((c) => c.deadline_stated !== false).sort((a, b) => a.expires_on.localeCompare(b.expires_on))[0];
  const mon = (iso) => shortDate(iso).replace(/^([A-Z][a-z]{2})[a-z]+/, "$1");
  const payoff = (c, r) => breakEven(c, r).replace(/<[^>]+>/g, "").replace(/\s*\(estimate.*$/s, "").trim();
  const ages = (r) => r.party.replace(/^2 adults and 2 kids /, "kids ");
  // Derived only from the card's own figures: the pass price per family visit and the visit where it pays off.
  const visits = (c) => Number(/^(\d+) park (?:visits|days)\b/.exec(c.v2.spend_save.unit_short)?.[1]) || 0;
  const perVisit = (c, r) => (c.category === "Theme park pass" && visits(c) ? `≈ ${usd(Math.round(r.with / visits(c)))} a family visit` : "");
  const payoffAt = (c, r) => Number(/from your (\d+)(?:st|nd|rd|th)\b/.exec(payoff(c, r))?.[1]) || 0;
  const verdict = (c, r) => (season.verdict_plain?.[c.id]?.for_pill === c.v2.verdict_pill ? season.verdict_plain?.[c.id]?.text : null) ?? c.v2.verdict_pill ?? (c.category === "Theme park pass" && payoffAt(c, r) ? `Only for ${payoffAt(c, r)}+ visits` : "");
  // Top cards: tickets-only passes share one line in the note above them, so the basis is not repeated per card.
  const topPasses = real.slice(0, 3).every((c) => c.category === "Theme park pass" && /2027/.test(c.id) && /tickets only/i.test(c.v2.spend_save.basis));
  // One family visit on the card's own cheapest day-ticket figure; a pass's per-person price, with a dated earlier price only while it still applies.
  const dayTickets = (c) => c.v2.spend_save.without.parts.find((p) => /\b(single|one)-day ticket/i.test(p.what))?.unit_amount;
  const personPrice = (c) => /a person/.test(c.v2.spend_save.with.parts[0].what) ? c.v2.spend_save.with.parts[0].unit_amount : null;
  const money = (n) => (Number.isInteger(n) ? `$${n}` : `$${n.toFixed(2)}`);
  // When "without" is a mix of multi-day and day tickets, one visit x visits will not add up to it, so the card names the mix.
  const withoutMix = (c) => {
    const parts = c.v2.spend_save.without.parts;
    if (parts.length < 2 || !parts.every((p) => p.qty === 4 && /ticket/i.test(p.what) && /, (?:from )?\$/.test(p.what))) return "";
    const names = parts.map((p) => `${money(p.unit_amount)} ${/\b(single|one)-day\b/i.test(p.what) ? "day ticket" : p.what.replace(/, (?:from )?\$.*$/, "")}`);
    return `Without the pass, each of you buys a ${names.join(" and a ")}`;
  };
  // Saving at the first visit where the pass pays off, only when "without" is plain day tickets x visits.
  const earlySave = (c, r) => {
    const at = payoffAt(c, r), day = dayTickets(c);
    if (!day || at < 2 || at >= visits(c) || c.v2.spend_save.without.parts.length !== 1) return "";
    const save = Math.round(at * 4 * day - r.with);
    return save > 0 ? `${at} visits: save ≈ ${usd(save)}` : "";
  };
  const savers = real.slice(0, 3).map((c) => {
    const r = spendSave(c, today);
    const isPass = c.category === "Theme park pass";
    const each = isPass ? personPrice(c) : null;
    const was = season.price_notes?.[c.id]?.for_price === each ? season.price_notes[c.id].text : "";
    const day = isPass ? dayTickets(c) : null;
    const meta = [season.places?.[c.id], c.black_friday_offer].filter(Boolean).join(" · ");
    return `<li class="saver"><a class="saver-name" href="./${e(c.id)}.html">${e(c.operator)}</a> <span class="saver-meta">${e(meta || c.category)}</span> <span class="saver-save">Save ≈ ${e(usd(r.save))} <small>(${r.save_pct}%)</small> <small class="saver-over">over ${e(c.v2.spend_save.unit_short)}, ${e(ages(r).replace("aged ", ""))}</small></span> <span class="saver-sides">${isPass ? "Without the pass" : "Without"} ≈\u00a0${e(usd(r.without))} · with ${isPass ? "it " : ""}≈\u00a0${e(usd(r.with))}</span>${each ? ` <span class="saver-sides">The pass: ${e(money(each))} a person${was ? ` (${e(was)})` : ""}</span>` : ""}${day ? ` <span class="saver-sides">One visit: day tickets from ≈ ${e(usd(Math.round(day * 4)))} for 4 on the cheapest dates</span>` : ""}${isPass && withoutMix(c) ? ` <span class="saver-sides">${e(withoutMix(c))}</span>` : ""}${isPass && earlySave(c, r) ? ` <span class="saver-sides">${e(earlySave(c, r))}</span>` : ""}${c.v2.saver_flag ? ` <span class="saver-sides"><strong>${e(c.v2.saver_flag)}</strong></span>` : ""} ${verdict(c, r) ? `<span class="saver-call">${e(verdict(c, r))}</span> ` : ""}<span class="saver-checked">${topPasses ? "" : `${e(c.v2.spend_save.basis)} `}Checked ${e(mon(c.observed_on))}.</span></li>`;
  }).join("");
  const littleKids = [real.find((c) => /^LEGOLAND/.test(c.operator)), real.find((c) => /^Sesame/.test(c.operator))].filter(Boolean);
  const rows = real.map((c) => {
    const r = spendSave(c, today);
    const sample = c.v2.spend_save.without.parts.some((x) => x.from === "price_sample") ? c.v2.price_sample : null;
    const line = (items) => items.filter(Boolean).map((x) => e(x)).join(" · ");
    const facts = line([season.places?.[c.id], `${c.category === "Theme park pass" ? "" : `${c.category}, `}${c.v2.spend_save.unit_short}`, ages(r).replace("aged ", "")]);
    const fine = line([c.black_friday_offer ? `Sold as ${c.black_friday_offer}` : "", c.deadline_stated === false ? (c.v2.saver_flag ?? "") : `Book by ${mon(c.expires_on)}`, `checked ${mon(c.observed_on)}`, sample ? `Hotel price for ${shortStay(sample.stay_from, sample.stay_to).replace(/, \d{4}$/, "")}; ${c.v2.spend_save.basis}` : ""]);
    return `<tr id="${e(c.id)}"><th scope="row"><a href="./${e(c.id)}.html">${e(c.operator)}</a><small>${facts}</small><small class="bf-verdict">${line([verdict(c, r), perVisit(c, r)])}</small><small>${fine}</small></th><td>${e(usd(r.without))}</td><td>${e(usd(r.with))}</td><td class="bf-save">${e(usd(r.save))} <small>(${r.save_pct}%)</small></td></tr>`;
  }).join("");
  const unpricedCount = unpricedSales.length + unconfirmed.length;
  const body = `    <main id="main" class="bf-page">
      <section class="page-hero">
        <div class="container">
          <p class="eyebrow">Black Friday · Family travel</p>
          <h1>Black Friday Family Travel Deals, Priced for a Family of 4</h1>
          <p>${e(lead)}</p>
          ${contributorCredit()}
        </div>
      </section>
${savers ? `      <section id="deals-answer" class="container answer-box deals-savers" aria-label="Biggest savings">
        <p class="savers-title"><strong>Biggest savings we can price today</strong></p>
        <p class="savers-note">${topPasses ? "Estimates for 2 adults and 2 kids, visiting by the end of 2027, against the lowest ticket prices we saw. Tickets only: no tax, fees, parking or travel. You save this only if you use every visit." : "Estimates for 2 adults and 2 kids, against booking the same trip without the offer. Passes save this only if you use all the visits."}</p>
        <ul class="savers" role="list">${savers}</ul>${littleKids.length === 2 ? `
        <p class="bf-soonest"><strong>Kids under 6?</strong> <a href="#${e(littleKids[0].id)}">${e(littleKids[0].operator.replace(/ Resort$/, ""))}</a>, aimed at ages 2 to 12, saves ≈\u00a0${e(usd(saving(littleKids[0])))} over ${e(littleKids[0].v2.spend_save.unit_short.replace(/^(\d+) park /, "$1 "))}. <a href="#${e(littleKids[1].id)}">${e(littleKids[1].operator)}</a>, built around Sesame Street, saves ≈\u00a0${e(usd(saving(littleKids[1])))} over ${e(littleKids[1].v2.spend_save.unit_short.replace(/^(\d+) park /, "$1 "))}.</p>` : ""}${soonest ? `
        <p class="bf-soonest"><strong>Earliest posted deadline:</strong> <a href="./${e(soonest.id)}.html">${e(soonest.operator)}</a>, book by ${e(shortDate(soonest.expires_on))}.</p>` : ""}
      </section>
` : `      <section id="deals-answer" class="container answer-box" aria-label="Biggest savings">
        <p>No open offer we checked saves a family of 4 at least ${REAL_DEAL_MIN_PCT}% today. Offers appear here once we can price them.</p>
      </section>
`}${beforeSale ? `      <section class="container page-section" aria-labelledby="bf-wait-title">
        <h2 id="bf-wait-title">Should you wait for Black Friday?</h2>
        <ul>
          <li><strong>Prices could still drop, but we can't promise it.</strong> None of the offer pages we read promises a lower price on Black Friday itself.</li>
${waitRisk ? `          <li><strong>Waiting can cost you.</strong> ${e(waitRisk)}</li>
` : ""}          <li><strong>Buy if the math already works.</strong> A pass saves the amount shown only if you use all the visits.</li>
        </ul>
      </section>
` : ""}${rows ? `      <section class="container page-section" aria-labelledby="bf-all-title">
        <h2 id="bf-all-title">Real savings we've checked, open now (${real.length})</h2>
        <p>Each saves at least ${REAL_DEAL_MIN_PCT}% on our estimate. Tap an offer for what is and is not included.${passes * 2 > real.length ? " Mostly passes: they suit families who live nearby or will come back. Only coming once? A day ticket bought online for a cheap date costs less." : ""}</p>
        <div class="table-wrap">
          <table class="bf-table">
            <caption>Estimates for 2 adults and 2 kids, biggest saving first. Passes: tax, fees, parking and travel not counted. No end date posted unless a row gives one.</caption>
            <thead><tr><th scope="col">Offer</th><th scope="col">Without</th><th scope="col">With</th><th scope="col">Save</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </section>
` : ""}      <section class="container page-section" aria-labelledby="bf-check-title">
        <h2 id="bf-check-title">How to check any Black Friday travel deal</h2>
        <ol>
          <li><strong>Price the same dates twice,</strong> with and without the offer, for your real party. "Up to 65% off" says little until you do.</li>
          <li><strong>Check who counts.</strong> Child ages and the 3rd and 4th guest rules change the family total most.</li>
          <li><strong>Add what the headline leaves out:</strong> taxes, resort fees, parking and required tips.</li>
          <li><strong>Read the book-by and travel dates,</strong> including blackout dates around school holidays.</li>
        </ol>
      </section>
${unpricedCount ? `      <section class="container page-section" aria-labelledby="bf-unpriced-title">
        <h2 id="bf-unpriced-title">Big sales we can't price yet (${unpricedCount})</h2>
        <p>Not counted as deals until we can compare the price for a family of 4.</p>
        <details class="deals-other">
          <summary>Show these sales</summary>
          <div class="detail-card-grid">
${unpricedSales.map((c) => hubCard(c, today)).join("\n")}${unconfirmed.map((u) => `
          <article class="detail-card deal-card">
            <p class="fresh-type">${e(u.kind || "Hotel sale")} · not checked in full</p>
            <h3>${e(u.operator)}</h3>
            <p>${e(u.text)}</p>
            <p class="deal-source">Official page, checked ${e(longDate(u.observed_on))}: <a href="${e(u.url)}">${e(u.source_label)}</a></p>
          </article>`).join("")}
          </div>
        </details>
      </section>
` : ""}      <section class="container trust-panel" aria-label="How we check these offers">
        <p><strong>How we check:</strong> each offer's own page links the official terms we read and the date we read them. We have not booked these offers. Savings are estimates we added up from dated published prices, not quotes. Prices change: check live before you book.</p>
      </section>
    </main>`;
  const html = page({
    title: "Black Friday Family Travel Deals, Priced for a Family of 4",
    description: "Black Friday and other open family travel offers with the real savings estimated in dollars for 2 adults and 2 kids, from dated prices. Offers leave the page when they end.",
    canonical: blackFridayUrl,
    path: blackFridayPath,
    body,
    // The share image names a figure, so it is used only while that figure is still the page's top saving.
    ...(season.og && real[0]?.id === season.og.check && saving(real[0]) === season.og.save ? { og: { title: "Black Friday Family Travel Deals, Priced for a Family of 4", description: "Black Friday and other open family travel offers with the real savings estimated in dollars for 2 adults and 2 kids, from dated prices. Offers leave the page when they end.", image: `https://familytripwise.com/${season.og.image}`, alt: season.og.alt } } : {})
  });
  // The banner shows the biggest priced saving on this page; with no photo available the page simply has none.
  const banner = (season.banner_checks ?? []).map((id) => real.find((c) => c.id === id));
  const pick = [...banner, ...real].find((c) => c?.v2?.hero_image && imageLock[c.v2.hero_image.slug]);
  if (!pick) return html;
  const img = imageLock[pick.v2.hero_image.slug];
  return placeSitePageHero(html, blackFridayPath, `<img src="../${e(img.path)}" alt="${e(pick.v2.hero_image.alt)}" width="${img.width}" height="${img.height}" loading="eager" fetchpriority="high" decoding="async">
          <figcaption>${e(pick.operator)}. Photo: ${e(img.artist)} via <a href="${e(img.source_page)}">Wikimedia Commons</a>, ${img.license_url ? `<a href="${e(img.license_url)}">${e(img.license)}</a>` : e(img.license)}. Resized and cropped.</figcaption>`);
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
            <caption>${e(check.terms_caption ?? `What the ${check.operator} offer page said on ${longDate(check.observed_on)}`)}</caption>
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

// R1 / OWNER D46 #5: an ended check's page stays live (it says the offer ended) but leaves the sitemap,
// so crawlers spend their visits on current offers. A check whose end date moves later comes back.
// tools/this-week.mjs re-applies this daily, so the deploy's daily refresh matches the full build.
export function dealSitemapUrls(checks = readDealChecks(), today = easternDate()) {
  return [dealsHubUrl, blackFridayUrl, ...PASS_BRANDS.map(brandPageUrl), ...checks.filter((check) => !isEnded(check, today)).map(dealPageUrl)];
}

/** Every URL the deals generator owns (hub, Black Friday page, every check page, ended or not). */
export function allDealUrls(checks = readDealChecks()) {
  return [dealsHubUrl, blackFridayUrl, ...PASS_BRANDS.map(brandPageUrl), ...checks.map(dealPageUrl)];
}

/** The sitemap URL list with its deal block replaced by today's dealSitemapUrls(), kept in place
 * (at the hub's position) so the daily refresh writes the same sitemap as tools/generate-pages.mjs. */
export function withCurrentDealUrls(urls, checks = readDealChecks(), today = easternDate()) {
  const owned = new Set(allDealUrls(checks));
  const at = urls.indexOf(dealsHubUrl);
  if (at < 0) throw new Error("sitemap has no /deals/ hub to anchor the deal pages");
  const before = urls.slice(0, at).filter((url) => !owned.has(url));
  const after = urls.slice(at).filter((url) => !owned.has(url));
  return [...before, ...dealSitemapUrls(checks, today), ...after];
}

export function writeDealPages(writeSite, today = easternDate()) {
  const checks = readDealChecks();
  writeSite(dealsHubPath, dealsHubPage(checks, today));
  writeSite(blackFridayPath, blackFridayPage(checks, today));
  for (const brand of PASS_BRANDS) writeSite(brandPagePath(brand), brandPage(checks, brand, today));
  for (const check of checks) writeSite(dealPagePath(check), dealCheckPage(checks, check, today));
}

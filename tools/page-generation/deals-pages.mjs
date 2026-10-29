// /deals/ hub and one page per Family Deal Check (QUEUE G02, OWNER D11).
// One validated data file (deal-checks.json) feeds every deal page. A check whose expires_on is
// before today's America/New_York date leaves the hub; its own page stays and says the offer ended (or that we stopped listing it, when no deadline was stated).
// No build date is shown, so pages change only when checks are added, edited or end.
// tools/this-week.mjs re-renders these pages daily in the Pages deploy workflow.
import { readFileSync } from "node:fs";
import { contributorCredit } from "./contributors.mjs";
import { siteHeader, siteFooter } from "./site-chrome.mjs";
import { easternDate } from "./sitemap.mjs";

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
    const ok = t && typeof c.amount === "string" && /^[A-Z]{3} [\d,]+(\.\d\d)?$/.test(c.amount) && validDate(c.observed_on) && sentence(c.basis);
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
  }
  return problems;
}

export function currentChecks(checks, today = easternDate()) {
  return checks
    .filter((check) => !isEnded(check, today))
    .sort((a, b) => a.expires_on.localeCompare(b.expires_on) || a.id.localeCompare(b.id));
}

function page({ title, description, canonical, path, body }) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${e(title)}</title>
    <meta name="description" content="${e(description)}">
    <link rel="canonical" href="${canonical}">
    <link rel="stylesheet" href="../styles.css">
  </head>
  <body>
    ${siteHeader("../", path)}
${body}
    ${siteFooter("../", path)}
  </body>
</html>
`;
}

const trustPanel = `      <section class="container trust-panel" aria-label="How Family Deal Checks work">
        <p><strong>How we check:</strong> every term below was read on the company's own offer page on the date shown, with a link to that page. We have not booked these offers. "For a family of 4" notes are our reading of those terms, not a quote or firsthand experience.</p>
        <p>We show a family total only when we observed one on the official site for a named party and named dates. Prices and availability change: check live before you book.</p>
      </section>`;

function hubCard(check) {
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
    ? `<div class="detail-card-grid">\n${current.map(hubCard).join("\n")}\n        </div>`
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
  return page({
    title: "Family Travel Deals Checked for a Family of 4 | Family Tripwise",
    description: "Current family travel offers with the terms that matter to parents: child ages, occupancy, blackout dates, minimum stays and fees, each checked on the official page.",
    canonical: dealsHubUrl,
    path: dealsHubPath,
    body
  });
}

function otherChecks(checks, current, today) {
  const others = checks.filter((c) => c.id !== current.id).sort((a, b) => Number(isEnded(a, today)) - Number(isEnded(b, today)) || a.expires_on.localeCompare(b.expires_on));
  if (!others.length) return "";
  const items = others.map((c) => `<li><a href="./${e(c.id)}.html">${e(c.title)}</a> <span class="fresh-upcoming-meta">(${isEnded(c, today) ? `${c.deadline_stated === false ? "no longer listed after" : "ended"} ${e(longDate(c.expires_on))}` : shortDeadline(c)})</span></li>`).join("");
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

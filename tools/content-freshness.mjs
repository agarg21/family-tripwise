import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const MONTHS = new Map(
  [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ].flatMap((month, index) => [
    [month.toLowerCase(), index],
    [month.slice(0, 3).toLowerCase(), index]
  ])
);

const OPERATIONAL_TERMS =
  /\b(?:closed|closure|closures|construction|renovation|outage|suspended|shutdown|unavailable)\b/i;
const DATE_RANGE =
  /\b(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+(\d{1,2})(?:\s*[-–]\s*(\d{1,2}))?,\s*(\d{4})\b/gi;
const RESOLVED_TERMS = /\b(?:then\s+)?(?:reopened|resumed|resolved|completed|ended)\b/i;
const SOURCE_CHECK_SUFFIX = /\b(?:rechecked|checked|updated|reviewed|verified|collected)(?:\s+on)?\s*:?\s*$/i;
const FAILED_SOURCE_RECHECK_PREFIX = /^\s+(?:source\s+)?recheck\s+(?:was\s+)?(?:unavailable|failed|blocked)\b/i;
const EXPLICIT_START_SUFFIX = /\b(?:(?:closure|closures|construction|renovation|outage|shutdown)\s+(?:starts?|begins?|commences?)|(?:closed|suspended|unavailable)\s+(?:starting|beginning))\s+(?:on\s+)?$/i;
const CALENDAR_DATE =
  /\b(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+(\d{1,2})(?:\s*[-–]\s*(?:(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+)?(\d{1,2}))?(?:(?:\s*,\s*|\s+)(\d{4}))?\b/gi;

function visibleText(html) {
  return html
    .replace(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi, (_match, attributes, body) =>
      /\btype=["']application\/json["']/i.test(attributes) ? ` ${body} ` : " "
    )
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim();
}

export function findExpiredOperationalNotices(html, { now = new Date() } = {}) {
  const text = visibleText(html);
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const notices = [];

  for (const match of text.matchAll(DATE_RANGE)) {
    const month = MONTHS.get(match[1].toLowerCase());
    const endDay = Number(match[3] ?? match[2]);
    const year = Number(match[4]);
    const end = Date.UTC(year, month, endDay);
    const priorBoundary = Math.max(
      text.lastIndexOf(".", match.index - 1),
      text.lastIndexOf("!", match.index - 1),
      text.lastIndexOf("?", match.index - 1)
    );
    const followingBoundaries = [".", "!", "?"]
      .map((punctuation) => text.indexOf(punctuation, match.index + match[0].length))
      .filter((index) => index >= 0);
    const start = priorBoundary < 0 ? 0 : priorBoundary + 1;
    const finish = followingBoundaries.length > 0 ? Math.min(...followingBoundaries) + 1 : text.length;
    const excerpt = text.slice(start, finish).trim();
    const afterDate = text.slice(match.index + match[0].length, finish);
    const beforeDate = text.slice(start, match.index);
    if (SOURCE_CHECK_SUFFIX.test(beforeDate) ||
        (!OPERATIONAL_TERMS.test(beforeDate) && FAILED_SOURCE_RECHECK_PREFIX.test(afterDate))) continue;
    // A labelled single start is not an end; ranges and later deadlines still need review.
    if (!match[3] && EXPLICIT_START_SUFFIX.test(beforeDate)) continue;

    if (end < today && OPERATIONAL_TERMS.test(excerpt) && !RESOLVED_TERMS.test(afterDate)) {
      notices.push({
        endDate: new Date(end).toISOString().slice(0, 10),
        excerpt
      });
    }
  }

  return notices;
}

function dateReviewTexts(html) {
  const texts = [];
  const addText = (value) => texts.push(visibleText(
    value.replace(/<\/(?:p|li|td|th|h[1-6]|div|section|article)>|<br\s*\/?>/gi, "$&. ")
  ));
  const visit = (value, key = "") => {
    if (typeof value === "string") {
      if (!/^(?:(?:source|last)[_-]?)?(?:checked|updated|reviewed|verified|collected)(?:[_-]?(?:at|on|date))?$/i.test(key)) addText(value);
    } else if (value && typeof value === "object") {
      for (const [childKey, child] of Object.entries(value)) visit(child, childKey);
    }
  };
  // JSON values and HTML blocks cannot borrow context from unrelated records.
  const body = html.replace(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi, (_match, attributes, source) => {
    if (/\btype=["']application\/json["']/i.test(attributes)) {
      try {
        visit(JSON.parse(source));
      } catch {
        // Malformed JSON has no trustworthy field boundaries; do not guess them.
      }
    }
    return " ";
  });
  addText(body);
  return texts;
}

export function findYearlessOperationalNotices(html) {
  const notices = [];
  const seen = new Set();
  for (const text of dateReviewTexts(html)) {
    for (const match of text.matchAll(CALENDAR_DATE)) {
      if (match[5]) continue;
      const start = Math.max(...[".", "!", "?"].map((mark) => text.lastIndexOf(mark, match.index - 1))) + 1;
      const ends = [".", "!", "?"]
        .map((mark) => text.indexOf(mark, match.index + match[0].length))
        .filter((index) => index >= 0);
      const finish = ends.length ? Math.min(...ends) + 1 : text.length;
      const excerpt = text.slice(start, finish).trim();
      const beforeDate = text.slice(start, match.index);
      if (!OPERATIONAL_TERMS.test(excerpt)) continue;
      if (SOURCE_CHECK_SUFFIX.test(beforeDate) ||
          (!OPERATIONAL_TERMS.test(beforeDate) && FAILED_SOURCE_RECHECK_PREFIX.test(text.slice(match.index + match[0].length, finish)))) continue;
      const key = `${match[0]}|${excerpt}`;
      if (seen.has(key)) continue;
      seen.add(key);
      notices.push({ dateText: match[0], reason: "missing-year", excerpt });
    }
  }
  return notices;
}

const DATE_TOKEN = String.raw`(?:\d{4}-\d{2}-\d{2}|(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\.?\s+\d{1,2}\b)`;
const REVIEW_DUE_PATTERNS = [
  /\b(?:review|recheck|re-check|refresh|research)(?:\s+is)?(?:\s+next)?\s+due\b/i,
  /\bnext\s+(?:source\s+|price\s+)?review\s+date\b/i,
  /\bnext\s+(?:source\s+|price\s+)?(?:review|recheck|refresh)\s*:/i,
  /\b(?:review|recheck|refresh)\s+(?:is\s+)?scheduled\b/i,
  new RegExp(String.raw`\b(?:review|recheck|re-check|refresh)\s+(?:on\s+|by\s+|before\s+)?${DATE_TOKEN}`, "i"),
  /(?<!\b(?:payment|payments|balance|deposit|charge|charges|fee|fees|amount|paid|payable|full payment)\s)\bdue\s+(?:on\s+|by\s+)?(?:\d{4}-\d{2}-\d{2}|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{1,2}\b)/i
];

// Public pages state when a fact was observed, never when it will next be reviewed.
export function findReviewDueDates(text) {
  const plain = /<[a-z!/]/i.test(text) ? dateReviewTexts(text).join(" ") : text;
  const found = [];
  for (const pattern of REVIEW_DUE_PATTERNS) {
    for (const match of plain.matchAll(new RegExp(pattern.source, "gi"))) {
      found.push(plain.slice(Math.max(0, match.index - 60), match.index + match[0].length + 40).trim());
    }
  }
  return found;
}

const MONTH_INDEX = (name) => MONTHS.get(name.toLowerCase().slice(0, 3));
const STAY_RANGE =
  /\b(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+(\d{1,2})\s*[-–]\s*(?:(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+)?\d{1,2},?\s*(\d{4})\b/gi;
const PRICED_STAY = /\bnights?\b|\bper (?:room|suite|apartment)\b|\bUSD\b|\bGBP\b|\$\s?\d/i;
const PAST_STAY_LABEL = /older observation|dates passed|stay dates have passed/i;

// A priced stay sample whose arrival date is today or earlier must say so in the same block.
export function findPastStaySamples(html, { now = new Date() } = {}) {
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const found = [];
  for (const block of dateReviewTexts(html.replace(/<\/(?:p|li|td|th|h[1-6]|div)>/gi, "$&\u0000"))) {
    for (const part of block.split("\u0000")) {
      for (const match of part.matchAll(STAY_RANGE)) {
        const start = Date.UTC(Number(match[3]), MONTH_INDEX(match[1]), Number(match[2]));
        if (start <= today && PRICED_STAY.test(part) && !PAST_STAY_LABEL.test(part)) found.push(match[0]);
      }
    }
  }
  return found;
}

function walkHtml(dir) {
  return readdirSync(dir)
    .flatMap((entry) => {
      const filePath = join(dir, entry);
      return statSync(filePath).isDirectory()
        ? walkHtml(filePath)
        : filePath.endsWith(".html")
          ? [filePath]
          : [];
    })
    .sort();
}

function runCli() {
  const rootDir = fileURLToPath(new URL("../", import.meta.url));
  const siteDir = join(rootDir, "site");
  const failures = [];
  const unresolved = [];
  for (const filePath of walkHtml(siteDir)) {
    const html = readFileSync(filePath, "utf8");
    const path = relative(rootDir, filePath);
    failures.push(...findExpiredOperationalNotices(html).map((notice) => ({ path, ...notice })));
    unresolved.push(...findYearlessOperationalNotices(html).map((notice) => ({ path, ...notice })));
  }

  console.log(`Content freshness QA: ${failures.length} expired operational notice(s)`);
  console.log(`Coverage review: ${unresolved.length} yearless operational date(s); expiry UNKNOWN, no year inferred`);
  for (const failure of failures) {
    console.log(`  ERROR ${failure.path} ended ${failure.endDate}: ${failure.excerpt}`);
  }
  for (const notice of unresolved) {
    console.log(`  WARN ${notice.path} missing year for ${notice.dateText}: ${notice.excerpt}`);
  }
  if (failures.length > 0) process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  runCli();
}

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
      if (/\b(?:checked|updated|reviewed|verified|collected)(?:\s+on)?\s*:?\s*$/i.test(beforeDate)) continue;
      const key = `${match[0]}|${excerpt}`;
      if (seen.has(key)) continue;
      seen.add(key);
      notices.push({ dateText: match[0], reason: "missing-year", excerpt });
    }
  }
  return notices;
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

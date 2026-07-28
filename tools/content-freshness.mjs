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
  const failures = walkHtml(siteDir).flatMap((filePath) =>
    findExpiredOperationalNotices(readFileSync(filePath, "utf8")).map((notice) => ({
      path: relative(rootDir, filePath),
      ...notice
    }))
  );

  console.log(`Content freshness QA: ${failures.length} expired operational notice(s)`);
  for (const failure of failures) {
    console.log(`  ERROR ${failure.path} ended ${failure.endDate}: ${failure.excerpt}`);
  }
  if (failures.length > 0) process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  runCli();
}

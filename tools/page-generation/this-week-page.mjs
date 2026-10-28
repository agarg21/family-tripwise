// /this-week/ (QUEUE G01, OWNER D11): dated family events, deadlines and news per city.
// One validated data file (fresh-items.json) feeds the page. Items past expires_on (America/New_York)
// are never rendered, and the page shows no build date, so its content changes only when items
// are added, edited or expire. tools/this-week.mjs re-renders it daily in the Pages deploy workflow.
import { readFileSync } from "node:fs";
import { contributorCredit } from "./contributors.mjs";
import { destinations, siteHeader, siteFooter } from "./site-chrome.mjs";
import { easternDate } from "./sitemap.mjs";

export const thisWeekPath = "this-week/index.html";
export const thisWeekUrl = "https://familytripwise.com/this-week/";
export const freshItemsPath = new URL("./fresh-items.json", import.meta.url);

const TYPES = new Set(["event", "news", "deal"]);
const TYPE_LABEL = { event: "Event", news: "News", deal: "Deal" };
const ISO = /^\d{4}-\d{2}-\d{2}$/;
const TEXT_FIELDS = ["title", "when", "cost", "booking", "family", "source_label"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const e = (value) => String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");

export function citySlug(name) {
  return String(name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function longDate(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}

function validDate(iso) {
  if (!ISO.test(iso)) return false;
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d;
}

export function readFreshItems(path = freshItemsPath) {
  return JSON.parse(readFileSync(path, "utf8")).items;
}

// Returns a list of problems; an empty list means every item may be published.
export function validateFreshItems(items, { today = easternDate() } = {}) {
  const problems = [];
  const ids = new Set();
  const cities = new Set(destinations.map((d) => d.name));
  for (const item of items) {
    const id = item?.id;
    const where = `item ${id ?? "(no id)"}`;
    if (typeof id !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) problems.push(`${where}: id must be kebab-case`);
    if (ids.has(id)) problems.push(`${where}: duplicate id`);
    ids.add(id);
    if (!TYPES.has(item.type)) problems.push(`${where}: type must be event, news or deal`);
    if (!cities.has(item.city)) problems.push(`${where}: city must be a site destination name`);
    for (const field of TEXT_FIELDS) {
      if (typeof item[field] !== "string" || item[field].trim().length < 3) problems.push(`${where}: ${field} is required`);
    }
    if (typeof item.official_url !== "string" || !/^https:\/\/[^\s]+$/.test(item.official_url)) problems.push(`${where}: official_url must be an https URL`);
    if (typeof item.third_party !== "boolean") problems.push(`${where}: third_party must be true or false`);
    if (item.third_party && !(typeof item.third_party_note === "string" && item.third_party_note.length > 10)) problems.push(`${where}: third-party items need third_party_note`);
    for (const field of ["observed_on", "starts_on", "sort_on", "expires_on"]) {
      if (!validDate(item[field] ?? "")) problems.push(`${where}: ${field} must be a real YYYY-MM-DD date`);
    }
    if (validDate(item.observed_on ?? "") && item.observed_on > today) problems.push(`${where}: observed_on is in the future`);
    if (item.expires_on < item.observed_on) problems.push(`${where}: expires_on is before observed_on`);
    if (item.expires_on < item.starts_on) problems.push(`${where}: expires_on is before starts_on`);
    if (item.sort_on > item.expires_on) problems.push(`${where}: sort_on is after expires_on`);
    // No carried-forward dates: an item may not mention a year before the year it was observed.
    const observedYear = Number(String(item.observed_on).slice(0, 4));
    for (const field of [...TEXT_FIELDS, "official_url"]) {
      for (const match of String(item[field] ?? "").matchAll(/\b(20\d\d)\b/g)) {
        if (Number(match[1]) < observedYear) problems.push(`${where}: ${field} mentions ${match[1]}, before the observation year`);
      }
    }
  }
  return problems;
}

export function currentItems(items, today = easternDate()) {
  return items
    .filter((item) => item.expires_on >= today)
    .sort((a, b) => a.sort_on.localeCompare(b.sort_on) || a.expires_on.localeCompare(b.expires_on) || a.id.localeCompare(b.id));
}

function itemCard(item) {
  const label = item.third_party ? `Third-party report, read ${longDate(item.observed_on)}` : `Official page, checked ${longDate(item.observed_on)}`;
  const thirdParty = item.third_party ? `<p class="fresh-third-party"><strong>Not yet confirmed officially:</strong> ${e(item.third_party_note)}</p>` : "";
  return `            <article class="detail-card fresh-item" id="${e(item.id)}">
              <p class="fresh-type">${e(TYPE_LABEL[item.type])}</p>
              <h3>${e(item.title)}</h3>
              <dl class="fresh-facts">
                <div><dt>When</dt><dd>${e(item.when)}</dd></div>
                <div><dt>Cost</dt><dd>${e(item.cost)}</dd></div>
                <div><dt>Booking</dt><dd>${e(item.booking)}</dd></div>
                <div><dt>Family note</dt><dd>${e(item.family)}</dd></div>
              </dl>
              ${thirdParty}<p class="review-label">${e(label)}: <a href="${e(item.official_url)}">${e(item.source_label)}</a>. Listed here until ${e(longDate(item.expires_on))}.</p>
            </article>`;
}

function citySection(destination, items) {
  const slug = citySlug(destination.name);
  const guide = destination.guides[0];
  const body = items.length
    ? `<div class="detail-card-grid">\n${items.map(itemCard).join("\n")}\n          </div>`
    : `<p>No verified dated items for ${e(destination.name)} right now.</p>`;
  return `        <section class="container page-section fresh-city" id="${slug}" aria-labelledby="${slug}-title">
          <h2 id="${slug}-title">${e(destination.name)}</h2>
          ${body}
          <p class="fresh-guide-link">Planning the trip itself? <a href="../${guide[0]}">${e(destination.short || destination.name)}: ${e(guide[1].toLowerCase())}</a></p>
        </section>`;
}

export function thisWeekPage(items, today = easternDate()) {
  const problems = validateFreshItems(items, { today });
  if (problems.length) throw new Error(`fresh-items.json is not publishable:\n${problems.join("\n")}`);
  const current = currentItems(items, today);
  const byCity = (name) => current.filter((item) => item.city === name);
  const withItems = destinations.filter((d) => byCity(d.name).length);
  const title = "Family Events and Deadlines This Week: Holiday Lights, Lotteries and Tickets";
  const description = "Dated family events, ticket deadlines and news by city, each checked on its official page with the date we checked it. Items drop off when they end.";
  const upcoming = current.slice(0, 6).map((item) => `<li><a href="#${e(item.id)}">${e(item.title)}</a> <span class="fresh-upcoming-meta">(${e(item.city)}, ${e(longDate(item.sort_on))})</span></li>`).join("");
  const jump = withItems.map((d) => `<a href="#${citySlug(d.name)}">${e(d.short || d.name)} (${byCity(d.name).length})</a>`).join(" ");
  const body = `    <main id="main">
      <section class="page-hero">
        <div class="container">
          <p class="eyebrow">This week</p>
          <h1>Family Events and Deadlines This Week</h1>
          ${contributorCredit()}
          <p>Holiday events, ticket lotteries and booking deadlines that matter to families, by city. Each item was read on the organizer's official page; the check date is on every card.</p>
        </div>
      </section>
      <section class="container trust-panel" aria-label="How this list works">
        <p><strong>How we check:</strong> every date, price and booking rule below comes from the official page linked on its card, on the date shown. Family notes are our planning suggestions, not firsthand experience.</p>
        <p>Items leave this page automatically after their last date. Times, prices and availability change: confirm on the official page before you go or book.</p>
      </section>
      <section id="this-week-answer" class="container answer-box" aria-label="Coming up first">
        <p><strong>Coming up first:</strong></p>
        <ul class="fresh-upcoming">${upcoming || "<li>No verified dated items right now.</li>"}</ul>
        <p class="fresh-jump"><strong>By city:</strong> ${jump || "none right now"}</p>
      </section>
${destinations.map((d) => citySection(d, byCity(d.name))).join("\n")}
    </main>`;
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${e(title)}</title>
    <meta name="description" content="${e(description)}">
    <link rel="canonical" href="${thisWeekUrl}">
    <link rel="stylesheet" href="../styles.css">
  </head>
  <body>
    ${siteHeader("../", thisWeekPath)}
${body}
    ${siteFooter("../", thisWeekPath)}
  </body>
</html>
`;
}

export function writeThisWeekPage(writeSite, today = easternDate()) {
  writeSite(thisWeekPath, thisWeekPage(readFreshItems(), today));
}

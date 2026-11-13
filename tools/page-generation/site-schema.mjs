// Sitewide Organization + Article markup (QUEUE R1 step 3, owner D44; docs/plan/review-backlog-2026-11.md #3).
// Publisher = Family Tripwise; accountable person = the founder named on the About page.
// Built only from what each page already says: <title>, meta description, canonical URL, og:image,
// and the page's sitemap lastmod from the ledger (so Article dateModified always equals the sitemap <lastmod>). No author Person: guides are AI-assisted
// research (About page), so the Article author is the organization, never a person or the AI byline.
// One script tag per page, last in <body> (tests read a page's own schema first), replaced in place on
// every build so generate-pages.mjs and this-week.mjs write identical bytes.
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { readLedger } from "./sitemap.mjs";

export const ORIGIN = "https://familytripwise.com/";
export const ORG_ID = `${ORIGIN}#organization`;
// Founder as published on site/about.html (name, role, LinkedIn link).
const FOUNDER = { "@type": "Person", name: "Apoorva Garg", jobTitle: "Founder and publisher", url: `${ORIGIN}about.html`, sameAs: ["https://www.linkedin.com/in/apoorvag20/"] };
const ORG_SHORT = { "@type": "Organization", "@id": ORG_ID, name: "Family Tripwise", url: ORIGIN };
const ORG_FULL = { ...ORG_SHORT, description: "Family trip planning by city: where to stay, what to do and family deals, researched from dated official sources with AI assistance.", founder: FOUNDER };

// Guide, holiday, ski and single-deal pages are articles. Hubs, home, about, contributor, legal and
// /this-week/ pages carry the organization only. Pages that already declare their own WebPage keep it
// and get the organization only, so two page-level dates can never disagree.
const ARTICLE_PATH = /^(things-to-do|where-to-stay|family-itinerary|holidays|ski|deals)\/[a-z0-9-]+\.html$/;
const NOT_ARTICLE = new Set(["deals/index.html", "deals/black-friday-family-travel-deals.html"]);
const FULL_ORG_PAGES = new Set(["index.html", "about.html"]);

const unescape = (v) => String(v ?? "").replaceAll("&quot;", '"').replaceAll("&#39;", "'").replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("&amp;", "&");
const metaContent = (head, re) => unescape(head.match(re)?.[0]?.match(/\scontent="([^"]*)"/i)?.[1] ?? "").trim();
const TAG_RE = /<script type="application\/ld\+json" data-site-schema>[\s\S]*?<\/script>/;

/** The page without its site schema tag (for passes that rebuild a page and add the tag back last). */
export const stripSiteSchema = (html) => html.replace(TAG_RE, "");

export function pagePathFromUrl(url) {
  const p = url.slice(ORIGIN.length);
  return p === "" ? "index.html" : p.endsWith("/") ? `${p}index.html` : p;
}

/** The page's sitemap lastmod from the ledger, or null for a page outside the sitemap. The build runs the
 * final addSiteSchema() pass after writeSitemap(), so a page whose <main> changed today already reads today. */
export function pageLastmod(pagePath, ledger) {
  return ledger.pages?.[pagePath]?.lastmod ?? null;
}

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
/** The ISO date of a visible "Last updated: Month D, YYYY" line inside <main>, if any. */
export function visibleLastUpdated(html) {
  const main = html.match(/<main\b[\s\S]*<\/main>/i)?.[0] ?? "";
  const m = main.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").match(/Last updated:? ([A-Z][a-z]+) (\d{1,2}), (\d{4})/);
  const month = m && MONTHS.indexOf(m[1]) + 1;
  return month ? `${m[3]}-${String(month).padStart(2, "0")}-${m[2].padStart(2, "0")}` : null;
}

/** The page title without the brand suffix, at most 110 characters (cut at a word, with an ellipsis). */
export function articleHeadline(title) {
  const t = String(title).trim().replace(/\s*\|\s*Family Tripwise$/, "");
  return t.length <= 110 ? t : `${t.slice(0, 109).replace(/\s+\S*$/, "")}…`;
}

/** JSON-LD graph for one page, or null for pages that get none (redirect stubs, noindex, foreign canonical). */
export function siteSchema(html, pagePath, { ledger = readLedger() } = {}) {
  const head = html.replace(TAG_RE, "").match(/<head\b[\s\S]*?<\/head>/i)?.[0] ?? "";
  if (!/<main\b/i.test(html) || /<meta\s+name="robots"\s+content="[^"]*noindex/i.test(html)) return null;
  const url = head.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i)?.[1];
  if (!url || !url.startsWith(ORIGIN)) return null;
  pagePath = pagePath || pagePathFromUrl(url);
  if (pagePathFromUrl(url) !== pagePath) return null;
  const graph = [FULL_ORG_PAGES.has(pagePath) ? ORG_FULL : ORG_SHORT];
  if (pagePath === "index.html") graph.push({ "@type": "WebSite", "@id": `${ORIGIN}#website`, name: "Family Tripwise", url: ORIGIN, inLanguage: "en-US", publisher: { "@id": ORG_ID } });
  const ownWebPage = /"@type"\s*:\s*"WebPage"/.test(html.replace(TAG_RE, ""));
  if (ARTICLE_PATH.test(pagePath) && !NOT_ARTICLE.has(pagePath) && !ownWebPage) {
    const headline = articleHeadline(unescape(head.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? ""));
    if (!headline) throw new Error(`site schema: ${pagePath} has no <title>`);
    const article = { "@type": "Article", headline, url, mainEntityOfPage: url, inLanguage: "en-US" };
    const image = metaContent(head, /<meta\s+property="og:image"[^>]*>/i);
    if (image) article.image = image;
    // A visible "Last updated: <date>" that differs from the lastmod would make the page and its markup
    // disagree, so such a page carries no dateModified until its visible line is brought up to date.
    const lastmod = pageLastmod(pagePath, ledger);
    const visible = visibleLastUpdated(html);
    if (lastmod && (!visible || visible === lastmod)) article.dateModified = lastmod;
    article.author = { "@id": ORG_ID };
    article.publisher = { "@id": ORG_ID };
    graph.push(article);
  }
  return { "@context": "https://schema.org", "@graph": graph };
}

/** Adds (or refreshes) the page's site schema tag just before </body>. withLinkPreview() calls it, so every
 * generator that adds link previews writes the tag too; pagePath may be omitted (taken from the canonical). */
export function withSiteSchema(html, pagePath, options) {
  const clean = html.replace(TAG_RE, "");
  const schema = siteSchema(clean, pagePath, options);
  if (!schema || !/<\/body>/i.test(clean)) return clean;
  const tag = `<script type="application/ld+json" data-site-schema>${JSON.stringify(schema).replaceAll("<", "\\u003c")}</script>`;
  const at = clean.lastIndexOf("</body>");
  return clean.slice(0, at) + tag + clean.slice(at);
}

function htmlFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? htmlFiles(full) : name.endsWith(".html") ? [full] : [];
  });
}

/** Final generation pass (after writeSitemap, so dateModified reads today's ledger): every page in site/. */
export function addSiteSchema(siteDir) {
  const ledger = readLedger();
  let changed = 0;
  for (const file of htmlFiles(siteDir)) {
    const html = readFileSync(file, "utf8");
    const next = withSiteSchema(html, relative(siteDir, file).split(sep).join("/"), { ledger });
    if (next !== html) { writeFileSync(file, next); changed += 1; }
  }
  return changed;
}

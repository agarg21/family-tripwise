// Link-preview tags (og:/twitter:) for every page that does not write its own (owner D18, QUEUE G13).
// Built only from what the page already says: <title>, meta description, canonical URL and the
// first self-hosted photo in <main> (its alt text). Pages without a photo get a typographic
// Family Tripwise card. Images live in site/images/og/ and are rendered by tools/page-og-images.mjs;
// a missing image fails generation. Pages that already carry og:title (v2 deal pages) are left alone.
import { sitePageHeroes } from "./hero-photos.mjs";
import { fileURLToPath } from "node:url";
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { createHash } from "node:crypto";
import { selfHostedImage } from "./self-hosted-images.mjs";

const ORIGIN = "https://familytripwise.com/";
const e = (v) => String(v ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const unescape = (v) => String(v ?? "").replaceAll("&quot;", '"').replaceAll("&#39;", "'").replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("&amp;", "&");

// Typographic cards for pages without a photo (no photos, no AI images; text in tools/page-og-images.mjs).
export const CARDS = {
  site: { path: "images/og/site.png", alt: "Family Tripwise: family trip planning by city, checked against official sources" },
  deals: { path: "images/og/deals.png", alt: "Family Deal Checks from Family Tripwise: family travel deals, checked for what you get and the catch" },
  "this-week": { path: "images/og/this-week.png", alt: "This week from Family Tripwise: dated family events and deals, checked on official pages" }
};

export const photoCardPath = (slug) => `images/og/photos/${slug}.jpg`;
// Evergreen card per deal check without a v2 card: company, trip type and its og_card line (no dates).
// The file name hashes the text, so a changed line gets a new URL and cached previews cannot show the old one.
export function dealCardText(check) {
  return { kicker: `${check.operator} · ${check.category}`, title: check.og_card, line: "What you get, the catch and the deadline, checked on the official offer page" };
}
export const dealCardPath = (id, check = dealChecks().find((c) => c.id === id)) =>
  `images/og/deals/${id}-${createHash("sha256").update(JSON.stringify(dealCardText(check))).digest("hex").slice(0, 8)}.png`;
const dealChecks = () => JSON.parse(readFileSync(new URL("./deal-checks.json", import.meta.url), "utf8")).checks;

// Destinations by URL slug: the place name printed on that destination's photo cards, and the photo a
// destination page without its own photo uses (the same credited photo its other pages show).
export const DESTINATIONS = {
  "washington-dc": { place: "Washington DC", photo: "washington-dc-national-mall" },
  "new-york-city": { place: "New York City", photo: "new-york-city-central-park" },
  "san-diego": { place: "San Diego", photo: "san-diego-mission-bay" },
  "san-antonio": { place: "San Antonio", photo: "san-antonio-river-walk" },
  "las-vegas": { place: "Las Vegas", photo: "las-vegas-bellagio-fountains" },
  "puerto-vallarta": { place: "Puerto Vallarta", photo: "puerto-vallarta-panorama" },
  chicago: { place: "Chicago", photo: "chicago-millennium-park" },
  boston: { place: "Boston", photo: "boston-skyline" },
  london: { place: "London, UK", photo: "london-trafalgar-square" },
  cancun: { place: "Cancun", photo: "cancun-aerial" },
  orlando: { place: "Orlando", photo: "orlando-lake-eola" }
};
export function destinationOf(name) {
  return Object.keys(DESTINATIONS).find((key) => name === key || name.startsWith(`${key}-`)) ?? null;
}

function attr(tag, name) {
  return tag.match(new RegExp(`\\s${name}="([^"]*)"`, "i"))?.[1] ?? null;
}

function cardFor(pagePath) {
  if (pagePath.startsWith("deals/")) return CARDS.deals;
  if (pagePath.startsWith("this-week/")) return CARDS["this-week"];
  return CARDS.site;
}

/** The image a page's link preview uses: its first self-hosted photo in <main>, else a section card. */
export function previewImage(html, pagePath) {
  // Hub, about and legal pages keep their Family Tripwise card even though they now show a banner photo (G14 batch 3):
  // a photo card would label the page with that photo's city.
  if (sitePageHeroes[pagePath]) {
    const card = cardFor(pagePath);
    return { path: card.path, alt: card.alt, width: 1200, height: 630, type: "image/png" };
  }
  const main = html.match(/<main\b[\s\S]*<\/main>/i)?.[0] ?? "";
  for (const tag of main.match(/<img\b[^>]*>/gi) || []) {
    const src = attr(tag, "src") || "";
    // Generators emit Commons URLs that selfHostImages() later rewrites to images/<slug>.webp.
    const local = /^https?:\/\/(?:commons|upload|thumb)\.wikimedia\.org\//i.test(src) ? selfHostedImage(src).path : src;
    const slug = local.match(/(?:^|\/)images\/([a-z0-9-]+)\.webp$/)?.[1];
    const alt = unescape(attr(tag, "alt") || "").trim();
    if (slug && alt) return { path: photoCardPath(slug), alt, width: 1200, height: 630, type: "image/jpeg" };
  }
  const file = pagePath.split("/").pop().replace(/\.html$/, "");
  const dest = !/^(deals|this-week)\//.test(pagePath) && destinationOf(file);
  if (dest) {
    const lock = JSON.parse(readFileSync(new URL("../images/commons-images.lock.json", import.meta.url), "utf8"));
    const photo = lock[DESTINATIONS[dest].photo];
    if (!photo) throw new Error(`link preview: no self-hosted photo ${DESTINATIONS[dest].photo}`);
    const alt = `Photo of ${DESTINATIONS[dest].place} by ${photo.artist.split(" from ")[0]} (${photo.license})`;
    return { path: photoCardPath(DESTINATIONS[dest].photo), alt, width: 1200, height: 630, type: "image/jpeg" };
  }
  // Deal checks without a v2 card (v2 pages write their own og tags) use their evergreen deal card.
  const dealId = pagePath.match(/^deals\/([a-z0-9-]+)\.html$/)?.[1];
  const check = dealId && dealChecks().find((c) => c.id === dealId && c.og_card);
  if (check) {
    const t = dealCardText(check);
    return { path: dealCardPath(dealId, check), alt: `${t.kicker}: ${t.title}. Family Deal Check from Family Tripwise`, width: 1200, height: 630, type: "image/png" };
  }
  const card = cardFor(pagePath);
  return { path: card.path, alt: card.alt, width: 1200, height: 630, type: "image/png" };
}

const DEFAULT_SITE_DIR = fileURLToPath(new URL("../../site/", import.meta.url));

export function pagePathFromUrl(url) {
  const p = url.slice(ORIGIN.length);
  return p === "" ? "index.html" : p.endsWith("/") ? `${p}index.html` : p;
}

/** Adds the tags to one page's HTML. Generators call it on their final HTML; the path comes from the canonical URL. */
export function linkPreviewTags(html, pagePath, siteDir = DEFAULT_SITE_DIR) {
  const head = html.match(/<head\b[\s\S]*?<\/head>/i)?.[0];
  if (!head || /<meta\s+property="og:title"/i.test(head)) return html;
  const title = unescape(head.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? "").trim();
  const description = unescape(attr(head.match(/<meta\s+name="description"[^>]*>/i)?.[0] ?? "", "content") ?? "").trim();
  const canonicalTag = head.match(/<link\s+rel="canonical"[^>]*>/i)?.[0];
  const url = canonicalTag && attr(canonicalTag, "href");
  if (!title || !description || !url) throw new Error(`link preview: ${pagePath} needs <title>, meta description and canonical`);
  if (!url.startsWith(ORIGIN)) throw new Error(`link preview: ${pagePath} canonical is not on familytripwise.com (${url})`);
  pagePath = pagePath || pagePathFromUrl(url);
  const image = previewImage(html, pagePath);
  if (siteDir && !existsSync(join(siteDir, image.path))) throw new Error(`link preview: ${pagePath} needs ${image.path} (run node tools/page-og-images.mjs)`);
  const type = pagePath === "index.html" ? "website" : "article";
  const tags = [
    `<meta property="og:type" content="${type}">`,
    `<meta property="og:site_name" content="Family Tripwise">`,
    `<meta property="og:title" content="${e(title)}">`,
    `<meta property="og:description" content="${e(description)}">`,
    `<meta property="og:url" content="${e(url)}">`,
    `<meta property="og:image" content="${ORIGIN}${image.path}">`,
    `<meta property="og:image:type" content="${image.type}">`,
    `<meta property="og:image:width" content="${image.width}">`,
    `<meta property="og:image:height" content="${image.height}">`,
    `<meta property="og:image:alt" content="${e(image.alt)}">`,
    `<meta name="twitter:card" content="summary_large_image">`
  ];
  const indent = html.match(/\n([ \t]*)<link\s+rel="canonical"/i)?.[1];
  // Keep the page's own head style: one tag per line where the head has lines, inline where it is minified.
  return html.replace(canonicalTag, indent === undefined ? canonicalTag + tags.join("") : `${canonicalTag}\n${tags.map((t) => indent + t).join("\n")}`);
}

/** Same, but leaves pages without a canonical or marked noindex (redirect stubs) unchanged. */
export function withLinkPreview(html, pagePath, siteDir) {
  if (!/<link\s+rel="canonical"/i.test(html) || /<meta\s+name="robots"\s+content="[^"]*noindex/i.test(html)) return html;
  return linkPreviewTags(html, pagePath, siteDir);
}

function htmlFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? htmlFiles(full) : name.endsWith(".html") ? [full] : [];
  });
}

/** Final generation pass: adds link-preview tags to every indexable page in site/ that lacks them. */
export function addSiteLinkPreviews(siteDir) {
  let changed = 0;
  for (const file of htmlFiles(siteDir)) {
    const html = readFileSync(file, "utf8");
    const next = withLinkPreview(html, relative(siteDir, file).split(sep).join("/"), siteDir);
    if (next !== html) { writeFileSync(file, next); changed += 1; }
  }
  return changed;
}

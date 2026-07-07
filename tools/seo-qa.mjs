import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { basename, dirname, join, normalize, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = fileURLToPath(new URL("../", import.meta.url));
const siteDir = join(rootDir, "site");
const sitemapPath = join(siteDir, "sitemap.xml");
const productionFlag = process.argv.includes("--production");
const thresholdArg = process.argv.find((arg) => arg.startsWith("--min-words="));
const minWords = Number(thresholdArg?.split("=")[1] ?? process.env.MIN_WORDS ?? 900);
const siteOrigin = "https://familytripwise.com";

const errors = [];
const warnings = [];

function walkHtml(dir) {
  return readdirSync(dir)
    .flatMap((entry) => {
      const path = join(dir, entry);
      const stats = statSync(path);
      if (stats.isDirectory()) return walkHtml(path);
      return path.endsWith(".html") ? [path] : [];
    })
    .sort();
}

function toSitePath(filePath) {
  const rel = relative(siteDir, filePath).split(sep).join("/");
  return rel === "index.html" ? "/" : `/${rel}`;
}

function localFileForUrl(url) {
  const parsed = new URL(url);
  let pathname = decodeURIComponent(parsed.pathname);
  if (pathname.endsWith("/")) pathname = `${pathname}index.html`;
  return join(siteDir, pathname.replace(/^\//, ""));
}

function stripHtml(html) {
  return html
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z0-9#]+;/gi, " ");
}

function wordCount(html) {
  const text = stripHtml(html);
  return (text.match(/[A-Za-z0-9]+(?:[-'][A-Za-z0-9]+)?/g) ?? []).length;
}

function extractAttributes(html, attr) {
  const pattern = new RegExp(`\\b${attr}\\s*=\\s*["']([^"']+)["']`, "gi");
  return [...html.matchAll(pattern)].map((match) => match[1]);
}

function extractJsonLd(html) {
  const pattern = /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  return [...html.matchAll(pattern)].map((match) => match[1].trim());
}

function extractSitemapUrls() {
  const sitemap = readFileSync(sitemapPath, "utf8");
  return [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1].trim());
}

function isLocalRelativeLink(value) {
  if (
    !value ||
    value.startsWith("#") ||
    value.startsWith("mailto:") ||
    value.startsWith("tel:") ||
    value.startsWith("javascript:")
  ) {
    return false;
  }
  if (/^[a-z][a-z0-9+.-]*:/i.test(value)) return false;
  return true;
}

function resolveLocalLink(fromFile, href) {
  const withoutHash = href.split("#")[0].split("?")[0];
  if (!withoutHash) return null;
  const resolved = normalize(resolve(dirname(fromFile), withoutHash));
  if (!resolved.startsWith(siteDir)) {
    return { path: resolved, outsideSite: true };
  }
  const target = withoutHash.endsWith("/") ? join(resolved, "index.html") : resolved;
  return { path: target, outsideSite: false };
}

async function checkProduction(urls) {
  for (const url of urls) {
    try {
      const response = await fetch(url, { method: "HEAD", redirect: "manual" });
      if (response.status !== 200) {
        errors.push(`Production URL returned ${response.status}: ${url}`);
      }
    } catch (error) {
      errors.push(`Production URL check failed for ${url}: ${error.message}`);
    }
  }
}

const htmlFiles = walkHtml(siteDir);
const sitemapUrls = extractSitemapUrls();
const sitemapSitePaths = new Set(sitemapUrls.map((url) => new URL(url).pathname));
const sitemapFiles = new Set(sitemapUrls.map((url) => localFileForUrl(url)));

for (const url of sitemapUrls) {
  const parsed = new URL(url);
  if (parsed.origin !== siteOrigin) {
    errors.push(`Sitemap URL has unexpected origin: ${url}`);
  }
  const filePath = localFileForUrl(url);
  if (!existsSync(filePath)) {
    errors.push(`Sitemap URL does not map to a local HTML file: ${url} -> ${relative(rootDir, filePath)}`);
  }
}

for (const filePath of htmlFiles) {
  const html = readFileSync(filePath, "utf8");
  const rel = relative(rootDir, filePath);

  for (const href of extractAttributes(html, "href")) {
    if (!isLocalRelativeLink(href)) continue;
    const target = resolveLocalLink(filePath, href);
    if (!target) continue;
    if (target.outsideSite) {
      errors.push(`${rel} links outside site with a relative href: ${href}`);
      continue;
    }
    if (!existsSync(target.path)) {
      errors.push(`${rel} has unresolved internal link: ${href}`);
    }
  }

  extractJsonLd(html).forEach((json, index) => {
    try {
      JSON.parse(json);
    } catch (error) {
      errors.push(`${rel} has invalid JSON-LD block ${index + 1}: ${error.message}`);
    }
  });

  if (sitemapFiles.has(filePath)) {
    const count = wordCount(html);
    if (count < minWords) {
      warnings.push(`${rel} is in sitemap with ${count} words below min ${minWords}; review for thin-page risk.`);
    }
  } else if (basename(filePath).startsWith("san-diego")) {
    const hasNoindex = /<meta\s+name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html);
    warnings.push(
      `${rel} is outside the sitemap and looks like a legacy San Diego shim; ${hasNoindex ? "noindex present" : "review redirect or noindex, follow."}`
    );
  }
}

if (productionFlag) {
  await checkProduction(sitemapUrls);
}

console.log("Family Tripwise static SEO QA");
console.log(`- Sitemap URLs checked locally: ${sitemapUrls.length}`);
console.log(`- HTML files checked: ${htmlFiles.length}`);
console.log(`- Word-count warning threshold: ${minWords}`);
console.log(`- Production checks: ${productionFlag ? "enabled" : "skipped (use --production)"}`);
console.log("");
console.log(`Errors: ${errors.length}`);
errors.forEach((error) => console.log(`  ERROR ${error}`));
console.log(`Warnings: ${warnings.length}`);
warnings.forEach((warning) => console.log(`  WARN ${warning}`));

if (errors.length > 0) {
  process.exitCode = 1;
}

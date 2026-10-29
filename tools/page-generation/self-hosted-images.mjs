// Q11: pages never hotlink Wikimedia Commons (it answers visitors with HTTP 429). Every Commons
// photo a generator emits is rewritten to its self-hosted WebP in site/images/ (listed in
// tools/images/commons-images.json, downloaded once by .github/workflows/self-host-images.yml,
// sizes and licences in commons-images.lock.json). Credits and "License and source" links to the
// Commons file pages stay as written. An unknown Commons image fails generation.
import { readFileSync, readdirSync, writeFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const manifest = JSON.parse(readFileSync(new URL("../images/commons-images.json", import.meta.url), "utf8"));
const lock = JSON.parse(readFileSync(new URL("../images/commons-images.lock.json", import.meta.url), "utf8"));

const key = (name) => decodeURIComponent(name).replaceAll(" ", "_").normalize("NFC").toLowerCase();
const bySlugFile = new Map(manifest.images.map((image) => [key(image.file), image.slug]));

const commonsSrc = /^https?:\/\/(?:commons|upload|thumb)\.wikimedia\.org\//i;

export function commonsFileName(url) {
  const u = new URL(url.replaceAll("&amp;", "&"));
  const redirect = u.pathname.match(/\/wiki\/Special:Redirect\/file\/(.+)$/);
  if (redirect) return redirect[1];
  const thumb = u.pathname.match(/\/wikipedia\/commons\/thumb\/[0-9a-f]\/[0-9a-f]{2}\/([^/]+)\//);
  if (thumb) return thumb[1];
  const original = u.pathname.match(/\/wikipedia\/commons\/[0-9a-f]\/[0-9a-f]{2}\/([^/]+)$/);
  if (original) return original[1];
  throw new Error(`Unrecognised Commons image URL: ${url}`);
}

export function selfHostedImage(url) {
  const name = commonsFileName(url);
  const slug = bySlugFile.get(key(name));
  const entry = slug && lock[slug];
  if (!entry) throw new Error(`Commons image not self-hosted yet (add it to tools/images/commons-images.json): ${decodeURIComponent(name)}`);
  return entry;
}

function setAttr(tag, name, value) {
  const re = new RegExp(`\\s${name}="[^"]*"`);
  return re.test(tag) ? tag.replace(re, ` ${name}="${value}"`) : tag.replace(/\s*\/?>$/, ` ${name}="${value}">`);
}

export function selfHostImages(html, pagePath) {
  const depth = pagePath.split("/").length - 1;
  const prefix = depth ? "../".repeat(depth) : "./";
  let out = html.replace(/<img\b[^>]*>/g, (tag) => {
    const src = tag.match(/\ssrc="([^"]*)"/)?.[1];
    if (!src || !commonsSrc.test(src)) return tag;
    const entry = selfHostedImage(src);
    let next = tag.replace(/\s(?:srcset|sizes)="[^"]*"/g, "");
    next = next.replace(/\ssrc="[^"]*"/, ` src="${prefix}${entry.path}"`);
    next = setAttr(next, "width", entry.width);
    next = setAttr(next, "height", entry.height);
    if (/\sloading="eager"/.test(next) && !/\sfetchpriority=/.test(next)) next = next.replace(/\sloading="eager"/, ' loading="eager" fetchpriority="high"');
    return next;
  });
  out = out.replace(/(<meta\s+(?:property|name)="(?:og:image|twitter:image)"\s+content=")([^"]*)"/g, (whole, head, url) =>
    commonsSrc.test(url) ? `${head}https://familytripwise.com/${selfHostedImage(url).path}"` : whole);
  return out;
}

function htmlFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? htmlFiles(full) : name.endsWith(".html") ? [full] : [];
  });
}

// Final generation pass over every page in site/.
export function selfHostSiteImages(siteDir) {
  let changed = 0;
  for (const file of htmlFiles(siteDir)) {
    const html = readFileSync(file, "utf8");
    const next = selfHostImages(html, relative(siteDir, file).split(sep).join("/"));
    if (next !== html) { writeFileSync(file, next); changed += 1; }
  }
  return changed;
}

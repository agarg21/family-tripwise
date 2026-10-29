// Link-preview tags on every sitemap page (owner D18, QUEUE G13; tools/page-generation/link-previews.mjs).
import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { linkPreviewTags, previewImage } from "./page-generation/link-previews.mjs";

const site = fileURLToPath(new URL("../site/", import.meta.url));
const ORIGIN = "https://familytripwise.com/";
const urls = [...readFileSync(join(site, "sitemap.xml"), "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const pathOf = (url) => { const p = url.slice(ORIGIN.length); return p === "" ? "index.html" : p.endsWith("/") ? `${p}index.html` : p; };
const unesc = (v) => v.replaceAll("&quot;", '"').replaceAll("&#39;", "'").replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("&amp;", "&");
const meta = (head, key) => {
  const tag = head.match(new RegExp(`<meta\\s+(?:property|name)="${key.replace(":", "\\:")}"\\s+content="([^"]*)"`, "i"));
  return tag ? unesc(tag[1]) : null;
};

function imageSize(file) {
  const b = readFileSync(file);
  if (b.readUInt32BE(0) === 0x89504e47) return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
  for (let i = 2; i < b.length;) {
    const marker = b[i + 1];
    if (marker >= 0xc0 && marker <= 0xc3) return { w: b.readUInt16BE(i + 7), h: b.readUInt16BE(i + 5) };
    i += 2 + b.readUInt16BE(i + 2);
  }
  return null;
}

test("every sitemap page carries one complete set of link-preview tags matching its own head", () => {
  assert.ok(urls.length >= 50);
  for (const url of urls) {
    const page = pathOf(url);
    const head = readFileSync(join(site, page), "utf8").match(/<head\b[\s\S]*?<\/head>/i)[0];
    for (const key of ["og:title", "og:description", "og:url", "og:image", "og:image:alt", "og:type", "twitter:card"]) {
      assert.ok(meta(head, key), `${page}: missing ${key}`);
      assert.equal((head.match(new RegExp(`(?:property|name)="${key}"`, "g")) || []).length, 1, `${page}: ${key} repeated`);
    }
    assert.equal(meta(head, "og:url"), head.match(/<link\s+rel="canonical"\s+href="([^"]*)"/)[1], `${page}: og:url is not the canonical`);
    assert.equal(meta(head, "og:url"), url, `${page}: og:url is not the sitemap URL`);
    const image = meta(head, "og:image");
    assert.ok(image.startsWith(`${ORIGIN}images/og/`), `${page}: og:image ${image} is not a self-hosted card`);
    const file = join(site, image.slice(ORIGIN.length));
    assert.ok(existsSync(file), `${page}: ${image} missing`);
    assert.deepEqual(imageSize(file), { w: 1200, h: 630 }, `${page}: ${image} is not 1200x630`);
    assert.ok(readFileSync(file).length <= 600_000, `${page}: ${image} over 600 KB`);
  }
});

test("generated pages copy title and description exactly; v2 deal pages keep their own card", () => {
  for (const url of urls) {
    const page = pathOf(url);
    const head = readFileSync(join(site, page), "utf8").match(/<head\b[\s\S]*?<\/head>/i)[0];
    if (/images\/og\/deals\/[a-z0-9-]+\.png/.test(meta(head, "og:image"))) continue;
    assert.equal(meta(head, "og:title"), unesc(head.match(/<title>([\s\S]*?)<\/title>/)[1]).trim(), page);
    assert.equal(meta(head, "og:description"), unesc(head.match(/<meta\s+name="description"\s+content="([^"]*)"/)[1]).trim(), page);
  }
  const beaches = readFileSync(join(site, "deals/beaches-first-passport-credit.html"), "utf8");
  assert.match(beaches, /og:image" content="https:\/\/familytripwise\.com\/images\/og\/deals\/beaches-first-passport-credit\.png"/);
});

test("photo pages use their own first photo; pages without one use the section card", () => {
  const photoPage = '<main><figure><img src="../images/san-diego-zoo.webp" alt="Zoo &amp; park"></figure></main>';
  assert.deepEqual(previewImage(photoPage, "things-to-do/x.html").path, "images/og/photos/san-diego-zoo.jpg");
  assert.equal(previewImage(photoPage, "things-to-do/x.html").alt, "Zoo & park");
  assert.equal(previewImage("<main><p>No photo</p></main>", "deals/x.html").path, "images/og/deals.png");
  assert.equal(previewImage("<main></main>", "this-week/index.html").path, "images/og/this-week.png");
  assert.equal(previewImage("<main></main>", "about.html").path, "images/og/site.png");
  const html = '<html><head><title>A &amp; B</title><meta name="description" content="Say &quot;hi&quot;"><link rel="canonical" href="https://familytripwise.com/about.html"></head><body><main></main></body></html>';
  const out = linkPreviewTags(html, "about.html", site);
  assert.match(out, /og:title" content="A &amp; B"/);
  assert.match(out, /og:description" content="Say &quot;hi&quot;"/);
  assert.equal(linkPreviewTags(out, "about.html", site), out, "second pass changes nothing");
  assert.throws(() => linkPreviewTags(html.replace(/<link[^>]*>/, ""), "about.html", site), /canonical/);
  assert.throws(() => linkPreviewTags(html.replace("familytripwise.com/about", "example.com/about"), "about.html", site), /not on familytripwise/);
});

test("destination pages without their own photo use that destination's photo; deal checks use their own card", () => {
  const img = (page) => readFileSync(join(site, page), "utf8").match(/og:image" content="([^"]*)"/)[1];
  assert.equal(img("family-itinerary/washington-dc-with-kids.html"), `${ORIGIN}images/og/photos/washington-dc-national-mall.jpg`);
  assert.equal(img("family-itinerary/boston-with-kids.html"), `${ORIGIN}images/og/photos/boston-skyline.jpg`);
  assert.equal(img("deals/royal-caribbean-kids-sail-free.html"), `${ORIGIN}images/og/deals/v1/royal-caribbean-kids-sail-free.png`);
  assert.equal(img("deals/index.html"), `${ORIGIN}images/og/deals.png`);
  for (const url of urls) {
    const page = pathOf(url);
    if (/^(deals|this-week)\//.test(page) || ["index.html", "about.html", "privacy.html", "terms.html"].includes(page) || page.startsWith("contributors/")) continue;
    assert.match(img(page), /images\/og\/photos\//, `${page}: a destination page fell back to a generic card`);
  }
});

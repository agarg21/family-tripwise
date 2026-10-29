// Q11: no page hotlinks an image; every photo is a self-hosted WebP <= 200 KB with matching
// width/height, alt text and a credit; the hero photo loads eagerly with fetchpriority="high".
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative, sep, dirname, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { selfHostImages } from "./page-generation/self-hosted-images.mjs";

const site = fileURLToPath(new URL("../site/", import.meta.url));
const lock = JSON.parse(readFileSync(new URL("./images/commons-images.lock.json", import.meta.url), "utf8"));
const manifest = JSON.parse(readFileSync(new URL("./images/commons-images.json", import.meta.url), "utf8"));
const files = (dir) => readdirSync(dir).flatMap((n) => { const f = join(dir, n); return statSync(f).isDirectory() ? files(f) : [f]; });
const pages = files(site).filter((f) => f.endsWith(".html")).map((f) => [relative(site, f).split(sep).join("/"), readFileSync(f, "utf8")]);

test("no page hotlinks an image or social preview image", () => {
  for (const [path, html] of pages) {
    for (const tag of html.match(/<(?:img|source)\b[^>]*>/g) || []) {
      for (const attr of tag.matchAll(/\s(src|srcset)="([^"]*)"/g)) {
        assert.doesNotMatch(attr[2], /^(?:https?:)?\/\//, `${path} hotlinks ${attr[2]}`);
      }
    }
    for (const m of html.matchAll(/<meta\s+(?:property|name)="(?:og:image|twitter:image)"\s+content="([^"]*)"/g)) {
      assert.match(m[1], /^https:\/\/familytripwise\.com\//, `${path} social image ${m[1]}`);
    }
  }
});

test("every self-hosted photo exists, fits the size budget and carries its lock dimensions, alt and credit", () => {
  assert.equal(Object.keys(lock).length, manifest.images.length);
  const byPath = new Map(Object.values(lock).map((e) => [e.path, e]));
  for (const entry of byPath.values()) {
    const file = join(site, entry.path);
    assert.ok(existsSync(file), entry.path);
    assert.equal(statSync(file).size, entry.bytes, entry.path);
    assert.ok(entry.bytes <= manifest.max_bytes, entry.path);
    assert.ok(entry.license && entry.artist && entry.source_page, `${entry.path} needs licence, author and source`);
  }
  let used = 0;
  for (const [path, html] of pages) {
    for (const tag of html.match(/<img\b[^>]*>/g) || []) {
      const src = tag.match(/\ssrc="([^"]*)"/)[1];
      const resolved = normalize(join(dirname(path), src)).split(sep).join("/");
      const entry = byPath.get(resolved);
      if (!entry) continue;
      used += 1;
      assert.match(tag, new RegExp(`\\swidth="${entry.width}"\\s[^>]*height="${entry.height}"|\\sheight="${entry.height}"[^>]*\\swidth="${entry.width}"`), `${path} ${src} dimensions`);
      assert.match(tag, /\salt="[^"]{8,}"/, `${path} ${src} alt`);
      if (/\sloading="eager"/.test(tag)) assert.match(tag, /\sfetchpriority="high"/, `${path} hero priority`);
      const after = html.slice(html.indexOf(tag), html.indexOf(tag) + 2500);
      assert.match(after, /<figcaption|commons\.wikimedia\.org\/wiki\/File:|creativecommons\.org/, `${path} ${src} credit`);
    }
  }
  assert.ok(used >= 33, `expected the 33 photo uses, saw ${used}`);
});

test("the rewrite maps every Commons URL form to the local file and refuses unknown files", () => {
  const html = '<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Millennium_park%2Cchicago.JPG/1280px-Millennium_park%2Cchicago.JPG" srcset="x 1x" alt="a" loading="eager">';
  assert.equal(selfHostImages(html, "where-to-stay/a.html"), '<img src="../images/chicago-millennium-park.webp" alt="a" loading="eager" fetchpriority="high" width="1600" height="1200">');
  assert.match(selfHostImages('<img src="https://commons.wikimedia.org/wiki/Special:Redirect/file/The%20San%20Antonio%20River%20Walk.jpg?width=640">', "privacy.html"), /src="\.\/images\/san-antonio-river-walk\.webp"/);
  assert.throws(() => selfHostImages('<img src="https://commons.wikimedia.org/wiki/Special:Redirect/file/Unknown.jpg">', "a.html"), /not self-hosted/);
});

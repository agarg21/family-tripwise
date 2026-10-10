import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";

const read = path => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const client = read("site/washington-dc-comparison.js");
const pages = [
  ["Washington DC", "washington-dc-family-hotels", 3],
  ["Boston", "boston-family-hotels", 4],
  ["Puerto Vallarta", "puerto-vallarta-family-resorts", 3]
];
function fixture(slug, checked = false, hash = "") {
  const html = read("site/where-to-stay/" + slug + ".html");
  const rows = [...html.matchAll(/<tr data-room="([^"]+)" data-kitchen="([^"]+)"/g)]
    .map(([, room, kitchen]) => ({ dataset: { room, kitchen }, hidden: false }));
  const details = [...html.matchAll(/<(?:article|div) id="([^"]+)"[^>]*data-room="([^"]+)" data-kitchen="([^"]+)"/g)]
    .map(([, id, room, kitchen]) => ({ id, dataset: { room, kitchen }, hidden: false,
      scrolls: 0, scrollIntoView(options) { assert.equal(options.block, "start"); this.scrolls++; } }));
  const checkbox = { checked, addEventListener(name, fn) { assert.equal(name, "change"); this.change = fn; } };
  const status = { textContent: "" }, toolbar = { hidden: true };
  const document = {
    querySelector(selector) { return { ".dc-toolbar": toolbar, "#kitchen-only": checkbox, "#comparison-status": status }[selector]; },
    querySelectorAll(selector) { return selector.startsWith("#comparison") ? rows : details; }
  };
  const window = { location: { hash }, addEventListener(name, fn) { assert.equal(name, "hashchange"); this.hashchange = fn; } };
  runInNewContext(client, { document, window });
  return { rows, details, checkbox, status, toolbar, window, html };
}
for (const [city, slug, count] of pages) {
  test(city + ": Back/Forward to a filtered detail restores the full maintained comparison", () => {
    const f = fixture(slug);
    assert.equal(f.rows.length, count);
    assert.ok(f.details.length >= count);
    assert.equal(f.toolbar.hidden, false);
    const target = f.details.find(detail => detail.dataset.kitchen !== "published-kitchen");
    assert.ok(target);
    f.checkbox.checked = true; f.checkbox.change();
    assert.equal(target.hidden, true);
    f.window.location.hash = "#" + target.id; f.window.hashchange();
    assert.equal(f.checkbox.checked, false);
    assert.ok([...f.rows, ...f.details].every(element => !element.hidden));
    assert.equal(f.status.textContent, count + " room categories");
    assert.equal(target.scrolls, 1);
    f.window.hashchange(); assert.equal(target.scrolls, 1);
    f.checkbox.checked = true; f.checkbox.change();
    assert.equal(target.hidden, true);
    f.window.location.hash = "#comparison"; f.window.hashchange();
    assert.equal(f.checkbox.checked, true);
    f.window.location.hash = "#" + target.id; f.window.hashchange();
    assert.equal(target.scrolls, 2);
    assert.match(f.html, /washington-dc-comparison\.js\?v=ft-imp090/);
  });
  test(city + ": visible, unrelated and malformed fragments preserve kitchen filtering", () => {
    const f = fixture(slug);
    f.checkbox.checked = true; f.checkbox.change();
    const visible = f.details.find(detail => detail.dataset.kitchen === "published-kitchen");
    for (const hash of ["", "#comparison", "#prices", "#missing", "#%E0%A4%A", "#" + visible.id]) {
      f.window.location.hash = hash; assert.doesNotThrow(() => f.window.hashchange());
      assert.equal(f.checkbox.checked, true);
      assert.equal(visible.scrolls, 0);
    }
    f.checkbox.checked = false; f.checkbox.change();
    assert.ok(f.rows.every(row => !row.hidden));
  });
  test(city + ": an initially restored filter cannot hide the current detail fragment", () => {
    const initial = fixture(slug);
    const target = initial.details.find(detail => detail.dataset.kitchen !== "published-kitchen");
    const f = fixture(slug, true, "#" + target.id.replaceAll("-", "%2D"));
    assert.equal(f.checkbox.checked, false);
    assert.equal(f.details.find(detail => detail.id === target.id).scrolls, 1);
    const keep = fixture(slug, true, "#comparison");
    assert.equal(keep.checkbox.checked, true);
  });
}
test("shared navigation neither rewrites history nor stores or transmits family inputs", () => {
  assert.doesNotMatch(client, /fetch\(|XMLHttpRequest|sendBeacon|localStorage|sessionStorage|document.cookie|pushState|replaceState|location\.hash\s*=/);
  assert.match(client, /addEventListener\("hashchange", revealHashTarget\)/);
});

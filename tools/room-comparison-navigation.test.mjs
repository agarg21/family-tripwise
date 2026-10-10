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
      children: [], contains(element) { return this.children.includes(element); },
      scrolls: 0, scrollIntoView(options) { assert.equal(options.block, "start"); this.scrolls++; } }));
  const nodes = new Map(details.map(detail => [detail.id, detail]));
  for (const detail of details) {
    const child = { id: detail.id + "-synthetic-policy", scrolls: 0,
      scrollIntoView(options) { assert.equal(options.block, "start"); this.scrolls++; } };
    detail.children.push(child); nodes.set(child.id, child);
  }
  if (slug === "boston-family-hotels") {
    assert.match(html, /<p id="park-plaza-gym-policy"/);
    const owner = details.find(detail => detail.id === "boston-park-plaza-deluxe-double");
    const child = { id: "park-plaza-gym-policy", scrolls: 0,
      scrollIntoView(options) { assert.equal(options.block, "start"); this.scrolls++; } };
    owner.children.push(child); nodes.set(child.id, child);
  }
  nodes.set("prices", { id: "prices" });
  const checkbox = { checked, addEventListener(name, fn) { assert.equal(name, "change"); this.change = fn; } };
  const status = { textContent: "" }, toolbar = { hidden: true };
  const document = {
    getElementById(id) { return nodes.get(id) ?? null; },
    querySelector(selector) { return { ".dc-toolbar": toolbar, "#kitchen-only": checkbox, "#comparison-status": status }[selector]; },
    querySelectorAll(selector) { return selector.startsWith("#comparison") ? rows : details; }
  };
  const window = { location: { hash }, addEventListener(name, fn) { assert.equal(name, "hashchange"); this.hashchange = fn; } };
  runInNewContext(client, { document, window });
  return { rows, details, nodes, checkbox, status, toolbar, window, html };
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
    assert.match(f.html, /washington-dc-comparison\.js\?v=ft-imp093/);
  });
  test(city + ": visible, unrelated and malformed fragments preserve kitchen filtering", () => {
    const f = fixture(slug);
    f.checkbox.checked = true; f.checkbox.change();
    const visible = f.details.find(detail => detail.dataset.kitchen === "published-kitchen");
    for (const hash of ["", "#comparison", "#prices", "#missing", "#%E0%A4%A", "#" + visible.id, "#" + visible.children[0].id]) {
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
  test(city + ": nested descendants reveal their hidden owner and scroll the descendant, not the owner", () => {
    const f = fixture(slug);
    const owner = f.details.find(detail => detail.dataset.kitchen !== "published-kitchen");
    const target = owner.children[0];
    f.checkbox.checked = true; f.checkbox.change();
    assert.equal(owner.hidden, true);
    f.window.location.hash = "#" + target.id.replaceAll("-", "%2D"); f.window.hashchange();
    assert.equal(f.checkbox.checked, false);
    assert.ok([...f.rows, ...f.details].every(element => !element.hidden));
    assert.equal(f.status.textContent, count + " room categories");
    assert.equal(target.scrolls, 1); assert.equal(owner.scrolls, 0);
    f.window.hashchange(); assert.equal(target.scrolls, 1);
    const initial = fixture(slug, true, "#" + target.id);
    assert.equal(initial.checkbox.checked, false);
    assert.equal(initial.nodes.get(target.id).scrolls, 1);
  });
}
test("Boston: actual nested gym policy restores room context through Back/Forward", () => {
  const f = fixture("boston-family-hotels");
  const owner = f.details.find(detail => detail.id === "boston-park-plaza-deluxe-double");
  const target = f.nodes.get("park-plaza-gym-policy");
  for (let repeat = 0; repeat < 2; repeat++) {
    f.window.location.hash = "#comparison";
    f.checkbox.checked = true; f.checkbox.change();
    assert.equal(owner.hidden, true);
    f.window.location.hash = "#park-plaza-gym-policy"; f.window.hashchange();
    assert.equal(f.checkbox.checked, false); assert.equal(owner.hidden, false);
    assert.equal(target.scrolls, repeat + 1); assert.equal(owner.scrolls, 0);
  }
});
test("shared navigation neither rewrites history nor stores or transmits family inputs", () => {
  assert.doesNotMatch(client, /fetch\(|XMLHttpRequest|sendBeacon|localStorage|sessionStorage|document.cookie|pushState|replaceState|location\.hash\s*=/);
  assert.match(client, /addEventListener\("hashchange", revealHashTarget\)/);
});

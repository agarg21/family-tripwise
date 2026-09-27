import assert from "node:assert/strict";
import test from "node:test";
import { setupSharing, comparisonUrl } from "../src/prototypes/cancun-resort-comparison/share.mjs";
import { cancunResortPage } from "./page-generation/cancun-resort-page.mjs";

function harness(clipboard) {
  const nodes = new Map();
  const root = { querySelector(id) {
    if (!nodes.has(id)) nodes.set(id, {
      hidden: true, disabled: false, textContent: "", value: "",
      addEventListener(type, callback) { this[type] = callback; },
      focus() { this.focused = true; }, select() { this.selected = true; }
    });
    return nodes.get(id);
  } };
  setupSharing({ root, clipboard });
  return id => root.querySelector(`#${id}`);
}

test("copy uses the maintained public anchor, never personalized URL state", async () => {
  let copied;
  const get = harness({ async writeText(value) { copied = value; } });
  assert.equal(get("comparison-actions").hidden, false);
  await get("copy-comparison").click();
  assert.equal(copied, comparisonUrl);
  assert.equal(new URL(copied).search, "");
  assert.equal(new URL(copied).hash, "#quick-comparison");
  assert.equal(get("share-status").textContent, "Comparison link copied.");
  assert.equal(get("comparison-link-fallback").hidden, true);
  assert.equal(get("copy-comparison").disabled, false);
});

for (const [name, clipboard] of [["missing", undefined], ["denied", { writeText: async () => { throw new Error("Denied"); } }]]) {
  test(`${name} clipboard reveals and selects a readonly-copy fallback`, async () => {
    const get = harness(clipboard);
    await get("copy-comparison").click();
    assert.equal(get("comparison-link-fallback").hidden, false);
    assert.equal(get("comparison-link").value, comparisonUrl);
    assert.equal(get("comparison-link").focused, true);
    assert.equal(get("comparison-link").selected, true);
    assert.match(get("share-status").textContent, /unavailable/);
    assert.equal(get("copy-comparison").disabled, false);
  });
}

test("share surface has static link, hidden enhancement and readonly fallback", () => {
  const html = cancunResortPage();
  assert.ok(html.includes(`href="${comparisonUrl}">Direct link`));
  assert.match(html, /id="comparison-actions" class="actions" hidden/);
  assert.match(html, /id="comparison-link" type="text" readonly/);
  assert.match(html, /id="share-status" role="status" aria-live="polite"/);
  assert.doesNotMatch(html, /id="print-comparison"/);
});

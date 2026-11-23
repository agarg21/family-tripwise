import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

// No JSON-LD description on any page ends a sentence with a double period
// (SD things-to-do ItemList "a.m..", P3 2026-11-22). Ellipses "..." are allowed.
function htmlFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? htmlFiles(p) : p.endsWith(".html") ? [p] : [];
  });
}

function descriptions(node, out = []) {
  if (Array.isArray(node)) node.forEach((n) => descriptions(n, out));
  else if (node && typeof node === "object") {
    for (const [k, v] of Object.entries(node)) {
      if (k === "description" && typeof v === "string") out.push(v);
      else descriptions(v, out);
    }
  }
  return out;
}

test("JSON-LD descriptions never contain a double period", () => {
  const bad = [];
  for (const file of htmlFiles("site")) {
    const html = readFileSync(file, "utf8");
    for (const m of html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
      let data;
      try { data = JSON.parse(m[1]); } catch { bad.push(`${file}: JSON-LD does not parse`); continue; }
      for (const d of descriptions(data)) if (/(^|[^.])\.\.(?!\.)/.test(d)) bad.push(`${file}: …${d.slice(Math.max(0, d.search(/[^.]\.\.(?!\.)/) - 40), d.search(/[^.]\.\.(?!\.)/) + 4)}`);
    }
  }
  assert.deepEqual(bad, []);
});

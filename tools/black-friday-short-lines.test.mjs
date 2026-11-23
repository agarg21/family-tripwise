import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const season = JSON.parse(readFileSync(new URL("./page-generation/black-friday.json", import.meta.url), "utf8"));
const listed = season.unconfirmed.filter((u) => u.list_until >= "2026-11-20");
const nums = (s) => (s.match(/\$?\d[\d,]*(?:\.\d+)?%?\+?/g) ?? []).map((n) => n.replace(/,$/, ""));

// Content Standard: no paragraph over about 30 words. "Can't price yet" cards render `lines`, one short <p> each
// (Carnival card P3, Nov 20: 55-84-word walls). `text` stays the full record; the lines must keep every figure in it.
test("every listed Black Friday 'can't price yet' card is short lines that keep every figure of its record", () => {
  for (const u of listed) {
    assert.ok(Array.isArray(u.lines) && u.lines.length, `${u.operator}: add lines`);
    for (const line of u.lines) assert.ok(line.split(/\s+/).length <= 30, `${u.operator}: ${line}`);
    const joined = [...u.lines, u.deadline ?? ""].join(" ");
    for (const n of nums(u.text)) assert.ok(joined.includes(n), `${u.operator}: lines drop ${n}`);
  }
  const html = readFileSync(new URL("../site/deals/black-friday-family-travel-deals.html", import.meta.url), "utf8");
  assert.match(html, /<p>3rd and 4th guests in your cabin pay \$0 cruise fare on select cruises\.<\/p>\s*<p>Eligible sailings[^<]*<\/p>[\s\S]*?<p class="deal-deadline"><strong>Deadline:<\/strong> book Nov 17 to 26<\/p>/);
  // Persona P2 (Nov 20): every dated sale shows the same bold Deadline row as the priced cards above it.
  for (const u of listed.filter((x) => !/^Walt Disney/.test(x.operator))) assert.ok(u.deadline, `${u.operator}: add deadline`);
});

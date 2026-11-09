import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { cancunChildOffer, cancunChildOfferBookBy, cancunChildOfferSection, cancunResortPage, writeCancunResortPage } from "./page-generation/cancun-resort-page.mjs";
import { cancunEvidence } from "../src/prototypes/cancun-resort-comparison/data.mjs";
import { PASSED_AS_OF } from "../src/prototypes/cancun-resort-comparison/render.mjs";

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("dated first-party record is kept; after its October 31 book-by date the page says the offer ended", () => {
  const offer = cancunChildOffer, section = cancunChildOfferSection();
  assert.equal(offer.action_id, "FT-IMP-096"); assert.equal(offer.checked_on, "2026-10-11");
  assert.equal(offer.source_url, "https://www.moonpalacecancun.com/offers/kids-teens-free");
  assert.match(offer.rows[0].published, /^Book by October 31, 2026;/); assert.equal(cancunChildOfferBookBy, "2026-10-31");
  assert.ok(PASSED_AS_OF > cancunChildOfferBookBy);
  assert.match(section, /offer ended/); assert.match(section, /book by October 31, 2026\. That date has passed/);
  assert.ok(section.includes(`href="${offer.source_url}"`));
  // No eligibility table, past Grand stay, RETURN5 example, savings or "stay free" promise once the offer has ended.
  assert.doesNotMatch(section, /scope="row"|October 18-23|RETURN5|USD \d|\$\d|best value|guaranteed|confirmed booking|<h2[^>]*>Kids stay free/);
  assert.equal(cancunEvidence.checkedOn, "2026-09-23");
});

test("additive section is accessible without JavaScript and remains outside factual schema", () => {
  const section = cancunChildOfferSection(), html = cancunResortPage();
  assert.equal(html.split(section).length, 2); assert.equal(read("site/where-to-stay/cancun-family-resorts.html"), html);
  assert.match(section, /aria-labelledby="child-offer-title"/); assert.match(section, /scroll-margin-top:128px/);
  assert.match(section, /href="#grand-family-suite"/);
  const schema = JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/)[1]);
  assert.equal(schema.dateModified, cancunEvidence.lastUpdatedOn); assert.doesNotMatch(JSON.stringify(schema), /Offer|2026-10-11/);
  assert.equal((read("site/sitemap.xml").match(/<loc>/g) ?? []).length, 74);
});

test("scoped writer preserves all comparison modules and existing downloads", () => {
  const output = new Map(); writeCancunResortPage((path, bytes) => output.set(path, bytes));
  assert.equal(output.size, 9);
  for (const [path, bytes] of output) assert.equal(read(`site/${path}`), bytes, path);
});

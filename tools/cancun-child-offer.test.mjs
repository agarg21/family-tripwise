import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { cancunChildOffer, cancunChildOfferSection, cancunResortPage, writeCancunResortPage } from "./page-generation/cancun-resort-page.mjs";
import { cancunEvidence } from "../src/prototypes/cancun-resort-comparison/data.mjs";

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("one dated first-party record supplies child offer scope, dates and conditions", () => {
  const offer = cancunChildOffer, section = cancunChildOfferSection();
  assert.equal(offer.action_id, "FT-IMP-096"); assert.equal(offer.checked_on, "2026-10-11"); assert.equal(offer.recheck_on, "2026-10-18");
  assert.equal(offer.source_url, "https://www.moonpalacecancun.com/offers/kids-teens-free");
  assert.equal(offer.rows.length, 4); assert.equal((section.match(/scope="row"/g) ?? []).length, 4);
  for (const row of offer.rows) for (const value of Object.values(row)) assert.ok(section.includes(value.replaceAll("&", "&amp;")), value);
  for (const pattern of [/October 31, 2026/, /December 20/, /December 21/, /January 2027 is outside/, /turning 18 during/, /paying adult/, /Age proof/, /Single parents/, /November 21-27/, /three nights/, /Christmas.*does not extend/, /occupancy still applies/, /Presidential Suites/, /Travel-agent, tour-operator/, /cancellation\/rebooking/]) assert.match(section, pattern);
});

test("eligibility is not a renewed RETURN5 price, comparable savings or acceptance", () => {
  const section = cancunChildOfferSection();
  assert.match(section, /October 18-23 clears.*gates only/);
  assert.match(section, /September 27 Grand RETURN5.*not a verified quote/);
  assert.match(section, /No savings established/);
  assert.match(section, /same party, dates, category, channel, inclusions, refund terms and mandatory fees/);
  assert.match(section, /Other room and price source dates are unchanged/);
  assert.doesNotMatch(section, /USD \d|best value|guaranteed|confirmed booking/);
  assert.equal(cancunEvidence.checkedOn, "2026-09-23");
  assert.equal(cancunEvidence.priceRecheckOn, "2026-10-11");
  assert.equal(cancunEvidence.records.find(r => r.id === "grand-family-suite").price.observedOn, "2026-10-11");
});

test("additive section is accessible without JavaScript and remains outside factual schema", () => {
  const section = cancunChildOfferSection(), html = cancunResortPage();
  assert.equal(html.split(section).length, 2); assert.equal(read("site/where-to-stay/cancun-family-resorts.html"), html);
  assert.match(section, /aria-labelledby="child-offer-title"/); assert.match(section, /scroll-margin-top:128px/);
  assert.match(section, /tabindex="0" role="region" aria-label="Child-offer eligibility conditions"/);
  assert.match(section, /href="#grand-family-suite"/);
  const schema = JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/)[1]);
  assert.equal(schema.dateModified, cancunEvidence.lastUpdatedOn); assert.doesNotMatch(JSON.stringify(schema), /Offer|2026-10-11/);
  assert.equal((read("site/sitemap.xml").match(/<loc>/g) ?? []).length, 48);
});

test("scoped writer preserves all comparison modules and existing downloads", () => {
  const output = new Map(); writeCancunResortPage((path, bytes) => output.set(path, bytes));
  assert.equal(output.size, 9);
  for (const [path, bytes] of output) assert.equal(read(`site/${path}`), bytes, path);
});

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { cancunEvidence } from "../src/prototypes/cancun-resort-comparison/data.mjs";
import { PASSED_AS_OF, shownPrice, withdrawnPrice } from "../src/prototypes/cancun-resort-comparison/render.mjs";
import { cancunListings, cancunPriceAnswer, cancunPriceCards, cancunResortPage } from "./page-generation/cancun-resort-page.mjs";
import { easternDate } from "./page-generation/sitemap.mjs";

// D23 Cancun slice (2026-11-01): a top price card from the dated family samples still ahead of their stays.
const read = path => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const today = process.env.FT_BUILD_DATE || easternDate();

test("no shown Cancun price sample has reached its stay start (move PASSED_AS_OF and regenerate)", () => {
  for (const r of cancunEvidence.records.filter(r => shownPrice(r)?.stayStart)) {
    assert.ok(r.price.stayStart > today, `${r.id} stay starts ${r.price.stayStart}; set PASSED_AS_OF in src/prototypes/cancun-resort-comparison/render.mjs to today and run node tools/generate-pages.mjs`);
  }
  assert.ok(PASSED_AS_OF <= today, "PASSED_AS_OF must not be in the future");
});

test("card figures repeat the dated observation text exactly", () => {
  const cards = cancunPriceCards();
  assert.deepEqual(cards.map(c => c.record.id), ["royalton-splash-two-bedroom", "finest-family-suite"]);
  for (const { price, card } of cards) {
    assert.ok(price.basis.includes(`USD ${card.stayTotal.toLocaleString("en-US", { minimumFractionDigits: Number.isInteger(card.stayTotal) ? 0 : 2 })}`), `${price.basis} total`);
    assert.ok(price.basis.includes(`aged ${card.childAges.slice(0, -1).join(", ")} and ${card.childAges.at(-1)}`), "ages");
    assert.ok(price.basis.includes(card.nights === 3 ? "three nights" : `${card.nights} nights`));
    assert.ok(price.basis.startsWith(`November ${Number(price.stayStart.slice(8))}-${Number(card.stayEnd.slice(8))}, 2026`));
    if (card.standardNightly) assert.ok(price.basis.includes(`USD ${card.standardNightly.toLocaleString("en-US", { minimumFractionDigits: 2 })} per room/night`));
  }
});

test("card sits in the page top before the photo, in $, labelled as an older observation and not a quote", () => {
  const html = cancunResortPage(), box = cancunPriceAnswer();
  assert.equal(read("site/where-to-stay/cancun-family-resorts.html"), html);
  const intro = html.split('<section class="page-intro">')[1].split("</section>")[0];
  assert.ok(intro.includes(box)); assert.ok(intro.indexOf(box) < intro.indexOf("<figure"));
  assert.ok(intro.indexOf("<h1>") < intro.indexOf(box));
  assert.doesNotMatch(box, /USD/);
  assert.match(box, /From about \$606&nbsp;a&nbsp;night/);
  assert.match(box, /Sunscape Cancun Resort &amp; Spa<\/a><br><strong>\$606&nbsp;a&nbsp;night<\/strong> · Cancun Hotel Zone<br><small>≈ \$1,836 total, 3 nights Jan 11-14 · kids club starts at 4/);
  assert.match(box, /Finest Playa Mujeres<\/a><br><strong>\$1,588&nbsp;a&nbsp;night<\/strong> · Playa Mujeres<br><small>≈ \$4,764 total, 3 nights Jan 11-14 · kids club starts at 3/);
  // Failed the 3-night control: nightly listing only, no stay estimate.
  for (const [name, price] of [["Royalton Splash Riviera Cancun", "769"], ["Hyatt Ziva Cancun", "1,138"], ["Moon Palace The Grand Cancun", "1,993"]]) {
    assert.ok(box.includes(`${name}</a><br><strong>$${price}&nbsp;a&nbsp;night</strong>`), name);
  }
  assert.match(box, /Moon Palace The Grand Cancun<\/a>[^\n]*kids club ages not confirmed/);
  assert.match(box, /Finest Playa Mujeres is the only resort priced here whose published kids club includes age 3/);
  assert.match(box, /Dreams Sapphire Resort &amp; Spa showed no price/);
  assert.match(box, /one night Mon Jan 11, 2027, seen Nov 3, 2026\. Not quotes\./);
  assert.match(box, /only Finest and Royalton have a price for one exact room/);
  assert.doesNotMatch(box, /\$998|\$2,993/);
  const label = box.match(/<p class="price-answer-label">([\s\S]*?)<\/p>/)[1];
  assert.ok(label.split(/\s+/).length <= 30);
  // Listings leave the card a week before arrival; the page must be regenerated then (byte test above).
  assert.equal(cancunListings("2027-01-04").filter(l => l.sample).length, 0);
  assert.equal(cancunListings("2027-01-03").filter(l => l.sample).length, 5);
});

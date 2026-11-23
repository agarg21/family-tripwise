import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { holidayCitiesData, holidayCityPage, holidayCityPath, validateHolidayCity, openEvents, priceIsFresh, answerNote } from "./page-generation/holiday-city-page.mjs";
import { easternDate } from "./page-generation/sitemap.mjs";

const data = holidayCitiesData();
const sd = data.cities["san-diego"];
const by = Object.fromEntries(sd.events.map((ev) => [ev.id, ev]));

test("city records validate and family ranges follow their published prices", () => {
  assert.deepEqual(validateHolidayCity(sd), []);
  assert.equal(by.lightscape.cost_low, 2 * 28 + 2 * 18);
  assert.equal(by["north-pole-limited"].cost_low, 2 * 30 + 2 * 15);
  assert.equal(by["holiday-wonderland"].cost_low, 4 * 25);
  assert.equal(by["skating-by-the-sea"].cost_low, 4 * 35);
  assert.equal(by["skating-by-the-sea"].cost_high, 4 * 45);
  assert.equal(by["jungle-bells"].cost_low, 2 * 73 + 2 * 63);
  assert.equal(by["jungle-bells"].cost_high, 2 * 78 + 2 * 68);
  assert.equal(by["seaworld-christmas"].cost_low, Math.round(4 * 51.99));
  assert.equal(by["legoland-bricktacular"].cost_low, 4 * 69);
});

test("the page leads with what is free and the paid range", () => {
  const html = holidayCityPage("san-diego", data, "2026-11-04");
  assert.match(html, /≈ \$90 to \$292/);
  assert.match(html, /<strong>Free:<\/strong>/);
  assert.match(html, /From ≈ \$92/);
  assert.doesNotMatch(html.match(/<main[\s\S]*<\/main>/)[0], /not observed|Skate rental and museum|Chicago/i);
});

test("events drop after their dates", () => {
  const html = holidayCityPage("san-diego", data, "2026-12-06");
  assert.doesNotMatch(html, /id="december-nights"/);
  assert.match(html, /id="parade-of-lights"/);
  assert.equal(openEvents(sd, "2027-03-01").length, 0);
  assert.match(holidayCityPage("san-diego", data, "2027-03-01"), /season's events have ended/);
});

test("an old read hides every dollar figure", () => {
  const today = "2026-12-20";
  assert.equal(priceIsFresh(by.lightscape, today), false);
  const main = holidayCityPage("san-diego", data, today).match(/<main[\s\S]*<\/main>/)[0];
  assert.doesNotMatch(main, /\$\d/);
  assert.match(main, /Check live/);
});

test("headings follow the count off season", () => {
  assert.doesNotMatch(holidayCityPage("san-diego", data, "2027-03-01"), /0.Outings|Family of 4 Cost/);
});

test("the committed page is the city page", () => {
  const committed = readFileSync(new URL(`../site/${holidayCityPath("san-diego")}`, import.meta.url), "utf8");
  assert.ok(committed.includes("Christmas in San Diego With Kids") || committed.includes("Christmas in San&nbsp;Diego With Kids"));
  assert.equal(committed.includes("Lightscape"), easternDate() <= "2027-01-03");
});

test("Orlando: family ranges follow their published prices and stale reads hide dollars", () => {
  const orl = data.cities.orlando;
  const o = Object.fromEntries(orl.events.map((ev) => [ev.id, ev]));
  assert.deepEqual(validateHolidayCity(orl), []);
  assert.equal(o["mickeys-party"].cost_low, 2 * 189 + 2 * 179);
  assert.equal(o["mickeys-party"].cost_high, 2 * 229 + 2 * 219);
  assert.equal(o["dazzling-nights"].cost_low, 2 * 35 + 2 * 33);
  assert.equal(o["seaworld-christmas"].cost_low, Math.round(4 * 59.99));
  assert.equal(o["legoland-bricktacular"].cost_low, 4 * 69);
  assert.equal(o["crayola-christmas"].cost_low, Math.round(4 * 30.99));
  assert.equal(o["gatorland-ho-down"].cost_low, Math.round(2 * 34.99 + 2 * 24.99));
  assert.equal(o["festival-of-trees"].cost_low, 2 * 23 + 2 * 15);
  const html = holidayCityPage("orlando", data, "2026-11-04");
  assert.match(html, /≈ \$76 to \$896/);
  // Festival of Trees (Nov 14-22) leaves after its end; the range falls back to Gatorland.
  assert.match(holidayCityPage("orlando", data, "2026-11-23"), /≈ \$120 to \$896/);
  assert.doesNotMatch(holidayCityPage("orlando", data, "2026-11-23"), /festival-of-trees/);
  assert.match(html, /where-to-stay\/orlando-family-hotels\.html/);
  // Magic Show price read Nov 22 stays fresh to Dec 22.
  // On Dec 21 every other read has gone stale: the only dollars left are on the Magic Show card.
  const dec21 = holidayCityPage("orlando", data, "2026-12-21").match(/<main[\s\S]*<\/main>/)[0];
  assert.deepEqual([...new Set(dec21.match(/\$[\d.,]+/g))].sort(), ["$200", "$360", "$49.99", "$89.99"]);
  assert.doesNotMatch(holidayCityPage("orlando", data, "2026-12-23").match(/<main[\s\S]*<\/main>/)[0], /\$\d/);
  assert.doesNotMatch(holidayCityPage("orlando", data, "2026-11-10"), /id="[^"]*san-diego/);
});

test("San Antonio: family ranges follow their published prices and stale reads hide dollars", () => {
  const sa = data.cities["san-antonio"];
  const o = Object.fromEntries(sa.events.map((ev) => [ev.id, ev]));
  assert.deepEqual(validateHolidayCity(sa), []);
  assert.equal(o.illuminate.cost_low, Math.round(2 * (29.99 + 3) + 2 * (26.99 + 3)));
  assert.equal(o["six-flags"].cost_low, 4 * 35);
  assert.equal(o["zoo-lights"].cost_low, 4 * 8);
  assert.equal(o.seaworld.cost_low, Math.round(4 * 53.99));
  const html = holidayCityPage("san-antonio", data, "2026-11-04");
  assert.match(html, /≈ \$32 to \$216/);
  assert.match(html, /No strollers, ice chests or carriers/
  );
  assert.match(html, /3 more below/);
  assert.doesNotMatch(holidayCityPage("san-antonio", data, "2026-12-20").match(/<main[\s\S]*<\/main>/)[0], /\$\d/);
});

test("Washington, DC: family ranges follow their published prices and stale reads hide dollars", () => {
  const dc = data.cities["washington-dc"];
  const o = Object.fromEntries(dc.events.map((ev) => [ev.id, ev]));
  assert.deepEqual(validateHolidayCity(dc), []);
  assert.equal(o.zoolights.cost_low, 4 * 10);
  assert.equal(o["mount-vernon"].cost_low, 2 * 58 + 36);
  assert.equal(o.meadowlark.cost_low, 4 * 19);
  assert.equal(o.meadowlark.cost_high, 4 * 23);
  assert.equal(o.enchant.cost_low, 4 * 28);
  const html = holidayCityPage("washington-dc", data, "2026-11-04");
  assert.match(html, /≈ \$30 to \$152/);
  assert.match(html, /family-itinerary\/washington-dc-with-kids\.html/);
  assert.match(html, /Select nights only/);
  assert.match(html, /≈ \$38 for 4 \(\$46 on Dec 14\)/);
  assert.doesNotMatch(holidayCityPage("washington-dc", data, "2026-12-20").match(/<main[\s\S]*<\/main>/)[0], /\$\d/);
});

test("NYC: published prices, what's free, and passed sessions leave", () => {
  const nyc = data.cities["new-york-city"];
  assert.deepEqual(validateHolidayCity(nyc), []);
  const n = Object.fromEntries(nyc.events.map((ev) => [ev.id, ev]));
  assert.equal(n.lightscape.cost_low, 2 * 29 + 2 * 15);
  assert.equal(n.lightscape.cost_high, 2 * 44 + 2 * 28);
  assert.equal(n["bronx-zoo"].cost_low, Math.round(2 * 29.95 + 2 * 14.95));
  assert.equal(n["bronx-zoo"].cost_high, Math.round(2 * 37.95 + 2 * 22.95));
  assert.equal(n["nybg-train-show"].cost_low, 2 * 35 + 2 * 15);
  assert.equal(n["nybg-train-show"].cost_high, 2 * 39 + 2 * 17);
  assert.equal(n["bryant-park-rink"].cost_low, Math.round(4 * 18.72));
  assert.equal(n["bryant-park-rink"].cost_high, Math.round(4 * 64.48));
  const now = holidayCityPage("new-york-city", data, "2026-11-04");
  assert.match(now, /third party/);
  assert.match(now, /Free with your own skates/);
  assert.doesNotMatch(now, /not observed/i);
  const later = holidayCityPage("new-york-city", data, "2026-11-17");
  assert.doesNotMatch(later, /id="vessel-lighting"/);
  assert.doesNotMatch(holidayCityPage("new-york-city", data, "2026-12-04"), /Sensory Inclusive Night/);
  const stale = holidayCityPage("new-york-city", data, "2026-12-23").match(/<main[\s\S]*<\/main>/)[0]; // day after the newest NYC price read (Nov 22) goes stale
  assert.doesNotMatch(stale, /\$\d/);
  assert.match(stale, /Free with your own skates/);
  assert.equal(openEvents(nyc, "2027-03-01").length, 0);
});

test("Chicago: records, top range and dated lines", () => {
  const chi = data.cities.chicago;
  const c = Object.fromEntries(chi.events.map((ev) => [ev.id, ev]));
  assert.deepEqual(validateHolidayCity(chi), []);
  assert.equal(c.zoolights.cost_low, 4 * 7);
  assert.equal(c.zoolights.cost_high, 4 * 12);
  assert.equal(c["winter-wonderfest"].cost_low, 4 * 27);
  assert.equal(c["winter-wonderfest"].cost_high, 4 * 32);
  assert.equal(c["morton-illumination"].cost_low, 4 * 22);
  assert.equal(c["holiday-magic"].cost_low, Math.round(4 * 29.95));
  const now = holidayCityPage("chicago", data, "2026-11-04");
  assert.match(now, /≈ \$25 to \$128/);
  assert.match(now, /Museum admission, check price/);
  assert.match(now, /Free with your own skates/);
  assert.match(now, /free Mondays to Dec 14/);
  assert.doesNotMatch(now, /Nov&nbsp;7 to Dec&nbsp;31/);
  assert.doesNotMatch(now, /not observed|Macy|Rockefeller/i);
  const nov22 = holidayCityPage("chicago", data, "2026-11-22");
  assert.doesNotMatch(nov22, /id="mag-mile-lights"/);
  assert.doesNotMatch(nov22, /id="tree-lighting"/);
  const dec15 = holidayCityPage("chicago", data, "2026-12-15");
  assert.doesNotMatch(dec15, /free Mondays to|Free on reserved|Free Mondays with|Check Dec 1/);
  assert.match(dec15, /Dec 21 and 28 are not free/);
  const dec24 = holidayCityPage("chicago", data, "2026-12-24");
  assert.doesNotMatch(dec24, /Santa through|Dec 19/);
  const stale = holidayCityPage("chicago", data, "2026-12-23").match(/<main[\s\S]*<\/main>/)[0];
  assert.doesNotMatch(stale, /\$\d/);
  assert.match(stale, /Free with your own skates/);
  assert.match(holidayCityPage("chicago", data, "2027-03-01"), /season's events have ended/);
});

test("an event with an unconfirmed end is never listed as over by December", () => {
  const html = readFileSync(new URL("../site/holidays/new-york-city-christmas-with-kids.html", import.meta.url), "utf8");
  const note = html.match(/Coming in December\?<\/strong>([^<]*)</)?.[1] ?? "";
  assert.ok(!note.includes("Grand Central"), note);
});

for (const city of ["orlando", "new-york-city"]) {
  test(`a dated pick (${city} Thanksgiving weekend) shows until its last day, then drops itself`, () => {
    const label = "Thanksgiving weekend, Fri Nov 27 to Sun Nov 29";
    assert.ok(holidayCityPage(city, holidayCitiesData(), "2026-11-10").includes(label));
    assert.ok(holidayCityPage(city, holidayCitiesData(), "2026-11-29").includes(label));
    assert.ok(!holidayCityPage(city, holidayCitiesData(), "2026-11-30").includes(label));
  });
}

test("the NYC Thanksgiving highlight in the answer box drops after Nov 29", () => {
  const text = "free Santa photos Fri Nov 27";
  assert.ok(holidayCityPage("new-york-city", holidayCitiesData(), "2026-11-29").includes(text));
  assert.ok(!holidayCityPage("new-york-city", holidayCitiesData(), "2026-11-30").includes(text));
});

test("Las Vegas: family figures follow published prices; the unpriced forest says check live", () => {
  const lv = data.cities["las-vegas"];
  assert.deepEqual(validateHolidayCity(lv), []);
  const l = Object.fromEntries(lv.events.map((ev) => [ev.id, ev]));
  assert.equal(l["ethel-m-cactus-garden"].cost_low, 4 * 3);
  assert.equal(l["oasis-ice-rink"].cost_low, 4 * 30);
  assert.equal(l["glittering-lights"].cost_low, 39); // one carload ticket covers the car (read Nov 21)
  const main = holidayCityPage("las-vegas", data, "2026-11-10").match(/<main[\s\S]*<\/main>/)[0];
  assert.match(main, /≈ \$12 to \$120/);
  assert.match(main, /id="magical-forest"[\s\S]*?Check live/);
  assert.doesNotMatch(holidayCityPage("las-vegas", data, "2026-12-22").match(/<main[\s\S]*<\/main>/)[0], /\$\d/);
});

test("seo_title overrides stay at 60 characters or fewer and keep the city's Christmas-with-kids query", () => {
  for (const [slug, city] of Object.entries(data.cities)) {
    if (!city.seo_title) continue;
    assert.ok(city.seo_title.length <= 60, `${slug}: ${city.seo_title.length} chars`);
    assert.match(city.seo_title, new RegExp(`^${city.short} Christmas With Kids`), slug);
    const html = readFileSync(new URL(`../site/${holidayCityPath(slug)}`, import.meta.url), "utf8");
    const title = html.match(/<title>(.*?)<\/title>/)[1].replace(/&amp;/g, "&");
    if (/Family of 4 Cost/.test(title)) assert.equal(title, city.seo_title, slug);
  }
});

test("every holiday city title stays at 60 characters or fewer in each state (costs, dates only, ended)", () => {
  for (const slug of Object.keys(data.cities)) {
    for (const day of ["2026-11-12", "2026-12-20", "2027-02-01"]) {
      const title = holidayCityPage(slug, data, day).match(/<title>(.*?)<\/title>/)[1].replace(/&amp;/g, "&");
      assert.ok(title.length <= 60, `${slug} ${day}: ${title.length} chars "${title}"`);
      assert.match(title, /Christmas With Kids/, slug);
    }
  }
});

test("answer note counts only the outings whose prices are fresh that day (no fixed count drifts)", () => {
  for (const today of ["2026-11-14", "2026-12-05"]) {
    const html = holidayCityPage("chicago", undefined, today);
    assert.ok(!html.includes("{n}"), today);
    const shown = html.match(/estimate for the (\d+) priced outing/)?.[1];
    if (shown) assert.equal(Number(shown), (html.match(/class="holiday-figure">(From )?≈ \$/g) ?? []).length, today);
  }
  assert.equal(answerNote("estimate for the {n} priced outings; x", 1), "estimate for the 1 priced outing; x");
});

test("NYC Winter Lantern Festival: a starting price for 4, a news line that drops after opening week", () => {
  const before = holidayCityPage("new-york-city", undefined, "2026-11-15");
  assert.ok(before.includes('id="winter-lantern-festival"'));
  assert.ok(before.includes("From ≈ $72"));
  assert.ok(before.includes("opens Thu, Nov 19 at Snug Harbor"));
  assert.ok(!before.includes("{n}"));
  const after = holidayCityPage("new-york-city", undefined, "2026-11-23");
  assert.ok(!after.includes("opens Thu, Nov 19 at Snug Harbor"));
  assert.ok(!holidayCityPage("new-york-city", undefined, "2027-01-11").includes('id="winter-lantern-festival"'));
});

test("NYC Polar Express (Kingston): peak/off-peak range for 4, news line drops after Nov 22, card after Dec 30", () => {
  const before = holidayCityPage("new-york-city", undefined, "2026-11-15");
  assert.ok(before.includes('id="polar-express-kingston"'));
  assert.ok(before.includes("≈ $172 to $212"));
  assert.ok(before.includes("running from Kingston (Hudson Valley)"));
  assert.ok(!holidayCityPage("new-york-city", undefined, "2026-11-23").includes("running from Kingston (Hudson Valley)"));
  assert.ok(!holidayCityPage("new-york-city", undefined, "2026-12-31").includes('id="polar-express-kingston"'));
});

test("NYC Christmas Carousel (Greeley Square): $40 for 4 riders, news line drops after Nov 22, card after Jan 2", () => {
  const before = holidayCityPage("new-york-city", undefined, "2026-11-15");
  assert.ok(before.includes('id="herald-christmas-carousel"'));
  assert.ok(before.includes("≈ $40"));
  assert.ok(before.includes("a two-level carousel is open in Greeley"));
  assert.ok(before.includes("VR sleigh ride $10; snow slide $7 a ride or $15 for 3"));
  assert.ok(!before.includes("staff ramp"));
  assert.ok(!holidayCityPage("new-york-city", undefined, "2026-11-23").includes("a two-level carousel is open in Greeley"));
  assert.ok(!holidayCityPage("new-york-city", undefined, "2027-01-03").includes('id="herald-christmas-carousel"'));
});

test("Orlando Magic Show Holiday Edition (re-read Nov 22): priced from the Jan 2 page, news line drops after Nov 22, price hides after Dec 22, card after Jan 2", () => {
  const ev = data.cities.orlando.events.find((x) => x.id === "holiday-magic-show");
  assert.equal(ev.cost_low, Math.round(4 * 49.99));
  assert.equal(ev.cost_high, Math.round(4 * 89.99));
  const card = (day) => holidayCityPage("orlando", undefined, day).match(/id="holiday-magic-show"[\s\S]*?<\/article>/)?.[0];
  const before = holidayCityPage("orlando", undefined, "2026-11-22");
  assert.ok(before.includes("Got Talent finalist Drew Thomas at Grande Lakes Orlando"));
  assert.match(card("2026-11-22"), /≈ \$200 to \$360/);
  assert.match(card("2026-11-22"), /none listed Dec 13 to Jan 1/);
  assert.match(before, /Fri–Sat to Dec 12, plus Jan 2/);
  assert.ok(!holidayCityPage("orlando", undefined, "2026-11-23").includes("Got Talent finalist Drew Thomas at Grande Lakes Orlando"));
  assert.doesNotMatch(card("2026-12-23"), /\$\d/);
  assert.match(card("2026-12-23"), /Check live/);
  assert.ok(card("2027-01-02"));
  assert.ok(!holidayCityPage("orlando", undefined, "2027-01-03").includes('id="holiday-magic-show"'));
});

test("DC Enchant free kid tickets (read Nov 18): news line and card line drop after Dec 9", () => {
  const before = holidayCityPage("washington-dc", undefined, "2026-11-18");
  assert.ok(before.includes("free kid tickets on Fri Nov 20 and Tue-Wed Dec 1-2 and 8-9, up to 2"));
  assert.ok(before.includes("Free kid tickets on Fri Nov 20 and Tue-Wed Dec 1-2 and 8-9:"));
  assert.ok(before.includes("kids-light-up-the-night"));
  const after = holidayCityPage("washington-dc", undefined, "2026-12-10");
  assert.ok(!/free kid tickets on Fri Nov 20/i.test(after));
  assert.ok(after.includes('id="enchant"'));
});

test("Chicago Lightscape (read Nov 18): unpriced card, news line drops after Nov 25, family and sensory lines drop, card after Jan 3", () => {
  const before = holidayCityPage("chicago", undefined, "2026-11-18");
  assert.ok(before.includes('id="chicago-lightscape"'));
  assert.ok(before.includes("20 of its 24 installations are new this year"));
  assert.ok(before.includes("Sensory night Wed Dec 2"));
  assert.doesNotMatch(before.match(/id="chicago-lightscape"[\s\S]*?<\/article>/)[0], /\$\d+ for 4|≈ \$/);
  assert.ok(!holidayCityPage("chicago", undefined, "2026-11-26").includes("20 of its 24 installations are new this year"));
  const dec = holidayCityPage("chicago", undefined, "2026-12-17");
  assert.ok(!dec.includes("Family Nights with Santa") && !dec.includes("Sensory night Wed Dec 2"));
  assert.ok(!holidayCityPage("chicago", undefined, "2027-01-04").includes('id="chicago-lightscape"'));
});

test("Boston Faneuil Hall lighting (read Nov 18): unpriced Nov 21 card, not counted free, drops after Nov 21", () => {
  const before = holidayCityPage("boston", undefined, "2026-11-18");
  const card = before.match(/id="faneuil-lighting"[\s\S]*?<\/article>/)[0];
  assert.match(card, /No ticket listed/);
  assert.match(card, /tree is lit at 6 p\.m\./);
  assert.doesNotMatch(card, /\$\d|Free:/);
  assert.match(before, /4 of 9 free/);
  assert.match(before.match(/id="holiday-answer"[\s\S]*?<\/section>/)[0], /Sat Nov 21:<\/strong> <a href="#faneuil-lighting">/);
  const after = holidayCityPage("boston", undefined, "2026-11-22");
  assert.ok(!after.includes('id="faneuil-lighting"') && !after.includes('href="#faneuil-lighting"'));
});

test("NYC Brookfield Place (read Nov 19): free sold-out Nutcracker Nov 21-22 and Santa selfies Dec 5-24, each drops after its end", () => {
  const before = holidayCityPage("new-york-city", undefined, "2026-11-19");
  const nut = before.match(/id="bfpl-nutcracker"[\s\S]*?<\/article>/)[0];
  assert.match(nut, /sold out/);
  assert.match(nut, /Sold out ahead:[^<]*<\/strong> All advance tickets are gone/);
  assert.match(nut, /walk-ons may be let in/i);
  assert.match(nut, /advance tickets sold out; checked Nov 19/);
  assert.match(before, /This weekend, Nov 21-22:/);
  assert.match(before, /Free<small>advance tickets sold out<\/small>/);
  assert.doesNotMatch(nut, /\$\d/);
  assert.match(before, /This weekend, Sat Nov 21 to Sun Nov 22/);
  const after = holidayCityPage("new-york-city", undefined, "2026-11-23");
  assert.ok(!after.includes('id="bfpl-nutcracker"') && !after.includes("This weekend, Sat Nov 21") && !after.includes("This weekend, Nov 21-22"));
  const santa = after.match(/id="bfpl-santa"[\s\S]*?<\/article>/)[0];
  assert.match(santa, /hours vary/);
  assert.ok(!holidayCityPage("new-york-city", undefined, "2026-12-25").includes('id="bfpl-santa"'));
});

test("Chicago Garfield Park winter flower show (read Nov 18): from $25 for non-residents, residents free, indoor pick, drops after Jan 3", () => {
  const before = holidayCityPage("chicago", undefined, "2026-11-18");
  const card = before.match(/id="garfield-winter-show"[\s\S]*?<\/article>/)[0];
  assert.match(card, /From ≈ \$25/);
  assert.match(card, /no price listed for age 4/);
  assert.match(card, /Free for Chicago residents/);
  assert.match(before, /Cold or wet day:<\/strong>[^\n]*#garfield-winter-show/);
  assert.ok(!holidayCityPage("chicago", undefined, "2027-01-04").includes('id="garfield-winter-show"'));
});

test("Chicago Thanksgiving Parade (re-read Nov 18): 7:45 a.m. start shown with the organizer site's 8 to 11 a.m. as a conflict", () => {
  const page = holidayCityPage("chicago", undefined, "2026-11-19");
  const card = page.match(/id="thanksgiving-parade"[\s\S]*?<\/article>/)[0];
  assert.match(card, /starts 7:45 a\.m\./);
  assert.match(card, /organizer&#39;s site lists 8 to 11 a\.m\. \(sources differ\)/);
  assert.ok(!card.includes("Earlier than last year"));
  assert.ok(!card.includes("2025 time"));
  assert.match(page, /Free parade from 7:45 a\.m\. \(the organizer&#39;s site says 8 to 11\)/);
});

test("Chicago CTA Holiday Train and Bus (read Nov 18): just the CTA fare, fare estimate for 4, news line drops after Nov 27, card after Dec 22", () => {
  const page = holidayCityPage("chicago", undefined, "2026-11-19");
  const card = page.match(/id="cta-holiday-train"[\s\S]*?<\/article>/)[0];
  assert.match(card, /Just the CTA fare/);
  assert.match(card, /About \$6\.25 for 4 on one &#39;L&#39; ride, estimate/);
  assert.match(card, /Sat Nov 28, Dec 5, 12 and 19/);
  assert.match(page, /href="#cta-holiday-train">CTA Holiday Train and Bus<\/a>: Santa rides/);
  assert.ok(!holidayCityPage("chicago", undefined, "2026-11-28").includes("Santa rides the Holiday Bus from Tue Nov 24"));
  assert.ok(!holidayCityPage("chicago", undefined, "2026-12-20").includes("Sat Nov 28, Dec 5, 12 and 19"));
  assert.ok(!holidayCityPage("chicago", undefined, "2026-12-23").includes('id="cta-holiday-train"'));
});

test("San Antonio Ballet Nutcracker (read Nov 18): from $124 for 4 at the all-in $31 seat, garage parking, drops after Dec 13", () => {
  const page = holidayCityPage("san-antonio", undefined, "2026-11-19");
  const card = page.match(/id="ballet-sa-nutcracker"[\s\S]*?<\/article>/)[0];
  assert.match(card, /From ≈ \$124/);
  assert.match(card, /includes fees and tax/);
  assert.match(card, /\$20 event parking, \$17 if you prepay/);
  assert.match(card, /Every person needs a ticket/);
  assert.ok(!holidayCityPage("san-antonio", undefined, "2026-12-14").includes('id="ballet-sa-nutcracker"'));
});

test("San Antonio Merry-Achi Christmas (read Nov 19): from $168 for 4 at the all-in $42 seat, one show Dec 23, drops after", () => {
  const page = holidayCityPage("san-antonio", undefined, "2026-11-19");
  const card = page.match(/id="merryachi-christmas"[\s\S]*?<\/article>/)[0];
  assert.match(card, /From ≈ \$168/);
  assert.match(card, /fees and tax included/);
  assert.match(card, /Every person needs a ticket/);
  assert.doesNotMatch(card, /\$20 event parking/);
  assert.ok(holidayCityPage("san-antonio", undefined, "2026-12-23").includes('id="merryachi-christmas"'));
  assert.ok(!holidayCityPage("san-antonio", undefined, "2026-12-24").includes('id="merryachi-christmas"'));
});

test("San Antonio Magik Theatre Grinch (read Nov 19): $92 to $110 for 4 plus fees, sensory show Dec 5, drops after Dec 24", () => {
  const page = holidayCityPage("san-antonio", undefined, "2026-11-19");
  const card = page.match(/id="magik-grinch"[\s\S]*?<\/article>/)[0];
  assert.match(card, /≈ \$92 to \$110/);
  assert.match(card, /plus fees and tax/);
  assert.match(card, /ages 3 and up/);
  assert.match(card, /Pay What You Wish/);
  assert.ok(!holidayCityPage("san-antonio", undefined, "2026-11-28").includes("Pay What You Wish"));
  assert.ok(!holidayCityPage("san-antonio", undefined, "2026-12-06").includes("sensory-friendly Grinch"));
  assert.ok(!holidayCityPage("san-antonio", undefined, "2026-12-25").includes('id="magik-grinch"'));
});

test("NYC Origami Holiday Tree at AMNH (read Nov 19): ≈ $118 for 4 outside NY State, residents line, quiet-day tip drops after Nov 24, card after Dec 20 window", () => {
  const page = holidayCityPage("new-york-city", undefined, "2026-11-19");
  const card = page.match(/id="amnh-origami-tree"[\s\S]*?<\/article>/)[0];
  assert.match(card, /≈ \$118/);
  assert.match(card, /2 × \$37 \+ 2 × \$22/);
  assert.match(card, /no closing date posted/);
  assert.match(page, /NY residents ≈ \$78/);
  assert.match(page, /Cold or wet day:<\/strong>[^\n]*#amnh-origami-tree/);
  assert.ok(!page.includes("Origami Holiday Tree, American Museum of Natural History: opens Nov 23"));
  assert.ok(!holidayCityPage("new-york-city", undefined, "2026-11-25").includes("Best ticket availability: Mon Nov 23"));
  assert.ok(!holidayCityPage("new-york-city", undefined, "2026-12-21").includes('id="amnh-origami-tree"'));
});

test("DC National Menorah lighting (read Nov 19): free ticket needed, Sun Dec 6 3:30 p.m., drops after Dec 6", () => {
  const page = holidayCityPage("washington-dc", undefined, "2026-11-19");
  const card = page.match(/id="national-menorah"[\s\S]*?<\/article>/)[0];
  assert.match(card, /Free<small>free ticket needed/);
  assert.match(card, /3:30 to 5:30 p\.m\./);
  assert.match(card, /no stroller rules posted/);
  assert.match(card, /2026 performers not posted yet/);
  assert.ok(!holidayCityPage("washington-dc", undefined, "2026-12-07").includes('id="national-menorah"'));
});

test("NYC Ballet Nutcracker (read Nov 19): audio-described show dates, line drops after Dec 2", () => {
  const card = (d) => holidayCityPage("new-york-city", undefined, d).match(/id="nycb-nutcracker"[\s\S]*?<\/article>/)[0];
  assert.match(card("2026-11-19"), /Audio-described shows Sun Nov 29, 5\sp\.m\. and Wed Dec 2, 7\sp\.m\./);
  assert.match(card("2026-11-19"), /show no prices/);
  assert.match(card("2026-11-19"), /couldn.t read a price on Nov 19/);
  assert.match(card("2026-12-02"), /Audio-described/);
  assert.ok(!card("2026-12-03").includes("Audio-described"));
});

test("NYC Winter Lantern Festival Queens (read Nov 19): $72 to $100 for 4, unconfirmed end, news line drops after Nov 22", () => {
  const page = holidayCityPage("new-york-city", undefined, "2026-11-19");
  const card = page.match(/id="winter-lantern-festival-queens"[\s\S]*?<\/article>/)[0];
  assert.match(card, /≈ \$72 to \$100/);
  assert.match(card, /No end date posted/);
  assert.match(card, /Parking is free/);
  assert.doesNotMatch(card, /bus trip/);
  assert.ok(page.includes("a second site opens Thu, Nov 19 at Queens County Farm Museum"));
  assert.ok(!holidayCityPage("new-york-city", undefined, "2026-11-23").includes("a second site opens"));
  assert.ok(holidayCityPage("new-york-city", undefined, "2026-11-23").includes('id="winter-lantern-festival-queens"'));
});

test("DC Nutcracker Tea Party line drops after Dec 6 and the price pointer follows the dated price text", () => {
  const data = holidayCitiesData();
  const card = (d) => holidayCityPage("washington-dc", data, d).split('id="twb-nutcracker"')[1].split("</article>")[0];
  assert.match(card("2026-12-06"), /Nutcracker Tea Party \(Sun Dec 6/);
  assert.doesNotMatch(card("2026-12-07"), /Tea Party \(Sun Dec 6/);
  assert.match(card("2026-11-20"), /group seat prices in Ticket details/);
  assert.match(card("2026-11-20"), /\$61 to \$180/);
  assert.doesNotMatch(card("2026-12-10"), /group seat prices in Ticket details|\$61/);
});

test("R1 #12: NYC compact cards open from a name, cost and date row; nothing dropped; other cities unchanged", () => {
  const nyc = holidayCityPage("new-york-city", undefined, "2026-11-20");
  const gc = nyc.match(/id="grand-central-train-show"[\s\S]*?<\/article>/)[0];
  assert.match(gc, /class="holiday-card holiday-card-compact">\s*<details><summary><h3>Holiday Train Show at Grand Central<\/h3><span class="holiday-card-glance"><strong>Free<\/strong> · /);
  for (const part of [/holiday-place/, /holiday-figure/, /<strong>When:<\/strong>/, /<strong>Ticket:<\/strong>/, /<strong>Good to know:<\/strong>/, /holiday-source/]) assert.match(gc, part);
  assert.doesNotMatch(gc, /ds-card-more/);
  const glance = (id) => nyc.match(new RegExp(`id="${id}"[\\s\\S]*?<span class="holiday-card-glance">([\\s\\S]*?)</span>`))[1];
  assert.match(glance("bfpl-nutcracker"), /^<strong>Free<\/strong> \(advance tickets sold out\)/);
  assert.match(glance("nybg-train-show"), /for 4, estimate<\/strong> \(All-Garden Pass; show price may differ\)/);
  assert.match(glance("amnh-origami-tree"), /for 4, estimate<\/strong> \(outside NY State; NY residents/);
  assert.match(nyc, /<script src="\.\.\/holiday-cards\.js" defer><\/script>/);
  const cards = nyc.match(/<article id="/g).length;
  assert.equal(cards, (nyc.match(/holiday-card-compact"/g) ?? []).length);
  assert.match(nyc, /<details class="holiday-news-more"><summary>\d+ more new this season<\/summary>/);
  assert.equal((nyc.split('<section class="container holiday-news"')[1].split("<details")[0].match(/<li>/g) ?? []).length, 4);
  const chi = holidayCityPage("chicago", undefined, "2026-11-20");
  assert.doesNotMatch(chi, /holiday-card-compact|holiday-news-more/);
  assert.match(chi, /<details class="ds-card-more"><summary>Ticket details, tips and sources<\/summary>/);
});

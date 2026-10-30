import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

// G14 batch 2: the credited city banner sits directly under the page hero, once, above the first section heading.
const pages = {
  "family-itinerary/washington-dc-with-kids.html": "washington-dc-national-mall",
  "family-itinerary/boston-with-kids.html": "boston-skyline",
  "things-to-do/chicago-with-kids.html": "chicago-millennium-park",
  "things-to-do/san-antonio-with-kids.html": "san-antonio-river-walk",
  "things-to-do/chicago-with-teens.html": "chicago-millennium-park",
  "things-to-do/las-vegas-with-teens.html": "las-vegas-bellagio-fountains",
  "things-to-do/new-york-city-with-teens.html": "new-york-city-central-park",
  "things-to-do/san-antonio-with-teens.html": "san-antonio-river-walk"
};

for (const [path, slug] of Object.entries(pages)) {
  test(`${path} opens with one credited ${slug} banner`, () => {
    const html = readFileSync(new URL(`../site/${path}`, import.meta.url), "utf8");
    // Activity pages: directly under the page hero; itineraries: under the short plan/catch/cost answer.
    const anchor = path.startsWith("family-itinerary/") ? 'class="container answer-box"' : 'class="page-hero"';
    assert.match(html, new RegExp(`<section [^>]*${anchor}[^>]*>[\\s\\S]*?\\n      <\\/section>\\n      <section class="container media-section hero-photo-section">`));
    assert.equal((html.match(/<figure /g) || []).length, 1);
    assert.equal((html.match(new RegExp(`images/${slug}\\.webp`, "g")) || []).length, 1);
    const banner = html.indexOf('class="licensed-photo hero-photo"');
    assert.ok(banner > 0 && banner < html.indexOf("<h2"));
    const figure = html.slice(banner, html.indexOf("</figure>", banner));
    assert.match(figure, /alt="[^"]{20,}"/);
    assert.match(figure, /loading="eager"/);
    assert.match(figure, /commons\.wikimedia\.org\/wiki\/File:/);
    assert.match(figure, /Resized and cropped\./);
  });
}

test("six activity pages answer 'how many picks and what is free' right under the banner", async () => {
  const { activityGlances } = await import("./page-generation/activity-glance.mjs");
  assert.equal(Object.keys(activityGlances).length, 6);
  for (const path of Object.keys(activityGlances)) {
    const html = readFileSync(new URL(`../site/${path}`, import.meta.url), "utf8");
    assert.match(html, /hero-photo-section">[\s\S]*?<\/section>\n      <section class="container answer-box activity-glance" aria-label="At a glance">/, path);
    assert.equal((html.match(/activity-glance" aria-label/g) || []).length, 1, path);
    const glance = html.indexOf('aria-label="At a glance"');
    assert.ok(glance < html.indexOf("<h2"), path);
  }
});

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import assert from "node:assert/strict";

const root = fileURLToPath(new URL("../", import.meta.url));
const pagePath = join(root, "site", "where-to-stay", "san-diego-family-hotels.html");
const html = readFileSync(pagePath, "utf8");

test("publishes the San Diego family hotel page as an indexable comparison guide", () => {
  const sitemap = readFileSync(join(root, "site", "sitemap.xml"), "utf8");

  assert.match(html, /<link rel="canonical" href="https:\/\/familytripwise\.com\/where-to-stay\/san-diego-family-hotels\.html">/);
  assert.doesNotMatch(html, /<meta[^>]+name=["']robots["'][^>]+noindex/i);
  assert.equal((sitemap.match(/https:\/\/familytripwise\.com\/where-to-stay\/san-diego-family-hotels\.html/g) || []).length, 1);
  assert.match(html, /<title>Top Family Hotels in San Diego: 12 Options by Trip Style<\/title>/);
  assert.match(html, /<h1>Top Family Hotels in San Diego: 12 Options by Trip Style<\/h1>/);
  assert.match(html, /Hotel facts checked:<\/strong> August 17, 2026/);
  assert.match(html, /Online-review themes sampled:<\/strong> July 18-21, 2026/);
  assert.match(html, /August checks did not provide consistent family totals/i);
  assert.match(html, /compare the same room and occupancy plus taxes and parking/i);
  assert.equal((html.match(/type="application\/ld\+json"/g) || []).length, 1);
  assert.doesNotMatch(html, /"@type":"FAQPage"/);
});

test("covers 12 named hotel options with dollar ranges and map links", () => {
  const hotelNames = [
    "Bahia Resort Hotel",
    "San Diego Mission Bay Resort",
    "Hyatt Regency Mission Bay Spa and Marina",
    "Paradise Point Resort &amp; Spa",
    "Catamaran Resort Hotel and Spa",
    "Homewood Suites San Diego Downtown/Bayside",
    "LEGOLAND Hotel or Castle Hotel",
    "Loews Coronado Bay Resort",
    "La Jolla Shores Hotel",
    "Hotel del Coronado",
    "The Dana on Mission Bay",
    "Manchester Grand Hyatt San Diego"
  ];

  for (const name of hotelNames) {
    assert.match(html, new RegExp(name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  for (const range of ["$340-$630+", "$375-$500+", "$270-$350+", "$240-$360+", "$395-$740+", "$265-$350+", "Package-priced", "$235-$360+", "$350-$550+", "$600-$900+", "$250-$400+", "$300-$450+"]) {
    assert.match(html, new RegExp(range.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  assert.match(html, /Rough nightly range, not a quote/);
  assert.match(html, /compare the final total for the same dates, occupancy, and room setup/i);
  assert.match(html, /https:\/\/www\.google\.com\/maps\/search\/\?api=1&amp;query=Bahia%20Resort%20Hotel%20San%20Diego/);
  assert.match(html, /<dt>Online reviews<\/dt><dd>Paraphrased themes from a small public sample<\/dd>/);
  assert.match(html, /<dt>Location view<\/dt><dd>Shared cluster map plus direct links for all 12 hotels<\/dd>/);
  assert.match(html, /<dt>One base or split\?<\/dt>/);
  assert.match(html, /Keep one San Diego base when most days are around the city or coast/);
  assert.match(html, /Compare a short North County split only when LEGOLAND anchors the trip and park-hotel downtime may justify moving rooms/);
  assert.match(html, /Mission Bay means bay access; Catamaran adds nearby Pacific Beach; La Jolla Shores is the direct ocean-beach option/);
  assert.match(html, /Verify date-specific drive and traffic plus the same-date room, parking, and package total/);
  assert.doesNotMatch(html, /<dt>Hotels covered<\/dt>/);
  assert.equal((html.match(/<dl class="snapshot">[\s\S]*?<\/dl>/g)?.[0].match(/<dt>/g) || []).length, 4);
  const quickPicks = html.match(/<div class="quick-pick-grid hotel-pick-grid">([\s\S]*?)<\/div>/)?.[1] || "";
  assert.match(quickPicks, /Bahia suite or Hyatt slides/);
  assert.match(quickPicks, /Start with Bahia when a family suite and bay downtime matter/);
  assert.match(quickPicks, /start with Hyatt when waterslides are the hotel-day priority/);
  assert.match(quickPicks, /<span>Bay plus Pacific Beach<\/span><strong>Catamaran Resort<\/strong>/);
  assert.doesNotMatch(quickPicks, /Six different stay shapes|Mission Bay Resort for a wading pool|Paradise Point for scale|The Dana for clearer room-capacity details/);
  assert.equal((html.match(/<article class="quick-pick">/g) || []).length, 6);
  assert.equal((html.match(/<article class="detail-card hotel-card">/g) || []).length, 12);
  assert.equal((html.match(/<h4>Themes in sampled online reviews<\/h4>/g) || []).length, 12);
  assert.equal((html.match(/<h4>Price context and key check<\/h4>/g) || []).length, 12);
  assert.doesNotMatch(html, /<h2>How to use this page<\/h2>/);
  assert.match(html, /small directional sample/);
  assert.match(html, /not representative ratings/);
  assert.doesNotMatch(html, /What online reviews commonly mention|recurring positives and concerns/);
  assert.doesNotMatch(html, /review[- ]signal/i);
  assert.match(html, /refreshed heated pool and children(?:'|&#39;)s wading pool/i);
  assert.match(html, /published \$45\/\$55 parking amount applies/i);
  assert.doesNotMatch(html, /La Jolla Shores[^]*?current construction, pool\/deck operations/i);
  assert.match(html, /three heated pools, a \$42 resort fee/i);
  assert.match(html, /current FAQ says \$50 self-parking and \$55 valet, while the amenities page still says \$47 self-parking/i);
  assert.match(html, /no-reservation Coronado Village shuttle service/i);
  assert.match(html, /December 2026 fourth-floor-pool schedule/i);
  assert.match(html, /Official amenities list a \$46 fee and \$49 reserved doorstep parking/i);
  assert.match(html, /FAQ separately lists a \$48 resort fee and says parking carries no charge/i);
  assert.doesNotMatch(html, /\$48 resort fee includes one-vehicle parking/i);
  assert.equal((html.match(/The range uses older public examples/g) || []).length, 0);
});

test("starts with one trip-style decision surface before evidence and media", () => {
  const tripStyleIndex = html.indexOf("Pick the closest trip style");
  const reviewStatusIndex = html.indexOf('aria-label="Review status"');
  const mediaIndex = html.indexOf('class="container media-section"');

  assert.ok(tripStyleIndex > html.indexOf("</section>", html.indexOf('class="page-hero hotel-hero"')));
  assert.ok(tripStyleIndex < reviewStatusIndex);
  assert.ok(tripStyleIndex < mediaIndex);
  assert.equal((html.match(/Pick the closest trip style/g) || []).length, 1);
  assert.doesNotMatch(html, /Start with the kind of trip you want/);
  assert.doesNotMatch(html, /For Mission Bay water time, compare the six bay resorts/);
  assert.equal((html.match(/<article class="quick-pick">/g) || []).length, 6);
  assert.equal((html.match(/href="\.\.\/where-to-stay\/san-diego-with-kids\.html"/g) || []).length, 1);
  assert.match(html, /Compare San Diego stay areas first/);
  assert.ok(html.indexOf("Compare San Diego stay areas first") < reviewStatusIndex);
  assert.equal((html.match(/<dl class="snapshot">/g) || []).length, 1);
  assert.ok(html.indexOf('<dl class="snapshot">') < reviewStatusIndex);
  assert.ok(html.indexOf("One base or split?") < reviewStatusIndex);
  assert.ok(html.indexOf("One base or split?") < html.indexOf("Compare San Diego stay areas first"));
});

test("embeds the shared Google My Maps view instead of the native schematic POC", () => {
  assert.match(html, /class="google-my-map"/);
  assert.match(html, /title="Family Tripwise San Diego family hotels and kid activity map"/);
  assert.match(html, /src="https:\/\/www\.google\.com\/maps\/d\/embed\?mid=19tptDfcCGkrLLpofrO8ponPdeCefQKc&amp;ll=32\.823313151707154%2C-117\.28066802355525&amp;z=13"/);
  assert.match(html, /Open the full Google map/);
  assert.match(html, /four newly added hotels may not yet appear as shared-map pins/i);
  assert.match(html, /each table row's direct hotel map link/i);
  assert.match(html, /https:\/\/www\.hyatt\.com\/grand-hyatt\/en-US\/sanrs-manchester-grand-hyatt-san-diego\/faqs/);
  assert.match(html, /https:\/\/www\.loewshotels\.com\/coronado-bay-resort\/faqs/);
  assert.match(html, /https:\/\/www\.ljshoreshotel\.com\/faqs\//);
  assert.equal((html.match(/<iframe/g) || []).length, 1);
  assert.doesNotMatch(html, /class="san-diego-schematic-map"|schematic-marker|Schematic map for clustering/i);
  assert.doesNotMatch(html, /maps\.googleapis\.com|key=YOUR_API_KEY|maps\/embed\/v1/i);
});

test("avoids affiliate, ordinal ranking, generic tradeoff blocks, and unsupported claims", () => {
  assert.doesNotMatch(html, /affiliate/i);
  assert.doesNotMatch(html, /#1|No\. 1|number one/i);
  assert.doesNotMatch(html, /safest hotel|quietest hotel|guaranteed family|personally verified/i);
  assert.doesNotMatch(html, /\b\d+\s*(?:minute|minutes|mile|miles)\b/i);
  assert.doesNotMatch(html, /human-review-gated|Evidence status|researched candidates|Research-based and source-dated/i);
  assert.doesNotMatch(html, /<h4>Tradeoffs to check<\/h4>/i);
  assert.doesNotMatch(html, /<dt>Planning band<\/dt>/i);
  assert.doesNotMatch(html, /<th>Fees\/parking signal<\/th>/i);
  assert.doesNotMatch(html, /book now|reserve now|get deal|check availability/i);
  assert.match(html, /Pick the closest trip style/);
  assert.doesNotMatch(html, /universal winner|Release boundary|human-review question/i);
});

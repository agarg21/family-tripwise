# Age-Specific Family Travel Demand

Date: July 3, 2026

Database: US

Source notes:

- Semrush MCP/API access was available, but the account did not have enough API units to run `phrase_these`, `phrase_fullsearch`, or `phrase_organic`. More units are required at https://www.semrush.com/mcp-access.
- Because the user requested a Chrome fallback, the data below was collected from the logged-in Semrush web UI using Keyword Overview Bulk Analysis for the exact 50-keyword validation set, plus Keyword Overview idea tables for seed expansion.
- Additional Chrome fallback batches tested middle age bands and numeric ages in the `things to do in {destination} with {age}` pattern: baby/babies, preschoolers, little kids, young kids, tweens, older kids, school-age kids, elementary-age kids, middle schoolers, preteens, and ages 1-13.
- `0` means Semrush returned zero volume in Bulk Analysis. `n/a` means Semrush had no existing metrics or showed an update/no-data prompt; it is not counted as zero.
- Trend charts were visible as a UI column but were not text-extractable in the Chrome fallback, so `trend` is marked `not extractable`.
- Human review is still required before publishing age-specific destination claims, hotel recommendations, safety notes, transit/stroller advice, or area recommendations.

## Executive Summary

Age-specific demand is real, but it is uneven. Teen-specific activity demand is stronger than toddler-specific demand across the current top five destination clusters. The strongest standalone opportunities are activity-led teen pages for Chicago, Las Vegas, and San Diego, plus a toddler page for San Diego.

Compared with the broader `things to do in {destination} with kids` pages, age-specific volume is much smaller. Teen activity demand is usually the meaningful slice of the broader kids market, while toddler activity demand is a smaller slice except in San Diego. This means the main kids activities page should remain the canonical hub in every city, with toddler/teen pages used selectively where age-specific volume is large enough to justify a standalone URL.

Searchers use activity phrasing more than broad destination phrasing. Across the exact validation set, `things to do in {city} with toddlers/teens` totaled 2,660 known monthly searches, while `{city} with toddlers/teens` totaled 950. The expansion pass reinforced this: alternate word order such as `things to do with teens in Las Vegas` and `things to do with teens in San Antonio` often had higher volume than the exact `things to do in {city} with teens` phrasing.

Recommended implementation:

- Build dedicated age-specific activity pages where a single age/activity query is strong or where seed expansion shows a clear cluster.
- Use sections within the main `things to do in {destination} with kids` page when volume is modest but intent is real.
- Use filters only when demand is low, zero, or unavailable.

## Direct Answers

1. Do toddler-specific or teen-specific destination queries have meaningful volume?

Yes, especially teen-specific activity queries. Meaningful standalone demand appears for Chicago teens, Las Vegas teens, San Diego teens, and San Diego toddlers. San Antonio teens also looks promising after expansion, even though exact validation volume is lower.

2. Which cities show enough demand for dedicated toddler or teen pages?

Dedicated now: San Diego toddlers, San Diego teens, Chicago teens, Las Vegas teens, San Antonio teens.

Consider after the core kids page exists: Chicago toddlers, San Antonio toddlers, Las Vegas toddlers.

Keep as sections or filters for now: New York City toddlers and New York City teens.

3. Are people searching more for `with toddlers/teens` or `things to do with toddlers/teens`?

They search more for activity phrasing. Exact-batch known volume:

| Query family | Toddler volume | Teen volume | Total |
|---|---:|---:|---:|
| `{city} with {age}` | 250 | 700 | 950 |
| `things to do in {city} with {age}` | 570 | 2,090 | 2,660 |

4. Do age-specific queries look like standalone SEO pages, sections within activities pages, or filters only?

The best opportunities are standalone activity pages, not broad age hubs. A page titled around `things to do in {destination} with teens` or `things to do in {destination} with toddlers` matches demand better than a generic `{destination} with teens` page. Lower-volume cities should start with age sections and filters on the core activities page.

5. Which 5-10 pages should we build next?

| Priority | Page | Suggested URL slug | Rationale |
|---:|---|---|---|
| 1 | Things to do in Chicago with teens | `/things-to-do/chicago-with-teens` | 720 exact volume; 320 for `Chicago with teens`; strong expansion variants |
| 2 | Things to do in Las Vegas with teens | `/things-to-do/las-vegas-with-teens` | 590 exact volume; 720 expansion for alternate word order |
| 3 | Things to do in San Diego with teens | `/things-to-do/san-diego-with-teens` | 590 exact volume; low KD 17 |
| 4 | Things to do in San Diego with toddlers | `/things-to-do/san-diego-with-toddlers` | 260 exact activity volume plus 260 `San Diego toddler activities` |
| 5 | Things to do in San Antonio with teens | `/things-to-do/san-antonio-with-teens` | 140 exact, but 390 expansion for alternate word order |
| 6 | Things to do in Chicago with toddlers | `/things-to-do/chicago-with-toddlers` | 170 exact activity volume plus 70 toddler activities; can start as section if production capacity is tight |
| 7 | Things to do in San Antonio with toddlers | `/things-to-do/san-antonio-with-toddlers` | 90 exact, 110 alternate word order; section first unless cluster depth is confirmed |
| 8 | Things to do in Las Vegas with toddlers | `/things-to-do/las-vegas-with-toddlers` | 40 exact, 70 alternate word order; use as section/filter first unless bundled into a broader toddler guide |

## City-by-City Toddler vs Teen Table

Known volume totals include only numeric values from the exact 50-keyword validation batch. Rows with `n/a` volume are excluded from totals.

| Destination | Toddler exact-batch volume | Teen exact-batch volume | Stronger age | Strongest exact keyword | Expansion signal | Recommendation |
|---|---:|---:|---|---|---|---|
| Las Vegas | 110 | 750 | Teen | `things to do in Las Vegas with teens` - 590 | `things to do with teens in las vegas` - 720; toddler alternate - 70 | Dedicated teen page; toddler section/filter |
| New York City | 20 | 140 | Teen, but low | `New York City with teens` - 90 | teen alternate - 20; toddler alternates mostly 0-10 | Sections/filters only |
| San Diego | 670 | 740 | Both | teen activity - 590; toddler activity - 260; toddler activities - 260 | toddler alternate - 140; teen alternate - 110 | Dedicated toddler and teen pages |
| Chicago | 290 | 1,080 | Teen | `things to do in Chicago with teens` - 720 | teen variants at 170 each; toddler variants at 70-110 | Dedicated teen page; toddler section or page |
| San Antonio | 130 | 210 | Teen | `things to do in San Antonio with teens` - 140 | `things to do with teens in san antonio` - 390; toddler alternate - 110 | Dedicated teen page; toddler section |

## Kids vs Toddler vs Teen Activity Demand

This table compares the broader kids activity query from the prior Semrush opportunity research with the exact age-specific activity phrases validated in this run. New York City uses the normalized `things to do in nyc with kids` row from the prior export.

| Destination | `things to do ... with kids` volume | `... with toddlers` volume | Toddler share of kids | `... with teens` volume | Teen share of kids | Takeaway |
|---|---:|---:|---:|---:|---:|---|
| Las Vegas | 3,600 | 40 | 1.1% | 590 | 16.4% | Teen page is a real secondary page; toddler should start as a section/filter. |
| New York City | 3,600 | 10 | 0.3% | 50 | 1.4% | Age-specific demand is tiny relative to the kids page. Keep toddler/teen as filters or subsections. |
| San Diego | 4,400 | 260 | 5.9% | 590 | 13.4% | Both toddler and teen are meaningful sub-intents; San Diego supports standalone age pages. |
| Chicago | 5,400 | 170 | 3.1% | 720 | 13.3% | Teen demand is strong enough for a standalone page; toddler is a secondary section or test page. |
| San Antonio | 5,400 | 90 | 1.7% | 140 | 2.6% | Exact age-specific phrases are small, but teen expansion terms make a teen page worth testing. |

The broader kids pages are 6x to 360x larger than the exact age-specific activity phrases. The practical read: build the core `things to do in {destination} with kids` page first for every city, then add teen/toddler pages only where they can capture a distinct search intent and product experience.

## Other Age Bands and Numeric Ages

Follow-up validation tested whether there is a meaningful search category between toddlers and teens. The short answer: not really, at least not as standalone SEO pages in these five destination clusters.

The only non-toddler/non-teen terms with visible volume were `baby`, `a baby`, `tweens`, `young kids`, `older kids`, and one `1 year old` phrase. Volumes were small compared with the broader kids pages and also small compared with the strongest teen/toddler phrases.

| Age phrase pattern | Visible volume across five cities | Strongest city examples | SEO recommendation |
|---|---:|---|---|
| `with a baby` | 110 | San Diego 50; Las Vegas 20; Chicago 20; San Antonio 20 | Use as baby-friendly subsection/filter, not standalone page |
| `with baby` | 80 | San Diego 40; San Antonio 20; Chicago 10; Las Vegas 10 | Same as above; singular `baby` beats plural `babies` |
| `with tweens` | 50 | Chicago 20; San Diego 20; Las Vegas 10 | Use as an older-kids/teen filter or section |
| `with young kids` | 20 | Chicago 10; San Diego 10 | Product filter only |
| `with older kids` | 10 | San Diego 10 | Product filter only |
| `with 1 year old` | 10 | San Diego 10 | Product filter only |
| `with preschoolers` | 0 | None | Do not target as page slug |
| `with little kids` | 0 | None | Do not target as page slug |
| `with school age kids` | 0 | None | Do not target as page slug |
| `with elementary age kids` | 0 | None | Do not target as page slug |
| `with middle schoolers` / `preteens` / `pre-teens` | 0 or n/a | None | Use `tweens` or `teens` language instead |
| Numeric ages 2-13 | 0 or n/a | None | Avoid exact-age SEO pages |

Product taxonomy implication:

- SEO taxonomy should stay simple: `kids`, `toddlers`, `teens`.
- Product filters can be more granular: baby, toddler, preschool, elementary, tween, teen.
- Page copy can mention granular ages where helpful, but URL slugs should avoid exact ages unless future validation finds a specific destination/attraction query with clear volume.
- For San Diego, baby-friendly demand is the only middle/younger-adjacent signal worth a visible subsection on the toddler page.

## Recommendation by City and Age

| Destination | Toddler recommendation | Teen recommendation | Notes |
|---|---|---|---|
| Las Vegas | Section/filter first | Dedicated page | Teen demand is materially stronger and activity-led. Toddler demand exists but is modest. |
| New York City | Filter only | Section/filter | Current top-five set shows low age-specific volume for NYC; prioritize the core kids activity/stay pages first. |
| San Diego | Dedicated page | Dedicated page | Best balanced age-specific cluster. Toddler and teen demand are both large enough to support pages. |
| Chicago | Section or test page | Dedicated page | Teen demand is the strongest in the sample. Toddler volume is real but less decisive. |
| San Antonio | Section first | Dedicated page | Exact teen volume is moderate, but expansion shows stronger alternate phrasing. |

## Keyword Validation Table

| Destination | Age | Keyword | Volume | CPC | Competitive density | Results | Intent | KD | Trend |
|---|---|---|---:|---:|---:|---:|---|---:|---|
| Las Vegas | Toddler | Las Vegas with toddlers | 40 | 0.00 | 0.00 | 126 | Informational | 12 | not extractable |
| Las Vegas | Teen | Las Vegas with teens | 110 | 0.64 | 1.00 | 127 | Informational | 14 | not extractable |
| Las Vegas | Toddler | things to do in Las Vegas with toddlers | 40 | 0.00 | 0.00 | 152 | Informational | 4 | not extractable |
| Las Vegas | Teen | things to do in Las Vegas with teens | 590 | 0.58 | 1.00 | 115 | Informational | 21 | not extractable |
| Las Vegas | Toddler | toddler friendly things to do in Las Vegas | 0 | 0.00 | 0.00 | n/a | n/a | n/a | not extractable |
| Las Vegas | Teen | teen friendly things to do in Las Vegas | 0 | 0.00 | 0.00 | n/a | n/a | n/a | not extractable |
| Las Vegas | Toddler | Las Vegas toddler activities | 30 | 0.00 | 0.00 | n/a | n/a | n/a | not extractable |
| Las Vegas | Teen | Las Vegas teen activities | 40 | 0.00 | 0.00 | 136 | Commercial | 17 | not extractable |
| Las Vegas | Toddler | best things to do in Las Vegas with toddlers | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| Las Vegas | Teen | best things to do in Las Vegas with teens | 10 | 0.55 | 1.00 | n/a | n/a | n/a | not extractable |
| New York City | Toddler | New York City with toddlers | 10 | 0.00 | 0.00 | n/a | n/a | n/a | not extractable |
| New York City | Teen | New York City with teens | 90 | 0.48 | 0.35 | 161 | Informational | 11 | not extractable |
| New York City | Toddler | things to do in New York City with toddlers | 10 | 0.00 | 0.00 | n/a | n/a | n/a | not extractable |
| New York City | Teen | things to do in New York City with teens | 50 | 0.64 | 1.00 | 124 | Informational | 4 | not extractable |
| New York City | Toddler | toddler friendly things to do in New York City | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| New York City | Teen | teen friendly things to do in New York City | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| New York City | Toddler | New York City toddler activities | 0 | 0.00 | 0.00 | n/a | n/a | n/a | not extractable |
| New York City | Teen | New York City teen activities | 0 | 0.00 | 0.00 | n/a | n/a | n/a | not extractable |
| New York City | Toddler | best things to do in New York City with toddlers | 0 | 0.00 | 0.00 | n/a | n/a | n/a | not extractable |
| New York City | Teen | best things to do in New York City with teens | 0 | 0.00 | 0.00 | n/a | n/a | n/a | not extractable |
| San Diego | Toddler | San Diego with toddlers | 140 | 0.00 | 0.00 | 130 | Commercial | 9 | not extractable |
| San Diego | Teen | San Diego with teens | 110 | 0.48 | 0.45 | 128 | Informational | 14 | not extractable |
| San Diego | Toddler | things to do in San Diego with toddlers | 260 | 0.00 | 0.00 | 10.2M | Informational, Commercial | 17 | not extractable |
| San Diego | Teen | things to do in San Diego with teens | 590 | 0.24 | 0.97 | 116 | Informational | 17 | not extractable |
| San Diego | Toddler | toddler friendly things to do in San Diego | 0 | 0.00 | 0.00 | n/a | n/a | n/a | not extractable |
| San Diego | Teen | teen friendly things to do in San Diego | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| San Diego | Toddler | San Diego toddler activities | 260 | 0.00 | 0.00 | 157 | Informational | 11 | not extractable |
| San Diego | Teen | San Diego teen activities | 20 | 0.00 | 0.00 | n/a | n/a | n/a | not extractable |
| San Diego | Toddler | best things to do in San Diego with toddlers | 10 | 0.00 | 0.00 | n/a | n/a | n/a | not extractable |
| San Diego | Teen | best things to do in San Diego with teens | 20 | 0.26 | 0.91 | n/a | n/a | n/a | not extractable |
| Chicago | Toddler | Chicago with toddlers | 50 | 0.00 | 0.00 | 131 | Informational | 21 | not extractable |
| Chicago | Teen | Chicago with teens | 320 | 0.24 | 0.28 | 120 | Informational | 12 | not extractable |
| Chicago | Toddler | things to do in Chicago with toddlers | 170 | 0.00 | 0.00 | 19.6M | Informational | 14 | not extractable |
| Chicago | Teen | things to do in Chicago with teens | 720 | 0.35 | 1.00 | 10.7K | Informational | 24 | not extractable |
| Chicago | Toddler | toddler friendly things to do in Chicago | 0 | 0.00 | 0.00 | n/a | n/a | n/a | not extractable |
| Chicago | Teen | teen friendly things to do in Chicago | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| Chicago | Toddler | Chicago toddler activities | 70 | 0.00 | 0.00 | 151 | Informational | 7 | not extractable |
| Chicago | Teen | Chicago teen activities | 10 | 0.00 | 0.00 | n/a | n/a | n/a | not extractable |
| Chicago | Toddler | best things to do in Chicago with toddlers | 0 | 0.00 | 0.00 | n/a | n/a | n/a | not extractable |
| Chicago | Teen | best things to do in Chicago with teens | 30 | 0.34 | 1.00 | n/a | n/a | n/a | not extractable |
| San Antonio | Toddler | San Antonio with toddlers | 10 | 0.00 | 0.00 | n/a | n/a | n/a | not extractable |
| San Antonio | Teen | San Antonio with teens | 70 | 0.27 | 0.06 | 127 | Informational | 10 | not extractable |
| San Antonio | Toddler | things to do in San Antonio with toddlers | 90 | 0.00 | 0.00 | 6.2M | Commercial | 11 | not extractable |
| San Antonio | Teen | things to do in San Antonio with teens | 140 | 0.37 | 0.95 | 127 | Commercial | 22 | not extractable |
| San Antonio | Toddler | toddler friendly things to do in San Antonio | 0 | 0.00 | 0.00 | n/a | n/a | n/a | not extractable |
| San Antonio | Teen | teen friendly things to do in San Antonio | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| San Antonio | Toddler | San Antonio toddler activities | 30 | 0.00 | 0.00 | n/a | n/a | n/a | not extractable |
| San Antonio | Teen | San Antonio teen activities | 0 | 0.00 | 0.00 | n/a | n/a | n/a | not extractable |
| San Antonio | Toddler | best things to do in San Antonio with toddlers | 0 | 0.00 | 0.00 | n/a | n/a | n/a | not extractable |
| San Antonio | Teen | best things to do in San Antonio with teens | n/a | n/a | n/a | n/a | n/a | n/a | n/a |

## Seed Expansion Highlights

These are not added to the exact-batch totals above. They show useful phrase variants from Semrush Keyword Overview idea tables.

| Seed | Notable expansion | Volume | KD | Note |
|---|---|---:|---:|---|
| Las Vegas with toddlers | things to do with toddlers in las vegas | 70 | 16 | Alternate word order beats exact activity phrase |
| Las Vegas with teens | things to do with teens in las vegas | 720 | 18 | Stronger than exact `things to do in Las Vegas with teens` |
| Las Vegas with teens | what to do in las vegas with teens | 110 | 11 | Supports FAQ/section targeting |
| New York City with toddlers | things to do with toddlers in new york city | 10 | n/a | Low volume |
| New York City with teens | things to do with teens in new york city | 20 | n/a | Low volume |
| San Diego with toddlers | things to do with toddlers in san diego | 140 | 16 | Supports toddler page |
| San Diego with toddlers | san diego zoo with toddlers | 40 | 16 | Attraction-specific toddler section |
| San Diego with teens | things to do with teens in san diego | 110 | 15 | Supports teen page |
| Chicago with toddlers | things to do with toddlers chicago | 110 | 14 | Supports toddler section/page |
| Chicago with teens | fun things to do in chicago with teens | 170 | 16 | Supports richer teen page variants |
| Chicago with teens | things to do with teens in chicago | 170 | 20 | Alternate phrasing |
| San Antonio with toddlers | things to do with toddlers in san antonio | 110 | 6 | Stronger than exact `things to do in San Antonio with toddlers` |
| San Antonio with teens | things to do with teens in san antonio | 390 | 21 | Stronger than exact `things to do in San Antonio with teens` |

## Missing and Zero-Volume Notes

- The `toddler friendly things to do in {city}` and `teen friendly things to do in {city}` patterns were mostly zero or unavailable. Use these words in filters or body copy, not primary slugs.
- `best things to do in {city} with toddlers/teens` usually underperformed the simpler `things to do` forms. Do not lead with `best` in URLs for age-specific pages.
- New York City age-specific volume is much lower than expected in this exact set. The core `things to do in New York City with kids`, `where to stay`, hotel, and itinerary pages should come before toddler/teen standalone pages.
- `n/a` rows should be retested with API units before final prioritization. They should not be treated as zero-volume keywords.

## SERP Weakness Notes

The API `phrase_organic` report was not available because Semrush API units were exhausted, so this run did not export ranking domains or URLs. The notes below are proxy signals from the Semrush web UI only.

- Low KD values are common in this set. Top exact activity terms range from KD 4 to 24, which suggests age-specific pages are not especially difficult compared with broader family travel terms.
- Teen pages show especially attractive result-count proxies: `things to do in Las Vegas with teens` returned 115 results, `things to do in San Diego with teens` returned 116, and `things to do in San Antonio with teens` returned 127.
- Chicago teen demand is highest, but `things to do in Chicago with teens` has a larger result count proxy at 10.7K and KD 24. It is still a good page, but likely needs a stronger product angle than a basic listicle.
- Some toddler activity rows have very large result counts, such as San Diego, Chicago, and San Antonio. Treat those as broad-SERP indicators until `phrase_organic` can identify whether the ranking pages are truly toddler-specific or just generic activities pages.

## Product Implications

Age pages should not be thin prose articles. They should expose the same structured planning data as the core activities page, with age-specific defaults:

- Toddler defaults: stroller difficulty, nap proximity, restroom access, shade, short visit length, sensory intensity, and rainy-day backups.
- Teen defaults: independence level, photo/social appeal, food nearby, active/adventure options, transit independence, evening suitability, and parent/teen split options.
- Shared controls: age filter, weather backup toggle, map export, time needed, cost band, and itinerary fit.

The strongest SEO pages should be activity-led, while the product experience can still route users into the broader destination planner.

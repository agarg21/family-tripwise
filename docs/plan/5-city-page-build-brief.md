# Five-City Page Build Brief

Date: July 3, 2026

Purpose: implementation handoff for building the first Family Tripwise destination clusters in one coordinated push.

Data notes:

- Semrush API units were unavailable, so the latest validation used the logged-in Semrush web UI through the Codex Chrome fallback.
- Database: US.
- `New York City` should be the normalized destination name, but keyword targeting should include `NYC` variants because `things to do in nyc with kids` and `where to stay in nyc with kids` are stronger than the full-name variants.
- Visit estimates are directional month-6 organic session estimates for a new/early site. They are not search volume. They assume pages are published quickly, internally linked, useful enough to avoid thin-content issues, indexed, and iterated for one week after launch.

## Recommendation

Build the five current top destination clusters in one shot, going deep across the three product surfaces:

1. Things to do with kids
2. Where to stay with kids
3. Starter itinerary with kids

This should be a 15-core-page launch, plus 5 age-specific satellite pages where research supports them.

Why this makes sense:

- The `things to do` pages create the strongest traffic acquisition surface.
- The `where to stay` pages create higher commercial-intent and monetization surfaces, even where exact `where to stay` volume is lower than hotel-query volume.
- The `starter itinerary` pages are lower-volume, but they show the actual AI/product promise better than listicles.
- A deep 5-city launch gives the implementation team a reusable destination system instead of 50 shallow pages.

## Core Pages to Build

| Priority | Destination | Page type | Suggested URL | Primary keyword and volume | Secondary keyword signal | Month-6 visits estimate | Why build |
|---:|---|---|---|---:|---|---:|---|
| 1 | Chicago | Things to do | `/things-to-do/chicago-with-kids` | `things to do in Chicago with kids` - 5,400 | KD 26; informational | 250-650 | Highest-volume activity page in the five-city set. |
| 2 | San Antonio | Things to do | `/things-to-do/san-antonio-with-kids` | `things to do in San Antonio with kids` - 5,400 | KD 17; informational | 250-650 | Same top volume as Chicago with lower KD. |
| 3 | San Diego | Things to do | `/things-to-do/san-diego-with-kids` | `things to do in San Diego with kids` - 4,400 | KD 17; strong toddler/teen satellites | 220-550 | Best all-around cluster depth. |
| 4 | Las Vegas | Things to do | `/things-to-do/las-vegas-with-kids` | `things to do in Las Vegas with kids` - 3,600 | KD 20; strong teen and hotel intent | 180-480 | Strong family angle in a destination not always framed as family-first. |
| 5 | New York City | Things to do | `/things-to-do/new-york-city-with-kids` | `things to do in nyc with kids` - 3,600 | `things to do in New York with kids` - 1,900; full-name variant - 480 | 180-500 | Must target `NYC`, `New York`, and `New York City` copy variants. |
| 6 | Las Vegas | Where to stay | `/where-to-stay/las-vegas-with-kids` | `best family hotels in Las Vegas` - 880 | `where to stay in Las Vegas with kids` - 20 | 80-220 | Treat as area guide plus family hotel shortlist; hotel query is the demand. |
| 7 | San Diego | Where to stay | `/where-to-stay/san-diego-with-kids` | `best family hotels in San Diego` - 720 | `where to stay in San Diego with kids` - 320; `best area...` - 40 | 100-260 | Strongest blended stay cluster: area + hotels. |
| 8 | New York City | Where to stay | `/where-to-stay/new-york-city-with-kids` | `where to stay in nyc with kids` - 590 | `best family hotels in New York City` - 390; `best family hotels in nyc` - 90 | 80-240 | High-intent lodging decision page; target NYC wording in title/meta/body. |
| 9 | San Antonio | Where to stay | `/where-to-stay/san-antonio-with-kids` | `best family hotels in San Antonio` - 140 | exact `where to stay...` returned 0 | 20-80 | Build for commercial value and cluster completeness, not raw exact volume. |
| 10 | Chicago | Where to stay | `/where-to-stay/chicago-with-kids` | `where to stay in Chicago with kids` - 110 | `best family hotels in Chicago` - 90; `best area...` - 10 | 25-90 | Lower volume, but important for complete planning cluster. |
| 11 | San Diego | Starter itinerary | `/family-itinerary/san-diego-with-kids` | `San Diego itinerary with kids` - 90 | `San Diego family itinerary` - 30 | 20-80 | Best itinerary demand and strongest product demo city. |
| 12 | New York City | Starter itinerary | `/family-itinerary/new-york-city-with-kids` | `nyc itinerary with kids` - 90 | `nyc family itinerary` - 10; `New York City family itinerary` - 20 | 20-80 | Itinerary value is high because NYC choice overload is real. |
| 13 | Chicago | Starter itinerary | `/family-itinerary/chicago-with-kids` | `Chicago itinerary with kids` - 20 | `Chicago family itinerary` - 0 | 10-40 | Lower SEO volume, but completes the cluster and links from activities. |
| 14 | Las Vegas | Starter itinerary | `/family-itinerary/las-vegas-with-kids` | `Las Vegas itinerary with kids` - 10 | `Las Vegas family itinerary` - 10 | 5-35 | Useful for family feasibility and pacing, not a major SEO page. |
| 15 | San Antonio | Starter itinerary | `/family-itinerary/san-antonio-with-kids` | `San Antonio itinerary with kids` - 10 | `San Antonio family itinerary` - 0 | 5-30 | Completes the San Antonio cluster and supports planner conversion. |

Expected month-6 visits from the 15 core pages:

| Scenario | Monthly organic visits |
|---|---:|
| Conservative | 900-1,800 |
| Base case | 2,000-4,200 |
| Strong execution + early links | 5,000-8,000 |

## Age-Specific Satellites

Build these alongside the core pages if implementation capacity allows. They should reuse the activity page system with age-specific defaults.

| Priority | Destination | Page | Suggested URL | Validated signal | Month-6 visits estimate | Build rationale |
|---:|---|---|---|---|---:|---|
| A1 | Chicago | Things to do with teens | `/things-to-do/chicago-with-teens` | exact 720; `Chicago with teens` 320 | 50-160 | Strongest teen-specific exact query. |
| A2 | Las Vegas | Things to do with teens | `/things-to-do/las-vegas-with-teens` | exact 590; alternate `things to do with teens in las vegas` 720 | 50-160 | Strong intent and likely distinct family concerns. |
| A3 | San Diego | Things to do with teens | `/things-to-do/san-diego-with-teens` | exact 590 | 40-140 | Complements San Diego’s broad activity and toddler demand. |
| A4 | San Diego | Things to do with toddlers | `/things-to-do/san-diego-with-toddlers` | exact 260; `San Diego toddler activities` 260 | 40-130 | Only toddler page with enough clear standalone demand. |
| A5 | San Antonio | Things to do with teens | `/things-to-do/san-antonio-with-teens` | exact 140; alternate `things to do with teens in san antonio` 390 | 25-90 | Worth testing because alternate phrase is stronger than exact phrase. |

Do not build standalone pages yet for:

- New York City toddlers
- New York City teens
- Las Vegas toddlers
- Chicago toddlers
- San Antonio toddlers
- Baby, preschool, elementary, tween, exact-age pages

Use those as filters or sections instead.

## Internal Linking Model

Every destination cluster should link like this:

| From | Link to | Anchor intent |
|---|---|---|
| Things to do page | Where to stay page | “best areas to stay with kids” |
| Things to do page | Starter itinerary | “turn these into a family itinerary” |
| Where to stay page | Things to do page | “activities near each area” |
| Where to stay page | Starter itinerary | “sample itinerary by area” |
| Starter itinerary | Things to do page | “swap activities by age” |
| Starter itinerary | Where to stay page | “choose the best base for this itinerary” |
| Age satellite | Main things-to-do page | “all kid-friendly activities” |
| Main things-to-do page | Age satellite | “best for toddlers/teens” |

## Page Requirements for Implementation

### Things to Do Pages

Must include:

- Activity list with age filters: baby, toddler, preschool, elementary, tween, teen.
- Fields: age fit, time needed, cost band, stroller difficulty, rainy-day suitability, nap-friendliness, booking need, neighborhood/area.
- Map-ready data structure.
- Internal links to stay and itinerary pages.
- Clear labels for estimated/model-derived scores.

### Where to Stay Pages

Must include:

- Area recommender, not just hotel copy.
- Family hotel shortlist section, even if final recommendations require human review.
- Decision factors: transit/stroller difficulty, noise, room size, pool, breakfast, kitchen/laundry, crib/rollaway, parking, walkability, attraction proximity.
- Human-review label for hotel/area recommendations.
- Internal links to things-to-do and itinerary pages.

### Starter Itinerary Pages

Must include:

- 2-day and 3-day starter options if possible.
- Nap-friendly pacing.
- Morning/afternoon/evening structure.
- Rainy-day swaps.
- Age-mode toggles or sections.
- Links back to activities and stay pages.
- Clear disclaimer that the itinerary is a starter plan and should be adjusted by season, weather, and child needs.

## Build Sequence for the Implementation Chat

1. Create shared destination/page data objects for the 5 cities.
2. Implement 3 reusable templates: activities, where-to-stay, starter itinerary.
3. Generate the 15 core pages from data.
4. Generate the 5 age satellite pages from the activities template.
5. Add cross-links and sitemap/navigation entries.
6. Add TODO markers for human-reviewed hotel/area/safety/transit claims.
7. Run local QA across desktop and mobile.

## One-Shot Build Scope

Recommended first implementation batch:

- 15 core pages
- 5 age-specific pages
- Shared data model
- Internal link graph
- Basic SEO metadata
- No CMS yet
- No separate hotel pages yet; include hotel shortlist inside where-to-stay pages

Separate `best family hotels` pages can come later for Las Vegas, San Diego, and New York City if the first stay pages start getting impressions.

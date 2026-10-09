# Family Hotel Research Engine

FT-RES-140 adds price schema6 for exact individual ages within published but non-complementary bands. Preserve the observed adult and child limits, unresolved uncovered-age policy, ISO-currency evidence and exact entered party. Never turn a missing teen band into adult classification or hide known bands as unknown. Prices join only the same category/party/stay; member plans remain excluded. First sample: `docs/research/puerto-vallarta-garza-family-budget-2026-10-09.json`. Sanctuary rates do not inherit Panoramic kitchen facts; taxes and cancellation conflict remain explicit. Shared evidence only, not public publication.

September30 FT-STD-001: a versioned hotel adapter and offline field-quality queue cover seven hotel comparisons without re-entering prices. Run `node tools/page-quality.mjs` before selecting hotel refresh work. Building/refresh procedure and remaining migrations: `docs/plan/page-quality-standard.md`. This is normalization coverage, not proof that all claims are mapped or current; collection never automatically renews observations.

State: operator policy; reusable all-page source-audit tooling implemented, price adapters incomplete

Last updated: 2026-09-30

FT-IMP-051 adds an offline exact-family CSV research/review export from the same validated capacity/price inputs, without another price database. Each public plan keeps its nightly equivalent, currency, exact party/stay, source dates, bed conditions, fees/deposit/cancellation and unknowns; unpriced categories remain rows, member rates/starting offers remain excluded. No automatic collection, date renewal or publication. Usage: `docs/plan/family-room-comparison-export.md`.

FT-RES-069 room-task CLI accepts multiple separate price-observation arrays after the category/as-of arguments, validates their combined identities and preserves independent dates/limits. Three current London samples/remaining gates: `docs/research/london-price-task-progress-2026-09-30.md`. Displayed five-person results do not remove requested-bed conditions; advance nonrefundable deposits are not added again as extra stay fees. Unresolved loading/zero-night placeholders cannot become zero-price or sold-out claims.

FT-RES-068 schema2 room-price observations add the exact priced configuration, provider individual-age versus age-band-count input, explicit public/membership plan eligibility and separate deposit context. Public comparisons exclude membership-required plans; unsupported/missing schema2 basis fails closed. Schema1 retains explicit not-recorded/not-established fields rather than newly inferred certainty. Second sample: `docs/research/london-marlin-price-observation-2026-09-30.md`; sofa-specific apartment/public VAT-inclusive rate cards do not rewrite the original conditional capacity record or imply final checkout/availability.

FT-RES-067 adds a separate optional booking-observation adapter: `tools/family-room-price.mjs` validates exact category/party/child-age classification/stay/source/rate-plan basis, derives nightly equivalents from displayed stay totals, and retains fee unknowns plus historical status after14days. Supply the price JSON as the fourth CLI argument to the room-screen pilot (after file and explicit as-of date); original category records are immutable. First maintained sample/task/limits: `docs/research/london-mitre-price-observation-2026-09-30.md`. This is a reusable manual-observation normalization step, not an automated dynamic-booking scraper, final quote or all-candidate price coverage.

FT-RES-058 adds an offline exact-configuration capacity-screen pilot: `node tools/family-room-task.mjs`, structured six-category London records and named older-child/infant controls in `docs/research/london-room-configurations-2026-09-30.json`. Base limits, infant-only extension, paid beds, requested versus named connections, stale-source checks and conflicts remain separate. It screens published rules, not booking acceptance or suitability. This initial schema deliberately retains unpriced GBP gaps and a detached offer lead; it cannot promote an unrelated starting offer into a room price. Comparable nightly observations, review/location evidence and publication gates remain required before a London page. Reuse the proven screening pattern for another pack rather than copy prose; reviewed price adapters are separate work.

September30 collection layer: `tools/evidence-audit.mjs` inventories every canonical page and deduplicates allowlisted source fetches. Cancun/Orlando observation records are read directly from shared data modules; legacy city price packs have explicitly dated aggregate watches. Hash changes, structured-price candidates and HTTP success are not renewed facts. Weekly due state and agent reconciliation: `docs/plan/weekly-evidence-audit.md`. Dynamic booking prices still need source-specific, permitted room/party/date/fee adapters or reviewed public booking checks; never promote a zero-priced structured placeholder into a hotel rate.

## Purpose

Family Tripwise should be able to publish high-quality family hotel pages without pretending that every hotel has been personally stayed in or professionally booked by us.

The research engine turns official hotel facts, current booking checks, review-signal summaries, Reddit/forum themes, local context, and contradiction tracking into a durable evidence record. The page may then make research-based recommendations with clear labels, while reserving human-review-only labels for claims that require direct experience or professional verification.

## Competitive Bar

The current San Diego hotel SERP includes expert/local pages such as La Jolla Mom's kid-friendly hotel guide, which combines local identity, travel-advisor credibility, hotel-specific notes, booking benefits, neighborhood framing, and a category-based shortlist. Family Tripwise should not try to beat that with generic prose.

Our angle should be more transparent and decision-tool-like:

- show the family decision criteria explicitly;
- separate official facts from review-signal themes and our interpretation;
- record conflicts and unknowns instead of smoothing them away;
- let parents filter by trip shape, child age, beach/pool needs, room setup, nap logistics, and budget friction;
- keep a source/freshness record that can be refreshed.

Source inspected: https://lajollamom.com/best-kid-friendly-hotels-san-diego/

## Evidence Classes

| Class | Can Support | Cannot Support |
|---|---|---|
| `OFFICIAL_PROPERTY_FACT` | Stated amenities, room types, fees, parking, kids club ages/hours, pool features, breakfast policy, pet policy, resort fee language, official location. | Whether the amenity is enjoyable, uncrowded, reliable, quiet, or worth the price. |
| `BOOKING_CHECK` | Date-specific price, taxes/fees shown, cancellation terms, occupancy rules, room bedding, breakfast inclusion, resort/destination fees, parking cost. | Future price promises or universal value judgments. |
| `REVIEW_SIGNAL` | Repeated themes from recent public reviews, with sample size, date range, sentiment, and conflicts. | Verbatim review reuse, private/user data, or claims that every guest will experience the same thing. |
| `COMMUNITY_SIGNAL` | Reddit/forum-style recurring advice, warnings, and family trip patterns, linked to source threads where allowed. | Personal verification, statistical certainty, or copied community content. |
| `EDITORIAL_INTERPRETATION` | A research-based fit label such as `best researched fit for bay-and-pool trips` when tied to evidence. | Safety assurances, medical/accessibility guarantees, or lived-experience claims. |
| `HUMAN_VERIFIED` | Firsthand stay notes, professional advisor notes, field checks, exact route/stroller practicality, safety-sensitive observations. | Claims outside what the reviewer actually checked. |

## Required Hotel Record

Each hotel in a shortlist needs:

- stable hotel name, brand/collection, official URL, booking URL, and destination area;
- last checked date and next recheck date;
- family use case: beach, bay, theme park, city base, resort stay-put, suite/kitchen, budget, luxury, multigenerational;
- room setup facts visible from official sources: max occupancy, suites, kitchen/kitchenette, connecting rooms, crib/rollaway policy, washer/laundry where relevant;
- family amenity facts: pool, splash pad/water slide, kids club, beach/bay access, breakfast, dining, parking, resort fee, shuttle/house car, laundry;
- review-signal summary with date range, source types, sample-size bucket, repeated positives, repeated negatives, and conflicts;
- booking friction: approximate nightly room band, total-fee transparency, parking/resort fees, occupancy quirks, cancellation friction, seasonal closure/renovation risk;
- confidence label: `high`, `medium`, `low`, or `unknown`;
- claim label: `official fact`, `research-based`, `review-signal-derived`, `model-derived`, or `human-verified`;
- unresolved unknowns and exact checks a parent should make before booking.

## Family Decision Criteria

Default criteria for San Diego hotel research:

| Criterion | Why Families Care | Evidence Needed |
|---|---|---|
| Room setup | Sleep separation, occupancy limits, kitchens, and optional crib/rollaway/connecting-room availability can make or break the stay. | Official room pages plus booking-time verification for the exact room. Crib, rollaway, and connecting-room details are captured when visible, not treated as mandatory for every hotel. |
| Pool and water play | Often more important than a long attraction list for younger kids. | Official amenity pages plus recent review-signal themes. |
| Beach or bay practicality | Families need to know whether the water/route works for their age mix. | Official location/access facts; human review for firm safety or stroller verdicts. |
| Breakfast and food | Included breakfast is helpful for some families but not universal, especially at resorts with credits or kitchens. | Booking terms, package details, room kitchen facts, dining hours. |
| Fees and parking | Resort fees, destination fees, and parking can change the real value. | Official fee pages plus a sourced approximate price band; final all-in booking totals are recommended when available but not mandatory for planning. |
| Nap/reset logistics | Midday return friction matters for toddlers and sensory-sensitive kids. | Map distance and transport context; human review for firm practicality. |
| Noise/crowds | Sleep and overstimulation risk are common hotel-review themes. | Review-signal summary; human review for firm room/block recommendations. |
| Kids club and activities | Ages, cost, reservations, and seasonality matter more than the existence of a club. | Official program pages checked near publication. |
| Renovation/closure risk | Pools, restaurants, and construction can invalidate old recommendations. | Official notices and recent review-signal scan. |

## Publication Rules

A standalone `best family hotels in {destination}` page may publish when:

- every listed hotel has the required record;
- every ranking/category label is tied to explicit criteria and evidence;
- review-signal summaries are paraphrased, not copied;
- recent family-relevant reviews or reviews from travelers with kids are checked where available, with visible date range, sample-size bucket, repeated themes, and conflicts;
- conflicts and unknowns are visible;
- no claim says or implies that Family Tripwise personally stayed there unless a human supplied that experience;
- safety, exact stroller practicality, room-selection, and family-suitability guarantees remain either `UNKNOWN`, `verify before booking`, or `human-verified`;
- the page includes a visible methodology and last-checked date;
- independent operator review passes.

## Refresh Rules

### Approximate Nightly Prices

September27 direct-user requirement: approximate nightly prices are a major part of hotel research and must remain visible in useful comparison tables, including shareable versions when evidence supports them. A planning range does not need to be a live quote or a final all-in total. Keep useful source-backed estimates with proportionate context; do not replace budget research with blanket "unknown" merely because a booking flow is unavailable.

- Record the source, observation date, travel dates or season, currency, pricing unit, room category/room count, adults and child ages when known, and tax/mandatory-fee inclusions or exclusions. Label missing fields as unknown; do not infer them.
- Prefer comparable family scenarios. A two-adult starting rate may be retained as clearly labeled orientation, but must not be relabeled as the price of a five-person room or used to rank unlike family totals.
- Distinguish observed rate samples, source-supported planning ranges and derived estimates. Do not imply a broad or typical seasonal range from one isolated rate; disclose the sample's limits. Never create numbers from intuition alone.
- Keep a concise approximate nightly range prominent where supported, with its date and basis adjacent or immediately accessible. Shared tables and downloads carry that context with the number, not in a detached disclaimer. Fee amounts remain separate when inclusion in the room rate is unknown, avoiding double counting.
- If existing observations are stale, identify them as historical planning orientation and prioritize refresh. If no defensible range exists, keep the field visibly unavailable and queue bounded price research; do not fabricate a range or present an unresolved gap as finished pricing research.
- Cancun's missing approximate nightly bands are the next price-research priority for its existing six-resort comparison. Use declared room/party/date assumptions and permitted public sources; failure to obtain live booking totals alone is not a stop rule. This instruction does not itself supply prices or authorize paid API calls, bookings or account changes.

The refresh intervals below still apply; a newly checked fee or policy does not renew the room-price observation date.

- Recheck official hotel facts every 30 days for live hotel pages.
- Recheck approximate nightly room bands and visible fee examples every 14 days while a page is under active observation or monetization testing.
- Re-scan review/community signals every 60 days, or sooner after a major renovation, closure, rebrand, or SERP shift.
- Expire or downgrade any hotel record with stale official facts, unresolved contradiction, or missing fee/room evidence.

## Evidence-Pack Implementation Rules

- Declare one reproducible reference planning scenario where useful: check date, rough season/date window, party size, child ages, room count, and source type.
- A full booking flow is not mandatory for planning. When exact booking results are blocked or dynamic, record a sourced approximate nightly room band instead of manufacturing a total. It cannot support a final all-in total, availability, or cancellation claim.
- Crib, rollaway, connecting-room, laundry, microwave, mini-fridge, and kitchen details should be captured when visible from official sources. Missing optional details should become a `verify before booking` note, not an automatic blocker.
- For review signals, record source type, visible date range, approximate inspected sample, repeated themes, and conflicts. Never copy review prose or treat a platform-generated summary as independent verification.
- Keep community/forum evidence in a separate class from verified-stay review signals. One thread may identify a question, but cannot establish a recurring condition.
- Do not infer property quality from an aggregate score. Prefer criteria-specific, conflicting themes and the exact parent check they trigger.
- Store no reviewer identifiers, complete raw-review exports, user data, private booking details, source-owned photos, or copied source text.
- A candidate pack is not a ranking. A `best`, `quietest`, `safest`, route/stroller, room-selection, or firm family-fit label needs evidence that specifically supports it and any required human review.

## First Candidate

San Diego is the first candidate because GSC and Semrush both show lodging intent around the existing San Diego stay page, and Semrush currently reports low-to-moderate difficulty for family hotel terms.

First pack: `docs/research/san-diego-family-hotel-evidence-pack.md`. It covers three existing candidate properties and records why a standalone indexable hotel page is not yet release-ready.

The future public page direction is captured in `docs/plan/san-diego-family-hotel-page-concept.md`: clean, low-clutter, category-led, evidence-labeled, and built around parent decision criteria rather than a generic ranked list.

Expanded candidate brief: `docs/research/san-diego-family-hotel-expanded-candidate-brief.md`. It widens the next evidence pass to eight primary candidates, adds a price-band standard, and treats crib/rollaway/connecting-room details as useful optional evidence rather than mandatory fields for every hotel.

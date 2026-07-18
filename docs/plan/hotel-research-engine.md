# Family Hotel Research Engine

State: planning and operator policy

Last updated: 2026-07-18

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
- room setup facts: max occupancy, suites, kitchen/kitchenette, connecting rooms, crib/rollaway policy, washer/laundry where relevant;
- family amenity facts: pool, splash pad/water slide, kids club, beach/bay access, breakfast, dining, parking, resort fee, shuttle/house car, laundry;
- review-signal summary with date range, source types, sample-size bucket, repeated positives, repeated negatives, and conflicts;
- booking friction: total-fee transparency, parking/resort fees, occupancy quirks, cancellation friction, seasonal closure/renovation risk;
- confidence label: `high`, `medium`, `low`, or `unknown`;
- claim label: `official fact`, `research-based`, `review-signal-derived`, `model-derived`, or `human-verified`;
- unresolved unknowns and exact checks a parent should make before booking.

## Family Decision Criteria

Default criteria for San Diego hotel research:

| Criterion | Why Families Care | Evidence Needed |
|---|---|---|
| Room setup | Sleep separation, crib/rollaway, connecting rooms, and occupancy limits can make or break the stay. | Official room pages plus date-specific booking check. |
| Pool and water play | Often more important than a long attraction list for younger kids. | Official amenity pages plus recent review-signal themes. |
| Beach or bay practicality | Families need to know whether the water/route works for their age mix. | Official location/access facts; human review for firm safety or stroller verdicts. |
| Breakfast and food | Included breakfast is helpful for some families but not universal, especially at resorts with credits or kitchens. | Booking terms, package details, room kitchen facts, dining hours. |
| Fees and parking | Resort fees, destination fees, and parking can change the real value. | Date-specific booking check. |
| Nap/reset logistics | Midday return friction matters for toddlers and sensory-sensitive kids. | Map distance and transport context; human review for firm practicality. |
| Noise/crowds | Sleep and overstimulation risk are common hotel-review themes. | Review-signal summary; human review for firm room/block recommendations. |
| Kids club and activities | Ages, cost, reservations, and seasonality matter more than the existence of a club. | Official program pages checked near publication. |
| Renovation/closure risk | Pools, restaurants, and construction can invalidate old recommendations. | Official notices and recent review-signal scan. |

## Publication Rules

A standalone `best family hotels in {destination}` page may publish when:

- every listed hotel has the required record;
- every ranking/category label is tied to explicit criteria and evidence;
- review-signal summaries are paraphrased, not copied;
- conflicts and unknowns are visible;
- no claim says or implies that Family Tripwise personally stayed there unless a human supplied that experience;
- safety, exact stroller practicality, room-selection, and family-suitability guarantees remain either `UNKNOWN`, `verify before booking`, or `human-verified`;
- the page includes a visible methodology and last-checked date;
- independent operator review passes.

## Refresh Rules

- Recheck official hotel facts every 30 days for live hotel pages.
- Recheck booking-fee examples every 14 days while a page is under active observation or monetization testing.
- Re-scan review/community signals every 60 days, or sooner after a major renovation, closure, rebrand, or SERP shift.
- Expire or downgrade any hotel record with stale official facts, unresolved contradiction, or missing fee/room evidence.

## Evidence-Pack Implementation Rules

- Declare one reproducible reference booking scenario: check date, stay dates, party size, child ages, room count, and booking channel.
- A blocked or dynamic booking flow is a completed check only when the attempted fields and resulting `UNKNOWN` values are recorded. It cannot support a price, availability, or cancellation claim.
- For review signals, record source type, visible date range, approximate inspected sample, repeated themes, and conflicts. Never copy review prose or treat a platform-generated summary as independent verification.
- Keep community/forum evidence in a separate class from verified-stay review signals. One thread may identify a question, but cannot establish a recurring condition.
- Do not infer property quality from an aggregate score. Prefer criteria-specific, conflicting themes and the exact parent check they trigger.
- Store no reviewer identifiers, complete raw-review exports, user data, private booking details, source-owned photos, or copied source text.
- A candidate pack is not a ranking. A `best`, `quietest`, `safest`, route/stroller, room-selection, or firm family-fit label needs evidence that specifically supports it and any required human review.

## First Candidate

San Diego is the first candidate because GSC and Semrush both show lodging intent around the existing San Diego stay page, and Semrush currently reports low-to-moderate difficulty for family hotel terms.

First pack: `docs/research/san-diego-family-hotel-evidence-pack.md`. It covers three existing candidate properties and records why a standalone indexable hotel page is not yet release-ready.

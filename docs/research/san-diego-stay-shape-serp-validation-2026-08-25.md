# San Diego Stay-Shape SERP Validation

Reviewed: 2026-08-25

Action: `FT-RES-019`

Decision: `RETAIN_REVISE IMP-045`

Evidence level: current search-result and ranking-page research. This is not search-volume data, a protected GSC query export, user testing, or proof of ranking position.

## Decision Question

Does the Mission Bay-versus-LEGOLAND one-base/split-stay decision belong on the existing family-hotel page, the existing stay-area page, both through a handoff, or neither?

## Evidence Boundary

- Search-result collection used the US market on August 25, 2026. Result order was not retained as a ranking claim because search location, personalization, result modules, and time can change it.
- Official hotel and destination pages are first-party product or location evidence. Editorial hotel lists are ranking-page structure evidence. Reddit discussions are qualitative examples of family decisions, not demand or verified experience.
- The newest available public-safe GSC record is the August 24 authenticated API snapshot, finalized through August 22. It has no public aligned query cohort, no complete finalized day after the August 22 hotel-page release, and no post-release crawl. Its page averages are orientation only.

## Bounded Query Set

| ID and query | Observed URLs and result types | Observed pattern | SERP features | Overlap and information gain | Confidence |
|---|---|---|---|---|---|
| Q1 `split stay San Diego LEGOLAND family` | [Split-stay discussion](https://www.reddit.com/r/asksandiego/comments/1svy4g0/san_diego_hotel_help_costco_travel_splitting_stay/) (`community`); [LEGOLAND chooser](https://www.legoland.com/california/our-company/blog/legoland-hotel-selection/) and [LEGOLAND Hotel](https://www.legoland.com/california/places-to-stay/legoland-hotel/) (`official product`). | The community question is the clearest direct sequencing match; official results begin after the onsite-stay decision. | The collector exposed standard linked results and a Reddit result type, but no stable feature/module inventory. Other SERP features are `UNKNOWN`. | The explicit sequencing job exists in current discussion, but no recurring polished result type owns it. Results answer which LEGOLAND hotel more directly than whether changing bases is worthwhile. | Medium |
| Q2 `where to stay San Diego with kids LEGOLAND Mission Bay` | [San Diego family-hotel list](https://lajollamom.com/best-kid-friendly-hotels-san-diego/) (`editorial/advisor`); [LEGOLAND Hotel](https://www.legoland.com/california/places-to-stay/legoland-hotel/) (`official product`); [where-to-stay discussion](https://www.reddit.com/r/asksandiego/comments/1m881gk/where_to_stay_with_kids/) (`community`). | Results blend broad San Diego hotel discovery, park-adjacent product inventory, and direct community advice about one versus multiple bases. | The collector exposed standard linked results and a Reddit result type, but no stable feature/module inventory. Other SERP features are `UNKNOWN`. | Broad and park-nearby inventories overlap at the destination level, but each usually treats one side of the trip. The community result makes the cross-location tradeoff explicit. | Medium-high |
| Q3 `Mission Bay or Carlsbad family vacation LEGOLAND` | [Hotels near LEGOLAND](https://lajollamom.com/best-hotels-near-legoland-california/) (`editorial/advisor`); [where-to-stay discussion](https://www.reddit.com/r/asksandiego/comments/1m881gk/where_to_stay_with_kids/) and [split-stay discussion](https://www.reddit.com/r/asksandiego/comments/1svy4g0/san_diego_hotel_help_costco_travel_splitting_stay/) (`community`). | Area/property inventory and itinerary discussions appear together; community results carry the clearest location-sequencing language. | The collector exposed standard linked results and Reddit result types, but no stable feature/module inventory. Other SERP features are `UNKNOWN`. | This phrasing exposes an area/base decision first, followed by property selection. The existing area page can own broad location choice; a hotel list still needs a concise handoff when users compare named properties from both zones. | Medium |
| Q4 `best family hotels San Diego LEGOLAND` | [San Diego family-hotel list](https://lajollamom.com/best-kid-friendly-hotels-san-diego/), [hotels near LEGOLAND](https://lajollamom.com/best-hotels-near-legoland-california/), and [San Diego family resorts](https://sandiegofamilytravel.com/best-resorts-in-san-diego-for-families/) (`editorial/advisor`); [LEGOLAND chooser](https://www.legoland.com/california/our-company/blog/legoland-hotel-selection/) (`official product`). | Broad San Diego and park-nearby list pages dominate the retained sample, with official product comparison alongside them. | The collector exposed standard linked results but no stable feature/module inventory. Other SERP features are `UNKNOWN`. | These pages support property discovery. They rarely turn Mission Bay and a park-adjacent hotel into one explicit keep-one-base-versus-split rule. This supports a compact rule inside the existing comparison, not a new URL. | High for page type; medium for the inferred gap |

No volume, exact rank, click-through rate, or universal SERP composition is inferred from this sample.

## Representative Ranking-Page Analysis

| Page | Observed for | Evidence class and freshness | What it answers well | What remains weak or outside its job |
|---|---|---|---|---|
| [LEGOLAND hotel chooser](https://www.legoland.com/california/our-company/blog/legoland-hotel-selection/) | Q1, Q4 | First-party hotel/product page; published June 26, 2026 and inspected August 25. | Compares the two onsite hotels, including themes, atmosphere, breakfast, early entry, pools, entertainment, and park proximity. | It begins after the decision to stay onsite. It does not compare a San Diego base with a short Carlsbad split or account for changing-room friction and total trip shape. |
| [LEGOLAND California Hotel](https://www.legoland.com/california/places-to-stay/legoland-hotel/) | Q1, Q2 | First-party hotel/product page; inspected August 25. | Supplies current onsite positioning, themed-room and park-adjacency facts. | It is product inventory, not neutral city-versus-park-base guidance. Displayed package prices are volatile and cannot support a stable all-in comparison. |
| [La Jolla Mom hotels near LEGOLAND](https://lajollamom.com/best-hotels-near-legoland-california/) | Q3, Q4 | Current editorial/advisor page; updated July 16, 2026 and inspected August 25. | Strong Carlsbad inventory, quick picks, property types, and advisor/local/annual-passholder context. | It primarily helps select a North County property. Its firsthand/local/advisor authority cannot be copied, and it does not make the full Mission Bay-versus-split decision for a mixed San Diego itinerary. |
| [La Jolla Mom kid-friendly San Diego hotels](https://lajollamom.com/best-kid-friendly-hotels-san-diego/) | Q2, Q4 | Current editorial/advisor page; inspected August 25. | Broad hotel discovery with location, resort, water-access, amenity, and attraction-proximity framing. | It is a large inventory page. The reader still has to translate broad San Diego and North County candidates into a one-base or split-stay sequence. Safety and water-suitability judgments also require authority Family Tripwise does not claim. |
| [San Diego Family Travel family resorts](https://sandiegofamilytravel.com/best-resorts-in-san-diego-for-families/) | Q4 | Editorial/firsthand-style list; current 2026 page inspected August 25. | Connects named resorts to pools, activities, and attractions, including a Carlsbad/LEGOLAND use case. | It remains property-led and does not expose a bounded transfer-versus-downtime decision across two bases. |
| [San Diego hotel split-stay discussion](https://www.reddit.com/r/asksandiego/comments/1svy4g0/san_diego_hotel_help_costco_travel_splitting_stay/) | Q1, Q3 | Qualitative community evidence; published in 2026 and inspected August 25. | Directly surfaces whether changing hotels is worth the disruption and when LEGOLAND could change that answer. | Anecdotal advice is not prevalence, verification, or a reusable rule by itself. It lacks normalized room, total-price, date, and trip-shape comparison. |
| [Where to stay with kids discussion](https://www.reddit.com/r/asksandiego/comments/1m881gk/where_to_stay_with_kids/) | Q2, Q3 | Qualitative community evidence; inspected August 25. | Makes the San Diego-proper-versus-multiple-stays decision explicit and connects Mission Bay to a broader city itinerary. | Advice is conversational, unstructured, and experience-specific. It cannot establish exact drive times, safety, or a general family-fit verdict. |

## What Family Tripwise Can And Cannot Win On

Family Tripwise cannot honestly reproduce La Jolla Mom's local, travel-advisor, annual-passholder, or booking-history authority, nor can it reproduce LEGOLAND's first-party inventory. It also should not turn isolated community opinions into a recommendation.

The structural opportunity is narrower and useful: join already maintained property evidence into one decision rule. A family should be able to see that a city/coastal-led itinerary can keep one San Diego base, while a short North County comparison becomes relevant only when LEGOLAND is a trip anchor and onsite downtime may outweigh the cost of moving rooms. Exact drive, traffic, availability, package, occupancy, parking, fee, and all-in-price outcomes remain date-specific checks.

## Ownership Decision

`IMP-045` is retained and revised:

- The existing family-hotel page owns the compact property-level rule because its 12-hotel comparison already includes Mission Bay and LEGOLAND options. Replace the low-information `Hotels covered / 12 options` snapshot field; do not add another layer.
- The existing stay-area page continues to own the broader five-area/base choice. The hotel rule should preserve or use the current area-first handoff rather than duplicate area guidance.
- Do not edit the area page in the eventual implementation unless a separate task finds a concrete handoff defect there.
- Do not create a split-stay, Mission Bay-versus-Carlsbad, or LEGOLAND variant URL. Current result overlap does not establish a distinct maintainable page job.
- Keep bay, bay-plus-Pacific-Beach, and direct ocean-beach roles descriptive. Do not claim water safety, calmness, exact travel time, stroller practicality, quietness, or firm family suitability.

## Next Falsification And Measurement

A later implementation may select revised `IMP-045` as one bounded existing-page change. It should compare the `FT-RES-018` task before and after, preserve the first two mobile viewports and current area-first link, and add no hotel, card, filter, URL, or prose layer. Search movement remains observation-only until a post-release crawl and sufficient aligned finalized query evidence exist.

Reject or remove the rule if an independent task reviewer can already complete the one-base/split decision without inference, the compact copy creates more scanning than it saves, current official evidence cannot support the distinction, or later behavior/user evidence shows that the rule confuses families.

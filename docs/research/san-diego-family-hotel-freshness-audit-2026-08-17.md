# San Diego Family-Hotel Freshness Audit

Audit date: 2026-08-17

Roadmap action: `FT-RES-016`

Target: https://familytripwise.com/where-to-stay/san-diego-family-hotels.html

## Decision

**Promote one bounded maintenance pass; do not rewrite or expand the page.** The 12-hotel set still covers distinct family trip shapes, and current official sources continue to support the core room, pool, kitchen/breakfast, and location facts. Two evidence-layer problems now need a later implementation transaction:

1. the original eight durable records were checked July 18 and reach their explicit August 17 official-fact refresh boundary; the four July 21 expansion records are only 27 days old and remain inside their 30-day official-fact boundary, while every visible price observation is beyond the 14-day rule; and
2. La Jolla Shores now describes a newly refreshed heated pool and children's wading pool, while the page still routes parents through generic pool/deck/construction uncertainty. Its own current official pages also conflict on parking: the accommodations FAQ says $45, while the accommodations body and resort-policy page say $55.

The next action should refresh the existing page from the same 12 records, not add hotels, URLs, prose, or a ranking claim. `FT-MAINT-003` / `IMP-043` is promoted but not selected in this transaction.

## Evidence Boundary

- **GSC:** recent reused authenticated API evidence collected 2026-08-16 and finalized through 2026-08-14. The indexed page has 661 impressions, zero clicks, and page-average position 70.25. Only one complete finalized calendar day follows its August 13 crawl. This audit makes no CTR, ranking, query-ownership, or rewrite conclusion.
- **Official property evidence:** direct hotel/brand pages opened on 2026-08-17. These support stated facts and current notices, not enjoyment, reliability, quiet, safety, or universal family fit.
- **Public price evidence:** public OTA/metasearch snippets and pages inspected on 2026-08-17. Most expose observations generated or crawled in late July rather than a reproducible same-day family booking. They are directional examples, not fresh quotes, availability promises, or final family totals.
- **Review evidence:** the July 21 review-signal synthesis was not re-performed because its 60-day boundary has not expired and no major review-driven defect was found. It remains qualitative and non-firsthand.

## Method

The official-source pass checked the family decision facts visible on the live page: room layout, kitchen or breakfast function, pool/water features, parking and mandatory fees when published, and renovations or closures. The price pass looked for public all-in examples but did not enter personal data, complete a booking, or infer a family-occupancy total from a two-adult example.

Price comparisons are intentionally conservative. Different dates, stay lengths, room types, occupancy, currencies, member rates, and fee treatment cannot be normalized into one honest market band. Every row is therefore `UNKNOWN for renewal`. A directional non-contradiction can still be noted, but it does not validate or renew the live range.

## Official-Fact Audit

| Hotel | Current official findings checked 2026-08-17 | Decision | Confidence / unresolved item |
|---|---|---|---|
| [Bahia Resort Hotel](https://www.bahiahotel.com/faqs) | The FAQ still says one vehicle is included and lists a $48 daily resort fee. The [Bay Family Suite](https://www.bahiahotel.com/rooms/bay-family-suite) still lists 675 square feet, kitchenette appliances, two bathrooms, and included self-parking. | Confirm core facts. | High. The official suite headline and body still conflict on whether the connecting bedroom is a double or queen; the live page already tells parents to verify exact bedding. |
| [San Diego Mission Bay Resort](https://www.missionbayresort.com/faq/) | Official [amenities](https://www.missionbayresort.com/resort-amenities/) continue to show a waterfront pool, shallow wading pool, beach access, seasonal activities, a $46 resort fee, $47 self-parking, limited $35 rollaways, and connecting rooms that are not guaranteed. | Confirm. | High for published facts; exact room/fire-code fit remains room-specific. |
| [Hyatt Regency Mission Bay](https://www.hyatt.com/hyatt-regency/en-US/sanis-hyatt-regency-mission-bay-spa-and-marina) | Hyatt continues to publish lagoon-style pools, three waterslides, a separate children's pool area, two-queen rooms, family suites and a $46 daily resort fee. The inspected first-party content does not expose a parking amount. | Confirm; retain parking check. | High for pool, room and resort-fee facts. Parking is `UNKNOWN` from current first-party evidence; a public OTA lists $50 self-parking, but that is not an official-property fact. |
| [Paradise Point Resort & Spa](https://www.paradisepoint.com/resort/beach-resort-amenities/) | The official amenities page still lists five heated pools, beach access, recreation, a $46 nightly amenities fee and $49 reserved doorstep parking. The inspected source does not establish the exact room setup used for a family scenario. | Confirm amenities, fee and parking; retain exact-room check. | High for published amenities, fee and parking. Exact room layout and current all-in total remain `UNKNOWN` for renewal. |
| [Catamaran Resort Hotel and Spa](https://www.catamaranresort.com/faqs) | The official FAQ lists a $46 resort fee, $47 self-parking, $50 valet, request-only cribs/rollaways and kitchenette equipment for [studios/suites](https://www.catamaranresort.com/rooms/rooms-overview). It also posts a private-event closure for August 16-18. | Confirm core facts; no durable closure edit. | High. The two-day buyout expires immediately after the audit and does not justify lasting page copy. Exact room/building remains the right check. |
| [Homewood Suites Downtown/Bayside](https://www.hilton.com/en/hotels/sanhahw-homewood-suites-san-diego-downtown-bayside/) | Hilton still lists all-suite rooms, kitchens, free hot breakfast, connecting rooms, cribs, an outdoor pool, no self-parking and $65 valet. It now labels the property recently renovated. | Confirm. | High. Exact suite separation and occupancy remain room-specific. |
| [LEGOLAND Hotel / Castle Hotel](https://www.legoland.com/california/hotels-packages/) | Current official pages continue to list separate kids' sleeping areas, daily hot breakfast, heated pools, nightly entertainment and Pack 'N Plays by request. Current [parking support](https://california-support.legoland.com/hc/en-us/articles/360001573591-Is-parking-included-with-my-stay-at-the-LEGOLAND-California-Hotel-or-Castle-Hotel) says parking is not generally included: $40 self-parking or $55 valet, with named passholder exceptions. | Confirm page's package/parking check. | High. Package and per-person offers cannot be compared with a plain room rate. |
| [Loews Coronado Bay Resort](https://www.loewshotels.com/coronado-bay-resort) | Current first-party [amenities](https://www.loewshotels.com/coronado-bay-resort/discover/services-amenities), [FAQ](https://www.loewshotels.com/coronado-bay-resort/faqs) and [shuttle](https://www.loewshotels.com/coronado-bay-resort/shuttle-service) pages publish three heated pools, a $42 nightly resort fee, $50 self-parking, $55 valet and no-reservation Coronado Village shuttle service; beach shuttle service is on demand. Published room pages show materially different bedding and occupancy. | Confirm pools, fee, parking and shuttle; retain exact-room check. | High for those published facts. Exact connection, family occupancy and total remain room/offer-specific; the amenities page still says $47 self-parking while the more specific current FAQ says $50, so use the FAQ value with attribution and preserve the conflict internally. |
| [La Jolla Shores Hotel](https://www.ljshoreshotel.com/accommodations/) | Official pages now say the heated outdoor pool is newly refreshed and includes a children's wading pool. The accommodations FAQ says $45 parking, but the accommodations body and [resort-policy page](https://www.ljshoreshotel.com/resort-policies/) say $55; both list a $50 resort fee. | **Changed / conflicted.** | High for refreshed pool and policy-page $55; low for a single parking amount because first-party pages disagree. Publish the conflict and use $55 as the policy-page value only with attribution. |
| [Hotel del Coronado](https://www.hoteldel.com/faq/) | The current FAQ supports five room neighborhoods, guaranteed connecting-room selection/request, complimentary cribs, select paid rollaways, heated pools, ages 4-12 Ocean Explorers, a $50 mandatory charge, and completed six-year restoration in June 2025. | Confirm. | High. Neighborhood-specific access, parking and cancellation still require the exact booking. |
| [The Dana on Mission Bay](https://thedana.com/san-diego-hotel/faq/) | The official FAQ still lists two heated pools, $35 parking, a $25 resort fee, free cribs, limited $10 rollaways, request-only connecting rooms, refrigerators/microwaves and no full kitchens. [Room pages](https://thedana.com/san-diego-accommodations/) still show standard occupancy four and many suites up to six. | Confirm. | High. The official page contains an expired 2025 SeaWorld-fireworks date in a separate FAQ answer, but the Family Tripwise page does not repeat it. |
| [Manchester Grand Hyatt San Diego](https://www.hyatt.com/grand-hyatt/en-US/sanrs-manchester-grand-hyatt-san-diego/faqs) | Hyatt still says Coastline is the only operating pool and the fourth-floor pool is due in December 2026; the [transformation page](https://www.hyatt.com/grand-hyatt/en-US/sanrs-manchester-grand-hyatt-san-diego/renovation) says the third-floor pool and guestrooms are refreshed. Room, connecting and suite facts remain supported. | Confirm current renovation language. | High. Final destination fee, parking and exact room connection remain booking checks. |

## Public Price Orientation

Scenario provenance is incomplete by design and prevents renewal. Most OTA results exposed one room for one night and two adults, with zero children, but often omitted the exact room, child ages, rate type, refundability, or whether the displayed result was collected live rather than indexed earlier. The Mission Bay Resort Google result used a five-night September 12-17 stay for two adults and zero children for one example; LEGOLAND exposed a per-person/package offer without a comparable family room total; Manchester did not expose a comparable USD total. The audit retrieved these public results on August 17, but most result pages identified an underlying late-July observation date.

| Hotel | Live planning range | Public observation visible during audit | Classification |
|---|---:|---|---|
| [Bahia](https://www.expedia.com/San-Diego-Hotels-Bahia-Resort-Hotel.h18241.Hotel-Information) | $340-$630+ | Expedia surfaced $300 including taxes/fees for two adults on Aug. 23, observed as of Jul. 24. | `UNKNOWN for renewal`; directionally below the band, but stale and not a family scenario. |
| [San Diego Mission Bay Resort](https://www.google.com/travel/hotels/entity/ChcI4cral46g7fQtGgsvZy8xdHNfNnh4dhAB/prices) | $375-$500+ | Google Hotels exposed materially different examples by stay/rate: about $250 nightly with fees for a five-night Sep. 12-17 stay for two adults and zero children, and $468 nightly with fees for an Expedia two-queen option whose full scenario was not exposed. | `UNKNOWN for renewal`; dynamic and incomparable, with only directional non-contradiction at the upper example. |
| [Hyatt Regency Mission Bay](https://www.expedia.com/San-Diego-Hotels-Hyatt-Regency-Mission-Bay-Spa-And-Marina.h858.Hotel-Information) | $270-$350+ | Public OTA examples surfaced $351 all-in for Aug. 16 and $304 all-in for Aug. 30, both for two adults; exact room and refundability were not exposed. | `UNKNOWN for renewal`; directionally close, but not a current family-occupancy quote. |
| [Paradise Point](https://www.expedia.com/San-Diego-Hotels-Paradise-Point-Resort-Spa.h3731.Hotel-Information) | $240-$360+ | Expedia surfaced $346 all-in for Aug. 23; [Trivago's future trend](https://www.trivago.com/en-US/oar/paradise-point-resort-spa-san-diego?search=100-66798) showed $466 for Sep. 13. Occupancy and room basis were incomplete. | `UNKNOWN for renewal`; the examples show a wider upper tail but cannot define a comparable family band. |
| [Catamaran](https://www.expedia.com/San-Diego-Hotels-Catamaran-Resort-And-Spa.h24669.Hotel-Information) | $395-$740+ | Expedia surfaced $356 all-in for Aug. 23; exact room, family occupancy and refundability were not exposed. | `UNKNOWN for renewal`; directionally below the visible floor, but stale and incomparable. |
| [Homewood Downtown/Bayside](https://www.expedia.com/San-Diego-Hotels-Homewood-Suites-By-Hilton-San-Diego-DowntownBayside.h13155016.Hotel-Information) | $265-$350+ | Expedia surfaced $256 all-in for Aug. 23; exact suite, family occupancy and refundability were not exposed. | `UNKNOWN for renewal`; directionally just below the band, but stale and incomparable. |
| [LEGOLAND Hotel / Castle Hotel](https://www.legoland.com/california/hotels-packages/) | Package-priced | Official pages show per-person/night starting offers rather than a family room total with a declared occupancy, room and inclusion basis. | `UNKNOWN for comparable room-total renewal`; retain the package-priced label and compare a full family package separately. |
| [Loews Coronado Bay](https://www.expedia.com/Coronado-Hotels-Loews-Coronado-Bay-Resort.h25840.Hotel-Information) | $235-$360+ | Expedia surfaced $360 all-in for Aug. 16; exact room, family occupancy and refundability were not exposed. | `UNKNOWN for renewal`; directionally at the upper bound, but stale and incomparable. |
| [La Jolla Shores](https://www.expedia.com/La-Jolla-Hotels-La-Jolla-Shores-Hotel.h25973.Hotel-Information) | $350-$550+ | Expedia surfaced $439 all-in for Aug. 26; exact room, family occupancy and refundability were not exposed. | `UNKNOWN for renewal`; directionally inside the band, but stale and incomparable. |
| [Hotel del Coronado](https://www.expedia.com/Coronado-Hotels-Hotel-Del-Coronado.h7496.Hotel-Information) | $600-$900+ | Expedia surfaced $619 all-in for Aug. 17; exact neighborhood, room, family occupancy and refundability were not exposed. | `UNKNOWN for renewal`; directionally inside the band, but stale and incomparable. |
| [The Dana](https://www.expedia.com/San-Diego-Hotels-The-Dana-On-Mission-Bay.h40953.Hotel-Information) | $250-$400+ | Expedia surfaced $292 all-in for Aug. 17; exact room, family occupancy and refundability were not exposed. | `UNKNOWN for renewal`; directionally inside the band, but stale and incomparable. |
| [Manchester Grand Hyatt](https://www.expedia.com/San-Diego-Hotels-Manchester-Grand-Hyatt-San-Diego.h12073.Hotel-Information) | $300-$450+ | Accessible current results used non-USD currency or excluded taxes/fees, so no honest same-basis comparison was available. | `UNKNOWN for renewal`; keep only until a bounded refresh obtains a comparable USD public example. |

## What Changes Next

`FT-MAINT-003` should be one existing-page factual/evidence refresh, not a performance rewrite:

- keep the 12 hotels, title, H1, URL, canonical, indexability, sitemap entry, map and trip-style roles;
- refresh the original eight durable records in `docs/research/san-diego-family-hotel-evidence-pack.md` and the four expansion records in `docs/research/san-diego-activity-hotel-expansion-review.md` so the maintained evidence layer and page cannot silently disagree;
- refresh all official checked dates and the single visible price-observation date;
- use one declared public scenario where available, with room/occupancy/date/source limitations visible in the evidence record;
- update La Jolla Shores from unresolved construction language to the official refreshed-pool state while preserving the first-party $45/$55 parking conflict;
- keep Manchester's second-pool December 2026 completion notice and Catamaran's request-only room details current;
- do not stack another comparison layer or add hotel prose.

This maintenance can be selected during the active GSC observation window because it addresses factual and evidence freshness. Its result must not be interpreted as a ranking test until a later crawl and sufficient finalized query evidence exist.

## Source Register

All sources below were inspected on 2026-08-17 unless the price observation itself states an earlier collection date.

### Official property / brand sources

- [Bahia Resort Hotel FAQ](https://www.bahiahotel.com/faqs)
- [Bahia Bay Family Suite](https://www.bahiahotel.com/rooms/bay-family-suite)
- [San Diego Mission Bay Resort amenities](https://www.missionbayresort.com/resort-amenities/)
- [San Diego Mission Bay Resort FAQ](https://www.missionbayresort.com/faq/)
- [Hyatt Regency Mission Bay](https://www.hyatt.com/hyatt-regency/en-US/sanis-hyatt-regency-mission-bay-spa-and-marina)
- [Paradise Point amenities](https://www.paradisepoint.com/resort/beach-resort-amenities/)
- [Catamaran Resort FAQ](https://www.catamaranresort.com/faqs)
- [Catamaran rooms and suites](https://www.catamaranresort.com/rooms/rooms-overview)
- [Homewood Suites Downtown/Bayside](https://www.hilton.com/en/hotels/sanhahw-homewood-suites-san-diego-downtown-bayside/)
- [LEGOLAND California hotels and packages](https://www.legoland.com/california/hotels-packages/)
- [LEGOLAND Hotel](https://www.legoland.com/california/places-to-stay/legoland-hotel/)
- [LEGOLAND hotel parking support](https://california-support.legoland.com/hc/en-us/articles/360001573591-Is-parking-included-with-my-stay-at-the-LEGOLAND-California-Hotel-or-Castle-Hotel)
- [Loews Coronado Bay Resort](https://www.loewshotels.com/coronado-bay-resort)
- [Loews Coronado Bay services and amenities](https://www.loewshotels.com/coronado-bay-resort/discover/services-amenities)
- [Loews Coronado Bay FAQ](https://www.loewshotels.com/coronado-bay-resort/faqs)
- [Loews Coronado Bay shuttle service](https://www.loewshotels.com/coronado-bay-resort/shuttle-service)
- [La Jolla Shores accommodations and amenities](https://www.ljshoreshotel.com/accommodations/)
- [La Jolla Shores resort policies](https://www.ljshoreshotel.com/resort-policies/)
- [Hotel del Coronado FAQ](https://www.hoteldel.com/faq/)
- [Hotel del Coronado stay options](https://www.hoteldel.com/stay/)
- [The Dana FAQ](https://thedana.com/san-diego-hotel/faq/)
- [The Dana rooms and suites](https://thedana.com/san-diego-accommodations/)
- [Manchester Grand Hyatt FAQ](https://www.hyatt.com/grand-hyatt/en-US/sanrs-manchester-grand-hyatt-san-diego/faqs)
- [Manchester Grand Hyatt transformation status](https://www.hyatt.com/grand-hyatt/en-US/sanrs-manchester-grand-hyatt-san-diego/renovation)

### Public price-orientation sources

- [Bahia Expedia page](https://www.expedia.com/San-Diego-Hotels-Bahia-Resort-Hotel.h18241.Hotel-Information)
- [San Diego Mission Bay Resort Google Hotels page](https://www.google.com/travel/hotels/entity/ChcI4cral46g7fQtGgsvZy8xdHNfNnh4dhAB/prices)
- [Hyatt Regency Mission Bay Expedia page](https://www.expedia.com/San-Diego-Hotels-Hyatt-Regency-Mission-Bay-Spa-And-Marina.h858.Hotel-Information)
- [Paradise Point Expedia page](https://www.expedia.com/San-Diego-Hotels-Paradise-Point-Resort-Spa.h3731.Hotel-Information)
- [Paradise Point Trivago page](https://www.trivago.com/en-US/oar/paradise-point-resort-spa-san-diego?search=100-66798)
- [Catamaran Expedia page](https://www.expedia.com/San-Diego-Hotels-Catamaran-Resort-And-Spa.h24669.Hotel-Information)
- [Homewood Downtown/Bayside Expedia page](https://www.expedia.com/San-Diego-Hotels-Homewood-Suites-By-Hilton-San-Diego-DowntownBayside.h13155016.Hotel-Information)
- [Loews Coronado Bay Expedia page](https://www.expedia.com/Coronado-Hotels-Loews-Coronado-Bay-Resort.h25840.Hotel-Information)
- [La Jolla Shores Expedia page](https://www.expedia.com/La-Jolla-Hotels-La-Jolla-Shores-Hotel.h25973.Hotel-Information)
- [Hotel del Coronado Expedia page](https://www.expedia.com/Coronado-Hotels-Hotel-Del-Coronado.h7496.Hotel-Information)
- [The Dana Expedia page](https://www.expedia.com/San-Diego-Hotels-The-Dana-On-Mission-Bay.h40953.Hotel-Information)
- [Manchester Grand Hyatt Expedia page](https://www.expedia.com/San-Diego-Hotels-Manchester-Grand-Hyatt-San-Diego.h12073.Hotel-Information)

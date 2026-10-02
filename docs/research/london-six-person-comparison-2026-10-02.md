# Two Six-Person Apartment Budgets

FT-RES-079 under FT-RES-077; LRN-090. October2,2026 Eastern. Internal research only; no new city page or full publication qualification.

## Named Family Decision

Two adults with children4,8,12,15 need one apartment with separate bedrooms, kitchen and a realistic accommodation budget for November8-13,2026, five nights. Required outputs: two distinct property/category options, exact party/stay, approximate nightly and stay amounts, public-plan eligibility, sleeping conditions, tax/payment/cancellation basis and unknowns. This is proxy-reviewed research, not real-user testing or a booking.

Hypothesis rejected: the original retained six-category London corpus already supplies two usable six-person budget options. Five categories fail this party's published capacity constraints; Queen Street alone is insufficient. A second official property/category and separate price observation add a comparison without changing the old pack or borrowing a five-person sample.

## Dated Sources And Comparison

October2 OFFICIAL_PROPERTY_FACT: [Limehouse two-bedroom category](https://www.marlin.com/london-serviced-apartments/limehouse-serviced-apartments/rooms/two-bedroom-apartment/) explicitly gives base4, optional paid double-sofa6, two king bedrooms, kitchen and two bathrooms; second-bedroom twins are a request, not guarantee. Publication/effective date unknown. BOOKING_CHECK: its visible date/guest search, current age controls and two public-rate detail panels. Stable official URL retained; opaque session URLs, personal identities, third-party overlays and member-rate amounts not retained.

The engine labels adults13+ and children0-12. The actual task maps to3adults/3children; no individual ages submitted. Exact returned category is Apartment with2King size beds and1SofaBed, Sleeps6, not the unselected Family Apartment alternative. Size badge78-92m2 conflicts with60-70m2 description; unresolved and not used to rank space. Category/payment observations do not confirm child bedding allocation or booking acceptance.

Queen Street uses unchanged September30 capacity evidence and the separate October2 same-six-person sample from FT-RES-078. This new aggregate pack date does not renew Queen Street source facts. Both prices were observed October2 for identical actual party and dates; different property/rate naming means they are accommodation choices, not a claim of equivalent quality or matched discounts.

| Property and sofa-specific apartment | Public saver stay GBP | Approximate apartment/night GBP | Public flexible stay GBP | Approximate apartment/night GBP |
|---|---:|---:|---:|---:|
| Queen Street, two kings and one sofa | 2034.90 | 406.98 | 2261.00 | 452.20 |
| Limehouse, two kings and one sofa | 1543.50 | 308.70 | 1715.00 | 343.00 |

One apartment, five nights, actual2adults/children4/8/12/15; observedOctober2,GBP, displayed taxes/fees included. These spans compare two rate plans for one dated stay, not seasonal price ranges, future availability or complete trip costs. Savings/value/cheapest-in-London claims are not supported. Location, transit and midday-rest tradeoffs remain unresolved; lower displayed accommodation cost is not the whole family decision.

Limehouse saver details:1286.25+257.25VAT=1543.50; payment in full at booking, at least seven days in advance,100% cancellation/no modifications. Flexible:1429.17+285.83VAT=1715; card guarantee/payment on arrival; cancel by23:00 day before arrival, later one night including VAT. Both panels show check-in card authorisation GBP200midweek/500weekend for other London locations; exact hold for this Sunday-Friday stay unknown. Hold is not a stay fee. Meal costs/inclusion, optional services, sofa extras beyond returned category and final checkout unknown. No rate BookNow/Select/cart/hold/account/contact/payment; search-only navigation, cart0.

## Reusable Task And Boundaries

New two-record pack: `docs/research/london-six-person-comparison-2026-10-02.json`. New price sample: `docs/research/london-limehouse-six-person-price-observation-2026-10-02.json`. Existing schema/task/price/export tools reused without code changes.

```sh
node tools/family-room-comparison.mjs docs/research/london-six-person-comparison-2026-10-02.json \
  --prices docs/research/london-marlin-six-person-price-observation-2026-10-02.json docs/research/london-limehouse-six-person-price-observation-2026-10-02.json \
  --date 2026-10-02 --adults 2 --child-ages 4,8,12,15 \
  --arrival 2026-11-08 --departure 2026-11-13
```

Acceptance fixtures: pack/sample validators, conditional6-screening, public nightly arithmetic and CSV context, unchanged original record except its pack-local source key, wrongparty/date no quote, historical/future boundaries, currency/source/category mismatch rejection and input immutability. Full native QA, scope preservation and different independent read-only PASS gate docs-only push. Dynamic booking observations remain operator-attributed unless independently replayed.

Result: IMPLEMENT the second comparable accommodation budget gate. FT-RES-077 remains CANDIDATE: two-category task is not six complete maintained hotel records. Next eligible work is current review-signal/conflict evidence and named midday-rest/location comparison, then controlled US paired SERP overlap/material distinct job/no existing-page fit and maintainability/URL-scope approval. Alternatively deliver independent FT-RES-076 care eligibility/budget work; no repeated broad keyword report. No new London launch, public price/source refresh, observation-window change or Chicago-preview retry.

Confidence high in inspected capacity/age/payment source facts and task-bound arithmetic, medium in proxy usefulness, unknown booking/user/SEO outcome or comparative location value. Reusable lesson: an exact-family budget needs a second separately maintained property/category, not a second rate plan; price/payment tradeoffs must remain visible while location evidence is collected. Next falsification: changed capacity/age/fee terms, incompatible task inheriting a rate, resolved size conflict or competing same-task comparison removing information gain.

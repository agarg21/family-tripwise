# San Diego Lodging Cross-Page Task Review

Reviewed: 2026-08-27

Action: `FT-RES-020` / `SRR-041`

Review: Pascal (`01a04439-d812-7102-b6d7-74aff1248f4a`) cycle-two `PASS`; no P0-P3 remain.

Targets:

- https://familytripwise.com/where-to-stay/san-diego-with-kids.html
- https://familytripwise.com/where-to-stay/san-diego-family-hotels.html

Evidence level: `proxy-reviewed`. This is a task walkthrough of the live desktop and mobile interface. It is not observation of parents, behavior-supported evidence, user testing, satisfaction evidence, or a search-ranking result.

## Decision

The cross-page task is `PARTIAL`.

The two pages have coherent roles and no contradictory guidance. The area guide owns the five-area choice. The hotel page owns named-property comparison and now gives a bounded one-base-versus-short-LEGOLAND-split rule. Once the hotel page is reached, the six trip-style starts, three early Mission Bay shapes, traffic/total checks, and return link to the area guide make the decision recoverable.

The remaining friction is on the area guide. Its copy says to choose an area before comparing named hotels, but the first hotel link appears before the five-area quick decision and area matrix. The clearer `Move from the chosen area to a named hotel` handoff appears only after the area matrix and four booking checks. The walkthrough can complete the task, but the intended sequence is inverted at the early link and expensive at the dedicated later link.

Record one bounded future defect hypothesis: on the area page, consolidate the duplicated hotel handoff and place the existing named-hotel transition immediately after the area matrix. Do not select or implement that change here. It needs a separate action that preserves the five-area tool, quick picks, matrix, booking checks, title, URL, indexability, and active search boundary.

## Family Task

A family expects most days around San Diego city or the coast but has one LEGOLAND anchor. Starting on the area guide, it must:

1. choose one or two plausible San Diego base areas;
2. reach the named hotel shortlist after that area choice;
3. decide whether to keep one city/coastal base or compare a short North County split;
4. reduce the early property comparison to no more than three materially different Mission Bay starts;
5. identify date-specific traffic plus same-date room, parking, and package-total checks;
6. return to broader area context when the property choice exposes a location conflict.

The child-age, nap, transport, room, and budget constraints are included only where the live pages expose them. No safety, water-suitability, quietness, stroller-route, exact travel-time, or firm family-fit conclusion is required or inferred.

## Evidence Inventory

| Evidence | Date | Class | Use | Limitation |
|---|---|---|---|---|
| [San Diego area guide](https://familytripwise.com/where-to-stay/san-diego-with-kids.html) | Inspected 2026-08-27; visible guidance checked 2026-07-20 and page updated 2026-08-04 | Live page/interface evidence | Area role, tool, quick choices, matrix, hotel links, ordering and overflow | Interface evidence only; not behavior |
| [San Diego family-hotel guide](https://familytripwise.com/where-to-stay/san-diego-family-hotels.html) | Inspected 2026-08-27 after `FT-IMP-024` | Live page/interface evidence | Trip-style starts, stay-shape rule, verification checks and return link | Newly released; no post-change crawl/query evidence |
| `docs/research/san-diego-mission-bay-legoland-stay-shape-review-2026-08-24.md` | 2026-08-24 | Internal proxy-task evidence | Original five stay-shape outputs and parent-question boundary | Not user-tested |
| `docs/research/san-diego-stay-shape-serp-validation-2026-08-25.md` | 2026-08-25 | Current SERP/ranking-page synthesis | Page ownership and structural opportunity | Bounded sample; no demand or exact-rank claim |
| `backlog/product-learning-ledger.md` entries `LRN-004`, `LRN-006`, `LRN-007` | 2026-08-24 through 2026-08-27 | Qualitative community, SERP and interface synthesis | Family job, ownership and released task result | Hypotheses and proxy evidence |
| `ops/gsc-snapshots/2026-08-26.*` | Collected 2026-08-26; finalized through 2026-08-24 | Recent reused authenticated API, public-safe | Index/crawl and measurement boundary | No new August 27 snapshot; no aligned query cohort; predates `FT-IMP-024` |

## Observable Route

### Area guide

The initial view names the five-area job and says to compare named hotels after choosing an area. The page then presents provenance, media, an intro/snapshot, a constraint-to-checklist tool, five quick area choices, the area matrix, four booking checks, and finally the dedicated cluster handoff.

At 390 by 844:

- the early `12 family hotel options` link begins around 1,749 pixels, about 2.1 viewports down;
- `Five areas, matched to different family trips` begins around 3,800 pixels, about 4.5 viewports down;
- the dedicated `Compare 12 San Diego family hotels` link begins around 7,371 pixels, about 8.7 viewports down;
- page-level horizontal overflow is zero.

At 320 by 800:

- the early hotel link begins around 1,863 pixels, about 2.3 viewports down;
- the five-area quick decision begins around 4,089 pixels, about 5.1 viewports down;
- the dedicated hotel link begins around 7,997 pixels, about 10.0 viewports down;
- page-level horizontal overflow is zero.

The constraint tool works with normal controls. For `Activity-route simplicity` plus `Midday nap or reset`, it produces a four-step checklist covering exact property-to-activity routes, date/daypart drive and parking checks, a realistic midday return, and retention of two area-and-hotel combinations. It helps plan verification but does not itself choose an area, so it does not remove the need for the later quick choices and matrix.

### Hotel guide

At 390 by 844:

- the first trip-style card begins around 735 pixels;
- `One base or split?` begins around 1,902 pixels;
- the return link to the area guide begins around 2,565 pixels;
- page-level horizontal overflow is zero.

At 320 by 800:

- the first trip-style card begins around 828 pixels;
- the stay-shape rule begins around 2,188 pixels;
- the return link begins around 2,970 pixels;
- page-level horizontal overflow is zero.

The first six cards expose Bahia/Hyatt, Catamaran, Downtown, LEGOLAND, Coronado, and La Jolla starts. The stay-shape rule says to keep one San Diego base for city/coastal-led trips and compare a short North County split only when LEGOLAND anchors the trip and park-hotel downtime may justify moving rooms. It also names date-specific traffic and same-date room, parking, and package-total checks. No conflicting area ownership or unsupported exact route claim was found.

Desktop inspection and a normal link click reproduced the same ordering and ownership. Exact desktop pixel positions varied with media load, so only the stable source order, visible link, successful navigation, and zero-overflow result are retained.

## Task Matrix

| Step | Result | Evidence |
|---|---|---|
| Choose a broad area | `YES` | Five quick choices, matrix, and constraint checklist |
| Reach hotels after area choice | `PARTIAL` | Early hotel link precedes the area decision; dedicated post-decision link is deep |
| Decide one base versus split | `YES` | Hotel snapshot gives the bounded rule |
| Reduce Mission Bay starts | `YES` | Bahia/Hyatt plus separate Catamaran shape |
| Identify verification checks | `YES` | Traffic plus same-date room, parking and package total |
| Return to area context | `YES` | Visible area-guide handoff after the hotel snapshot |
| Avoid conflicting guidance | `YES` | Area and property ownership remain consistent |

## Finding

### P2 hypothesis: the area-to-hotel handoff is duplicated and sequenced around the prerequisite

The page promises `choose area, then hotels`. Its first hotel link comes before the page has exposed the five-area quick choices or matrix. The clearer later handoff follows both the area decision and four booking-check cards, making the semantically correct route much deeper on mobile.

Smallest future candidate, not selected here:

- keep the five-area quick choices, matrix, constraint tool and booking checks;
- move the existing named-hotel handoff immediately after the area matrix;
- remove or convert the earlier duplicated hotel link so the visible action does not precede its prerequisite;
- preserve every page/search/evidence invariant and do not edit the hotel page.

This is an interface-order hypothesis. It does not prove abandonment, satisfaction, conversion, ranking impact, or that parents prefer a different sequence.

## Reusable Lesson

Test destination clusters as journeys, not only as isolated pages. A clear internal link is not enough when it appears before the decision that gives it meaning, while the semantically correct handoff appears much later. Cross-page task QA should check prerequisite order, link placement, recovery path, and ownership consistency before adding more copy or controls.

## Next Falsification

Reject the candidate if an independent reviewer completes the area-first task without the ordering detour, if moving the handoff would displace higher-value area evidence, or if later behavior/user evidence shows the current early hotel link is the preferred route. A separately selected implementation would need before/after route measurements and must wait for its own review and release gates. Search interpretation remains blocked until a post-`FT-IMP-024` crawl and sufficient finalized aligned query evidence exist.

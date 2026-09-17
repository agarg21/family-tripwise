# Las Vegas Five-Plus Room Branch Validation

Action: `FT-IMP-028` / `IMP-055`. Registered September 16; resumed and task-validated September 17, 2026. The filename preserves the registered scope date.

Learning unit: `LRN-034` (September 17 Eastern). Evidence level: `proxy-reviewed`, not user testing, observed preference, satisfaction, conversion, or ranking evidence.

Target: https://familytripwise.com/where-to-stay/las-vegas-family-hotels.html

## Decision And Hypothesis

Apply the independently reproduced `FT-RES-043` / `LRN-032` P2 to the existing page. Hypothesis: replacing the redundant hotel-count snapshot field with three official occupancy-supported starts and a Vdara fallback makes a five-person capacity decision answerable without inferring occupancy from beds, square footage, or a suite label.

The local rendered candidate supports that hypothesis for capacity routing, not for a final booking choice. Three supported room starts are explicit before the existing trip-style cards. Only four room-capacity records are aligned in the generator and existing detail cards. The renderer uses the same record labels, capacities, sources and checked date for the early branch and detailed evidence. No table column, card, section, filter, hotel, URL, or schema entity is added.

## Family Task And Controls

Primary task is the `FT-RES-043` scenario: two adults and three children prefer one officially supported room, a mid-range rough total, and a non-gaming setting or short casino path; a named larger suite or two-room fallback is acceptable. Child ages, dates, sleeping-surface preferences, exact budget and exact casino routes are unknown. Required outputs are at most three supported starts, a named room path/fallback, comparative cost/location uncertainty, a provisional comparison choice and next booking checks.

Control B is four people choosing a central kitchenette suite. The existing Vdara Studio record still names four-person occupancy, king/sofa bedding and kitchenette; its central-suite quick pick is unchanged. The new five-plus branch does not exclude that four-person path.

Control C is a skeptical five-person planner tempted by the lowest published base range or an assumed connector. The branch requires same-date five-guest totals rather than July room ranges. Detail records distinguish room capacity from available inventory, sleeping surfaces, crib/rollaway policy and confirmed connection. None promises a five-person room at a displayed low price.

The controls retain their answerability and navigation, not identical reading depth: the existing trip-style starts move down 282, 309 and 405 pixels at desktop, 390 and 320 widths versus the September 15 measurements. This is a real layout cost, not evidence of abandonment or reading time. The four-field snapshot remains one existing decision surface.

## Bounded Official Capacity Overlay

Source pages inspected September 16, 2026. Publication/update dates are not exposed by the inspected room records. These checks do not refresh July 22 prices, other hotel facts or sampled reviews.

| Named record | Official capacity | Trace and category boundary | Still unknown |
|---|---|---|---|
| Grand Chateau two-king two-bedroom villa | Up to eight | [Marriott rooms](https://www.marriott.com/en-us/hotels/lasvg-marriotts-grand-chateau/rooms/), rendered second room-card `View More` modal: the named two-bedroom category has two kings, two sofa beds, two bathrooms and maximum eight; no cribs or rollaways. Initial text and the generic eight-person booking control are not category evidence. Other two-bedroom layouts differ and are not silently assigned this capacity. | Exact category availability, sleeping-surface acceptability, price, valet plan and casino path. |
| Tahiti Village Royal Tahitian | Up to eight | [Official suite record](https://tahitivillage.com/booknow/) names the 1,551-square-foot two-bedroom suite combining Moorea and Bora Bora as one suite. Each one-bedroom category lists four. A named Royal Tahitian booking is not a request for two separately reserved rooms to connect. | Exact inventory, bedding needs, pool/shuttle operations and final total. |
| Cancun two-bedroom suite | Four to six | [HGV resort record](https://www.hiltongrandvacations.com/en/resorts-and-destinations/las-vegas/cancun-las-vegas-a-hilton-vacation-club), rendered accommodation tabs: one-bedroom two to four, two-bedroom four to six, penthouse six to eight. Two-bedroom details list two bathrooms and kitchen. The site's generic resort-category tag does not prove a casino at this property. | Exact inventory/beds, old conflicting crib policy, transport, slide operations and final total. |
| Vdara two-bedroom luxury suites | Up to six | [MGM room categories](https://vdara.mgmresorts.com/en/hotel.html): Studios and one-bedroom categories max at four; two-bedroom Penthouse, Loft and Hospitality categories max at six. The former larger-one-bedroom suggestion is removed from the family-of-five recovery path. | Larger-suite price/inventory, bedding, kitchen supplies, two-room availability and any confirmed connection. |

Evidence class is `CURRENT_OFFICIAL_ROOM_SOURCE`, not a booking observation or human-verified stay. September 15 research supplied the action rationale; September 16 room inspection supplied the narrower published category records; September 17 rendered-task validation supplies today's learning unit.

## Page-Only Results

| Step | Before | Candidate | Observable result |
|---|---|---|---|
| Start | PARTIAL | YES | Existing snapshot directly identifies the five-plus job before trip-style starts. |
| Reduce | PARTIAL | YES | Ten properties reduce to three named supported starts: Grand Chateau's audited two-king villa, Royal Tahitian and Cancun two-bedroom. Vdara is an explicit larger-suite/two-room fallback. |
| Compare | PARTIAL | PARTIAL | Named capacities now compare directly. Existing area, kitchen/laundry and water-role fields support central versus off-Strip comparison; July rough ranges are not current larger-room quotes, and exact casino paths remain unverified. |
| Trace | YES | YES | Four direct official sources and a narrow September 16 checked date are separate from July facts/prices/reviews. |
| Decide | NO | PARTIAL | The planner can begin a same-date comparison with the audited Grand Chateau category if centrality/kitchen/laundry is decisive, or Tahiti/Cancun if off-Strip water time is decisive. No unconditional winner, exact budget fit or short-casino-path verdict is supported. |
| Verify | PARTIAL | YES | Named room, five-guest total, inventory, beds and policies are explicit booking-time checks. |
| Recover | PARTIAL | YES | Vdara names eligible two-bedroom categories or two rooms without assuming they connect; room availability or cost can still invalidate any start. |

Do not report this as completion of every original constraint. The implementation removes the observed capacity-reconstruction blocker and enables a conditional comparison; cost, route and preference unknowns remain legitimate checks.

## Settled Browser Evidence

Local Chrome/Playwright, exact viewports, September 17. Images settled before measurements and screenshots; hero natural width is nonzero. Screenshots show no text overlap/clipping at the branch; both audited central cards retain legible room paragraphs.

| Measurement | 1280 by 900 | 390 by 844 | 320 by 800 |
|---|---:|---:|---:|
| Document width | 1280 | 390 | 320 |
| Five-plus branch top | 1475px / 1.64 viewports | 1959px / 2.32 | 2115px / 2.64 |
| Branch height | 350px | 230px | 302px |
| Branch width | 248px | 354px | 284px |
| Branch scroll/client width | 246/246 | 352/352 | 282/282 |
| Existing trip-style grid top | 2238px | 2735px | 2987px |
| Table/scroller width | 1180/1158 | 1180/352 | 1180/282 |

All viewports retain four snapshot fields, five trip-style cards, ten hotel cards, six table columns, three branch source links and the unchanged image. Normal area-guide navigation and return work. Mobile horizontal table scrolling works without document overflow; no page errors occur. The desktop table retains its pre-existing slight horizontal scroll, not a false claim that all 1,180 pixels fit its 1,158-pixel scroller.

An initial screenshot was taken before a wheel event settled and was blank; another immediate mobile-scroll assertion saw the pre-event position. The QA helper now waits for scrolling to settle. These helper failures were not interpreted as production defects. No reading-time, behavior or satisfaction claim follows from these checks.

## GSC And Measurement Boundary

Selection used recent reused September 15 API data finalized conservatively through September 13: target 116 impressions, no clicks and page-average position 60.06. At resumed transaction start, fetch found only mechanical snapshot commit `81ad4f0` adding September 16 public-safe evidence; the five dirty action paths were preserved and incoming paths did not overlap.

Newly arrived September 16 authenticated read-only API evidence was collected at 14:59:12 UTC, about 14 hours before this trigger, and is finalized conservatively through September 14. Property: 1,705 impressions, five clicks, aggregate position 59.01. Target: 105 impressions, no clicks, page-average position 59.50, submitted/indexed, allowed/successfully fetched and latest recorded crawl `2026-09-04T19:31:29Z`. Inspection covers 24/28 indexed URLs, zero unknown; sitemap succeeds with 28 discovered pages and a July 27 last-read record.

The public record contains no aligned query cohort, country/device or complete raw-query exports. Overlapping aggregates are orientation/crawl evidence, not demand, CTR diagnosis, Google's testing state or ranking causality. A later post-release crawl plus sufficient aligned finalized query evidence is needed for search interpretation. No indexing request is made, and no active URL-specific observation protection applies to this target.

## Invariants, QA And Review

Preserve title, H1, description, URL, canonical, indexability, sitemap, ten hotel identities/order, five starts, six-column table, twenty Maps links, photo, three FAQs and schema, all non-room facts and July price/review evidence. Generation changes only the declared target HTML. No safety, exact casino/stroller route, firsthand, guaranteed connection/price/availability or firm suitability claim is added.

Focused tests pass 5/5 and full native tests pass 166/166. Operator state, freshness (zero expired notices), local and pre-release production SEO (zero errors/warnings), 65 public-snapshot validations, and 28-URL public preflight pass. Strict JSON has 100 unique IDs and all 99 prior action records are unchanged; dirty scope is the exact fourteen registered paths, with only the declared target HTML changed under `site/`. Structured DOM comparison confirms unchanged title/H1/description/canonical/robots, ten ordered hotels, twenty Maps links, table, five starts, schema, three FAQs, photo and section count; four room sources are added. Whitespace and credential/identity scans pass; the artifact contains no raw query rows, country/device data, source-owned review prose or usernames. Independent review remains pending. Release is not yet claimed; Pages marker, production SEO and all target invariants remain release gates.

## Lesson And Next Falsification

Latest immutable gate: the same independent reviewer completed cycle two with `PASS`, no P0-P3, and no edits or external mutations. It independently reran focused 5/5, DOM/scope/prior-action invariants, operator-state, freshness, local SEO, 65 snapshots and whitespace, and inspected corrected Vdara screenshots at all widths. Full 166/166, final browser navigation/measurements and pre-release production checks remain operator-reported. Final operator browser recheck passes all three sizes with the same branch/table metrics and normal area/official-source navigation. Earlier pending labels are pre-verdict chronology, not current review state. Commit/push, Pages and live production invariants remain release gates.

Independent review cycle one: agent `01a0adc4-137d-77b3-8bc4-51f522c0c141` returned `PASS_WITH_P3`, no P0-P2, and one nonblocking plural-agreement finding. The room label is corrected to singular and focused assertions cover it; cycle two is pending. No capacity, routing rule, measurement, or uncertainty judgment changed. A supplementary normal Royal Tahitian source-link click reaches the official record at all three viewports. That external page logs `grecaptcha is not defined`; Family Tripwise and area navigation log no page errors. No CAPTCHA or booking workflow is attempted.

Confidence is high for dated category capacity and rendered answerability; medium for the bounded improvement; low for prevalence, preference, satisfaction, complete price fit or ranking effect. A family-size branch should expose the exact audited category, not a broad property or room-family capacity, and should explicitly separate affordable-looking base ranges from a supported larger-room comparison.

Reject or revise the rule if official sources conflict or remove capacities, an independent reviewer cannot reproduce the page-only branch, the added snapshot depth displaces a more consequential decision, real users find it confusing, or a later aligned cohort assigns this job elsewhere. Unknown exact dates, beds, ages, price and casino routes must not be filled by inference.

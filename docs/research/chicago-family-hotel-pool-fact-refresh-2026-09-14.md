# Chicago Family-Hotel Indoor-Pool Fact Refresh

Checked: 2026-09-14

Action: `FT-MAINT-006` / `IMP-054` / `LRN-030`

Target: `https://familytripwise.com/where-to-stay/chicago-family-hotels.html`

## Decision And Hypothesis

Family decision: can a parent still use the page's indoor-pool shortlist as a current weather-backup comparison, and what temporary conditions need checking before booking?

Falsifiable hypothesis: at least one current official property record will conflict with the maintained pool availability or closure record and require a narrow public correction.

Result: partially confirmed. Current official pages still support all six selected indoor-pool listings, and Loews remains the closed-pool control. IHG's current project notice conflicts with the page's August 13 summary: the improvement project runs August 10-September 16, but the notice lists pool closures only on August 11 and September 10 and says the pool remains open during the rest of the project. The page therefore needs one time-bounded InterContinental correction, not a broader hotel rewrite.

## Current Official Records

| Property | Current official source | Supported fact | Conflict or unknown |
|---|---|---|---|
| Embassy Suites by Hilton Chicago Downtown Magnificent Mile | [Hilton hotel information](https://www.hilton.com/en/hotels/chirees-embassy-suites-chicago-downtown-magnificent-mile/hotel-info/) | Hilton currently lists an indoor pool. | No conflict with the selected-page pool claim. Hours, access, and operating state remain booking-time checks. |
| Homewood Suites by Hilton Chicago-Downtown | [Hilton hotel information](https://www.hilton.com/en/hotels/chihwhw-homewood-suites-chicago-downtown/hotel-info/) | Hilton currently lists an indoor pool. | Hilton also currently says cribs are not available, but the Family Tripwise page makes no crib claim for this property. No public correction is needed on that point. |
| InterContinental Chicago Magnificent Mile | [IHG amenities](https://www.ihg.com/intercontinental/hotels/us/en/chicago/ordha/hoteldetail/amenities), [dedicated pool page](https://www.ihg.com/intercontinental/hotels/us/en/chicago/ordha/hoteldetail/amenities/pool), and [current project notice](https://www.ihg.com/intercontinental/hotels/us/en/chicago/ordha/hoteldetail/amenities/special-activations) | IHG lists a heated indoor pool. Its notice says seating and locker-room improvements run August 10-September 16, the pool was closed August 11 and September 10, and it is open during the remainder of the project. | The maintained August 13 summary incorrectly described one August 10-12 closure. IHG's general amenities page lists 5:00 AM-10:00 PM while the dedicated pool page lists 7:00 AM-10:00 PM, so the page does not resolve or publish exact hours. Occasional daytime construction may continue, locker rooms are unavailable, weekend pool movies are relocated, and Resort Passes are unavailable during the project. Desk research does not verify the observed operating state. |
| Hilton Chicago | [Hilton amenities](https://www.hilton.com/en/hotels/chichhh-hilton-chicago/amenities/) | Hilton currently lists an indoor pool. | No conflict with the selected-page pool claim. Hours, access, and operating state remain booking-time checks. |
| Four Seasons Hotel Chicago | [Four Seasons hotel facts](https://press.fourseasons.com/chicago/hotel-facts/) | Four Seasons currently lists one 44-foot pool. | No conflict with the selected-page pool claim. The source does not make Family Tripwise's broader family-fit decision for the reader. |
| The Langham, Chicago | [Langham swimming pool](https://www.langhamhotels.com/en/the-langham/chicago/wellness/swimming-pool/) | Langham currently lists a 67-foot indoor pool, daily 6:00 AM-8:00 PM, with children accompanied by an adult age 18 or older. | No conflict with the selected-page 67-foot pool claim. The existing page keeps child rules as a booking-time check rather than expanding this spot check into a broader policy refresh. |
| Loews Chicago Hotel | [Loews services and amenities](https://www.loewshotels.com/chicago-downtown/discover/services-amenities) | Loews says its pool remains closed for repairs through December 31. | No conflict with the current decision to defer Loews while its pool is unavailable. Recheck after the stated closure window. |

## Evidence Boundaries

- Evidence class: current official property records, checked September 14, 2026.
- This is a pool-status spot check only. Hotel selection, room facts, prices, and sampled online-review evidence remain dated July 23, 2026 unless a row above explicitly identifies a current pool fact.
- Direct command-line requests returned `200` for Four Seasons, Langham, and Loews. Hilton's three pages and IHG's pages returned `403` to the command-line client, but their current official content was readable in the browser workflow. A blocked command-line response is a reachability limit, not evidence that the official page or fact is unavailable.
- No stay, pool visit, child-rule enforcement, construction impact, crowding, or operating state was personally verified. Current official publication does not guarantee access on a travel date.
- This bounded result does not measure demand, user satisfaction, rankings, or the value of the correction.

## Decision And Next Check

Correct only the InterContinental project dates and current conditions in the maintained evidence layer, generated hotel card, visible FAQ, and matching FAQ schema. Preserve all six selected pool listings and the Loews closed-pool control.

Recheck IHG on or after September 17, 2026, because the current project notice is scheduled through September 16. Recheck sooner if the notice changes, a selected property posts a closure, or a current official record conflicts with the page.

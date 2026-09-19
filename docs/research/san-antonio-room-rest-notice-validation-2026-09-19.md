# San Antonio Room-Rest Notice Task Validation

`FT-MAINT-007` / `IMP-056` / `LRN-038`, September19, 2026. Result: **implementation HOLD; live-page learning complete**. This is a reproducible proxy review, not user testing, a booking check or firsthand travel experience.

## Decision And Hypothesis

Two adults and three children aged4,8,12 are comparing two resort nights, water access and midday room rest. Dates/budget are unknown. Hypothesis: following the existing JW comparison row into its detail card supplies a current room-rest limitation and an actionable direct-source verification step, while preserving occupancy and water-access distinctions. Unlike September18's source/text audit, this unit executes the live route at desktop and mobile sizes. Rechecking unchanged sources alone is not counted as learning.

Controls: a five-person party must still verify exact room occupancy separately from entry wristbands; a kitchen/laundry-led party can route to Wild Oak and recover exact-equipment/offer checks without treating villa marketing as an unconditional choice.

## Sources And Boundaries

Both first-party pages were re-read September19; publication/update dates are unknown. Retrieval does not establish notice onset or actual conditions.

- [Marriott rooms notice](https://www.marriott.com/en-us/hotels/satjw-jw-marriott-san-antonio-hill-country-resort-and-spa/rooms/): broad summer2026-spring2027 room/exterior works, possible daytime noise and balcony restrictions.
- [Marriott enhancement FAQ](https://www.marriott.com/en-us/hotels/satjw-jw-marriott-san-antonio-hill-country-resort-and-spa/overview/enhancements/):9am-5pm work, early2027 guestroom estimate, facilities expected available. Scope differs from the broad banner; neither guarantees a precise end or conditions for a particular room/date.
- [Existing live comparison](https://familytripwise.com/where-to-stay/san-antonio-family-hotels.html): normal comparison links, disclosure controls, card text, source links and layout inspected. Evidence classes: `OFFICIAL_PUBLISHED_FACT`, `SOURCE_SCOPE_UNCERTAINTY`, `LIVE_RENDERED_PROXY_TASK`. No protected query data, booking, contact or paid request.

## Reproduction And Result

At1280x900,390x844 and320x800: read the trip-style starts and JW table row, activate its property link, open its summary, read room setup and price/key checks, then route to Wild Oak and open its card. Disclosure click and keyboard Enter both operated; no claim of a complete accessibility audit. The table link reaches the card region but does not itself open the disclosure. Source routes were inspected separately.

| Required output | Result | Observed evidence |
|---|---|---|
| Start/reduce to relevant property roles | YES | Water-complex and villa/kitchen roles remain distinct. This narrows options, not booking eligibility. |
| Separate room occupancy from admission | YES | JW row/card retain five-wristband limit plus exact-occupancy check. Existing public room-inventory wording is not newly verified here. |
| Identify current midday-rest limitation | NO | No work/noise/balcony notice in JW card, row or the inspected main-page text. The answer is absent, not just buried. |
| Trace that limitation to direct official evidence | NO | JW's source links are overview/experiences; no dedicated rooms/enhancement link exists. More source-navigation work is required. |
| Name work-specific next verification | NO | Existing checks cover rooms, water operations, parking and total, but not work near the assigned room or date-specific balcony access. |
| Recover Wild Oak equipment/offer uncertainty | YES | Its card explicitly requires studio/villa, capacity, kitchen/laundry, water, offer terms and total checks. Exact five-person category/date bookability remains PARTIAL. |
| Make a complete same-date hotel choice | PARTIAL | Actual capacity, total cost, room location and work impact are unknown; do not force a recommendation. |

Hypothesis rejected. Retain the existing bounded notice candidate; do not add another hotel, generic warning section, room list or new page. Room-rest and water-access verification are independent. Existing repeated occupancy reminders are decision-relevant; this review does not justify general prose expansion or rework of September5's separate P3.

## Rendered Evidence

Screenshots of desktop JW disclosure, mobile disclosure and room text, and narrow-screen room text were visually inspected in the tool output: no text collision or page-level horizontal overflow observed. The hotel image loaded with nonzero natural width. This is not evidence of human preference or satisfaction.

| Viewport | Document overflow | Table container/content width | JW card top / source-heading top with only JW open |
|---|---:|---:|---:|
|1280x900|0px|1158/1158px|4409.7/7709.0px|
|390x844|0px|352/820px|5961.4/10845.9px|
|320x800|0px|282/820px|6342.9/11900.8px|

Mobile table content uses an existing bounded horizontal container. Horizontal gesture discoverability was not tested. Positions are page coordinates for this disclosure state, not user effort or time. The source section is deep, but moving it is outside this action. A future notice should sit near the room check with direct links; no claim that its layout or reading-depth cost has already been validated.

## Implementation Hold

A tentative generator-only notice was drafted after action registration. The browser security policy then denied opening the local `file:` preview and explicitly prohibited workarounds. No alternative browser/proxy/raw automation was used to access it. The draft was exactly reversed; generated site files were never changed. Live HTTPS review remained available and supplied the learning above.

The browser denial is a **pre-release preview blocker**, not an evidence-collection blocker. Do not use it to exempt future daily learning. Before implementation resumes, establish a permitted preview workflow through normal environment/user resolution, recheck the sources, and repeat local rendered QA, independent review and production release gates. Do not relax protections or deploy unverified content to obtain a preview. No page release is claimed.

## Measurement And Next Trigger

Recent reused September18 read-only API snapshot is conservatively finalized through September16:1547impressions,8clicks,54.96property position;24/28 indexed. Prior September17 window1566/6/56.04 overlaps and is orientation only. Target3impressions/0clicks/25, indexed/PASS, crawl July30 17:35:13UTC predates September5 maintenance. No aligned public query cohort or new crawl establishes an SEO result.67 snapshots validate.

Confidence is high for observed source wording and absent page answer, medium for this reproducible task's relevance, low for actual room impact, user preference or ranking effect. Reusable lesson: answering amenity/capacity questions does not answer temporary room-rest constraints; validate the consequence across the comparison-to-card route. Falsify with a changed/withdrawn notice, an independently reproducible existing direct answer, or a permitted preview showing that the compact candidate adds confusion or cannot preserve scope uncertainty.

No hotel, price/review/general-fact date, site/code, title/canonical/schema/sitemap/indexability, measurement window or destination changed. Full native/focused QA and independent review remain required for this docs-only record.

Final gate: Feynman `01a0b9c8-c0b3-70c1-a32f-1496c9b8bcaa` cycle-one PASS, no P0-P3. Independent source/scope/state/privacy/no-site checks and target200/byte match confirm the bounded record; viewport measurements remain operator observations. Operator full167/167, focused4/4, state/freshness/localSEO/67snapshots/111IDs/oneLRN038/tenpaths/whitespace all pass. Live/local target SHA256 `eb5c0c3b30cbaf9b811e4f6b97cc19e29cdc77291bbf54295a1c5b7ee13ff695`. Docs-only push follows; implementation remains HOLD.

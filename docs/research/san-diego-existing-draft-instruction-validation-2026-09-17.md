# San Diego Existing-Draft Instruction Validation

Date: 2026-09-17
Action: `FT-IMP-029` / `IMP-052`
State: completed, independent cycle-two PASS with no P0-P3, released and production-verified at `70a6b5a044959c14afbb6bebf7e7629feaa37b97`.

## Evidence And Scope

Apply the source-bounded P2 from `docs/research/san-diego-activity-to-itinerary-overfilled-draft-task-review-2026-09-10.md`, independently reviewed by Rawls with cycle-two PASS. The source inputs remain the privacy-safe summaries in `docs/research/san-diego-current-family-activity-planning-questions-2026-09-10.md`. This is implementation acceptance QA of that same task, not new community research or an additional daily learning unit; September 17 already has `LRN-034`.

The existing itinerary gets one paragraph headed `Already have a draft?` before its four quick cards. It names fixed versus flexible commitments, usable travel and full blocks, booked stay and transport, meals/rest, one-zone selection, flexible cuts, light transfers, unknown preferences and current checks. No new options, itinerary, route or fact are introduced. Removing the single added HTML line exactly reproduces `c78f798` target HTML; all other site outputs are unchanged after native regeneration.

Baseline fetch found no incoming commit or divergence. Nine existing dirty files contain mechanical `FT-IMP-028` release metadata and are preserved. Exact total release scope is the fifteen paths registered in current-cycle state before substantive edits and mirrored in `FT-IMP-029.target_paths`. Only registered new-action notes are added to shared state; the old action receives no new judgment. No new destination or publication permission is inferred from the user's expansion discussion.

## GSC Boundary

Recent reused September 16 read-only API data is finalized conservatively through September 14, covering August 18-September 14. Property: 1,705 impressions, five clicks, average position 59.01. Itinerary: 76 impressions, zero clicks, page-average position 59.78, indexed with August 29 crawl. Index coverage: 24/28, no collector-unknown inspections. September 15 prior property evidence was 1,775 impressions, five clicks, position 59.34; these windows overlap and do not form independent experiments. No September 17 snapshot or aligned public query cohort is available at selection. All 65 public-safe snapshots validate. No raw query, country/device, credential or personal data is copied.

This evidence provides orientation and a pre-change crawl boundary. It does not select a CTR experiment, prove quality, or predict ranking benefit. Later interpretation needs a post-release crawl and sufficient aligned finalized query evidence; no indexing request is made. No active itinerary-specific observation hold was found; unrelated windows remain unchanged.

## Acceptance Tasks

Main case retains eight travelers (four adults, four children aged 5.5-13), 2-2.5 days, rental cars, Mission Beach base and the existing arrival/Coronado/Point Loma/Cabrillo/Sunset Cliffs/Zoo/Midway/Seaport Village/downtown draft. Neither interests nor which draft attractions are fixed is supplied. The new paragraph explicitly asks the reader to classify those commitments before cutting them; it does not decide that any named booking can be dropped.

The conditional output remains arrival/reset, a Zoo/Balboa main block if retained, and a remaining coast/waterfront choice according to usable time and family preference. Protect meals and hotel/rest capacity, retain the supplied car/base input, remove flexible cross-zone additions first, and verify dates and exact conditions. No exact transfer or attraction duration is inferred, and no named coast choice is invented.

Younger-child control retains children nearly three and five, two Mission Bay nights followed by two nights near LEGOLAND, fixed Zoo and LEGOLAND anchors, and an open transfer day. The paragraph protects the fixed anchors, labels the transfer as a distinct block and keeps any optional stop conditional on timing, energy and interests. The control does not gain another full attraction day. Transfer timing and weather remain unknown.

| Step | Main after | Younger-child after | Boundary |
|---|---|---|---|
| Start | YES | YES | Existing draft and fixed/usable-block order are now explicit before templates. |
| Reduce | YES | YES | Flexible cross-zone additions are cut first; fixed anchors and transfer/rest capacity are protected. Main YES concerns the editing order, not a final named shortlist without missing inputs. |
| Compare | PARTIAL | PARTIAL | Existing fields remain available; missing preferences/timing and uncovered draft stops remain limitations. |
| Trace | PARTIAL | PARTIAL | Existing official links/estimate labels persist; no new traceability is claimed for draft stops absent from the page. |
| Decide | PARTIAL | PARTIAL | A conditional shape is possible; neither a final coast choice nor a transfer-day stop is invented. |
| Verify | YES | YES | Dated hours, terms, weather, parking, accessibility, routes and backups are explicit. |
| Recover | YES | YES | Missing inputs have an early instruction to leave choices conditional; normal forward and return routes work. No automatic form state or saved draft exists or is claimed. |

Blank-slate control: the same one-, two-, three-day and skip cards remain verbatim and accessible without configuring or opening anything. The conditional lead-in lets a reader skip the paragraph, but it increases physical scroll depth. This is an acknowledged cost, not an unchanged layout or a proven user preference.

## Browser And Native QA

QA inventory: paragraph order/readability, unchanged cards and all prior HTML, source-bounded main case, younger-child transfer control, blank-slate path, unresolved-input recovery, narrow table containment, normal activity round-trip and Teen/All controls. Off-happy-path checks cover absent preference/transfer inputs and the 320px table boundary.

Local Chrome/Playwright measurements after `load` and all images complete with positive natural width:

| Viewport | Paragraph top | Paragraph height | Quick cards top | Added card depth |
|---|---:|---:|---:|---:|
| 1280x900 | 1380px | 96px | 1492px | 112px |
| 390x844 | 1159px | 336px | 1511px | 352px |
| 320x800 | 1190px | 432px | 1638px | 448px |

Added depth is measured by removing only the paragraph from the rendered current document and comparing the same cards, after confirming all other HTML is byte-identical to baseline. All three document widths equal their viewports; paragraph scroll/client widths match; four quick cards remain. The 1080px table stays inside 352px/282px mobile scrollers (1158px desktop table/scroller). Normal itinerary-to-activity-to-itinerary links, Teen then All controls, and horizontal table scrolling pass with zero page errors. Screenshots `/tmp/ft-imp-029-local-{1280,390,320}.png` were visually inspected; text is readable with no overlap/clipping. The optional paragraph occupies 54% of the narrow viewport; the first card remains below it and requires more scrolling. This is an accepted candidate tradeoff for review, not an unchanged blank-slate experience.

- Focused specialist tests: 7/7 pass, including one new editing-order/conditional-boundary regression.
- Full native suite: 167/167 pass, including generation/idempotency checks.
- Freshness: zero expired operational notices.
- Pre-release production SEO: zero errors and warnings.
- Public preflight: robots/sitemap HTTP 200, 28 sitemap URLs, all 28 configured pages HTTP 200 and present.
- All 65 public GSC snapshots validate. Final state, exact scope, whitespace and privacy checks remain required before review/push.

## Review And Measurement

Independent read-only review is pending. Native QA and proxy scores do not establish user satisfaction, conversion, search demand or ranking lift. Confidence is high for exact HTML preservation and measured layout; medium for task-order usefulness; low for behavior and organic effect.

Cycle one: reviewer `01a0adc4-137d-77b3-8bc4-51f522c0c141` returned FAIL for one P2 and one P3. The carried FT-IMP-028 release fields bypassed the established state validator; they now use `released-and-production-verified` and numeric `pages_run`, and three stale release-status phrases are mechanically reconciled without changing old product judgments. State QA now validates the actual latest release and passes. The paragraph now defines flexible stops by willingness to move/drop, not refundability; ticket terms remain a separate check. Tests and all three browser checks reran, with revised mobile depths in the table. Cycle two is pending. An app thread polling delay hid the first result; it was retrieved through the native agent tool. A redundant ephemeral read-only CLI fallback was interrupted before a verdict and counts as no review cycle or approval.

Reusable acceptance result: an early editing order can reduce reconstruction while leaving missing inputs unresolved. The change earns its added reading depth only if the conditional draft start is useful; reopen if an independent reviewer cannot reproduce it, the instruction confuses fixed/refundable commitments, blank-slate users are materially hindered, current evidence changes the page's job, or actual user behavior contradicts the proxy result.

No commit, Pages release or production acceptance is claimed until verified outputs are appended. No indexing, analytics, external account/posting/outreach, destination or automation change occurred.

Final review: cycle two PASS with no P0-P3, reviewer `01a0adc4-137d-77b3-8bc4-51f522c0c141`. All fifteen hashes remained stable during review. Independently verified focused7/7, native state against the actual latest release, freshness, local SEO,65snapshots, scope/exact-byte preservation and whitespace; inspected all three refreshed screenshots. Full167/167, browser navigation/measurements, production SEO and preflight remain operator-reported. Both cycle-one findings are corrected, and no reviewer write or external mutation occurred. Earlier cycle-pending labels are chronology. Release gates remain open.

## Release Evidence

Action commit `70a6b5a044959c14afbb6bebf7e7629feaa37b97` is on main. Pages run `35226367636` succeeded at `2026-09-17T13:20:04Z`; production verified `13:20:31Z` with matching SHA/run marker and live HTML equal to reviewed HTML. Exact prior-HTML preservation after removing the paragraph still passes. Production SEO reports zero errors/warnings. The same three viewport measurements, containment, activity round-trip, Teen/All controls and table scrolling pass with zero page errors. No retry/rollback was needed. Earlier open-gate labels are pre-release chronology. This mechanical release backfill is local durable evidence for a later registered transaction, not a separate metadata-only commit.

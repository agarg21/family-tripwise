# Needs User

Last updated: 2026-08-12

No active action is blocked. `FT-COM-001` completed one review-clean NYC family-itinerary answer for the local review surface created by `FT-DEV-005`; `COMM-2026-001` is ready with `user_review.decision` still pending. Open `http://127.0.0.1:4178` while the local board is running to approve, revise, or reject the wording. Approving wording will not authorize posting; no indexing request, analytics installation, external posting, outreach, new destination, or unrelated account mutation is authorized.

`FT-OPS-002` is released and production-verified. `FT-DEV-004` is completed and review-clean; no user decision is required.

The authenticated read-only GSC API collector and protected-query workflow are configured, so there is no GSC-login or query-export setup blocker. The August 12 snapshot is finalized through August 10 and inspected all 28 sitemap URLs: 24 are indexed and four are not indexed. It reports 1,732 impressions, 6 clicks, and aggregate average position 63.9; this does not create an aggregate CTR or rewrite action.

The user selected an existing-page ranking opportunity pass on July 29. `FT-RES-012` found no broad rewrite or CTR winner: discovery/indexing and authority remain limiting lanes. `FT-AUTH-004` and `FT-AUTH-005` produced the live San Diego logistics index. `FT-RES-013` holds Orlando publication during the August existing-city depth cycle. `FT-EVAL-002` identified one narrower page-role defect: hotel/resort wording supplies 156 of 166 attributable exported impressions (94.0%) on the family-hotel URL and 323 of 386 (83.7%) on the stay-area URL, whose selection-time title promised `Family Hotels`. Released `FT-IMP-022` implements that area-versus-property handoff without rewriting the hotel page; post-release interpretation now waits for a later crawl and sufficient finalized evidence.

The live sitemap contains 28 canonical URLs and was successfully resubmitted in GSC on July 27. GSC still reports 28 discovered pages; August 12 URL Inspection shows 24 indexed and four not indexed. The remaining not-indexed URLs are the San Diego all-ages and teen activity pages, New York City itinerary, and Chicago teen page. No per-URL indexing request was made.

The Las Vegas all-ages URL is indexed and correctly interpreted for one broad family-activity query family. `FT-RES-015` found a concrete page-quality and citation gap, not an indexing defect or title opportunity. Released `FT-AUTH-006` consolidates the same 12 choices into one source-dated family admission and current-check record set without changing the title, URL, or page count.

## Useful Decisions Soon

| Status | Question | Why it matters |
|---|---|---|
| resolved 2026-07-31 | Approve, revise, or reject `FT-AUTH-005` / `IMP-042`? | Approved. The implementation may improve only the existing San Diego all-ages URL; no separate data URL, new canonical/indexable HTML page, indexing request, teen-page edit without a verified defect, or outreach is included. |
| required before external contact | Approve, revise, or reject the named first outreach wave of at most six public prospects? | The authority asset is production-verified. Every contact remains a separate external action. The proposed wave is The Parking Spot, ParentMap, San Diego Family Magazine, KidsOutAndAbout San Diego, San Diego Museum Council, and San Diego Tourism Authority. |
| required before external posting | Approve any draft forum or Reddit answer? | Autopilot may research questions and prepare concise, source-linked drafts, but it cannot post, vote, message, create accounts, impersonate a traveler, or add promotional links autonomously. |
| closed unless the user revives the unpublished Atlas | Should real parents run the three Reset Atlas tasks? | No. The user stopped the new-page/Atlas direction, so missing parent tests do not block existing-page authority work and should not generate follow-up. |
| deferred during August depth cycle | Approve Orlando as the next new destination and authorize one all-ages activity URL? | The decision pack remains valid, but expansion is held until the existing-city strategy is reviewed on or after September 1 unless the user explicitly overrides it. `AGENTS.md` approval remains required. |
| optional | Can a human reviewer supply firsthand, safety, exact route/stroller, or unsupported firm family-fit evidence? | Research-based hotel and area guidance no longer needs blanket firsthand review; only these trust-sensitive claims remain gated. |
| optional | Should Semrush or DataForSEO budget be used in a future research cycle? | Paid data remains optional and requires an explicit budget decision. |
| resolved 2026-08-01 | When should destination expansion resume? | After the August existing-city depth cycle is reviewed, unless the user explicitly changes strategy sooner. `FT-RES-011` remains durable research rather than current publication authority. |
| resolved 2026-08-03 | Select `FT-AUTH-006` to consolidate the Las Vegas all-ages page? | Selected. The implementation keeps the same 12 choices and URL, replaces repeated layers with one source-dated cost-and-friction index, and leaves title tests, new pages, indexing requests, and outreach out of scope. |

## Escalation Rules

Agents should add questions here when:

- a decision affects business direction
- a claim needs human verification
- paid tools or account changes are needed
- DNS, hosting, billing, or domain changes are needed
- legal, safety, or trust-sensitive claims cannot be handled from sources alone

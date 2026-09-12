# Family Tripwise Branded-Search YouTube Conflict

Date: 2026-09-11

Action: `FT-RES-040` / `SRR-062` / `LRN-029`

Decision: `USER_GATED_RESPONSE`

## Question

Does the YouTube channel using `Family Tripwise` create a material source-identity conflict in current branded search, and which response fits the observable evidence?

This is a public-evidence and platform-policy review, not a legal determination. It does not measure user confusion, traffic loss, or infringement, and it submits no report or complaint.

## Evidence Classes

- `LIVE_SERP_SAMPLE`: three Google result pages inspected on 2026-09-11 in the same signed-in Chrome session. Google labeled the results personalized, so observed order is not a universal rank.
- `PUBLIC_CHANNEL_EVIDENCE`: the channel About surface, one public Short, its metadata, and its transcript inspected on 2026-09-11.
- `REPOSITORY_PROVENANCE`: public site language and Git history establishing when Family Tripwise pages and planning methods existed.
- `OFFICIAL_POLICY`: current YouTube, U.S. Copyright Office, and USPTO guidance inspected on 2026-09-11.
- `GSC_ORIENTATION`: the public-safe September 11 snapshot. It contains no aligned branded-query cohort and cannot measure this conflict.

## Branded Search Sample

| Query | Observed result pattern | Bounded interpretation |
|---|---|---|
| `FamilyTripwise` | Official homepage first, an official NYC page second, the YouTube channel third, then additional official pages. | The official site led this personalized sample, but the same-name channel was a prominent competing source. |
| `"Family Tripwise"` | The YouTube channel was the first extracted organic result; no official-site result appeared in the first ten extracted organic links. | Exact-name source ambiguity is reproducible in this sample. It is not evidence of a universal number-one rank. |
| `familytripwise travel` | Official homepage first and About page second; the YouTube channel did not appear in the first ten extracted organic links. | Adding the category disambiguated toward the official site in this sample. |

A separate web-search interface surfaced the official site strongly and did not surface the channel consistently. Result order therefore varies by query and search context. The useful finding is the channel's ability to occupy a branded result, not a claimed stable rank.

## Channel Record

| Signal | Observed fact |
|---|---|
| Display name and handle | `Family Tripwise` and `@FamilyTripwise`, an exact identity match to the site's brand name |
| Canonical channel ID | `UCL8YHu5h_XiSTQhZJuCDmtA` |
| Public channel URL | `https://www.youtube.com/channel/UCL8YHu5h_XiSTQhZJuCDmtA` |
| Join date | 2026-08-23 |
| Visible activity | 5 subscribers, 1 video, and non-synchronized surfaces showing 63-65 views |
| Outbound identity | A same-name TikTok URL appears in the channel description |
| Disclaimer | No visible independent, unofficial, or fan-channel disclosure was found |
| Short | `The NYC mistake families always make` at `https://www.youtube.com/watch?v=DGadCeHY2rU`, published 2026-08-24 |
| Short substance | A family NYC itinerary framed around grouping attractions geographically, protecting breathing room, and explaining bookings, omissions, budget, and queue risk |

The channel description presents the identity as a family-travel planning source offering realistic itineraries, costs, crowd avoidance, hotels, transport, and practical details. That overlaps the site's service category and positioning; this record paraphrases the description and transcript rather than reproducing them.

## Provenance And Overlap

The repository establishes earlier public use:

- The homepage first entered Git in commit `083ef38` on 2026-07-02.
- The NYC itinerary first entered Git in commit `bacd088` on 2026-07-04.
- The About page and nearby-attraction grouping explanation existed by 2026-07-05.
- The current NYC realistic-itinerary framing existed by commit `d0c4a7d` on 2026-07-26.

Those records predate the channel join date by about four to seven weeks.

| Overlap class | Finding | Confidence |
|---|---|---|
| Source identity | Exact brand name and handle in the same family-travel category, without a visible unofficial disclaimer | High |
| Positioning | Closely similar promise around realistic family itineraries, hotels, transport, costs, and practical trip friction | High |
| Planning method | Closely similar NYC method: organize days by geography, protect family pace, and make deletion/checking explicit | High |
| Verbatim expression | No substantial site sentence was found verbatim in the Short transcript or inspected description | Medium-high |
| Visual assets | No copied Family Tripwise site artwork or page capture was established | Medium |
| Ownership, motive, confusion, harm | Not established by public observation | Low / unknown |

The chronology and overlap support a plausible identity-confusion case. They do not by themselves prove who operates the channel, whether anyone was actually confused, or whether legally protectable expression was copied.

## Policy Fit

1. **YouTube impersonation is the strongest current fit.** YouTube prohibits content intended to impersonate a person or channel and describes identity copying through names, handles, branding, and overall look and feel. It also expects fan channels to make their unofficial status clear. The exact identity, same category, overlapping positioning, absent disclaimer, and current branded-result presence make this route proportionate. Source: [YouTube impersonation policy](https://support.google.com/youtube/answer/2801947?hl=en).
2. **Trademark/use-rights is a fallback.** YouTube provides a trademark complaint process and its form permits a claimant asserting use rights rather than only a registration. This route carries factual and legal attestations, so it should follow a failed or unavailable impersonation route, not run in parallel by default. Sources: [YouTube trademark guidance](https://support.google.com/youtube/answer/6154228?hl=en) and [trademark complaint form](https://support.google.com/youtube/contact/trademark_complaint).
3. **Copyright is not supported by the current record.** The observed overlap is mainly identity, positioning, ideas, and method. The U.S. Copyright Office states that names, titles, slogans, ideas, systems, and methods are not protected by copyright; no substantial copied expression or site asset is presently documented. Do not submit a copyright removal request on this record. Sources: [U.S. Copyright Office FAQ](https://www.copyright.gov/help/faq/faq-protect.html) and [YouTube copyright removal guidance](https://support.google.com/youtube/answer/2807622?hl=en).
4. **Registration is not the immediate dependency.** Federal registration can strengthen U.S. trademark rights, while unregistered use rights may exist with different scope. That broader legal/brand decision is outside this operator action. Source: [USPTO trademark-registration overview](https://www.uspto.gov/trademarks/basics/why-register-your-trademark).

## Retained Response

Retain one user-gated next action: submit a YouTube impersonation report against channel ID `UCL8YHu5h_XiSTQhZJuCDmtA`, using only the observable identity, chronology, same-category positioning, absent disclaimer, and branded-search evidence.

Before submission, preserve fresh screenshots or exports of the three branded result pages, channel About surface, Short metadata, and the official site's dated public pages. The report should avoid alleging theft, motive, proven confusion, traffic loss, or copyright infringement.

Suggested factual summary:

> This channel uses the exact Family Tripwise name and handle for the same family-travel planning service category. Our site used the name publicly before the channel joined YouTube. The channel presents similar planning services without an unofficial or fan disclosure and appears in Google results for our exact brand name. Please review it under YouTube's impersonation policy.

If YouTube does not accept or resolve the impersonation report, the next separately user-authorized option is the trademark complaint form based on documented prior use. A copyright request becomes eligible only if later evidence identifies copied protectable text, video, audio, or artwork.

## Measurement And Limits

- Recheck only after a material channel/search change, an official-channel launch, or a user-authorized complaint outcome.
- Record whether the channel rebrands, adds a clear disclaimer, is removed, expands content, or continues to surface for exact-name searches.
- Do not infer prevalence from three queries or from one personalized search session.
- Do not infer user confusion, click diversion, lost revenue, legal infringement, or complaint success from current evidence.
- Fresh September 11 GSC is finalized through September 9 with 1,739 impressions, 3 clicks, aggregate average position 63.46, and 24/28 inspected URLs indexed. The homepage has 12 page-level impressions at average position 32.42 and About has 8 at position 4, but no public aligned branded-query cohort exists.

## QA And Independent Review

- Full native tests pass `164/164`; operator-state, content-freshness, local and production SEO, all 60 public GSC snapshot validations, strict roadmap JSON and unique IDs, exact nine-path/no-site scope, added-line credential/contact scanning, source reachability, and whitespace checks pass.
- Independent read-only reviewer Noether (`01a094dd-e432-7b51-896b-745ac3fff749`) independently checked the complete diff, Git chronology, official policies, evidence boundaries, report wording, GSC limits, scope, and QA. Cycle one returned `PASS` with no P0-P3 findings; it did not reproduce the earlier personalized result ordering or full transcript and accepted their explicit limits. Cycle two returned `FAIL` for premature release claims and one overstated reviewer-verification sentence. Cycle three verified both P2 corrections and the state-date correction and returned `PASS_WITH_P3` with no P0-P2. Its sole stale-result P3 is reconciled while recording the final verdict. The reviewer changed no file or external state and submitted no report.
- Reviewed docs-only action commit `1bd04c867b3802aff66b624223cb7845ab3e13e8` is pushed to `main`; no Pages wait applies.

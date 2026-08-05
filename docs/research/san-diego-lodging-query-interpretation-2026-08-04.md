# San Diego Lodging Query Interpretation Checkpoint

Action: `FT-EVAL-002`

Checked: 2026-08-04

## Decision

**PROMOTE ONE BOUNDED ROLE-CLARIFICATION ACTION.**

Google is not yet cleanly assigning area/base intent to the stay-area URL and named-hotel/resort intent to the family-hotel URL. The hotel page's attributable queries are 94.0% hotel/resort intent by impressions, but 83.7% of the stay-area page's attributable impressions also come from hotel/resort wording. This is page-role leakage, not proof of a causal cannibalization failure.

Promote `FT-IMP-022`: make the existing stay-area page's title, H1, description, and exact-property handoff unambiguously about choosing among five San Diego bases. Keep its useful hotel-selection checks, but route the named-property decision to the existing family-hotel page. Do not rewrite the hotel page, create another URL, request indexing, or treat this as a CTR test.

## Evidence Register

| Evidence | Classification | Freshness and use |
|---|---|---|
| `ops/gsc-snapshots/2026-08-04.json` | Fresh authenticated read-only Search Console API evidence | Collected 2026-08-04; finalized through 2026-08-02. Supplies public page totals, current index state, and crawl dates. |
| Protected stay-area export, workflow run `30901691773` | Fresh protected read-only Search Console API evidence | 103 page/query rows for 2026-07-06 through 2026-08-02. Plaintext remains outside this public repository. |
| Protected family-hotel export, workflow run `30901720876` | Fresh protected read-only Search Console API evidence | 84 page/query rows for the same finalized window. Plaintext remains outside this public repository. |
| `ops/gsc-snapshots/2026-07-31.json` | Historical authenticated API comparison | Finalized through 2026-07-29. Used only to show the prior page-level baseline, not to claim causality. |
| Current checked-in San Diego lodging pages and internal links | Current first-party implementation evidence | Inspected 2026-08-04 to identify title/page-role language and count normalized internal links. |

The public-safe snapshot contains no complete query export, country/device rows, credentials, or user data. The two complete exports remain mode `0600` in private central operator state.

## Current Crawl And Page Baseline

| URL role | Indexed | Last crawl | Public 28-day impressions | Clicks | Page-average position |
|---|---|---|---:|---:|---:|
| Stay areas | Yes | 2026-07-31 03:57 UTC | 426 | 1 | 62.04 |
| Family hotels | Yes | 2026-07-28 09:11 UTC | 175 | 0 | 74.11 |

The finalized window ends August 2, only two dates after the July 31 stay-area crawl and five after the July 28 hotel crawl. Most of the 28-day window predates those crawls. The checkpoint can diagnose current query ownership and page signals, but it cannot attribute ranking movement to the July revisions.

## Reproducible Query Classifier

Queries were normalized to lowercase and classified once, in this order:

1. `mixed-area-hotel`: contains both an area-pattern and a hotel-pattern.
2. `area`: contains `where to stay`, `where should ... stay`, `best area`, `area(s) to stay`, `which area`, `neighborhood/neighbourhood`, `best part`, `part of San Diego`, `best location`, `location to stay`, `where in San Diego`, or `where is best to stay`.
3. `hotel`: contains `hotel(s)`, `resort(s)`, `motel(s)`, `lodging`, `accommodation(s)`, `suite(s)`, `room(s)`, or `water park/waterpark`.
4. `generic-family-destination`: contains `stay`, `San Diego`, `kid(s)`, `child/children`, `family`, or `families` but no prior pattern.
5. `other`: none of the above.

No row in these two exports entered the mixed or other bucket. The classifier is intentionally lexical and does not infer hidden intent from an uncommon phrase.

## Public-Safe Aggregate Result

### Stay-area URL

The protected export attributes 386 of the public page's 426 impressions to 103 visible query rows. Forty impressions are not present in the protected query rows and remain unclassified.

| Query family | Rows | Impressions | Share of attributable impressions | Clicks | Impression-weighted position |
|---|---:|---:|---:|---:|---:|
| Hotel/resort | 81 | 323 | 83.7% | 0 | 65.04 |
| Area/base | 10 | 30 | 7.8% | 1 | 50.83 |
| Generic family/destination | 12 | 33 | 8.5% | 0 | 53.06 |

The one click belongs to the intended area/base family. A public target-query example already recorded in planning is `where to stay in San Diego with kids`; complete protected rows are not reproduced here.

### Family-hotel URL

The protected export attributes 166 of the public page's 175 impressions to 84 visible query rows. Nine impressions remain unclassified.

| Query family | Rows | Impressions | Share of attributable impressions | Clicks | Impression-weighted position |
|---|---:|---:|---:|---:|---:|
| Hotel/resort | 77 | 156 | 94.0% | 0 | 75.04 |
| Area/base | 1 | 1 | 0.6% | 0 | 92.00 |
| Generic family/destination | 6 | 9 | 5.4% | 0 | 70.33 |

Public target-query examples already recorded in planning include `family friendly hotels in San Diego`, `best family hotels in San Diego`, and `San Diego family resorts`; complete protected rows are not reproduced here.

## Exact Query Overlap

- Fifty-four normalized queries occur on both URLs.
- Those shared rows account for 282 stay-area impressions and 102 family-hotel impressions.
- Across shared rows, the stay-area URL has the lower average position for 29 queries and the hotel URL for 25. There are no ties.
- Impression-weighted position across shared rows is 65.63 for the stay-area URL and 74.70 for the hotel URL.
- The stay-area URL has 49 unique exported queries and 104 impressions outside the overlap; the hotel URL has 30 unique queries and 64 impressions outside it.

This is meaningful overlap, but it is not enough to say Google always prefers the wrong URL. It says the established area page is still absorbing much of the hotel query family while the newer hotel page is semantically clean but less visible.

## Current Page-Role Signals

The stay-area page is internally coherent below its search-facing title: the H1 says `Where to stay in San Diego with kids`, and its main product compares five bases. However:

- its title is `Where to Stay in San Diego With Kids: Areas, Family Hotels and Booking Checks`;
- its description includes `hotel style`;
- one major section is `Four checks before choosing the exact hotel`;
- its exact-property handoff appears later, after hotel-selection language has already been introduced.

Those fields are useful to a parent but blur which URL owns the named-hotel job. The hotel page itself is clear: its title and H1 are `Top Family Hotels in San Diego: 12 Options by Trip Style`, and it compares 12 named properties.

Normalized internal-link inspection also shows an asymmetry after excluding each target's self-link and the noindex compatibility shim:

- the stay-area URL receives 10 links from seven canonical/indexable source pages;
- the family-hotel URL receives four links from three canonical/indexable source pages;
- existing hotel anchors are descriptive and correct, so the deficiency is distribution and role emphasis rather than misleading anchor text.

## Promoted Action: FT-IMP-022

**Title:** Clarify San Diego lodging URL ownership

**Bounded implementation:**

- focus the stay-area title, H1, and description on choosing five areas/bases;
- reframe exact-hotel checks as the second-step handoff after an area is chosen;
- place one descriptive family-hotel link at that handoff;
- keep all five area comparisons, the constraint tool, and useful booking checks;
- leave the family-hotel page content, title, H1, URL, canonical, indexability, and sitemap entry unchanged.

**Acceptance criteria:**

1. The stay-area title and H1 explicitly promise five areas/bases and do not claim to be the family-hotel comparison.
2. Exact-property guidance remains useful but visibly hands the decision to the 12-hotel page.
3. The two URLs remain canonical, indexable, internally linked, and present once each in the sitemap.
4. No hotel profiles are duplicated on the area page, and no page or destination is added.
5. Native generation, focused lodging-role tests, full tests, local/production-preflight SEO QA, responsive QA, and independent review pass.

**Measurement plan:** preserve this 2026-07-06 through 2026-08-02 baseline. Re-evaluate only after Google records a crawl of the clarified area page and a later finalized window contains enough post-crawl evidence to classify query ownership. Compare area/hotel shares, exact overlap, clicks, and query-level positions without promising a ranking lift or dispatching work from calendar cadence.

## FT-IMP-022 Implementation Result

Implemented, released, and production-verified on 2026-08-04 at commit `e5e41ecbd664220f4359140cfd639e4e2b7a186f` through Pages run `30930924523` after Lovelace cycle-two `PASS`.

- The stay-area title and H1 now say `Where to Stay in San Diego With Kids: 5 Areas Compared`.
- The description and hero copy name the area/base decision and the five compared bases without claiming to be the hotel list.
- The booking section now says to choose the area first and verify the exact hotel second.
- The next section hands named-property selection to the separate 12-hotel page with a descriptive link.
- The ItemList name now describes family stay-area options. Non-visible FAQ schema was removed; the visible handoff carries the current 12-hotel count without adding another page section.
- The hotel page, both URLs, canonicals, indexability states, and sitemap entries remain unchanged.
- The run's first attempt deployed successfully, then its production SEO step received a transient 503 from an unrelated San Antonio URL. The single allowed retry hit a duplicate `github-pages` artifact collision, so the workflow wrapper is red even though `release.json`, both target invariants, and a fresh production SEO run verify the release.

## What This Does Not Justify

- no causal verdict on the July page revisions;
- no broad lodging rewrite;
- no hotel-page rewrite;
- no title/CTR experiment at positions 62.04 and 74.11;
- no merge, redirect, canonical change, noindex, or new URL;
- no indexing request, outreach, external-account mutation, destination expansion, or recurring automation.

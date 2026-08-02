# Las Vegas All-Ages Ranking Diagnostic

Date: 2026-08-02

Action: `FT-RES-015`

Target: https://familytripwise.com/things-to-do/las-vegas-with-kids.html

Market: United States

Decision: promote one bounded existing-page improvement, `FT-AUTH-006`; do not create another Las Vegas URL.

## Executive Decision

Google is interpreting the page as one coherent broad family-activity resource. The protected export assigns 410 of 456 attributable impressions (89.9%) to direct action/list wording, with another 18 impressions in place/visit wording, and the three representative live SERPs have strong ranking-page overlap. No surfaced modifier supports a separate toddler, free, indoor, heat, hotel, or other activity URL.

The page is indexed and has meaningful discovery, but it is not in a CTR-edit lane: the public snapshot reports 464 impressions, zero clicks, and aggregate page-average position 60.69. The latest crawl was July 31, while the same snapshot is finalized only through July 31, so there are **zero finalized performance days after that crawl**. This research cannot call the July revision a ranking failure or attribute the position to one page element.

One concrete usefulness and citation gap is independently visible. The page asks families to process the same 12 choices through a filter set, five starts, an 11-column table, six detail cards, five route shapes, three checks, and FAQs. Important facts such as realistic family admission cost, setting, duration, and the exact current restriction to verify are either generic or scattered. Current ranking pages provide firsthand narratives or long lists, while the official guide provides current breadth; none of the inspected pages offers one consistent, source-dated family cost-and-friction comparison.

Promote `FT-AUTH-006`: replace the repeated middle layers with one concise, source-dated family activity cost-and-friction index for the same 12 choices. This is a user-product and citation-reason improvement, not a claim that the latest rewrite has failed.

## Evidence Classification And Freshness

| Evidence | Collection/finalization | Classification | Permitted use | Limitation |
|---|---|---|---|---|
| `ops/gsc-snapshots/2026-08-02.json` and `.md` | Collected 2026-08-02; performance finalized through 2026-07-31 | Fresh authenticated read-only API; public-safe; finalized-conservative | Page discovery, aggregate page performance, sitemap and URL Inspection | Page average is not a per-query rank; no finalized day follows the July 31 crawl |
| Protected page/query export | GitHub Actions run `30746285285`; aligned through 2026-07-31 | Fresh authenticated protected evidence; 54 rows; stored encrypted/in private operator state only | Query-family composition and rank-lane diagnosis | Complete query rows are private and are not reproduced here; 8 of the public page's 464 impressions are absent under GSC privacy/threshold behavior |
| Three live Google US SERPs | Browser-collected 2026-08-02 with `gl=us`, `hl=en`, `pws=0` | Current observed SERP evidence | Page-type, result overlap, SERP-feature and competitor selection | Location, personalization and ongoing SERP change still apply; no volume claim |
| Seven representative ranking pages | Browser-inspected 2026-08-02 | Current public editorial/official evidence | Structural usefulness, firsthand/authority advantages and freshness weaknesses | Publisher claims and anecdotes are not verified family experience for Family Tripwise |
| Existing Family Tripwise page and generated source | Read 2026-08-02 | Current first-party product evidence | Section inventory, repetition, links and claim-label review | Does not prove how users behave |
| Prior Las Vegas cluster/persona research | Current repository evidence, originally collected 2026-07-22 to 2026-07-28 | Reused durable research hypotheses | Persona/jobs audit and architecture constraints | Personas remain hypotheses, not demographic truth |
| Semrush backlink sample from `FT-AUTH-004` | Collected 2026-07-31 | Reused authenticated third-party sample, two days old | Sitewide authority context | Semrush Authority Score is not a Google metric; links outside its index remain `UNKNOWN` |

## GSC Diagnosis

### Public page evidence

| Snapshot | Page impressions | Page-average position | Interpretation |
|---|---:|---:|---|
| 2026-07-14 | 58 | 55.41 | Early discovery |
| 2026-07-22 | 180 | 56.22 | More discovery, still low visibility |
| 2026-07-28 | 344 | 60.36 | Broader impressions did not move the page into an evaluation or CTR lane |
| 2026-07-31 | 427 | 60.78 | Same broad pattern |
| 2026-08-02 | 464 | 60.69 | Current baseline; indexed and crawled July 31 |

The impression trend shows growing discovery, not a ranking win or loss. Rolling 28-day windows mix page versions and crawl states.

### Protected query-family summary

The exact 54-row export remains outside the public repository. Only aggregated categories and representative public target phrases are recorded here.

| Query-family classification | Rows | Impressions | Share of attributable impressions |
|---|---:|---:|---:|
| Direct action/list wording | 44 | 410 | 89.9% |
| Place/visit wording | 2 | 18 | 3.9% |
| Generic destination-with-kids wording | 8 | 28 | 6.1% |
| **Total attributable export** | **54** | **456** | **100%** |

The reproducible classification is intentionally simple: direct action/list wording contains `activity`, `things`, `stuff`, `to do`, or a `what ... do` construction; place/visit wording contains `place` or `visit`; all remaining rows are generic destination-with-kids wording. The ten largest variants account for 293 impressions (64.3%). Representative public phrases are `things to do in Las Vegas with kids`, `things to do in Las Vegas for kids`, and `kid friendly activities in Las Vegas`. No exported row surfaced a `free`, `cheap`, `budget`, `indoor`, `toddler`, `teen`, `hotel`, `pool`, `rain`, `heat`, `night`, `weekend`, `off Strip`, or `on Strip` modifier.

**Diagnosis:** keep one broad all-ages URL. Query mismatch, CTR copy, and modifier-page expansion are not supported.

## SERP Overlap And Page Type

Observed organic results exclude sponsored units, the AI Overview, Top sights, and People Also Ask. Social and forum results are retained because they occupy real result space.

| Query | Representative recurring results, in observed order | SERP features | Overlap conclusion |
|---|---|---|---|
| `things to do in las vegas with kids` | Zion Adventure Photog; Blogger at Large; SheBuysTravel; Reddit; The Traveling Child; Instagram profile + reel (two URLs); Seattle's Child; Family Vacation Hub | Large ticket/tour ad unit, sponsored results, Top sights, AI Overview, PAA, forum/social | Nine observed URLs; broad editorial/list intent; organic web results start far below the first viewport |
| `things to do in las vegas for kids` | Zion Adventure Photog; Blogger at Large; The Traveling Child; Reddit; SheBuysTravel; Instagram profile + reel (two URLs); Seattle's Child; Nate & Rachael | Similar commercial, forum and social pressure | Nine observed URLs; eight URLs overlap query one |
| `kid friendly activities in las vegas` | Zion Adventure Photog; Blogger at Large; Around the World With Kids; Instagram; Reddit; Seattle's Child; Nate & Rachael; SheBuysTravel | Similar mixed editorial/social SERP | Six domains recur across all three query sets |

The first two sets share eight of nine URLs. The table explicitly counts the Instagram profile and reel as separate URLs; later recurrence is summarized at domain/publisher level. Zion Adventure Photog, Blogger at Large, Reddit, Instagram, Seattle's Child, and SheBuysTravel recur across all three query sets. This is strong observed evidence for one broad query family, not three semantic guesses that need separate pages.

The SERP is unusually crowded above organic results. Even a future top organic result may receive less CTR than a plain ten-blue-links SERP. That makes ranking visibility and genuinely useful differentiation more important than changing the title at position 60.69.

## Representative Ranking-Page Audit

| Ranking page | What it answers well | Honest advantage we cannot copy | Weakness/opportunity we can address |
|---|---|---|---|
| [Zion Adventure Photog](https://www.zionadventurephotog.com/single-post/things-to-do-in-las-vegas-with-kids) | Current-looking list, personally tried choices, photos, some exact price/time detail | Author says she grew up nearby, visits often, and takes her own children | Narrative scanning is slower and facts are not normalized into one family cost/friction model |
| [Blogger at Large](https://www.bloggeratlarge.com/things-to-do-in-las-vegas-with-kids/) | Very broad 26-item coverage and recent update | Contributor input and an established travel publisher | Affiliate-heavy; author explicitly says she has no kids; broad items and promotional material are unevenly family-specific |
| [SheBuysTravel](https://shebuystravel.com/should-you-visit-las-vegas-with-kids/) | Firsthand family trip, concrete favorites and a useful “what to skip” perspective | Original family experience and a mature family-travel brand | Affiliate context and some generic or potentially stale assertions; comparison fields are inconsistent |
| [The Traveling Child](https://thetravelingchild.co/things-to-do-in-las-vegas-with-kids/) | Four-trip family perspective and plentiful original photos | Repeated firsthand family visits | Published in 2021; stale details and prices reduce current operational value |
| [Seattle's Child](https://www.seattleschild.com/kid-friendly-things-to-do-in-las-vegas/) | Practical family constraints including heated pool, driving, lines, low-cost and splurge choices | A concrete first-person family trip | One-family snapshot; operational details can age; no normalized cross-choice cost/friction surface |
| [Family Vacation Hub](https://www.familyvacationhub.com/las-vegas/las-vegas-things-to-do/things-to-do-with-kids-in-las-vegas.html) | Large breadth and firsthand framing | Established destination coverage | Long, dated 2023, hard to scan; copied exact schedules/prices become stale quickly |
| [Visit Las Vegas](https://www.visitlasvegas.com/experience/post/things-to-do-in-las-vegas-with-kids/) | Current official breadth, 31 activities and direct venue links | Destination authority and direct industry access | Promotional; weak on comparison, tradeoffs, realistic family cost and planning friction |

The inspected set proves that a high-quality result does not need a giant list. The defensible opening is **consistent synthesis**: one current, source-dated way to compare cost, time, setting, zone and the exact friction to verify. Family Tripwise must not invent local familiarity, family anecdotes, original photos or personal verdicts.

## Persona And Every-Section Usefulness Audit

Persona labels are research hypotheses from prior Las Vegas query/SERP/community work.

| Persona hypothesis | Job to be done | What the current page does well | Remaining friction |
|---|---|---|---|
| `LV-P1` first-time feasibility planner | Choose one recognizable anchor without a heat/walking/casino marathon | First-trip start, Bellagio anchor, route cautions and itinerary link | Must reconcile similar advice across table, detail, route and check sections; no realistic admission scenario |
| `LV-P2` resort/pool-led family | Decide whether the resort can carry the day and what one outing adds | Resort-reset choice and stay-area link | Needs a clearer route to the named family-hotel comparison and a precise reminder that pool access is property/date-specific |
| `LV-P3` heat/stroller/young-child planner | Find contained stops, indoor backup and shorter sessions | Heat start, setting/rain/nap labels and three younger-child anchors | Generic `Yes`, `Mixed`, and `Check venue` labels make several options hard to distinguish |
| `LV-P4` tween/teen mixed family | Find a real older-child anchor without forcing it onto younger siblings | AREA15, Red Rock, Neon and show choices plus teen-page route | Duplicate older-kid route/detail/check prose; should route specialist intent earlier rather than add more all-ages copy |
| `LV-P5` budget/short-stay planner | Know what the family will roughly spend and which stop can be shortened | Bellagio and Pinball lower-cost start; cost categories | `Paid`, `Varies`, and `Low cost` do not answer realistic family admission; incidental costs need explicit exclusions |

| Visible section | Current job | Decision | Reason |
|---|---|---|---|
| Hero and intro | Define the broad 12-choice all-ages job | **Keep, lightly tighten only if implementation needs it** | Query interpretation is aligned; no title/H1 experiment is justified |
| Six filter controls | Let users narrow by trip style | **Keep** | This is the fastest decision surface and serves all five personas |
| Five useful ways to start | Give a small number of defaults | **Compress to at most three** | First-trip, younger/high-heat and lower-cost starts are distinct; resort and older-kid jobs can route to sibling specialists |
| 11-column activity decision table | Compare all 12 choices | **Replace** | It is wide and several fields are generic; one compact cost-and-friction index can answer the core decision more concretely |
| Six high-friction detail cards | Explain selected risks and logistics | **Merge into the new records** | Much of the content repeats table/check/route advice; retain only choice-specific unresolved details |
| Five route shapes | Sequence choices | **Remove from this page and route to itinerary** | The separate itinerary owns sequencing; short starts provide enough on-page orientation |
| Cluster links | Move to stay, itinerary and teen jobs | **Keep and add the named family-hotel route** | Existing links are useful; the commercial hotel sibling is missing from the contextual block |
| Three checks | Handle volatile rules | **Merge into per-choice current-check fields plus one short global note** | Families should see the relevant restriction beside each choice, not reconcile a separate summary |
| FAQ | Answer broad eligibility/free/indoor questions | **Keep, deduplicate after consolidation** | Matches broad user questions and supports quick reassurance without another URL |
| Sources | Show provenance | **Replace with a source-dated method/update note tied to each record** | One durable record set should make source, checked date, evidence class and unknowns inspectable |

Current visible copy is roughly 2,210 words. The issue is not raw word count; it is repeated decision work. The implementation must remove or replace the old layers rather than append another table.

## Technical, Internal-Link And Authority Diagnosis

### Technical/discovery

- The URL returns 200, is canonical and indexable, appears once in the sitemap, and GSC reports `Submitted and indexed`.
- URL Inspection reports a July 31 crawl.
- No technical defect or indexing request is supported.

### Internal links

- Contextual inbound links exist from Home, About, the Las Vegas stay-area page, itinerary and teen guide; global navigation provides broader site links.
- The target links contextually to stay areas, itinerary and teens.
- The target does not contextually route users to the named Las Vegas family-hotel comparison. Add that route within the existing cluster block; do not create a new page or edit multiple siblings merely to manufacture links.

### Authority

The July 31 Semrush sample found 11 referring domains and 13 backlinks for Family Tripwise, all nofollow and all classified as low-authority SEO spam in that sampled set. The safe conclusion is **zero legitimate referring domains in Semrush's current sample**; links outside Semrush remain `UNKNOWN`. Authority is therefore a plausible sitewide limit, but not proof that backlinks alone explain this URL's position.

Cost alone is not a unique asset. A current non-top result, [KidPaths' Las Vegas family cost guide](https://kidpaths.com/blog/las-vegas-cost-guide), already publishes family-of-four estimates across a much larger activity set. `FT-AUTH-006` earns an authority label only if it adds a more inspectable fact-checking surface: direct official field sources, one explicit admission-only scenario, choice-specific booking/height/weather friction, checked dates, confidence and unresolved unknowns. Another generic list, opaque cost total or unsourced “best” ranking would not create that use.

### Plausible reuse targets, not an outreach list

These current pages establish a page-level reason someone could reference the index. They are hypotheses, not link predictions, endorsements or authorization to contact anyone.

| Public page | Specific reuse/citation need | Confidence and boundary |
|---|---|---|
| [Seattle's Child: kid-friendly things to do in Las Vegas](https://www.seattleschild.com/kid-friendly-things-to-do-in-las-vegas/) | Its practical 2024 family-trip account includes cost and operational details that age. A source-dated admission/current-check matrix could support a future factual refresh while its firsthand story remains its own. | Medium; a direct family-publisher competitor may never cite Family Tripwise |
| [Family Vacation Hub: things to do with kids in Las Vegas](https://www.familyvacationhub.com/las-vegas/las-vegas-things-to-do/things-to-do-with-kids-in-las-vegas.html) | Its broad 2023 guide uses exact schedules and prices across a long page. A maintained official-source record could support updates to the overlapping 12 choices. | Medium; offer data provenance, never a copied rewrite or reciprocal link |
| [Blogger at Large: things to do in Las Vegas with kids](https://www.bloggeratlarge.com/things-to-do-in-las-vegas-with-kids/) | Its current 26-item guide is broad and the author says she has no children. A transparent family admission/friction record could support narrowly sourced family-planning facts without pretending to replace contributor experience. | Low-medium; commercial/affiliate publisher and direct competitor |
| [KidPaths: Las Vegas family cost guide](https://kidpaths.com/blog/las-vegas-cost-guide) | Its current cost-first page validates the editorial need but also creates a high bar. Only directly sourced, explicitly scoped admission data plus friction/unknown fields would be non-duplicative enough to reference. | Low; treat primarily as a product-quality benchmark, not a first outreach prospect |

No outreach is part of `FT-RES-015` or the promoted implementation. Any later contact proposal must recheck the exact page, prove the new index is live and non-duplicative, name the field-level use, and return to the user as a separately gated action. If no legitimate page-level reuse reason survives that recheck, measure the implementation only as usefulness work and do not manufacture an authority campaign.

## Doctrine Diagnosis

| Lane | Verdict | Evidence |
|---|---|---|
| Technical/indexing | Not limiting enough to act | Indexed, current crawl, canonical, sitemap present |
| Query/intent alignment | Healthy | 89.9% of attributable impressions use direct action/list wording and another 3.9% use place/visit wording; strong three-query SERP overlap |
| CTR/snippet | Ineligible | Aggregate page position 60.69 and a heavily featured SERP; title changes cannot solve visibility |
| Content usefulness | One bounded gap | Repeated layers and generic labels leave family cost/current checks unfinished |
| Internal links | Minor gap | Named family-hotel sibling missing from contextual cluster routing |
| Authority/citation | Material sitewide gap | No legitimate referring domains in the current Semrush sample; current page lacks a uniquely reusable fact surface |
| Performance evaluation | Too early | Zero finalized performance days after the latest crawl |

## Promoted Action: FT-AUTH-006

**Title:** Replace repeated Las Vegas planning layers with a source-dated family activity cost-and-friction index.

**Target:** https://familytripwise.com/things-to-do/las-vegas-with-kids.html

### Bounded product scope

Use exactly the 12 choices already on the page. A single validated embedded record set should power one compact visible index and an optional client-side CSV; it must not create a new data URL or canonical/indexable page.

Recommended visible columns:

1. Choice and direct official source.
2. Approximate admission for a named reference family of four: two adults plus two children ages 6 and 10, admission only, before optional add-ons, transport, parking and meals. Use a clearly dated range or `VARIABLE / VERIFY` when public pricing cannot support one figure.
3. Planning time.
4. Indoor, outdoor or mixed setting.
5. Las Vegas zone.
6. Exact check before going: timed entry, height split, show effects, weather, pool access or other choice-specific issue.

Each record must also retain checked date, evidence class, confidence and unresolved unknowns. Approximate family costs and planning times are Family Tripwise estimates, not guarantees. Direct official sources govern current prices and policies.

Replace the 11-column table, six long detail cards, five route cards and three repeated check cards. Keep the filters, at most three concise starts, FAQ, and cluster routes. Add a contextual route to the existing family-hotel comparison. Do not expand the list merely to match competitors.

### Acceptance criteria

1. Exactly the current 12 activity choices remain; title, H1, URL, canonical, indexability and sitemap entry are unchanged.
2. One structured record source drives the visible index, ItemList schema and optional client-side CSV without a separate public data URL.
3. Every public price/policy fact has a direct official source and 2026 checked date; estimates, variable prices, inclusions, exclusions, confidence and unknowns are explicit.
4. The new surface replaces the old table/detail/route/check repetition. Total visible words and decision layers do not increase.
5. Mobile layouts at 320, 390 and 1440 pixels preserve row identity, readable labels, keyboard access, filters and non-JavaScript content.
6. The cluster block links to stay areas, family hotels, itinerary and the teen specialist without changing sibling-page ownership.
7. Generator idempotency, unrelated-output stability, focused/full/state/SEO/source/privacy/schema/CSV/responsive QA and independent review pass before release.
8. No personal-experience, safety, universal suitability, exact route/stroller, or unsupported sensory claim is introduced.
9. No indexing request, outreach, paid placement, external-account mutation, new destination, new URL or recurring automation is included.

### Measurement plan

Baseline:

- 464 public page impressions, zero clicks and page-average position 60.69 for the 28-day window finalized through July 31;
- 54 protected query rows and 456 attributable impressions, with 89.9% in direct action/list wording and another 3.9% in place/visit wording;
- July 31 latest crawl and zero finalized post-crawl performance days;
- zero legitimate Family Tripwise referring domains in Semrush's July 31 sample, with links outside that sample `UNKNOWN`.

Release checks are product and technical invariants, not ranking success. After Google records a later crawl and finalized protected query data contains a meaningful post-release window, compare aligned query-family discovery and row-average position without claiming causality from a rolling window. Track legitimate citations/referring domains and privacy-safe referral traffic only when evidence exists. Do not create a calendar-triggered observation action.

## Rejected Alternatives

- **New modifier pages:** no protected-query or SERP-overlap support.
- **Add more than 12 attractions:** ranking-page list length varies widely; count alone does not finish a family decision.
- **Title/meta rewrite:** position 60.69 is outside the doctrine's CTR lane.
- **Another itinerary layer:** the sibling itinerary already owns sequencing.
- **Immediate outreach:** the page needs a specific reusable asset first, and external contact remains user-gated.
- **Declare `OBSERVE` only:** performance evaluation must wait, but the product/citation deficiency is independently concrete and bounded.

## Source Register

Checked 2026-08-02 unless noted:

- `ops/gsc-snapshots/2026-08-02.json` and `.md`
- Protected workflow run `30746285285`; complete decrypted rows retained only in private central operator state
- Current target page: https://familytripwise.com/things-to-do/las-vegas-with-kids.html
- Prior cluster research: `docs/research/next-city-prioritization-las-vegas-cluster.md`
- Prior ranking map: `docs/research/existing-page-ranking-opportunity-map-2026-07-29.md`
- Current doctrine: `strategy/seo-doctrine.md`
- Current authority sample: `docs/research/san-diego-existing-page-authority-gap-2026-07-31.md`
- Google result pages for the three representative phrases, collected with US/English and personalization-disabled query parameters
- [Zion Adventure Photog](https://www.zionadventurephotog.com/single-post/things-to-do-in-las-vegas-with-kids)
- [Blogger at Large](https://www.bloggeratlarge.com/things-to-do-in-las-vegas-with-kids/)
- [SheBuysTravel](https://shebuystravel.com/should-you-visit-las-vegas-with-kids/)
- [The Traveling Child](https://thetravelingchild.co/things-to-do-in-las-vegas-with-kids/)
- [Seattle's Child](https://www.seattleschild.com/kid-friendly-things-to-do-in-las-vegas/)
- [Family Vacation Hub](https://www.familyvacationhub.com/las-vegas/las-vegas-things-to-do/things-to-do-with-kids-in-las-vegas.html)
- [Visit Las Vegas](https://www.visitlasvegas.com/experience/post/things-to-do-in-las-vegas-with-kids/)
- [KidPaths family cost guide](https://kidpaths.com/blog/las-vegas-cost-guide)

## Stop Rules

- Stop if implementation cannot produce direct current official sources for all externally checkable fields.
- Stop the authority framing if the finished index does not materially exceed opaque family-cost lists through source transparency, explicit scope, friction and unknowns.
- Use `VARIABLE / VERIFY` or `UNKNOWN`; never manufacture one neat family price.
- Do not add content without removing the older overlapping layer.
- Do not treat a later crawl, impression increase, citation or rank change as causal proof by itself.
- Do not create a new page, request indexing, contact a prospect or mutate an external account under this action.

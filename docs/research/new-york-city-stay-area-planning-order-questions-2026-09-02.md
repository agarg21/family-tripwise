# New York City Stay-Area Planning-Order Questions

Action: `FT-RES-027` / `SRR-048`

Checked: 2026-09-02

Evidence level: current qualitative community evidence plus prior proxy-reviewed interface evidence. This is not demand research, a representative sample, user testing, observed behavior, satisfaction evidence, or firsthand travel evidence.

Review outcome: James (`01a06168-76c7-7423-8430-58011ce9cb0d`) returned cycle-three `PASS` with no remaining P0-P3 after correcting the April hard-constraint interpretation, prevalence language, and one stale success signal.

## Decision

`NARROW` unselected `IMP-048`; preserve both live pages and URLs.

The five-question sample contains two initial planning states, but the two open-base cases do not resolve the same way. One family's points and free-night economics determine the downtown booking before itinerary sequencing; the other retains several viable areas and still needs early trip blocks to compare them. Three families already treat lodging as fixed or assumed and have sequenced their days; they need route, overload, verification, or removal help rather than an itinerary-first detour.

Retain one conditional candidate only for the unresolved state: after checking whether points, free nights, room inventory, or another hard property constraint already determines the base, offer a compact route beside the existing five-start area decision when multiple viable bases remain and the family has not chosen its first two days. Do not make the itinerary route a universal prerequisite, add an area, or interrupt the first-two-days-known path that completed all seven `FT-RES-026` steps.

No implementation is selected in this action.

## Falsifiable Hypothesis

Current NYC family questions will show that an undecided base can coexist with unordered cross-city anchors, while families with fixed lodging or sequenced days need a different answer. If that unresolved state appears after hard property constraints are checked, `IMP-048` should remain explicitly conditional; if current questions already sequence days or a hard lodging constraint decides the base first, the candidate should be rejected for that case.

## Evidence Boundary

- Five public questions dated January 18 through June 18, 2026 were inspected on September 2, 2026.
- Only source date and URL, paraphrased planning state, decision constraints, and answer job are retained. No username, copied thread text, private detail, or personal identifier is retained.
- The records are qualitative examples. The two-versus-three split describes only this bounded sample and is not a prevalence, demand, behavior, conversion, or interface-preference claim.
- Community statements are not used as verified route, safety, stroller, transit, hotel, or family-fit facts.
- `FT-RES-026` supplies the reproducible interface result: the unordered-anchor case is `PARTIAL`, the first-two-days-known control is `YES`, and the existing itinerary route is accurate but late. That proxy result is not user testing.

## GSC Boundary

The newest available record is recent reused authenticated read-only API evidence collected September 1 and finalized through August 30. It reports 1,913 property impressions, 3 clicks, aggregate average position 65.83, and 24 of 28 inspected URLs indexed. The NYC stay-area page has 51 impressions at page-average position 44.33, is indexed, and was last crawled August 29. The itinerary has no performance row and is not indexed.

The public snapshot contains no aligned query cohort. GSC is orientation and a crawl boundary only; it does not select this research, validate the question pattern, identify a CTR problem, or authorize a page change.

## Question Register

| Source date | Paraphrased planning state | Decision constraints | Work a useful answer must perform | Candidate implication |
|---|---|---|---|---|
| 2026-01-18 | Lodging in Long Island City is fixed and a three-and-a-half-day plan has already been assigned around three major anchors with generated transit and weather branches. | Three school-age children, arrival capacity, multiple boroughs, rainy-day alternatives, route accuracy, and AI-generated details that require checking. | Audit geographic grouping, capacity, source accuracy, and removal rules from the fixed base. | No itinerary-first recovery is needed; this is a sequenced-days control. |
| 2026-04-11 | The base is initially open between World Trade Center and Times Square point options; only a loose rule of one or two daily priorities exists, but a follow-up says points and free-night economics determine the downtown booking. | Infant plus preschooler, stroller and subway friction, late-afternoon energy limit, hotel-points inventory, possible evening childcare, and a five-to-six-night stay. | Check the hard property and points constraint first; sequence early blocks only if more than one viable base remains. | Mixed/contradictory for the route hypothesis: it counts as an initial open-base state but does not independently support itinerary-first recovery. |
| 2026-05-26 | Arrival and four days are sequenced around Midtown, Lower Manhattan, Brooklyn, and the Upper East Side; lodging is treated as a given but its area is not material to the question. | Teen celebration trip, older adults, timed tickets, walking burden, day overload, and moving one neighborhood block between days. | Rebalance the day sequence and remove overload while preserving fixed anchors. | No universal recovery route is needed; the family already owns the upstream input. |
| 2026-05-31 | A Brooklyn base is fixed and four days are scheduled in detail; the family asks mainly for route efficiency and subtraction. | One child, budget and pass tradeoffs, late arrival, multiple subway legs, timed activities, and a stated preference for a full but flexible pace. | Check route logic, realistic capacity, and what to drop from each day. | Sequenced-days control; an unconditional itinerary prompt would add friction. |
| 2026-06-18 | A six-day interest list spans Manhattan, Brooklyn, and possibly Queens while lodging remains open across six candidate areas. | One school-age child, basketball, science, bookstores, food and neighborhood interests, one game, and a preference against checklist tourism. | Sequence the early high-value blocks, reduce the base set from those blocks, then verify exact lodging and transport tradeoffs. | Reproduces the unresolved open-base state; supports a conditional recovery route. |

## Planning-State Result

| State | Records in this bounded sample | What the page journey should do |
|---|---:|---|
| Open base plus unordered or loosely grouped anchors | 2 | Check hard property constraints first; offer one nearby, optional itinerary-first route only if multiple viable bases remain. |
| Fixed or assumed lodging plus sequenced days | 3 | Keep the current area/itinerary path out of the way; help with route, capacity, verification, and removal decisions. |
| Fixed base plus genuinely unsequenced days | 0 | Draw no conclusion; this state was not observed in the bounded sample. |

The sample supports a bounded routing rule, not a universal planning order. The candidate should detect both a hard property constraint and missing day-order input rather than imply that every family must complete the itinerary first.

## Existing-Page Fit

The current stay-area page asks readers to use their first two days, likely midday return, and exact hotel entrance before deciding. That is the right conditional model when those inputs exist. `FT-RES-026` shows the same page cannot responsibly choose between Upper West Side, Midtown, and Downtown when the family supplies only unordered anchors.

The current itinerary sibling owns the missing sequencing job. The remaining possible defect is discoverability of that recovery route, not missing area inventory, hotel inventory, a recommender, or another URL.

## Learning Result

Hypothesis result: retain and narrow.

Reusable lesson: family planning pages should distinguish hard constraints, missing-input recovery, and the primary path. Check whether points, room inventory, or another non-negotiable already decides the base; only then expose a small conditional route to the sibling sequencing job instead of making every reader traverse a generic funnel.

Confidence: medium that the bounded sample contains materially different planning states and that a universal detour would be wrong. One current question plus the prior `FT-RES-026` task supports the unresolved multiple-base case; the other open-base question is contradictory for the route hypothesis because points decide the booking. Confidence is low for prevalence, preference, behavior, satisfaction, search demand, ranking implications, or route effectiveness.

Next falsification trigger: a separately selected pre/post task shows that a compact conditional route improves the unresolved unordered-anchor case without worsening the known-days control; another reviewer resolves the remaining multiple-base question without sequencing; newer questions show hard property constraints usually settle the base before day order is needed; or real behavior evidence shows the existing late route is already found and used.

## Source Register

All sources were inspected on 2026-09-02:

- [January 18 family itinerary review](https://www.reddit.com/r/visitingnyc/comments/1qgeto7/nyc_itinerary_review_late_march_early_april/)
- [April 11 first trip with an infant and preschooler](https://www.reddit.com/r/visitingnyc/comments/1si6ifi/first_time_in_nyc_maybe_with_4yo_and_10mo_old/)
- [May 26 multigenerational first-trip itinerary](https://www.reddit.com/r/visitingnyc/comments/1toi7o1/first_trip_for_family_with_teens/)
- [May 31 four-day family route review](https://www.reddit.com/r/visitingnyc/comments/1tt3gpe/our_familys_potential_4day_itinerary_please_poke/)
- [June 18 first trip with an eight-year-old](https://www.reddit.com/r/visitingnyc/comments/1u96bm9/first_time_in_nyc_with_an_8yearold_looking_for/)
- [Family Tripwise NYC stay-area page](https://familytripwise.com/where-to-stay/new-york-city-with-kids.html)
- [Family Tripwise NYC itinerary page](https://familytripwise.com/family-itinerary/new-york-city-with-kids.html)

Privacy check: this public-repository artifact contains no credentials, tokens, protected query rows, complete raw GSC export, usernames, personal data, copied thread text, reviewer identity, or claimed firsthand experience.

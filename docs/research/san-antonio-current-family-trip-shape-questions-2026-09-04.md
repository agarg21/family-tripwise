# San Antonio Current Family Trip-Shape Questions

Status: completed and review-clean for `FT-RES-030` / `SRR-051`

Prepared: 2026-09-04

Scope: four current public family-planning questions; qualitative evidence only

## Decision

Preserve the existing five-page San Antonio architecture. The four-question sample does not support adding attractions, hotels, a modifier page, or another itinerary. It supports a joined trip-shape task spanning the current all-ages activity, teen activity, itinerary, stay-area, and family-hotel roles.

The recurring work in this bounded sample is not simply "name more things to do." The questions combine some of the following before a useful answer can be given:

- convert nights and travel days into usable activity blocks;
- choose one age- and interest-led anchor without overloading a mixed-generation day;
- retain an indoor, lower-exposure, free, or removable backup;
- decide whether the base is fixed, Downtown-led, cultural-corridor-led, or property/resort-led;
- verify room occupancy and sleeping function rather than infer it from a room label;
- choose a car, rideshare, or car-light hypothesis from the actual day plan; and
- keep exact safety, access, route, price, weather, and operating details as current checks rather than assurances.

This is a qualitative pattern within four deliberately selected questions, not evidence of demand, prevalence, user satisfaction, or search performance.

## Method

Collection date: 2026-09-04.

Surface: public web search and publicly readable Reddit pages. No account, voting, messaging, posting, private data, or copied thread text was used.

Discovery queries:

- `site:reddit.com/r/sanantonio family trip kids San Antonio itinerary 2026`
- `site:reddit.com San Antonio with kids family vacation heat 2026`
- `site:tripadvisor.com San Antonio family itinerary kids forum 2026`
- `San Antonio family trip kids where stay itinerary 2026 forum`

Screening rule: retain recent visitor-family questions that expose at least two decision-changing constraints and map to an existing Family Tripwise page role. Exclude removed or retrospective posts that do not preserve a usable planning question, local-only activity requests without a trip decision, and sources whose visible date or context cannot be established. One 2025 control is retained because it supplies a fixed-base/no-car planning state that differs materially from the three 2026 questions.

Only source date and URL, paraphrased planning state, decision constraints, and answer work are retained below. Usernames, personal details beyond decision-changing party composition, and source-owned prose are omitted.

## Question Records

| Record | Source date and URL | Paraphrased planning state | Decision-changing constraints | Work a useful answer must perform |
|---|---|---|---|---|
| `SA-Q1` | 2026-02-27; [public question](https://www.reddit.com/r/sanantonio/comments/1rg9kia/spring_break_in_san_antonio_what_are_the/) | A short road trip must work for two young children, two older adults, and one parent before the group continues toward home, with an optional stop in another city. | Two or three hotel nights; ages three and six; mixed generations; paid versus free choices; base selection; a room for five; a physical-safety question that cannot be converted into an assurance. | Normalize usable blocks, choose a small paid/free mix, compare base consequences, expose exact room occupancy and sleeping checks, and route safety concerns to current official/local verification rather than rank an area as safest. |
| `SA-Q2` | 2026-06-02; [public question](https://www.reddit.com/r/sanantonio/comments/1tv6ra8/activity_recommendations_for_kids_810/) | Visiting children need activities that also work for two older adults who may not tolerate the midday heat; indoor options are specifically requested. | Ages eight to ten; two adults in their seventies; midday heat; several obvious candidates are outdoors; one child has a stated art interest. | Reduce the activity universe by age, indoor/heat role, interest, duration, and location; keep outdoor options conditional; identify the exact current venue and weather checks. |
| `SA-Q3` | 2026-08-18; [public question](https://www.reddit.com/r/usatravel/comments/1vrzgzd/itinerary_help_san_antonio_tx/) | A seven-night first Texas trip has a detailed city, ranch, and resort outline but needs a realism check, lodging feedback, and a transport plan. | One teenager plus young adults; history and horse interest; relaxation versus adventure; two city nights plus two non-city/property stays; rideshare in the city and possible rental car outside it; multiple desired anchors. | Separate the two city days from the external ranch and resort jobs, test attraction density and age fit, choose transport from the actual route, and distinguish a city hotel, destination property, and outside-region stay without implying that one page owns the whole trip. |
| `SA-Q4` | 2025-11-13; [public question](https://www.reddit.com/r/sanantonio/comments/1owasz5/visiting_for_thanksgiving_big_family_group/) | A large family group has a fixed River Walk stay and fixed dinners but must organize child-focused daytime activities without a car. | Three children ages four to eight; multi-household group; fixed River Walk base; no car; rideshare versus visitor transport; several cultural-corridor and Downtown priorities. | Treat the base as fixed, group daytime anchors before choosing transport, keep group movement and current service as checks, and avoid reopening the hotel decision when the actual unresolved job is daytime sequencing. |

## Supported Decision Model

The records do not all share every constraint. They do share the need to establish trip state before recommending inventory.

| Decision output | Supporting records | Existing owner | Boundary |
|---|---|---|---|
| Usable city blocks and one main job per block | `SA-Q1`, `SA-Q3`, `SA-Q4` | Family itinerary | The current page owns one-, two-, and three-day city shapes. It does not need to absorb a separate ranch, another city, or a seven-night regional itinerary from one question. |
| All-ages anchor, indoor/heat pivot, free option, and deletion rule | `SA-Q1`, `SA-Q2`, `SA-Q4` | All-ages activity guide plus itinerary | Activity selection owns the shortlist; itinerary owns sequencing and removal. Current venue operation and weather remain verify-current. |
| Teen-led interest and mixed-age split | `SA-Q3` | Teen activity guide plus itinerary | One record supports testing the existing teen route, not adding another teen page or claiming a broad preference. |
| Base from the first days, distant anchor, and likely return | `SA-Q1`, `SA-Q3`; fixed-base control in `SA-Q4` | Stay-area guide | The page should help only when the base is open. A fixed River Walk booking should proceed to route/transport work rather than restart area selection. |
| Named room, occupancy, sleeping function, and resort-versus-city-property role | `SA-Q1`, `SA-Q3` | Family-hotel comparison | A room label or two beds does not establish registered occupancy, sleeping surfaces, or separation. Exact inventory and policies remain direct checks. |
| Car, rideshare, or car-light hypothesis | `SA-Q3`, `SA-Q4`; partial support in `SA-Q1` | Stay-area guide plus itinerary | The day sequence should precede the transport choice. No exact route, travel-time, access, or safety verdict is supported by these questions. |

## Existing-Page Check

Repository inspection on 2026-09-04 confirms that the current pages expose the needed component roles:

- the 13-choice all-ages page has age, indoor/heat, budget, time, and area fields plus current-check routes;
- the ten-choice teen page provides interest-led starts and routes back to the all-ages, itinerary, stay, and hotel roles;
- the itinerary provides one-, two-, and three-day shapes, age/heat/budget/base pivots, a protected reset, and deletion rules;
- the stay-area guide compares five bases by first days, reset, transport, friction, and exact hotel check; and
- the hotel comparison distinguishes city hotel versus resort role, room function, rough total-night context, occupancy checks, and current property verification.

This inventory shows page-role coverage, not whole-task completion. It does not establish that a reader can traverse the five pages efficiently or reconcile the inputs without repetition.

## Result

`PRESERVE` the five page roles and current URL set. Add no attraction, hotel, duration page, modifier URL, safety claim, or generic San Antonio layer from this sample.

Retain one unselected task hypothesis for a later desktop/mobile walkthrough:

> Starting with a two- or three-night mixed-generation party of five, can the current San Antonio cluster produce one realistic day shape, one paid anchor, one free or indoor heat backup, a provisional base, a room setup that can legally and functionally accommodate five, a transport hypothesis, and the next exact checks through normal visible links without restarting settled decisions or inventing safety certainty?

The later task should use a fixed-base control modeled on `SA-Q4`. A page change is eligible only if that walkthrough reproduces a material `PARTIAL` or `NO` under the persona protocol and a separately selected action identifies the smallest proportional fix.

## Evidence Boundary

- The four questions are qualitative examples, not a demand sample or representative population.
- Community answers were not adopted as current facts or firsthand Family Tripwise evidence.
- The recent September 3 GSC snapshot is reused orientation only. It is finalized through September 1, has no public aligned query cohort, and cannot validate the question pattern or select a page edit.
- Page-role inspection uses the current repository output. It is not a live behavioral test, user test, satisfaction measure, ranking evaluation, or cross-page task result.
- Safety, exact transport, route, access, price, weather, hours, occupancy, and operating details remain direct current checks.

## QA And Independent Review

- Focused San Antonio page-role tests pass 22/22 and the full repository suite passes 162/162.
- Operator-state, content-freshness, local and production SEO, all 52 public GSC snapshot validations, strict JSON with 81 unique action IDs, exact nine-path/no-site scope, source/privacy, and whitespace checks pass.
- Independent read-only reviewer `01a06bac-0529-7de3-abcb-bca4477cabb2` verified all four public source dates, proportional privacy-safe paraphrases, the five shipped page roles, September 3 GSC figures and limits, the preserve decision, fixed-base control, and one unselected task. Cycle one returned `PASS_WITH_P3` for an overbroad `complete cost` phrase in the roadmap summary; the summary now says `current cost checks`. Cycle two confirmed that fix but returned `FAIL` for prematurely recording its own verdict. Cycle three verified the chronology correction and complete candidate, returning `PASS` with no P0-P3.

## Confidence And Falsification

Confidence: medium that trip-state routing is the useful shared model for these four questions; low for prevalence, demand, user behavior, satisfaction, or the effectiveness of the current cross-page journey.

Reusable lesson: classify whether lodging and transport are open or already fixed before routing. The same family question may need activity, itinerary, area, and room evidence, but page-role coverage is not proof that the joined journey works.

Falsification triggers:

- an independent cross-page task completes every required output directly with no avoidable restart or missing decision;
- another current sample is dominated by standalone activity discovery with no trip-shape constraints;
- aligned query evidence reveals a different search interpretation;
- official facts conflict with a visible current page claim; or
- actual behavioral or participant evidence contradicts the proxy model.

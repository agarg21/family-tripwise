# Product And AI Plan

Last updated: 2026-08-01

## Product Positioning

Family Tripwise is a family-travel decision assistant, not a generic AI travel blog and not a publisher claiming local or firsthand experience it does not have.

The product should turn fragmented online information into a fast, evidence-aware answer for a family's actual constraints:

- Which area and hotel type fit our trip shape?
- Which property facts and recent online-review themes matter for our children?
- Which activities fit this age mix, weather, pace, and budget?
- What should we group together, skip, or keep as a backup?
- Which recommendation is an official fact, an estimate, a recurring review signal, or a Family Tripwise interpretation?

The durable product is the maintained evidence layer plus the decision experience built on it. AI-generated prose is implementation help, not the moat.

## Shared Evidence Layer

Pages, tools, downloads, structured data, and agent answers should reuse validated claim-level records rather than generate independent factual narratives.

Each externally checkable record should support, where applicable:

- stable entity and destination identifiers;
- claim or comparable field;
- source URL and evidence class;
- checked date and volatility/expiry handling;
- direct fact, estimate, or editorial derivation;
- confidence and unresolved unknowns;
- supporting and conflicting online-review themes;
- family constraints affected;
- public wording boundary and required verification step.

Evidence classes remain distinct:

- official property, attraction, transit, tourism, or government fact;
- date-specific booking or price observation;
- recent online-review signal;
- public community question or hypothesis;
- map/geospatial observation;
- model-derived estimate;
- Family Tripwise editorial interpretation;
- human-verified experience.

Do not retain reviewer identity, raw review exports, copied review text, private booking data, or source-owned media. Use review platforms and public discussions within their access and reuse rules.

## Research Pipeline

1. **Discover:** identify entities, parent questions, current SERPs, and source coverage.
2. **Capture:** record claim-level evidence with source class, date, and volatility.
3. **Normalize:** align comparable fields across hotels, attractions, areas, and itinerary anchors.
4. **Evaluate:** distinguish source quality by claim type, detect contradictions, and downgrade unsupported certainty.
5. **Synthesize:** create criteria-based comparisons, trip-style fits, avoid-if notes, estimates, and exact recheck prompts.
6. **Publish:** expose a useful default on the indexable page and reuse the same records for structured outputs.
7. **Answer:** let the agent route the user through those records using family constraints and show concise reasons and evidence state.
8. **Refresh:** update records when volatile fields expire or evidence changes; do not rewrite pages merely because a timer ran.

## Agent Experience

The agent should ask only for constraints that materially change the answer. A useful first interaction might need destination, child ages, trip length, transport mode, rough budget, and one or two non-negotiables.

The answer should:

- give a strong default immediately;
- show two or three alternatives when tradeoffs are real;
- state the criteria that produced the recommendation;
- distinguish current facts, online-review signals, estimates, and unknowns;
- offer the next useful decision rather than a wall of prose;
- link to the corresponding indexable city page and direct verification sources;
- avoid firm safety, accessibility, exact route, room-selection, or universal family-fit claims without sufficient evidence and required human review.

The agent must not be the only place useful content exists. Search pages should remain satisfying without interaction; the agent provides speed and personalization over the same evidence.

## Core Product Surfaces

### 1. Where-To-Stay Recommender

Inputs:

- destination and trip length;
- child ages and pace;
- rough lodging budget;
- car, transit, or mixed transport;
- hotel versus apartment preference;
- pool, kitchen, breakfast, laundry, room-separation, or anchor-attraction needs.

Outputs:

- two or three evidence-derived area or property-type starts;
- fit criteria and avoid-if notes;
- current hotel/area checks;
- nearby family anchors and map context;
- uncertainty and direct verification links.

### 2. Family Hotel Comparison

Inputs:

- destination or candidate hotels;
- family priorities and approximate budget;
- dates or season when needed for a current price observation.

Outputs:

- comparable official room and amenity facts;
- rough current nightly price bands, not fake booking precision;
- bounded recent online-review themes, conflicts, and sample/date context;
- trip-style fit tied to explicit criteria;
- unresolved checks before booking.

This surface follows `docs/plan/hotel-research-engine.md`. Do not call it a Family Tripwise hotel review unless the content is actually based on Family Tripwise firsthand experience.

### 3. Activity Decision And Logistics

Inputs:

- destination, child ages, pace, weather, budget, and must-do interests.

Outputs:

- compact activity shortlist and comparison;
- current admission/booking/closure checks;
- estimated time and cost bands;
- indoor/outdoor role, area grouping, and backup role;
- exact unknowns that still matter.

The San Diego Family Attraction Logistics Index is the first public record-reuse pattern for this surface.

### 4. Itinerary And Pacing

Inputs:

- destination, trip length, ages, reset/nap needs, transport preference, and must-do anchors.

Outputs:

- day shapes rather than unsupported minute-by-minute precision;
- map grouping and lower-friction sequencing hypotheses;
- rest and weather pivots;
- stop rules and skip guidance;
- current checks for tickets, hours, closures, and conditions.

### 5. Evidence-Aware Follow-Up Agent

The follow-up agent should answer questions such as:

- "Which of these hotels has the most reliable pool setup for younger kids?"
- "What changed since this page was last checked?"
- "Why did you recommend this area for us?"
- "Which recommendation depends on mixed online reviews?"

It should cite the internal evidence state and send the user to the direct source when a volatile fact matters.

## Trust Rules

- Do not invent personal or local experience.
- Do not turn an aggregate rating into a quality conclusion.
- Do not treat a platform-generated review summary as independent verification.
- Do not present one community post as demand, prevalence, or fact.
- Keep estimates and interpretations clearly distinguishable without defensive page copy.
- Require human review for personally verified experience, safety assurance, exact route/stroller practicality, materially consequential room-selection advice not supported by current property evidence, and firm family-suitability claims the record cannot independently support.
- Prefer `UNKNOWN` and a useful recheck prompt over false precision.

## Product Success

Evaluate whether the product:

- gets a parent to a useful shortlist or plan faster;
- reduces the number of tabs and repeated checks required;
- keeps page and agent answers consistent;
- exposes meaningful conflicts instead of smoothing them away;
- earns return use, downloads, citations, or referral traffic because the evidence is useful;
- improves aligned query discovery and rankings over multi-month windows.

Do not use generated word count, page count, number of filters, third-party authority score, or chatbot message volume as product success metrics.

## Near-Term Sequence

During the August 2026 depth cycle:

1. Treat San Diego as the primary evidence and authority city.
2. Improve one existing Las Vegas or Chicago page only after current query/SERP evidence selects it.
3. Define a small agent prototype over existing validated records before building broad conversational infrastructure.
4. Keep outreach, indexing requests, external accounts, and new-city publication separately gated.

This is a direction, not a recurring schedule or page quota.

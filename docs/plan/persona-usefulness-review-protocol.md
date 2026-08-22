# Task-Based Persona Usefulness Review Protocol

Last updated: 2026-08-22

## Purpose

Use evidence-grounded family scenarios to find concrete decision failures on an existing page before changing it. This is a structured expert walkthrough, not a simulation of human preference and not a substitute for observing real users.

The useful question is not "would this persona like the page?" It is:

> Given a realistic planning task and only the information this page exposes, can this family reach a defensible next decision without reconstructing the answer elsewhere?

## Evidence Levels

| Label | What it means | What it may support |
|---|---|---|
| `proxy-reviewed` | A reviewer completed a reproducible task walkthrough using source-grounded scenarios, the live page, current SERPs, and known usability checks. | Candidate defects, preserve decisions, and bounded improvement hypotheses. |
| `behavior-supported` | The hypothesis also has aligned observed evidence such as a coherent GSC query cohort, recurring current community questions, search logs, or measured interface behavior. | Higher-confidence prioritization and later action selection. It still does not prove satisfaction. |
| `user-validated` | Actual or likely users were observed completing the task, or first-party behavioral evidence directly measures the task outcome. | Claims about user success, confusion, preference, or satisfaction within the tested population and conditions. |

Never call an AI persona a user, participant, customer, parent, local, or traveler. Never call a proxy walkthrough user testing. Public GSC page averages, SERP rank, clicks, and forum anecdotes do not by themselves validate usefulness.

## Scenario Construction

Personas are task hypotheses, not fictional biographies. Use only attributes that change the decision.

For each scenario record:

- evidence-derived job to be done;
- starting information the planner already has;
- family and trip constraints supported by queries, community questions, review themes, or product evidence;
- required output, such as a two-property shortlist or a realistic day shape;
- success criteria visible on the page;
- consequential unknowns the page should expose;
- likely failure modes;
- source and checked date for every external input.

Prefer four to six scenarios covering the primary job, important constraint variants, and one skeptical or adversarial case. Do not add demographic color that does not change the task.

## Walkthrough

Run the current production page on desktop and at 390-pixel mobile width. Use the page as a reader would; do not rely on repository knowledge that is absent from the interface.

For each scenario answer:

1. **Start:** Is there a useful default or route before the reader must understand the full page?
2. **Reduce:** Can the reader narrow the universe to at most two or three plausible options?
3. **Compare:** Are the decisive fields available and comparable for every remaining option?
4. **Trace:** Can the reader distinguish official fact, online-review signal, estimate, editorial interpretation, conflict, and unknown?
5. **Decide:** Can the reader state a defensible provisional choice and the reason for it?
6. **Verify:** Is the next volatile or booking-specific check explicit and close to the decision?
7. **Recover:** When evidence is missing or conflicts, does the page help the reader continue without inventing certainty?

Record `YES`, `PARTIAL`, `NO`, or `NOT IN PAGE ROLE` for each step and quote no source-owned prose. A `NOT IN PAGE ROLE` result is not a defect when the page clearly routes to the correct sibling job.

## Observable Checks

Do not invent reading times, emotions, heatmaps, satisfaction scores, or conversion intent. Record observable proxies instead:

- viewport position of the first useful decision surface;
- number and order of decision layers;
- repeated fields or claims a reader must reconcile;
- number of options remaining after each step;
- whether comparison fields use one consistent record source;
- whether volatile facts have a direct verification path;
- whether labels reveal evidence class and freshness;
- page width, horizontal overflow, broken interaction, and keyboard/accessibility defects;
- whether a plausible wrong conclusion follows from the presentation.

Avoid a composite persona score. It creates false precision and hides which task failed.

## Defect Severity

| Severity | Definition | Default action |
|---|---|---|
| `P1` | The page cannot complete its core job, creates a material trust or safety risk, or can reasonably drive a consequentially wrong decision. | Correct promptly, including during observation when policy permits. |
| `P2` | A named high-value scenario is materially blocked, buried, inconsistent, or likely to require unnecessary reconstruction elsewhere. | Promote one bounded improvement when evidence and observation rules permit. |
| `P3` | Minor scan, wording, ordering, or polish friction that does not block the task. | Batch only with later qualified work; do not edit from cadence. |

Multiple P3s do not automatically become a P2. A page does not fail because it is long; it fails when length or repetition obstructs a named decision.

## Adversarial Checks

Before promoting an action:

- run a skeptical scenario that looks for unsupported certainty, missing cost, or disagreement;
- test whether removing or moving a section would preserve all task outputs;
- check whether the proposed fix adds another control or layer instead of reducing effort;
- distinguish an authority advantage we cannot claim from a structural opportunity we can improve;
- ask whether the task belongs on this URL or a clearly linked sibling page;
- state what evidence would falsify the finding.

## Decision Rule

Promote at most one existing-page improvement from a review. It must name:

- the failed scenario and step;
- the observable page evidence;
- the smallest proposed change;
- content and production invariants;
- the measurement boundary and next evidence trigger;
- what remains unknown without real users.

Otherwise record `PRESERVE` or `OBSERVE`. Low clicks, low rank, competitor length, page age, and review cadence are not sufficient reasons to change a page.

## Recursive Learning Loop

1. **Observe:** collect fresh GSC, SERP, official-source, community-question, review-signal, and page-behavior evidence.
2. **Model:** update only the task scenarios or domain rules the evidence supports.
3. **Review:** run the task walkthrough and adversarial checks against one existing page or shared evidence product.
4. **Act:** make at most one bounded improvement, or preserve the page.
5. **Verify:** run native QA, independent review, release checks, and later crawl/query observation where relevant.
6. **Distill:** add a learning-ledger entry only when the result changes a reusable rule, confidence, or next trigger.

The loop improves its method as well as the page. It does not create work because a scheduled run occurred.

## Method Sources

- [Google Search Central: Creating helpful, reliable, people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content), checked 2026-08-22. Primary platform guidance asks whether the intended audience learns enough to achieve its goal and warns against summaries that make readers search again.
- [GOV.UK Service Manual: Learning about users and their needs](https://www.gov.uk/service-manual/user-research/start-by-learning-user-needs), checked 2026-08-22. Primary service-design guidance treats non-user opinions as assumptions and recommends continued work with actual or likely users.
- [GOV.UK Service Manual: Usability benchmarking a website or whole service](https://www.gov.uk/service-manual/measuring-success/usability-benchmarking-a-website-or-whole-service), checked 2026-08-22. Primary service-design guidance combines performance measures with user research rather than using either alone.
- [SimBench: Benchmarking the Ability of Large Language Models to Simulate Human Behaviors](https://proceedings.iclr.cc/paper_files/paper/2026/hash/2fc4d6a6400addda7493b9db258c34e0-Abstract-Conference.html), ICLR 2026, checked 2026-08-22. Peer-reviewed research reports meaningful but modest simulation fidelity and particular difficulty with diverse or demographic-specific behavior; this supports using LLM walkthroughs for hypothesis discovery, not human substitution.


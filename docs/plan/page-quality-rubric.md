# Page quality rubric (owner, 2026-10-29)

Used by the persona reviewer (AGENTS.md Content Standard) and the weekly site-health report (QUEUE G13). Applies to every public page, post and card. Images: owner D17 (credited free-license stock and official media-kit photos; never AI photos of real places).

## Reference page
`site/things-to-do/san-diego-with-kids.html` is the owner's example of a high-quality page. Reviewers compare against it: is this page at least as clear, specific and useful?

## Automated checks (tools/page-quality.mjs, every deploy)
- At least one self-hosted hero image with alt text and an author/licence/source credit; no hotlinked images.
- og:title, og:description, og:image and og:url present; og:image resolves.
- A glance block above the fold: what and where, trip type, who it is for, and (deal pages) cost and savings with basis.
- No placeholder sections ("not observed", "TBD", empty tables).
- Every fact block carries a dated source.

## Persona review (read-only subagent, rendered page at 390 px and 1280 px)
Personas: a busy parent of two kids under 6 scrolling on a phone; a deal-savvy planner comparing options; a skeptical parent who distrusts "deals" and AI content.
Each answers:
1. After 5 seconds: what is this, where, for whom, what does it cost, and what does it save?
2. Would I click, save or share it? Why or why not?
3. What is confusing, missing, or reads like filler or legalese?
4. What would make it better than the reference page?
Scores 1–5: clarity, usefulness, trust, shareability, visual appeal.
Pass: every persona gives clarity 4 or more and the overall average is 4 or more. Otherwise fix and re-review (at most 3 cycles).

Method: give each persona a realistic planning task (for example "book 4 days in Orlando in March for two kids, 3 and 7, under $3,000 from NYC") and ask whether this page alone gets them to a defensible next decision. This is the task-based walkthrough from the earlier docs/plan/persona-usefulness-review-protocol.md (2026-08), which existed on paper but was never wired into the operator; the "glance" questions above are added on top.

## Ledger (ops/page-reviews.json)
One entry per page: URL, date reviewed, scores per persona, top issues, status (pass / fix queued). New and changed pages are reviewed before release; existing pages weekly (changed since last review + top 3 by impressions) and on demand (QUEUE G13).

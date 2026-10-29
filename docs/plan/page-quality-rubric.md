# Page quality rubric (owner, 2026-10-29)

Used by the persona reviewer (AGENTS.md Content Standard) and the page-quality ledger (QUEUE G13). Applies to every public page, post and card.

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

## Ledger (ops/page-reviews.json)
One entry per page: URL, date reviewed, scores per persona, top issues, status (pass / fix queued). A recurring run reviews 3 pages a day (highest impressions or lowest score first); new and changed pages are reviewed before release.

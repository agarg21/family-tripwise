# Design review (owner, 2026-10-30)

Owner: "sometimes the page doesn't look visually appealing." Every new or changed public page, post card or template now gets a third read-only reviewer, the **design reviewer**, next to the integrity/QA reviewer and the persona reviewer (AGENTS.md). Pages are built from the design system in `docs/design/design-system.md`; the reviewer judges the rendered result.

## How others do it (researched 2026-10-30)
- Design systems: a few tokens (color, type scale, spacing, radius), a small component set and one gallery; pages use only those. A lint rule rejects off-system values; screenshot comparisons catch unintended visual change.
- Review gates: self-check against a checklist, peer critique, then implementation QA against the spec (concept → design → pre-handoff → implementation QA). Common criteria: hierarchy, consistency, imagery and branding, labels and text, accessibility, mobile.
- AI critique is useful but weaker than a human designer: in the UICrit study, model critiques scored 0.47 against 0.56 for human designers. Specific guidelines, few-shot good/bad examples, zoomed crops and iterative refinement improved them. So: a concrete rubric, reference screenshots, crops, region-cited findings, and the owner as final taste check on a weekly contact sheet.
Sources: arxiv.org/html/2412.16829v1 (UICrit visual prompting); tessl.io Owl-Listener design-review-process; uxplanet.org 10-point design critique checklist; bug0.com Playwright visual regression. Read 2026-10-30.

## Inputs the reviewer gets
- Screenshots at 390×844 (first screen and full page) and 1280×800 (first screen and full page) of every changed page, plus the post card image.
- Zoomed crops: the first phone screen, each card type on the page, the photo with its credit.
- The reference screenshots in `docs/design/reference/` once the owner approves them (until then, the reference pages named in the design system) and `docs/design/design-system.md`.
- No diff and no copy rules: the integrity and persona reviewers cover facts and words.

## Rubric (score each 1–5, cite the screen region for every finding)
1. **First phone screen**: content starts within about 120 px of the top; the page's answer (what, where, cost/save for deals) is visible without scrolling; the header uses no more than one row.
2. **Hierarchy**: one focal point per screen; heading sizes from the type scale only; the most important number is the biggest thing on its card.
3. **Consistency**: only design-system tokens and components; the page top, cards, chips and photos look like the reference page of the same template.
4. **Imagery**: the photo shows this page's place or attraction (never an unrelated city or a repeated stock animal), the crop shows the subject, it is credited, and it never leaves an empty gap.
5. **Readability**: body text ≥16 px with contrast ≥4.5:1 (muted text included), line length ≤75 characters, no paragraph over about 30 words above the first details section, no wall of grey.
6. **Spacing and polish**: spacing from the scale, aligned edges, no orphaned single words in headings, no overflow, no broken or stretched images.
7. **Appeal**: would a parent scrolling on a phone find it inviting and trustworthy enough to save or share?
Severity: P0 broken (overflow, missing image, unreadable); P1 fails a rubric item badly (score 1–2); P2 noticeable inconsistency; P3 polish.
**Pass**: no item below 3, first phone screen ≥4, average ≥4, no P0–P2 open. Fix and re-review at most 3 cycles; record scores in the run notes (and `ops/page-reviews.json` once QUEUE G13 creates it).

## Weekly contact sheet (owner taste check)
`node tools/design-sheet.mjs` renders first-screen thumbnails of the main templates at 390 and 1280 px into a scratch folder. The weekly site review (QUEUE G13) runs it, the design reviewer scores the sheet, and owner sessions share it with the owner. Owner comments become new reference examples (good or bad) in `docs/design/reference/README.md`.

## Guardrails
- `tools/design-tokens.test.mjs` fails when `site/styles.css` gains raw colors or font sizes outside `:root` (ratchet: the count may only fall).
- The design reviewer never edits files; fixes go through the normal transaction.

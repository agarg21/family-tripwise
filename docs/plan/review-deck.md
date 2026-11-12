# Owner review deck (owner D46, 2026-11-11; review backlog #7)

Goal: the owner calibrates the AI reviewers in about 3 minutes a day, from a phone, without blocking anything.
Cards sample work that is already live; a "Fix" never holds a release.

Where: the owner's private Claude artifact "Tripwise Review Deck"
(https://claude.ai/artifact/VKeB6NtSeJb9nZq9oJJM5S; only the owner can open it). The page reads collection
`cards` and writes `verdicts`; only admin level (the owner, or Claude acting as the owner) can write either.

## Each weekday morning (before 08:00 ET): add one batch of 5 cards
Write with `ArtifactData` `batch` (`set`, collection `cards`, doc_id `<YYYY-MM-DD>-<slug>`). Fields:
- `batch` "YYYY-MM-DD" (the page shows the newest batch), `order` 1–5, `kind` "page" or "post"
- `page` (plain page or deal name), `section` (where on the page, or platform and time for a post)
- `url` (live URL, with the section's `#id` when it has one)
- `excerpt`: the section's visible text as a parent sees it, ≤ ~600 characters, line breaks kept; copy, never rewrite
- `ask`: one plain question for this card ("Would you stop scrolling for this?")
- `ai`: the AI reviewers' scores for it if known ("persona 3.67 · design 4.0"), else a short status

Mix per batch: 2 sections changed in the last day, 1 page nearest page one (itinerary or stay-area), 1 social post
queued or posted today, 1 random older page. No card repeats within 14 days. Skip the batch on a day with no live
changes rather than padding it.

## Each Monday: read `verdicts` and act
`ArtifactData` `list` of `verdicts` (fields: `card`, `batch`, `verdict` keep|fix, `reasons[]`, `note`, `at`).
- "Fact looks wrong" → treat as a live-site defect: re-check the source today and fix or remove the claim.
- Other Fix reasons → one line per card in the run notes, and a QUEUE item when the same reason repeats on 3+ cards.
- Calibration: compare the owner's keep/fix with the AI scores on the same cards; when the owner fixes what the
  reviewers passed (or the reverse) on 2+ cards in a week, add that pattern to the reviewer prompts
  (`docs/plan/design-review.md` / persona checklist) and note it in Q21.
- Record the week's counts (cards, keep, fix, top reasons) in the run notes and the STATE scoreboard.

Never: block a release on the deck, put names or addresses in a card, or write an owner verdict yourself.

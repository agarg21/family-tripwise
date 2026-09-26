# Contributor Profiles

Action: FT-IMP-031. Direct user authorization, September 26, 2026.

## Registration Before Editing

- Evidence: user requests one human-named AI contributor profile and supplies https://www.linkedin.com/in/apoorvag20/ for their founder profile. The existing About page lacks named accountability and still describes a five-city test despite live Cancun and Orlando lodging pages.
- Decision: implement Miles Rowan, explicitly an AI research contributor, and Apoorva Garg, founder and publisher, as linked sections of the existing About page. No new indexable URL, fictional human credentials, retroactive article authorship, or claim that the founder personally reviews every page.
- Exact paths: `tools/generate-pages.mjs`, `site/about.html`, `tools/about-page.test.mjs`, this record, `ops/current-cycle.md`, `ops/seo-roadmap.json`, `ops/seo-roadmap.md`, `ops/operator-review.md`. Preserve existing mechanical completion backfills in the two overlapping state files. Leave the unrelated dirty Orlando research record untouched and unstaged.
- Baseline: main at 2e13f7080395a00650510be2298508881eb44eb2; fetch has no incoming commits or divergence. Three pre-existing dirty completion backfills inspected.
- GSC: reused September 25 read-only API evidence finalized through September 23, not a new collection. Property/page averages do not select this action or establish an authorship ranking benefit.
- Acceptance: stable About-page anchors for both profiles; exact approved LinkedIn URL; AI identity next to Miles's name; persona language distinct from lived experience; research/drafting role and separate AI-review limitations; no invented biography or Person markup for AI. Correct current scope without changing destination pages. Focused/full native QA, desktop/mobile rendering and independent read-only PASS/PASS_WITH_P3 before release.
- Measurement: can a reader identify the responsible publisher, distinguish AI from human work, reach the supplied profile, and understand evidence limits? Proxy QA only; no SEO uplift or real-user satisfaction claim. Preserve all destination observation windows.
- Production invariants: only `site/about.html` changes among public assets; existing title/H1/description/canonical/indexability, sitemap and destination pages unchanged. Both profile anchors, founder link, AI disclosure, review boundary and current seven-destination scope render without clipping at desktop/mobile widths. Pages success, matching release marker, exact live About bytes and production SEO required.

## Result

Production verified: commit `6027e17637d2c7c87f25e4fdea3d39c476112a78`, successful Pages run `36236587941`, matching release marker and HTTP200 exact reviewed About bytes at `2026-09-26T10:42:56.150Z`. Live mobile390/desktop1280 screenshots, canonical, founder href, AI disclosures and zero horizontal overflow pass; desktop founder anchor95.8px clears header65px. Production SEO passes with zero errors/four prior Chicago warnings. No retry or rollback. Reviewer closed; preview stopped and temporary browser tab closed. No technical blocker. Next: maintain these role disclosures as workflow changes; destination observation windows remain unchanged. Earlier pre-release checkpoints below are history. Mechanical release backfills are retained for the next substantive transaction, without a metadata-only commit.

Final pre-release verification: Raman (`01a0dd4c-ef6d-7670-905e-8f1532f5996d`) cycle one PASS, no P0-P3. Independently checked focused tests, state, SEO, whitespace, generator/output parity, disclosure and scope. Operator reran all 226 tests successfully after the anchor offset. Browser checks at 1280x900, 390x844 and 320x800 passed; actual Miles anchor click navigates to `#miles-rowan`, top 96px at 320px, no document/paragraph horizontal overflow. Founder anchor top 95.8px at 390px; exact approved LinkedIn href confirmed. Desktop headings clear the sticky header. No user testing or ranking measurement claimed. Reviewed exact-path commit/push and production verification next; no technical blocker.

Implemented in generator and generated About page. Profiles use stable anchors on the existing URL; no new URL or destination byline. Current scope corrected to five established guide destinations plus Cancun/Orlando lodging. A local anchor offset keeps profile headings clear of the desktop sticky header.

Initial QA: 226/226 full native tests including 3/3 focused profile checks; operator-state zero errors; static SEO zero errors and four pre-existing Chicago operational-date warnings. Generation changed only `site/about.html`. Desktop 1280x900 and mobile 390x844 screenshots inspected; zero horizontal overflow. Final anchor checks, independent review and production verification pending.

# Policy Review Clock Follow-Up

FT-IMP-078 closes two independent nonblocking findings from Maxwell (FT-IMP-076) and Linnaeus (FT-IMP-077). Their public releases are production-verified, but the offline maintenance report omitted the new AREA15 minor-policy and DC rail-fare review clocks.

Scope: `tools/site-maintenance.mjs` and its native tests expose two policy-specific clocks from the original maintained records. AREA15 policy observed October 9 is due November 8; DC fare policy observed October 3 is due November 2. Due-day boundaries use the existing `ageState` helper. Historical reports before observation carry `not-yet-observed-at-report-date` and cannot count the future evidence as current. Invalid date, interval, source class/status or unsafe source URL fails closed.

The report's two new clocks and due-count summary are additive to existing canonical ownership, room, price and page-source-note contracts. Source-specific dates do not replace July 22 general attraction dates or September 30 room/price dates. This is not atomic coverage for every claim, a fact-refresh certificate, source collection or an automatic page update.

Acceptance: October 9 has two dated clocks with neither due; November 2 flags DC and November 8 flags both. November 3 must still expose the DC due check. Before October 3 neither source is available to that historical report. Source records, site files, CSVs, nightly-price context, scheduler and all held work remain byte-identical. Native focused/full QA and a different independent read-only reviewer are required before exact-path tools/docs-only push. No Pages release is required or claimed for this action.

Daily learning already met by LRN-169 and LRN-170; this is a verified control-defect fix, not another research-report count. Next gate is the named policy review or an earlier verified conflict; no unchanged denial retry or date renewal from successful QA.

Cycle 1 review found the isolated release builder dropped existing completion receipts and reverted 14 prior roadmap items to their older committed states. The seven-path scope is unchanged. Cycle 2 preserves all baseline prior items and the three ops Markdown histories verbatim, adding only this action and its reviewed receipts. Those prior item deltas are mechanical release outcomes, not new product judgments. Earlier held history remains dated history; no held content, evidence, ledger, page or artifact is staged by this repair. The release candidate must match the full baseline prior-state records, not only Git HEAD.

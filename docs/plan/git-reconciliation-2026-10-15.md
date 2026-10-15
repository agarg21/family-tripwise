# October 15 Pinned Reconciliation

FT-OPS-017 uses the standing October14 direct-user normal-merge delegation in `git-reconciliation-policy.md`. No additional approval is requested. This is release repair for reviewed FT-IMP-176, not a new family-page improvement.

## Pinned Inputs

- Local reviewed rental tool: `d27d4cc06954b1a5f008c79fa3e7921dd22879b0`.
- Incoming daily GSC-only commit: `1145ddbcebe789a202b7ecc3af8eefa309155320`.
- Common ancestor: `a858342061a91f126a7b4529e0f56b6fb8939012`.
- Conflict-free composed tree: `62a4fe6571284ceb2137cd0425155ff3e52dfa48`.
- Incoming exact paths: `ops/gsc-snapshots/2026-10-15.json` and `.md`; neither overlaps the twenty held dirty paths.

The fresh pre-push fetch advanced origin after176's independent review. The generic guard correctly reported changed pins. The same orchestration then incorrectly attempted an ordinary push despite the failed guard; Git rejected it as non-fast-forward. No remote write succeeded, and there was no force-push or unchanged retry. Subsequent phase checks must terminate execution on failure. The generic guard is not modified or weakened; its merge restriction is handled only by this separately reviewed pinned merge lane.

## Preservation And Candidate

Normal `--no-ff --no-commit` merge must stage only the two incoming snapshot paths, with no unmerged entries. Keep all existing commits and all376 older LIVE ordered roadmap records. Preserve every nonowned dirty byte/mode and all nine173 held non-ops targets; do not stash, rebase, reset, discard or force checkout.

Build from the clean composed tree, adding only the registered017 plan and operating prefixes. Never stage LIVE ops wholesale: they contain unshipped173 metadata. Candidate173 metadata/code and the historical dirty ledger tail stay excluded.176's exact reviewed code/content remain unchanged. All79 public site files match the prior release.

Incoming GSC is public-safe read-only API evidence collected2026-10-15T15:02:18.585Z, finalized conservatively throughOctober13. It is new imported orientation, not a new local API call, aligned query cohort, CTR diagnosis or indexing request. Preserve the prior snapshots. Schema/privacy validation and the full native suite must pass on the composed candidate.

## Release Checks

Before committing, require local HEAD and fetched origin to equal their pins, MERGE_HEAD to equal the pinned remote, no unresolved entries, exact seven staged paths relative to local HEAD, and every indexed file's bytes/mode to match the frozen full candidate inventory. Confirm all nonowned LIVE bytes/modes against the captured baseline and all older LIVE records unchanged.

After a different independent read-only PASS or PASS_WITH_P3, append only immutable receipts. The final normal merge must have the ordered parents `[local176, remoteGSC]`; both original commits and the ancestor remain reachable. Require its entire tree to match the frozen candidate, and the complete outgoing range to contain only176 followed by this merge. Fetch immediately before normal push and require origin to remain the pinned remote. Any failure stops that push; a changed remote needs a new pinned audit and review, never an old-consensus retry.

Docs/shared-tool/snapshot changes only: normal remote identity verification completes delivery; no Pages wait or production-site claim.176 becomes delivered only after this reconciliation and remote verification.173 still needs documented changed normal rendered access and its own actual browser/release gates. Sprint expiry, restoration baseline, weekly evidence, human evidence, source holds and spending remain unchanged.

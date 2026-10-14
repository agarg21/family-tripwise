# Body-Free Proposal Handoff

FT-IMP-162 closes the **saved-packet accounting** gap from161 without changing its capture protocol or any source journal. This is an offline handoff tool, not a live source request, approved processing scope, LLM service or weekly refresh. The current run validates synthetic transport and disposable journals only. Original155-161 evidence, public clocks and the existing weekly baseline/due state remain unchanged.

`aggregateProposalHandoff` validates complete native checkpoint evidence plus the reviewed selection/hold/field-registry processing scope, then joins each supplied packet to its exact completed source index, URL, attempt time, outcome, HTTP status and normalized text hash. Unknown, duplicate, out-of-scope or mismatched packets reject the report. Strict nested schemas reject copied source bodies, free-form errors/identities, changed fact dates, approved context, party/stay inference and publication authority. Submitted conflicts are recomputed and remain unresolved. Original field provenance and dates are preserved.

Saved schema/span/hash validation cannot independently recheck lexical support or source authenticity after body discard. A forged but correctly shaped operator-supplied packet is not a verified fact. The report therefore keeps all present values/context pending and has no semantic, publication or weekly-baseline authority. Processing hashes pin reviewed inputs; they do not independently evaluate robots, terms, license or access permission.

Every plan source appears once. `selected_packet_accounting_complete:true` means **all sources in this explicit selected proposal scope have known completed outcomes with available matching packets**. It does not mean every inventory source was collected, every proposal succeeded or any claim was verified. Known failed sources and rejected proposals can have complete packet accounting but remain review work. Nonselected sources keep their original checkpoint state/time and an out-of-proposal-scope label.

| Selected Source | Handoff State | Permitted Response |
| --- | --- | --- |
| Completed with matching packet | `packet-present-review` | Review context/claim; do not renew dates automatically |
| Completed with missing packet | `held-proposal-packet-missing` | Owner reconciliation; no refetch or fabricated packet |
| Started without valid source result | `held-source-outcome-unknown` | Existing owner hold; no replay |
| Never attempted | `deferred-no-attempt` | Remains incomplete; separately register eligible collection |

`publishProposalHandoff` reads the existing checkpoint through native regular-file/no-writer/double-read guards. It publishes a new report **outside** the checkpoint with exclusive creation, mode0600 and file sync. Require canonical absolute checkpoint/output paths, an existing real parent, no aliases or symlinks and a new output. The journal is read only. Input processing objects are copied before asynchronous work. Existing output is never overwritten; a failed/interrupted write is an owner-held artifact, not permission to replace it. This assumes the operator's sole-writer boundary and does not claim distributed atomicity or power-loss reliability.

The explicit CLI requires `--checkpoint`, `--selection`, `--scope`, `--packets` and `--output`. Selection/scope/packet files must be canonical bounded regular JSON; current repository watch/hold registries must match their pins. There is no collection, retry or scheduler mode. Register exact input and output paths under the usual QA/review/privacy gates before a real handoff. Any source body retention or live processing approval remains separately governed; no such approval is created here.

```sh
node --test tools/source-proposal-handoff.test.mjs
```

Fourteen focused tests comprise eleven read-only fake-response controls and three disposable-journal/CLI controls. The first13of14 run failed because its immutability fixture attempted to clone a function-bearing test options object, not because the handoff altered evidence. The corrected fixture compares the serializable input state; final14of14 passes. Tests cover complete-versus-partial selected coverage, lost packets, unknown/deferred/denied states, exact provenance/pins, nested privacy and authority, original dates/typed null context, conflict retention, rejected/failed-source accounting, malformed/future data, explicit CLI paths, exclusive0600 output, alias/symlink/inside-journal/writer holds and no overwrite. They do not establish live semantic accuracy, source permission, parent/mobile behavior or two-week reliability.

Next: source-specific access/retention governance for the small official pilot, then a registered actual weekly collection with an immutable packet handoff and semantic context reconciliation. A missing packet always blocks selected accounting; do not replay completed sources to recover it. Two actual complete weekly cycles, broader numeric demand and exact-family budget evidence remain gates before large city growth. Real LLM use requires separately explicit service/credential/cost scope.

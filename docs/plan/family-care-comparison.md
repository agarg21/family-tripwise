# Service-Level Care Comparison

FT-IMP-053 uses the reviewed October2 FT-RES-080 inventory as read-only evidence. It does not change the public resort model, publish Club Med as a hotel, collect a new quote or complete FT-RES-076's demand/publication gates. Existing public corrections remain subject to normal preview resolution and release QA; this tool does not bypass that hold.

## Run

```bash
node tools/family-care-comparison.mjs docs/research/cancun-care-services-2026-10-02.json --date 2026-10-02
node tools/family-care-comparison.mjs docs/research/cancun-care-services-2026-10-02.json --date 2026-10-02 --format csv --child-ages 2,7 --potty-trained unknown,yes --minutes 90
```

JSON is the default; CSV gives one row for each property, child and service. Both print to stdout only. There is no network collection, booking, public generation or file-output option. The screening date defaults to the current Eastern date; it never renews a source observation. Seven days since the oldest included source date queues a source review, not a claim that policies expired or were revalidated. A newer inventory date cannot conceal an older source.

The initial task has children2and7 and a90-minute requested session. Changing child ages, training or duration changes only those screens. Original travel dates/party and budget evidence remain separately labelled and are not transferred into a new room quote. No output confirms simultaneous parent-free care or admission.

## Interpret

All service alternatives are retained: The Grand's mezzanine and ground-floor accompanied exceptions cannot be collapsed by first-match age routing. Each service separately shows published age limits, parent-presence evidence, training, registration, hours, requested duration versus a known maximum, inclusion evidence and direct dated sources. Unknown upper age or session limit remains unknown; a minimum-only restaurant service is not an unrestricted teenage/daytime-care promise. Published hours are not parsed into availability.

Numeric care fees and exact-task room-plus-care totals remain unknown. Version1 deliberately rejects numeric quote fields because this inventory has no corresponding priced service basis. A future fee adapter requires a reviewed schema extension with property/service/child/party/date/unit/tax/package/cancellation and availability context; inclusion wording is not a zero-cost toddler quote.

Historical room price context stays intact. Finest's September27fromUSD843FamilySuite room/night sample retains unknown party/stay/tax-fee basis; The Grand's September27USD8191/displayed1638night different-stay sample remains in its original budget note. Neither becomes this requested task's rate or a new current quote. JSON and CSV preserve the original budget/source/date limits.

Acceptance fixtures cover age2/7 floor differences, restaurant training and90/91-minute boundaries, unknown upper-age limits, weekly source review, retained price history, malformed sources/IDs/fields, future dates, input bounds, output escaping and CLI parity. This is deterministic source-bound proxy validation, not new parent-question research, real-user testing, SEO gain or a second learning entry for FT-RES-080. Source/publication/security/paid-budget gates remain unchanged.

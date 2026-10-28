# Social post queue (QUEUE G03, OWNER D12)

One file per Eastern date, `YYYY-MM-DD.json`, generated from the verified records behind /this-week/ and /deals/:

    node tools/social-queue.mjs YYYY-MM-DD   # pick the day's entries and write the queue
    node tools/social-cards.mjs YYYY-MM-DD   # render 1080x1350 JPEG cards into site/social/cards/
    node --test tools/social-queue.test.mjs  # validate

Rules the generator and `tools/social-queue.test.mjs` enforce:
- Only first-party verified records, observed at most 14 days before the post date, not expired on that date. Every paragraph of a post is copied from the record (title, field sentences, the dated check line, hashtags); deal posts always keep the headline with its family caveats.
- At most 3 entries a day off-season and 6 in November–December; per-platform daily caps (Bluesky 4, Threads 5, Facebook 2, Instagram 1, Pinterest 10, TikTok 1, YouTube 1); text within each platform's limit. An item queued in the previous 3 days is not queued again.
- While a queue's date is today or later it must match the current records exactly; if a record is edited, re-observed or removed, regenerate that day's queue.
- An entry stops being postable at 00:00 ET on its record's last day (`expires_at`), because a deadline that day can fall before any slot.
- Text limits assume the link travels outside the text (Bluesky external embed, Threads link attachment, Facebook link field); G04 must not append the URL to Bluesky or Threads text.
- Cards are typographic only (no photos, AI images or promotional art); a card whose text does not fit is refused. Card file names carry a hash of their content.

Posting is G04: `.github/workflows/social-post.yml` runs `tools/social-post.mjs` at :40 past the hour, so 10 to 40 minutes after each slot. It posts today's due entries (Eastern date; a missed day is never backfilled) only for platforms whose secrets exist (Bluesky: BLUESKY_HANDLE + BLUESKY_APP_PASSWORD; Threads: THREADS_USER_ID + THREADS_TOKEN; Facebook: META_SYSTEM_USER_TOKEN + META_PAGE_ID; Instagram: those two + IG_USER_ID), re-validates the queue against today's records, checks the OWNER.md D12 kill switch on the latest main before each post, claims a receipt in `ops/social-receipts/` before posting (any existing receipt means never again), never posts after `expires_at`, keeps the daily caps and posts at most one entry per platform per run. Pinterest, TikTok and YouTube variants are not posted yet. A manual run defaults to a dry run against simulated platforms: `node tools/social-post.mjs --dry-run --now <ISO time>`.

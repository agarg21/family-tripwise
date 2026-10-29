# Social post receipts (QUEUE G04)

Written only by `.github/workflows/social-post.yml` (tools/social-post.mjs), one file per post:
`YYYY-MM-DD/<entry id>--<platform>.json`, committed to main *before* the post (`status: attempting`)
and overwritten with the result (`posted` with the platform's post id, or `failed` with a redacted
error). Any receipt, whatever its status, stops that entry from posting on that platform again; a
`failed` or stuck `attempting` receipt is never retried automatically, because the post may exist.
Since G08 a finished receipt also records `via` (`zernio` or `direct`); for Zernio, `remote_id` is the Zernio post id. Receipts hold no credentials. Do not edit or delete them by hand.

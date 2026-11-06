# Zernio API facts used for posting (QUEUE G08, OWNER D14), read 2026-10-29

Public documentation only (no account, no key used). Third-party vendor docs; re-check on the first live post.

| Topic | Observed 2026-10-29 | Source |
|---|---|---|
| Base URL and auth | `https://zernio.com/api/v1`; `Authorization: Bearer <ZERNIO_API_KEY>` | https://zernio.com/agent-quickstart.md |
| List accounts | `GET /v1/accounts` (filter `status=connected`); response `accounts[]` with `_id`, `platform`, `username`, `displayName`, `profileUrl`, `isActive`; no page/board ids documented | https://docs.zernio.com/accounts/list-accounts |
| Pinterest boards | `GET /v1/accounts/{accountId}/pinterest-boards` → `boards[]` with `id`, `name`, `description`, `privacy` | https://docs.zernio.com/connect/get-pinterest-boards |
| Create post | `POST /v1/posts`: `content`, `mediaItems[]` (public HTTPS `url`, `type` inferred from extension), `platforms[]` (`platform`, `accountId`, `platformSpecificData`, `customContent`), `publishNow` (synchronous; HTTP 207 when some platforms fail), `scheduledFor`, `isDraft`; response `{ post: { _id, status, platforms[] } }` | https://docs.zernio.com/posts/create-post, https://zernio.com/agent-quickstart.md |
| Post statuses | `draft`, `pending_approval`, `scheduled`, `publishing`, `published`, `partial`, `failed`, `cancelled`; published posts carry `platformPostUrl` per platform | https://docs.zernio.com/posts/list-posts, https://docs.zernio.com/posts/get-post |
| Never post twice | `Idempotency-Key` header (UUID, 24 h): a repeat returns the original post (200) or 409 `idempotency_conflict` while processing; also content-hash dedup (409 with `existingPostId`) within 24 h | https://docs.zernio.com/posts/create-post |
| Rate limits / errors | 60–1,200 requests/min by connected accounts; errors are JSON with a machine-readable `code` | https://docs.zernio.com/api-reference |
| Pinterest fields | `platformSpecificData.boardId` (send every time; otherwise the first board Pinterest returns), `title` ≤100, `link` (HTTPS, no shorteners); description (`content`) ≤800; one image (JPEG/PNG/WebP/GIF ≤32 MB); no alt-text field documented | https://docs.zernio.com/platforms/pinterest, https://docs.zernio.com/platforms/pinterest/posts |
| Threads | text ≤500; images JPEG/PNG ≤8 MB; `platformSpecificData`: `topic_tag`, `firstComment` (≤500, counts toward 250 posts/24 h), `threadItems`; **no link-attachment field** documented | https://docs.zernio.com/platforms/threads, https://docs.zernio.com/platforms/threads/posts |
| Facebook | text-only posts allowed; `platformSpecificData`: `contentType` (omit for feed), `firstComment`, `pageId`, `facebookSettings`; **no link-preview field** documented (a preset background stops a URL in `content` being previewed, implying a URL in content is otherwise previewed) | https://docs.zernio.com/platforms/facebook, https://docs.zernio.com/platforms/facebook/posts |
| Instagram | caption ≤2,200; feed image JPEG/PNG ≤8 MB; `platformSpecificData` includes `firstComment`, `commentsEnabled`, `isAiGenerated`; **no alt-text field** documented | https://docs.zernio.com/platforms/instagram, https://docs.zernio.com/platforms/instagram/fields |

## How tools/social-post.mjs uses it
- One request per entry and platform with `publishNow: true`; `Idempotency-Key` derived from the receipt key; a receipt is still claimed on main first.
- Accounts looked up at run time; a platform with no connected account is not posted; two connected accounts for one platform are refused as ambiguous.
- Pinterest board: the `PINTEREST_BOARD_ID` secret if set (must be one of the account's boards), else the only public board; otherwise skipped unclaimed.
- Threads link goes in `firstComment` (our Threads text never holds a URL); Facebook link is appended to the text; Instagram and Pinterest send the public card JPEG. Instagram/Pinterest alt text is not sent (no documented field).
- Facebook `pageId` is sent from the META_PAGE_ID secret when it exists; without it Zernio's default Page is used.
- Unknown until the first live post: whether `GET /v1/accounts` pages its results without `limit` (a hidden second account would bypass the ambiguity guard; the owner connects one account per platform), whether Facebook builds a link preview from a URL in text, and the exact per-platform result fields beyond `status` and `platformPostUrl`.

## Reels (QUEUE G17, OWNER D38), read 2026-11-04

| Topic | Observed 2026-11-04 | Source |
|---|---|---|
| Instagram Reel | `mediaItems` with a single `{ "type": "video", "url": … }` publishes as a Reel (no `contentType`); `platformSpecificData.shareToFeed` defaults `true`; alt text is ignored for Reels; catalog music via `audioConfiguration` needs a Facebook-Login connection (`400 instagram_audio_requires_facebook_login`); no cover/thumbnail field documented | https://docs.zernio.com/platforms/instagram/posts |
| Instagram video limits | MP4/MOV, ≤300 MB, ≤15 min (owner brief, same page family) | https://docs.zernio.com/platforms/instagram/posts |
| Facebook Reel | `platformSpecificData.contentType: "reel"` with one vertical (9:16) video of 3–60 s; `content` is the caption; optional `title` sets a separate Reel title; `firstComment` works on Reels; file size and container not stated | https://docs.zernio.com/platforms/facebook/posts |
| Not available | Story link stickers through the API | owner brief, 2026-11-04 |

tools/social-post.mjs sends the reel only when `ops/media/reels.json` switches it on (README: Reels). Unknown until the first live reel: whether Zernio echoes a Reel-specific status or URL, and how long Instagram processing takes for an 11 s, 2–4 MB file (the existing settle polling covers about 2 minutes).

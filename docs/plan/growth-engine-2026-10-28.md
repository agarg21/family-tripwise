# Growth engine design (2026-10-28, approved by owner)

Goal: an automated system that finds fresh, verified family travel deals, events and news, publishes them on the site, and distributes them to social and email — with the owner involved only for one-time setup and approvals.

## Design rule: pick tools by how little they need the owner
Every platform and tool is chosen for (1) a posting/sending API that works unattended, (2) credentials that do not expire, (3) no recurring manual step. Anything that fails these waits until it can pass them.

| Channel | Unattended? | Credential | Recurring owner step | Phase |
|---|---|---|---|---|
| Site /this-week/, /deals/ | Yes | none (GitHub Pages) | none | 0 |
| Bluesky | Yes | app password (no expiry) | none | 0 |
| Facebook Page, Instagram, Threads | Yes | one Meta app; Business "system user" token set to never expire | none | 0 |
| Pinterest | Yes after Standard access | app token | one-time demo video for Standard access | 1 |
| Newsletter | Only with an API plan | API key | Kit free has no API → owner clicks send weekly; automated needs a plan/tool with API | 1 |
| YouTube Shorts | Yes after Google app verification | OAuth refresh token | one-time verification; until then tokens expire every 7 days | 2 |
| TikTok | Drafts only until app audit | OAuth | finishing drafts by hand until audited (weeks) | 2 |
| Facebook Groups, Reddit, forums | No (no API / against rules) | — | manual only | not planned |

## Pipeline (all cloud; nothing on the owner's Mac)
1. Sources registry — `docs/research/growth-*-2026-10-28.md` lists the recurring sources: official deal pages (Royal Caribbean promotions terms, Disney offers, Great Wolf deals, Club Med/Beaches/MSC/NCL specials, SeaWorld/Universal tickets), official event calendars per city, and news/deal sites used only as leads.
2. Sweep — the operator (cloud scheduled task) sweeps twice a day (about 6 am and 2 pm ET; three times a day in the Black Friday window, about Nov 20–Dec 8).
3. Verify — every item is confirmed on the official page and stored as a structured record with observed date, source, family terms (child ages, occupancy, blackout dates, fees) and an expiry. Third-party claims never publish as fact.
4. Review — an independent read-only reviewer agent checks each batch before release (existing operator rule).
5. Publish — the site rebuilds /this-week/ and /deals/; a daily scheduled deploy drops expired items even if no run happens.
6. Distribute — the operator writes that day's posts (platform-specific text, data-built image cards); a GitHub Action posts them at fixed slots (about 7:30 am, 12:30 pm, 7:30 pm ET) using repository secrets, with receipts, per-platform daily caps, never-post-twice, never-post-expired, and a kill switch in `ops/OWNER.md` D12.
7. Inbox — hello@familytripwise.com (Porkbun free forwarding → owner's Gmail, labelled "Family Tripwise"); a scheduled check reads it for platform notices, approvals and replies, and raises only real owner decisions.
8. Learn — weekly: Search Console snapshot, platform insights via the same APIs, newsletter stats → scoreboard in `ops/STATE.md`; content mix shifts toward what earns follows, saves and clicks.

## Quality bar ("very fresh and very good")
- Every post answers a family question the original offer does not: what it really costs for 4, which ages count, what is blacked out, what sells out when.
- Speed target: verified within hours of an official launch, not first-to-post; accuracy beats speed.
- No filler: in season about 5–6 posts/day across all channels; off-season 2–3. If there is nothing worth posting, nothing posts.
- Formats: data-built carousel cards (no AI images of real places, no reposted promo art); short text posts for Bluesky/Threads; weekly roundup newsletter; Shorts/TikTok later with varied scripts.
- Honest identity: bios say research is AI-assisted from official sources.

## What only the owner does (one-time, about 2–3 hours total)
- Create accounts with 2FA on hello@familytripwise.com: Bluesky, Facebook Page + Instagram professional + Threads, Pinterest Business, later YouTube brand channel and TikTok.
- Create the developer apps (Meta app + system user token; Pinterest app; later Google and TikTok) and paste each token into GitHub secrets.
- Log in to Porkbun once so the forwarding address and the Bluesky DNS record can be added through Chrome.
- Approvals in `ops/OWNER.md` (new URL types, spend, new channels). Everything else is the operator's job.

## Owner decisions (2026-10-28)
1. Phase 0 channels: Bluesky + Meta (Facebook Page, Instagram, Threads). Pinterest, YouTube, TikTok next as approvals clear.
2. Newsletter: skipped for now.
3. Operator authorization extended to 2027-01-15 17:00 ET (covers the Black Friday window and holiday/wave-season deals).
4. hello@familytripwise.com is the single brand address (Porkbun forwarding to the owner's Gmail).

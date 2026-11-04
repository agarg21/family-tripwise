# Social reach facts for G15 (OWNER D30), read 2026-11-02 ET

Handles: the owner session's list is docs/research/social-handles-2026-11-02.md. A handle is used only once the brand's own site links to it.

| Brand | Handle | Official page read 2026-11-02 | Observed |
|---|---|---|---|
| SeaWorld Orlando | @seaworldorlando | https://seaworld.com/orlando/instagram/ | header and footer links, page title |
| SeaWorld San Diego | @seaworldsandiego | https://seaworld.com/san-diego/instagram/ | header and footer links, page title |
| SeaWorld San Antonio | @seaworldtexas | https://seaworld.com/san-antonio/instagram/ | header link, page title |
| Busch Gardens Tampa Bay | @buschgardens | https://buschgardens.com/tampa/ | footer link |
| Sesame Place Philadelphia | @sesameplace | https://sesameplace.com/philadelphia/park-info/ | footer link |
| LEGOLAND Florida | @legolandflorida | https://www.legoland.com/florida/ | footer link |
| LEGOLAND New York | @legoland.newyork | https://www.legoland.com/new-york/ | footer link, seen by the owner session 2026-11-02; not re-read |

Not yet confirmed, so no @mention or photo tag: every other row of the handle list (LEGOLAND California, Great Wolf, cruise lines, Atlantis, Club Med, Beaches, Deer Valley, zoos and tourism boards).

## Zernio (third-party vendor docs)
- docs.zernio.com/guides/platform-settings: an error example shows `platforms[n].platformSpecificData.userTags[0].x` "must be between 0 and 1".
- zernio.com/changelog/tag-people-on-instagram-when-scheduling-posts: tags take usernames and coordinates; 0.5, 0.5 is the centre.
- Unread: docs.zernio.com/platforms/instagram/fields, /platforms/threads/posts and /posts/create-post (permission requests withdrawn; not retried). The `username` field name is therefore unconfirmed, so photo tags are built but not sent (PHOTO_TAGS_LIVE in tools/social-post.mjs; OWNER O30): a rejected request costs that day's Instagram post.
- Threads topic: sent as one hashtag at the end of the text, so no Zernio field is needed.

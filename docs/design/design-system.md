# Family Tripwise design system v1 (2026-10-30)

Who we design for: US parents of young kids, mostly on phones, arriving from Facebook, Pinterest and Google, wary of "deals" and AI content. Owner direction: "whatever the humans we are catering to will like." So: **warm and friendly, but calm and trustworthy**: the brand's cream, teal, coral and sun from the logo; rounded friendly headings; big, plain numbers; real, relevant photos; lots of white space; nothing that looks like an ad.

Principles
1. **Answer first.** The first phone screen shows what, where and (for deals) cost and saving. Chrome never takes more than one row.
2. **Numbers are the heroes.** Prices and savings are the biggest text on a card, with the basis in small text right under them.
3. **One way to do each thing.** One page-top pattern, one card, one chip set, one table style. New patterns are added here first.
4. **Real and relevant.** Credited real photos of the page's own place. No AI images of real places, no repeated stock animals, no promotional art.
5. **Calm trust.** Sources and dates are always visible but small; labels say "estimate"; no countdown timers, no red "HURRY".

## Tokens (source of truth: `:root` in `site/styles.css`)
Colors (brand, from `brand/logo.svg`)
| Token | Value | Use |
|---|---|---|
| `--c-teal-900` | #0b4946 | brand dark, header mark, primary button hover |
| `--c-teal-700` | #126c67 | links, primary buttons, focus ring |
| `--c-mint-300` | #8fd0c4 | illustration accent |
| `--c-mint-100` | #e6f2f0 | info surfaces |
| `--c-coral-500` | #db6d4a | brand accent (logo, eyebrow dot), never body text |
| `--c-coral-700` | #a44822 | eyebrow text, "costs more" text (AA on cream) |
| `--c-coral-100` | #fbe9e3 | "costs more" / skip surfaces |
| `--c-sun-400` | #f0bd56 | highlight, "only for" chip border |
| `--c-sun-100` | #fff7e3 | "only for" chip / note surfaces |
| `--c-save-700` | #1f6b45 | saving text |
| `--c-save-100` | #e6f4ea | saving surfaces |
| `--c-ink` | #142029 | text |
| `--c-ink-muted` | #43515a | secondary text (≥7:1 on cream) |
| `--c-paper` | #fffaf2 | page background |
| `--c-surface` | #ffffff | cards |
| `--c-line` | #ded8cc | borders, dividers |

Type: headings **Nunito 800** (the wordmark face, self-hosted woff2); body system UI stack. Body 16 px, line height 1.5 today (target: 17 px from 760 px and 1.55, batch 2).
| Token | Size | Use |
|---|---|---|
| `--t-xs` | 0.8125rem | credits, sources |
| `--t-sm` | 0.875rem | basis lines, chips, captions |
| `--t-base` | 1rem | body |
| `--t-lg` | 1.1875rem | lead line, card titles (h3) |
| `--t-xl` | clamp(1.375rem, 3.2vw, 1.625rem) | section titles (h2) |
| `--t-2xl` | clamp(1.75rem, 5.2vw, 2.5rem) | page title (h1), one per page |
| `--t-num` | clamp(1.375rem, 4.5vw, 1.875rem) | big figures on price cards |

Spacing scale: `--s-1` 4px, `--s-2` 8px, `--s-3` 12px, `--s-4` 16px, `--s-5` 24px, `--s-6` 32px, `--s-7` 48px, `--s-8` 64px. Gutter 16px on phones.
Radius: `--r-sm` 8px (chips, inputs), `--r-md` 14px (cards, photos), `--r-pill` 999px (buttons). Shadow: `--shadow-card` 0 2px 14px rgba(20,32,41,.07).
Widths: `--w-text` 68ch; `--w-page` 1120px.

## Components
1. **Site header**: one row at every width, about 53 px tall, sticky. Logo mark + "family tripwise" wordmark; Deals (filled, the main action) and This week (outline) buttons; a "Cities" disclosure (`<details>`, works without JavaScript) whose panel lists the cities A–Z by full name ("New York City", "London, UK") and ends with "How we check our facts" (about page). Under 480 px This week moves into the panel (top item, as a link) and the button reads "Menu".
2. **Page top**: eyebrow (place · trip type, coral-700, uppercase `--t-xs`), h1 (`--t-2xl`), one lead line (≤30 words, `--t-lg`, ink-muted), byline (`--t-xs`). No tall empty band: top padding `--s-6` phone / `--s-7` desktop. Photo directly below, max height 220px phone / 340px desktop, `object-fit: cover`, credit underneath.
3. **Glance / answer box**: white card, teal left rule, ≤4 bullets or a 3-figure row.
4. **Spend-vs-save card**: three figures in a row (Without · With · You save) at `--t-num`, the saving on `--c-save-100`; "costs more" on `--c-coral-100`; basis line `--t-sm` underneath; "estimate" always present.
5. **Chips**: pill, `--t-sm`, 1px border. Variants: worth-it (save), only-for (sun), skip (coral), neutral (line).
6. **Card** (deal, hotel, activity): white, `--r-md`, `--shadow-card`, padding `--s-4`/`--s-5`; title h3 `--t-lg` link; figures; one-line deadline; small source line.
7. **Section**: h2 `--t-xl` with `--s-7` above; collapsible `<details>` for long terms, with a clear summary label.
8. **Table**: compact, zebra rows on `--c-paper`, sticky first column on phones, numbers right-aligned.
9. **Photo with credit**: `--r-md`, credit `--t-xs` ink-muted directly under the photo.
10. **Buttons**: primary pill teal-700 on white text; secondary outline teal-700.
11. **Footer**: quiet, `--t-sm`, links and the "how we check" line.

## Templates and reference pages
| Template | Reference page (after restyle) |
|---|---|
| Things to do | site/things-to-do/san-diego-with-kids.html |
| Where to stay | site/where-to-stay/london-family-hotels.html |
| Deal check | site/deals/busch-gardens-tampa-2027-fun-card.html |
| Deals hub | site/deals/index.html |
| Home | site/index.html |
Approved screenshots live in `docs/design/reference/` once the owner has seen them on a contact sheet.

## Rollout (owner D23, 2026-10-30)
Batch 1 header and tokens · batch 2 page tops and photos · batch 3 cards, chips and tables · batch 4 the rest. Each batch: tests, Playwright at 1280/390/320, integrity + persona + design review, verified release.

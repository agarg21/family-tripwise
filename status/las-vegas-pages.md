# Las Vegas Page Status

Last updated: 2026-07-22

Sources:

- Latest public-safe GSC snapshot: `ops/gsc-snapshots/2026-07-22.md`
- Las Vegas city/cluster research: `docs/research/next-city-prioritization-las-vegas-cluster.md`
- Reusable workflow: `docs/plan/incremental-city-cluster-playbook.md`
- Current roadmap: `ops/seo-roadmap.md`

Demand estimates are directional US monthly search volumes from the logged-in Semrush check collected July 22, 2026. Closely related rows overlap and must not be summed into unique traffic. GSC rank is page-level average position over the latest 28-day window, finalized through July 20; it is not a claim that the page ranks at that position for each example query. Example queries are research targets, not a protected GSC query export.

## Public Pages

| Page | Full URL | Est. search demand/mo | Current GSC rank | Target rank | 2-3 top search queries | Current status | Done | Remaining / blocker | Next action |
|---|---|---:|---|---|---|---|---|---|---|
| Main things-to-do hub | https://familytripwise.com/things-to-do/las-vegas-with-kids.html | 3,600 core exact; 5,880 across four overlapping broad variants | Avg position 56.22; 180 impressions | Top 20 first, then Top 10 | `things to do in Las Vegas with kids`; `things to do with kids in Las Vegas`; `Las Vegas family activities` | Live, indexed, and the strongest current Las Vegas discovery signal. | Six activities, comparison, situation picks, day variants, and links to teen/stay/itinerary pages. | Choice set is narrow versus the current SERP; free, indoor/heat, Downtown, and several major family trip shapes are thin. Repetitive detail and firm `best` language need every-section review. | `FT-IMP-006`: wider candidate research plus full persona, competitor, evidence, and section review; improve this URL first. |
| Teen activities | https://familytripwise.com/things-to-do/las-vegas-with-teens.html | 590 core exact; alternate variants also support the intent | Avg position 11; 2 impressions | Top 10 | `things to do in Las Vegas with teens`; `things to do with teens in Las Vegas`; `Las Vegas with teens` | Live and indexed; promising position is based on too little data for a performance conclusion. | Dedicated teen table, routes, tradeoffs, and cluster links. | Current choices overlap the broad page. Every item needs a genuinely teen-specific reason; competitor and section review should test differentiation without imitating firsthand authority. | Keep standalone. Review after the all-ages hub, then improve only distinct teen decision support. |
| Stay areas / property constraints | https://familytripwise.com/where-to-stay/las-vegas-with-kids.html | 20 for exact area query; overlaps 3,980+ hotel/resort variants | Avg position 44.69; 13 impressions | Top 20 | `where to stay in Las Vegas with kids`; `best area to stay in Las Vegas with kids`; `where should families stay in Las Vegas` | Live, indexed, and already reframed away from unsupported recommendations. | Five area hypotheses, comparison, three property examples, and official booking/route checks. | Page is verbose and defensive, has no rough nightly ranges or recent review themes, and cannot satisfy the much larger named-hotel SERP. | Keep the area/constraint role. Simplify and route to the future hotel page after that page is researched and built. |
| Family itinerary | https://familytripwise.com/family-itinerary/las-vegas-with-kids.html | About 20 across two sampled exact itinerary phrases | Avg position 22.6; 5 impressions | Top 20 | `Las Vegas itinerary with kids`; `Las Vegas family itinerary`; `Las Vegas weekend with kids` | Live and indexed; useful supporting page with low direct demand. | One-, two-, and three-day variants, pacing rules, activity swaps, and sibling-page links. | Needs a later section/evidence pass after activity and lodging decisions settle; exact route/timing implications require current support. | Keep and observe. Review after the all-ages and lodging work, not before. |
| Family hotel comparison | Not published; proposed URL: https://familytripwise.com/where-to-stay/las-vegas-family-hotels.html | 1,900 family-friendly hotels; 880 best family hotels; 720 family resorts; 480 kid-friendly hotels | N/A: no page | Top 20 first, then Top 10 | `family friendly hotels in Las Vegas`; `best family hotels in Las Vegas`; `Las Vegas family resorts` | Justified page concept, not approved for implementation in this transaction. | SERP overlap shows hotel/resort variants repeatedly return named-property lists. | Requires full hotel evidence engine: wider candidate pool, official facts, rough total nightly ranges, current operational caveats, recent online-review themes/conflicts, map context, concise comparison, trust review, and user approval if release scope triggers a gate. | Research and build as one later action after the all-ages activity improvement. Do not create a separate `family resorts` page. |

## Review Coverage

`Cluster reviewed` means current keyword and SERP-overlap evidence establishes the page job. `Persona mapped` means the five Las Vegas research hypotheses were applied at page level. `Section review needed` means every visible block still needs a keep/compress/merge/move/replace/remove decision before implementation.

| Page | Cluster / competition coverage | Persona coverage | Section-level review | Current verdict |
|---|---|---|---|---|
| Main things-to-do hub | Complete at decision-pack level; official tourism, major publishers, family blogs, review/OTA, and community result types compared | LV-P1, LV-P3, LV-P4, LV-P5 mapped; LV-P2 routes through pool/stay | Needed as part of `FT-IMP-006` | Improve first after wider candidate research. |
| Teen activities | Teen SERP and representative firsthand/editorial competitor reviewed | LV-P4 primary; LV-P1/LV-P3 mixed-family implications | Needed after hub | Keep standalone; later remove generic overlap and deepen teen-specific decisions. |
| Stay areas / property constraints | Hotel, resort, and where-to-stay SERP boundary reviewed | LV-P1, LV-P2, LV-P3, LV-P5 mapped | Existing page was reviewed previously for trust; concise usefulness re-review still needed | Keep distinct area/constraint role and simplify after hotel-page creation. |
| Family itinerary | Itinerary/pacing SERP reviewed directionally | LV-P1, LV-P3, LV-P4, LV-P5 mapped | Needed later | Keep as support; it should consume the final activity/lodging architecture. |
| Proposed family hotels | Hotel/resort SERP and representative OTA/publisher/local pages reviewed at cluster level | LV-P1, LV-P2, LV-P3, LV-P5 mapped | Full evidence and page review required before creation | Separate named-hotel page is justified, but it is second in the implementation sequence. |

## Cluster Decisions

| Query family | Page decision |
|---|---|
| Broad family activities | Existing all-ages hub. |
| Teens/tweens | Existing standalone teen page. |
| Family-friendly hotels / best family hotels / family resorts | One future named-hotel page. |
| Where to stay / best area | Existing area/property-constraint page. |
| Family itinerary / weekend | Existing itinerary support page. |
| Free/budget | Prominent all-ages module first; standalone page only after further evidence. |
| Toddler / indoor / heat / stroller / waterslides | Filters or modules, not new URLs now. |

## Current Priority

Las Vegas is the next city. The one promoted implementation is `FT-IMP-006` / `IMP-020`: improve the existing all-ages things-to-do hub after a wider candidate review and an every-section persona/competitor/evidence pass. This research action changes no public page. The family-hotel page is justified and queued behind the hub; it is not part of the next implementation.

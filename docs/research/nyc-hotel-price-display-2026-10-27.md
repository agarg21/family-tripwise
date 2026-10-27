# NYC family-hotel price display (Q06), 2026-10-27

Decision: remove the twelve unobserved NYC price bands. Each hotel now shows "Check live rate" plus its older two-adult sample.

| Hotel | Former page band | Kept older observation (Expedia, checked 2026-07-25, two adults, one night) | Change |
|---|---|---|---|
| Hotel Beacon | $330-$750+ | $331 (stay Aug 11) | band removed |
| Homewood Suites Midtown | $230-$550+ | $226 (stay date not recorded) | band removed |
| Residence Inn Central Park | $230-$550+ | $227 (stay Aug 16) | band removed |
| Radio City Apartments | $190-$600+ | $190 (ledger: $190-$194; stay date not recorded) | band removed |
| Embassy Suites Times Square | $220-$500+ | $221 (stay Aug 9) | band removed |
| TRYP Times Square / Midtown | $210-$700+ | $205 (stay date not recorded) | band removed |
| The Kimberly | $350-$850+ | $352 (stay Aug 6) | band removed |
| Marriott Marquis | $380-$900+ | $375 (stay Aug 20) | band removed |
| Conrad Downtown | $470-$1,000+ | $473 (stay Aug 2) | band removed |
| Lotte New York Palace | $590-$1,500+ | $593 (stay Aug 23) | band removed |
| 1 Hotel Brooklyn Bridge | $660-$1,400+ | $664 (stay recorded as July 6, year not recorded) | band removed |
| Four Seasons Downtown | $900-$1,900+ | $904 (stay Aug 2) | band removed |

Source of the samples: `docs/research/new-york-city-family-hotel-evidence-pack.md` (property ledger, "Public price basis"). The upper ends were editorial ceilings (`docs/research/nyc-historical-price-basis-2026-09-30.md`), never observed.

No new prices were observed this run. All twelve official booking paths are JavaScript booking engines (SynXis, Hilton, Marriott, Wyndham, brand sites), so a page fetch does not return a dated 2 adults + 2 children rate. The operator does not script booking engines or get around bot protection. A future-stay official family rate stays a research gap. Fill it only from an official rate that can be read without scripting, or one the owner supplies.

The October 11, 2026 five-person samples (Beacon, Radio City, TRYP) are unchanged and still labelled older observations.

// G18 (OWNER D39, docs/plan/hotel-price-samples.md): a normal Fri-Sun weekend and holiday weekends, each priced by two
// 1-night Google Hotels searches (per night by construction). A night's figure is the unpaid USD price under the hotel's
// exact title in its own search; another search's figure fills a gap and any differing figure stays visible in `also`.
const etDate = (stamp) => new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(stamp.replace(" +00:00", "Z").replace(" ", "T")));

const priceOf = (search, title) => {
  const rows = search.results.filter((row) => row.title === title);
  return rows.length === 1 && !rows[0].is_paid && rows[0].currency === "USD" && Number.isInteger(rows[0].price) && rows[0].price > 0 ? rows[0].price : null;
};

export function nightPrice(searches, { prefix, title, tag, childAges }) {
  const own = searches.find((search) => search.label === `${prefix}-${tag}-1n`);
  if (!own) return null;
  const peers = searches.filter((search) => search.nights === 1 && search.check_in === own.check_in && search.party.adults === 2 && search.party.child_ages.join() === childAges.join());
  const values = [priceOf(own, title), ...peers.filter((search) => search !== own).map((search) => priceOf(search, title))].filter((value) => value !== null);
  const unique = [...new Set(values)];
  return Object.freeze({ check_in: own.check_in, observed_on: etDate(own.checked_at), nightly: unique[0] ?? null, also: unique.slice(1) });
}

// Both nights priced: average and 2-night sum (estimate). One night: that night only, never multiplied.
export function weekendPrice(searches, { prefix, title, tags, childAges }) {
  const [fri, sat] = tags.map((tag) => nightPrice(searches, { prefix, title, tag, childAges }));
  if (!fri || !sat) throw new Error(`Missing search for ${prefix} ${tags}`);
  const both = fri.nightly !== null && sat.nightly !== null;
  return Object.freeze({ fri, sat, both, any: fri.nightly !== null || sat.nightly !== null,
    total: both ? fri.nightly + sat.nightly : null,
    average: both ? Math.round((fri.nightly + sat.nightly) / 2) : (fri.nightly ?? sat.nightly),
    low: Math.min(...[fri.nightly, sat.nightly].filter((value) => value !== null)) });
}

// A sample leaves the page 7 days before its first night.
export const weekendLive = (weekend, today) => today < new Date(Date.parse(`${weekend.fri.check_in}T12:00:00Z`) - 7 * 86400000).toISOString().slice(0, 10);

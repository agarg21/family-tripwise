// Q17b (D8/D20): Google Hotels listing prices pulled through DataForSEO (docs/research/dataforseo-*.json receipts).
// Same rule as the released DC band: a figure is used only when exactly one unpaid USD row carries the hotel's
// exact title in both the multi-night search and its 1-night control, and the control is within 10% of the
// multi-night figure (so the figure is a nightly price, not a stay total). Google does not show the room type,
// taxes or fees, so a sample is the hotel's listing price for the stated party and dates, never a quote.
import { readFileSync } from "node:fs";

export const readReceipt = file => JSON.parse(readFileSync(new URL(`../../docs/research/${file}`, import.meta.url), "utf8"));
const etDate = iso => new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(iso.replace(" +00:00", "Z").replace(" ", "T")));

export function googleHotelSample(receipt, prefix, { title, childAges }) {
  const find = label => receipt.searches.find(search => search.label === label);
  const five = find(`${prefix}-5n`), one = find(`${prefix}-1n`);
  const only = search => {
    const rows = search ? search.matched.filter(row => row.title === title) : [];
    return rows.length === 1 && !rows[0].is_paid && rows[0].currency === "USD" && Number.isInteger(rows[0].price) && rows[0].price > 0 ? rows[0].price : null;
  };
  const nightly = only(five), control = only(one);
  if (nightly === null || control === null || Math.abs(nightly - control) > nightly * 0.1) return null;
  if (five.party.adults !== 2 || five.party.child_ages.join() !== childAges.join() || one.check_in !== five.check_in || one.nights !== 1) return null;
  return Object.freeze({ nightly, control, title, check_in: five.check_in, check_out: five.check_out, nights: five.nights,
    observed_on: etDate(five.checked_at), adults: five.party.adults, child_ages: [...five.party.child_ages] });
}

// The sample drops on its arrival date (Eastern), so a passed stay is never shown as a planning price.
// dropDaysEarly > 0 hides it that many days before arrival (for pages not re-rendered daily).
export const dropDate = (sample, dropDaysEarly = 0) => new Date(Date.parse(`${sample.check_in}T12:00:00Z`) - dropDaysEarly * 86400000).toISOString().slice(0, 10);
export const liveSample = (sample, today, dropDaysEarly = 0) => (sample && today < dropDate(sample, dropDaysEarly) ? sample : null);

const monthDay = iso => new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", { month: "long", day: "numeric", timeZone: "UTC" });
export const dollars = value => `$${Number(value).toLocaleString("en-US")}`;
export const kidsText = ages => `kids ${ages.slice(0, -1).join(", ")}${ages.length > 1 ? " and " : ""}${ages.at(-1)}`;
// "January 15 to 20, 2027"
export const stayRange = sample => sample.check_out.slice(0, 7) === sample.check_in.slice(0, 7)
  ? `${monthDay(sample.check_in)} to ${Number(sample.check_out.slice(8, 10))}, ${sample.check_in.slice(0, 4)}`
  : `${monthDay(sample.check_in)} to ${monthDay(sample.check_out)}, ${sample.check_out.slice(0, 4)}`;
// "Jan 15-20, 2027" (or "Jan 30-Feb 4, 2027" across months)
export const shortRange = sample => stayRange(sample); export const shortRangeCompact = sample => { const m = iso => new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", { month: "short", timeZone: "UTC" }); const d = iso => Number(iso.slice(8, 10));
  return `${m(sample.check_in)} ${d(sample.check_in)}-${m(sample.check_out) === m(sample.check_in) ? "" : `${m(sample.check_out)} `}${d(sample.check_out)}, ${sample.check_out.slice(0, 4)}`; };
export const shortSeen = sample => new Date(`${sample.observed_on}T12:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
export const seenText = sample => `${monthDay(sample.observed_on)}, ${sample.observed_on.slice(0, 4)}`;
export const stayEstimate = sample => dollars(sample.nightly * sample.nights);

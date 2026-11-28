// NYC hotel rooms by bed setup (owner 2026-11-28; demand FT-RES-197 in docs/research/nyc-family-stay-demand-2026-11-27.md).
// One page, one section per room type, one card per hotel, all built from tools/page-generation/nyc-room-setups.json.
// Room facts were read on the hotel's own page or a named booking-site listing (each card links its source and says which).
// Prices are Google Hotels estimates for a family of 4 (2 adults + kids 5 and 8), one 1-night search per night of the
// Jan 22-24, 2027 weekend (G18 receipts of Nov 21 and FT-RES-198 receipts of Nov 28). Google does not say which room it
// priced, so the price is the cheapest room Google showed for 4, not necessarily the family room on the card. Prices drop
// 7 days before the first night (tools/this-week.mjs re-renders the page daily).
import { readFileSync, existsSync } from "node:fs";
import { contributorCredit } from "./contributors.mjs";
import { siteHeader, siteEnd, addHolidayLink } from "./site-chrome.mjs";
import { readableText } from "./readable-text.mjs";
import { withLinkPreview } from "./link-previews.mjs";
import { readReceipt, dollars } from "./google-hotel-samples.mjs";
import { easternDate } from "./sitemap.mjs";

export const roomSetupsData = () => JSON.parse(readFileSync(new URL("./nyc-room-setups.json", import.meta.url), "utf8"));
export const roomSetupsPath = roomSetupsData().path;
export const roomSetupsUrl = `https://familytripwise.com/${roomSetupsPath}`;
const receipts = [..."abcdefghij"].map((p) => `dataforseo-g18-nyc-${p}-2026-11-21.json`).concat(["a", "b", "c", "d", "e"].map((p) => `dataforseo-nyc-room-setups-prices-${p}-2026-11-28.json`)).filter((file) => existsSync(new URL(`../../docs/research/${file}`, import.meta.url)));
const searches = () => receipts.flatMap((file) => readReceipt(file).searches);
const KINDS = { official: "Hotel's own page", booking: "Booking-site listing", press: "Trade press" };
const FIELDS = ["id", "name", "area", "price_title", "setups", "room", "beds", "sleeps", "size", "door", "bathrooms", "kitchen", "breakfast", "connecting", "crib", "catch", "source"];

export function validateRoomSetups(data) {
  const ids = new Set();
  for (const h of data.hotels) {
    for (const f of FIELDS) if (h[f] === undefined || h[f] === "") throw new Error(`${h.id ?? "hotel"}: missing ${f}`);
    if (ids.has(h.id)) throw new Error(`duplicate ${h.id}`);
    ids.add(h.id);
    for (const s of h.setups) { if (!data.setups[s]) throw new Error(`${h.id}: unknown setup ${s}`); if (!h.notes?.[s]) throw new Error(`${h.id}: no ${s} note`); }
    for (const src of [h.source, h.source2, h.reported].filter(Boolean)) if (!/^https:\/\//.test(src.url) || !src.label) throw new Error(`${h.id}: bad source`);
    for (const src of [h.source, h.source2].filter(Boolean)) if (!KINDS[src.kind]) throw new Error(`${h.id}: unknown source kind`);
  }
  for (const s of Object.keys(data.setups)) if (!data.sections[s]) throw new Error(`missing section ${s}`);
  for (const b of data.booked ?? []) {
    for (const f of ["party", "when", "stay", "what", "label", "url"]) if (!b[f]) throw new Error(`booked row: missing ${f}`);
    if (!/^https:\/\/www\.(reddit|tripadvisor)\.com\//.test(b.url)) throw new Error(`booked row: ${b.url} is not a Reddit or Tripadvisor post`);
    if (b.hotel && !ids.has(b.hotel)) throw new Error(`booked row: unknown hotel ${b.hotel}`);
  }
  return data;
}

const priceOf = (search, title) => {
  const rows = search.results.filter((row) => row.title === title);
  return rows.length === 1 && !rows[0].is_paid && rows[0].currency === "USD" && Number.isInteger(rows[0].price) && rows[0].price > 0 ? rows[0].price : null;
};
const etDay = (stamp) => new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(stamp.replace(" +00:00", "Z").replace(" ", "T")));
// One night: the hotel's own keyword search (its exact Google title in `matched`), newest by checked_at. If that newest
// search shows no price, the night is unpriced: an older figure is never carried forward.
function night(all, title, checkIn, kids) {
  const own = all.filter((s) => s.nights === 1 && s.check_in === checkIn && s.party.adults === 2 && s.party.child_ages.join() === kids.join() && (s.matched ?? []).some((row) => row.title === title))
    .sort((a, b) => b.checked_at.localeCompare(a.checked_at));
  if (!own.length) return null;
  const rows = own[0].matched.filter((row) => row.title === title);
  const price = rows.length === 1 && !rows[0].is_paid && rows[0].currency === "USD" && Number.isInteger(rows[0].price) && rows[0].price > 0 ? rows[0].price : null;
  return price === null ? null : { price, seen: etDay(own[0].checked_at) };
}
export function roomSetupPrice(data, hotel, today, all = searches()) {
  const drop = new Date(Date.parse(`${data.weekend.fri}T12:00:00Z`) - 7 * 86400000).toISOString().slice(0, 10);
  if (today >= drop) return null;
  const fri = night(all, hotel.price_title, data.weekend.fri, data.party.child_ages), sat = night(all, hotel.price_title, data.weekend.sat, data.party.child_ages);
  if (!fri && !sat) return null;
  const both = Boolean(fri && sat);
  return { fri, sat, both, average: both ? Math.round((fri.price + sat.price) / 2) : (fri ?? sat).price, total: both ? fri.price + sat.price : null, seen: [fri, sat].filter(Boolean).map((n) => n.seen).sort().at(-1) };
}

const e = (v) => String(readableText(v)).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
const link = (u, t) => `<a href="${e(u)}">${e(t)}</a>`;
const monthDay = (iso) => new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
const longDate = (iso) => new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
const nightText = (p) => p.both ? `≈ ${dollars(p.average)} a\u00a0night` : `≈ ${dollars(p.average)} a\u00a0night (${p.fri ? "Friday" : "Saturday"} only)`;
const cellText = (p) => p.both ? `≈ ${dollars(p.average)}` : `≈ ${dollars(p.average)} (${p.fri ? "Fri" : "Sat"} only)`;
const dayList = (days) => { const u = [...new Set(days)].sort(); if (!u.length) return ""; const parts = u.map((d, i) => i && d.slice(0, 7) === u[i - 1].slice(0, 7) ? String(Number(d.slice(8))) : monthDay(d)); return parts.length < 2 ? parts[0] : `${parts.slice(0, -1).join(", ")} and ${parts.at(-1)}`; };
const seenDays = (p) => [...new Set([p.fri, p.sat].filter(Boolean).map((n) => n.seen))].sort().map(monthDay).join(" and ");
const priceNote = (data, p) => p.both ? `${dollars(p.total)} for ${data.weekend.label}. Seen ${seenDays(p)}.` : `${data.weekend.label}; Google showed one night only. Seen ${seenDays(p)}.`;
const reportedLine = (r) => `<p class="london-note"><strong>${e(r.who ?? "A family reported")}:</strong> ${e(r.text)} ${link(r.url, r.label)} (a forum post, not checked by us).</p>`;

function card(data, h, p) {
  const price = p ? `<strong>${e(nightText(p))}</strong>. ${e(priceNote(data, p))}` : "Check live rate: no current Google price for a family of 4.";
  const shown = [["Where", h.area], ["Family room", h.room], ["Price", null], ["Beds", h.beds], ["Sleeps", h.sleeps]].filter(([, v]) => v !== "Not stated");
  const more = [["Size", h.size], ["Separate bedroom", h.door], ["Bathrooms", h.bathrooms], ["Kitchen", h.kitchen], ["Breakfast", h.breakfast], ["Connecting rooms", h.connecting], ["Crib", h.crib]];
  const stated = more.filter(([, v]) => v !== "Not stated"), missing = [...more, ["Sleeps", h.sleeps]].filter(([, v]) => v === "Not stated").map(([k]) => k.toLowerCase());
  const li = ([k, v]) => `<li><strong>${e(k)}:</strong> ${v === null ? price : e(v)}</li>`;
  const srcs = [h.source, h.source2].filter(Boolean).map((s) => `${link(s.url, s.label)} (${e(KINDS[s.kind].toLowerCase())})`).join(" · ");
  return `<section id="${e(h.id)}" class="london-room"><h2>${e(h.name)}</h2><ul class="room-facts">${shown.map(li).join("")}<li><strong>The catch:</strong> ${e(h.catch)}</li></ul>${h.reported ? reportedLine(h.reported) : ""}<details class="how-checked"><summary>More room facts and sources</summary><ul class="room-facts">${stated.map(li).join("")}${missing.length ? `<li><strong>Not stated:</strong> ${e(missing.join(", "))}. Ask the hotel.</li>` : ""}</ul><p>Read ${e(longDate(data.read_on))}: ${srcs}.</p></details></section>`;
}

function setupSection(data, key, hotels, prices, basis) {
  const sec = data.sections[key];
  const list = hotels.filter((h) => h.setups.includes(key)).sort((a, b) => (prices[a.id]?.average ?? 1e9) - (prices[b.id]?.average ?? 1e9));
  const item = (h) => `<li>${link(`#${h.id}`, h.name)} · ${e(h.area)}: ${e(h.notes[key])}${prices[h.id] ? ` · <strong>${e(nightText(prices[h.id]))}</strong>` : " · check live rate"}</li>`;
  return `<section id="${e(key)}"><h2>${e(data.setups[key].title)}</h2><p>${e(sec.intro)}${key === "sleeps5" ? " Prices are for 4; check the live rate for your party." : ""}</p><ul>${list.map(item).join("")}</ul><p><strong>Check before booking:</strong> ${e(sec.check)}</p>${sec.reported ? `${reportedLine(sec.reported)}${basis ? `<p class="london-source">${e(basis)}</p>` : ""}` : ""}</section>`;
}

function bookedSection(data) {
  const rows = [...(data.booked ?? [])].sort((a, b) => Number(!a.hotel || /not stated/i.test(a.when)) - Number(!b.hotel || /not stated/i.test(b.when)));
  if (!rows.length) return "";
  const stay = (b) => b.hotel ? `${e(b.stay)} ${link(`#${b.hotel}`, "(see hotel)")}` : e(b.stay);
  const table = (list, label) => `<div class="london-scroll" tabindex="0" role="region" aria-label="${e(label)}"><table class="london-comparison london-rooms"><caption>Parents' trip reports and forum posts, paraphrased. Follow the link for the full post.</caption><thead><tr><th scope="col">Family</th><th scope="col">Where they stayed</th><th scope="col">What they said</th><th scope="col">Post</th></tr></thead><tbody>${list.map((b) => `<tr><th scope="row">${e(b.party)}<small>${e(b.when)}</small></th><td data-label="Where they stayed">${stay(b)}</td><td data-label="What they said">${e(b.what)}</td><td data-label="Post">${link(b.url, b.label)}</td></tr>`).join("")}</tbody></table></div>`;
  const first = rows.slice(0, 4), rest = rows.slice(4);
  return `<section id="booked"><h2>What NYC families actually booked</h2><p>${rows.length} families' own posts from 2025-2026, in our words. Posts read by ${e(monthDay(data.booked_read_on))}, 2026; we did not check what they say.</p>${table(first, "What NYC families booked")}${rest.length ? `<details class="how-checked"><summary>${rest.length} more family stays</summary>${table(rest, "More NYC family stays")}</details>` : ""}</section>`;
}

export function roomSetupsPage(today = process.env.FT_BUILD_DATE || easternDate(), data = validateRoomSetups(roomSetupsData())) {
  const all = searches();
  const prices = Object.fromEntries(data.hotels.map((h) => [h.id, roomSetupPrice(data, h, today, all)]));
  const priced = data.hotels.filter((h) => prices[h.id]);
  const sorted = [...data.hotels].sort((a, b) => (prices[a.id]?.average ?? 1e9) - (prices[b.id]?.average ?? 1e9));
  const both = priced.map((h) => prices[h.id]).filter((p) => p.both).map((p) => p.average);
  const seen = priced.map((h) => prices[h.id].seen).sort();
  const n = data.hotels.length, keys = Object.keys(data.setups);
  const count = (k) => data.hotels.filter((h) => h.setups.includes(k)).length;
  const title = "NYC Family Hotel Rooms: Suites, Bunk Beds & 2 Queens";
  const description = `${n} New York City hotels by room type for families: bunk beds, two queen beds, suites with a door, connecting rooms, kitchenettes and free breakfast, with sources.`;
  const glance = priced.length && both.length
    ? `<p class="price-answer-label">Family of 4 (2 adults + kids 5, 8) · ${e(data.weekend.label)}</p><p class="price-figure">About ${e(dollars(Math.min(...both)))}–${e(dollars(Math.max(...both)))} a\u00a0night</p><p class="price-basis">Cheapest room Google Hotels showed for 4 at each hotel, seen ${e(seen[0] === seen.at(-1) ? monthDay(seen[0]) : `${monthDay(seen[0])}–${seen.at(-1).slice(8).replace(/^0/, "")}`)}, 2026. It may not be the family room named here. Taxes and any nightly fee may be extra. Estimate, not a quote.</p>`
    : `<p class="price-answer-label">Family of 4 (2 adults + kids 5, 8)</p><p class="price-figure">Check live rates</p><p class="price-basis">No current Google prices for these hotels. Enter every child's age when you search.</p>`;
  const from = (k) => { const ps = data.hotels.filter((h) => h.setups.includes(k) && prices[h.id]?.both).map((h) => prices[h.id].average); return ps.length ? `, from ≈ ${dollars(Math.min(...ps))}` : ""; };
  const picks = keys.map((k) => `<li><span class="pick-chip">${e(data.setups[k].short)}</span> <span>${link(`#${k}`, `${count(k)} hotels`)}${e(from(k))}</span></li>`).join("");
  const table = `<div class="london-scroll" tabindex="0" role="region" aria-label="NYC family hotel rooms compared"><table class="london-comparison london-rooms"><caption>${priced.length ? `Price: US dollars a night, cheapest room Google showed for a family of 4, ${e(data.weekend.label)}. Not quotes.` : "Room types and beds. Check live rates."}</caption><thead><tr><th scope="col">Hotel</th><th scope="col">Cheapest room for 4, a night</th><th scope="col">Family room</th><th scope="col">Sleeps</th></tr></thead><tbody>${sorted.map((h) => `<tr><th scope="row">${link(`#${h.id}`, h.name)}<small>${e(h.area)}</small></th><td data-label="Cheapest room for 4, a night">${prices[h.id] ? `<strong>${e(cellText(prices[h.id]))}</strong>` : "Check live rate"}</td><td data-label="Family room">${e(h.room)}</td><td data-label="Sleeps">${e(h.sleeps)}</td></tr>`).join("")}</tbody></table></div>`;
  const schema = { "@context": "https://schema.org", "@type": "WebPage", name: "NYC family hotel rooms by bed setup", url: roomSetupsUrl, description };
  return withLinkPreview(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${e(title)}</title><meta name="description" content="${e(description)}"><link rel="canonical" href="${roomSetupsUrl}"><link rel="stylesheet" href="../styles.css"><script type="application/ld+json">${JSON.stringify(schema)}</script></head><body class="london-page">${siteHeader("../", roomSetupsPath)}
<main id="main"><section class="london-intro"><p class="eyebrow">New York City · family hotel rooms</p><h1>NYC hotel rooms that fit a family</h1>
${contributorCredit()}<p class="london-lead">${n} hotels sorted by the room you need: bunk beds, two queens, a separate bedroom, connecting rooms, a kitchen or free breakfast.</p><section id="glance" class="answer-box price-answer" aria-label="Price at a glance">${glance}<p class="pick-heading"><strong>Jump to the room you need</strong></p><ul class="pick-list">${picks}</ul>${data.booked?.length ? `<p><strong>${link("#booked", `What ${data.booked.length} NYC families actually booked`)}</strong>: their own posts, linked.</p>` : ""}<p class="price-catch"><strong>Main catch:</strong> many NYC "two-bed" rooms are two doubles, and many "suites" have no door. Check both before you book.</p></section><p class="london-source">Room facts read ${e(longDate(data.read_on))} on each hotel's page or a named booking site. Research, not our own stays.</p><figure class="licensed-photo hero-photo"><img src="../images/new-york-city-brooklyn-bridge-park-skyline-2014.webp" width="1600" height="1200" loading="eager" fetchpriority="high" decoding="async" alt="The Manhattan skyline seen across the East River from Brooklyn Bridge Park."><figcaption>Manhattan from Brooklyn Bridge Park. Photo by Arribas91 via ${link("https://commons.wikimedia.org/wiki/File:Manhattan_Skyline_from_Brooklyn_Bridge_Park.jpg", "Wikimedia Commons")}, ${link("https://creativecommons.org/licenses/by-sa/3.0", "CC BY-SA 3.0")}. Resized and cropped.</figcaption></figure></section>
<section id="compare"><h2>All ${n} hotels at a glance</h2><p>Sorted by price. The price is the hotel\'s cheapest room for 4 on Google, not always the family room. Tap a hotel for its beds, kitchen and the catch.</p>${table}</section>
<section id="by-room"><h2>By room type</h2><p>${priced.length ? `Each price is the cheapest room Google showed for a family of 4, ${e(data.weekend.label)}, maybe not the room named. Seen ${e(dayList(seen))}, 2026.` : "Check live rates for each hotel."}</p></section>
${keys.map((k) => setupSection(data, k, data.hotels, prices, priced.length ? `Prices: family of 4, ${data.weekend.label}, Google Hotels, seen ${dayList(seen)}, 2026. Not quotes.` : "")).join("\n")}
${bookedSection(data)}
<section id="hotels"><h2>Hotel by hotel</h2><p>Each card says where its facts come from. "Listing" means a booking site, not the hotel itself. Each price is the cheapest room Google showed for a family of 4, maybe not the family room.</p></section>
${sorted.map((h) => card(data, h, prices[h.id])).join("\n")}
<section id="before-booking"><h2>Before you book any of them</h2><ul><li>Search for everyone who will stay, with each child's age.</li><li>Book the named room type, not "run of house" or "room assigned at check-in".</li><li>Ask the hotel to confirm beds, sofa bed, crib and any connection in writing.</li><li>Get the full price with taxes and any nightly fee.</li></ul><p>Comparing areas and prices instead? ${link("./new-york-city-family-hotels.html", "NYC family hotels by trip style")} · ${link("./new-york-city-with-kids.html", "Where to stay in NYC with kids")}</p></section>
<section id="methodology"><h2>How we checked this page</h2><p>Desk research, not firsthand stays or a ranking.</p><details class="how-checked"><summary>Sources, prices and limits</summary><p>Room facts were read on ${e(longDate(data.read_on))} from each hotel's own room page where it publishes them, and otherwise from a named booking-site listing. Each card says which. Booking sites sometimes disagree with each other; where they did, the card says so. "Not stated" means our source did not say.</p><p>${priced.length ? `Prices are Google Hotels listing prices pulled through DataForSEO on ${e(seen.map(longDate).filter((d, i, a) => a.indexOf(d) === i).join(" and "))}: one 1-night search per night for 2 adults and kids 5 and 8. Each night uses the hotel's own search, newest first; if that search showed no price, the night is left blank rather than filled from an older one. The headline is the average of Friday and Saturday; the weekend figure is their sum, both estimates. Google does not show which room it priced, or which taxes and fees it includes. Prices leave the page a week before the first night.` : "Google Hotels prices leave this page a week before the first sampled night, so none is shown now."}</p><p>"A family reported" notes are forum posts we read; we did not check them. No safety, stroller or stay experience is claimed. ${link("../about.html", "Our research and uncertainty policy")}</p></details></section></main>${siteEnd("../", roomSetupsPath)}</body></html>\n`);
}
export function writeRoomSetupsPage(writeSite, today = process.env.FT_BUILD_DATE || easternDate()) { writeSite(roomSetupsPath, addHolidayLink(roomSetupsPage(today), roomSetupsPath)); }

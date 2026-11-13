// R1 step 6 (OWNER D44, review #10): what a family of 4 pays for a holiday weekend vs a normal weekend, by city.
// Built only from the G18 Google Hotels receipts the family-hotel pages already use (same hotel titles, same
// weekendPrice rule): 2 adults + kids 5 and 8, two 1-night searches per weekend, USD per night, seen Nov 5-6, 2026.
// A hotel enters a city's comparison only when both nights are priced for both weekends compared (like with like).
// A weekend set leaves the study 7 days before its first night (weekendLive), exactly as on the hotel pages.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { weekendPrice, weekendLive } from "./weekend-hotel-samples.mjs";

const research = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../docs/research");
const read = (file) => JSON.parse(fs.readFileSync(path.join(research, file), "utf8"));
const receipts = (city, parts, day = "05") => parts.map((part) => `dataforseo-g18-${city}-${part}-2026-11-${day}.json`);

// page: the family-hotel page whose generator uses the same prefix and exact title (tools/holiday-hotel-study.test.mjs checks it).
export const STUDY_CITIES = Object.freeze([
  { id: "nyc", name: "New York City", page: "where-to-stay/new-york-city-family-hotels.html", source: "family-hotel-pages.mjs", files: receipts("nyc", [..."abcdefghij"]), newYear: ["jan01", "jan02"],
    hotels: [["nyc-beacon", "Hotel Beacon"], ["nyc-homewood", "Homewood Suites by Hilton New York/Midtown Manhattan Times Square-South, NY"], ["nyc-residence-cp", "Residence Inn by Marriott New York Manhattan/Central Park"], ["nyc-radio-city", "Radio City Apartments"], ["nyc-embassy", "Embassy Suites by Hilton New York Manhattan Times Square"], ["nyc-tryp", "TRYP by Wyndham New York City Times Square South"], ["nyc-kimberly", "The Kimberly Hotel"], ["nyc-marquis", "New York Marriott Marquis"], ["nyc-conrad", "Conrad New York Downtown"], ["nyc-palace", "Lotte New York Palace"], ["nyc-1hotel", "1 Hotel Brooklyn Bridge"], ["nyc-four-seasons", "Four Seasons Hotel New York Downtown"]] },
  { id: "chicago", name: "Chicago", page: "where-to-stay/chicago-family-hotels.html", source: "family-hotel-pages.mjs", files: receipts("chicago", [..."abcdefghi"]), newYear: ["jan01", "jan02"],
    hotels: [["chi-embassy-suites", "Embassy Suites by Hilton Chicago Downtown Magnificent Mile"], ["chi-homewood", "Homewood Suites by Hilton Chicago-Downtown"], ["chi-residence-inn", "Residence Inn by Marriott Chicago Downtown/River North"], ["chi-sable", "Sable at Navy Pier Chicago, Curio Collection by Hilton"], ["chi-swissotel", "Swissotel Chicago"], ["chi-intercontinental", "InterContinental Chicago Magnificent Mile by IHG"], ["chi-hilton", "Hilton Chicago"], ["chi-zachary", "Hotel Zachary, Chicago, a Tribute Portfolio Hotel"], ["chi-four-seasons", "Four Seasons Hotel Chicago"], ["chi-langham", "The Langham, Chicago"]] },
  { id: "orlando", name: "Orlando", page: "where-to-stay/orlando-family-hotels.html", source: "orlando-suite-page.mjs", files: receipts("orlando", ["a", "b", "c"]), newYear: ["jan1", "jan2"],
    hotels: [["orl-aoa", "Disney's Art of Animation Resort"], ["orl-cabana", "Universal's Cabana Bay Beach Resort"], ["orl-hi", "Holiday Inn Resort Orlando Suites - Waterpark by IHG"]] },
  { id: "sd", name: "San Diego", page: "where-to-stay/san-diego-family-hotels.html", source: "family-hotel-pages.mjs", files: receipts("sd", [..."abcdefghij"]), newYear: ["jan01", "jan02"],
    hotels: [["sd-bahia", "Bahia Resort Hotel"], ["sd-mission-bay", "San Diego Mission Bay Resort"], ["sd-hyatt-mb", "Hyatt Regency Mission Bay Spa and Marina"], ["sd-paradise", "Paradise Point Resort & Spa"], ["sd-catamaran", "Catamaran Resort Hotel and Spa"], ["sd-homewood", "Homewood Suites by Hilton San Diego Downtown/Bayside"], ["sd-legoland-hotel", "LEGOLAND® Castle Hotel"], ["sd-loews", "Loews Coronado Bay Resort"], ["sd-la-jolla-shores", "La Jolla Shores Hotel"], ["sd-del", "Hotel del Coronado"], ["sd-dana", "The Dana on Mission Bay"], ["sd-manchester", "Manchester Grand Hyatt San Diego"]] },
  { id: "sa", name: "San Antonio", page: "where-to-stay/san-antonio-family-hotels.html", source: "family-hotel-pages.mjs", files: receipts("sa", [..."abcdefghi", "retry", "retry2"]), newYear: ["jan01", "jan02"],
    hotels: [["sa-hyatt-hill-country", "Hyatt Regency Hill Country Resort and Villas"], ["sa-jw-marriott", "JW Marriott San Antonio Hill Country Resort & Spa"], ["sa-signia", "La Cantera Resort & Spa, A Signia Hilton Resort"], ["sa-wild-oak", "Hyatt Vacation Club at Wild Oak Ranch"], ["sa-embassy", "Embassy Suites by Hilton San Antonio Riverwalk Downtown"], ["sa-homewood", "Homewood Suites by Hilton San Antonio-Riverwalk/Downtown"], ["sa-home2", "Home2 Suites by Hilton San Antonio Riverwalk"], ["sa-drury", "Drury Plaza Hotel San Antonio Riverwalk"], ["sa-contessa", "Hotel Contessa"], ["sa-hyatt-riverwalk", "Hyatt Regency San Antonio Riverwalk"], ["sa-rivercenter", "San Antonio Marriott Rivercenter on the River Walk"], ["sa-la-mansion", "Omni La Mansión del Rio"]] },
  { id: "dc", name: "Washington DC", page: "where-to-stay/washington-dc-family-hotels.html", source: "washington-dc-family-hotels-page.mjs", files: receipts("dc", ["a", "b", "c"]), newYear: ["jan01", "jan02"],
    hotels: [["dc-embassy", "Embassy Suites by Hilton Washington DC Convention Center"], ["dc-homewood", "Homewood Suites by Hilton Washington, D.C. Downtown"], ["dc-pendry", "Pendry Washington DC - The Wharf"]] },
  { id: "boston", name: "Boston", page: "where-to-stay/boston-family-hotels.html", source: "boston-family-hotels-page.mjs", files: receipts("bos", ["a", "b", "c", "d", "retry"]), newYear: ["jan01", "jan02"],
    hotels: [["bos-residence", "Residence Inn by Marriott Boston Back Bay/Fenway"], ["bos-parkplaza", "Hilton Boston Park Plaza"], ["bos-fourseasons", "Four Seasons Hotel Boston"], ["bos-langham", "The Langham, Boston"]] },
  { id: "lv", name: "Las Vegas", page: "where-to-stay/las-vegas-family-hotels.html", source: "family-hotel-pages.mjs", files: receipts("lv", [..."abcdefgh", "retry"]), newYear: ["jan01", "jan02"],
    hotels: [["lv-mandalay-bay", "Mandalay Bay"], ["lv-four-seasons", "Four Seasons Hotel Las Vegas"], ["lv-vdara", "Vdara Hotel & Spa"], ["lv-grand-chateau", "Marriott's Grand Chateau"], ["lv-tahiti-village", "Tahiti Village"], ["lv-cancun-resort", "Hilton Vacation Club Cancun Resort Las Vegas"], ["lv-excalibur", "Excalibur Hotel & Casino"], ["lv-new-york-new-york", "New York-New York Hotel & Casino"], ["lv-resorts-world-hilton", "Las Vegas Hilton at Resorts World"], ["lv-red-rock", "Red Rock Casino Resort and Spa"]] },
  { id: "cancun", name: "Cancun", page: "where-to-stay/cancun-family-resorts.html", source: "cancun-resort-page.mjs", files: receipts("cun", ["a", "b", "c", "d", "e", "retry"], "06"), newYear: ["jan1", "jan2"],
    hotels: [["cun-sunscape", "Sunscape Cancun Resort & Spa"], ["cun-royalton", "Royalton Splash Riviera Cancun, An Autograph Collection All-Inclusive Resort"], ["cun-ziva", "Hyatt Ziva Cancun"], ["cun-finest", "Finest Playa Mujeres"], ["cun-moon-grand", "Moon palace the grand", { name: "Moon Palace The Grand Cancun", skip: { weekend: "its hotel page flags the Jan 22–24 price as unusually low" } }], ["cun-sapphire", "Dreams Sapphire Resort & Spa"]] },
  { id: "pv", name: "Puerto Vallarta", page: "where-to-stay/puerto-vallarta-family-resorts.html", source: "puerto-vallarta-family-resorts-page.mjs", files: receipts("pv", ["a", "b", "c", "d", "e"], "06"), newYear: ["jan1", "jan2"],
    hotels: [["pv-f4-hilton", "Hilton Vallarta Riviera All-Inclusive Resort", { skip: { christmas: "its hotel page flags the Dec 26 price as more than double Dec 25, unexplained" } }], ["pv-f4-vbay", "Dreams Vallarta Bay Resort & Spa"], ["pv-f4-bahia", "Dreams Bahia Mita Surf & Spa Resort"], ["pv-f4-garza", "Garza Blanca Preserve Resort & Spa Puerto Vallarta"]] }
]);

export const STUDY_KIDS = Object.freeze([5, 8]);
export const STUDY_SETS = Object.freeze({
  weekend: { tags: ["jan22", "jan23"], label: "Fri–Sun, Jan 22–24, 2027", short: "Jan 22–24" },
  christmas: { tags: ["dec25", "dec26"], label: "Christmas weekend, Fri Dec 25 – Sun Dec 27, 2026", short: "Dec 25–27" },
  newYear: { label: "New Year's weekend, Fri Jan 1 – Sun Jan 3, 2027", short: "Jan 1–3" }
});

const median = (values) => {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = sorted.length >> 1;
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
};

// Percent change of one 2-night total vs another, rounded to a whole percent.
export const pctChange = (holiday, normal) => Math.round(((holiday - normal) / normal) * 100);

export function studyCity(city, today) {
  const searches = city.files.flatMap((file) => read(file).searches);
  const tagsFor = (set) => (set === "newYear" ? city.newYear : STUDY_SETS[set].tags);
  // A pair the hotel page flags as doubtful (meta.skip) stays out of the comparison and is named on the card instead.
  const hotels = city.hotels.map(([prefix, title, meta = {}]) => {
    const sets = {};
    for (const set of Object.keys(STUDY_SETS)) {
      const w = weekendPrice(searches, { prefix, title, tags: tagsFor(set), childAges: STUDY_KIDS });
      sets[set] = { live: weekendLive(w, today), both: w.both, total: w.total, average: w.both ? w.average : null, seen: w.fri.observed_on };
    }
    return { prefix, title, name: meta.name ?? title, skip: meta.skip ?? {}, sets };
  });
  const compare = (set) => {
    const pairs = hotels.filter((h) => !h.skip.weekend && !h.skip[set] && h.sets.weekend.live && h.sets[set].live && h.sets.weekend.both && h.sets[set].both)
      .map((h) => ({ title: h.name, normal: h.sets.weekend.total, holiday: h.sets[set].total, change: pctChange(h.sets[set].total, h.sets.weekend.total) }));
    if (!pairs.length) return null;
    return { pairs, hotels: pairs.length, medianChange: Math.round(median(pairs.map((p) => p.change))),
      medianNormal: Math.round(median(pairs.map((p) => p.normal))), medianHoliday: Math.round(median(pairs.map((p) => p.holiday))),
      example: [...pairs].sort((x, y) => Math.abs(x.change - median(pairs.map((p) => p.change))) - Math.abs(y.change - median(pairs.map((p) => p.change))))[0],
      up: pairs.filter((p) => p.change > 0).length, down: pairs.filter((p) => p.change < 0).length };
  };
  const seen = [...new Set(hotels.flatMap((h) => Object.values(h.sets).map((s) => s.seen)))].sort();
  const skipped = hotels.flatMap((h) => Object.entries(h.skip).filter(([set]) => h.sets.weekend.live && h.sets[set].live).map(([set, why]) => ({ name: h.name, set, why })));
  return { skipped, id: city.id, name: city.name, page: city.page, hotelsSampled: hotels.length, christmas: compare("christmas"), newYear: compare("newYear"), seen };
}

export const studyToday = () => process.env.FT_BUILD_DATE || new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
export const holidayHotelStudy = (today = studyToday()) => STUDY_CITIES.map((city) => studyCity(city, today));

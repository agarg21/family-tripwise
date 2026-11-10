// Shared site chrome: one header, one related-guides block and one footer for every guide page.
// Every guide URL is listed here once; header, related links and the footer directory all read it,
// so a new guide only needs one entry to become reachable from every page.

export const destinations = [
  {
    name: "Chicago",
    guides: [
      ["things-to-do/chicago-with-kids.html", "Things to do with kids"],
      ["things-to-do/chicago-with-teens.html", "Chicago with teens"],
      ["where-to-stay/chicago-with-kids.html", "Where to stay (areas)"],
      ["where-to-stay/chicago-family-hotels.html", "Family hotels"],
      ["family-itinerary/chicago-with-kids.html", "Family itinerary"]
    ]
  },
  {
    name: "San Antonio",
    guides: [
      ["things-to-do/san-antonio-with-kids.html", "Things to do with kids"],
      ["things-to-do/san-antonio-with-teens.html", "San Antonio with teens"],
      ["where-to-stay/san-antonio-with-kids.html", "Where to stay (areas)"],
      ["where-to-stay/san-antonio-family-hotels.html", "Family hotels"],
      ["family-itinerary/san-antonio-with-kids.html", "Family itinerary"]
    ]
  },
  {
    name: "San Diego",
    guides: [
      ["things-to-do/san-diego-with-kids.html", "Things to do with kids"],
      ["things-to-do/san-diego-with-toddlers.html", "San Diego with toddlers"],
      ["things-to-do/san-diego-with-teens.html", "San Diego with teens"],
      ["where-to-stay/san-diego-with-kids.html", "Where to stay (areas)"],
      ["where-to-stay/san-diego-family-hotels.html", "Family hotels"],
      ["family-itinerary/san-diego-with-kids.html", "Family itinerary"]
    ]
  },
  {
    name: "Las Vegas",
    guides: [
      ["things-to-do/las-vegas-with-kids.html", "Things to do with kids"],
      ["things-to-do/las-vegas-with-teens.html", "Las Vegas with teens"],
      ["where-to-stay/las-vegas-with-kids.html", "Where to stay (areas)"],
      ["where-to-stay/las-vegas-family-hotels.html", "Family hotels"],
      ["family-itinerary/las-vegas-with-kids.html", "Family itinerary"]
    ]
  },
  {
    name: "New York City",
    short: "NYC",
    guides: [
      ["things-to-do/new-york-city-with-kids.html", "Things to do with kids"],
      ["things-to-do/new-york-city-with-teens.html", "New York City with teens"],
      ["where-to-stay/new-york-city-with-kids.html", "Where to stay (areas)"],
      ["where-to-stay/new-york-city-family-hotels.html", "Family hotels"],
      ["family-itinerary/new-york-city-with-kids.html", "Family itinerary"],
      ["ski/skiing-near-new-york-city-with-kids.html", "Skiing nearby"]
    ]
  },
  {
    name: "Orlando",
    guides: [
      ["things-to-do/orlando-with-kids.html", "Things to do with kids"],
      ["where-to-stay/orlando-family-hotels.html", "Family suite hotels"]
    ]
  },
  { name: "Washington, DC", short: "Washington DC", guides: [["where-to-stay/washington-dc-family-hotels.html", "Family hotels"], ["family-itinerary/washington-dc-with-kids.html", "Family itinerary"]], similar: ["Boston", "New York City"] },
  { name: "Boston", guides: [["where-to-stay/boston-family-hotels.html", "Family hotels"], ["family-itinerary/boston-with-kids.html", "Family itinerary"]], similar: ["Washington, DC", "New York City"] },
  { name: "London", short: "London, UK", guides: [["where-to-stay/london-family-hotels.html", "Family hotels and apartments"]], similar: ["New York City", "Boston"] },
  { name: "Cancun", guides: [["where-to-stay/cancun-family-resorts.html", "Family resorts"]], similar: ["Puerto Vallarta"] },
  { name: "Puerto Vallarta", guides: [["where-to-stay/puerto-vallarta-family-resorts.html", "Family resorts"]], similar: ["Cancun"] }
];

// QUEUE G17 (owner D37): the seasonal guides, in the header menu and near the top of each city's guide pages.
export const holidayGuides = [
  ["holidays/theme-park-christmas-events-with-kids.html", "Theme parks"],
  ["holidays/chicago-christmas-with-kids.html", "Chicago", "Chicago"],
  ["holidays/new-york-city-christmas-with-kids.html", "New York City", "New York City"],
  ["holidays/orlando-christmas-with-kids.html", "Orlando", "Orlando"],
  ["holidays/san-antonio-christmas-with-kids.html", "San Antonio", "San Antonio"],
  ["holidays/san-diego-christmas-with-kids.html", "San Diego", "San Diego"],
  ["holidays/washington-dc-christmas-with-kids.html", "Washington, DC", "Washington, DC"]
];

export const allGuidePaths = destinations.flatMap((d) => d.guides.map(([path]) => path));

function escHtml(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function citySlugFor(name) {
  return String(name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function byName(name) {
  const found = destinations.find((d) => d.name === name);
  if (!found) throw new Error(`site-chrome: unknown destination ${name}`);
  return found;
}

export function destinationFor(path) {
  return destinations.find((d) => d.guides.some(([p]) => p === path)) || null;
}

function link(prefix, path, label, current) {
  const aria = path === current ? ' aria-current="page"' : "";
  return `<a href="${prefix}${path}"${aria}>${escHtml(label)}</a>`;
}

// prefix: "./" for root pages, "../" for pages one folder deep. current: site-relative path of this page.
// Every page using the header must have exactly one <main id="main">; the skip link targets it.
// The C1 logo mark (brand/logo.svg): two parents with two kids between them, on teal.
const LOGO_MARK = `<svg class="brand-mark" viewBox="0 0 120 120" width="36" height="36" aria-hidden="true" focusable="false"><rect width="120" height="120" rx="26" fill="#0b4946"/><g transform="translate(60 62) scale(0.72) translate(-59 -62)"><circle cx="22" cy="30" r="10" fill="#fffaf2"/><rect x="12" y="45" width="20" height="59" rx="10" fill="#fffaf2"/><circle cx="46" cy="60" r="8" fill="#f0bd56"/><rect x="38.5" y="73" width="15" height="31" rx="7.5" fill="#f0bd56"/><circle cx="68" cy="66" r="7" fill="#8fd0c4"/><rect x="61.5" y="78" width="13" height="26" rx="6.5" fill="#8fd0c4"/><circle cx="96" cy="30" r="10" fill="#db6d4a"/><rect x="86" y="45" width="20" height="59" rx="10" fill="#db6d4a"/></g></svg>`;

export function siteHeader(prefix, current = "", { skipLabel = "Skip to main content" } = {}) {
  const here = destinationFor(current);
  // D23 batch 1 (docs/design/design-system.md "Site header"): one row at every width. Logo mark + wordmark,
  // Deals, This week and a "Cities" disclosure (<details>, works without JavaScript) holding the city links.
  // Under 480 px the This week button moves into the menu, whose label becomes "Menu".
  // The menu lists cities A–Z by full name (AGENTS.md: "New York City", not "NYC").
  const menuLinks = [...destinations]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((d) => {
      const aria = d.guides[0][0] === current ? ' aria-current="page"' : here === d ? ' aria-current="true"' : "";
      return `<a href="${prefix}${d.guides[0][0]}"${aria}>${escHtml(d.short?.includes(",") ? d.short : d.name)}</a>`; // "London, UK" stays disambiguated
    })
    .join("");
  // The group label is hidden from screen readers, so each link names itself (two "Chicago" links go to different pages).
  const holidayLinks = holidayGuides.map(([p, label]) => link(prefix, p, label, current).replace("<a ", `<a aria-label="Christmas with kids: ${escHtml(label)}" `)).join("");
  const thisWeekAttr = current === "this-week/index.html" ? ' aria-current="page"' : "";
  const thisWeek = `<a class="header-this-week" href="${prefix}this-week/"${thisWeekAttr}>This week</a>`;
  const deals = `<a class="header-this-week header-deals" href="${prefix}deals/"${current === "deals/index.html" ? ' aria-current="page"' : current.startsWith("deals/") ? ' aria-current="true"' : ""}>Deals</a>`;
  return `<a class="skip-link" href="#main">${escHtml(skipLabel)}</a><header class="site-header"><a class="brand" href="${prefix}index.html" aria-label="Family Tripwise home">${LOGO_MARK}<span class="brand-word"><span class="brand-word-a">family</span><span class="brand-word-b">tripwise</span></span></a><nav class="header-this-week-nav" aria-label="Fresh family events and deals">${deals}${thisWeek}</nav><details class="city-menu"><summary><span class="menu-wide">Cities</span><span class="menu-narrow">Menu</span></summary><nav class="site-nav city-menu-list" aria-label="Site menu: this week, holidays, cities and how we check"><a class="menu-this-week" href="${prefix}this-week/"${thisWeekAttr}>This week's events and deadlines</a><p class="menu-label" aria-hidden="true">Christmas with kids</p>${holidayLinks}<p class="menu-label" aria-hidden="true">Cities</p>${menuLinks}<a class="menu-how" href="${prefix}about.html">How we check our facts</a></nav></details></header>`;
}

// One quiet line directly under the page's first photo, on the guide pages of a city with a holiday guide.
export function addHolidayLink(html, path) {
  const city = destinationFor(path);
  const guide = city && holidayGuides.find(([, , name]) => name === city.name);
  if (!guide || html.includes('class="holiday-nudge"')) return html;
  const main = html.indexOf("<main");
  const end = main < 0 ? -1 : html.indexOf("</figure>", main);
  if (end < 0) throw new Error(`site-chrome: ${path} has no photo to place the holiday link under`);
  const prefix = "../".repeat(path.split("/").length - 1);
  const line = `<p class="holiday-nudge">Coming for the holidays? <a href="${prefix}${guide[0]}">Christmas in ${escHtml(guide[1])} with kids, free and paid</a></p>`;
  return html.slice(0, end + 9) + line + html.slice(end + 9);
}

export function relatedGuides(prefix, current) {
  const here = destinationFor(current);
  if (!here) return "";
  const siblings = here.guides.filter(([p]) => p !== current);
  const similar = (here.similar || []).flatMap((name) => byName(name).guides.filter(([p]) => /where-to-stay\//.test(p)).map(([p, label]) => [p, `${byName(name).short || byName(name).name}: ${label.toLowerCase()}`]));
  const blocks = [];
  if (siblings.length) {
    blocks.push(`<h2 id="related-guides-title">More ${escHtml(here.name)} family guides</h2><ul>${siblings.map(([p, label]) => `<li>${link(prefix, p, label, current)}</li>`).join("")}</ul>`);
  }
  if (similar.length) {
    blocks.push(`<h2${siblings.length ? "" : ' id="related-guides-title"'}>Similar family stay guides</h2><ul>${similar.map(([p, label]) => `<li>${link(prefix, p, label, current)}</li>`).join("")}</ul>`);
  }
  blocks.push(`<p class="related-this-week"><a href="${prefix}this-week/#${citySlugFor(here.name)}">${escHtml(here.short || here.name)} family events and deadlines this week</a></p>`);
  return `<nav class="related-guides" aria-labelledby="related-guides-title">${blocks.join("")}</nav>`;
}

const defaultNote = "Family Tripwise uses research-based planning notes. Hotel fees, hours, policies, closures, and transit conditions can change, so verify important details before booking.";

export function siteFooter(prefix, current = "", { note = defaultNote } = {}) {
  const directory = destinations
    .map((d) => `<li><span class="guide-directory-city">${escHtml(d.name)}:</span> ${d.guides.map(([p, label]) => link(prefix, p, label, current)).join('<span aria-hidden="true"> · </span>')}</li>`)
    .join("");
  return `<footer class="site-footer"><p>${escHtml(note)}</p><nav class="guide-directory" aria-label="All family guides"><h2>All family guides</h2><ul>${directory}</ul></nav><p class="footer-links">${link(prefix, "about.html", "How our family travel guides are built", current)}<span aria-hidden="true"> · </span>${link(prefix, "privacy.html", "Privacy", current)}<span aria-hidden="true"> · </span>${link(prefix, "terms.html", "Terms", current)}</p></footer>`;
}

// Related guides plus footer, for templates that end their page with the footer.
export function siteEnd(prefix, current, options) {
  return `${relatedGuides(prefix, current)}${siteFooter(prefix, current, options)}`;
}

// Removes the shared chrome so page-specific tests can measure only the page's own content.
export function stripSiteChrome(html) {
  return html
    .replace(/<a class="skip-link" href="#main">[^<]*<\/a>/, "")
    .replace(/<header class="site-header">[\s\S]*?<\/header>/, "")
    .replace(/<nav class="related-guides"[\s\S]*?<\/nav>/, "")
    .replace(/<footer class="site-footer">[\s\S]*?<\/footer>/, "");
}

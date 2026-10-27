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
      ["family-itinerary/new-york-city-with-kids.html", "Family itinerary"]
    ]
  },
  {
    name: "Orlando",
    guides: [
      ["things-to-do/orlando-with-kids.html", "Things to do with kids"],
      ["where-to-stay/orlando-family-hotels.html", "Family suite hotels"]
    ]
  },
  { name: "Washington, DC", short: "Washington DC", guides: [["where-to-stay/washington-dc-family-hotels.html", "Family hotels"]], similar: ["Boston", "New York City"] },
  { name: "Boston", guides: [["where-to-stay/boston-family-hotels.html", "Family hotels"]], similar: ["Washington, DC", "New York City"] },
  { name: "London", short: "London, UK", guides: [["where-to-stay/london-family-hotels.html", "Family hotels and apartments"]], similar: ["New York City", "Boston"] },
  { name: "Cancun", guides: [["where-to-stay/cancun-family-resorts.html", "Family resorts"]], similar: ["Puerto Vallarta"] },
  { name: "Puerto Vallarta", guides: [["where-to-stay/puerto-vallarta-family-resorts.html", "Family resorts"]], similar: ["Cancun"] }
];

export const allGuidePaths = destinations.flatMap((d) => d.guides.map(([path]) => path));

function escHtml(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
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
export function siteHeader(prefix, current = "", { skipLabel = "Skip to main content" } = {}) {
  const here = destinationFor(current);
  const links = destinations
    .map((d) => {
      const aria = d.guides[0][0] === current ? ' aria-current="page"' : here === d ? ' aria-current="true"' : "";
      return `<a href="${prefix}${d.guides[0][0]}"${aria}>${escHtml(d.short || d.name)}</a>`;
    })
    .join("");
  return `<a class="skip-link" href="#main">${escHtml(skipLabel)}</a><header class="site-header"><a class="brand" href="${prefix}index.html" aria-label="Family Tripwise home"><span class="brand-mark">FT</span><span>Family Tripwise</span></a><nav class="site-nav" aria-label="Destination guides">${links}</nav></header>`;
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
  return `<nav class="related-guides" aria-labelledby="related-guides-title">${blocks.join("")}</nav>`;
}

const defaultNote = "Family Tripwise uses research-based planning notes. Hotel fees, hours, policies, closures, and transit conditions can change, so verify important details before booking.";

export function siteFooter(prefix, current = "", { note = defaultNote } = {}) {
  const directory = destinations
    .map((d) => `<li><span class="guide-directory-city">${escHtml(d.name)}:</span> ${d.guides.map(([p, label]) => link(prefix, p, label, current)).join('<span aria-hidden="true"> · </span>')}</li>`)
    .join("");
  return `<footer class="site-footer"><p>${escHtml(note)}</p><nav class="guide-directory" aria-label="All family guides"><h2>All family guides</h2><ul>${directory}</ul></nav><p><a href="${prefix}about.html">How our family travel guides are built</a></p></footer>`;
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

// G14 batch 2: the credited city photo shown as a banner at the top of activity, teen and itinerary pages.
// Same files, alt text, focus and credits as the batch 1 hotel-page banners (OWNER D17: credited, self-hosted).
// G14 batch 3 (2026-10-30): home, about, contributor, privacy, terms, /this-week/ and /deals/ get a banner too (sitePageHeroes).
const figures = {
  "chicago": `<img src="../images/chicago-millennium-park.webp" alt="Pritzker Pavilion trellis and the Chicago skyline in Millennium Park." width="1600" height="1200" loading="eager" fetchpriority="high" decoding="async">
          <figcaption>Photo: Behnazkhazai via <a href="https://commons.wikimedia.org/wiki/File:Millennium_park,chicago.JPG">Wikimedia Commons</a>, <a href="https://creativecommons.org/licenses/by-sa/3.0/">CC BY-SA 3.0</a>. Resized and cropped.</figcaption>`,
  "san-antonio": `<img src="../images/san-antonio-river-walk.webp" alt="The San Antonio River Walk with paths and restaurants along the water." width="1280" height="960" loading="eager" fetchpriority="high" decoding="async">
          <figcaption>Photo: Matt Harriger via <a href="https://commons.wikimedia.org/wiki/File:The_San_Antonio_River_Walk.jpg">Wikimedia Commons</a>, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC BY-SA 2.0</a>. Resized and cropped.</figcaption>`,
  "las-vegas": `<img src="../images/las-vegas-bellagio-fountains.webp" style="object-position:50% 80%" alt="The Bellagio fountains and Las Vegas Strip at night." width="1600" height="1062" loading="eager" fetchpriority="high" decoding="async">
          <figcaption>Photo: Chensiyuan via <a href="https://commons.wikimedia.org/wiki/File:Bellagio_fountain_show_2010_las_vegas.JPG">Wikimedia Commons</a>, <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>. Resized and cropped.</figcaption>`,
  "new-york-city": `<img src="../images/new-york-city-central-park.webp" alt="A cast-iron bridge among trees in Central Park, New York City." width="1280" height="894" loading="eager" fetchpriority="high" decoding="async">
          <figcaption>Photo: Jet Lowe / National Park Service, public domain via <a href="https://commons.wikimedia.org/wiki/File:Central_Park_New_York_City_New_York_23_cropped.jpg">Wikimedia Commons</a>. Resized and cropped.</figcaption>`,
  "washington-dc": `<img src="../images/washington-dc-national-mall.webp" style="object-position:50% 60%" width="1600" height="1038" loading="eager" fetchpriority="high" decoding="async" alt="Historic aerial view of the National Mall and the Washington Monument.">
          <figcaption>National Mall, 2005. US Navy photo by Chief Photographer's Mate Johnny Bivera; <a href="https://commons.wikimedia.org/wiki/File:WashingtonDCMallAerialNavyPhoto.jpg">source and public domain record</a>. Resized and cropped.</figcaption>`,
  "boston": `<img src="../images/boston-skyline.webp" style="object-position:50% 75%" width="1120" height="840" loading="eager" fetchpriority="high" decoding="async" alt="Boston waterfront towers in a 2019 photograph.">
          <figcaption>Boston, August 31, 2019. Photo by <a href="https://www.flickr.com/photos/ajay_suresh">Ajay Suresh</a>, via <a href="https://commons.wikimedia.org/wiki/File:Boston_-_Skyline_(48718902556).jpg">Wikimedia Commons</a>, <a href="https://creativecommons.org/licenses/by/2.0/">CC BY 2.0</a>. Resized and cropped.</figcaption>`,
  "san-diego-zoo": `<img src="../images/san-diego-zoo.webp" style="object-position:50% 35%" width="1600" height="1066" loading="eager" fetchpriority="high" decoding="async" alt="A red panda resting on a branch at the San Diego Zoo.">
          <figcaption>Red panda at the San Diego Zoo. Photo: Lance Anderson via <a href="https://commons.wikimedia.org/wiki/File:San_Diego_Zoo,_San_Diego,_United_States_(Unsplash_QZwf5yNopUo).jpg">Wikimedia Commons</a>, CC0 public domain dedication. Resized and cropped.</figcaption>`,
  "cancun": `<img src="../images/cancun-aerial.webp" style="object-position:50% 55%" width="1600" height="1200" loading="eager" fetchpriority="high" decoding="async" alt="Cancun's coast, hotel strip and lagoon seen from the air.">
          <figcaption>Cancun from the air, January 2024. Photo: Antony-22 via <a href="https://commons.wikimedia.org/wiki/File:Canc%C3%BAn_aerial_2024.jpg">Wikimedia Commons</a>, <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>. Resized and cropped.</figcaption>`,
  "london": `<img src="../images/london-trafalgar-square.webp" style="object-position:50% 70%" width="1600" height="1059" loading="eager" fetchpriority="high" decoding="async" alt="Visitors in Trafalgar Square, London, in front of the National Gallery.">
          <figcaption>Trafalgar Square, London, June 2009. Photo by David Iliff via <a href="https://commons.wikimedia.org/wiki/File:Trafalgar_Square,_London_2_-_Jun_2009.jpg">Wikimedia Commons</a>, <a href="https://creativecommons.org/licenses/by-sa/3.0/">CC BY-SA 3.0</a>. Resized and cropped.</figcaption>`,
  "orlando": `<img src="../images/orlando-lake-eola.webp" style="object-position:50% 60%" width="1440" height="1080" loading="eager" fetchpriority="high" decoding="async" alt="Lake Eola fountain and downtown Orlando buildings.">
          <figcaption>Lake Eola, downtown Orlando. Photo by David Akers via <a href="https://commons.wikimedia.org/wiki/File:Lake_eola_in_Orlando_Florida_with_fountain.jpg">Wikimedia Commons</a>, public domain. Resized and cropped.</figcaption>`
};

// Site pages without a city of their own: which banner each shows (G14 batch 3). One photo per page, none repeated here.
export const sitePageHeroes = {
  "index.html": "san-diego-zoo",
  "about.html": "london",
  "contributors/miles-rowan.html": "orlando",
  "privacy.html": "boston",
  "terms.html": "chicago",
  "this-week/index.html": "new-york-city",
  "deals/index.html": "cancun"
};

export const heroPhotoCities = Object.keys(figures);

export function heroPhotoSection(city, prefix = "../") {
  const figure = figures[city];
  if (!figure) throw new Error(`No hero photo for ${city}`);
  return `      <section class="container media-section hero-photo-section">
        <figure class="licensed-photo hero-photo">
          ${figure.replace('src="../images/', `src="${prefix}images/`)}
        </figure>
      </section>`;
}

const pageHero = /(      <section (?:id="[^"]+" )?class="page-hero">[\s\S]*?\n      <\/section>)/;
const existingHero = /\n      <section class="container media-section hero-photo-section">[\s\S]*?<\/section>/g;

/** Put the city banner directly after the page hero; drop the old lower media section for the same photo. */
export function placeHeroPhoto(html, city) {
  const section = heroPhotoSection(city);
  const src = section.match(/src="([^"]+)"/)[1];
  html = html.replace(existingHero, "");
  html = html.replace(/\n?      <section class="container media-section">\s*<figure class="licensed-photo">[\s\S]*?<\/figure>\s*<\/section>\n?/g, (match) => (match.includes(`src="${src}"`) ? "\n" : match));
  if (!pageHero.test(html)) throw new Error(`Expected a page hero for the ${city} banner`);
  return html.replace(pageHero, (match) => `${match}\n${section}`);
}

// Visible place names for captions that do not start with one (persona review 2026-10-30).
const sitePagePlaces = { "new-york-city": "Central Park, New York City.", "chicago": "Pritzker Pavilion, Millennium Park, Chicago." };
// On the two fresh hubs the banner follows the "Coming up first" / "Closing soonest" list so a date shows on the first phone screen.
const afterAnswer = /(      <section id="(?:this-week|deals)-answer"[\s\S]*?\n      <\/section>)/;
const anyBanner = /\n *<section class="container media-section hero-photo-section">[\s\S]*?<\/section>|\n *<figure class="licensed-photo hero-photo">[\s\S]*?<\/figure>/g;

/** G14 batch 3: banner for a site page listed in sitePageHeroes (path relative to site/): after the hub answer list on
 * /this-week/ and /deals/, otherwise right after the page hero, or after the first section of <main> on a page without one. */
export function placeSitePageHero(html, path) {
  const key = sitePageHeroes[path];
  if (!key) throw new Error(`No site-page banner for ${path}`);
  const prefix = "../".repeat(path.split("/").length - 1) || "./";
  const place = sitePagePlaces[key];
  const figureHtml = figures[key].replace('src="../images/', `src="${prefix}images/`).replace("<figcaption>", place ? `<figcaption>${place} ` : "<figcaption>");
  html = html.replace(anyBanner, "");
  const section = `      <section class="container media-section hero-photo-section">
        <figure class="licensed-photo hero-photo">
          ${figureHtml}
        </figure>
      </section>`;
  if (afterAnswer.test(html)) return html.replace(afterAnswer, (match) => `${match}\n${section}`);
  if (pageHero.test(html)) return html.replace(pageHero, (match) => `${match}\n${section}`);
  const figure = `    <figure class="licensed-photo hero-photo">
      ${figureHtml}
    </figure>`;
  const first = /(<main\b[^>]*>\s*<section\b[\s\S]*?<\/section>)/;
  if (!first.test(html)) throw new Error(`Expected a first section in <main> for the ${path} banner`);
  return html.replace(first, (match) => `${match}\n${figure}`);
}

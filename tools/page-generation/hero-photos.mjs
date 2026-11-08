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
  // Q21 step 3 (2026-11-07): NYC activity pages get their own photos so the five NYC pages stop repeating Central Park.
  "nyc-bronx-zoo-giraffes": `<img src="../images/bronx-zoo-giraffes-2026.webp" style="object-position:50% 55%" width="960" height="720" loading="eager" fetchpriority="high" decoding="async" alt="Two giraffes face each other on a grassy field among tall trees at the Bronx Zoo.">
          <figcaption>Giraffes at the Bronx Zoo, August 2026. Photo: SnowFire via <a href="https://commons.wikimedia.org/wiki/File:Rothschild%27s_giraffes_(Giraffa_camelopardalis_rothschildi)_at_Bronx_Zoo_browsing_August_2026.jpg">Wikimedia Commons</a>, <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>. Resized and cropped.</figcaption>`,
  "nyc-grand-central": `<img src="../images/grand-central-concourse-2024.webp" style="object-position:50% 72%" width="1280" height="1222" loading="eager" fetchpriority="high" decoding="async" alt="Crowds cross the Grand Central Terminal main concourse under tall arched windows and the starry green ceiling.">
          <figcaption>Grand Central Terminal main concourse, August 2024. Photo: D. Benjamin Miller via <a href="https://commons.wikimedia.org/wiki/File:Main_Concourse,_Grand_Central_Terminal,_August_30,_2024_-_001.jpg">Wikimedia Commons</a>, CC0 public domain dedication. Resized and cropped.</figcaption>`,
  // Q21 step 3 (2026-11-07): Chicago activity pages get their own photos so five Chicago pages stop repeating Millennium Park.
  "chicago-shedd-penguins": `<img src="../images/chicago-shedd-penguins-2008.webp" style="object-position:50% 45%" width="960" height="634" loading="eager" fetchpriority="high" decoding="async" alt="Penguins stand on rocks in the penguin habitat at Shedd Aquarium, Chicago.">
          <figcaption>Penguins at Shedd Aquarium, March 2008 (an older photo). Photo: Serge Melki via <a href="https://commons.wikimedia.org/wiki/File:Chicago_-_Shedd_aquarium_(2379489501).jpg">Wikimedia Commons</a>, <a href="https://creativecommons.org/licenses/by/2.0/">CC BY 2.0</a>. Resized and cropped.</figcaption>`,
  "chicago-shedd-lakefront": `<img src="../images/chicago-shedd-lakefront-2012.webp" style="object-position:50% 55%" width="1600" height="1062" loading="eager" fetchpriority="high" decoding="async" alt="Shedd Aquarium on the Lake Michigan shore, with the Chicago skyline behind.">
          <figcaption>Shedd Aquarium and the skyline from the lakefront, August 2012 (an older photo). Photo: Madeleine_H via <a href="https://commons.wikimedia.org/wiki/File:The_Shedd_Aquarium_-_7714039518.jpg">Wikimedia Commons</a>, <a href="https://creativecommons.org/licenses/by/2.0/">CC BY 2.0</a>. Resized and cropped.</figcaption>`,
  // Q21 step 3 (2026-11-07): San Antonio activity pages get their own photos so six San Antonio pages stop repeating the River Walk.
  "san-antonio-tea-garden": `<img src="../images/san-antonio-japanese-tea-garden-2022.webp" style="object-position:50% 60%" width="1400" height="1050" loading="eager" fetchpriority="high" decoding="async" alt="The Japanese Tea Garden in San Antonio: a green pond with stepping-stone planters, a stone bridge and a pavilion on the rocks above.">
          <figcaption>Japanese Tea Garden, Brackenridge Park, San Antonio, March 2022. Photo: Jouaienttoi via <a href="https://commons.wikimedia.org/wiki/File:San_Antonio_Japanese_Tea_Garden_2022.jpg">Wikimedia Commons</a>, <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>. Resized and cropped.</figcaption>`,
  "san-antonio-natural-bridge-caverns": `<img src="../images/san-antonio-natural-bridge-caverns-2013.webp" style="object-position:50% 45%" width="1600" height="1067" loading="eager" fetchpriority="high" decoding="async" alt="Pale stalagmites and stalactites inside Natural Bridge Caverns, north of San Antonio.">
          <figcaption>Inside Natural Bridge Caverns, north of San Antonio, July 2013 (an older photo). Photo: Larry D. Moore via <a href="https://commons.wikimedia.org/wiki/File:Natural_bridge_caverns_plutos_anteroom.jpg">Wikimedia Commons</a>, <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>. Resized and cropped.</figcaption>`,
  // Q21 step 3 (2026-11-07): Las Vegas activity pages get their own photos so five Las Vegas pages stop repeating the Bellagio fountains.
  "las-vegas-shark-reef": `<img src="../images/las-vegas-shark-reef-2014.webp" style="object-position:50% 45%" width="1600" height="1200" loading="eager" fetchpriority="high" decoding="async" alt="A shark swims above coral in a large blue tank at Shark Reef Aquarium, Mandalay Bay, Las Vegas.">
          <figcaption>Shark Reef Aquarium at Mandalay Bay, February 2014 (an older photo). Photo: kennejima via <a href="https://commons.wikimedia.org/wiki/File:Shark_Reef_Aquarium_at_Mandalay_Bay.jpg">Wikimedia Commons</a>, <a href="https://creativecommons.org/licenses/by/2.0/">CC BY 2.0</a>. Resized and cropped.</figcaption>`,
  "las-vegas-red-rock": `<img src="../images/las-vegas-red-rock-canyon-2016.webp" style="object-position:70% 50%" width="1600" height="840" loading="eager" fetchpriority="high" decoding="async" alt="Red and tan desert cliffs behind the Red Rock Canyon National Conservation Area sign, with visitors and a parked car by the road.">
          <figcaption>Red Rock Canyon National Conservation Area, west of Las Vegas, September 2016 (an older photo). Photo: BLM Nevada via <a href="https://commons.wikimedia.org/wiki/File:Red_Rock_Canyon_National_Conservation_Area_(31583087693).jpg">Wikimedia Commons</a>, <a href="https://creativecommons.org/licenses/by/2.0/">CC BY 2.0</a>. Resized and cropped.</figcaption>`,
  "washington-dc": `<img src="../images/washington-dc-national-mall.webp" style="object-position:50% 60%" width="1600" height="1038" loading="eager" fetchpriority="high" decoding="async" alt="Historic aerial view of the National Mall and the Washington Monument.">
          <figcaption>National Mall, 2005. US Navy photo by Chief Photographer's Mate Johnny Bivera; <a href="https://commons.wikimedia.org/wiki/File:WashingtonDCMallAerialNavyPhoto.jpg">source and public domain record</a>. Resized and cropped.</figcaption>`,
  // Q21 step 3 (2026-11-08): the DC itinerary's Day 1 starts at Natural History, so it shows the museum's rotunda instead of the National Mall photo it shared with the DC hotels page.
  "washington-dc-nmnh-rotunda": `<img src="../images/washington-dc-nmnh-rotunda-2014.webp" style="object-position:50% 70%" width="1440" height="864" loading="eager" fetchpriority="high" decoding="async" alt="Looking down into the National Museum of Natural History rotunda: a large African elephant on a raised display, with visitors, children and a stroller on the floor around it.">
          <figcaption>Natural History's rotunda, where Day 1 starts, January 2014 (an older photo). Photo: Philip Cohen via <a href="https://commons.wikimedia.org/wiki/File:NMNH-Rotunda.jpg">Wikimedia Commons</a>, <a href="https://creativecommons.org/licenses/by/2.0/">CC BY 2.0</a>. Resized and cropped.</figcaption>`,
  // Q21 step 3 (2026-11-08): the Boston itinerary's Day 1 is the Museum of Science, so it shows the museum's T. rex model instead of the skyline photo it shared with the Boston hotels page.
  "boston-museum-of-science-t-rex": `<img src="../images/boston-museum-of-science-t-rex-2022.webp" style="object-position:50% 24%" width="1440" height="864" loading="eager" fetchpriority="high" decoding="async" alt="A large Tyrannosaurus rex model with its mouth open, seen from below inside the Museum of Science, Boston.">
          <figcaption>The Museum of Science's T. rex model, where Day 1 starts, July 2022 (an older photo). Photo: Jules Verne Times Two / <a href="http://julesvernex2.com">julesvernex2.com</a> / <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.en">CC-BY-SA-4.0</a>, via <a href="https://commons.wikimedia.org/wiki/File:Tyrannosaurus_model,_Museum_of_Science,_Boston,_Massachusetts,_US_(PPL1-Corrected)_julesvernex2.jpg">Wikimedia Commons</a>. Resized and cropped.</figcaption>`,
  "boston": `<img src="../images/boston-skyline.webp" style="object-position:50% 75%" width="1120" height="840" loading="eager" fetchpriority="high" decoding="async" alt="Boston waterfront towers in a 2019 photograph.">
          <figcaption>Boston, August 31, 2019. Photo by <a href="https://www.flickr.com/photos/ajay_suresh">Ajay Suresh</a>, via <a href="https://commons.wikimedia.org/wiki/File:Boston_-_Skyline_(48718902556).jpg">Wikimedia Commons</a>, <a href="https://creativecommons.org/licenses/by/2.0/">CC BY 2.0</a>. Resized and cropped.</figcaption>`,
  "san-diego-zoo": `<img src="../images/san-diego-zoo.webp" style="object-position:50% 35%" width="1600" height="1066" loading="eager" fetchpriority="high" decoding="async" alt="A red panda resting on a branch at the San Diego Zoo.">
          <figcaption>Red panda at the San Diego Zoo. Photo: Lance Anderson via <a href="https://commons.wikimedia.org/wiki/File:San_Diego_Zoo,_San_Diego,_United_States_(Unsplash_QZwf5yNopUo).jpg">Wikimedia Commons</a>, CC0 public domain dedication. Resized and cropped.</figcaption>`,
  "san-diego-mission-bay": `<img src="../images/san-diego-mission-bay.webp" width="1280" height="982" loading="eager" fetchpriority="high" decoding="async" alt="Mission Bay in San Diego from above, with bay water, islands and nearby neighborhoods.">
          <figcaption>Mission Bay, San Diego. Photo: Alfred Twu via <a href="https://commons.wikimedia.org/wiki/File:21a-san-diego-mission-bay.jpg">Wikimedia Commons</a>, CC0 public domain dedication. Resized and cropped.</figcaption>`,
  // Q21 step 3 (2026-11-08): the San Diego teens page leads with the free La Jolla coast, so it shows La Jolla Cove instead of the shared zoo photo.
  "san-diego-la-jolla-cove": `<img src="../images/san-diego-la-jolla-cove-2020.webp" style="object-position:50% 55%" width="1200" height="675" loading="eager" fetchpriority="high" decoding="async" alt="La Jolla Cove in San Diego: a small sandy beach between sandstone cliffs, with people on the sand, some in wetsuits, rocks in the water and buildings and palms above.">
          <figcaption>La Jolla Cove, San Diego, June 2020 (an older photo). Photo: Mollymcc via <a href="https://commons.wikimedia.org/wiki/File:La_Jolla_Cove_2020.jpg">Wikimedia Commons</a>, CC0 public domain dedication. Resized and cropped.</figcaption>`,
  "cancun": `<img src="../images/cancun-aerial.webp" style="object-position:50% 55%" width="1600" height="1200" loading="eager" fetchpriority="high" decoding="async" alt="Cancun's coast, hotel strip and lagoon seen from the air.">
          <figcaption>Cancun from the air, January 2024. Photo: Antony-22 via <a href="https://commons.wikimedia.org/wiki/File:Canc%C3%BAn_aerial_2024.jpg">Wikimedia Commons</a>, <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>. Resized and cropped.</figcaption>`,
  "london": `<img src="../images/london-trafalgar-square.webp" style="object-position:50% 70%" width="1600" height="1059" loading="eager" fetchpriority="high" decoding="async" alt="Visitors in Trafalgar Square, London, in front of the National Gallery.">
          <figcaption>Trafalgar Square, London, June 2009. Photo by David Iliff via <a href="https://commons.wikimedia.org/wiki/File:Trafalgar_Square,_London_2_-_Jun_2009.jpg">Wikimedia Commons</a>, <a href="https://creativecommons.org/licenses/by-sa/3.0/">CC BY-SA 3.0</a>. Resized and cropped.</figcaption>`,
  "holiday-rockefeller": `<img src="../images/rockefeller-center-christmas-snow.webp" alt="The Rockefeller Center Christmas tree at night, seen down a snowy promenade lined with lit angels" width="1400" height="955" loading="eager" fetchpriority="high" decoding="async">
          <figcaption>Rockefeller Center, New York City, December 2020; an older photo, not this season. Photo: Anthony Quintano via <a href="https://commons.wikimedia.org/wiki/File:Rockefeller_Center_Christmas_2020_Snowstorm_December_(50733449647).jpg">Wikimedia Commons</a>, <a href="https://creativecommons.org/licenses/by/2.0">CC BY 2.0</a>. Resized and cropped.</figcaption>`,
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
  "this-week/index.html": "holiday-rockefeller",
  "deals/index.html": "cancun" // fallback only: the hub shows its top real deal's own photo when that deal has one (D23 3c)
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

// A page whose banner is not its city photo drops the old lower copy of that city photo too (one photo per page).
const replacedCityPhoto = { "nyc-bronx-zoo-giraffes": "new-york-city-central-park", "nyc-grand-central": "new-york-city-central-park", "chicago-shedd-penguins": "chicago-millennium-park", "chicago-shedd-lakefront": "chicago-millennium-park", "san-antonio-tea-garden": "san-antonio-river-walk", "san-antonio-natural-bridge-caverns": "san-antonio-river-walk", "las-vegas-shark-reef": "las-vegas-bellagio-fountains", "las-vegas-red-rock": "las-vegas-bellagio-fountains", "san-diego-la-jolla-cove": "san-diego-zoo" };

/** Put the city banner directly after the page hero; drop the old lower media section for the same photo. */
export function placeHeroPhoto(html, city) {
  const section = heroPhotoSection(city);
  const src = section.match(/src="([^"]+)"/)[1];
  html = html.replace(existingHero, "");
  html = html.replace(/\n?      <section class="container media-section">\s*<figure class="licensed-photo">[\s\S]*?<\/figure>\s*<\/section>\n?/g, (match) => (match.includes(`src="${src}"`) || match.includes(`images/${replacedCityPhoto[city] ?? "\u0000"}.webp`) ? "\n" : match));
  if (!pageHero.test(html)) throw new Error(`Expected a page hero for the ${city} banner`);
  return html.replace(pageHero, (match) => `${match}\n${section}`);
}

// Visible place names for captions that do not start with one (persona review 2026-10-30).
const sitePagePlaces = { "new-york-city": "Central Park, New York City.", "chicago": "Pritzker Pavilion, Millennium Park, Chicago." };
// On the two fresh hubs the banner follows the "Coming up first" / "Closing soonest" list so a date shows on the first phone screen.
const afterAnswer = /(      <section id="(?:this-week|deals|holiday)-answer"[\s\S]*?\n      <\/section>)/;
const anyBanner = /\n *<section class="container media-section hero-photo-section">[\s\S]*?<\/section>|\n *<figure class="licensed-photo hero-photo">[\s\S]*?<\/figure>/g;

/** G14 batch 3: banner for a site page listed in sitePageHeroes (path relative to site/): after the hub answer list on
 * /this-week/ and /deals/, otherwise right after the page hero, or after the first section of <main> on a page without one. */
export function placeSitePageHero(html, path, figureOverride) {
  const key = sitePageHeroes[path];
  if (!key && !figureOverride) throw new Error(`No site-page banner for ${path}`);
  const prefix = "../".repeat(path.split("/").length - 1) || "./";
  const place = sitePagePlaces[key];
  // D23 3c: a page may pass its own banner (the /deals/ hub shows the photo of its biggest current saving).
  const figureHtml = figureOverride ?? figures[key].replace('src="../images/', `src="${prefix}images/`).replace("<figcaption>", place ? `<figcaption>${place} ` : "<figcaption>");
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

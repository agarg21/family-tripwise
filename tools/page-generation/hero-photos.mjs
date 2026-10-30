// G14 batch 2: the credited city photo shown as a banner at the top of activity, teen and itinerary pages.
// Same files, alt text, focus and credits as the batch 1 hotel-page banners (OWNER D17: credited, self-hosted).
const figures = {
  "chicago": `<img src="../images/chicago-millennium-park.webp" alt="Pritzker Pavilion trellis and the Chicago skyline in Millennium Park." width="1600" height="1200" loading="eager" fetchpriority="high" decoding="async">
          <figcaption>Photo: Behnazkhazai via <a href="https://commons.wikimedia.org/wiki/File:Millennium_park,chicago.JPG">Wikimedia Commons</a>, <a href="https://creativecommons.org/licenses/by-sa/3.0/">CC BY-SA 3.0</a>. Resized and cropped.</figcaption>`,
  "san-antonio": `<img src="../images/san-antonio-river-walk.webp" alt="The San Antonio River Walk with paths and restaurants along the water." width="1280" height="960" loading="eager" fetchpriority="high" decoding="async">
          <figcaption>Photo: Matt Harriger via <a href="https://commons.wikimedia.org/wiki/File:The_San_Antonio_River_Walk.jpg">Wikimedia Commons</a>, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC BY-SA 2.0</a>. Resized and cropped.</figcaption>`,
  "las-vegas": `<img src="../images/las-vegas-bellagio-fountains.webp" style="object-position:50% 80%" alt="The Bellagio fountains and Las Vegas Strip at night." width="1600" height="1062" loading="eager" fetchpriority="high" decoding="async">
          <figcaption>Photo: Chensiyuan via <a href="https://commons.wikimedia.org/wiki/File:Bellagio_fountain_show_2010_las_vegas.JPG">Wikimedia Commons</a>, <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>. Resized and cropped.</figcaption>`,
  "new-york-city": `<img src="../images/new-york-city-central-park.webp" alt="A cast-iron bridge among trees in Central Park, New York City." width="1280" height="894" loading="eager" fetchpriority="high" decoding="async">
          <figcaption>Photo: Jet Lowe / National Park Service, public domain via <a href="https://commons.wikimedia.org/wiki/File:Central_Park_New_York_City_New_York_23_cropped.jpg">Wikimedia Commons</a>. Resized and cropped.</figcaption>`,
  "washington-dc": `<img src="../images/washington-dc-national-mall.webp" width="1600" height="1038" loading="eager" fetchpriority="high" decoding="async" alt="Historic aerial view of the National Mall, with the Lincoln Memorial, Washington Monument and US Capitol.">
          <figcaption>National Mall, 2005. US Navy photo by Chief Photographer's Mate Johnny Bivera; <a href="https://commons.wikimedia.org/wiki/File:WashingtonDCMallAerialNavyPhoto.jpg">source and public domain record</a>. Resized and cropped.</figcaption>`,
  "boston": `<img src="../images/boston-skyline.webp" style="object-position:50% 75%" width="1120" height="840" loading="eager" fetchpriority="high" decoding="async" alt="Boston skyline in a 2019 photograph.">
          <figcaption>Boston, August 31, 2019. Photo by <a href="https://www.flickr.com/photos/ajay_suresh">Ajay Suresh</a>, via <a href="https://commons.wikimedia.org/wiki/File:Boston_-_Skyline_(48718902556).jpg">Wikimedia Commons</a>, <a href="https://creativecommons.org/licenses/by/2.0/">CC BY 2.0</a>. Resized and cropped.</figcaption>`
};

export const heroPhotoCities = Object.keys(figures);

export function heroPhotoSection(city) {
  const figure = figures[city];
  if (!figure) throw new Error(`No hero photo for ${city}`);
  return `      <section class="container media-section hero-photo-section">
        <figure class="licensed-photo hero-photo">
          ${figure}
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

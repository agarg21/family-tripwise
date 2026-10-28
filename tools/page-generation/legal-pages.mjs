// Privacy policy and terms of use (OWNER.md D13, 2026-10-28).
// Every statement here must stay true of the site as built: tools/legal-pages.test.mjs checks that
// the site sets no cookies or storage, sends no form data, loads no analytics, and that every
// third-party host the site embeds content from is named in the privacy policy.
import { siteHeader, siteFooter } from "./site-chrome.mjs";

export const legalUpdated = "October 28, 2026";
export const legalUpdatedIso = "2026-10-28";
export const contactEmail = "hello@familytripwise.com";

// Hosts that pages embed content from (img/iframe/script src). Each needs a paragraph below.
export const embeddedHosts = {
  "commons.wikimedia.org": "wikimedia",
  "upload.wikimedia.org": "wikimedia",
  "thumb.wikimedia.org": "wikimedia",
  "www.google.com": "google-maps"
};

const githubPagesDoc = "https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages";
const githubPrivacy = "https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement";
const googlePrivacy = "https://policies.google.com/privacy";
const wikimediaPrivacy = "https://foundation.wikimedia.org/wiki/Policy:Privacy_policy";

const mail = `<a href="mailto:${contactEmail}">${contactEmail}</a>`;

function shell({ path, title, description, eyebrow, h1, intro, body }) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${title}</title>
    <meta name="description" content="${description}">
    <link rel="canonical" href="https://familytripwise.com/${path}">
    <link rel="stylesheet" href="./styles.css">
  </head>
  <body>
    ${siteHeader("./", path)}
    <main id="main" class="legal-page">
      <section class="page-hero">
        <div class="container">
          <p class="eyebrow">${eyebrow}</p>
          <h1>${h1}</h1>
          <p>${intro}</p>
        </div>
      </section>
      <section class="container trust-panel about-summary" aria-label="Page status">
        <p><strong>Last updated:</strong> <time datetime="${legalUpdatedIso}">${legalUpdated}</time></p>
        <p><strong>Questions:</strong> email ${mail}.</p>
      </section>
${body}
    </main>
    ${siteFooter("./", path)}
  </body>
</html>
`;
}

function section(id, heading, paragraphs) {
  return `      <section class="container page-section methodology-section" aria-labelledby="${id}">
        <h2 id="${id}">${heading}</h2>
${paragraphs.map((p) => (typeof p === "string" ? `        <p>${p}</p>` : `        <p id="${p.id}">${p.html}</p>`)).join("\n")}
      </section>`;
}

export function privacyPage() {
  const body = [
    section("privacy-summary", "The short version", [
      "Family Tripwise is a set of static web pages. There are no accounts, sign-ups, comments or newsletters on this site, and we do not run analytics, advertising or tracking scripts. Family Tripwise does not set cookies or store anything in your browser.",
      "The planning calculators on some guides (for example, budget and room-fit forms) run entirely in your browser. What you type into them is not sent to us or saved."
    ]),
    section("hosting", "Hosting", [
      `This site is hosted on GitHub Pages. GitHub states that when a GitHub Pages site is visited, the visitor's IP address is logged and stored for security purposes (<a href="${githubPagesDoc}">GitHub Docs: What is GitHub Pages?</a>). That logging is done by GitHub under the <a href="${githubPrivacy}">GitHub General Privacy Statement</a>; Family Tripwise does not use those logs.`
    ]),
    section("third-party-content", "Content loaded from other services", [
      { id: "wikimedia", html: `Some guides show photos loaded directly from Wikimedia Commons. When your browser loads one, Wikimedia's servers receive your IP address and browser details under the <a href="${wikimediaPrivacy}">Wikimedia Foundation privacy policy</a>.` },
      { id: "google-maps", html: `The San Diego family hotels guide embeds a Google My Maps map. Loading it connects your browser to Google, which may set cookies and receive your IP address under the <a href="${googlePrivacy}">Google Privacy Policy</a>.` },
      "Guides link to official hotel, venue, transit and operator websites. Those sites have their own privacy policies, which apply once you follow a link."
    ]),
    section("search-data", "Search performance data", [
      "We use Google Search Console to see how our pages appear in Google Search: aggregate counts of searches, impressions and clicks per page. It does not tell us who you are, and we publish only aggregated, page-level summaries in our public project repository."
    ]),
    section("email", "If you email us", [
      `Messages to ${mail} are forwarded by our domain's email-forwarding service to an inbox the publisher controls. We use your message and address only to reply, do not share them, and delete them on request.`
    ]),
    section("social", "Social media accounts and apps", [
      "Family Tripwise publishes posts about verified family deals and events to its own accounts on social platforms such as Facebook, Instagram, Threads and Pinterest. Our publishing tool posts only our own content to our own accounts. It does not offer sign-in with those platforms and does not request access to anyone else's account or data.",
      "We do not collect, store or sell information about people who follow, like, comment on or message our accounts. If you interact with us on a platform, that platform's own privacy policy applies, and we may read and reply to your comment or message there."
    ]),
    section("data-deletion", "Data deletion requests", [
      "Family Tripwise does not store personal data from its website, its social media apps or the platforms it posts to, so in most cases there is nothing of yours to delete.",
      `If you have emailed us, or believe we hold any information about you, email ${mail} with the subject "Data deletion request". We will delete what we hold (for example, your emails to us) and confirm by email when it is done. Comments or messages you left on a social platform can be deleted by you on that platform.`
    ]),
    section("children", "Children", [
      `Family Tripwise is written for parents and other adults planning trips. It is not directed at children, and we do not knowingly collect personal information from children under 13. If a child has emailed us, a parent can ask us to delete the message at ${mail}.`
    ]),
    section("sharing", "Selling and sharing", [
      "We do not sell or rent personal information, and we do not share it with advertisers or data brokers."
    ]),
    section("changes", "Changes to this policy", [
      "If how the site works changes (for example, if we add a newsletter or analytics), we will update this page before the change goes live and change the Last updated date above."
    ])
  ].join("\n");
  return shell({
    path: "privacy.html",
    title: "Privacy Policy | Family Tripwise",
    description: "How Family Tripwise handles data: no accounts, analytics, advertising or cookies of our own; what our host, embedded maps and photos receive; email, social accounts and data deletion requests.",
    eyebrow: "Privacy",
    h1: "Privacy policy",
    intro: "What information this site and our social media accounts collect (very little), what other services receive when you use the site, and how to ask us to delete anything.",
    body
  });
}

export function termsPage() {
  const body = [
    section("terms-scope", "What these terms cover", [
      'These terms apply to familytripwise.com, its downloads and the posts Family Tripwise publishes on social platforms ("Family Tripwise", "we"). Family Tripwise is published by Apoorva Garg (see <a href="./about.html#apoorva-garg">About</a>). By using the site you agree to these terms; if you do not agree, please do not use it.'
    ]),
    section("planning-information", "Planning information, not bookings", [
      "Family Tripwise publishes family travel planning information. We do not sell travel, take bookings or payments, or act as an agent for any hotel, venue, cruise line or other operator. Family Tripwise does not currently earn commissions from links on this site.",
      "Bookings you make are agreements between you and the provider, under that provider's terms."
    ]),
    section("accuracy", "Accuracy and dates", [
      'Our guides, deal checks and event listings are AI-assisted research from official sources, each with the date it was observed. They are not based on firsthand visits (see <a href="./about.html">how guides are built</a>). Prices, fees, availability, age rules, hours, offers and event details change, and an observation can be out of date by the time you read it.',
      "Always confirm details that matter on the official source before booking, paying or promising a plan to your family. Estimates and planning judgments are labelled as such and are not guarantees."
    ]),
    section("not-advice", "Not professional advice", [
      "Nothing on the site is medical, safety, legal or financial advice. Use official advisories and your own judgment for health, safety, accessibility and mobility needs."
    ]),
    section("third-parties", "Other websites and content", [
      "We link to official and third-party websites and show some photos under their creators' licences, credited on the page. We are not responsible for other websites' content, availability or practices."
    ]),
    section("use-of-content", "Using our content", [
      "You are welcome to read, print and share links to our pages and downloads for personal, non-commercial trip planning. Please do not republish substantial parts of the site or present it as your own without our written permission. Photos remain subject to the licences shown with them."
    ]),
    section("liability", "Warranties and liability", [
      'The site is provided "as is" and "as available", without warranties of any kind, to the extent the law allows. To the extent the law allows, Family Tripwise is not liable for losses arising from your use of the site or reliance on its information, including booking decisions, changed prices or cancelled events. Some places do not allow these limits, so they may not all apply to you.'
    ]),
    section("terms-changes", "Changes and contact", [
      `We may update these terms; the Last updated date above shows the current version. Questions: ${mail}. Our <a href="./privacy.html">privacy policy</a> explains how we handle data.`
    ])
  ].join("\n");
  return shell({
    path: "terms.html",
    title: "Terms of Use | Family Tripwise",
    description: "Terms for using Family Tripwise: dated family travel planning information, not bookings or professional advice; confirm details on official sources; how you may use our content.",
    eyebrow: "Terms",
    h1: "Terms of use",
    intro: "The rules for using Family Tripwise's guides, deal checks, event listings, downloads and social posts.",
    body
  });
}

export const legalSitemapUrls = ["https://familytripwise.com/privacy.html", "https://familytripwise.com/terms.html"];

export function writeLegalPages(writeSite) {
  writeSite("privacy.html", privacyPage());
  writeSite("terms.html", termsPage());
}

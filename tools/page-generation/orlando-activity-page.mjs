import { readFileSync } from "node:fs";
import { activityPath, checkedOn, ratesCheckedOn, activities, sources, reviewSignals, seaLifeTicket, admissionTariffs } from "./orlando-activity-data.mjs";
const pricedIds = new Set(admissionTariffs.filter(t=>t.bands.length).map(t=>t.id));
const longDate = iso => new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US",{timeZone:"UTC",month:"long",day:"numeric",year:"numeric"});
import { contributorCredit } from "./contributors.mjs";
import { siteHeader, siteEnd } from "./site-chrome.mjs";
import { withLinkPreview } from "./link-previews.mjs";
const e = value => String(value).replace(/([a-zA-Z])(\d)/g,"$1 $2").replace(/(\d)([a-zA-Z])/g,"$1 $2").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");
const d = value => e(value).replace(/\bUSD ?(?=\d)/g,"$");
const NB = " ";
const money = cents => `$${cents % 100 ? (cents / 100).toFixed(2) : cents / 100}`;
const PARTY = [18,18,3,10];
// Family figures come from the one tariff record, so a re-observed rate moves the top, picks and table together; a test ties the details text to the same record.
export function familyAdmission(id, ages = PARTY) {
  const t = admissionTariffs.find(x=>x.id===id), groups = new Map();
  let cents = 0;
  for (const age of ages) {
    const b = t.bands.find(x=>age>=x.minimumAge&&(x.maximumAge===null||age<=x.maximumAge));
    if (!b) throw new Error(`no ${id} band for age ${age}`);
    cents += b.cents;
    if (b.cents) groups.set(b.cents,(groups.get(b.cents)||0)+1);
  }
  const sum = [...groups].map(([c,n])=>n>1?`${n} × ${money(c)}`:money(c)).join(" + ");
  return {cents, sum, about:`≈${NB}$${Math.round(cents/100)}`};
}
const fam = id => familyAdmission(id).about, sum = id => familyAdmission(id).sum;
const row = {
  "science-center":{price:`${fam("science-center")} online`,note:`${sum("science-center")}. Door costs more; parking $4/hour`,ages:"Youth 2-12, teen 13-17, adult 18+. KidsTown area: 7 and under",rain:"Yes, indoors",time:"2-3 hrs, our estimate",check:"Closed most Wednesdays; confirm your date"},
  crayola:{price:`${fam("crayola")} plus tax`,note:`${sum("crayola")}; 2 and under free; free mall parking`,ages:"Everyone 3+ pays",rain:"Yes, indoors",time:"3-4 hrs, per operator",check:"Same-day return needs a hand stamp"},
  "sea-life":{price:"Check live",note:"Only a package price from $29 an adult is published",ages:"Under 2 free; child ticket 2-12",rain:"Yes, indoors",time:"2-3 hrs, per operator",check:"Use the dated hours calendar"},
  mennello:{price:fam("mennello"),note:`${sum("mennello")}; under 6 free; free museum lot`,ages:"Child 6-17, adult 18+",rain:"Mostly; garden is outdoors",time:"About 1 hr, our estimate",check:"Closed Mondays; confirm holidays"},
  leu:{price:fam("leu"),note:`${sum("leu")}; under 4 free`,ages:"Child 4-17, adult 18+",rain:"No, outdoors",time:"1-2 hrs, our estimate",check:"Closes 4 pm Nov 18-Jan 3; Leu House closed"},
  gatorland:{price:`${fam("gatorland")} day pass`,note:sum("gatorland"),ages:"Child 3-12, adult ticket 13+; under 3 free",rain:"No, mostly outdoors",time:"Half a day, our estimate",check:"Zipline and add-ons cost extra"},
  "lake-eola":{price:"No entry price listed",note:"Check parking and boat rental",ages:"Playgrounds for 2-5 and 5-12",rain:"No, outdoors",time:"Under 1 hr, our estimate",check:"Swan boats closed Mondays"}
};
const byCost = [...activities].sort((a,b)=>(a.budget??Infinity)-(b.budget??Infinity));
const labels = {oscRates:"Science Center admission rates (official Spanish-language visit page)",osc:"Science Center visit information",kids:"KidsTown age guidance",crayola:"Crayola visit FAQ",crayolaHours:"Crayola hours",sea:"SEA LIFE visit planning",seaFaq:"SEA LIFE FAQ",seaHours:"SEA LIFE dated hours",mennello:"Mennello visitor information",leu:"Leu admission / hours",gator:"Gatorland hours / prices",gatorRules:"Gatorland visit rules",lake:"City park information"};
const sourceLinks = record => record.sourceIds.map(id=>`<a href="${sources[id]}">${labels[id]}</a>`).join("; ");
export function orlandoAdmissionSection() {
  const basis=JSON.stringify(admissionTariffs).replaceAll("<","\\u003c");
  return `<section class="container page-section admission-budget" id="party-admission" aria-labelledby="admission-title"><h2 id="admission-title">Your Party's Admission Budget</h2>
<p>Standard published prices in US dollars, one visit, for your own ages. Discounts, parking, meals and extras are not included; tax and fees may be added. This is not a checkout quote.</p>
<form id="admission-budget-form" class="admission-controls" hidden>
<label>Travelers<input type="number" name="traveler_count" min="1" max="14" step="1" value="4" required></label>
<label>Visit date<input type="date" name="visit_date" required></label>
<fieldset><legend>Every Traveler's Age</legend><div id="admission-age-fields" class="admission-ages"></div></fieldset>
<div class="admission-actions"><button type="submit">Calculate admission</button><button type="reset" title="Reset party" aria-label="Reset party">&#8634;</button></div>
</form><noscript><p>This calculator needs JavaScript. Without it, use the <a href="#compare">comparison table above</a>: it shows the same standard rates for two adults and children aged 3 and 10.</p></noscript><p id="admission-budget-status" role="status" aria-live="polite" aria-atomic="true">Enter your ages and date to see totals.</p>
<div id="admission-results" class="table-wrap admission-results" role="region" tabindex="0" aria-label="Your party admission comparison" hidden></div>
<script id="admission-budget-basis" type="application/json">${basis}</script><script type="module" src="../shared/orlando-admission-form.mjs"></script></section>`;
}
export function orlandoActivityPage() {
  const title="Things to Do in Orlando With Kids: Parks, Rest Days & Indoor Choices";
  const schema={"@context":"https://schema.org","@type":"WebPage",name:title,url:`https://familytripwise.com/${activityPath}`,dateModified:"2026-11-02",publisher:{"@type":"Organization",name:"Family Tripwise"}};
  return withLinkPreview(`<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${e(title)}</title><meta name="description" content="Choose an Orlando family outing with dated age-based admission, indoor and outdoor alternatives, short-visit limits and leave-and-return checks.">
<link rel="canonical" href="https://familytripwise.com/${activityPath}"><link rel="stylesheet" href="../styles.css">
<script type="application/ld+json">${JSON.stringify(schema)}</script>
<style>
body.orlando-activities .ds-compare{border:1px solid var(--c-line);border-radius:var(--r-md);box-shadow:var(--shadow-card);background:var(--c-surface)}
body.orlando-activities .ds-compare table{min-width:980px;font-size:var(--t-base)}
body.orlando-activities .ds-compare thead th{background:var(--c-mint-100);color:var(--c-teal-900);font-size:var(--t-sm);font-weight:800;border-bottom:2px solid var(--c-teal-700);vertical-align:bottom;text-align:left}
body.orlando-activities .ds-compare tbody tr:nth-child(even) :is(th,td){background:var(--c-paper)}
body.orlando-activities .ds-compare tbody tr:last-child :is(th,td){border-bottom:0}
body.orlando-activities .ds-compare td.ds-cost{min-width:150px;width:190px}
body.orlando-activities .ds-compare td.ds-cost strong{display:block;font-size:var(--t-lg);font-weight:800}
body.orlando-activities .ds-compare-narrow table{min-width:680px}
body.orlando-activities .activity-glance .og-fig{display:block;font-size:var(--t-sm)}
body.orlando-activities .activity-glance .og-fig strong{font-size:var(--t-lg);font-weight:800;color:var(--c-teal-900)}
body.orlando-activities .admission-controls fieldset{display:block}
body.orlando-activities .admission-controls legend{padding:0}
body.orlando-activities .admission-controls label{min-height:0;padding:0;border:0;background:none;align-items:flex-start;text-align:left}
body.orlando-activities .ds-compare td.ds-cost span{display:block;font-size:var(--t-sm);color:var(--c-ink-muted)}
@media(min-width:900px){body.orlando-activities .activity-glance ul{display:grid;grid-template-columns:1fr 1fr;gap:0 var(--s-6);max-width:none}body.orlando-activities .activity-glance li+li{margin-top:0}body.orlando-activities .activity-glance li{max-width:none}}
@media(max-width:600px){body.orlando-activities .ds-compare th[scope=row]{min-width:120px;width:120px}body.orlando-activities .ds-compare td:nth-child(3){min-width:88px}}
body.orlando-activities .ds-compare th[scope=row]{text-align:left}
body.orlando-activities .ds-compare th[scope=row] p{margin:var(--s-1) 0 0;font-size:var(--t-sm);font-weight:400;color:var(--c-ink-muted)}
body.orlando-activities .ds-lead{font-size:var(--t-lg);color:var(--c-ink-muted);line-height:1.4;margin:var(--s-2) 0}
body.orlando-activities main p,body.orlando-activities main li{max-width:var(--w-text)}
body.orlando-activities figure.hero-photo img{object-position:50% 78%}
body.orlando-activities .ds-swipe{display:none}
@media(max-width:1000px){body.orlando-activities .ds-swipe{display:block;font-weight:600}}
body.orlando-activities .activity-glance ul{margin:var(--s-2) 0 0;padding-left:var(--s-5)}
body.orlando-activities .activity-glance li{margin-bottom:var(--s-2)}
body.orlando-activities .activity-detail summary{cursor:pointer;min-height:44px}
body.orlando-activities .activity-detail summary h3{display:inline;margin:0;font-size:var(--t-lg)}
body.orlando-activities h1{font-size:var(--t-2xl);line-height:1.15;letter-spacing:0}
body.orlando-activities .intro{padding-top:var(--s-6);padding-bottom:var(--s-4)}
body.orlando-activities .page-section{padding-top:var(--s-7);padding-bottom:var(--s-4)}
body.orlando-activities main h2{font-size:var(--t-xl);letter-spacing:0}
body.orlando-activities h3{font-size:var(--t-lg);letter-spacing:0}
body.orlando-activities .routes{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:var(--s-3) var(--s-5)}
body.orlando-activities .routes p{margin:0}
body.orlando-activities .table-wrap{overflow:auto;max-width:100%;border:1px solid var(--c-line)}
body.orlando-activities table{border-collapse:collapse;min-width:1040px;width:100%;font-size:var(--t-sm)}
body.orlando-activities th,body.orlando-activities td{padding:var(--s-3);vertical-align:top;border-bottom:1px solid var(--c-line);line-height:1.4}
body.orlando-activities th[scope=row]{position:sticky;left:0;background:var(--c-surface);color:var(--c-ink);min-width:150px;width:150px;z-index:1}
body.orlando-activities th[scope=row] a{color:var(--c-teal-700)}
body.orlando-activities article{scroll-margin-top:80px;border-top:1px solid var(--c-line);padding:var(--s-4) 0}
body.orlando-activities section[id]{scroll-margin-top:80px}
body.orlando-activities .source-note{font-size:var(--t-sm)}
body.orlando-activities figure{margin:var(--s-5) 0;max-width:760px}body.orlando-activities figure.hero-photo{margin:var(--s-4) 0 0;max-width:none}
body.orlando-activities figure:not(.hero-photo) img{width:100%;height:auto;display:block}
body.orlando-activities figcaption{font-size:var(--t-xs)}
body.orlando-activities :focus-visible{outline:3px solid var(--c-teal-700);outline-offset:3px}
body.orlando-activities .admission-budget [hidden]{display:none!important}
body.orlando-activities .admission-controls{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:var(--s-4);max-width:640px}
body.orlando-activities .admission-controls label{display:flex;flex-direction:column;gap:var(--s-2);min-width:0;font-size:var(--t-sm)}
body.orlando-activities .admission-controls input{box-sizing:border-box;width:100%;min-width:0;min-height:44px;padding:var(--s-2);border:1px solid var(--c-ink-muted);border-radius:var(--r-sm);font:inherit;background:var(--c-surface);color:var(--c-ink)}
body.orlando-activities .admission-controls fieldset{grid-column:1/-1;min-width:0;margin:0;padding:0;border:0}
body.orlando-activities .admission-controls legend{font-size:var(--t-base);margin-bottom:var(--s-2)}
body.orlando-activities .admission-ages{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:var(--s-3)}
body.orlando-activities .admission-actions{grid-column:1/-1;display:flex;gap:var(--s-3);flex-wrap:wrap}
body.orlando-activities .admission-actions button{min-height:44px;padding:var(--s-2) var(--s-4);border:1px solid var(--c-teal-700);border-radius:var(--r-pill);background:var(--c-surface);color:var(--c-teal-700);font:inherit;cursor:pointer}
body.orlando-activities .admission-actions button[type=submit]{background:var(--c-teal-700);color:var(--c-surface)}
body.orlando-activities .admission-actions button[type=reset]{width:44px;padding:var(--s-2);font-size:var(--t-xl);line-height:1}
body.orlando-activities .admission-results table{min-width:760px}
@media(max-width:500px){body.orlando-activities .admission-controls{grid-template-columns:minmax(0,1fr) minmax(0,1fr)}body.orlando-activities .admission-ages{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:700px){body.orlando-activities .routes{grid-template-columns:1fr}body.orlando-activities article,body.orlando-activities section[id]{scroll-margin-top:130px}}
</style></head>
<body class="orlando-activities">${siteHeader("../", "things-to-do/orlando-with-kids.html")}
<main id="main"><section class="container intro"><p class="eyebrow">Orlando, Florida · non-park days</p><h1>Orlando With Kids: Non-Park Days</h1>
${contributorCredit()}<p class="ds-lead">Seven outings for a break from the theme parks, with family-of-4 ticket costs where published.</p><figure class="licensed-photo hero-photo"><img src="../images/orlando-lake-eola.webp" width="1440" height="1080" loading="eager" fetchpriority="high" decoding="async" alt="Lake Eola fountain and downtown Orlando buildings."><figcaption>Lake Eola, downtown Orlando. Photo by David Akers via <a href="https://commons.wikimedia.org/wiki/File:Lake_eola_in_Orlando_Florida_with_fountain.jpg">Wikimedia Commons</a>, public domain; cropped.</figcaption></figure></section>
<section class="container answer-box activity-glance" aria-label="At a glance">
<p><strong>Our picks</strong> (tickets for 2 adults, kids 3 and 10, estimate; same with an older child 6-12):</p>
<ul>
<li><span class="og-fig"><strong>${fam("science-center")}</strong> online</span> <strong>Rainy day: Science Center</strong>. Indoors, with a KidsTown area for 7 and under. Closed most Wednesdays.</li>
<li><span class="og-fig"><strong>${fam("gatorland")}</strong></span> <strong>Dry day: Gatorland</strong>. Animals and shows, mostly outdoors.</li>
<li><span class="og-fig"><strong>${fam("crayola")}</strong> plus tax</span> <strong>Midday break: Crayola</strong>. The only one we found publishing same-day return (hand stamp).</li>
<li><span class="og-fig"><strong>${fam("mennello")}</strong></span> <strong>Lowest ticket price: Mennello Museum</strong>, a short art visit. Or <strong>Leu Gardens ${fam("leu")}</strong>, an outdoor garden visit.</li>
</ul>
</section>
<section class="container"><p class="source-note">Standard admission rates for the five priced outings observed ${longDate(ratesCheckedOn)} on official pages. Other rules, hours and visit details checked ${longDate(checkedOn)} unless a detail says otherwise.</p><p><a href="#compare">Compare outings</a> · <a href="#split-day">Lunch and rest breaks</a> · <a href="#park-day">Park days</a></p></section>
<section class="container page-section" id="compare" aria-labelledby="compare-title"><h2 id="compare-title">Compare Non-Park Choices</h2>
<p class="source-note">Estimates for two adults and kids 3 and 10, one visit, from standard rates observed ${longDate(ratesCheckedOn)}.</p><p class="ds-swipe source-note">Swipe the table sideways to see every column →</p>
<div class="table-wrap ds-compare" tabindex="0" role="region" aria-label="Orlando activity comparison"><table><thead><tr><th scope="col">Outing</th><th scope="col">Family of 4 cost</th><th scope="col">OK in rain?</th><th scope="col">Time</th><th scope="col">Ticket ages</th><th scope="col">Check first</th></tr></thead><tbody>
${byCost.map(r=>`<tr><th scope="row"><a href="#${r.id}">${e(r.name)}</a><p>${e(r.role.replace(" / "," · "))}</p></th><td class="ds-cost"><strong>${e(row[r.id].price)}</strong><span>${e(row[r.id].note)}</span></td><td>${e(row[r.id].rain)}</td><td>${e(row[r.id].time)}</td><td>${e(row[r.id].ages)}</td><td>${e(row[r.id].check)}</td></tr>`).join("\n")}
</tbody></table></div><p class="source-note">Not dated availability or complete day costs. Tax and fees may be extra; meals and transport are extra. Research-based, not firsthand; times without an operator figure are our estimates.</p></section>
<section class="container page-section" aria-labelledby="start-title"><h2 id="start-title">Start With Your Day</h2><div class="routes">
<p><strong>Park is the priority:</strong> <a href="#park-day">check the booked park, heights and day budget</a> before adding another outing.</p>
<p><strong>Nap or meal break:</strong> <a href="#split-day">compare leave-and-return terms</a>; a hotel reset is not automatically practical.</p>
<p><strong>Teen plus younger sibling:</strong> <a href="#science-center">start with shared interests and separate exhibit ages</a>.</p>
<p><strong>Pool / resort day:</strong> <a href="../where-to-stay/orlando-family-hotels.html">check room setup and included water access</a> before buying another ticket.</p>
<p><strong>Lower-cost day:</strong> <a href="#mennello">Mennello's ${fam("mennello")} visit</a> or <a href="#lake-eola">a self-chosen park break</a>; transport and extras are separate.</p>
<p><strong>No car / short return:</strong> choose by the table's area, then <a href="#base-check">verify the whole return journey</a>. No transfer time is assumed.</p>
</div></section>
${orlandoAdmissionSection()}
<section class="container page-section" id="split-day"><h2>Can You Leave for Lunch or Rest?</h2><p>Two hours indoors with kids 3 and 10 may not cover every exhibit. These are published suggestions and return rules, not confirmed opening or transport plans.</p><p class="ds-swipe source-note">Swipe the table sideways to see every column →</p><div class="table-wrap ds-compare ds-compare-narrow" tabindex="0" role="region" aria-label="Indoor split-day checks"><table><thead><tr><th scope="col">Indoor choice</th><th scope="col">Leaving and returning</th><th scope="col">Two-hour time block</th><th scope="col">Meal constraint</th></tr></thead><tbody>
${activities.slice(0,3).map(r=>`<tr><th scope="row"><a href="#${r.id}">${e(r.name)}</a></th><td>${e(r.returnRule ?? "Return policy not published on the pages we read. Ask before leaving.")}</td><td>${r.duration ? (120 < r.duration[0] ? "Shorter than" : "At the lower end of")+` its ${r.duration[0]/60}-${r.duration[1]/60} hour suggestion; you may not see everything.` : "No official visit length published."}</td><td>${e(r.meal)}</td></tr>`).join("\n")}
</tbody></table></div><p>Wednesday: Science Center normally closes except OCPS breaks (Orange County public schools). Check Crayola and SEA LIFE calendars for your exact date.</p></section>
<section class="container page-section" id="park-day"><h2>When a Park Day Is Worth the Commitment</h2><p>Keep the park your family already chose as that day's anchor. Before buying:</p><ul><li>List each child's must-do and measure current heights.</li><li>Compare the ticket, cancellation terms, transport and paid extras.</li><li>If the younger child cannot do the older child's priority, decide whether adults can split up.</li></ul><p>Plan with the operators: <a href="https://disneyworld.disney.go.com/experience-updates/park-reservations/">Walt Disney World reservation rules</a>; <a href="https://www.universalorlando.com/web/en/us/plan-your-visit">Universal Orlando planning</a>; <a href="https://seaworld.com/orlando/park-info/">SeaWorld park information</a>.</p><p>Current ticket offers we have priced are on our <a href="../deals/">family deal checks</a>.</p><p>Do not turn a spare afternoon into a multi-park plan by default. A park ticket, shopping-district visit and rest day solve different jobs.</p></section>
<section class="container page-section"><h2>Details That Change the Decision</h2><p>Open a venue for its ticket basis, rules and official links.</p>${activities.map(r=>`<article id="${r.id}"><details class="activity-detail"><summary><h3>${e(r.name)}</h3></summary><p><strong>Tickets:</strong> ${d(r.age)} ${d(r.price)}</p><p><strong>Time:</strong> ${d(r.time)}. <strong>Check:</strong> ${d(r.blocker)}</p><p>${d(r.detail)}</p>${r.id === "sea-life" ? `<p><strong>Check the Eye bonus:</strong> ${e(seaLifeTicket.note)} <a href="${seaLifeTicket.url}">Ticket listing</a>; <a href="${seaLifeTicket.hours_url}">Eye dated hours</a>. Inspected ${seaLifeTicket.checked_on}; advertised promotion, not a selected-date quote.</p>` : ""}<p class="source-note">${sourceLinks(r)}. ${pricedIds.has(r.id) ? `${e(r.ratesScope || "Admission rates")} observed ${ratesCheckedOn}; other published facts inspected ${checkedOn}` : `Published facts inspected ${checkedOn}`}; check the venue's own page before you go.</p></details></article>`).join("\n")}
<article id="disney-springs"><h3>Disney Springs Is Not a Theme Park Day</h3><p>The official visit page lists complimentary self-parking, but shopping, meals and entertainment can add costs. Its advance-arrival guidance for reservations does not establish transfer time from your hotel. Treat it as a flexible district visit, not a promise of a free full day or a rainproof backup. <a href="${sources.springs}">Official visit and transport information</a>, checked October 13.</p></article></section>
<section class="container page-section" id="base-check"><h2>Getting Back to Your Room</h2><ul><li>Choose the area first: downtown / Loch Haven, the Florida Mall, International Drive or your booked park.</li><li>Check hotel pickup, vehicle or transit schedule, parking, child seats and an arrival buffer.</li><li>If returning is essential, confirm both admission re-entry and travel each way. Crayola's stamp answers only the admission part.</li></ul><p>No row here promises a stroller route, a short drive or a nap-friendly journey. When return is unknown, keep a continuous visit as the fallback.</p><p><a href="../where-to-stay/orlando-family-hotels.html">Compare Orlando room space, kitchens, dated hotel prices and water-feature limits</a>. Hotel prices there carry their own dates.</p>
</section>
<section class="container page-section" id="review-signals"><h2>What the Sampled Reviews Can Tell Us</h2><details class="activity-detail"><summary>Two small review samples, read October 13</summary><p>These are dated online-review signals, not Family Tripwise reviews, firsthand visits or a representative rating. We read only excerpts visible in search.</p>${reviewSignals.map(r=>`<p><strong>${e(r.venue)}:</strong> ${e(r.note)} ${e(r.dates)}. ${e(r.basis)}. <a href="${r.url}">Review source</a>.</p>`).join("\n")}<p>No comparable review sample was established for the other choices. Their inclusion is an official-fact / interest screen, not proof of family satisfaction. Ask what your children want to do; age tags alone cannot answer that.</p></details></section>
</main>${siteEnd("../", "things-to-do/orlando-with-kids.html")}</body></html>\n`);
}
export function writeOrlandoActivityPage(writeSite) {
  writeSite(activityPath,orlandoActivityPage());
  for (const name of ["admission-budget.mjs","orlando-admission-form.mjs"])
    writeSite(`shared/${name}`,readFileSync(new URL(`../../src/shared/${name}`,import.meta.url),"utf8"));
}

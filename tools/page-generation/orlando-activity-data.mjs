import { ageState } from "../evidence-audit.mjs";
export const activityPath = "things-to-do/orlando-with-kids.html";
export const checkedOn = "2026-10-13";
export const seaLifeTicket = {
  checked_on: "2026-10-13",
  url: "https://www.visitsealife.com/orlando/tickets-passes/",
  hours_url: "https://www.theorlandoeye.com/plan-your-day/before-you-visit/opening-hours/",
  product: "SEA LIFE + Orlando Eye FREE",
  currency: "USD",
  adult_from: 29,
  child_price: null,
  selected_visit_date: null,
  exact_family_total: null,
  tax_fee_inclusion: null,
  note: "The listing's separate Ultimate Florida Ticket carries an Eye maintenance notice, while the Eye calendar lists October 12/13 opening hours. Neither confirms your chosen date. Check operation and the exact package terms before paying for a bonus you intend to use."
};
export const sources = {
  osc: "https://www.osc.org/visit/",
  kids: "https://www.osc.org/visit/exhibits/kidstown/",
  crayola: "https://www.crayolaexperience.com/orlando/plan-your-visit/faqs",
  crayolaHours: "https://www.crayolaexperience.com/orlando/plan-your-visit/hours",
  sea: "https://www.visitsealife.com/orlando/plan-your-day/",
  seaFaq: "https://www.visitsealife.com/orlando/plan-your-day/information/faqs/",
  seaHours: "https://www.visitsealife.com/orlando/plan-your-day/before-you-visit/opening-hours/",
  mennello: "https://www.mennellomuseum.org/About/Visitor-Information",
  leu: "https://www.leugardens.org/Visit/Admission-Hours",
  gator: "https://www.gatorland.com/plan-your-visit/hours-and-prices/",
  gatorRules: "https://www.gatorland.com/plan-your-visit/",
  lake: "https://www.orlando.gov/Parks-the-Environment/Directory/Lake-Eola-Park",
  springs: "https://www.disneysprings.com/plan-your-visit/"
};
export const activities = [
  {id:"science-center",name:"Orlando Science Center",role:"Hands-on science / Loch Haven",weather:"Indoor exhibits",age:"Youth 2-12; teen 13-17; adult 18+. KidsTown guidance: 7 and under, not a venue age limit.",price:"USD29 adult + USD22 youth online; onsite USD32 + USD25. Teen USD27 online / USD30 onsite. Example USD102 online; tax/checkout-fee inclusion unknown, parking extra.",budget:102,time:"No general official visit-length estimate established",blocker:"Normally closed Wednesdays except OCPS breaks; confirm your date.",detail:"Parking USD4/hour extra. Leaving and returning is not established in the inspected visit page. Do not budget a second session without checking return terms.",sourceIds:["osc","kids"],duration:null,returnRule:null,meal:"Outside meals cannot be eaten in exhibit halls or cafe; park picnic space is separate."},
  {id:"crayola",name:"Crayola Experience",role:"Creative activities / Florida Mall",weather:"Indoor attraction",age:"Every guest 3+ pays; ages 2 and under free. Under15 accompanied by an adult.",price:"USD30.99 per paying person plus tax. Example USD123.96 plus tax at full admission price.",budget:123.96,time:"Operator suggests 3-4 hours",blocker:"A two-hour visit is shorter than the suggestion, not prohibited.",detail:"Same-day return until closing requires a hand stamp before leaving. Free mall parking. Premium activities cost extra; online discount is not a checked dated quote.",sourceIds:["crayola","crayolaHours"],duration:[180,240],returnRule:"Hand stamp before exit; same-day return before closing.",meal:"No outside food/drink. Cafe listed weekends only; snack counter separately. Check your day."},
  {id:"sea-life",name:"SEA LIFE Orlando",role:"Aquarium / International Drive",weather:"Indoor aquarium",age:"Under2 free; child ticket ages2-12. Older-child price and exact dated ticket require a quote.",price:`Family total unknown. Advertised ${seaLifeTicket.product} from ${seaLifeTicket.currency}${seaLifeTicket.adult_from}/adult, not standalone admission. Child/date/tax/fee basis unconfirmed.`,budget:null,time:"Operator suggests 2-3 hours",blocker:"Generic plan hours differ from the dated hours page; use the date-specific calendar.",detail:"Permission to remain until closing does not confirm leaving and returning. The adult package floor is not a quote for two adults and children3/10; do not multiply it into a family total or compare it as standalone aquarium admission.",sourceIds:["sea","seaFaq","seaHours"],duration:[120,180],returnRule:null,meal:"Food/drink prohibited inside; eating outside is not evidence of return permission."},
  {id:"mennello",name:"Mennello Museum",role:"Art / Loch Haven",weather:"Indoor museum; outdoor garden",age:"Adult USD8; ages6-17 USD3; under6 free.",price:"Example USD19 admission. Tax/transaction-fee inclusion not stated.",budget:19,time:"Choose a shortened art visit; duration is your plan, not an operator estimate",blocker:"Closed Mondays. Holiday paragraph contains old dates; confirm a holiday visit.",detail:"Adjacent museum lot is listed free. Do not adopt its old Science Center garage fee; the current Science Center page charges hourly. Exhibitions and interest matter more than age alone.",sourceIds:["mennello"],duration:null,returnRule:null,meal:null},
  {id:"leu",name:"Harry P. Leu Gardens",role:"Garden outing / north of downtown",weather:"Outdoor gardens, not a rain backup",age:"Adult USD15; ages4-17 USD10; under4 free.",price:"Example USD40 general admission. Tax/transaction-fee inclusion not stated; special/night events separate.",budget:40,time:"Shorten to available energy; no verified whole-visit duration",blocker:"Historic Leu House Museum temporarily closed; do not count its tour as an indoor backup.",detail:"October17,2026 closes4pm, last entry3pm. Regular seasonal hours also change November19. Garden-area access may vary with events; check the official calendar before paying.",sourceIds:["leu"],duration:null,returnRule:null,meal:null},
  {id:"gatorland",name:"Gatorland",role:"Animal exhibits / South Orange Blossom Trail",weather:"Outdoor-led outing, not an indoor fallback",age:"13+ adult ticket USD34.99; ages3-12 USD24.99; under3 free.",price:"Example USD119.96 day-pass admission. Tax/transaction-fee inclusion not established; optional experiences extra.",budget:119.96,time:"Check show schedule before choosing your time block",blocker:"Do not assume zipline or other add-ons are included or suitable for your party.",detail:"Operator lists daily10am-5pm and an online discount, not a checked date-specific family quote. Outside food and coolers restricted; assess weather and your own child needs.",sourceIds:["gator","gatorRules"],duration:null,returnRule:null,meal:null},
  {id:"lake-eola",name:"Lake Eola Park",role:"Playground / downtown outdoor break",weather:"Outdoor park, not a rain backup",age:"City lists playground areas for2-5 and5-12; that is not an all-ages enjoyment guarantee.",price:"No park entry price listed in inspected city page; parking, boat rental and purchases separate. Complete cost unknown.",budget:null,time:"Self-chosen short park stop; no minimum visit asserted",blocker:"Swan boats listed closed Mondays, unlike the park itself.",detail:"City page lists a paved0.9mile lake circuit, playgrounds and restrooms. You need not complete the circuit. No exact stroller route or weather/safety assurance is made.",sourceIds:["lake"],duration:null,returnRule:null,meal:null}
];
// Standard tariffs only; conditional concessions and advertised packages are separate products.
const band = (label, minimumAge, maximumAge, cents) => ({ label, minimumAge, maximumAge, cents });
const admissionBasis = {
  "science-center": {sourceId:"osc",channel:"online general admission",bands:[band("Youth",2,12,2200),band("Teen",13,17,2700),band("Standard adult",18,null,2900)],unknownReason:"Under-two pricing was not established in the inspected admission table."},
  crayola: {sourceId:"crayola",channel:"standard full admission",bands:[band("Under three",0,2,0),band("Standard admission",3,null,3099)],taxAndFeeStatus:"Tax is additional; final transaction fees unknown."},
  "sea-life": {sourceId:"sea",channel:"unpriced standalone admission",bands:[],unknownReason:"The adult advertised floor belongs to a package; standalone age-specific family prices are not established."},
  mennello: {sourceId:"mennello",channel:"standard museum admission",bands:[band("Under six",0,5,0),band("Child",6,17,300),band("Standard adult",18,null,800)]},
  leu: {sourceId:"leu",channel:"regular daytime general admission",bands:[band("Under four",0,3,0),band("Child",4,17,1000),band("Standard adult",18,null,1500)]},
  gatorland: {sourceId:"gator",channel:"standard day pass before online discount",bands:[band("Under three",0,2,0),band("Child",3,12,2499),band("Standard adult ticket",13,null,3499)]},
  "lake-eola": {sourceId:"lake",channel:"unpriced park visit",bands:[],unknownReason:"No entry price was listed in the inspected city page; missing price is not a zero-cost day."}
};
export const admissionTariffs = activities.map(record => {
  const basis = admissionBasis[record.id], inspected = basis.bands.length ? "2026-10-15" : checkedOn;
  return {id:record.id,name:record.name,currency:"USD",product:"Single-visit standard admission",channel:basis.channel,
    checkedOn:inspected,recheckOn:basis.bands.length ? "2026-10-29" : "2026-10-27",sourceUrl:sources[basis.sourceId],
    taxAndFeeStatus:basis.taxAndFeeStatus ?? "Tax and transaction-fee inclusion unknown.",
    exclusions:["Parking, transport, meals and optional experiences", "Senior, student, military, membership and other conditional concessions", "Online discounts, promotions, special events and annual passes"],
    bands:basis.bands,unknownReason:basis.unknownReason ?? null};
});
export const reviewSignals = [
  {venue:"Orlando Science Center",url:"https://www.tripadvisor.com/AttractionProductReview-g34515-d34472127-Orlando_Science_Center_General_Admission_Ticket-Orlando_Florida.html",basis:"Search-exposed review excerpts, not a complete live review body",dates:"Written February25,2026; family visit August2026 (publication date not established)",note:"Two opposing signals: hands-on engagement and a complaint about value, exhibit condition and staffing. Neither establishes today's conditions or a representative rating."},
  {venue:"Crayola Experience",url:"https://www.tripadvisor.com/Attraction_Review-g34515-d8395010-Reviews-or80-Crayola_Experience-Orlando_Florida.html",basis:"Publisher-selected positive excerpts exposed in search; direct body throttled",dates:"Visit labels August, July, March and January2026; publication dates unavailable",note:"Four positive excerpts mention creative family engagement or time spent. Positive-selection bias prevents an overall satisfaction or crowd verdict."}
];
export function orlandoActivityMaintenance(today) {
  return {page_url:`https://familytripwise.com/${activityPath}`,model_path:"tools/page-generation/orlando-activity-data.mjs",automatic_fact_renewal:false,
    official: Object.entries(sources).map(([id,url])=>({id,url,checked_on:checkedOn,freshness:ageState(checkedOn,14,today)})),
    reviews:reviewSignals.map(r=>({...r,retrieved_on:checkedOn,freshness:ageState(checkedOn,30,today)})),
    ticket_promotion:{...seaLifeTicket,freshness:ageState(seaLifeTicket.checked_on,7,today),limitation:"Adult advertised floor only, no dated child quote, complete family cost or confirmed operation; recheck before booking."},
    unknowns:activities.filter(r=>r.budget===null).map(r=>({id:r.id,exact_family_cost:null})),
    limitation:"Dated published rates and rules, not confirmed operation, a complete checkout, firsthand experience or family suitability. Future-dated reports cannot use these as already observed."};
}

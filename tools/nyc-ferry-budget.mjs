import {readFileSync} from 'node:fs';
import {validDate} from './hotel-evidence.mjs';
import {ageState} from './evidence-audit.mjs';

export const ferryEvidence=JSON.parse(readFileSync(new URL('../docs/research/nyc-ferry-family-budget-2026-10-10.json',import.meta.url)));
const sources=['https://www.ferry.nyc/ticketing-info/','https://static.ferry.nyc/blog/fare-change/','https://portal.311.nyc.gov/article/?kanumber=KA-02376','https://edc.nyc/press-release/amidst-record-ridership-nycedc-announces-new-initiatives-support-nyc-ferry-forward'];
const fares=[{state:'observed',observed_on:'2026-10-10',effective_on:null,single_cents:450},{state:'announced',published_on:'2026-09-28',effective_on:'2026-10-19',single_cents:500}];
export function ferryBudget(evidence=ferryEvidence,today='2026-10-10') {
 if(!validDate(today)||evidence?.schema_version!==1||evidence.action_id!=='FT-IMP-087'||evidence.observed_on!=='2026-10-10'||evidence.refresh_days!==9||evidence.evidence_class!=='OFFICIAL_FARE_SCHEDULE_AND_ANNOUNCEMENT'||evidence.source_status!=='body-inspected'||evidence.currency!=='USD'||evidence.unit!=='per person, regular one-way single ticket'||JSON.stringify(evidence.source_urls)!==JSON.stringify(sources)||JSON.stringify(evidence.source_publication_dates)!==JSON.stringify([null,'2026-09-28',null,'2024-07-22'])||JSON.stringify(evidence.fares)!==JSON.stringify(fares)||JSON.stringify(evidence.party)!==JSON.stringify({adults:2,teen_ages:[13,17],all_riders_over_44_inches:true,standard_fare_riders:4,discounts_assumed:false})||JSON.stringify(evidence.policy)!==JSON.stringify({one_way_transfer_minutes:120,round_trip_free_transfer:false})||evidence.conflict?.legacy_single_cents!==400)throw Error('NYC Ferry fare/date/party/transfer basis changed; requalification required');
 const future=today<evidence.observed_on;
 return {evidence:structuredClone(evidence),scenarios:future?[]:evidence.fares.map(fare=>({...fare,one_way_party_cents:fare.single_cents*evidence.party.standard_fare_riders,return_party_cents:fare.single_cents*evidence.party.standard_fare_riders*2})),freshness:ageState(evidence.observed_on,evidence.refresh_days,today),evidence_state:future?'not-yet-observed-at-report-date':'dated-records-available'};
}
export const ferryEffective=JSON.parse(readFileSync(new URL('../docs/research/nyc-ferry-effective-fare-2026-10-19.json',import.meta.url)));
// D23 3k: the $5.00 fare was observed on the operator panel on 2026-10-19 and re-read 2026-11-01 (docs/research/nyc-teen-prices-2026-11-01.md).
const ferryRereadOn='2026-11-01',ferryRereadCents=500,ferryTwoDayCents=1500;
export function ferryComparison(evidence=ferryEvidence,effective=ferryEffective) {
 const budget=ferryBudget(evidence),riders=evidence.party.standard_fare_riders,current=effective.current_operator_panel.single_ticket_cents;
 if(current!==ferryRereadCents||effective.checked_on!=='2026-10-19')throw Error('NYC Ferry current fare changed; requalification required');
 const money=c=>`$${(c/100).toFixed(2)}`,row=(label,c)=>[label,money(c),money(c*riders),money(c*riders*2)];
 const old=budget.scenarios.find(s=>s.state==='observed');
 return {heading:'NYC Ferry: budget the return trip',
 note:'Two adults plus teens aged 13 and 17, all over 44 inches, paying four standard single-ticket fares (riders under 44 inches ride free with an adult). These are fare-only examples, not checkout totals or the cheapest ticket option: a 2-day unlimited ticket was '+money(ferryTwoDayCents)+' a person on November 1, 2026.',
 headers:['Fare','$ / rider / one way','$ / party / one way','$ / party / out and back'],
 rows:[row('Observed October 19 and November 1, 2026',current),row('Before October 19 (observed October 10; no longer current)',old.single_cents)],
 rule:'The $5.00 fare took effect October 19 (September 28 notice); the official pricing panel showed it on October 19 and November 1, 2026. Recheck the exact travel date. Free transfers cover one-way NYC Ferry connections within 120 minutes, not a return trip. No student or other discount is assumed for visiting teens; taxes/fees, service and boarding remain unverified.',
 conflict:'The ticket page still also shows an older list with $4.00 one-way and $27.50 10-trip text (November 1, 2026). The current pricing panel shows $5.00; treat the older list as legacy text.',sources:[...evidence.source_urls]};
}
export function ferryReviewClock(today,evidence=ferryEvidence) {
 const b=ferryBudget(evidence,today);
 return {id:'nyc-ferry-fare-return',page_url:'https://familytripwise.com/things-to-do/new-york-city-with-teens.html',record_path:'docs/research/nyc-ferry-family-budget-2026-10-10.json',observed_on:evidence.observed_on,interval_days:9,evidence_class:evidence.evidence_class,source_urls:[...evidence.source_urls],freshness:b.freshness,evidence_state:b.evidence_state,announced_effective_on:'2026-10-19',announced_state:'announced-not-observed',
 next_step:b.freshness.state==='review-due'?'verify-effective-fare-and-transfer-policy-before-promoting-announcement':b.freshness.state==='future-date-review'?'do-not-use-future-evidence-in-historical-report':'preserve-observed-and-announced-labels-until-source-change-or-October19',limitation:'Clock never promotes an announced fare to observed; standard single-ticket arithmetic, not best pass, checkout, discount eligibility or service assurance'};
}

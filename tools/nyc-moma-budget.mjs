import { readFileSync } from 'node:fs';
import { validDate } from './hotel-evidence.mjs';
import { ageState } from './evidence-audit.mjs';

export const momaEvidence=JSON.parse(readFileSync(new URL('../docs/research/nyc-moma-family-admission-2026-10-10.json',import.meta.url)));

export function momaBudget(evidence=momaEvidence,today='2026-10-10') {
  if(!validDate(today)||evidence?.schema_version!==1||evidence.action_id!=='FT-IMP-086'||evidence.observed_on!=='2026-10-10'||evidence.refresh_days!==14||evidence.evidence_class!=='OFFICIAL_ADMISSION_SCHEDULE_AND_POLICY'||evidence.source_status!=='body-inspected'||evidence.published_on!==null||evidence.currency!=='USD'||evidence.unit!=='per person, general museum admission'||JSON.stringify(evidence.source_urls)!==JSON.stringify(['https://www.moma.org/visit/','https://www.moma.org/visit/tips'])||JSON.stringify(evidence.prices)!==JSON.stringify({adult_cents:3000,student_cents:1700,child_cents:0})||JSON.stringify(evidence.policy)!==JSON.stringify({free_child_max_age:16,student_requires_full_time_ID:true,free_child_ticket_required:true,same_day_return_with_ticket:true})||JSON.stringify(evidence.scenarios)!==JSON.stringify([{id:'younger-teens',adults:2,child_ages:[13,16],older_teen_student_ID:false},{id:'older-teen-standard',adults:2,child_ages:[13,17],older_teen_student_ID:false},{id:'older-teen-student',adults:2,child_ages:[13,17],older_teen_student_ID:true}])) throw new Error('MoMA admission basis changed; requalification required');
  const future=today<evidence.observed_on;
  const scenarios=future?[]:evidence.scenarios.map(scenario=>({ ...scenario,
    total_cents:scenario.adults*evidence.prices.adult_cents+scenario.child_ages.reduce((sum,age)=>sum+(age<=evidence.policy.free_child_max_age?evidence.prices.child_cents:scenario.older_teen_student_ID?evidence.prices.student_cents:evidence.prices.adult_cents),0),
    total_basis:'Published admission categories only; not a checkout total or student-ID acceptance' }));
  return {evidence,scenarios,freshness:ageState(evidence.observed_on,evidence.refresh_days,today),evidence_state:future?'not-yet-observed-at-report-date':'dated-records-available'};
}

export function momaComparison(evidence=momaEvidence) {
  const budget=momaBudget(evidence),labels=[['2 adults + teens 13 and 16','2 standard adults; both teens in free-child category'],['2 adults + teens 13 and 17','3 standard admissions; age 13 in free-child category'],['2 adults + teens 13 and 17','2 standard adults; age 17 only if eligible full-time student with ID; age 13 free']];
  return {heading:'MoMA: teen ages change the admission budget',
    note:'Published general-admission prices checked October 10, 2026: adults USD 30/person; full-time students with ID USD 17/person; ages 16 and under free. USD is our interpretation of the official dollar prices. Examples are admission-only, not checkout totals; visit-date availability and any taxes or fees are unverified.',
    headers:['Party','Ticket category basis','Base admission (USD / party visit)'],
    rows:budget.scenarios.map((scenario,i)=>[...labels[i],`USD ${(scenario.total_cents/100).toFixed(2)}`]),
    return_note:'Free child admission still needs a ticket. MoMA permits leaving and returning the same day if you retain your ticket. Keep every visitor\'s ticket for an outside meal or break; actual rest and return timing are not verified. Reserve the exact-date tickets and check student-ID eligibility before paying.',
    sources:evidence.source_urls};
}

export function momaReviewClock(today,evidence=momaEvidence) {
  const budget=momaBudget(evidence,today);
  return {id:'nyc-moma-admission-return',page_url:'https://familytripwise.com/things-to-do/new-york-city-with-teens.html',record_path:'docs/research/nyc-moma-family-admission-2026-10-10.json',observed_on:evidence.observed_on,interval_days:14,evidence_class:evidence.evidence_class,source_urls:evidence.source_urls,freshness:budget.freshness,evidence_state:budget.evidence_state,
    next_step:budget.freshness.state==='review-due'?'review-current-official-admission-and-return-policy':budget.freshness.state==='future-date-review'?'do-not-use-future-evidence-in-historical-report':'preserve-dated-categories-until-named-change-or-review-due',
    limitation:'Published category arithmetic only, not ID acceptance, checkout tax/fees, ticket inventory, observed rest or automatic source renewal.'};
}

import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {validDate} from './hotel-evidence.mjs';
import {ageState} from './evidence-audit.mjs';

const read = name => JSON.parse(readFileSync(new URL(`../docs/research/${name}`, import.meta.url), 'utf8'));
export const bostonMuseumEvidence = read('boston-museum-return-policy-2026-10-09.json');
const task = read('boston-public-admission-budget-task-2026-10-09.json');
const store = 'https://estore.bostonchildrensmuseum.org/webstore/shop/viewItems.aspx?cg=TT&c=TT';

export function bostonMuseumAdmission(evidence = bostonMuseumEvidence, asOf = '2026-10-09', basis = task) {
  const admission = evidence?.admission, price = admission?.standard_admission, fee = admission?.transaction_fee;
  const policy = {venue:evidence?.venue, checked_on:evidence?.checked_on, evidence_class:evidence?.evidence_class,
    scenario:evidence?.scenario, sources:evidence?.sources, admission, hours:evidence?.hours};
  if (!validDate(asOf) || !validDate(evidence?.checked_on) || evidence?.schema_version !== 1 ||
      evidence.venue !== "Boston Children's Museum" || evidence.evidence_class !== 'OFFICIAL_VENUE_POLICY' ||
      basis?.schema_version !== 1 || basis.evidence_class !== 'PAGE_ONLY_PROXY_TASK_WITH_REUSED_OFFICIAL_VENUE_POLICY' ||
      basis.source_observed_on !== evidence.checked_on || basis.refresh_days !== 14 ||
      basis.maintained_policy_sha256 !== createHash('sha256').update(JSON.stringify(policy)).digest('hex') ||
      JSON.stringify(basis.scenario) !== JSON.stringify({adults:evidence.scenario.adults,child_ages:evidence.scenario.child_ages}) ||
      JSON.stringify(basis.scenario) !== JSON.stringify({adults:2,child_ages:[4,8,12]}) ||
      price?.currency !== 'USD' || price.unit !== 'person age one or older' || price.observed_on !== evidence.checked_on ||
      price.stay_date !== null || price.date_availability_verified !== false || fee?.currency !== 'USD' || fee.unit !== 'transaction' ||
      admission.checkout_total !== null || admission.tax_inclusion !== 'unknown' || admission.same_day_reentry !== 'not-established' ||
      admission.new_ticket_required_after_exit !== null || admission.validity !== 'all-day-except-TJX-one-dollar-Sunday-afternoon' ||
      !evidence.sources.includes(store) || ![price.amount,fee.amount].every(value => Number.isFinite(value) && value > 0 && Number.isSafeInteger(value * 100)))
    throw new Error('Boston museum policy or task basis changed; requalification required');
  const tickets = basis.scenario.adults + basis.scenario.child_ages.length;
  const amount = tickets * price.amount;
  if (basis.admission_component?.tickets !== tickets || basis.admission_component.amount !== amount ||
      basis.admission_component.checkout_total !== null || basis.admission_component.includes_transaction_fee_assumed !== false)
    throw new Error('Invalid Boston museum admission component');
  return {evidence, tickets, amount, transaction_fee:fee.amount, checkout_total:null, source_url:store,
    freshness:ageState(evidence.checked_on,basis.refresh_days,asOf)};
}

export function bostonMuseumReviewClock(today, evidence = bostonMuseumEvidence) {
  const budget = bostonMuseumAdmission(evidence,today);
  return {id:'boston-museum-admission-return',page_url:'https://familytripwise.com/where-to-stay/boston-family-hotels.html',
    record_path:'docs/research/boston-museum-return-policy-2026-10-09.json',observed_on:evidence.checked_on,interval_days:14,
    evidence_class:evidence.evidence_class,source_urls:[budget.source_url],freshness:budget.freshness,
    evidence_state:today < evidence.checked_on ? 'not-yet-observed-at-report-date' : 'dated-records-available',
    next_step:budget.freshness.state === 'review-due' ? 'review-current-official-policy-before-relying-on-it' : budget.freshness.state === 'future-date-review' ? 'do-not-use-future-evidence-in-historical-report' : 'preserve-dated-policy-until-named-change-or-review-due',
    limitation:'Review clock only; no admission, fee, exit/re-entry, availability, route or hotel-price renewal.'};
}

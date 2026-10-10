import { readFileSync } from 'node:fs';
import { validDate } from './hotel-evidence.mjs';
import { ageState } from './evidence-audit.mjs';

export const summitPolicyEvidence = JSON.parse(readFileSync(new URL('../docs/research/new-york-city-summit-teen-access-2026-10-10.json', import.meta.url)));

export function summitPolicy(evidence = summitPolicyEvidence, today = '2026-10-10') {
  const urls = ['https://summitov.com/ticketterms/', 'https://summitov.com/codeofconduct/'];
  if (!validDate(today) || evidence?.schema_version !== 1 || evidence.action_id !== 'FT-IMP-085' ||
      evidence.evidence_class !== 'OFFICIAL_VENUE_POLICY' || evidence.observed_on !== '2026-10-10' ||
      evidence.next_review_due !== '2026-11-09' || JSON.stringify(evidence.policy) !== JSON.stringify({under_age:16,adult_throughout:true,adult_minimum_age:null,independent_16_17_entry:'not-established'}) ||
      evidence.sources?.length !== 2 || evidence.sources.some((source, i) => source.url !== urls[i] || source.observed_on !== evidence.observed_on) ||
      evidence.sources[0].published_on !== '2021-08-10' || evidence.sources[0].updated_on !== '2023-06-28' ||
      evidence.sources[1].published_on !== null || evidence.sources[1].updated_on !== null ||
      ['comparison_check','detail_check','official_check','faq'].some(key => typeof evidence.public_copy?.[key] !== 'string' || !evidence.public_copy[key].trim()))
    throw new Error('SUMMIT policy basis changed; requalification required');
  return {evidence, freshness:ageState(evidence.observed_on,30,today), evidence_state:today < evidence.observed_on ? 'not-yet-observed-at-report-date' : 'dated-records-available'};
}

export function summitPolicyClock(today, evidence = summitPolicyEvidence) {
  const policy = summitPolicy(evidence, today);
  return {id:'nyc-summit-under16',page_url:'https://familytripwise.com/things-to-do/new-york-city-with-teens.html',record_path:'docs/research/new-york-city-summit-teen-access-2026-10-10.json',observed_on:evidence.observed_on,interval_days:30,evidence_class:evidence.evidence_class,source_urls:evidence.sources.map(source=>source.url),freshness:policy.freshness,evidence_state:policy.evidence_state,
    next_step:policy.freshness.state === 'review-due' ? 'review-current-official-policy-before-relying-on-it' : policy.freshness.state === 'future-date-review' ? 'do-not-use-future-evidence-in-historical-report' : 'preserve-dated-policy-until-named-change-or-review-due',
    limitation:'Under-16 adult accompaniment only; no inferred adult minimum age or independent older-teen admission, source reinspection or general fact renewal.'};
}

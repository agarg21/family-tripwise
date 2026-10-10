import { readFileSync } from 'node:fs';
import { validDate } from './hotel-evidence.mjs';
import { ageState } from './evidence-audit.mjs';

export const spygamesPolicyEvidence = JSON.parse(readFileSync(new URL('../docs/research/nyc-spygames-minor-policy-2026-10-10.json', import.meta.url)));

export function spygamesPolicy(evidence = spygamesPolicyEvidence, today = '2026-10-10') {
  const urls = ['https://spyscape.com/tickets-new-york', 'https://spyscape.com/all-access'];
  const policy = {product:'SPYGAMES',under_age:16,adult_accompaniment:true,adult_throughout:null,adult_minimum_age:null,independent_16_17_entry:'not-established',spyscape_museum_supervision:'not-established'};
  if (!validDate(today) || evidence?.schema_version !== 1 || evidence.action_id !== 'FT-IMP-089' ||
      evidence.evidence_class !== 'OFFICIAL_VENUE_POLICY' || evidence.observed_on !== '2026-10-10' ||
      evidence.next_review_due !== '2026-11-09' || JSON.stringify(evidence.policy) !== JSON.stringify(policy) ||
      evidence.sources?.length !== 2 || evidence.sources.some((source,i) => source.url !== urls[i] || source.observed_on !== evidence.observed_on || source.published_on !== null || source.updated_on !== null) ||
      ['comparison_check','detail_check','official_check','faq'].some(key => typeof evidence.public_copy?.[key] !== 'string' || !evidence.public_copy[key].trim()))
    throw new Error('SPYGAMES policy basis changed; requalification required');
  return {evidence,freshness:ageState(evidence.observed_on,30,today),evidence_state:today < evidence.observed_on ? 'not-yet-observed-at-report-date' : 'dated-records-available'};
}

export function spygamesPolicyClock(today,evidence = spygamesPolicyEvidence) {
  const p = spygamesPolicy(evidence,today);
  return {id:'nyc-spygames-under16',page_url:'https://familytripwise.com/things-to-do/new-york-city-with-teens.html',record_path:'docs/research/nyc-spygames-minor-policy-2026-10-10.json',observed_on:evidence.observed_on,interval_days:30,evidence_class:evidence.evidence_class,source_urls:evidence.sources.map(s=>s.url),freshness:p.freshness,evidence_state:p.evidence_state,
    next_step:p.freshness.state === 'review-due' ? 'review-current-official-policy-before-relying-on-it' : p.freshness.state === 'future-date-review' ? 'do-not-use-future-evidence-in-historical-report' : 'preserve-dated-policy-until-named-change-or-review-due',
    limitation:'SPYGAMES under16 adult accompaniment only; no adult-throughout, adult minimum age, independent older-teen or separate museum supervision inference, reinspection or general fact renewal.'};
}

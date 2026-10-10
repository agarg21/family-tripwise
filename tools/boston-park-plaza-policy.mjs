import {readFileSync} from 'node:fs';
import {validDate} from './hotel-evidence.mjs';
import {ageState} from './evidence-audit.mjs';

export const parkPlazaPolicy = JSON.parse(readFileSync(new URL('../docs/research/boston-park-plaza-fifth-bed-2026-10-10.json', import.meta.url)));
const sourceUrl = 'https://www.hilton.com/en/hotels/bossrhh-hilton-boston-park-plaza/hotel-info/';

export function parkPlazaFitnessPolicy(evidence = parkPlazaPolicy, asOf = '2026-10-10') {
  if (!validDate(asOf) || evidence?.schema_version !== 1 || evidence.action !== 'FT-RES-144' ||
      evidence.hotel !== 'Hilton Boston Park Plaza' || evidence.record_id !== 'boston-park-plaza-deluxe-double' ||
      evidence.category !== '2 Double Beds Deluxe Guestroom' || evidence.checked_on !== '2026-10-10' ||
      evidence.evidence_class !== 'OFFICIAL_PROPERTY_POLICY_AND_EXACT_CATEGORY_FACT' || evidence.refresh_days !== 30 ||
      evidence.fitness?.facility !== 'Lynx Fitness Club' || evidence.fitness.minimum_guest_age !== 18 ||
      evidence.fitness.hotel_guest_required !== true || evidence.fitness.first_visit_waiver_required !== true ||
      evidence.fee?.displayed_daily_amount !== 35 || evidence.fee.currency !== 'USD' ||
      evidence.fee.unit !== 'daily mandatory destination charge' || evidence.fee.includes_fitness_access !== true ||
      evidence.fee.credit_deducted !== false || evidence.fee.fee_waiver_assumed !== false || evidence.fee.current_checkout_total !== null ||
      JSON.stringify(evidence.scenario) !== JSON.stringify({adults:2,child_ages:[4,8,12],arrival:'2026-11-08',departure:'2026-11-13',nights:5}) ||
      JSON.stringify(evidence.fitness.scenario_children_outside_band) !== JSON.stringify([4,8,12]) ||
      evidence.bedding?.published_maximum !== 5 || evidence.bedding.published_double_beds !== 2 ||
      evidence.bedding.fifth_sleeping_place !== 'not-established' || evidence.bedding.rollaway_availability !== 'not-established' || evidence.bedding.rollaway_charge !== null ||
      !Array.isArray(evidence.sources) || evidence.sources.length !== 2 ||
      evidence.sources.some(source => source.observed_on !== evidence.checked_on || source.published_on !== null) ||
      JSON.stringify(evidence.sources.map(source => source.url)) !== JSON.stringify([sourceUrl.replace('hotel-info/','rooms/'),sourceUrl]))
    throw new Error('Park Plaza category, policy or source basis changed; requalification required');
  const freshness = ageState(evidence.checked_on,evidence.refresh_days,asOf);
  return {evidence,source_url:sourceUrl,freshness,
    evidence_state:asOf < evidence.checked_on ? 'not-yet-observed-at-report-date' : 'dated-records-available',
    excluded_child_ages:asOf < evidence.checked_on ? null : [...evidence.fitness.scenario_children_outside_band],
    checkout_total:null};
}

export function parkPlazaPolicyClock(today, evidence = parkPlazaPolicy) {
  const policy = parkPlazaFitnessPolicy(evidence,today);
  return {id:'boston-park-plaza-gym-fee',page_url:'https://familytripwise.com/where-to-stay/boston-family-hotels.html',
    record_path:'docs/research/boston-park-plaza-fifth-bed-2026-10-10.json',observed_on:evidence.checked_on,
    interval_days:evidence.refresh_days,evidence_class:evidence.evidence_class,source_urls:[policy.source_url],
    freshness:policy.freshness,evidence_state:policy.evidence_state,
    next_step:policy.freshness.state === 'review-due' ? 'review-current-official-policy-before-relying-on-it' : policy.freshness.state === 'future-date-review' ? 'do-not-use-future-evidence-in-historical-report' : 'preserve-dated-policy-until-named-change-or-review-due',
    limitation:'Facility-specific age and fee-benefit review clock only; no bed, price, policy-effective-date or actual service renewal.'};
}

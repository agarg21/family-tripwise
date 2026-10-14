import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const report = JSON.parse(readFileSync(new URL('../docs/research/american-stroller-policy-conflict-2026-10-14.json', import.meta.url)));
const sources = Object.fromEntries(report.sources.map(source => [source.id, source]));

test('pure: primary observations retain source clocks and unknown authority', () => {
  assert.equal(report.action_id, 'FT-RES-168');
  assert.equal(report.learning_id, 'LRN-259');
  assert.equal(report.sources.length, 4);
  assert.equal(Object.keys(sources).length, 4);
  for (const source of report.sources) {
    const url = new URL(source.url);
    assert.equal(url.hostname, 'www.aa.com');
    assert.equal(url.protocol, 'https:');
    assert.equal(source.checked_on, report.observed_on);
    assert.equal(source.native_http_status, null);
    assert.equal(source.effective_date, null);
  }
  assert.equal(sources.bags.reader_crawl_label, '2 days ago');
});

test('pure: navigation-linked owner rejects only the fragment explanation', () => {
  assert.deepEqual(report.navigation.slice(0, 2).map(edge => [edge.from, edge.to]), [['family', 'bags'], ['bags', 'web-specialty']]);
  assert.equal(sources['web-specialty'].url, 'https://www.aa.com/web/i18n/travel-info/baggage/specialty-and-sports.html');
  assert.equal(report.navigation[2].reader_reported_redirect_to, 'family');
  assert.equal(report.result.decision, 'REJECT_UNLINKED_FRAGMENT_ONLY_EXPLANATION');
  assert.equal(report.result.rule_selection, 'HOLD');
  assert.equal(report.result.cause, 'UNKNOWN');
  assert.equal(report.result.weight_route_conflict, 'UNRESOLVED');
});

test('pure: stroller threshold is not borrowed from bassinet or another section', () => {
  assert.equal(sources.family.weight_threshold_in_stroller_section_lb, null);
  assert.match(sources.family.outside_section_20lb_applies_to, /bassinet/);
  for (const id of ['fragment', 'web-specialty']) {
    assert.equal(sources[id].weight_threshold_lb, 20);
    assert.equal(sources[id].weight_operator, 'strictly-greater-than');
    assert.equal(sources[id].section, 'Infant seats or child restraint devices');
  }
});

test('pure: reproducible desk tasks cannot promise airport acceptance', () => {
  assert.deepEqual(report.desk_tasks.map(task => task.result), ['HOLD_CONFLICT', 'ALIGNED_COUNTER_INSTRUCTION_NOT_ACCEPTANCE', 'ONE_GATE_ITEM_RESEARCH_CONSTRAINT_NOT_TWO_ITEM_PROMISE']);
  for (const task of report.desk_tasks) {
    assert.ok(task.steps.length >= 3);
    assert.equal(task.gate_check_promised, false);
    assert.equal(task.counter_check_guaranteed, false);
  }
  assert.match(report.validation_limits, /not rendered desktop\/mobile\/keyboard/);
});

test('pure: bounded reader audit is not scraping authorization or numeric demand', () => {
  assert.equal(report.collection.explicit_opens, 2);
  assert.equal(report.collection.explicit_clicks, 3);
  assert.equal(report.collection.underlying_http_requests, null);
  for (const key of ['native_requests', 'browser_attempts', 'paid_calls', 'llm_calls', 'source_owner_contacts', 'access_denials', 'security_or_origin_fallbacks']) assert.equal(report.collection[key], 0);
  assert.equal(report.collection.source_bodies_retained, false);
  assert.equal(report.result.public_change_selected, false);
  assert.equal(report.result.new_url_qualified, false);
  assert.equal(report.result.numeric_demand, null);
  assert.equal(report.result.same_market_serp_overlap, null);
  for (const key of ['remaining_gate', 'next_eligible_run', 'stop_condition']) assert.ok(report.result[key].length > 50);
  assert.equal(report.gsc.query_cohort_present, false);
  assert.equal(report.gsc.ctr_action_selected, false);
});

test('pure: evidence remains public-safe and all protected outputs unchanged', () => {
  assert.ok(Object.values(report.unchanged).every(value => value === true));
  const text = JSON.stringify(report);
  for (const value of ['raw_html', 'source_text', 'access_token', 'private_key', 'query_rows', 'BEGIN PRIVATE KEY', 'sk-proj-']) assert.ok(!text.includes(value));
});

import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {compareOrlandoAdmission} from "./orlando-admission-budget.mjs";
import {admissionTariffs} from "./page-generation/orlando-activity-data.mjs";
const record=JSON.parse(readFileSync(new URL("../docs/research/orlando-infant-price-gate-2026-10-15.json",import.meta.url)));

test("group infant statement does not establish individual-family applicability",()=>{
  assert.equal(record.group_source.minimum_group_size,15);assert.equal(record.group_source.majority_adult_group_required,true);
  assert.equal(record.group_source.under_two_complimentary_within_this_group_page,true);
  assert.equal(record.group_source.individual_admission_applicability_established,false);
  assert.equal(record.group_source.result,"REJECT_SCOPE_TRANSFER");assert.equal(record.task.party_size,4);
  for(const age of [0,1]) {
    const row=compareOrlandoAdmission({travelerAges:[30,35,age,13],asOf:"2026-10-27",visitDate:"2026-11-01"}).records[0];
    assert.equal(row.publishedAdmissionSubtotalCents,null);assert.deepEqual(row.missingAges,[age]);
  }
  assert.equal(admissionTariffs[0].checkedOn,"2026-10-27");
});

test("security handoff retains clean provenance and no bypass or availability diagnosis",()=>{
  const handoff=record.ticket_handoff;assert.equal(handoff.result,"SECURITY_CHALLENGE_NO_TICKET_FACTS");
  assert.equal(handoff.provider_http_status,null);assert.equal(handoff.inventory_status,"unknown");assert.equal(handoff.infant_price,null);
  const url=new URL(handoff.clean_requested_url);assert.equal(url.search,"");assert.equal(url.hash,"");assert.equal(url.username,"");
  for(const key of ["private_challenge_query_retained","raw_body_retained","retry_performed","challenge_interaction_performed"])assert.equal(handoff[key],false);
  assert.doesNotMatch(JSON.stringify(record),/incident_id|cinfo=|cip=|cts=|_Incapsula_Resource|\b\d{1,3}(?:\.\d{1,3}){3}\b/);
  assert.equal(record.secondary_screen.result,"REJECT_EXPIRED_EVENT_AS_CURRENT_INDIVIDUAL_PRICE");
});

test("one-family arithmetic cannot silently opt into a fifteen-person group rate",()=>{
  assert.throws(()=>compareOrlandoAdmission({travelerAges:Array(15).fill(30),asOf:"2026-10-27",visitDate:"2026-11-01"}));
  const row=compareOrlandoAdmission({travelerAges:[30,35,2,13],asOf:"2026-10-27",visitDate:"2026-11-01"}).records[0];
  assert.equal(row.publishedAdmissionSubtotalCents,10700);assert.equal(row.channel,"online general admission");
  assert.equal(row.completeDayCostCents,null);assert.equal(row.admissionAcceptance,"unknown");
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {calculateAdmissionBudget} from '../src/shared/admission-budget.mjs';
import {admissionTariffs} from './page-generation/orlando-activity-data.mjs';
const task={travelerAges:[30,35,2,13],asOf:'2026-10-28',visitDate:'2026-10-29'};

test('sparse party cannot hide missing travelers behind a custom iterator',()=>{
  const ages=[30,,13];let called=false;
  ages[Symbol.iterator]=function*(){called=true;};
  assert.throws(()=>calculateAdmissionBudget(admissionTariffs,{...task,travelerAges:ages}));
  assert.equal(called,false);
});
test('party arrays cannot substitute validation or charged guest rows',()=>{
  for(const method of ['every','some','map']) {
    const ages=[30,35,2,13];let called=false;
    ages[method]=()=>{called=true;return method==='map'?[]:true;};
    assert.throws(()=>calculateAdmissionBudget(admissionTariffs,{...task,travelerAges:ages}),method);
    assert.equal(called,false,method);
  }
});
test('maintained array containers cannot replace prices or remove exclusions',()=>{
  for(const kind of ['tariffs','bands','exclusions']) {
    const tariffs=structuredClone(admissionTariffs);let called=false;
    if(kind==='tariffs')tariffs.map=()=>{called=true;return[];};
    if(kind==='bands')tariffs[0].bands.find=()=>{called=true;return{label:'substituted',cents:0};};
    if(kind==='exclusions')tariffs[0].exclusions[Symbol.iterator]=function*(){called=true;};
    assert.throws(()=>calculateAdmissionBudget(tariffs,task),kind);assert.equal(called,false,kind);
  }
});
test('accessor indices and custom prototypes are rejected without executing getters',()=>{
  let called=false;const ages=[30,13];Object.defineProperty(ages,1,{get(){called=true;return 13;}});
  assert.throws(()=>calculateAdmissionBudget(admissionTariffs,{...task,travelerAges:ages}));assert.equal(called,false);
  const inherited=[30,13];Object.setPrototypeOf(inherited,Object.create(Array.prototype));
  assert.throws(()=>calculateAdmissionBudget(admissionTariffs,{...task,travelerAges:inherited}));
});
test('ordinary arrays retain complete-party arithmetic and detached result ownership',()=>{
  const before=JSON.stringify(admissionTariffs),result=calculateAdmissionBudget(admissionTariffs,task);
  const rows=Object.fromEntries(result.records.map(r=>[r.id,r]));
  assert.deepEqual(['science-center','crayola','mennello','leu','gatorland'].map(id=>rows[id].publishedAdmissionSubtotalCents),[10700,9297,1900,4000,10497]);
  assert.deepEqual(result.travelerAges,task.travelerAges);
  for(let size=1;size<=14;size++) {
    const ages=Array(size).fill(30),out=calculateAdmissionBudget(admissionTariffs,{...task,travelerAges:ages});
    assert.deepEqual(out.travelerAges,ages);assert.ok(out.records.every(r=>r.guests.length===size));
  }
  result.records[0].exclusions.length=0;result.travelerAges.length=0;assert.equal(JSON.stringify(admissionTariffs),before);
  assert.equal(task.travelerAges.length,4);
});

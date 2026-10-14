import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,readFile,readdir,stat,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {readFileSync} from 'node:fs';
import {POINT_URL,USER_AGENT,parsePoint,parseForecast,cacheExpiry,forecastAt,requestJson,collectNwsPilot} from './nws-forecast-pilot.mjs';
const now='2026-10-14T12:00:00Z';
const headers={date:'Wed, 14 Oct 2026 12:00:00 GMT','cache-control':'public, max-age=300',age:null,expires:'Wed, 14 Oct 2026 12:05:00 GMT'};
const pointData=()=>({type:'Feature',geometry:{type:'Point',coordinates:[-98.4936,29.4241]},properties:{gridId:'EWX',gridX:126,gridY:53,timeZone:'America/Chicago',forecast:'https://api.weather.gov/gridpoints/EWX/126,53/forecast',relativeLocation:{properties:{city:'San Antonio',state:'TX',distance:{unitCode:'wmoUnit:m',value:100}}}}});
const point=()=>parsePoint(pointData());
const forecast=()=>({type:'Feature',properties:{units:'us',generatedAt:'2026-10-14T11:59:00Z',updateTime:'2026-10-14T11:00:00Z',validTimes:'2026-10-14T11:00:00Z/P1D',periods:[{number:1,startTime:'2026-10-14T11:00:00Z',endTime:'2026-10-14T23:00:00Z',isDaytime:true,temperature:80,temperatureUnit:'F',probabilityOfPrecipitation:{unitCode:'wmoUnit:percent',value:null},shortForecast:'Synthetic forecast'},{number:2,startTime:'2026-10-14T23:00:00Z',endTime:'2026-10-15T11:00:00Z',isDaytime:false,temperature:{value:20,unitCode:'wmoUnit:degC'},probabilityOfPrecipitation:{unitCode:'wmoUnit:percent',value:30},shortForecast:'Synthetic nighttime forecast'}]}});
const parse=d=>parseForecast(d,{point:point(),sourceUrl:point().forecast_url,retrievedAt:now,headers});
const response=(data,options={})=>new Response(JSON.stringify(data),{status:200,headers:Object.fromEntries(Object.entries({'content-type':'application/geo+json',...headers}).filter(([,v])=>v!==null)),...options});
test('pure: exact fixed point and discovered EWX grid are bound without following arbitrary links',()=>{
  assert.equal(point().forecast_url,'https://api.weather.gov/gridpoints/EWX/126,53/forecast');
  for(const change of [p=>p.geometry.coordinates[0]=0,p=>p.properties.gridId='TOP',p=>p.properties.forecast+='?units=si',p=>p.properties.relativeLocation.properties.city='Austin',p=>p.properties.timeZone='UTC',p=>p.properties.gridX=-1,p=>p.properties.relativeLocation.properties.distance.value=10001]){const d=pointData();change(d);assert.throws(()=>parsePoint(d));}
});
test('pure: null rain stays unknown, typed temperatures preserve units and source clocks remain distinct',()=>{
  const r=parse(forecast());assert.equal(r.periods[0].precipitation_probability_percent,null);assert.deepEqual(r.periods[1].temperature,{value:20,unit:'C'});assert.equal(r.generated_at,'2026-10-14T11:59:00Z');assert.equal(r.source_updated_at,'2026-10-14T11:00:00Z');assert.equal(r.expires_at,'2026-10-14T12:05:00.000Z');assert.equal(r.fact_dates_renewed,false);assert.equal(r.public_publish_authorized,false);assert.equal(r.safety_or_suitability_assessed,false);
  const d=forecast();delete d.properties.periods[0].probabilityOfPrecipitation;assert.equal(parse(d).periods[0].precipitation_probability_percent,null);
});
test('pure: unsupported fields, stale/future data, wrong periods and unit variants hold',()=>{
  for(const change of [p=>p.updateTime='2026-10-14T01:00:00Z',p=>p.generatedAt='2026-10-14T13:00:00Z',p=>p.units='invented',p=>p.periods=[],p=>p.periods[0].endTime=p.periods[0].startTime,p=>p.periods[0].temperatureUnit='K',p=>p.periods[0].probabilityOfPrecipitation.value=101,p=>p.periods[0].probabilityOfPrecipitation.unitCode='wmoUnit:mm',p=>p.periods[1].number=1,p=>p.periods[1].startTime='2026-10-15T00:00:00Z',p=>p.validTimes='2026-10-14T11:00:00Z/P2W',p=>p.periods[0].startTime='2026-02-30T11:00:00Z']){const d=forecast();change(d.properties);assert.throws(()=>parse(d));}
  assert.throws(()=>parseForecast(forecast(),{point:point(),sourceUrl:point().forecast_url+'?x=1',retrievedAt:now,headers}));
  const invalidClock=forecast();invalidClock.properties.periods[1].startTime='2026-10-14T24:00:00Z';assert.throws(()=>parse(invalidClock));
  const fractionalLegacy=forecast();fractionalLegacy.properties.periods[0].temperature=80.5;assert.throws(()=>parse(fractionalLegacy));
  const emptyTime=forecast();emptyTime.properties.validTimes='2026-10-14T11:00:00Z/P1DT';assert.throws(()=>parse(emptyTime));
});
test('pure: cache accounts for Age plus response delay and rejects absent invalid duplicate no-cache expiry',()=>{
  assert.equal(cacheExpiry({...headers,age:'100'},now,'2026-10-14T11:59:50Z'),'2026-10-14T12:03:10.000Z');
  for(const h of [{...headers,age:'400'},{...headers,age:'x'},{...headers,'cache-control':null},{...headers,'cache-control':'max-age=300, max-age=abc'},{...headers,'cache-control':'max-age=300, max-age=600'},{...headers,'cache-control':'no-cache, max-age=300'},{...headers,'cache-control':'no-store, max-age=300'},{...headers,expires:'garbage'},{...headers,date:'Thu, 15 Oct 2026 12:00:00 GMT'}])assert.throws(()=>cacheExpiry(h,now));
  assert.equal(cacheExpiry({...headers,'cache-control':'max-age=604800',expires:null},now),'2026-10-14T18:00:00.000Z');
});
test('pure: date lookup is unknown before capture after expiry or outside periods, never observed weather',()=>{
  const r=parse(forecast());assert.match(forecastAt(r,now).state,/forecast-candidate-not-actual/);assert.equal(forecastAt(r,'2026-10-14T12:05:00Z').period,null);assert.equal(forecastAt(r,'2026-10-14T11:59:00Z').period,null);assert.equal(forecastAt(r,'2026-10-30T12:00:00Z').period,null);
  const mutated=forecastAt(r,now);mutated.period.temperature.value=0;assert.equal(r.periods[0].temperature.value,80);
});
test('pure: exact fake request uses identifying UA manual redirect and bounded JSON provenance',async()=>{
  let calls=0;const r=await requestJson(POINT_URL,{fetcher:async(url,options)=>{calls++;assert.equal(url,POINT_URL);assert.equal(options.redirect,'manual');assert.equal(options.headers['User-Agent'],USER_AGENT);return response(pointData());},now:()=>now});assert.equal(calls,1);assert.equal(r.state,'retrieved-json-candidate');assert.match(r.body_sha256,/^[a-f0-9]{64}$/);assert.equal(r.body_retained,false);
  await assert.rejects(()=>requestJson('https://example.com/',{fetcher:()=>{throw Error('must not call');}}));
});
test('pure: denial redirect challenge size malformed JSON and fetch errors hold once without leaked body',async()=>{
  for(const make of [()=>new Response('private challenge',{status:403}),()=>new Response('',{status:302,headers:{location:POINT_URL}}),()=>new Response('private challenge',{headers:{'content-type':'text/html'}}),()=>new Response('badjson',{headers:{'content-type':'application/json'}}),()=>new Response('large',{headers:{'content-type':'application/json','content-length':'300001'}}),()=>{throw Error('private-error');}]){let calls=0;const r=await requestJson(POINT_URL,{fetcher:async()=>{calls++;return make();},now:()=>now});assert.equal(calls,1);assert.match(r.state,/^held-/);assert.equal(r.payload,null);assert.ok(!JSON.stringify(r).includes('private'));}
});
test('pure: successful retrieval clock includes body consumption for conservative cache age',async()=>{
  const clocks=['2026-10-14T11:59:50Z',now,'2026-10-14T12:00:10Z'];
  const r=await requestJson(POINT_URL,{fetcher:async()=>response(pointData()),now:()=>clocks.shift()});
  assert.equal(r.started_at,'2026-10-14T11:59:50Z');assert.equal(r.retrieved_at,'2026-10-14T12:00:10Z');
  assert.equal(cacheExpiry({...headers,age:'100'},r.retrieved_at,r.started_at),'2026-10-14T12:03:10.000Z');
});
test('pure: dated real pilot metadata remains separate from synthetic controls public facts and weekly readiness',()=>{
  const r=JSON.parse(readFileSync(new URL('../docs/research/nws-forecast-pilot-2026-10-14.json',import.meta.url)));
  assert.equal(r.native_pilot.requests,2);assert.equal(r.request_accounting.native_point_requests,1);assert.equal(r.request_accounting.native_forecast_requests,1);assert.equal(r.request_accounting.native_schema_requests,2);
  assert.ok(r.native_pilot.packets.every(p=>p.http_status===200&&p.state==='parsed-candidate'&&p.body_retained===false&&/^[a-f0-9]{64}$/.test(p.body_sha256)));
  const [pointPacket,forecastPacket]=r.native_pilot.packets;assert.equal(pointPacket.url,POINT_URL);assert.equal(forecastPacket.url,`https://api.weather.gov/gridpoints/EWX/${pointPacket.normalized.grid_x},${pointPacket.normalized.grid_y}/forecast`);
  assert.equal(forecastPacket.normalized.period_count,14);assert.equal(forecastPacket.normalized.expires_at,'2026-10-14T13:03:12.000Z');
  assert.equal(r.native_pilot.private_report_sha256,'7724486404eaa8c8311681f494baf3c5e60e849739cc7e696cee28676be63b02');assert.equal(r.native_pilot.source_facts_published,false);assert.equal(r.native_pilot.weekly_baseline_advanced,false);assert.equal(r.native_pilot.public_current_forecast_claim,false);assert.match(r.native_pilot.clock_limitation,/responseheaders before body/);
  assert.equal(r.synthetic_controls.transport,'FAKE_RESPONSE_ONLY');assert.equal(r.maintainer_proxy.actual_parents,false);assert.ok(Object.values(r.unchanged).every(x=>x===true));
});
test('journal: durable exact two-attempt fake pilot writes exclusive private evidence and refuses replay',async()=>{
  const parent=await mkdtemp(join(tmpdir(),'nws-test-')),root=join(parent,'pilot');
  try{let calls=0;const r=await collectNwsPilot({journalDir:root,review:{action_id:'FT-IMP-166',decision:'PASS',manifest_sha256:'a'.repeat(64)},fetcher:async url=>{calls++;return response(url===POINT_URL?pointData():forecast());},now:()=>now});assert.equal(calls,2);assert.equal(r.requests,2);assert.ok(r.packets.every(p=>p.state==='parsed-candidate'));assert.equal(r.body_archives_retained,false);assert.equal(r.weekly_baseline_advanced,false);assert.equal((await readdir(root)).length,5);assert.equal((await stat(join(root,'report.json'))).mode&0o777,0o600);assert.equal(JSON.parse(await readFile(join(root,'report.json'))).packets[1].value.fact_dates_renewed,false);await assert.rejects(()=>collectNwsPilot({journalDir:root,review:{action_id:'FT-IMP-166',decision:'PASS',manifest_sha256:'a'.repeat(64)},fetcher:()=>{calls++;throw Error();},now:()=>now}));assert.equal(calls,2);}finally{await rm(parent,{recursive:true,force:true});}
});
test('journal: held point stops before forecast and missing preliminary review performs no transport',async()=>{
  const parent=await mkdtemp(join(tmpdir(),'nws-test-'));try{let calls=0;const options={journalDir:join(parent,'held'),review:{action_id:'FT-IMP-166',decision:'PASS',manifest_sha256:'a'.repeat(64)},fetcher:async()=>{calls++;return new Response('',{status:403});},now:()=>now};const r=await collectNwsPilot(options);assert.equal(calls,1);assert.equal(r.requests,1);assert.equal(r.packets[0].state,'held-http');await assert.rejects(()=>collectNwsPilot({...options,journalDir:join(parent,'bad'),review:null}));assert.equal(calls,1);}finally{await rm(parent,{recursive:true,force:true});}
});
